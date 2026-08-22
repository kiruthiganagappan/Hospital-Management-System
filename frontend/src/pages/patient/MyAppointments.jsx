import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import AppointmentTable from '../../components/AppointmentTable.jsx'
import ConfirmModal from '../../components/ConfirmModal.jsx'
import appointmentService from '../../services/appointmentService.js'

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelTarget, setCancelTarget] = useState(null)

  function load() {
    setLoading(true)
    appointmentService
      .list()
      .then((data) => setAppointments(data.results || data))
      .catch((err) => setError(err.friendlyMessage || 'Failed to load appointments.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleCancel() {
    try {
      await appointmentService.cancel(cancelTarget.id)
      setCancelTarget(null)
      load()
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to cancel appointment.')
      setCancelTarget(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Appointments</h1>
        <Link to="/patient/book-appointment" className="btn btn-primary">+ Book New</Link>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <Loader />
      ) : (
        <AppointmentTable
          appointments={appointments}
          columns="compact"
          renderActions={(appt) =>
            appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' ? (
              <button className="link link-danger" onClick={() => setCancelTarget(appt)}>Cancel</button>
            ) : null
          }
        />
      )}

      <ConfirmModal
        open={!!cancelTarget}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment?"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
        confirmLabel="Yes, Cancel"
      />
    </DashboardLayout>
  )
}
