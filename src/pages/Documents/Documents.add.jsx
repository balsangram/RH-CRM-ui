import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'

export const DocumentsAdd = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    category: 'Identification',
    applicant: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(ROUTES.DOCUMENTS)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">Upload Document</h1>
          <p className="text-sm text-muted mt-1">Upload client passports, bank statements, or proof of funds</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.DOCUMENTS)}>
          &larr; Back to Documents
        </Button>
      </div>

      <div className="crm-card bg-surface p-6 rounded-2xl border border-border shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Document Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="crm-input"
                placeholder="e.g. Passport_Bio_Copy.pdf"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="crm-input"
              >
                <option value="Identification">Identification</option>
                <option value="Financial">Financial Proof</option>
                <option value="Employment">Employment Letter</option>
                <option value="Insurance">Travel Insurance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-main mb-1">
              Applicant Name
            </label>
            <input
              type="text"
              value={formData.applicant}
              onChange={(e) => setFormData({ ...formData, applicant: e.target.value })}
              className="crm-input"
              placeholder="e.g. Emma Watson"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate(ROUTES.DOCUMENTS)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Upload File
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DocumentsAdd
