import { useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get role from URL
  const [searchParams] = useSearchParams()
  const role = searchParams.get('role') || 'patient'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Please enter both username and password.')
      return
    }

    setLoading(true)

    try {
      const result = await login(username, password)

      const from = location.state?.from?.pathname

      navigate(from || result.redirect || '/login', {
        replace: true,
      })
    } catch (err) {
      setError(
        err.friendlyMessage ||
          err.response?.data?.non_field_errors?.[0] ||
          'Login failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <span className="navbar-logo">+</span>
          <h1>MedoraX Hospital</h1>
        </div>

        <h2>Sign in to your account</h2>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">

          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoFocus
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* Patient and Doctor register option only */}
        {role !== 'admin' && (
          <p className="auth-footer">
            New {role === 'doctor' ? 'doctor' : 'patient'}?{' '}
            <Link to="/register">
              Create an account
            </Link>
          </p>
        )}

      </div>
    </div>
  )
}