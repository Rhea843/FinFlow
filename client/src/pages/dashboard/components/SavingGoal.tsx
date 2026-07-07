import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddFundModal from '../../../components/modals/AddFundModal'
import WithdrawFundModal from '../../../components/modals/WithdrawFundModal'

import type { SavingGoal } from "../../../types";


interface Props {
  goals: SavingGoal[]
  onSuccess: () => void
}

const SavingGoals = ({ goals, onSuccess }: Props) => {
  const navigate = useNavigate()
  const [addFundGoal, setAddFundGoal] = useState<SavingGoal | null>(null)
  const [withdrawGoal, setWithdrawGoal] = useState<SavingGoal | null>(null)

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-xl p-6 border border-[#3a6ea5]/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#2e2e2e] dark:text-[#fafafa]">Savings Goals</h3>
        <button
          onClick={() => navigate('/goals')}
          className="text-xs text-[#2e2e2e] dark:text-[#fafafa] hover:underline"
        >
          See all
        </button>
      </div>

      {goals.length === 0 ? (
        <p className="text-[#2e2e2e] dark:text-[#fafafa] text-sm text-center p-8">No savings goals yet</p>
      ) : (
       <div className="flex flex-col gap-4">
        {goals.map(goal => {
          const percent = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100)

          return(
            <div key={goal._id}>
              <div className="bg-[#3a6ea5]/20 border border-[#3a6ea5] p-4 rounded-lg ">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-[#2e2e2e] dark:text-[#fafafa]">{goal.name}</p>
                  <p className="text-sm font-medium text-[#2e2e2e] dark:text-[#fafafa]">
                    ₦{goal.targetAmount.toLocaleString()}
                  </p>
               </div>

               <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white dark:bg-slate-800 rounded-full h-2">
                  <div
                      className="bg-[#3A6EA5] h-2 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
               </div>
               <div className="flex items-center justify-between mt-2">
                 <p className="text-xs text-[#2e2e2e] dark:text-[#fafafa] ">₦{goal.savedAmount.toLocaleString()} saved</p>
                 
                 <div className="flex justify-center items-center gap-2">
                  <button
                  onClick={() => setAddFundGoal(goal)}
                    className="text-[#34C759] text-xs"
                  >
                    Add Fund
                  </button>

                  <button
                   onClick={() => setWithdrawGoal(goal)}
                    className="text-[#FD1010] text-xs"
                  >
                    Withdraw
                  </button>
                 </div>
               </div>

               

              </div>
 
            </div>
          )
        })}
       </div>
      )}

      
      {/* modals */}
      {addFundGoal && (
        <AddFundModal
          goal={addFundGoal}
          onClose={() => setAddFundGoal(null)}
          onSuccess={onSuccess}
        />
      )}
      {withdrawGoal && (
        <WithdrawFundModal
          goal={withdrawGoal}
          onClose={() => setWithdrawGoal(null)}
          onSuccess={onSuccess}
        />
      )}
    </div>
  )
}

export default SavingGoals
