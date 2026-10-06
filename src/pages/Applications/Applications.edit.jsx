import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'

export const ApplicationsEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    applicant: 'Emma Watson',
    country: 'United Kingdom',
    visaType: 'Standard Visitor Visa',
    officer: 'Officer Davies',
    status: 'Under_Review',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(ROUTES.APPLICATIONS)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">Edit Application #{id || 'APP-901'}</h1>
          <p className="text-sm text-muted mt-1">Update visa case status and assigned details</p>
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
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Destination Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="crm-input"
              />
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
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="crm-input"
              >
                <option value="Under_Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending Documents</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate(ROUTES.APPLICATIONS)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApplicationsEdit
