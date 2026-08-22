import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import medicalRecordService from '../../services/medicalRecordService.js'
import appointmentService from '../../services/appointmentService.js'

const emptyMedicine = { medicine_name: '', dosage: '', frequency: '', duration: '', instructions: '' }

export default function Consultation() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState(null)
  const [diagnosis, setDiagnosis] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [notes, setNotes] = useState('')
  const [testResults, setTestResults] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [medicines, setMedicines] = useState([{ ...emptyMedicine }])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    appointmentService
      .get(appointmentId)
      .then(setAppointment)
      .catch((err) => setError(err.friendlyMessage || 'Failed to load appointment.'))
      .finally(() => setLoading(false))
  }, [appointmentId])

  function updateMedicine(index, field, value) {
    setMedicines((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)))
  }

  function addMedicineRow() {
    setMedicines((prev) => [...prev, { ...emptyMedicine }])
  }

  function removeMedicineRow(index) {
    setMedicines((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!diagnosis) {
      setError('Diagnosis is required.')
      return
    }
    setError('')
    setSaving(true)
    try {
      const validMedicines = medicines.filter((m) => m.medicine_name.trim())
      await medicalRecordService.create({
        patient_id: appointment.patient.id,
        appointment_id: appointment.id,
        diagnosis,
        symptoms,
        notes,
        test_results: testResults,
        follow_up_date: followUpDate || null,
        prescriptions_input: validMedicines,
      })
      navigate('/doctor/appointments')
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to save consultation.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>
  if (!appointment) return <DashboardLayout><div className="alert alert-error">{error}</div></DashboardLayout>

  return (
    <DashboardLayout>
      <h1 className="page-title">Consultation</h1>
      <div className="card">
        <p><strong>Patient:</strong> {appointment.patient.user.full_name}</p>
        <p><strong>Date:</strong> {appointment.appointment_date} at {appointment.appointment_time}</p>
        <p><strong>Reason:</strong> {appointment.reason_for_visit}</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card form-grid">
        <label className="span-2">Diagnosis *<textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} /></label>
        <label className="span-2">Symptoms<textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} /></label>
        <label className="span-2">Notes<textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
        <label className="span-2">Test Results<textarea value={testResults} onChange={(e) => setTestResults(e.target.value)} /></label>
        <label>Follow-up Date<input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} /></label>

        <div className="span-2">
          <h3>Prescriptions</h3>
          {medicines.map((med, index) => (
            <div className="prescription-row" key={index}>
              <input placeholder="Medicine name" value={med.medicine_name} onChange={(e) => updateMedicine(index, 'medicine_name', e.target.value)} />
              <input placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={(e) => updateMedicine(index, 'dosage', e.target.value)} />
              <input placeholder="Frequency" value={med.frequency} onChange={(e) => updateMedicine(index, 'frequency', e.target.value)} />
              <input placeholder="Duration" value={med.duration} onChange={(e) => updateMedicine(index, 'duration', e.target.value)} />
              <input placeholder="Instructions" value={med.instructions} onChange={(e) => updateMedicine(index, 'instructions', e.target.value)} />
              {medicines.length > 1 && (
                <button type="button" className="link link-danger" onClick={() => removeMedicineRow(index)}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={addMedicineRow}>+ Add Medicine</button>
        </div>

        <button type="submit" className="btn btn-primary span-2" disabled={saving}>
          {saving ? 'Saving...' : 'Complete Consultation'}
        </button>
      </form>
    </DashboardLayout>
  )
}
