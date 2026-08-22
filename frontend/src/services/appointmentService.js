import api from './api'

const appointmentService = {
  async list(params = {}) {
    const { data } = await api.get('/appointments/', { params })
    return data
  },
  async get(id) {
    const { data } = await api.get(`/appointments/${id}/`)
    return data
  },
  async create(payload) {
    const { data } = await api.post('/appointments/', payload)
    return data
  },
  async update(id, payload) {
    const { data } = await api.put(`/appointments/${id}/`, payload)
    return data
  },
  async cancel(id) {
    const { data } = await api.put(`/appointments/${id}/`, { status: 'CANCELLED' })
    return data
  },
  async remove(id) {
    await api.delete(`/appointments/${id}/`)
  },
}

export default appointmentService
