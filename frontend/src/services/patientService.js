import api from './api'

const patientService = {
  async list(params = {}) {
    const { data } = await api.get('/patients/', { params })
    return data
  },
  async get(id) {
    const { data } = await api.get(`/patients/${id}/`)
    return data
  },
  async create(payload) {
    const { data } = await api.post('/patients/', payload)
    return data
  },
  async update(id, payload) {
    const { data } = await api.put(`/patients/${id}/`, payload)
    return data
  },
  async remove(id) {
    await api.delete(`/patients/${id}/`)
  },
  async completeHistory(id) {
    const { data } = await api.get(`/patients/${id}/complete-history/`)
    return data
  },
}

export default patientService
