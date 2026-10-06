import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'

export const ApplicationsAdd = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    applicant: '',
    country: 'Canada',
    visaType: 'Express Entry (PR)',
    officer: '',
    submissionDate: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(ROUTES.APPLICATIONS)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">New Visa Application</h1>
          <p className="text-sm text-muted mt-1">Register a new client visa case application</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.APPLICATIONS)}>
          &larr; Back to Applications
        </Button>
      </div>

      <div className="crm-card bg-surface p-6 rounded-2xl border border-border shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Applicant Name *
              </label>
              <input
                type="text"
                required
                value={formData.applicant}
                onChange={(e) => setFormData({ ...formData, applicant: e.target.value })}
                className="crm-input"
                placeholder="e.g. Emma Watson"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Destination Country
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="crm-input"
              >
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Australia">Australia</option>
                <option value="Schengen (France)">Schengen (France)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Visa Category
              </label>
              <input
                type="text"
                value={formData.visaType}
                onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                className="crm-input"
                placeholder="e.g. Tourist (Subclass 600)"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Assigned Case Officer
              </label>
              <input
                type="text"
                value={formData.officer}
                onChange={(e) => setFormData({ ...formData, officer: e.target.value })}
                className="crm-input"
                placeholder="Officer Name"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate(ROUTES.APPLICATIONS)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApplicationsAdd
