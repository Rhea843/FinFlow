import type { TransactionSummary } from '../../../types/index.ts'


interface Props {
  summary: TransactionSummary | null
  lastMonth: TransactionSummary | null
}

const fmt = (n: number) => 
  new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'}).format(n)


const calChange = (current: number, previous: number) => {
  if (previous == 0) return null

  const change = ((current - previous) / previous) * 100
  return change.toFixed(2)
}

const SummaryCard = ({ summary, lastMonth }: Props) => {
  const thisIncome = summary?.income ?? 0
  const thisExpenses = summary?.expenses ?? 0
  const thisSaving = summary?.savings ?? 0
  const thisBalance = thisIncome - thisExpenses

  const lastIncome = lastMonth?.income ?? 0
  const lastExpenses = lastMonth?.expenses ?? 0
  const lastSaving = lastMonth?.savings ?? 0
  const lastBalance = lastIncome - lastExpenses

  const cards = [
    {
      label: 'Balance',
      value: fmt(thisBalance),
      change: calChange(thisBalance, lastBalance),
      positive: thisBalance >= lastBalance,
    },
    {
      label: 'Total Income',
      value: fmt(thisIncome),
      change: calChange(thisIncome, lastIncome),
      positive: thisIncome >= lastIncome,
    },
    {
      label: 'Total Expenses',
      value: fmt(thisExpenses),
      change: calChange(thisExpenses, lastExpenses),
      positive: thisExpenses <= lastExpenses,
    },
    {
      label: 'Total Savings',
      value: fmt(thisSaving),
      change: calChange(thisSaving, lastSaving),
      positive: thisSaving >= lastSaving,
    }
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-4 gap-2">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white dark:bg-[#0F172A] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.3)] py-2 px-4 md:p-5 border border-[#3a6ea5]/70"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{card.label}</p>
          <p className="text-xl font-bold text-slate-800 dark:text-white">{card.value}</p>
          {card.change !== null ? (
            <p className={`text-xs mt-1 ${card.positive ? 'text-green-500' : 'text-red-500'}`}>
              {card.positive ? '+' : ''}{card.change}% from last month
            </p>
          ) : (
            <p className="text-xs mt-1 text-slate-400">No data from last month</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default SummaryCard
