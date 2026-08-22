import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import medicalRecordService from '../../services/medicalRecordService.js'

export default function MyPrescriptions() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    medicalRecordService
      .list()
      .then((data) => setRecords((data.results || data).filter((r) => r.prescriptions?.length > 0)))
      .catch((err) => setError(err.friendlyMessage || 'Failed to load prescriptions.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>

  return (
    <DashboardLayout>
      <h1 className="page-title">My Prescriptions</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {records.length === 0 ? (
        <p className="empty-state">No prescriptions yet.</p>
      ) : (
        records.map((rec) => (
          <div className="card" key={rec.id}>
            <h3>Dr. {rec.doctor.user.full_name}</h3>
            <p className="muted">{new Date(rec.created_at).toLocaleDateString()} &middot; {rec.diagnosis}</p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Instructions</th></tr>
                </thead>
                <tbody>
                  {rec.prescriptions.map((rx) => (
                    <tr key={rx.id}>
                      <td>{rx.medicine_name}</td>
                      <td>{rx.dosage}</td>
                      <td>{rx.frequency}</td>
                      <td>{rx.duration}</td>
                      <td>{rx.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </DashboardLayout>
  )
}
