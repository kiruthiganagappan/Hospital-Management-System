import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import Loader from '../../components/Loader.jsx'
import ConfirmModal from '../../components/ConfirmModal.jsx'
import departmentService from '../../services/departmentService.js'

const emptyForm = { name: '', description: '', department_head: '' }

export default function Departments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)

  function loadDepartments() {
    setLoading(true)
    departmentService
      .list()
      .then((data) => setDepartments(data.results || data))
      .catch((err) => setError(err.friendlyMessage || 'Failed to load departments.'))
      .finally(() => setLoading(false))
  }

  useEffect(loadDepartments, [])

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  function openEdit(dept) {
    setEditing(dept)
    setForm({ name: dept.name, description: dept.description, department_head: dept.department_head })
    setFormOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name) {
      setError('Department name is required.')
      return
    }
    setError('')
    setSaving(true)
    try {
      if (editing) {
        await departmentService.update(editing.id, form)
      } else {
        await departmentService.create(form)
      }
      setFormOpen(false)
      loadDepartments()
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to save department.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      await departmentService.remove(deleteTarget.id)
      setDeleteTarget(null)
      loadDepartments()
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to delete department.')
      setDeleteTarget(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Departments</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Department</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {formOpen && (
        <form onSubmit={handleSubmit} className="card form-grid">
          <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Department Head<input value={form.department_head} onChange={(e) => setForm({ ...form, department_head: e.target.value })} /></label>
          <label className="span-2">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <div className="span-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" className="btn btn-outline" onClick={() => setFormOpen(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <Loader />
      ) : departments.length === 0 ? (
        <p className="empty-state">No departments yet.</p>
      ) : (
        <div className="card-grid">
          {departments.map((d) => (
            <div className="card" key={d.id}>
              <h3>{d.name}</h3>
              <p className="muted">{d.description || 'No description'}</p>
              <p><strong>Head:</strong> {d.department_head || '-'}</p>
              <p><strong>Doctors:</strong> {d.doctor_count}</p>
              <div className="actions-cell">
                <button className="link" onClick={() => openEdit(d)}>Edit</button>
                <button className="link link-danger" onClick={() => setDeleteTarget(d)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Department"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Delete"
      />
    </DashboardLayout>
  )
}
