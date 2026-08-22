import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import doctorService from '../../services/doctorService.js'

export default function DoctorDetails() {
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    doctorService
      .get(id)
      .then(setDoctor)
      .catch((err) => setError(err.friendlyMessage || 'Failed to load doctor.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>
  if (error) return <DashboardLayout><div className="alert alert-error">{error}</div></DashboardLayout>
  if (!doctor) return null

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Dr. {doctor.user.full_name}</h1>
        <Link to={`/admin/doctors/${id}/edit`} className="btn btn-primary">Edit</Link>
      </div>
      <div className="card detail-grid">
        <div><span className="muted">Email</span><p>{doctor.user.email}</p></div>
        <div><span className="muted">Phone</span><p>{doctor.user.phone}</p></div>
        <div><span className="muted">Gender</span><p>{doctor.gender}</p></div>
        <div><span className="muted">Date of Birth</span><p>{doctor.date_of_birth || '-'}</p></div>
        <div><span className="muted">Specialization</span><p>{doctor.specialization}</p></div>
        <div><span className="muted">Qualification</span><p>{doctor.qualification}</p></div>
        <div><span className="muted">Department</span><p>{doctor.department?.name || '-'}</p></div>
        <div><span className="muted">Experience</span><p>{doctor.experience_years} years</p></div>
        <div><span className="muted">Consultation Fee</span><p>₹{doctor.consultation_fee}</p></div>
        <div><span className="muted">Available Days</span><p>{doctor.available_days || '-'}</p></div>
        <div><span className="muted">Available Time</span><p>{doctor.available_start_time} - {doctor.available_end_time}</p></div>
        <div><span className="muted">Address</span><p>{doctor.address}</p></div>
        <div><span className="muted">Status</span><p>{doctor.is_active ? 'Active' : 'Inactive'}</p></div>
      </div>
    </DashboardLayout>
  )
}
