import { useState, useEffect, useCallback } from 'react'
import authService from '../services/auth'

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'))
  const [loading, setLoading] = useState(false)

  const isAuthenticated = Boolean(token && user)

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const response = await authService.login(credentials)
      setUser(response.user)
      setToken(response.token)
      return response
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setToken(null)
  }, [])

  useEffect(() => {
    // Listen for storage changes in multi-tab scenarios
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('auth_token')
      setUser(storedUser ? JSON.parse(storedUser) : null)
      setToken(storedToken)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
  }
}

export default useAuth
