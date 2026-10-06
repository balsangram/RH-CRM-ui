import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'

export const EmployeesAdd = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Immigration Agent',
    department: 'Canada Operations',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(ROUTES.EMPLOYEES)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">Add Team Member</h1>
          <p className="text-sm text-muted mt-1">Register a new staff employee or visa officer account</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.EMPLOYEES)}>
          &larr; Back to Employees
        </Button>
      </div>

      <div className="crm-card bg-surface p-6 rounded-2xl border border-border shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Staff Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="crm-input"
                placeholder="e.g. Sarah Connor"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Work Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="crm-input"
                placeholder="e.g. sarah.c@rhglobal.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Role Title
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="crm-input"
                placeholder="Immigration Officer, Specialist, etc."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="crm-input"
                placeholder="Operations, Sales, Executive"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate(ROUTES.EMPLOYEES)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Staff Member
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmployeesAdd
