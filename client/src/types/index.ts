export interface User {
  _id: string
  name: string
  email: string
  profilePic: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  _id: string
  user: string
  type: 'income' | 'expense' 
  amount: number
  description: string
  date: string  
  category: string
  transactionDate: string
  createdAt: string
  updatedAt: string
  
}

export interface SavingGoal {
   _id: string
  user: string
  name: string
  targetAmount: number
  savedAmount: number
  deadline: string | null
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface TransactionSummary {
  count: number
  income: number
  expenses: number
  balance: number
  savings: number
  transactions: Transaction[]
}

export interface GoalListResponse {
  count: number
  goals: SavingGoal[]
}

export interface SavingTransaction {
  _id: string
  user: string
  goal: {
    _id: string
    name: string
    targetAmount: number
    savedAmount: number
  } | string
  amount: number
  type: 'deposit' | 'withdrawal'
  note: string
  createdAt: string
  updatedAt: string
}

export interface RecentActivities {
  _id: string
  type: 'income' | 'expense' | 'deposit' | 'withdrawal'
  title: string
  category: string
  amount: number
  date: string
  goalName?: string  
}