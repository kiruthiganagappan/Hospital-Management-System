import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import SearchBar from '../../components/SearchBar.jsx'
import DoctorCard from '../../components/DoctorCard.jsx'
import doctorService from '../../services/doctorService.js'
import departmentService from '../../services/departmentService.js'

export default function FindDoctors() {
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    departmentService.list().then((data) => setDepartments(data.results || data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => {
      doctorService
        .list({ search: search || undefined, department: departmentFilter || undefined, is_active: true })
        .then((data) => setDoctors(data.results || data))
        .catch((err) => setError(err.friendlyMessage || 'Failed to load doctors.'))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timeout)
  }, [search, departmentFilter])

  return (
    <DashboardLayout>
      <h1 className="page-title">Find Doctors</h1>
      <div className="filter-bar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or specialization..." />
        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <Loader />
      ) : doctors.length === 0 ? (
        <p className="empty-state">No doctors found.</p>
      ) : (
        <div className="card-grid">
          {doctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              onClick={() => navigate(`/patient/doctors/${doc.id}`)}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
