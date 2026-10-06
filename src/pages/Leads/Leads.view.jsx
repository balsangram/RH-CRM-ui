import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '../../components/Table/Table.component'
import Button from '../../components/Button/Button.component'
import { getStatusBadgeStyle } from '../../utils/helpers'

export const Leads = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [leads] = useState([
    { id: 1, name: 'Alice Walker', email: 'alice.w@example.com', phone: '+1 415-555-0199', country: 'Canada', status: 'New', source: 'Website', date: '2026-10-05' },
    { id: 2, name: 'David Beckham', email: 'd.beckham@example.com', phone: '+44 20-7946-0912', country: 'Australia', status: 'Pending', source: 'Referral', date: '2026-10-04' },
    { id: 3, name: 'Ravi Sharma', email: 'ravi.s@example.com', phone: '+91 98765-43210', country: 'United Kingdom', status: 'In_Progress', source: 'LinkedIn', date: '2026-10-03' },
    { id: 4, name: 'Sophia Chen', email: 'sophia.c@example.com', phone: '+65 6789-0123', country: 'United States', status: 'Approved', source: 'Google Ads', date: '2026-10-01' },
  ])

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    { key: 'name', header: 'Lead Name', render: (val) => <span className="font-semibold text-main">{val}</span> },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'country', header: 'Target Country' },
    { key: 'source', header: 'Source' },
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
    { key: 'date', header: 'Created' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/leads/edit/${row.id}`)
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
          <h1 className="text-2xl font-bold text-main">Leads Management</h1>
          <p className="text-sm text-muted mt-1">Capture, nurture and convert prospects into CRM clients</p>
        </div>
        <Button onClick={() => navigate('/leads/add')} variant="primary" size="md">
          + Add New Lead
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-surface p-4 rounded-xl border border-border">
        <input
          type="text"
          placeholder="Filter by name, email, or country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="crm-input"
        />
      </div>

      {/* Leads Table */}
      <Table columns={columns} data={filteredLeads} />
    </div>
  )
}

export default Leads
