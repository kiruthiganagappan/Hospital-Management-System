import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import patientService from '../../services/patientService.js'

export default function PatientDetails() {
  const { id } = useParams()
  const [patient, setPatient] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    patientService
      .get(id)
      .then(setPatient)
      .catch((err) => setError(err.friendlyMessage || 'Failed to load patient.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>
  if (error) return <DashboardLayout><div className="alert alert-error">{error}</div></DashboardLayout>
  if (!patient) return null

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">{patient.user.full_name}</h1>
        <div>
          <Link to={`/admin/patients/${id}/edit`} className="btn btn-outline">Edit</Link>
          <Link to={`/admin/patients/${id}/history`} className="btn btn-primary">Complete History</Link>
        </div>
      </div>
      <div className="card detail-grid">
        <div><span className="muted">Email</span><p>{patient.user.email}</p></div>
        <div><span className="muted">Phone</span><p>{patient.user.phone}</p></div>
        <div><span className="muted">Gender</span><p>{patient.gender}</p></div>
        <div><span className="muted">Date of Birth</span><p>{patient.date_of_birth || '-'} {patient.age ? `(${patient.age} yrs)` : ''}</p></div>
        <div><span className="muted">Blood Group</span><p>{patient.blood_group}</p></div>
        <div><span className="muted">Address</span><p>{patient.address}</p></div>
        <div><span className="muted">Emergency Contact</span><p>{patient.emergency_contact_name} ({patient.emergency_contact_phone})</p></div>
        <div><span className="muted">Allergies</span><p>{patient.allergies || 'None reported'}</p></div>
        <div><span className="muted">Current Medications</span><p>{patient.current_medications || 'None'}</p></div>
      </div>
    </DashboardLayout>
  )
}
