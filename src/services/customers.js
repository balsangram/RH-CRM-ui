import companiesService from './companies'
import api from './api'

export const customersService = {
  ...companiesService,
  async getCustomers(params = {}) {
    return companiesService.getCompanies()
  },
  async getCustomerById(id) {
    return companiesService.getCompanyById(id)
  },
  async createCustomer(customerData) {
    return companiesService.createCompany(customerData)
  },
  async updateCustomer(id, updates) {
    return companiesService.updateCompany(id, updates)
  },
  async deleteCustomer(id) {
    return companiesService.deleteCompany(id)
  },
}

export default customersService
