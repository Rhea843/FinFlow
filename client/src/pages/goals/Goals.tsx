import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'
import SavingCard from './SavingCard'
import RecentSaving from './RecentSaving'
import SavingBar from '../Analytics/SavingBar'
import SavingGoals from '../dashboard/components/SavingGoal'
import AddSavingModal from '../../components/modals/AddSavingsModal'
import type { SavingGoal, SavingTransaction, RecentActivities } from '../../types'
import EditGoalModal from '../../components/modals/EditGoalModal'


const Goals = () => {
  const [goals, setGoals] = useState<SavingGoal[]>([])
  const [savingTransactions, setSavingTransactions] = useState<SavingTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [addGoalModal, setAddGoalModal] = useState(false)
  const [editGoalId, setEditGoalId] = useState<string | null>(null)


  const fetchData = useCallback(async () => {
    try {
      const [goalsRes, savingTransRes] = await Promise.all([
        api.get('/goals'),
        api.get('/saving-transactions'),
      ])
      setGoals(goalsRes.data.goals)
      setSavingTransactions(savingTransRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

   if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-[#3A6EA5] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const savingActivities: RecentActivities[] = savingTransactions.map(st => ({
  _id: st._id,
  type: st.type as 'deposit' | 'withdrawal',
  title: st.note || (st.type === 'deposit' ? 'Fund Added' : 'Withdrawal'),
  category: 'Saving Goal',
  amount: st.amount,
  date: st.createdAt,
  goalName: typeof st.goal === 'object' ? st.goal.name : '',
}))

const handleEdit = (activity: RecentActivities) => {
  const st = savingTransactions.find(t => t._id === activity._id)
  if (st) {
    const goalId = typeof st.goal === 'object' ? st.goal._id : st.goal
    setEditGoalId(goalId)
  }
}

const handleDelete = async (activity: RecentActivities) => {
  const st = savingTransactions.find(t => t._id === activity._id)
  if (!st) return
  try {
    const goalId = typeof st.goal === 'object' ? st.goal._id : st.goal
    await api.delete(`/goals/${goalId}`)
    fetchData()
  } catch (err) {
    console.error(err)
  }
}

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#2e2e2e] dark:text-[#fafafa]">Savings</h2>
       
        <button
          onClick={() => setAddGoalModal(true)}
          className="bg-[#3A6EA5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1E3A5F] transition-colors"
        >
          + Add Goal
        </button>
      </div>
      <div className='flex'>
        <SavingCard goals={goals} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <SavingBar savingTransactions={savingTransactions} />
          <RecentSaving
            activities={savingActivities}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <div>
          
          <SavingGoals goals={goals} onSuccess={fetchData} />
        </div>
      </div>

      {addGoalModal && (
        <AddSavingModal
          onClose={() => setAddGoalModal(false)}
          onSuccess={fetchData}
        />
      )}

      {editGoalId && (
        <EditGoalModal
          goalId={editGoalId}
          onClose={() => setEditGoalId(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  )
}

export default Goals
