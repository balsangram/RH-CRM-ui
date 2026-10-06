import api from './api'

export const authService = {
  /**
   * Log in user with credentials
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    const data = await api.post('/auth/login', credentials)
    if (data?.token) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  },

  /**
   * Register a new user / customer
   * @param {object} payload
   */
  async register(payload) {
    return api.post('/auth/register', payload)
  },

  /**
   * Fetch current authenticated user's profile
   */
  async getCurrentUser() {
    return api.get('/auth/me')
  },

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    return api.post('/auth/refresh')
  },

  /**
   * Logout user and clear tokens
   */
  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },
}

export default authService
