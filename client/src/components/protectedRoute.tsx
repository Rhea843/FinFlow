import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import useAuth from '../hooks/useAuth'
import DashboardLayout from './DashboardLayout'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className='flex items-center justify-center h-screen'>Loading...</div>
  }

  if (!user) {
    return <Navigate to='/login' replace />
  }

  return <DashboardLayout>{children}</DashboardLayout>
}

export default ProtectedRoute