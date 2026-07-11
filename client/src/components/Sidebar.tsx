import { useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import type { Dispatch, SetStateAction } from "react";
import {ChartNoAxesCombined, LayoutDashboard, ArrowLeftRight, Settings, HelpCircle, LogOut, ChevronDown, Moon, Sun} from 'lucide-react'
import { FaPiggyBank } from "react-icons/fa6";
import useAuth from '../hooks/useAuth.ts'
import { useTheme } from '../context/ThemeContext.tsx';
import LogoutModal from '../components/modals/LogoutModal'

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

const Sidebar = ({ sidebarOpen, setSidebarOpen}: SidebarProps) => {


  const navigate = useNavigate()
  const { logout } = useAuth()
  const [transactionsOpen, setTransactionsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const [logoutModal, setLogoutModal] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }


  const navItem = 'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors'
  const active = 'text-[#3A6EA5] bg-blue-50 dark:bg-blue-950 dark:text-blue-400'
  const inactive = 'text-slate-600 hover:text-[#3A6EA5] hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'


  return (
    <>

     {/* overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

     <aside className={`
  fixed lg:static top-16 lg:top-auto left-0 z-50
  flex flex-col md:w-64 w-50
  h-[calc(100vh-4rem)] lg:h-auto lg:self-stretch
  bg-white dark:bg-[#0F172A]
  border-r border-[#3a6ea5]/20
  px-4 py-6
  text-[#2e2e2e] dark:text-[#fafafa]
  transition-transform duration-300
  overflow-y-auto
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
  lg:translate-x-0
`}>
      <nav className="flex flex-col gap-1 flex-1">
       <NavLink to="/dashboard" className={({ isActive }) => `${navItem} ${isActive ? active : inactive}`}>
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink to="/analytics" className={({ isActive }) => `${navItem} ${isActive ? active : inactive}`}>
          <ChartNoAxesCombined className="w-5 h-5" />
          Analytics
        </NavLink>

        {/* transactions with dropdown menu */}
        <div>
          <button
            onClick={() => setTransactionsOpen(!transactionsOpen)}
            className={`${navItem} ${inactive} w-full justify-between`}
          >
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="w-5 h-5" />
              Transactions
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${transactionsOpen ? 'rotate-180' : ''}`} />
          </button>

          {transactionsOpen && (
            <div className="ml-8 mt-1 flex flex-col gap-1">
              <NavLink to="/transactions" className={({ isActive }) => `${navItem} ${isActive ? active : inactive} text-xs`}>
                All Transactions
              </NavLink>
              <NavLink to="/transactions/income" className={({ isActive }) => `${navItem} ${isActive ? active : inactive} text-xs`}>
               Income
              </NavLink>
              <NavLink to="/transactions/expense" className={({ isActive }) => `${navItem} ${isActive ? active : inactive} text-xs`}>
               Expense
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/goals" className={({ isActive }) => `${navItem} ${isActive ? active : inactive}`}>
          <FaPiggyBank className="w-5 h-5" />
          Savings 
        </NavLink>
      </nav>

      {/* bottom nav */}

      <div className="flex flex-col gap-1 mt-auto">
       <div>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`${navItem} ${inactive} w-full justify-between`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" />
              Settings
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
          </button>

          {settingsOpen && (
  <div className="ml-8 mt-1 flex flex-col gap-1">
    <NavLink to="/profile" className={({ isActive }) => `${navItem} ${isActive ? active : inactive} text-xs`}>
      Profile
    </NavLink>

    {/* dark mode toggle with label */}
        <div className="flex flex-col gap-2 items-center -ml-12 px-4 py-2">
          <span className="text-xs text-slate-600 dark:text-slate-400">{isDark ? 'Dark Mode': 'Light Mode'}</span>
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-full p-1">
            <button
              onClick={() => !isDark && toggleTheme()}
              className={`p-2 rounded-full transition-colors ${isDark ? 'bg-slate-800 text-blue-400' : 'text-slate-400'}`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => isDark && toggleTheme()}
              className={`p-1.5 rounded-full transition-colors ${!isDark ? 'bg-blue-50 text-[#3A6EA5]' : 'text-slate-500'}`}
            >
              <Sun className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    )}

          <button className={`${navItem} ${inactive} w-full`}>
            <HelpCircle className="w-5 h-5" />
            Help
          </button>
          <button onClick={() => setLogoutModal(true)}
            className={`${navItem} ${inactive} w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950`}
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>

          {logoutModal && (
            <LogoutModal onClose={() => setLogoutModal(false)} />
          )}
       </div>
     </div>
      
    </aside>
    </>
  )
}

export default Sidebar
