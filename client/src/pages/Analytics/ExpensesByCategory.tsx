import { useState } from 'react'
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts'
import type { Transaction } from '../../types'


interface Props {
  transactions: Transaction[]
}


type Filter = 'daily' | 'weekly' | 'monthly'

const COLORS = ['#FFCC00', '#FF8D28', '#FF383C', '#34C759', '#00C0E8', '#0088FF']


const ExpensesByCategory = ({ transactions }: Props) => {
  const [filter, setFilter] = useState<Filter>('monthly')
  
  const now = new Date()

  const filtered = transactions.filter(t => {
    const date = new Date(t.date)
    if (filter === 'daily') return date.toDateString() === now.toDateString()
    if (filter === 'weekly') {
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 7)
      return date >= weekAgo
    }
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).filter(t => t.type === 'expense')

  

  const categoryMap: Record<string, number> = {}
    filtered.forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount
  })

  const data = Object.entries(categoryMap).map(([name, value], i) => ({ name, value, fill: COLORS[i % COLORS.length] }))
  const total = filtered.reduce((s, t) => s + t.amount, 0)

  const dateLabel = () => {
    if (filter === 'daily') return `Today, ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    if (filter === 'weekly') {
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 7)
      return `${weekAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    }
    return `1 ${now.toLocaleDateString('en-US', { month: 'short' })} - ${now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`
  }

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-xl p-6 border border-[#3a6ea5]/70 shadow-[0_4px_4px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col items-center">
        <div className="flex items-center mb-2">
          <h3 className="font-semibold text-[#2e2e2e] dark:text-[#fafafa]">
            Expense By Category
          </h3>
        </div>

  

        <div className="flex items-center gap-1 bg-[#3a6ea5]/20 dark:bg-slate-800 rounded-lg p-1 mb-4">
          {(['daily', 'weekly', 'monthly'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-white dark:bg-slate-700 text-[#2e2e2e] dark:text-[#fafafa] shadow-sm'
                  : 'text-slate-500 dark:text-slate-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <p className="text-xs text-[#2e2e2e] dark:text-[#fafafa] mb-3">
          {dateLabel()}
        </p>
      </div>

  {data.length === 0 ? (
    <p className="text-[#2e2e2e] dark:text-[#fafafa] text-sm text-center py-8">No expense data yet</p>
  ) : (
        <>
         <div className="relative">
           <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                >
                </Pie>
                 <Tooltip formatter={(value) => typeof value === 'number' ? `₦${value.toLocaleString()}` : value} />
            </PieChart>
           </ResponsiveContainer>

           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-sm font-bold text-[#2e2e2e] dark:text-[#fafafa]">₦{total.toLocaleString()}</p>
              <p className="text-xs text-slate-400">Spent this month</p>
            </div>
         </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.map((entry, i) => (
              <div key={i} className="flex items-center gap-1 text-xs text-[#2e2e2e] dark:text-[#fafafa]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {entry.name}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ExpensesByCategory
