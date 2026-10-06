import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'

export const TravellersAdd = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    passport: '',
    nationality: '',
    expiry: '',
    customer: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(ROUTES.TRAVELLERS)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">Add New Traveller</h1>
          <p className="text-sm text-muted mt-1">Register passport and traveller details</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.TRAVELLERS)}>
          &larr; Back to Travellers
        </Button>
      </div>

      <div className="crm-card bg-surface p-6 rounded-2xl border border-border shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Traveller Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="crm-input"
                placeholder="e.g. Robert Downey Jr."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Passport Number *
              </label>
              <input
                type="text"
                required
                value={formData.passport}
                onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
                className="crm-input"
                placeholder="e.g. Z9821345"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Nationality
              </label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="crm-input"
                placeholder="United States, India, UK..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Passport Expiry Date
              </label>
              <input
                type="text"
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                className="crm-input"
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate(ROUTES.TRAVELLERS)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Traveller
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TravellersAdd
