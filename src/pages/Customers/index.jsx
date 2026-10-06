import React, { useState } from 'react'
import Table from '../../components/Table'
import Button from '../../components/Button'

export const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const customers = [
    { id: 'CUST-001', name: 'Robert Downey', email: 'robert@downey.io', phone: '+1 202-555-0143', totalApps: 3, city: 'New York, USA', status: 'Active' },
    { id: 'CUST-002', name: 'Priya Patel', email: 'priya.patel@gmail.com', phone: '+91 98200-11223', totalApps: 1, city: 'Mumbai, India', status: 'Active' },
    { id: 'CUST-003', name: 'Jean-Luc Picard', email: 'jean.luc@enterprise.fr', phone: '+33 1-40-50-60-70', totalApps: 2, city: 'Paris, France', status: 'Active' },
    { id: 'CUST-004', name: 'Kavita Nair', email: 'kavita.n@outlook.com', phone: '+971 50-123-4567', totalApps: 4, city: 'Dubai, UAE', status: 'Active' },
  ]

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    { key: 'id', header: 'Customer ID', render: (val) => <span className="font-mono text-xs">{val}</span> },
    {
      key: 'name',
      header: 'Customer',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-900">{val}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone Number' },
    { key: 'city', header: 'Location' },
    { key: 'totalApps', header: 'Applications Count' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => (
        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
          {val}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage verified customer accounts and linked travel profiles</p>
        </div>
        <Button variant="primary" size="md">
          + Add New Customer
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <input
          type="text"
          placeholder="Search by customer name, email or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <Table columns={columns} data={filtered} />
    </div>
  )
}

export default Customers
