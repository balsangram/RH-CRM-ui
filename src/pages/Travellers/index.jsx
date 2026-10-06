import React, { useState } from 'react'
import Table from '../../components/Table'
import Button from '../../components/Button'

export const Travellers = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const travellers = [
    { id: 'TRV-01', name: 'Robert Downey Jr.', passport: 'Z9821345', nationality: 'United States', expiry: '2029-08-14', customer: 'Robert Downey' },
    { id: 'TRV-02', name: 'Susan Downey', passport: 'Z9821346', nationality: 'United States', expiry: '2030-03-22', customer: 'Robert Downey' },
    { id: 'TRV-03', name: 'Aarav Patel', passport: 'P4567891', nationality: 'India', expiry: '2028-11-05', customer: 'Priya Patel' },
    { id: 'TRV-04', name: 'Jean-Luc Picard', passport: 'F1298456', nationality: 'France', expiry: '2031-01-19', customer: 'Jean-Luc Picard' },
  ]

  const filtered = travellers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.passport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    { key: 'id', header: 'Traveller ID', render: (val) => <span className="font-mono text-xs">{val}</span> },
    { key: 'name', header: 'Full Name', render: (val) => <span className="font-semibold text-slate-900">{val}</span> },
    { key: 'passport', header: 'Passport Number', render: (val) => <span className="font-mono">{val}</span> },
    { key: 'nationality', header: 'Nationality' },
    { key: 'expiry', header: 'Passport Expiry' },
    { key: 'customer', header: 'Linked Customer' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Travellers Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage passport details and travel records for primary applicants and dependents</p>
        </div>
        <Button variant="primary" size="md">+ Add Traveller</Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <input
          type="text"
          placeholder="Search by passport, name, or nationality..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <Table columns={columns} data={filtered} />
    </div>
  )
}

export default Travellers
