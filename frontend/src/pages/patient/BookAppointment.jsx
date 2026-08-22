import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import departmentService from '../../services/departmentService.js'
import doctorService from '../../services/doctorService.js'
import appointmentService from '../../services/appointmentService.js'

export default function BookAppointment() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [departments, setDepartments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [department, setDepartment] = useState('')
  const [doctor, setDoctor] = useState(searchParams.get('doctor') || '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    departmentService.list().then((data) => setDepartments(data.results || data))
  }, [])

  useEffect(() => {
    doctorService
      .list({ department: department || undefined, is_active: true })
      .then((data) => setDoctors(data.results || data))
  }, [department])

  useEffect(() => {
    if (doctor && !department) {
      doctorService.get(doctor).then((d) => setDepartment(String(d.department?.id || '')))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function validate() {
    if (!department) return 'Please select a department.'
    if (!doctor) return 'Please select a doctor.'
    if (!date) return 'Please select an appointment date.'
    if (!time) return 'Please select an appointment time.'
    const today = new Date().toISOString().slice(0, 10)
    if (date < today) return 'Appointment date cannot be in the past.'
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
      await appointmentService.create({
        department_id: department,
        doctor_id: doctor,
        appointment_date: date,
        appointment_time: time,
        reason_for_visit: reason,
      })
      setSuccess(true)
      setTimeout(() => navigate('/patient/appointments'), 1500)
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to book appointment. The slot may already be taken.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="page-title">Book an Appointment</h1>

      {success && <div className="alert alert-success">Appointment booked successfully! Redirecting...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card form-grid booking-steps">
        <label>
          1. Select Department
          <select value={department} onChange={(e) => { setDepartment(e.target.value); setDoctor('') }}>
            <option value="">Choose department</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </label>

        <label>
          2. Select Doctor
          <select value={doctor} onChange={(e) => setDoctor(e.target.value)} disabled={!department}>
            <option value="">Choose doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>Dr. {d.user.full_name} - {d.specialization}</option>
            ))}
          </select>
        </label>

        <label>
          3. Appointment Date
          <input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
        </label>

        <label>
          4. Available Time
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>

        <label className="span-2">
          5. Reason for Visit
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Briefly describe your symptoms or reason for the visit" />
        </label>

        <button type="submit" className="btn btn-primary span-2" disabled={saving}>
          {saving ? 'Booking...' : '6. Confirm Appointment'}
        </button>
      </form>
    </DashboardLayout>
  )
}
