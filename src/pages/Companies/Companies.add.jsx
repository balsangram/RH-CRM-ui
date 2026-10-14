import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'
import companiesService from '../../services/companies'

export const CompaniesAdd = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    country: 'India',
    creditLimit: '₹25,00,000',
    gstNumber: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name) return
    companiesService.createCompany(formData)
    navigate(ROUTES.COMPANIES)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Company / Client</h1>
          <p className="text-sm text-slate-500 mt-1">Register a corporate account for group visas and business tours</p>
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
                placeholder="e.g. Apex Tours & Tech"
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
                placeholder="e.g. Sunil Mehta"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Corporate Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="crm-input"
                placeholder="e.g. info@apextours.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="crm-input"
                placeholder="+91 22 2800 1122"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Headquarters Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="crm-input"
                placeholder="45 BKC Complex, Mumbai"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="crm-input"
                placeholder="India"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Credit Limit Facility
              </label>
              <input
                type="text"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                className="crm-input"
                placeholder="₹25,00,000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                GSTIN / Tax ID
              </label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="crm-input"
                placeholder="27AAACA1234F1Z8"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="ghost" onClick={() => navigate(ROUTES.COMPANIES)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Corporate Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompaniesAdd
