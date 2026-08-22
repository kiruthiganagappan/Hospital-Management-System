import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import authService from '../../services/authService.js'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '', new_password2: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  async function handleProfileSubmit(e) {
    e.preventDefault()
    setMessage('')
    setError('')
    setSaving(true)
    try {
      const updated = await authService.updateProfile(form)
      updateUser(updated)
      setMessage('Profile updated successfully.')
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setPasswordMessage('')
    setPasswordError('')
    if (passwordForm.new_password !== passwordForm.new_password2) {
      setPasswordError('New passwords do not match.')
      return
    }
    setChangingPassword(true)
    try {
      await authService.changePassword(passwordForm)
      setPasswordMessage('Password changed successfully.')
      setPasswordForm({ old_password: '', new_password: '', new_password2: '' })
    } catch (err) {
      setPasswordError(err.friendlyMessage || 'Failed to change password.')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="page-title">My Profile</h1>

      <div className="card">
        <h3>Personal Information</h3>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleProfileSubmit} className="form-grid">
          <label>
            First Name
            <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </label>
          <label>
            Last Name
            <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Change Password</h3>
        {passwordMessage && <div className="alert alert-success">{passwordMessage}</div>}
        {passwordError && <div className="alert alert-error">{passwordError}</div>}
        <form onSubmit={handlePasswordSubmit} className="form-grid">
          <label>
            Current Password
            <input
              type="password"
              value={passwordForm.old_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
            />
          </label>
          <label>
            New Password
            <input
              type="password"
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
            />
          </label>
          <label>
            Confirm New Password
            <input
              type="password"
              value={passwordForm.new_password2}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password2: e.target.value })}
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={changingPassword}>
            {changingPassword ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
