import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import DashboardCard from '../../components/DashboardCard.jsx'
import Loader from '../../components/Loader.jsx'
import dashboardService from '../../services/dashboardService.js'

export default function PatientDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService
      .patient()
      .then(setStats)
      .catch((err) => setError(err.friendlyMessage || 'Failed to load dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Dashboard</h1>
        <Link to="/patient/book-appointment" className="btn btn-primary">+ Book Appointment</Link>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {stats && (
        <div className="dashboard-grid">
          <DashboardCard title="Upcoming Appointments" value={stats.upcoming_appointments} icon="📅" tone="info" />
          <DashboardCard title="Completed Appointments" value={stats.completed_appointments} icon="✅" tone="success" />
          <DashboardCard title="Prescriptions" value={stats.prescriptions} icon="💊" />
          <DashboardCard title="Medical Records" value={stats.medical_records} icon="📋" />
        </div>
      )}
    </DashboardLayout>
  )
}
