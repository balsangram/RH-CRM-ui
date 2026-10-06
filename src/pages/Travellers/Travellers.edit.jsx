import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'

export const TravellersEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    name: 'Robert Downey Jr.',
    passport: 'Z9821345',
    nationality: 'United States',
    expiry: '2029-08-14',
    customer: 'Robert Downey',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(ROUTES.TRAVELLERS)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">Edit Traveller #{id || 'TRV-01'}</h1>
          <p className="text-sm text-muted mt-1">Update passport info and nationality record</p>
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
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate(ROUTES.TRAVELLERS)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TravellersEdit
