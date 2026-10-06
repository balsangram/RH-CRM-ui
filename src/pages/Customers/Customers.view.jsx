import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '../../components/Table/Table.component'
import Button from '../../components/Button/Button.component'

export const Customers = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const customers = [
    { id: 'CUST-001', name: 'Robert Downey', email: 'robert@downey.io', phone: '+1 202-555-0143', totalApps: 3, city: 'New York, USA', status: 'Active' },
    { id: 'CUST-002', name: 'Priya Patel', email: 'priya.patel@gmail.com', phone: '+91 98200-11223', totalApps: 1, city: 'Mumbai, India', status: 'Active' },
    { id: 'CUST-003', name: 'Jean-Luc Picard', email: 'picard@enterprise.org', phone: '+33 1 42 68 55 00', totalApps: 2, city: 'Paris, France', status: 'Active' },
    { id: 'CUST-004', name: 'Elena Rostova', email: 'elena.r@yandex.ru', phone: '+7 495 123-4567', totalApps: 1, city: 'Moscow, Russia', status: 'Inactive' },
  ]

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    { key: 'id', header: 'Customer ID', render: (val) => <span className="font-semibold text-main">{val}</span> },
    { key: 'name', header: 'Full Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'city', header: 'Location' },
    { key: 'totalApps', header: 'Visa Apps' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            val === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/customers/edit/${row.id}`)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main">Customer Accounts</h1>
          <p className="text-sm text-muted mt-1">Manage verified CRM clients and their immigration portfolios</p>
        </div>
        <Button onClick={() => navigate('/customers/add')} variant="primary" size="md">+ Add New Customer</Button>
      </div>

      <div className="flex bg-surface p-4 rounded-xl border border-border">
        <input
          type="text"
          placeholder="Search by customer name, email, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="crm-input"
        />
      </div>

      <Table columns={columns} data={filtered} />
    </div>
  )
}

export default Customers
