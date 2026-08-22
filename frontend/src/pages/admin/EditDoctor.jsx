import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import doctorService from '../../services/doctorService.js'
import departmentService from '../../services/departmentService.js'

export default function EditDoctor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [departments, setDepartments] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([doctorService.get(id), departmentService.list()])
      .then(([doctor, deptData]) => {
        setForm({
          gender: doctor.gender || 'MALE',
          date_of_birth: doctor.date_of_birth || '',
          address: doctor.address || '',
          qualification: doctor.qualification || '',
          specialization: doctor.specialization || '',
          experience_years: doctor.experience_years || 0,
          department_id: doctor.department?.id || '',
          consultation_fee: doctor.consultation_fee || '',
          available_days: doctor.available_days || '',
          available_start_time: doctor.available_start_time || '',
          available_end_time: doctor.available_end_time || '',
          is_active: doctor.is_active,
        })
        setDepartments(deptData.results || deptData)
      })
      .catch((err) => setError(err.friendlyMessage || 'Failed to load doctor.'))
      .finally(() => setLoading(false))
  }, [id])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await doctorService.update(id, form)
      navigate(`/admin/doctors/${id}`)
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to update doctor.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>
  if (!form) return <DashboardLayout><p className="alert alert-error">{error}</p></DashboardLayout>

  return (
    <DashboardLayout>
      <h1 className="page-title">Edit Doctor</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="card form-grid">
        <label>Gender
          <select value={form.gender} onChange={(e) => update('gender', e.target.value)}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label>Date of Birth<input type="date" value={form.date_of_birth || ''} onChange={(e) => update('date_of_birth', e.target.value)} /></label>
        <label>Address<input value={form.address} onChange={(e) => update('address', e.target.value)} /></label>
        <label>Qualification<input value={form.qualification} onChange={(e) => update('qualification', e.target.value)} /></label>
        <label>Specialization<input value={form.specialization} onChange={(e) => update('specialization', e.target.value)} /></label>
        <label>Experience (years)<input type="number" min="0" value={form.experience_years} onChange={(e) => update('experience_years', e.target.value)} /></label>
        <label>Department
          <select value={form.department_id} onChange={(e) => update('department_id', e.target.value)}>
            <option value="">Select department</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </label>
        <label>Consultation Fee (₹)<input type="number" min="0" step="0.01" value={form.consultation_fee} onChange={(e) => update('consultation_fee', e.target.value)} /></label>
        <label>Available Days<input value={form.available_days} onChange={(e) => update('available_days', e.target.value)} /></label>
        <label>Available From<input type="time" value={form.available_start_time || ''} onChange={(e) => update('available_start_time', e.target.value)} /></label>
        <label>Available To<input type="time" value={form.available_end_time || ''} onChange={(e) => update('available_end_time', e.target.value)} /></label>
        <label className="checkbox-label">
          <input type="checkbox" checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} />
          Active
        </label>
        <button type="submit" className="btn btn-primary span-2" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </DashboardLayout>
  )
}
