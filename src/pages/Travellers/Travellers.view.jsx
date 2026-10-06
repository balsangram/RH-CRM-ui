import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '../../components/Table/Table.component'
import Button from '../../components/Button/Button.component'

export const Travellers = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const travellers = [
    { id: 'TRV-01', name: 'Robert Downey Jr.', passport: 'Z9821345', nationality: 'United States', expiry: '2029-08-14', customer: 'Robert Downey' },
    { id: 'TRV-02', name: 'Susan Downey', passport: 'Z9821346', nationality: 'United States', expiry: '2030-03-22', customer: 'Robert Downey' },
    { id: 'TRV-03', name: 'Aarav Patel', passport: 'K1092384', nationality: 'India', expiry: '2028-11-05', customer: 'Priya Patel' },
    { id: 'TRV-04', name: 'Jean-Luc Picard', passport: 'F8849201', nationality: 'France', expiry: '2031-01-19', customer: 'Jean-Luc Picard' },
  ]

  const filtered = travellers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.passport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    { key: 'id', header: 'ID', render: (val) => <span className="font-semibold text-main">{val}</span> },
    { key: 'name', header: 'Traveller Name' },
    { key: 'passport', header: 'Passport No.' },
    { key: 'nationality', header: 'Nationality' },
    { key: 'expiry', header: 'Passport Expiry' },
    { key: 'customer', header: 'Associated Customer' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/travellers/edit/${row.id}`)
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
          <h1 className="text-2xl font-bold text-main">Traveller Passports</h1>
          <p className="text-sm text-muted mt-1">Manage individual passport profiles under client accounts</p>
        </div>
        <Button onClick={() => navigate('/travellers/add')} variant="primary" size="md">+ Add Traveller</Button>
      </div>

      <div className="flex bg-surface p-4 rounded-xl border border-border">
        <input
          type="text"
          placeholder="Search by traveller name, passport, or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="crm-input"
        />
      </div>

      <Table columns={columns} data={filtered} />
    </div>
  )
}

export default Travellers
