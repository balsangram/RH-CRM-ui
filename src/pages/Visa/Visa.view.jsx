import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import Table from '../../components/Table/Table.component'

export const Visa = () => {
  const navigate = useNavigate()
  const visaCategories = [
    { id: 1, country: 'Canada', type: 'Express Entry (PR)', processing: '6 Months', fee: '$1,365 CAD', successRate: '94%' },
    { id: 2, country: 'United Kingdom', type: 'Skilled Worker Visa', processing: '3 Weeks', fee: '£719 GBP', successRate: '96%' },
    { id: 3, country: 'United States', type: 'B1/B2 Visitor Visa', processing: '2 Months', fee: '$185 USD', successRate: '88%' },
    { id: 4, country: 'Schengen (EU)', type: 'Short Stay Uniform Visa', processing: '15 Days', fee: '€90 EUR', successRate: '92%' },
    { id: 5, country: 'Australia', type: 'Subclass 189 Skilled Independent', processing: '5-8 Months', fee: '$4,640 AUD', successRate: '91%' },
  ]

  const columns = [
    { key: 'country', header: 'Country', render: (val) => <span className="font-semibold text-main">{val}</span> },
    { key: 'type', header: 'Visa Category' },
    { key: 'processing', header: 'Avg. Processing Time' },
    { key: 'fee', header: 'Government Fee' },
    {
      key: 'successRate',
      header: 'Success Rate',
      render: (val) => (
        <span className="font-semibold text-emerald-600">
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
            navigate(`/visa/edit/${row.id}`)
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
          <h1 className="text-2xl font-bold text-main">Visa Services & Rules</h1>
          <p className="text-sm text-muted mt-1">Configure supported visa programs, eligibility criteria, and fee structures</p>
        </div>
        <Button onClick={() => navigate('/visa/add')} variant="primary" size="md">+ Add Visa Program</Button>
      </div>

      <Table columns={columns} data={visaCategories} />
    </div>
  )
}

export default Visa
