import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { Transaction } from '../../types'

type Filter = 'monthly' | 'yearly'

interface Props {
  transactions: Transaction[]
}



const IncomeBar = ({ transactions }: Props) => {
  const [filter, setFilter] = useState<Filter>('monthly')

  const now = new Date()

  const getData = () => {
    if (filter === 'monthly') {
      // last 8 months
      const months = []
      for (let i = 7; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        const monthTrans = transactions.filter(t => {
          const d = new Date(t.createdAt)
          return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()
        })
        const income = monthTrans
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)

          months.push({
            label,
            income,
          })
      }
      return months
    }
    
    // yearly - last 5 years
    const years = []
    for (let i = 4; i >= 0; i--) {
      const year = now.getFullYear() - i
      const yearTrans = transactions.filter(t => new Date(t.createdAt).getFullYear() === year)
      const income = yearTrans
       .filter(t => t.type === 'income')
       .reduce((sum, t) => sum + t.amount, 0)

        years.push({
          label: String(year),
          income,
        })
    }
    return years
  }
  const data = getData()
  const totalIncome = transactions
  .filter(t => t.type === 'income')
  .reduce((sum, t) => sum + t.amount, 0)


  return (
  <div className="bg-white dark:bg-[#0F172A] rounded-xl p-6 border border-[#3a6ea5]/70 shadow-[0_4px_4px_rgba(0,0,0,0.3)]">
    <div className="flex items-center justify-between mb-2">
     <h3 className="font-semibold text-[#2e2e2e] dark:text-[#fafafa] mb-6">
        Total income in the past {filter === 'monthly' ? '8 months' : '5 years'}
     </h3>

      {/* filter */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        {(['monthly', 'yearly'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-white dark:bg-slate-700 text-[#3A6EA5] shadow-sm'
                : 'text-[#2e2e2e] dark:text-[#fafafa]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
   </div>

    {/* totals */}
   
    <div className="flex items-center gap-1.5 text-sm text-[#2e2e2e] dark:text-[#fafafa] mb-3 -mt-4">
      <span className="w-2 h-2 rounded-full bg-[#34C759]" />
      Total Income: <span  className='font-semibold'>₦{totalIncome.toLocaleString()}</span> 
    </div>
  
      
      
      {data.every(d => d.income === 0 ) ? (
        <p className="text-sm text-slate-400 text-center py-8">No income transactions yet</p>
      ) : (
        <div className="bg-[#3a6ea5]/20 dark:bg-[#1E293B] rounded-lg p-2 ">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 5, right: 2, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a6ea5" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#3a6ea5', fontWeight: 600, }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#3a6ea5', fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `₦${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
             <Tooltip
                contentStyle={{
                  backgroundColor: '#fafafa', 
                  border: '1px solid #3a6ea5', 
                  borderRadius: '8px',
                }}
                labelStyle={{
                  color: '#2e2e2e',
                  fontWeight: 600,
                }}
                
                formatter={(value) => [
                  typeof value === 'number' ? `₦${value.toLocaleString()}` : value,
                 
                ]}
                cursor={false}
              />
              <Bar dataKey="income" fill="#34C759" radius={[3, 3, 0, 0]} barSize={30}  />
            
            </BarChart>
          </ResponsiveContainer>
        </div>
        

      )}
    </div>
  )
}

export default IncomeBar
