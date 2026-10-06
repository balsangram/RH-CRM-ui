import React, { useState } from 'react'
import Table from '../../components/Table'
import Button from '../../components/Button'
import { getStatusBadgeStyle } from '../../utils/helpers'

export const Applications = () => {
  const [activeTab, setActiveTab] = useState('ALL')

  const applications = [
    { id: 'APP-901', applicant: 'Emma Watson', country: 'United Kingdom', visaType: 'Standard Visitor Visa', officer: 'Officer Davies', status: 'Under_Review', date: '2026-10-04' },
    { id: 'APP-902', applicant: 'Carlos Mendoza', country: 'Canada', visaType: 'Express Entry PR', officer: 'Officer Tremblay', status: 'Approved', date: '2026-10-03' },
    { id: 'APP-903', applicant: 'Amina Al-Mansoor', country: 'France', visaType: 'Schengen Business', officer: 'Officer Laurent', status: 'Pending', date: '2026-10-02' },
    { id: 'APP-904', applicant: 'Liam O’Connor', country: 'United States', visaType: 'B1/B2 Visitor', officer: 'Officer Miller', status: 'Approved', date: '2026-10-01' },
    { id: 'APP-905', applicant: 'Kenji Sato', country: 'Australia', visaType: 'Work and Holiday (417)', officer: 'Officer White', status: 'Rejected', date: '2026-09-28' },
  ]

  const filtered = applications.filter((app) => {
    if (activeTab === 'ALL') return true
    return app.status.toUpperCase() === activeTab
  })

  const tabs = [
    { label: 'All Applications', value: 'ALL' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Rejected', value: 'REJECTED' },
  ]

  const columns = [
    { key: 'id', header: 'Application No.', render: (val) => <span className="font-semibold text-slate-900">{val}</span> },
    { key: 'applicant', header: 'Applicant' },
    { key: 'country', header: 'Country' },
    { key: 'visaType', header: 'Visa Type' },
    { key: 'officer', header: 'Case Officer' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => {
        const badge = getStatusBadgeStyle(val)
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${badge.badge}`} />
            {val.replace('_', ' ')}
          </span>
        )
      },
    },
    { key: 'date', header: 'Submitted On' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applications Management</h1>
          <p className="text-sm text-slate-500 mt-1">Track lifecycle, case officers, and processing stages for all visas</p>
        </div>
        <Button variant="primary" size="md">+ New Application</Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === tab.value
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Table columns={columns} data={filtered} />
    </div>
  )
}

export default Applications
