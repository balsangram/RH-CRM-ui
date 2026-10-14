import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'
import companiesService from '../../services/companies'

export const CompaniesEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState(() => {
    if (id) {
      const existing = companiesService.getCompanyById(id)
      if (existing) {
        return {
          name: existing.name || '',
          contactPerson: existing.contactPerson || '',
          email: existing.email || '',
          phone: existing.phone || '',
          address: existing.address || '',
          country: existing.country || 'India',
          status: existing.status || 'ACTIVE',
        }
      }
    }
    return {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      country: 'India',
      status: 'ACTIVE',
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (id) {
      companiesService.updateCompany(id, formData)
    }
    navigate(ROUTES.COMPANIES)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Company #{id || 'CMP-02'}</h1>
          <p className="text-sm text-slate-500 mt-1">Update corporate contact info, profile particulars, and active status</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.COMPANIES)}>
          &larr; Back to Companies
        </Button>
      </div>

      <div className="crm-card bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="crm-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Contact Person *
              </label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="crm-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="crm-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="crm-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="crm-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="crm-input bg-white"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="ghost" onClick={() => navigate(ROUTES.COMPANIES)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Company Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompaniesEdit
