import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import medicalRecordService from '../../services/medicalRecordService.js'
import appointmentService from '../../services/appointmentService.js'

export default function PatientHistory() {
  const { id } = useParams()
  const [records, setRecords] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      medicalRecordService.list({ patient: id }),
      appointmentService.list(),
    ])
      .then(([recData, apptData]) => {
        setRecords(recData.results || recData)
        const allAppts = apptData.results || apptData
        setAppointments(allAppts.filter((a) => String(a.patient?.id) === String(id)))
      })
      .catch((err) => setError(err.friendlyMessage || 'Failed to load patient history.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>

  return (
    <DashboardLayout>
      <h1 className="page-title">Patient Medical History</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <h3>Appointments</h3>
        {appointments.length === 0 ? (
          <p className="empty-state">No appointments on record.</p>
        ) : (
          <div className="timeline">
            {appointments.map((appt) => (
              <div className="timeline-item" key={appt.id}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <strong>{appt.appointment_date} at {appt.appointment_time}</strong>
                    <StatusBadge status={appt.status} />
                  </div>
                  <p className="muted">{appt.reason_for_visit}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Consultation Records</h3>
        {records.length === 0 ? (
          <p className="empty-state">No medical records yet.</p>
        ) : (
          <div className="timeline">
            {records.map((rec) => (
              <div className="timeline-item" key={rec.id}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <strong>{new Date(rec.created_at).toLocaleDateString()}</strong>
                  </div>
                  <p><strong>Diagnosis:</strong> {rec.diagnosis}</p>
                  {rec.symptoms && <p><strong>Symptoms:</strong> {rec.symptoms}</p>}
                  {rec.prescriptions?.length > 0 && (
                    <ul>
                      {rec.prescriptions.map((rx) => (
                        <li key={rx.id}>{rx.medicine_name} - {rx.dosage}, {rx.frequency}, {rx.duration}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
