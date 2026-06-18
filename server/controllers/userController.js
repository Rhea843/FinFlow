import cloudinary from '../config/cloudinary.js'
import User from '../models/Users.js'

//get profile
export const getProfile = async (req, res) => {
  try{
    res.status(200).json(req.user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
//update profile
export const updateProfile = async(req, res) => {
  try{
    const { name } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select('-password')
    res.status(200).json({ message: 'Profile updated', user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    // convert buffer to base64
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'finflow/profile_pics',
      public_id: `user_${req.user.id}`,
      overwrite: true,
    })

    // save cloudinary url to user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: result.secure_url },
      { new: true }
    ).select('-password')

    res.status(200).json({ message: 'Profile picture updated', user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}