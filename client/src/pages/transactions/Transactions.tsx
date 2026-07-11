import { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import api from '../../api/axios'
import type { Transaction } from '../../types'
import EditTransaction from '../../components/modals/EditTransaction'


const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null)
  
  const fetchTransactions = useCallback(async () => {
    try {
      const res = await api.get('/transactions')
      setTransactions(res.data.transactions)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`)
      fetchTransactions()
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = transactions.filter(t =>
    t.description?.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
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
      {/* sm screens */}
      <div className='md:hidden flex flex-col gap-5'>
       
       {/* search */}
        <div className="flex items-center gap-0.5 border border-[#3a6ea5] rounded-lg px-3 py-2 bg-white dark:bg-[#0F172A] w-full">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by description or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="outline-none text-sm bg-transparent w-full text-[#2e2e2e] dark:text-white"
          />
          
        </div>
        <h2 className="text-2xl font-semibold text-[#2e2e2e] dark:text-[#fafafa]">All Transactions</h2>
      </div>

      {/* md screens */}
      <div className='hidden md:flex items-center justify-between'>
       <h2 className="text-2xl font-semibold text-[#2e2e2e] dark:text-[#fafafa]">All Transactions</h2>
       {/* search */}
        <div className="flex items-center gap-0.5 border border-[#3a6ea5] rounded-lg px-3 py-2 bg-white dark:bg-[#0F172A] md:w-70 lg:w-100">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by description or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="outline-none text-sm bg-transparent w-full text-[#2e2e2e] dark:text-white"
          />
        </div>
      </div>
      

      {/* list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-10">No transactions found.</p>
        ) : (
          filtered.map(t => (
            <div
              key={t._id}
              className="bg-white dark:bg-[#0F172A] rounded-lg border border-[#3a6ea5]/70 p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-sm text-[#2e2e2e] dark:text-white">{t.description}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.category}</p>
                <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className={`font-semibold text-sm ${t.type === 'income' ? 'text-[#34C759]' : 'text-[#FD1010]'}`}>
                  {t.type === 'income' ? '+' : '-'}₦{t.amount.toLocaleString()}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditTransaction(t)}
                    className="text-[#2e2e2e] dark:text-[#fafafa]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-[#FD1010]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {editTransaction && (
        <EditTransaction
          transaction={editTransaction}
          onClose={() => setEditTransaction(null)}
          onSuccess={() => {
            setEditTransaction(null)
            fetchTransactions()
          }}
        />
      )}

    </div>
  )
}

export default Transactions
