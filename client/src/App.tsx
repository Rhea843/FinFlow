import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './hooks/useAuth'

//auth pages
import LandingPage from './pages/landingpage/LandingPage'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyOTP from './pages/auth/VerifyOTP'


//app pages
import Dashboard from './pages/dashboard/MainDashboard'
import Transactions from './pages/transactions/Transactions'
import Expense from './pages/transactions/Expense'
import Income from './pages/transactions/Income'
import Goals from './pages/goals/Goals'
import Profile from './pages/profile/Profile'
import Analytics from './pages/Analytics/Analytics'
import SavingsTransactions from './pages/goals/SavingsTransactions'
import AllSavingGoals from './pages/goals/AllSavingGoals'


//components
import ProtectedRoute from './components/protectedRoute'



const App = () => {
  const { user } = useAuth()
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* private routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      <Route path="/transactions/expense" element={<ProtectedRoute><Expense /></ProtectedRoute>} />
      <Route path="/transactions/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
      <Route path="/transactions/savings" element={<ProtectedRoute><SavingsTransactions /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/goals/all" element={<ProtectedRoute><AllSavingGoals /></ProtectedRoute>} />

     {/* DEFAULT REDIRECT */}
      <Route path="*" element={<Navigate to="/" />} />
      
    </Routes>
  )
}

export default App
