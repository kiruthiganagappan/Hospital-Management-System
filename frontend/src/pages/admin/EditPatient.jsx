import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import patientService from '../../services/patientService.js'

export default function EditPatient() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    patientService
      .get(id)
      .then((patient) => {
        setForm({
          gender: patient.gender || 'MALE',
          date_of_birth: patient.date_of_birth || '',
          address: patient.address || '',
          blood_group: patient.blood_group || 'UNKNOWN',
          emergency_contact_name: patient.emergency_contact_name || '',
          emergency_contact_phone: patient.emergency_contact_phone || '',
          allergies: patient.allergies || '',
          current_medications: patient.current_medications || '',
        })
      })
      .catch((err) => setError(err.friendlyMessage || 'Failed to load patient.'))
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
      await patientService.update(id, form)
      navigate(`/admin/patients/${id}`)
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to update patient.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>
  if (!form) return <DashboardLayout><p className="alert alert-error">{error}</p></DashboardLayout>

  return (
    <DashboardLayout>
      <h1 className="page-title">Edit Patient</h1>
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
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </DashboardLayout>
  )
}
