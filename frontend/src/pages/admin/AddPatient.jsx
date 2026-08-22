import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import patientService from '../../services/patientService.js'

const emptyForm = {
  username: '', email: '', password: '', first_name: '', last_name: '', phone: '',
  gender: 'MALE', date_of_birth: '', address: '', blood_group: 'UNKNOWN',
  emergency_contact_name: '', emergency_contact_phone: '', allergies: '', current_medications: '',
}

export default function AddPatient() {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate() {
    if (!form.username || !form.email || !form.password || !form.first_name || !form.last_name) {
      return 'Please fill in all required fields (name, username, email, password).'
    }
    if (form.password.length < 8) {
      return 'Password must be at least 8 characters.'
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
    setSaving(true)
    try {
      await patientService.create(form)
      navigate('/admin/patients')
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to create patient.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="page-title">Add Patient</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="card form-grid">
        <label>First Name<input value={form.first_name} onChange={(e) => update('first_name', e.target.value)} /></label>
        <label>Last Name<input value={form.last_name} onChange={(e) => update('last_name', e.target.value)} /></label>
        <label>Username<input value={form.username} onChange={(e) => update('username', e.target.value)} /></label>
        <label>Email<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} /></label>
        <label>Phone<input value={form.phone} onChange={(e) => update('phone', e.target.value)} /></label>
        <label>Gender
          <select value={form.gender} onChange={(e) => update('gender', e.target.value)}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label>Date of Birth<input type="date" value={form.date_of_birth} onChange={(e) => update('date_of_birth', e.target.value)} /></label>
        <label>Address<input value={form.address} onChange={(e) => update('address', e.target.value)} /></label>
        <label>Blood Group
          <select value={form.blood_group} onChange={(e) => update('blood_group', e.target.value)}>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </label>
        <label>Emergency Contact Name<input value={form.emergency_contact_name} onChange={(e) => update('emergency_contact_name', e.target.value)} /></label>
        <label>Emergency Contact Phone<input value={form.emergency_contact_phone} onChange={(e) => update('emergency_contact_phone', e.target.value)} /></label>
        <label className="span-2">Allergies<textarea value={form.allergies} onChange={(e) => update('allergies', e.target.value)} /></label>
        <label className="span-2">Current Medications<textarea value={form.current_medications} onChange={(e) => update('current_medications', e.target.value)} /></label>
        <button type="submit" className="btn btn-primary span-2" disabled={saving}>
          {saving ? 'Saving...' : 'Add Patient'}
        </button>
      </form>
    </DashboardLayout>
  )
}
