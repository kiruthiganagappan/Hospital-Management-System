import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Loader from './Loader.jsx'

export default function RoleBasedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth()

  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user.role)) {
    const redirects = {
      ADMIN: '/admin/dashboard',
      DOCTOR: '/doctor/dashboard',
      PATIENT: '/patient/dashboard',
    }
    return <Navigate to={redirects[user.role] || '/login'} replace />
  }
  return children
}
