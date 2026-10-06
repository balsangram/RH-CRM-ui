import api from './api'

export const applicationsService = {
  /**
   * Get applications list
   * @param {object} params
   */
  async getApplications(params = {}) {
    return api.get('/applications', { params })
  },

  /**
   * Get application by ID
   * @param {string|number} id
   */
  async getApplicationById(id) {
    return api.get(`/applications/${id}`)
  },

  /**
   * Create new application
   * @param {object} applicationData
   */
  async createApplication(applicationData) {
    return api.post('/applications', applicationData)
  },

  /**
   * Update application status or details
   * @param {string|number} id
   * @param {object} updates
   */
  async updateApplication(id, updates) {
    return api.put(`/applications/${id}`, updates)
  },

  /**
   * Update status specifically
   * @param {string|number} id
   * @param {string} status
   */
  async updateStatus(id, status) {
    return api.patch(`/applications/${id}/status`, { status })
  },

  /**
   * Delete application
   * @param {string|number} id
   */
  async deleteApplication(id) {
    return api.delete(`/applications/${id}`)
  },
}

export default applicationsService
