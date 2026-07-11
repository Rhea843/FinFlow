import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import type { SavingGoal } from '../../types'
import AddFundModal from '../../components/modals/AddFundModal'
import WithdrawFundModal from '../../components/modals/WithdrawFundModal'
import EditGoalModal from '../../components/modals/EditGoalModal'
import AddSavingModal from '../../components/modals/AddSavingsModal'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)

const AllGoals = () => {
  const navigate = useNavigate()
  const [goals, setGoals] = useState<SavingGoal[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [addFundGoal, setAddFundGoal] = useState<SavingGoal | null>(null)
  const [withdrawGoal, setWithdrawGoal] = useState<SavingGoal | null>(null)
  const [editGoalId, setEditGoalId] = useState<string | null>(null)
  const [addGoalModal, setAddGoalModal] = useState(false)

  const fetchGoals = useCallback(async () => {
    try {
      const res = await api.get('/goals')
      setGoals(res.data.goals)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/goals/${id}`)
      fetchGoals()
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = goals.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-[#3A6EA5] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">

      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/goals')}
            className="p-2 rounded-lg border border-[#2e2e2e]/70 dark:border-slate-700 text-[#2e2e2e] dark:text-[#fafafa] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-semibold text-[#2e2e2e] dark:text-[#fafafa]">All Saving Goals</h2>
        </div>
        <button
          onClick={() => setAddGoalModal(true)}
          className="bg-[#3A6EA5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1E3A5F] transition-colors"
        >
          + Add Goal
        </button>
      </div>

      {/* search */}
      <div className="flex items-center gap-2 border border-[#3a6ea5] rounded-lg px-3 py-2 bg-white dark:bg-[#0F172A]">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search goals..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="outline-none text-sm bg-transparent w-full text-[#2e2e2e] dark:text-white"
        />
      </div>

      {/* goals list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-10">No goals found.</p>
        ) : (
          filtered.map(goal => {
            const percent = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100)
            return (
              <div
                key={goal._id}
                className="bg-white dark:bg-[#0F172A] rounded-xl border border-[#3a6ea5]/70 shadow-[0_2px_4px_rgba(0,0,0,0.2)] p-5 flex flex-col gap-3"
              >
                {/* goal name + target */}
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#2e2e2e] dark:text-[#fafafa]">{goal.name}</p>
                  <p className="text-sm font-medium text-[#2e2e2e] dark:text-[#fafafa]">
                    {fmt(goal.targetAmount)}
                  </p>
                </div>

                {/* progress bar */}
                <div className="relative w-full bg-slate-200 dark:bg-slate-700 rounded-full h-7">
                  <div
                    className="bg-[#3A6EA5] h-7 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#2e2e2e] dark:text-[#fafafa]">
                    {percent}%
                  </span>
                </div>

                {/* saved + deadline */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    {fmt(goal.savedAmount)} saved
                  </p>
                  {goal.deadline && (
                    <p className="text-xs text-slate-400">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  )}
                  {goal.isCompleted && (
                    <span className="text-xs text-[#34C759] font-medium">✓ Completed</span>
                  )}
                </div>

                {/* actions */}
                <div className="flex items-center justify-between gap-2">
                  <div className='flex items-center justify-center gap-3'>
                    <button
                      onClick={() => setAddFundGoal(goal)}
                      className="flex-1 text-xs bg-[#34C759] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#2aad4a] transition-colors"
                    >
                      Add Fund
                    </button>
                    <button
                      onClick={() => setWithdrawGoal(goal)}
                      className="flex-1 text-xs bg-[#FD1010] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#c70000] transition-colors"
                      disabled={goal.savedAmount === 0}
                    >
                      Withdraw
                    </button>
                  </div>
                  <div className='flex items-center justify-center gap-3'>
                    <button
                      onClick={() => setEditGoalId(goal._id)}
                      className="px-4 text-xs border border-[#3a6ea5] text-[#3A6EA5] p-2 rounded-lg font-medium hover:bg-[#3a6ea5]/10 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(goal._id)}
                      className="px-4 text-xs border border-[#FD1010] text-[#FD1010] py-2 rounded-lg font-medium hover:bg-[#FD1010]/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  
                  
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* modals */}
      {addFundGoal && (
        <AddFundModal
          goal={addFundGoal}
          onClose={() => setAddFundGoal(null)}
          onSuccess={fetchGoals}
        />
      )}
      {withdrawGoal && (
        <WithdrawFundModal
          goal={withdrawGoal}
          onClose={() => setWithdrawGoal(null)}
          onSuccess={fetchGoals}
        />
      )}
      {editGoalId && (
        <EditGoalModal
          goalId={editGoalId}
          onClose={() => setEditGoalId(null)}
          onSuccess={fetchGoals}
        />
      )}
      {addGoalModal && (
        <AddSavingModal
          onClose={() => setAddGoalModal(false)}
          onSuccess={fetchGoals}
        />
      )}
    </div>
  )
}

export default AllGoals