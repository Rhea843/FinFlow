import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../../api/axios'
import type { Transaction } from '../../../types/index.ts'

type Filter = 'daily' | 'monthly' | 'yearly'


const AnalyticsChart = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [filter, setFilter] = useState<Filter>('monthly')

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await api.get<{ transactions: Transaction[] }>('/transactions')
        setTransactions(res.data.transactions)
      } catch (err) {
        console.error(err)
      }
    }
    fetchChart()
  }, [])

  const getData = () => {
    if (filter === 'monthly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      return months.map((month, i) => {
        const monthTrans = transactions.filter(t => new Date(t.date).getMonth() === i)

        return {
          label: month,
          income: monthTrans.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
          expenses: monthTrans.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        }
      })
    }
    
        if (filter === 'daily') {
      // last 30 days
      const days: { label: string; income: number; expenses: number }[] = []
      for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const dayTrans = transactions.filter(t => {
          const d = new Date(t.date)
          return d.toDateString() === date.toDateString()
        })
        days.push({
          label: dateStr,
          income: dayTrans.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
          expenses: dayTrans.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        })
      }
      return days
    }

      if (filter === 'yearly') {
      // last 5 years
      const years: { label: string; income: number; expenses: number }[] = []
      const currentYear = new Date().getFullYear()
      for (let y = currentYear - 4; y <= currentYear; y++) {
        const yearTrans = transactions.filter(t => new Date(t.date).getFullYear() === y)
        years.push({
          label: String(y),
          income: yearTrans.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
          expenses: yearTrans.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        })
      }
      return years
    }

    return []
  
  }
  
  const data = getData()

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-xl p-6 border border-[#3a6ea5]/70 shadow-[0_4px_4px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between ">
        <div className="flex flex-col justify-start gap-2 mb-2">
          <h3 className="text-xl font-semibold text-[#2e2e2e] dark:text-[#fafafa]">Analytics</h3>
          <div className="flex items-center gap-2">
            <div className='flex items-center gap-1'>
              <span className="w-3 h-3 inline-block rounded-full bg-[#22c55e] mr-1"></span>
              <span className="text-xs md:text-sm text-[#2e2e2e] dark:text-[#fafafa]">Income</span>
            </div>
            <div className='flex items-center gap-1'>
              <span className="w-3 h-3 inline-block rounded-full bg-[#ef4444] mr-1"></span>
              <span className="text-xs md:text-sm text-[#2e2e2e] dark:text-[#fafafa]">Expenses</span>
            </div>
          </div>
        </div>

        <div className="flex items-center -mt-12">
          <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} className="bg-[#3a6ea5]/20 dark:bg-[#1E293B] text-[#2e2e2e] dark:text-[#fafafa] border border-[#3a6ea5]/70 md:px-4 p-1.5 md:py-2 text-sm outline-none focus:border-[#3A6EA5] rounded-md cursor-pointer">
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
  
      <div className="bg-[#3a6ea5]/20 dark:bg-[#1E293B] rounded-lg p-3">
        <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3a6ea5" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={filter === 'daily' ? 4 : 0} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₦${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}  />
          <Tooltip
           formatter={(value) => typeof value === 'number' ? `₦${value.toLocaleString()}` : value}
           contentStyle={{backgroundColor: '#fafafa', border: '1px solid #3a6ea5', borderRadius: '8px', }}
          />
          
          <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      </div>
      
    </div>
  )
}

export default AnalyticsChart
