import axios from 'axios'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'
import useAuth from "../../hooks/useAuth"
import type{ AuthResponse } from "../../types"
import {Eye, EyeClosed} from 'lucide-react'
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate()
  const {login} = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)

   try {
      const { data } = await api.post<AuthResponse>('/auth/login', form)
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Something went wrong')
      } else {
        setError('Something went wrong')
      }
    }
  }

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

        <h1 className="md:text-3xl text-2xl font-bold text-[#3A6EA5] mb-4 text-center">Welcome back!</h1>

         <div className='bg-white md:max-w-2xl max-w-xs mx-auto rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.3)] px-6 md:px-12 py-6'>

          {/* social buttons */}
         <div className="flex gap-4 mb-6 w-full">
            <button className="flex-1 flex items-center justify-center border border-[#3a6ea5]/65 rounded-md py-3 md:px-18 px-8 text-center hover:bg-slate-50 transition-colors">
              <FaApple className="w-5 h-5 text-[#2e2e2e]" />
            </button>
            <button className="flex-1 flex items-center justify-center border border-[#3a6ea5]/65 rounded-md py-3 md:px-18 px-8 text-center hover:bg-slate-50 transition-colors">
              <FcGoogle className="w-5 h-5"/>
            </button>
         </div>

         <div className="flex items-center gap-3 mb-4 w-full">
            <hr className="flex-1 border-[#2e2e2e]" />
            <span className="text-[#2e2e2e] text-sm whitespace-nowrap">Or sign in with</span>
            <hr className="flex-1 border-[#2e2e2e]" />
         </div>

         {/* form fields */}
          <div className="flex flex-col gap-4 w-full">

            <div>
             <label className="text-sm text-[#2e2e2e] mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-[#2e2e2e] rounded-md px-4 py-3 text-sm outline-none focus:border-[#3A6EA5] transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-[#2e2e2e] mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-[#2e2e2e] rounded-md px-4 py-3 text-sm outline-none focus:border-[#3A6EA5] transition-colors pr-10"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeClosed  className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
           </div>
          </div>

          <div className="mt-2 flex flex-col gap-3 w-full ">
          <p className="text-sm text-[#2e2e2e]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#3A6EA5] font-medium hover:underline">
              Sign up
            </Link>
          </p>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full  bg-[#3A6EA5] text-white py-3 rounded-lg font-medium hover:bg-[#1E3A5F] transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        

        </div>
      </div>
    </div>
  )
}

export default Login

