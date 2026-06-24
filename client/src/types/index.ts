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
  transactions: Transaction[]
}

export interface GoalListResponse {
  count: number
  goals: SavingGoal[]
}