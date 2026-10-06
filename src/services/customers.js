import api from './api'

export const customersService = {
  /**
   * Get list of customers
   * @param {object} params
   */
  async getCustomers(params = {}) {
    return api.get('/customers', { params })
  },

  /**
   * Get customer by ID
   * @param {string|number} id
   */
  async getCustomerById(id) {
    return api.get(`/customers/${id}`)
  },

  /**
   * Create customer
   * @param {object} customerData
   */
  async createCustomer(customerData) {
    return api.post('/customers', customerData)
  },

  /**
   * Update customer
   * @param {string|number} id
   * @param {object} updates
   */
  async updateCustomer(id, updates) {
    return api.put(`/customers/${id}`, updates)
  },

  /**
   * Delete customer
   * @param {string|number} id
   */
  async deleteCustomer(id) {
    return api.delete(`/customers/${id}`)
  },
}

export default customersService
