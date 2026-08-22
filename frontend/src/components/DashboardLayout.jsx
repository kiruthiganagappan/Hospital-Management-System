import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function DashboardLayout({ children }) {
  const { user } = useAuth()
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar role={user?.role} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  )
}
