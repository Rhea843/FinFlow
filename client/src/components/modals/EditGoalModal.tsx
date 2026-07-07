import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import api from '../../api/axios'
import axios from 'axios'
import type { SavingGoal } from '../../types'

interface Props {
  goalId: string
  onClose: () => void
  onSuccess: () => void
}

const EditGoalModal = ({ goalId, onClose, onSuccess }: Props) => {
   const [form, setForm] = useState({
      name: '',
      targetAmount: '',
      deadline: '',
    })
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
    const fetchGoal = async () => {
      try {
        const { data } = await api.get<SavingGoal>(`/goals/${goalId}`)
        setForm({
          name: data.name,
          targetAmount: String(data.targetAmount),
          deadline: data.deadline ? data.deadline.split('T')[0] : '',
        })
      } catch (err) {
        console.error(err)
      } finally {
        setFetching(false)
      }
    }
    fetchGoal()
  }, [goalId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }


  const handleSubmit = async () => {
    if (!form.name || !form.targetAmount) {
      return setError('Please fill in all required fields')
    }
    setError('')
    setLoading(true)
    try {
      await api.put(`/goals/${goalId}`, {
        name: form.name,
        targetAmount: Number(form.targetAmount),
        deadline: form.deadline || null,
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
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Edit Goal</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-[#3A6EA5] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">Goal Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#3A6EA5] transition-colors bg-transparent text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">Target Amount (₦)</label>
              <input
                type="number"
                name="targetAmount"
                value={form.targetAmount}
                onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#3A6EA5] transition-colors bg-transparent text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">
                Deadline <span className="text-slate-400">(optional)</span>
              </label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#3A6EA5] transition-colors bg-transparent text-slate-800 dark:text-white"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 mt-2">
              <button
                onClick={onClose}
                className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 py-3 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-[#3A6EA5] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#1E3A5F] transition-colors disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditGoalModal
