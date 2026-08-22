import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import DashboardCard from '../../components/DashboardCard.jsx'
import Loader from '../../components/Loader.jsx'
import dashboardService from '../../services/dashboardService.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService
      .admin()
      .then(setStats)
      .catch((err) => setError(err.friendlyMessage || 'Failed to load dashboard stats.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>

  return (
    <DashboardLayout>
      <h1 className="page-title">Admin Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {stats && (
        <div className="dashboard-grid">
          <DashboardCard title="Total Doctors" value={stats.total_doctors} icon="👨‍⚕️" />
          <DashboardCard title="Total Patients" value={stats.total_patients} icon="🧑‍🤝‍🧑" />
          <DashboardCard title="Departments" value={stats.total_departments} icon="🏥" />
          <DashboardCard title="Total Appointments" value={stats.total_appointments} icon="📅" />
          <DashboardCard title="Pending" value={stats.pending_appointments} icon="⏳" tone="warning" />
          <DashboardCard title="Confirmed" value={stats.confirmed_appointments} icon="✅" tone="info" />
          <DashboardCard title="Completed" value={stats.completed_appointments} icon="🏁" tone="success" />
          <DashboardCard title="Cancelled" value={stats.cancelled_appointments} icon="❌" tone="danger" />
          <DashboardCard title="Today's Appointments" value={stats.todays_appointments} icon="📌" />
        </div>
      )}
    </DashboardLayout>
  )
}
