import { useState, useRef } from 'react'
import { Camera, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'
import type { User } from '../../types'

const Profile = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user?.name || '')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (name !== user?.name) {
        const { data } = await api.put<{ user: User }>('/users/profile', { name })
        updateUser(data.user)
      }

      if (file) {
        const formData = new FormData()
        formData.append('profilePic', file)
        const { data } = await api.put<{ user: User }>('/users/profile/pic', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        updateUser(data.user)
      }

      setSuccess('Profile updated successfully')
      setFile(null)
      setPreview(null)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Something went wrong')
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">

      {/* header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-[#2e2e2e] dark:text-[#fafafa] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-semibold text-[#2e2e2e] dark:text-[#fafafa]">Profile</h2>
      </div>

      {/* profile pic card */}
      <div className="bg-white dark:bg-[#0F172A] rounded-xl p-6 border border-[#3a6ea5]/70 shadow-[0_4px_6px_rgba(0,0,0,0.3)] flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src={preview || user?.profilePic || `https://ui-avatars.com/api/?name=${user?.name}&background=3A6EA5&color=fff&size=128`}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-[#3a6ea5]/30"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 bg-[#3A6EA5] text-white p-2 rounded-full hover:bg-[#1E3A5F] transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="text-center">
          <p className="font-semibold text-[#2e2e2e] dark:text-[#fafafa] text-lg">{user?.name}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
        </div>
        {preview && (
          <p className="text-xs text-[#34C759]">New photo selected, save to apply</p>
        )}
      </div>

      {/* edit form */}
      <div className="bg-white dark:bg-[#0F172A] rounded-xl p-6 border border-[#3a6ea5]/70 shadow-[0_4px_6px_rgba(0,0,0,0.3)] flex flex-col gap-4">
        <h3 className="font-semibold text-[#2e2e2e] dark:text-[#fafafa]">Personal Information</h3>

        <div>
          <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-[#3a6ea5] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#3A6EA5] transition-colors bg-transparent text-[#2e2e2e] dark:text-[#fafafa]"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">Account Status</label>
          <div className={`flex items-center gap-2 px-4 py-3 border rounded-lg ${
            user?.isVerified
              ? 'border-[#34C759]/50 bg-[#34C759]/10'
              : 'border-[#FD1010]/50 bg-[#FD1010]/10'
          }`}>
            <span className={`w-2 h-2 rounded-full ${user?.isVerified ? 'bg-[#34C759]' : 'bg-[#FD1010]'}`} />
            <span className={`text-sm font-medium ${user?.isVerified ? 'text-[#34C759]' : 'text-[#FD1010]'}`}>
              {user?.isVerified ? 'Verified' : 'Not Verified'}
            </span>
        </div>
        </div>

        <div>
          <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">Member Since</label>
          <input
            type="text"
            value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
            disabled
            className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-[#34C759] text-sm">{success}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#3A6EA5] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#1E3A5F] transition-colors disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* danger zone */}
      <div className="bg-white dark:bg-[#0F172A] rounded-xl p-6 border border-[#FD1010]/30 shadow-[0_4px_6px_rgba(0,0,0,0.3)] flex flex-col gap-3">
        <button className="w-full border border-[#FD1010] text-[#FD1010] py-3 rounded-lg text-sm font-medium hover:bg-[#FD1010]/10 transition-colors">
           Delete Account
        </button>
        <p className="text-sm text-slate-400">Once you delete your account all your data will be permanently removed.</p>
        
      </div>

    </div>
  )
}

export default Profile