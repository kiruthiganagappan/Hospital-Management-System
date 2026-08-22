import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import doctorService from '../../services/doctorService.js'
import departmentService from '../../services/departmentService.js'

const emptyForm = {
  username: '', email: '', password: '', first_name: '', last_name: '', phone: '',
  gender: 'MALE', date_of_birth: '', address: '', qualification: '', specialization: '',
  experience_years: 0, department: '', consultation_fee: '', available_days: '',
  available_start_time: '', available_end_time: '',
}

export default function AddDoctor() {
  const [form, setForm] = useState(emptyForm)
  const [departments, setDepartments] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    departmentService.list().then((data) => setDepartments(data.results || data))
  }, [])

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
      const payload = { ...form, department: form.department || null }
      await doctorService.create(payload)
      navigate('/admin/doctors')
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to create doctor.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="page-title">Add Doctor</h1>
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
        <label>Qualification<input value={form.qualification} onChange={(e) => update('qualification', e.target.value)} /></label>
        <label>Specialization<input value={form.specialization} onChange={(e) => update('specialization', e.target.value)} /></label>
        <label>Experience (years)<input type="number" min="0" value={form.experience_years} onChange={(e) => update('experience_years', e.target.value)} /></label>
        <label>Department
          <select value={form.department} onChange={(e) => update('department', e.target.value)}>
            <option value="">Select department</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </label>
        <label>Consultation Fee (₹)<input type="number" min="0" step="0.01" value={form.consultation_fee} onChange={(e) => update('consultation_fee', e.target.value)} /></label>
        <label>Available Days<input placeholder="Mon,Tue,Wed" value={form.available_days} onChange={(e) => update('available_days', e.target.value)} /></label>
        <label>Available From<input type="time" value={form.available_start_time} onChange={(e) => update('available_start_time', e.target.value)} /></label>
        <label>Available To<input type="time" value={form.available_end_time} onChange={(e) => update('available_end_time', e.target.value)} /></label>
        <button type="submit" className="btn btn-primary span-2" disabled={saving}>
          {saving ? 'Saving...' : 'Add Doctor'}
        </button>
      </form>
    </DashboardLayout>
  )
}
