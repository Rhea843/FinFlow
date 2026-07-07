import { useState } from 'react'
import { X } from 'lucide-react'
import axios from 'axios'
import api from '../../api/axios.ts'
import type { Transaction } from '../../types/index.ts'

interface Props {
  transaction: Transaction
  onClose: () => void
  onSuccess: () => void
}


const EditTransaction = ({ onClose, onSuccess, transaction }: Props) => {
  

  const [form, setForm] = useState({
    description: transaction.description,
    category: transaction.category,
    amount: String(transaction.amount),
    date: transaction.date.split("T")[0],
    type: transaction.type,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.description || !form.category || !form.amount) {
      return setError('Please fill in all fields')
    }
    setError('')
    setLoading(true)
    try {
      await api.put(`/transactions/${transaction._id}`, {
        ...form,
        amount: Number(form.amount),
      })
      onSuccess()
      onClose()
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Something went wrong')
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  // dynamic colors based on type
  const isIncome = form.type === 'income'
  const focusBorder = isIncome ? 'focus:border-[#34C759]' : 'focus:border-[#FD1010]'
  const btnColor = isIncome
    ? 'bg-[#34C759] hover:bg-[#2aad4a]'
    : 'bg-[#FD1010] hover:bg-[#c70000]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex items-center gap-3 mb-6">
  
        
      </div>

      {/* form */} 
      <div className="bg-white dark:bg-[#0F172A] rounded-xl p-6 border border-[#3a6ea5]/70 shadow-[0_4px_6px_rgba(0,0,0,0.3)] flex flex-col gap-4 w-full max-w-md mx-4">

        <button
          onClick={onClose}
          className="p-2 rounded-lg border border-[#3a6ea5] text-slate-[#2e2e2e] dark:text-[#fafafa] transition-colors w-9 text-left"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center">
          <span className="text-2xl font-semibold capitalize">
            Edit {form.type}
          </span>
        </div>

        <div>
          <label className="text-sm text-[#2e2e2e] dark:text-[#fafafa] mb-1 block">Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className={`w-full border border-[#3a6ea5] rounded-lg px-4 py-3 text-sm outline-none ${focusBorder} transition-colors bg-transparent text-[#2e2e2e] dark:text-[#fafafa]`}
          />
        </div>

        <div>
          <label className="text-sm text-[#2e2e2e] dark:text-[#fafafa] mb-1 block">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full border border-[#3a6ea5] rounded-lg px-4 py-3 text-sm outline-none ${focusBorder} transition-colors bg-transparent text-[#2e2e2e] dark:text-[#fafafa]`}
          />
        </div>

        <div>
          <label className="text-sm text-[#2e2e2e] dark:text-[#fafafa] mb-1 block">Amount (₦)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className={`w-full border border-[#3a6ea5] rounded-lg px-4 py-3 text-sm outline-none ${focusBorder} transition-colors bg-transparent text-[#2e2e2e] dark:text-[#fafafa]`}
          />
        </div>

        <div>
          <label className="text-sm text-[#2e2e2e] dark:text-[#fafafa] mb-1 block">Date</label>
          <input
            type="date"
            name="transaction.date"
            value={form.date}
            onChange={handleChange}
            className={`w-full border border-[#3a6ea5] rounded-lg px-4 py-3 text-sm outline-none ${focusBorder} transition-colors bg-transparent text-[#2e2e2e] dark:text-[#fafafa]`}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 border border-[#3a6ea5] text-[#2e2e2e] dark:text-[#fafafa] py-3 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 ${btnColor} text-[#fafafa] py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-60`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
     </div>
    </div>
  )
}

export default EditTransaction
