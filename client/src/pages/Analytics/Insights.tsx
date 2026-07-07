import type { Transaction } from '../../types'

interface Props {
  transactions: Transaction[]
}

const Insights = ({ transactions }: Props) => {
  const now = new Date()

  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const lastMonth = transactions.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === now.getMonth() - 1 && d.getFullYear() === now.getFullYear()
  })

  const thisExpenses = thisMonth.filter(t => t.type === 'expense')
  const thisIncome = thisMonth.filter(t => t.type === 'income')
  const lastIncome = lastMonth.filter(t => t.type === 'income')

  const totalExpenses = thisExpenses.reduce((s, t) => s + t.amount, 0)
  const totalIncome = thisIncome.reduce((s, t) => s + t.amount, 0)
  const lastTotalIncome = lastIncome.reduce((s, t) => s + t.amount, 0)

  // highest expense category
  const categoryMap: Record<string, number> = {}
  thisExpenses.forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount
  })
  const highestCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]
  
   // income change
  const incomeChange = lastTotalIncome > 0
    ? (((totalIncome - lastTotalIncome) / lastTotalIncome) * 100).toFixed(0)
    : null

  // spending ratio
  const spendingRatio = totalIncome > 0
    ? Math.round((totalExpenses / totalIncome) * 100)
    : null

  // saving rate
  const savingRate = totalIncome > 0
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
    : null

  const insights: { text: string; highlight?: { value: string; positive: boolean } }[] = []

  if (highestCategory) {
    insights.push({
      text: `${highestCategory[0]} was your highest expense category this month.`,
    })
  }

  if (spendingRatio !== null) {
    insights.push({
      text: `You've spent `,
      highlight: {
        value: `${spendingRatio}%`,
        positive: spendingRatio < 70,
      },
    })
  }
  
  if (incomeChange !== null) {
    const change = Number(incomeChange)
    insights.push({
      text: change >= 0
        ? `Your income is up `
        : `Your income is down `,
      highlight: {
        value: `${Math.abs(change)}%`,
        positive: change >= 0,
      },
    })
  }

   if (savingRate !== null) {
    insights.push({
      text: `Your saving rate this month is `,
      highlight: {
        value: `${savingRate}%`,
        positive: savingRate >= 20,
      },
    })
  }

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-xl p-6 border border-[#3a6ea5]/70 shadow-[0_4px_4px_rgba(0,0,0,0.3)]">
      <h3 className="font-semibold text-[#2e2e2e] dark:text-[#fafafa] mb-4 text-center">
        FinFlow Insights
      </h3>

      {insights.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">Add transactions to see insights</p>
      ) : (
        <div className="flex flex-col gap-3">
          {insights.map((insight, i) => (
            <p key={i} className="text-sm text-[#2e2e2e] dark:text-[#fafafa]">
              "{insight.text}
              {insight.highlight && (
                <span className={insight.highlight.positive ? 'text-[#34C759]' : 'text-[#FD1010]'}>
                  {insight.highlight.value}
                </span>
              )}
              {insight.highlight ? ' of your monthly income.' : ''}"
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default Insights
