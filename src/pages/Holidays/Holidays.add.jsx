import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'
import usePermission from '../../hooks/usePermission'

export const HolidaysAdd = () => {
  const navigate = useNavigate()
  const { isRole } = usePermission()

  if (isRole('AGENT', 'STAFF')) {
    return <Navigate to={ROUTES.STAFF_DASHBOARD} replace />
  }
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    duration: '5 Nights / 6 Days',
    price: '',
    status: 'Active',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(ROUTES.HOLIDAYS)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">Add Holiday Package</h1>
          <p className="text-sm text-muted mt-1">Create a new holiday package or custom tour itinerary</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.HOLIDAYS)}>
          &larr; Back to Holidays
        </Button>
      </div>

      <div className="crm-card bg-surface p-6 rounded-2xl border border-border shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Package Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="crm-input"
                placeholder="e.g. Swiss Alps Getaway"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Destination *
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="crm-input"
                placeholder="e.g. Switzerland"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="crm-input"
                placeholder="e.g. 7 Nights / 8 Days"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Starting Price ($)
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="crm-input"
                placeholder="e.g. 3,450"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate(ROUTES.HOLIDAYS)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Holiday Package
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HolidaysAdd
