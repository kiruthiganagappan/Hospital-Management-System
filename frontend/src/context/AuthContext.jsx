import { createContext, useContext, useEffect, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }
    // Re-validate the session on refresh so a stale localStorage user
    // never masks an expired / revoked token.
    authService
      .getProfile()
      .then((data) => {
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  function persistSession({ user: userData, tokens }) {
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  async function login(username, password) {
    const result = await authService.login(username, password)
    persistSession(result)
    return result
  }

  async function register(payload) {
    const result = await authService.register(payload)
    persistSession(result)
    return result
  }

  async function logout() {
    await authService.logout()
    setUser(null)
  }

  function updateUser(userData) {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
