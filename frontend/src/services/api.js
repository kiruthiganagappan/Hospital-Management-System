import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the JWT access token to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let refreshQueue = []

function resolveQueue(token) {
  refreshQueue.forEach((cb) => cb(token))
  refreshQueue = []
}

function clearSession() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

export function extractErrorMessage(data) {
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  const firstKey = Object.keys(data)[0]
  if (!firstKey) return 'An unexpected error occurred.'
  const value = data[firstKey]
  const message = Array.isArray(value) ? value[0] : value
  return `${firstKey}: ${message}`
}

// Handle expired access tokens by refreshing once, then retry the request.
// Also normalizes network / 403 / 500 errors into a consistent shape.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!error.response) {
      error.friendlyMessage = 'Network error. Please check your connection and that the backend server is running.'
      return Promise.reject(error)
    }

    const { status } = error.response

    const isAuthEndpoint =
      originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/token/refresh')

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        clearSession()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh: refreshToken })
        localStorage.setItem('access_token', data.access)
        resolveQueue(data.access)
        isRefreshing = false
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        clearSession()
        return Promise.reject(refreshError)
      }
    }

    if (status === 403) {
      error.friendlyMessage = 'You do not have permission to perform this action.'
    } else if (status === 500) {
      error.friendlyMessage = 'Something went wrong on the server. Please try again later.'
    } else if (error.response.data) {
      error.friendlyMessage = extractErrorMessage(error.response.data)
    }

    return Promise.reject(error)
  }
)

export default api
