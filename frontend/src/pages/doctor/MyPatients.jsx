import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import appointmentService from '../../services/appointmentService.js'

export default function MyPatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    appointmentService
      .list()
      .then((data) => {
        const appts = data.results || data
        const seen = new Map()
        appts.forEach((appt) => {
          if (appt.patient && !seen.has(appt.patient.id)) {
            seen.set(appt.patient.id, appt.patient)
          }
        })
        setPatients(Array.from(seen.values()))
      })
      .catch((err) => setError(err.friendlyMessage || 'Failed to load patients.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>

  return (
    <DashboardLayout>
      <h1 className="page-title">My Patients</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {patients.length === 0 ? (
        <p className="empty-state">No patients yet.</p>
      ) : (
        <div className="card-grid">
          {patients.map((p) => (
            <div className="card" key={p.id}>
              <h3>{p.user.full_name}</h3>
              <p className="muted">{p.user.email}</p>
              <p><strong>Blood Group:</strong> {p.blood_group}</p>
              <Link to={`/doctor/patients/${p.id}/history`} className="btn btn-outline btn-sm">View History</Link>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
