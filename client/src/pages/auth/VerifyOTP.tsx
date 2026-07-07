import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../../api/axios'
import axios from 'axios'

const VerifyOTP = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userId, email } = location.state || {}

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // countdown timer
 useEffect(() => {
  if (timer === 0) {
    setCanResend(true)
    return
  }
  const interval = setInterval(() => setTimer(t => t - 1), 1000)
  return () => clearInterval(interval)
}, [timer])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // only numbers
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // only one digit
    setOtp(newOtp)
    // auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async () => {
    const otpCode = otp.join('')
    if (otpCode.length < 6) return setError('Please enter the complete OTP')
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/verify-otp', { userId, otp: otpCode })
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await api.post('/auth/resend-otp', { userId })
      setTimer(30)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to resend OTP')
      } else {
        setError('Something went wrong')
      }
}
  }

  // mask email
  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_: string, a: string, b: string, c: string) =>
        a + '*'.repeat(b.length) + c)
    : ''


  return (
    <div className="min-h-screen pt-22.5 relative" style={{
      background: `
      linear-gradient(
        240deg,
        rgba(58,110,165,1) 0%,
        rgba(58,110,165,0.01) 95%
      ),
      linear-gradient(
        260deg,
        #fafafa 0%,
        #f4f6f8 50%,
        #e8eef5 80%,
        #d6e3f0 100%
      )
     `,
     }}>
      <div className="absolute top-5 left-1/2 -translate-x-1/2">
        <h1 className="text-[#fafafa] md:text-4xl text-2xl font-bold tracking-wide text-center">FinFlow</h1>
        <p className="text-[#fafafa] text-sm text-center whitespace-nowrap">"A clearer picture of your money."</p>
      </div>
      <div className="bg-[#E9F1FA] min-h-[calc(100vh-90px)] md:rounded-tr-[183px] rounded-tr-[60px] py-4 flex flex-col items-center justify-center">

        <h1 className="md:text-3xl text-2xl font-bold text-[#3A6EA5] mb-4 text-center">Enter your verification code</h1>
           {/* CARD */} 
         <div className='bg-white md:max-w-2xl max-w-xs mx-auto rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.3)] px-6 md:px-12 py-6'>
           <p className="text-[#2e2e2e] text-sm text-center mb-4 ">
             Please enter the verification code sent to your gmail({maskedEmail})
           </p>


           {/* OTP input fields */} 

           <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className="w-10 h-12 text-center text-lg font-bold border-2 border-slate-200 rounded-lg outline-none focus:border-[#3A6EA5] transition-colors"
                />
              ))}
           </div>

           {/* resend otp */}
             
            <p className="text-center text-sm text-[#2e2e2e] mb-6">
              Didn't receive OTP?{' '}
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-[#3A6EA5] font-medium hover:underline"
                >
                  Resend
                </button>
              ) : (
                <span className="text-[#3A6EA5] font-medium">
                  Resend ({String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')})
                </span>
              )}
            </p>

            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#3A6EA5] text-white py-3 rounded-lg font-medium hover:bg-[#1E3A5F] transition-colors disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            <p className="text-center text-sm text-slate-600 mt-4">
              Have an account?{' '}
              <Link to="/login" className="text-[#3A6EA5] font-medium hover:underline">
                Sign in
              </Link>
            </p>
         </div>
      </div>
    </div>
  )
}
export default VerifyOTP
