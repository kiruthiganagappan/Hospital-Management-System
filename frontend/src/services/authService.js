import api from './api'

const authService = {
  async register(payload) {
    const { data } = await api.post('/auth/register/', payload)
    return data
  },

  async login(username, password) {
    const { data } = await api.post('/auth/login/', { username, password })
    return data
  },

  async logout() {
    const refresh = localStorage.getItem('refresh_token')
    try {
      await api.post('/auth/logout/', { refresh })
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  },

  async getProfile() {
    const { data } = await api.get('/auth/profile/')
    return data
  },

  async updateProfile(payload) {
    const { data } = await api.put('/auth/profile/', payload)
    return data
  },

  async changePassword(payload) {
    const { data } = await api.post('/auth/change-password/', payload)
    return data
  },
}

export default authService
