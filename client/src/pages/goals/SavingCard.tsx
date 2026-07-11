import type { SavingGoal } from '../../types'

interface Props {
  goals: SavingGoal[]
  onAddFund?: () => void
  onWithdraw?: () => void
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n)

const SavingGoalCard = ({ goals }: Props) => {
  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0)
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0)
  const percent = totalTarget > 0 ? Math.min(Math.round((totalSaved / totalTarget) * 100), 100) : 0

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-xl p-6 border border-[#3a6ea5]/70 shadow-[0_4px_4px_rgba(0,0,0,0.3)] w-full flex flex-col gap-2">
    
     <p className="text-base font-semibold text-[#2e2e2e] dark:text-[#fafafa]">Total Savings</p>
      <p className="text-sm text-[#2e2e2e] dark:text-[#fafafa]">
        {fmt(totalSaved)} / {fmt(totalTarget)}
      </p>
      <div className="relative w-full bg-slate-200 dark:bg-slate-700 rounded-full h-8">
        <div
          className="bg-[#3A6EA5] h-8 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#2e2e2e] dark:text-[#fafafa]">
          {percent}%
        </span>
      </div>

       <p className="text-xs text-slate-400">{goals.length} active goal{goals.length !== 1 ? 's' : ''}</p>
    
    </div>
  
    
  )
}

export default SavingGoalCard