import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import SearchBar from '../../components/SearchBar.jsx'
import ConfirmModal from '../../components/ConfirmModal.jsx'
import patientService from '../../services/patientService.js'

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  function loadPatients() {
    setLoading(true)
    patientService
      .list({ search: search || undefined })
      .then((data) => setPatients(data.results || data))
      .catch((err) => setError(err.friendlyMessage || 'Failed to load patients.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const timeout = setTimeout(loadPatients, 300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  async function handleDelete() {
    try {
      await patientService.remove(deleteTarget.id)
      setDeleteTarget(null)
      loadPatients()
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to delete patient.')
      setDeleteTarget(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Patients</h1>
        <Link to="/admin/patients/add" className="btn btn-primary">+ Add Patient</Link>
      </div>

      <div className="filter-bar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." />
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <Loader />
      ) : patients.length === 0 ? (
        <p className="empty-state">No patients found.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Blood Group</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.user.full_name}</td>
                  <td>{p.user.email}</td>
                  <td>{p.user.phone}</td>
                  <td>{p.blood_group}</td>
                  <td>{p.age ?? '-'}</td>
                  <td className="actions-cell">
                    <Link to={`/admin/patients/${p.id}`} className="link">View</Link>
                    <Link to={`/admin/patients/${p.id}/edit`} className="link">Edit</Link>
                    <Link to={`/admin/patients/${p.id}/history`} className="link">History</Link>
                    <button className="link link-danger" onClick={() => setDeleteTarget(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Patient"
        message={`Are you sure you want to delete ${deleteTarget?.user?.full_name}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Delete"
      />
    </DashboardLayout>
  )
}
