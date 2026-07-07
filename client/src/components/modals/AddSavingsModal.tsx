import { useState } from 'react'
import { X } from 'lucide-react'
import api from '../../api/axios'
import axios from 'axios'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

const AddSavingModal = ({ onClose, onSuccess }: Props) => {
  const [form, setForm] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
  })

  const[error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.name || !form.targetAmount) {
      return setError('Please fill in all fields')
    }
    setError('')
    setLoading(true)
    try {
      await api.post('/goals', {
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
      <div className="bg-white dark:bg-[#0F172A] border border-[#3a6ea5] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.3)] w-full max-w-md mx-4 p-6">

        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#2e2e2e] dark:text-[#fafafa]">Add Saving Goal</h3>
          <button onClick={onClose} className="text-[#2e2e2e] dark:text-[#fafafa]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-[#2e2e2e] dark:text-[#fafafa] mb-1 block">Goal Name:</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Buy a car"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-[#3A6EA5] dark:border-[#3A6EA5] rounded-md px-4 py-3 text-sm outline-none  transition-colors bg-transparent text-[#2e2e2e] dark:text-[#fafafa]"
           />
          </div>

          <div className='relative'>
            <label className="text-sm text-[#2e2e2e] dark:text-[#fafafa] mb-1 block">Target Amount</label>
            <span className="absolute left-3 top-12 -translate-y-1/2 text-[#2e2e2e] dark:text-[#fafafa]">
              ₦
            </span>
            <input
              type="number"
              name="targetAmount"
              placeholder="0.00"
              value={form.targetAmount}
              onChange={handleChange}
              className="w-full border border-[#3A6EA5] dark:border-[#3A6EA5] rounded-md px-6 py-3 text-sm outline-none  transition-colors bg-transparent text-[#2e2e2e] dark:text-[#fafafa]"
           />
          </div>

          <div>
            <label className="text-sm text-[#2e2e2e] dark:text-[#fafafa] mb-1 block">Deadline<span>(optional)</span></label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full border border-[#3A6EA5] dark:border-[#3A6EA5] rounded-md px-4 py-3 text-sm outline-none transition-colors bg-transparent text-[#2e2e2e] dark:text-[#fafafa]"
            />
         </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-[#FD1010] text-[#fafafa] py-3 rounded-lg text-sm font-medium "
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#3a6ea5] text-white py-3 rounded-lg text-sm font-medium disabled:opacity-60"
          >
            {loading ? 'Adding...' : 'Add Goal'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default AddSavingModal
