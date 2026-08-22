import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()

  if (location.pathname === '/') {
    return null
  }

  return (
    <header className="home-nav">
      <div className="navbar-brand">
        <span className="navbar-logo">+</span> MedoraX Hospital
      </div>

      <nav className="home-nav-links">
        <Link to="/" className="btn btn-outline btn-sm">
          Home
        </Link>
      </nav>
    </header>
  )
}