import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '../../components/Table/Table.component'
import Button from '../../components/Button/Button.component'
import { getStatusBadgeStyle } from '../../utils/helpers'

export const Applications = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('ALL')

  const applications = [
    { id: 'APP-901', applicant: 'Emma Watson', country: 'United Kingdom', visaType: 'Standard Visitor Visa', officer: 'Officer Davies', status: 'Under_Review', date: '2026-10-04' },
    { id: 'APP-902', applicant: 'Carlos Mendoza', country: 'Canada', visaType: 'Work Permit (LMIA)', officer: 'Officer Tremblay', status: 'Approved', date: '2026-10-03' },
    { id: 'APP-903', applicant: 'Amina Al-Mansoor', country: 'France (Schengen)', visaType: 'Business Visit', officer: 'Officer Dubois', status: 'Pending', date: '2026-10-02' },
    { id: 'APP-904', applicant: 'Liam O’Connor', country: 'United States', visaType: 'B1/B2 Visitor', officer: 'Officer Miller', status: 'Approved', date: '2026-10-01' },
  ]

  const tabs = [
    { label: 'All Cases', value: 'ALL' },
    { label: 'Under Review', value: 'Under_Review' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Pending Action', value: 'Pending' },
  ]

  const filtered = activeTab === 'ALL' ? applications : applications.filter((app) => app.status === activeTab)

  const columns = [
    { key: 'id', header: 'Application ID', render: (val) => <span className="font-semibold text-main">{val}</span> },
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
    { key: 'date', header: 'Submission Date' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/applications/edit/${row.id}`)
          }}
          className="text-xs font-semibold text-primary hover:text-primary-hover underline"
        >
          Edit
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main">Visa Applications</h1>
          <p className="text-sm text-muted mt-1">Track case processing, embassy statuses, and client filings</p>
        </div>
        <Button onClick={() => navigate('/applications/add')} variant="primary" size="md">
          + New Application
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === tab.value
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:bg-primary-light'
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
