import React, { useState } from 'react'
import Table from '../../components/Table'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { getStatusBadgeStyle } from '../../utils/helpers'

export const Leads = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [leads, setLeads] = useState([
    { id: 1, name: 'Alice Walker', email: 'alice.w@example.com', phone: '+1 415-555-0199', country: 'Canada', status: 'New', source: 'Website', date: '2026-10-05' },
    { id: 2, name: 'David Beckham', email: 'd.beckham@example.com', phone: '+44 20-7946-0912', country: 'Australia', status: 'Pending', source: 'Referral', date: '2026-10-04' },
    { id: 3, name: 'Ravi Sharma', email: 'ravi.s@example.com', phone: '+91 98765-43210', country: 'United Kingdom', status: 'In_Progress', source: 'LinkedIn', date: '2026-10-03' },
    { id: 4, name: 'Sophia Chen', email: 'sophia.c@example.com', phone: '+65 6789-0123', country: 'United States', status: 'Approved', source: 'Google Ads', date: '2026-10-01' },
  ])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    source: 'Website',
  })

  const handleCreateLead = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return

    const newLead = {
      id: Date.now(),
      ...formData,
      status: 'New',
      date: new Date().toISOString().split('T')[0],
    }

    setLeads([newLead, ...leads])
    setIsModalOpen(false)
    setFormData({ name: '', email: '', phone: '', country: '', source: 'Website' })
  }

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    { key: 'name', header: 'Lead Name', render: (val) => <span className="font-semibold text-slate-900">{val}</span> },
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
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads Management</h1>
          <p className="text-sm text-slate-500 mt-1">Capture, nurture and convert prospects into CRM clients</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md">
          + Add New Lead
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <input
          type="text"
          placeholder="Filter by name, email, or country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Leads Table */}
      <Table columns={columns} data={filteredLeads} />

      {/* Create Lead Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New CRM Lead"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateLead}>
              Create Lead
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. john@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="+1 555-0199"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Target Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Canada, UK, etc."
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Leads
