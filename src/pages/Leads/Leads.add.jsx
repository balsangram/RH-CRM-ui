import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'

export const LeadsAdd = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    source: 'Website',
    notes: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Process lead creation logic
    navigate(ROUTES.LEADS)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">Add New Lead</h1>
          <p className="text-sm text-muted mt-1">Enter prospect details to add them to your CRM pipeline</p>
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
                placeholder="e.g. John Doe"
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
                placeholder="e.g. john@example.com"
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
                placeholder="+1 555-0199"
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
                placeholder="Canada, UK, Australia, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <option value="Partner">Agency Partner</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-main mb-1">
              Notes & Inquiries
            </label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="crm-input"
              placeholder="Additional background, visa inquiry details, or initial conversation notes..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate(ROUTES.LEADS)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save & Create Lead
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LeadsAdd
