import api from './api'

const doctorService = {
  async list(params = {}) {
    const { data } = await api.get('/doctors/', { params })
    return data
  },
  async get(id) {
    const { data } = await api.get(`/doctors/${id}/`)
    return data
  },
  async create(payload) {
    const { data } = await api.post('/doctors/', payload)
    return data
  },
  async update(id, payload) {
    const { data } = await api.put(`/doctors/${id}/`, payload)
    return data
  },
  async remove(id) {
    await api.delete(`/doctors/${id}/`)
  },
  async toggleActive(id) {
    const { data } = await api.post(`/doctors/${id}/toggle_active/`)
    return data
  },
}

export default doctorService
