import { useEffect, useState, useCallback } from 'react'
import api from '../../api/axios'
import type { Transaction, SavingGoal, SavingTransaction } from '../../types'
import AnalyticsChart from '../dashboard/components/AnalyticsChart'
import ExpensesByCategory from './ExpensesByCategory'
import IncomeBreakdown from './IncomeBreakdown'
import SavingsBar from './SavingBar'


const Analytics = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<SavingGoal[]>([])
  const [savingTransactions, setSavingTransactions] = useState<SavingTransaction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
  try {
    const [transRes, goalsRes, savingTransRes] = await Promise.all([
      api.get('/transactions'),
      api.get('/goals'),
      api.get('/saving-transactions'),
    ])
    setTransactions(transRes.data.transactions)
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
  return (
    <div className="flex flex-col gap-3">
      

      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* left - main charts */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <AnalyticsChart />
          <SavingsBar savingTransactions={savingTransactions} />
          
        </div>
        {/* right - breakdown charts */}
        <div className="flex flex-col gap-3">
          <ExpensesByCategory transactions={transactions} />
          <IncomeBreakdown transactions={transactions} />
        </div>
         
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:hidden">
        {/* left - main charts */}
        <div className="flex flex-col gap-6">
          <AnalyticsChart />
          <SavingsBar savingTransactions={savingTransactions} />
          <ExpensesByCategory transactions={transactions} />
          <IncomeBreakdown transactions={transactions} />
        </div>

      </div>

      

    </div>
  )
}

export default Analytics
