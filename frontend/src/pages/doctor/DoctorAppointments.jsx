import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import AppointmentTable from '../../components/AppointmentTable.jsx'
import appointmentService from '../../services/appointmentService.js'

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function loadAppointments() {
    setLoading(true)
    appointmentService
      .list({ status: statusFilter || undefined })
      .then((data) => setAppointments(data.results || data))
      .catch((err) => setError(err.friendlyMessage || 'Failed to load appointments.'))
      .finally(() => setLoading(false))
  }

  useEffect(loadAppointments, [statusFilter])

  async function handleCancel(appt) {
    try {
      await appointmentService.cancel(appt.id)
      loadAppointments()
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to cancel appointment.')
    }
  }

  return (
    <DashboardLayout>
      <h1 className="page-title">My Appointments</h1>
      <div className="filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <Loader />
      ) : (
        <AppointmentTable
          appointments={appointments}
          renderActions={(appt) => (
            <div className="actions-cell">
              {appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED' && (
                <>
                  <Link to={`/doctor/consultation/${appt.id}`} className="link">Consult</Link>
                  <button className="link link-danger" onClick={() => handleCancel(appt)}>Cancel</button>
                </>
              )}
            </div>
          )}
        />
      )}
    </DashboardLayout>
  )
}
