import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { LogOut } from 'lucide-react'
import useAuth from '../../hooks/useAuth'

interface Props {
  onClose: () => void
}

const LogoutModal = ({ onClose }: Props) => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return createPortal (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">

        {/* icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-[#FD1010]/10 flex items-center justify-center">
            <LogOut className="w-7 h-7 text-[#FD1010]" />
          </div>
        </div>

        {/* text */}
        <h3 className="text-lg font-semibold text-[#2e2e2e] dark:text-[#fafafa] text-center mb-2">
          Log out
        </h3>
        <p className="text-sm text-slate-400 text-center mb-6">
          Are you sure you want to log out of your FinFlow account?
        </p>

        {/* buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-[#3a6ea5] text-[#2e2e2e] dark:text-[#fafafa] py-3 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 bg-[#FD1010] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#c70000] transition-colors"
          >
            Log out
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}

export default LogoutModal