import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="navbar-logo">+</span>
          <h1>MedoraX Hospital HMS</h1>
        </div>
        <h2>Forgot your password?</h2>
        {submitted ? (
          <div className="alert alert-success">
            If an account exists for {email}, our team has been notified and will contact you to reset it. Please
            contact the hospital administrator directly for urgent access.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Registered Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <button type="submit" className="btn btn-primary btn-block">
              Send Reset Instructions
            </button>
          </form>
        )}
        <p className="auth-footer">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  )
}
