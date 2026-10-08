import React from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '../../components/Table/Table.component'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'

export const Holidays = () => {
  const navigate = useNavigate()
  const holidays = [
    { id: 'HOL-101', name: 'Swiss Alps Luxury Tour', destination: 'Switzerland', duration: '7 Nights / 8 Days', price: '$3,450', status: 'Active', date: '2026-10-15' },
    { id: 'HOL-102', name: 'Bali Beach & Cultural Escape', destination: 'Indonesia', duration: '5 Nights / 6 Days', price: '$1,890', status: 'Active', date: '2026-10-18' },
    { id: 'HOL-103', name: 'Tokyo & Kyoto Cherry Blossom', destination: 'Japan', duration: '9 Nights / 10 Days', price: '$4,200', status: 'Upcoming', date: '2026-11-01' },
    { id: 'HOL-104', name: 'Paris & French Riviera Special', destination: 'France', duration: '6 Nights / 7 Days', price: '$2,950', status: 'Active', date: '2026-10-22' },
  ]

  const columns = [
    { key: 'id', header: 'Package ID', render: (val) => <span className="font-semibold text-main">{val}</span> },
    { key: 'name', header: 'Package Title' },
    { key: 'destination', header: 'Destination' },
    { key: 'duration', header: 'Duration' },
    { key: 'price', header: 'Starting Price' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            val === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {val}
        </span>
      ),
    },
    { key: 'date', header: 'Departure Date' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/holidays/edit/${row.id}`)
          }}
          className="text-xs font-semibold text-primary hover:text-primary-hover underline cursor-pointer"
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
          <h1 className="text-2xl font-bold text-main">Holiday Packages</h1>
          <p className="text-sm text-muted mt-1">Browse and manage client holiday packages, itineraries, and bookings</p>
        </div>
        <Button onClick={() => navigate(ROUTES.HOLIDAYS_ADD)} variant="primary" size="md">+ Add Holiday Package</Button>
      </div>

      <Table columns={columns} data={holidays} />
    </div>
  )
}

export default Holidays
