import { useState, useEffect, useCallback, useMemo } from 'react'
import useAuth from '../../hooks/useAuth'
import api from '../../api/axios'
import AddExpenseModal from '../../components/modals/AddExpenseModal.tsx'
import AddIncomeModal from '../../components/modals/AddIncomeModal.tsx'
import AddSavingModal from '../../components/modals/AddSavingsModal.tsx'
import SummaryCard from './components/SummaryCard.tsx'
import RecentActivity from './components/RecentActivity.tsx'
import AnalyticsChart from './components/AnalyticsChart.tsx'
import EditTransaction from '../../components/modals/EditTransaction.tsx'
import EditGoalModal from '../../components/modals/EditGoalModal.tsx'
import ExpensesByCategory from '../Analytics/ExpensesByCategory.tsx'
import SavingGoals from './components/SavingGoal.tsx'
import type { TransactionSummary, SavingGoal, RecentActivities, Transaction, SavingTransaction } from '../../types/index.ts'









const Dashboard = () => {
  const { user } = useAuth()

  const [expenseModal, setExpenseModal] = useState(false)

  const [incomeModal, setIncomeModal] = useState(false)

  const [savingModal, setSavingModal] = useState(false)

  const [lastMonth, setLastMonth] = useState<TransactionSummary | null>(null)

  const [summary, setSummary] = useState<TransactionSummary | null>(null)

  const [goals, setGoals] = useState<SavingGoal[]>([])

  const [editGoalId, setEditGoalId] = useState<string | null>(null)

  const [deleteLoading, setDeleteLoading] = useState(false)

  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null)

  const [loading, setLoading] = useState(true)

  const [savingTransactions, setSavingTransactions] = useState<SavingTransaction[]>([])


  const greeting= () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  

const fetchData = useCallback(async () => {
  try {
    const [allTransRes, goalsRes, savingTransRes] = await Promise.all([
      api.get<TransactionSummary>('/transactions'),
      api.get('/goals'),
      api.get('/saving-transactions'),
    ])

    // filter this month on frontend
    const now = new Date()
    const thisMonthTrans = allTransRes.data.transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const lastMonthTrans = allTransRes.data.transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === now.getMonth() - 1 && d.getFullYear() === now.getFullYear()
    })

    const calcSummary = (trans: typeof thisMonthTrans, savings: number) => ({
      count: trans.length,
      income: trans.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expenses: trans.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      balance: trans.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) - trans.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      savings,
      transactions: trans,
    })

    const totalSavings = goalsRes.data.goals.reduce((s: number, g: { savedAmount: number }) => s + g.savedAmount, 0)

    setSummary(calcSummary(thisMonthTrans, totalSavings))
    setLastMonth(calcSummary(lastMonthTrans, 0))
    setGoals(goalsRes.data.goals)
    setSavingTransactions(savingTransRes.data)
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}, [])

  useEffect(() => {
   fetchData()
  }, [fetchData])

  const handleSuccess = () => {
   fetchData()
  }

  const handleEdit = (activity: RecentActivities) => {
    if (activity.type === 'income' || activity.type === 'expense') {
     const transaction = summary?.transactions.find(t => t._id === activity._id)
      if (transaction) setEditTransaction(transaction)
    } else {
      setEditGoalId(activity._id)
    }
  }

  const handleDelete = async (activity: RecentActivities) => {
   setDeleteLoading(true)
  try {
    if (activity.type === 'income' || activity.type === 'expense') {
      await api.delete(`/transactions/${activity._id}`)
    } else {
      await api.delete(`/goals/${activity._id}`)
    }
    fetchData()
  } catch (err) {
    console.error(err)
  } finally {
    setDeleteLoading(false)
  }
}

  const activities = useMemo<RecentActivities[]>(() => {
    const transactionActivities = summary?.transactions.map((t) => ({
      _id: t._id,
      type: t.type,
      title: t.description,
      category: t.category,
      amount: t.amount,
      date: t.date,
    })) ?? []

    const savingActivities = goals.map((goal) => ({
      _id: goal._id,
      type: 'deposit' as const,
      title: goal.name,
      category: 'Saving Goal',
      amount: goal.targetAmount,
      date: goal.createdAt,       
      goalId: goal._id,
    }))

    const savingTransactionActivities = savingTransactions.map((st) => ({
      _id: st._id,
      type: st.type as 'deposit' | 'withdrawal',
      title: st.note || (st.type === 'deposit' ? 'Fund Added' : 'Withdrawal'),
      category: 'Saving Goal',
      amount: st.amount,
      date: st.createdAt,
      goalName: typeof st.goal === 'object' ? st.goal.name : '',
   }))

    return [...transactionActivities, ...savingActivities, ...savingTransactionActivities].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    }, [summary, goals, savingTransactions])

  return(
    <div className="flex flex-col gap-4">
     
     {/* greeting + action buttons */}
     <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
       <div>
          <h2 className="text-xl font-semibold text-[#2e2e2e] dark:text-[#fafafa]">
            {greeting()}, {user?.name}
          </h2>
          <p className="text-sm text-slate-400">{today}</p>
        </div>

        <div className="flex items-center md:gap-3 gap-2">
          {/* add expense btn */}
          <button
           onClick={() => setExpenseModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md  bg-[#FD1010] text-[#fafafa] text-sm font-medium  transition-colors"
          >
            Add Expense
          </button>

          {/* add income btn */}
          <button
          onClick={() => setIncomeModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md  bg-[#34C759] text-[#fafafa] text-sm  font-medium transition-colors"
          >
          Add Income
          </button>
          
          {/* add saving btn */}

          <button
          onClick={() => setSavingModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#3A6EA5] text-[#fafafa] text-sm  font-medium  transition-colors"
          >
          Add Saving
          </button>
        </div>
     </div>

     {/* modals */}
      {expenseModal && <AddExpenseModal onClose={() => setExpenseModal(false)} onSuccess={handleSuccess} />}
      {incomeModal && <AddIncomeModal onClose={() => setIncomeModal(false)} onSuccess={handleSuccess} />}
      {savingModal && <AddSavingModal onClose={() => setSavingModal(false)} onSuccess={handleSuccess} />}
      

        {editTransaction && (
          <EditTransaction
            transaction={editTransaction}
            onClose={() => setEditTransaction(null)}
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

     {/* summary cards */}
      <div>
        <SummaryCard summary={summary} lastMonth={lastMonth} />
      </div>

     
     <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-x-2 ">
        <div className="lg:col-span-2 flex flex-col lg:gap-2 gap-4">
          <AnalyticsChart />
          <RecentActivity activities={activities} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
        
        <div className="hidden lg:flex flex-col gap-2">
          <SavingGoals goals={goals.slice(0, 4)} onSuccess={fetchData} />
          <ExpensesByCategory transactions={summary?.transactions ?? []} />
        </div>
        
      </div>
      
     
      {/* mobile view*/} 
      <div className='md:hidden'>
       
       <RecentActivity activities={activities} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

    </div>
  )
}
export default Dashboard