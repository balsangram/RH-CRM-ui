import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'

export const CustomersAdd = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(ROUTES.CUSTOMERS)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">Add New Customer</h1>
          <p className="text-sm text-muted mt-1">Register a retained client account</p>
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
                placeholder="e.g. Robert Downey"
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
                placeholder="e.g. robert@downey.io"
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
                placeholder="+1 202-555-0143"
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
                placeholder="New York, USA"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate(ROUTES.CUSTOMERS)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Customer
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomersAdd
