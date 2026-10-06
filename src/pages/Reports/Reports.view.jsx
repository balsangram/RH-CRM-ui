import React from 'react'
import Button from '../../components/Button/Button.component'
import { formatCurrency } from '../../utils/helpers'

export const Reports = () => {
  const metrics = [
    { label: 'Visa Approval Rate', value: '94.2%', sub: 'Across 340 applications this quarter' },
    { label: 'Avg. Application Cycle', value: '38 Days', sub: 'Submission to embassy outcome' },
    { label: 'Customer Conversion', value: '28.4%', sub: 'Lead to retained client conversion' },
    { label: 'Quarterly Revenue', value: formatCurrency(184200), sub: '+21% compared to last quarter' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Operational performance metrics, processing velocity, and revenue</p>
        </div>
        <Button variant="outline" size="md">Export PDF Report</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold uppercase text-slate-400">{m.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{m.value}</p>
            <p className="text-xs text-slate-500 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Performance by Country</h2>
        <p className="text-xs text-slate-500 mb-4">Top destinations by volume and approval speed</p>
        <div className="space-y-4">
          {[
            { country: 'Canada', percent: 85, color: 'bg-indigo-600' },
            { country: 'United Kingdom', percent: 72, color: 'bg-emerald-500' },
            { country: 'Australia', percent: 64, color: 'bg-sky-500' },
            { country: 'Schengen Area', percent: 58, color: 'bg-amber-500' },
            { country: 'United States', percent: 49, color: 'bg-violet-500' },
          ].map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700">{item.country}</span>
                <span className="text-slate-500">{item.percent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports
