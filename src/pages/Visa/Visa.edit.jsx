import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'

export const VisaEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    country: 'Canada',
    type: 'Express Entry (PR)',
    processing: '6 Months',
    fee: '$1,365 CAD',
    successRate: '94%',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(ROUTES.VISA)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">Edit Visa Program #{id || '1'}</h1>
          <p className="text-sm text-muted mt-1">Update supported visa criteria and processing options</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.VISA)}>
          &larr; Back to Visa Programs
        </Button>
      </div>

      <div className="crm-card bg-surface p-6 rounded-2xl border border-border shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Country *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="crm-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Visa Category Name *
              </label>
              <input
                type="text"
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="crm-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Avg. Processing Time
              </label>
              <input
                type="text"
                value={formData.processing}
                onChange={(e) => setFormData({ ...formData, processing: e.target.value })}
                className="crm-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Government Fee
              </label>
              <input
                type="text"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                className="crm-input"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate(ROUTES.VISA)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Update Program
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VisaEdit
