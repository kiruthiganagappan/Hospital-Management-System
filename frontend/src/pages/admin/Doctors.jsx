import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import SearchBar from '../../components/SearchBar.jsx'
import ConfirmModal from '../../components/ConfirmModal.jsx'
import doctorService from '../../services/doctorService.js'
import departmentService from '../../services/departmentService.js'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  function loadDoctors() {
    setLoading(true)
    doctorService
      .list({ search: search || undefined, department: departmentFilter || undefined })
      .then((data) => setDoctors(data.results || data))
      .catch((err) => setError(err.friendlyMessage || 'Failed to load doctors.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    departmentService.list().then((data) => setDepartments(data.results || data))
  }, [])

  useEffect(() => {
    const timeout = setTimeout(loadDoctors, 300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, departmentFilter])

  async function handleToggleActive(id) {
    try {
      await doctorService.toggleActive(id)
      loadDoctors()
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to update doctor status.')
    }
  }

  async function handleDelete() {
    try {
      await doctorService.remove(deleteTarget.id)
      setDeleteTarget(null)
      loadDoctors()
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to delete doctor.')
      setDeleteTarget(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Doctors</h1>
        <Link to="/admin/doctors/add" className="btn btn-primary">+ Add Doctor</Link>
      </div>

      <div className="filter-bar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or specialization..." />
        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <Loader />
      ) : doctors.length === 0 ? (
        <p className="empty-state">No doctors found.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id}>
                  <td>Dr. {doc.user.full_name}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.department?.name || '-'}</td>
                  <td>{doc.user.phone}</td>
                  <td>₹{doc.consultation_fee}</td>
                  <td>
                    <span className={`badge ${doc.is_active ? 'badge-confirmed' : 'badge-cancelled'}`}>
                      {doc.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <Link to={`/admin/doctors/${doc.id}`} className="link">View</Link>
                    <Link to={`/admin/doctors/${doc.id}/edit`} className="link">Edit</Link>
                    <button className="link" onClick={() => handleToggleActive(doc.id)}>
                      {doc.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="link link-danger" onClick={() => setDeleteTarget(doc)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Doctor"
        message={`Are you sure you want to delete Dr. ${deleteTarget?.user?.full_name}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Delete"
      />
    </DashboardLayout>
  )
}
