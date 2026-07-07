import useAuth from '../hooks/useAuth'
import {Menu, X} from 'lucide-react'


interface TopbarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}


const Topbar = ({ sidebarOpen, setSidebarOpen }: TopbarProps) => {
  const { user } = useAuth()

  return (
    <div className='bg-white dark:bg-[#0F172A] p-4 border-b border-[#3a6ea5]/20 flex items-center justify-between'> 
      <div className='lg:hidden flex items-center gap-2'>
        <button
         className=" p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
         onClick={() => setSidebarOpen(!sidebarOpen)}
        >
         {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
        <h1 className="bg-linear-to-r from-[rgba(58,110,165,0.8)] via-[rgba(154,180,207,0.78)] to-[rgba(58,110,165,0.75)] dark:text-[#fafafa] bg-clip-text text-transparent  text-xl font-bold tracking-wide">
        FinFlow
        </h1>
      </div>

      <h1 className="hidden lg:block bg-linear-to-r from-[rgba(58,110,165,0.8)] via-[rgba(154,180,207,0.78)] to-[rgba(58,110,165,0.75)] dark:text-[#fafafa] bg-clip-text text-transparent text-2xl font-bold tracking-wide">
        FinFlow
      </h1>

      {/* user info */}
      <div className="flex items-center gap-3">
        <img
          src={user?.profilePic || `https://ui-avatars.com/api/?name=${user?.name}&background=3A6EA5&color=fff`}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="text-left">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">{user?.name}</p>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>
        
      </div>
     
    </div>
  )
}

export default Topbar
