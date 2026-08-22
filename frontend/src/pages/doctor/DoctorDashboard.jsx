import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import DashboardCard from '../../components/DashboardCard.jsx'
import Loader from '../../components/Loader.jsx'
import AppointmentTable from '../../components/AppointmentTable.jsx'
import dashboardService from '../../services/dashboardService.js'
import appointmentService from '../../services/appointmentService.js'

export default function DoctorDashboard() {
  const [stats, setStats] = useState(null)
  const [todayAppointments, setTodayAppointments] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    Promise.all([dashboardService.doctor(), appointmentService.list({ date: today })])
      .then(([statsData, apptData]) => {
        setStats(statsData)
        setTodayAppointments(apptData.results || apptData)
      })
      .catch((err) => setError(err.friendlyMessage || 'Failed to load dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>

  return (
    <DashboardLayout>
      <h1 className="page-title">Doctor Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {stats && (
        <div className="dashboard-grid">
          <DashboardCard title="Today's Appointments" value={stats.todays_appointments} icon="📅" />
          <DashboardCard title="Upcoming Appointments" value={stats.upcoming_appointments} icon="⏳" tone="info" />
          <DashboardCard title="Total Patients" value={stats.total_patients} icon="🧑‍🤝‍🧑" />
          <DashboardCard title="Completed Consultations" value={stats.completed_consultations} icon="✅" tone="success" />
        </div>
      )}
      <h2 className="section-title">Today's Schedule</h2>
      <AppointmentTable appointments={todayAppointments} columns="full" />
    </DashboardLayout>
  )
}
