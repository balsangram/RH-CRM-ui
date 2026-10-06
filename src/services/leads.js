import api from './api'

export const leadsService = {
  /**
   * Get paginated leads list with optional filters
   * @param {object} params
   */
  async getLeads(params = {}) {
    return api.get('/leads', { params })
  },

  /**
   * Get single lead by ID
   * @param {string|number} id
   */
  async getLeadById(id) {
    return api.get(`/leads/${id}`)
  },

  /**
   * Create a new lead
   * @param {object} leadData
   */
  async createLead(leadData) {
    return api.post('/leads', leadData)
  },

  /**
   * Update lead details
   * @param {string|number} id
   * @param {object} updates
   */
  async updateLead(id, updates) {
    return api.put(`/leads/${id}`, updates)
  },

  /**
   * Delete lead
   * @param {string|number} id
   */
  async deleteLead(id) {
    return api.delete(`/leads/${id}`)
  },

  /**
   * Convert lead into a customer
   * @param {string|number} id
   */
  async convertToCustomer(id) {
    return api.post(`/leads/${id}/convert`)
  },
}

export default leadsService
