import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import patientService from '../../services/patientService.js'

export default function PatientCompleteHistory() {
  const { id } = useParams()
  const [history, setHistory] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    patientService
      .completeHistory(id)
      .then(setHistory)
      .catch((err) => setError(err.friendlyMessage || 'Failed to load patient history.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>
  if (error) return <DashboardLayout><div className="alert alert-error">{error}</div></DashboardLayout>
  if (!history) return null

  const info = history.patient_information

  return (
    <DashboardLayout>
      <h1 className="page-title">Complete Patient History</h1>

      <div className="card">
        <h3>Personal Information</h3>
        <div className="detail-grid">
          <div><span className="muted">Name</span><p>{info.user.full_name}</p></div>
          <div><span className="muted">Age</span><p>{info.age ?? '-'}</p></div>
          <div><span className="muted">Gender</span><p>{info.gender}</p></div>
          <div><span className="muted">Blood Group</span><p>{info.blood_group}</p></div>
          <div><span className="muted">Phone</span><p>{info.user.phone}</p></div>
          <div><span className="muted">Email</span><p>{info.user.email}</p></div>
          <div><span className="muted">Address</span><p>{info.address}</p></div>
          <div><span className="muted">Emergency Contact</span><p>{info.emergency_contact_name} ({info.emergency_contact_phone})</p></div>
        </div>
      </div>

      <div className="card">
        <h3>Appointment History ({history.appointments.length})</h3>
        {history.appointments.length === 0 ? (
          <p className="empty-state">No appointments recorded.</p>
        ) : (
          <div className="timeline">
            {history.appointments.map((appt) => (
              <div className="timeline-item" key={appt.id}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <strong>{appt.appointment_date} at {appt.appointment_time}</strong>
                    <StatusBadge status={appt.status} />
                  </div>
                  <p>Dr. {appt.doctor?.user?.full_name} &middot; {appt.department?.name}</p>
                  <p className="muted">Reason: {appt.reason_for_visit || 'Not specified'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Consultation History ({history.medical_records.length})</h3>
        {history.medical_records.length === 0 ? (
          <p className="empty-state">No medical records yet.</p>
        ) : (
          <div className="timeline">
            {history.medical_records.map((rec) => (
              <div className="timeline-item" key={rec.id}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <strong>Dr. {rec.doctor?.user?.full_name}</strong>
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
      </div>

      <div className="card">
        <h3>Prescription History ({history.prescriptions.length})</h3>
        {history.prescriptions.length === 0 ? (
          <p className="empty-state">No prescriptions on record.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Instructions</th>
                </tr>
              </thead>
              <tbody>
                {history.prescriptions.map((rx) => (
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
        )}
      </div>
    </DashboardLayout>
  )
}
