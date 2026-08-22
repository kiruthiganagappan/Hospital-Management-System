import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">+</span> MedoraX Hospital
      </div>

      <div className="navbar-user">
        <span className="navbar-username">
          {user?.full_name || user?.username}
        </span>

        <span className="badge badge-role">{user?.role}</span>

        <Link to="/home" className="btn btn-outline btn-sm">
        Home
       </Link>

        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}