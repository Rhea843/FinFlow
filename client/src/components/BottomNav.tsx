import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, ArrowLeftRight, ChartNoAxesCombined, ChevronDown } from 'lucide-react'
import { FaPiggyBank } from "react-icons/fa6";


const BottomNav = () => {
  const [transactionsOpen, setTransactionsOpen] = useState(false)

  const navItem = 'flex flex-col items-center gap-1 text-xs font-medium transition-colors'
  const active = 'text-[#3A6EA5] bg-blue-50 dark:bg-blue-950 dark:text-blue-400'
  const inactive = 'text-slate-600 hover:text-[#3A6EA5] hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#fafafa] dark:bg-[#0F172A] border-t border-slate-100 dark:border-slate-800 flex items-center justify-around px-2 py-3">
      <NavLink to="/dashboard" className={({ isActive }) => `${navItem} ${isActive ? active : inactive}`}>
        <LayoutDashboard className="w-5 h-5" />
        Dashboard
      </NavLink>

      <NavLink to="/analytics" className={({ isActive }) => `${navItem} ${isActive ? active : inactive}`}>
          <ChartNoAxesCombined className="w-5 h-5" />
          Analytics
      </NavLink>

      <NavLink to="/goals" className={({ isActive }) => `${navItem} ${isActive ? active : inactive}`}>
        <FaPiggyBank className="w-5 h-5" />
        Savings
      </NavLink>
      <div>
        <button
         onClick={() => setTransactionsOpen(!transactionsOpen)}
         className={`${navItem} ${inactive} w-full justify-between`}
        >
         <div className="flex items-center gap-3">
            <div className='flex flex-col gap-1'>
             <ArrowLeftRight className="w-5 h-5" />
              Transactions
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${transactionsOpen ? 'rotate-180' : ''}`} />
            </div>
            
        </button>
      </div>
      
    </nav>

  )
}

export default BottomNav
