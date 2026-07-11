import { useState, useEffect, useCallback } from 'react'
import { Search, ArrowLeft } from 'lucide-react'
import api from '../../api/axios'
import type { SavingTransaction } from '../../types'
import { useNavigate } from 'react-router-dom'

const SavingsTransactions = () => {
  const navigate = useNavigate()  
  const [transactions, setTransactions] = useState<SavingTransaction[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await api.get('/saving-transactions')
      setTransactions(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const filtered = transactions.filter(t => {
    const goalName = typeof t.goal === 'object' ? t.goal.name : ''
    return (
      goalName.toLowerCase().includes(search.toLowerCase()) ||
      t.note?.toLowerCase().includes(search.toLowerCase())
    )
  })

  const totalDeposited = transactions
    .filter(t => t.type === 'deposit')
    .reduce((s, t) => s + t.amount, 0)

  const totalWithdrawn = transactions
    .filter(t => t.type === 'withdrawal')
    .reduce((s, t) => s + t.amount, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-[#3A6EA5] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* header with back button */}
    <div className="flex items-center gap-3">
      <button
        onClick={() => navigate('/goals')}
        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-[#2e2e2e] dark:text-[#fafafa] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <h2 className="text-xl font-semibold text-[#2e2e2e] dark:text-[#fafafa]">Savings Transactions</h2>
    </div>

      {/* totals */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-[#0F172A] rounded-lg border border-[#34C759]/50 p-4">
          <p className="text-xs text-slate-400 mb-1">Total Deposited</p>
          <p className="font-bold text-[#34C759]">+₦{totalDeposited.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-[#0F172A] rounded-lg border border-[#FD1010]/50 p-4">
          <p className="text-xs text-slate-400 mb-1">Total Withdrawn</p>
          <p className="font-bold text-[#FD1010]">-₦{totalWithdrawn.toLocaleString()}</p>
        </div>
      </div>

      {/* search */}
      <div className="flex items-center gap-2 border border-[#3a6ea5] rounded-lg px-3 py-2 bg-white dark:bg-[#0F172A]">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by goal or note..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="outline-none text-sm bg-transparent w-full text-[#2e2e2e] dark:text-white"
        />
      </div>

      {/* list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-10">No saving transactions found.</p>
        ) : (
          filtered.map(t => (
            <div
              key={t._id}
              className={`bg-white dark:bg-[#0F172A] rounded-lg border p-4 flex items-center justify-between ${
                t.type === 'deposit' ? 'border-[#34C759]/50' : 'border-[#FD1010]/50'
              }`}
            >
              <div>
                <p className="font-medium text-sm text-[#2e2e2e] dark:text-white capitalize">
                  {t.type === 'deposit' ? '🏦 Deposit' : '🏦 Withdrawal'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Goal: {typeof t.goal === 'object' ? t.goal.name : 'N/A'}
                </p>
                {t.note && <p className="text-xs text-slate-400 italic">{t.note}</p>}
                <p className="text-xs text-slate-400">
                  {new Date(t.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className={`font-semibold text-sm ${
                t.type === 'deposit' ? 'text-[#34C759]' : 'text-[#FD1010]'
              }`}>
                {t.type === 'deposit' ? '+' : '-'}₦{t.amount.toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SavingsTransactions