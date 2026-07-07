import { useState } from 'react'
import { X } from 'lucide-react'
import api from '../../api/axios'
import axios from 'axios'
import type { SavingGoal } from '../../types'

interface Props {
  goal: SavingGoal
  onClose: () => void
  onSuccess: () => void
}

const WithdrawFundModal = ({ goal, onClose, onSuccess }: Props) => {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const percent = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100)

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      return setError('Amount must be greater than 0')
    }
    if (Number(amount) > goal.savedAmount) {
      return setError(`Amount exceeds saved amount of ₦${goal.savedAmount.toLocaleString()}`)
    }
    setError('')
    setLoading(true)
    try {
      await api.patch(`/goals/${goal._id}/withdraw`, {
        amount: Number(amount),
        note,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#0F172A] border border-[#3a6ea5] rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">

        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Withdraw Fund</h3>
            <p className="text-xs text-slate-400 mt-0.5">{goal.name}</p>
          </div>
          <button onClick={onClose} className="text-[#2e2e2e] dark:hover:text-[#fafafa]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* progress */}
        <div className="bg-[#FD1010]/10 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#2e2e2e] dark:text-[#fafafa]">Progress</p>
            <p className="text-xs font-medium text-[#FD1010]">{percent}%</p>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
            <div
              className="bg-[#FD1010] h-2 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#34C759]">₦{goal.savedAmount.toLocaleString()} saved</p>
            <p className="text-xs text-[#2e2e2e] dark:text-[#fafafa]">₦{goal.targetAmount.toLocaleString()} target</p>
          </div>
          <p className="text-xs text-[#FD1010] mt-1">Max withdrawal: ₦{goal.savedAmount.toLocaleString()}</p>
        </div>

        {/* form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-[#2e2e2e] dark:text-[#fafafa] mb-1 block">Amount (₦)</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full border border-[#3a6ea5]  rounded-lg px-4 py-3 text-sm outline-none focus:border-[#FD1010] transition-colors bg-transparent text-[#2e2e2e] dark:text-[#fafafa]"
            />
          </div>
          <div>
            <label className="text-sm text-[#2e2e2e] dark:text-[#fafafa] mb-1 block">
              Note <span className="text-[#2e2e2e] dark:text-[#fafafa]">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Emergency withdrawal"
              value={note}
              onChange={e => setNote(e.target.value)}
             className="w-full border border-[#3a6ea5]  rounded-lg px-4 py-3 text-sm outline-none focus:border-[#FD1010] transition-colors bg-transparent text-[#2e2e2e] dark:text-[#fafafa]"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-[#3a6ea5] text-[#2e2e2e] dark:text-[#fafafa] py-3 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#FD1010] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#c70000] transition-colors disabled:opacity-60"
          >
            {loading ? 'Withdrawing...' : 'Withdraw'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WithdrawFundModal