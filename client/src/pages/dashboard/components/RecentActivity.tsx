import {  Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'  
import type { Transaction, RecentActivities } from '../../../types/index.ts'
import EditTransaction from '../../../components/modals/EditTransaction.tsx'


type Props = {
  activities: RecentActivities[]
  onEdit: (activity: RecentActivities) => void
  onDelete: (activity: RecentActivities) => void
} 

const RecentActivity = ({ activities, onEdit, onDelete  }: Props) => {
  const navigate = useNavigate() 
  const [search, setSearch] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

   const filtered = activities.filter(activity =>
    activity.title.toLowerCase().includes(search.toLowerCase()) ||
    activity.category.toLowerCase().includes(search.toLowerCase())
  )
  const displayed = filtered.slice(0, 15)


  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-xl p-6 border border-[#3a6ea5]/70 shadow-[0_4px_4px_rgba(0,0,0,0.3)] overflow-x-auto">

      <div className="flex flex-col gap-3 mb-5">

        <div className="flex items-center gap-2 border border-[#3a6ea5] rounded-lg px-3 py-2">

          <Search className="w-4 h-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none text-sm bg-transparent w-full text-[#2e2e2e] dark:text-white"
          />

        </div>

        <div className="flex justify-between items-center -mb-3">

          <h2 className="font-semibold text-lg text-[#2e2e2e] dark:text-white">
            Recent Activity
          </h2>

          <button
             onClick={() => navigate('/transactions')}
            className="text-xs text-[#2e2e2e] dark:text-[#fafafa]"
          >
             See All
          </button>

        </div>

      </div>

      <div className="space-y-1 max-h-90 overflow-y-auto scroll-area">
        {displayed.map((activity) => (

          <div
            key={activity._id}
            className="bg-[#3a6ea5]/20 rounded-lg border border-[#3a6ea5]/70 p-1"
          >

            <div className="flex justify-between p-2">
             <div>
                <p className="font-medium text-md text-[#2e2e2e] dark:text-white">
                  {activity.title}
                </p>
                <p className="text-sm text-[#2e2e2e]/80 dark:text-white/80">
                  {activity.category}
                </p>
                {/* show goal name for deposits and withdrawals */}
                {(activity.type === 'deposit' || activity.type === 'withdrawal') && activity.goalName && (
                  <p className="text-xs text-[#2e2e2e]/80 dark:text-white/80">
                    {activity.goalName}
                  </p>
                )}
                <p className="text-sm text-slate-400">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>

             
             <div className="flex flex-col items-end gap-2">
                <p className={`font-semibold text-sm ${
                  activity.type === 'income' ? 'text-[#34C759]'
                  : activity.type === 'expense' ? 'text-[#FD1010]'
                  : activity.type === 'deposit' ? 'text-[#34c759]'
                  : 'text-[#FD1010]'
                }`}>
                  {activity.type === 'income' ? '+' : activity.type === 'expense' ? '-' : activity.type === 'deposit' ? '🏦+' : '🏦-'}
                  ₦{activity.amount.toLocaleString()}
                </p>

                {(activity.type === 'income' || activity.type === 'expense') && (
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(activity)} className="text-xs text-[#2e2e2e] dark:text-[#fafafa]">Edit</button>
                    <button onClick={() => onDelete(activity)} className="text-xs text-red-500">Delete</button>
                  </div>
                )}

                {(activity.type === 'deposit' || activity.type === 'withdrawal') && (
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(activity)} className="text-xs text-[#2e2e2e] dark:text-[#fafafa]">Edit Goal</button>
                    <button onClick={() => onDelete(activity)} className="text-xs text-red-500">Delete Goal</button>
                  </div>
                )}
              </div>

            </div>

          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center py-6">
            No activities found.
          </p>
        )}

      </div>

      {selectedTransaction && (
        <EditTransaction
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onSuccess={() => setSelectedTransaction(null)}
        />
      )}

    </div>
  )
}

export default RecentActivity
