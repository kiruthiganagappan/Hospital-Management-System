import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import medicalRecordService from '../../services/medicalRecordService.js'

export default function MyMedicalHistory() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    medicalRecordService
      .list()
      .then((data) => setRecords(data.results || data))
      .catch((err) => setError(err.friendlyMessage || 'Failed to load medical history.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>

  return (
    <DashboardLayout>
      <h1 className="page-title">My Medical History</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {records.length === 0 ? (
        <p className="empty-state">No medical records yet.</p>
      ) : (
        <div className="timeline">
          {records.map((rec) => (
            <div className="timeline-item" key={rec.id}>
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-header">
                  <strong>Dr. {rec.doctor.user.full_name}</strong>
                  <span className="muted">{new Date(rec.created_at).toLocaleDateString()}</span>
                </div>
                <p><strong>Diagnosis:</strong> {rec.diagnosis}</p>
                {rec.symptoms && <p><strong>Symptoms:</strong> {rec.symptoms}</p>}
                {rec.notes && <p><strong>Notes:</strong> {rec.notes}</p>}
                {rec.test_results && <p><strong>Test Results:</strong> {rec.test_results}</p>}
                {rec.follow_up_date && <p><strong>Follow-up:</strong> {rec.follow_up_date}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
