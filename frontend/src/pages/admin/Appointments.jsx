import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import AppointmentTable from '../../components/AppointmentTable.jsx'
import appointmentService from '../../services/appointmentService.js'

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function loadAppointments() {
    setLoading(true)
    appointmentService
      .list({ status: statusFilter || undefined, date: dateFilter || undefined })
      .then((data) => setAppointments(data.results || data))
      .catch((err) => setError(err.friendlyMessage || 'Failed to load appointments.'))
      .finally(() => setLoading(false))
  }

  useEffect(loadAppointments, [statusFilter, dateFilter])

  async function handleStatusChange(appt, status) {
    try {
      await appointmentService.update(appt.id, { status })
      loadAppointments()
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to update appointment.')
    }
  }

  return (
    <DashboardLayout>
      <h1 className="page-title">All Appointments</h1>

      <div className="filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <Loader />
      ) : (
        <AppointmentTable
          appointments={appointments}
          renderActions={(appt) => (
            <div className="actions-cell">
              {appt.status === 'PENDING' && (
                <button className="link" onClick={() => handleStatusChange(appt, 'CONFIRMED')}>Confirm</button>
              )}
              {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
                <button className="link link-danger" onClick={() => handleStatusChange(appt, 'CANCELLED')}>Cancel</button>
              )}
            </div>
          )}
        />
      )}
    </DashboardLayout>
  )
}
