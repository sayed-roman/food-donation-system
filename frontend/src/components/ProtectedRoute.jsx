import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppLayout from './AppLayout'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <AppLayout><p className="text-gray-600">You don't have permission to view this page.</p></AppLayout>
  }
  return <AppLayout>{children}</AppLayout>
}
