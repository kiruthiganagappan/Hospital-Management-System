import api from './api'

const departmentService = {
  async list() {
    const { data } = await api.get('/departments/')
    return data
  },
  async get(id) {
    const { data } = await api.get(`/departments/${id}/`)
    return data
  },
  async create(payload) {
    const { data } = await api.post('/departments/', payload)
    return data
  },
  async update(id, payload) {
    const { data } = await api.put(`/departments/${id}/`, payload)
    return data
  },
  async remove(id) {
    await api.delete(`/departments/${id}/`)
  },
}

export default departmentService
