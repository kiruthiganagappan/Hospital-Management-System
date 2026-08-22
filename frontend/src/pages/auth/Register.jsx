import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const initialForm = {
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  password: '',
  password2: '',
}

export default function Register() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate() {
    if (!form.username || !form.email || !form.first_name || !form.last_name || !form.password) {
      return 'Please fill in all required fields.'
    }
    if (form.password.length < 8) {
      return 'Password must be at least 8 characters long.'
    }
    if (form.password !== form.password2) {
      return 'Passwords do not match.'
    }
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await register(form)
      navigate(result.redirect || '/patient/dashboard', { replace: true })
    } catch (err) {
      setError(err.friendlyMessage || 'Registration failed. Please review your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-brand">
          <span className="navbar-logo">+</span>
          <h1>MedoraX Hospital</h1>
        </div>
        <h2>Create your patient account</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form auth-form-grid">
          <label>
            First Name
            <input value={form.first_name} onChange={(e) => update('first_name', e.target.value)} />
          </label>
          <label>
            Last Name
            <input value={form.last_name} onChange={(e) => update('last_name', e.target.value)} />
          </label>
          <label>
            Username
            <input value={form.username} onChange={(e) => update('username', e.target.value)} />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </label>
          <span />
          <label>
            Password
            <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} />
          </label>
          <label>
            Confirm Password
            <input type="password" value={form.password2} onChange={(e) => update('password2', e.target.value)} />
          </label>
          <button type="submit" className="btn btn-primary btn-block span-2" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
