import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'

export const LeadsEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState({
    name: 'Alice Walker',
    email: 'alice.w@example.com',
    phone: '+1 415-555-0199',
    country: 'Canada',
    source: 'Website',
    status: 'In_Progress',
    notes: 'Interested in Express Entry Permanent Residency program.',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Process lead update logic
    navigate(ROUTES.LEADS)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">Edit Lead #{id || '1'}</h1>
          <p className="text-sm text-muted mt-1">Update prospect details and pipeline status</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.LEADS)}>
          &larr; Back to Leads
        </Button>
      </div>

      <div className="crm-card bg-surface p-6 rounded-2xl border border-border shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Full Name *
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
                Target Country
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
                Pipeline Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="crm-input"
              >
                <option value="New">New</option>
                <option value="Pending">Pending Contact</option>
                <option value="In_Progress">In Progress</option>
                <option value="Approved">Converted Client</option>
                <option value="Rejected">Disqualified</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Lead Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="crm-input"
              >
                <option value="Website">Website Inquiry</option>
                <option value="Referral">Client Referral</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Google Ads">Google Ads</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-main mb-1">
              Notes
            </label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="crm-input"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate(ROUTES.LEADS)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Update Lead Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LeadsEdit
