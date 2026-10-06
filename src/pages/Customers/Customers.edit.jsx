import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'

export const CustomersEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    name: 'Robert Downey',
    email: 'robert@downey.io',
    phone: '+1 202-555-0143',
    city: 'New York, USA',
    status: 'Active',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(ROUTES.CUSTOMERS)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">Edit Customer #{id || 'CUST-001'}</h1>
          <p className="text-sm text-muted mt-1">Update customer contact info and profile status</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.CUSTOMERS)}>
          &larr; Back to Customers
        </Button>
      </div>

      <div className="crm-card bg-surface p-6 rounded-2xl border border-border shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Customer Name *
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
              <label className="block text-xs font-semibold uppercase text-main mb-1">
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="crm-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="crm-input"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate(ROUTES.CUSTOMERS)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Customer Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomersEdit
