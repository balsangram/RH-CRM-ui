import React from 'react'
import Button from '../../components/Button'
import Table from '../../components/Table'

export const Visa = () => {
  const visaCategories = [
    { country: 'Canada', type: 'Express Entry (PR)', processing: '6 Months', fee: '$1,365 CAD', successRate: '94%' },
    { country: 'United Kingdom', type: 'Skilled Worker Visa', processing: '3 Weeks', fee: '£719 GBP', successRate: '96%' },
    { country: 'United States', type: 'B1/B2 Visitor Visa', processing: '2 Months', fee: '$185 USD', successRate: '88%' },
    { country: 'Schengen (EU)', type: 'Short Stay Uniform Visa', processing: '15 Days', fee: '€90 EUR', successRate: '92%' },
    { country: 'Australia', type: 'Subclass 189 Skilled Independent', processing: '5-8 Months', fee: '$4,640 AUD', successRate: '91%' },
  ]

  const columns = [
    { key: 'country', header: 'Country', render: (val) => <span className="font-semibold text-slate-900">{val}</span> },
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
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visa Services & Rules</h1>
          <p className="text-sm text-slate-500 mt-1">Configure supported visa programs, eligibility criteria, and fee structures</p>
        </div>
        <Button variant="primary" size="md">+ Add Visa Program</Button>
      </div>

      <Table columns={columns} data={visaCategories} />
    </div>
  )
}

export default Visa
