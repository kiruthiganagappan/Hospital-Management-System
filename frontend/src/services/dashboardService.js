import api from './api'

const dashboardService = {
  async admin() {
    const { data } = await api.get('/dashboard/admin/')
    return data
  },
  async doctor() {
    const { data } = await api.get('/dashboard/doctor/')
    return data
  },
  async patient() {
    const { data } = await api.get('/dashboard/patient/')
    return data
  },
}

export default dashboardService
