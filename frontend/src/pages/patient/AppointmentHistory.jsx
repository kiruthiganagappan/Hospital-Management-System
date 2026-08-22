import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import AppointmentTable from '../../components/AppointmentTable.jsx'
import appointmentService from '../../services/appointmentService.js'

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    appointmentService
      .list({ status: 'COMPLETED' })
      .then((data) => setAppointments(data.results || data))
      .catch((err) => setError(err.friendlyMessage || 'Failed to load appointment history.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>

  return (
    <DashboardLayout>
      <h1 className="page-title">Appointment History</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <AppointmentTable appointments={appointments} columns="compact" />
    </DashboardLayout>
  )
}
