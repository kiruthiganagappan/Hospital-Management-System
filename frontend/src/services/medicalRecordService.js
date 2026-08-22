import api from './api'

const medicalRecordService = {
  async list(params = {}) {
    const { data } = await api.get('/medical-records/', { params })
    return data
  },
  async get(id) {
    const { data } = await api.get(`/medical-records/${id}/`)
    return data
  },
  async create(payload) {
    const { data } = await api.post('/medical-records/', payload)
    return data
  },
  async update(id, payload) {
    const { data } = await api.put(`/medical-records/${id}/`, payload)
    return data
  },
  async remove(id) {
    await api.delete(`/medical-records/${id}/`)
  },
}

export default medicalRecordService
