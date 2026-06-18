import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createTransport }  from 'nodemailer';
import User from '../models/Users.js';

//Generate OTP
const generateOTP = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
}

//Send OTP Email
const sendOTPEmail = async(email, otp) => {
  try{
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    })

    const info = await transporter.sendMail({
      from: `"FinFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your FinFlow account',
      html:`
        <p>Hello,</p>
        <p>Your verification code is: <h1 style="letter-spacing: 4px">${otp}</h1></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not create an account, please ignore this email.</p>
      `
    })

    console.log('Email sent:', info.response)
  } catch (error) {
   console.error('Email error:', error.message)
  }
  
}

//Register
export const register = async (req, res) => {
  try{
    const {name, email, password} = req.body;

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message: 'Email already in use'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({name, email, password: hashedPassword, otp, otpExpiry});

    //send OTP email
    await sendOTPEmail(email, otp)


    res.status(201).json({
      message: 'Registration successful. Check your email for the OTP.', 
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//verify otp
export const verifyOTP = async (req, res) => {
  try{
    const{ userId, otp } = req.body;

    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({message: 'User not found'});
    }

    if(user.otp !== otp){
      return res.status(400).json({message: 'Invalid OTP'});
    }

    if( user.otpExpiry < Date.now()){
      return res.status(400).json({message: 'OTP has expired'});
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({message: 'Account verified successfully'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//login
export const login = async (req, res) => {
  try{
    const {email, password} = req.body;

    //check if user exists
    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({message: 'Invalid email'});
    }

    //check if verified
    if(!user.isVerified){
      return res.status(403).json({message: 'Please verify your email first'});
    }

    //check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({message: 'Invalid credentials'});
    }

    //generate token
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{
      expiresIn: '7d',
    });

    res.status(200).json({message: 'Login successful', token,
      user: { id: user._id, name: user.name, email: user.email, profilePic: user.profilePic },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//Resend otp
export const resendOTP = async (req, res) => {
  try{
    const {userId} = req.body;

    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({message: 'User not found'});
    }

    if(user.isVerified){
      return res.status(400).json({message: 'User is already verified'});
    }

    const otp = generateOTP();
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    

    user.otp = otp
    user.otpExpiry = otpExpiry
    await user.save()

    await sendOTPEmail(user.email, otp)

    res.status(200).json({message: 'OTP resent successfully'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}