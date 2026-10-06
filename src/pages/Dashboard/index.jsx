import React from 'react'
import { Link } from 'react-router-dom'
import ROUTES from '../../config/routes'
import Table from '../../components/Table'
import Button from '../../components/Button'
import { formatCurrency, getStatusBadgeStyle } from '../../utils/helpers'

export const Dashboard = () => {
  const stats = [
    { label: 'Total Leads', value: '1,284', change: '+12.5%', isUp: true, color: 'text-indigo-600' },
    { label: 'Active Customers', value: '842', change: '+8.1%', isUp: true, color: 'text-emerald-600' },
    { label: 'Pending Applications', value: '64', change: '-3.2%', isUp: false, color: 'text-amber-600' },
    { label: 'Revenue This Month', value: formatCurrency(54820), change: '+18.4%', isUp: true, color: 'text-sky-600' },
  ]

  const recentApplications = [
    { id: 'APP-1024', applicant: 'Emma Watson', country: 'United Kingdom', visaType: 'Tourist (Subclass 600)', status: 'Under_Review', date: '2026-10-04' },
    { id: 'APP-1023', applicant: 'Carlos Mendoza', country: 'Canada', visaType: 'Work Permit', status: 'Approved', date: '2026-10-03' },
    { id: 'APP-1022', applicant: 'Amina Al-Mansoor', country: 'Schengen (France)', visaType: 'Business Visit', status: 'Pending', date: '2026-10-02' },
    { id: 'APP-1021', applicant: 'Liam O’Connor', country: 'United States', visaType: 'B1/B2 Visitor', status: 'Approved', date: '2026-10-01' },
  ]

  const columns = [
    { key: 'id', header: 'Application ID', render: (val) => <span className="font-semibold text-slate-900">{val}</span> },
    { key: 'applicant', header: 'Applicant' },
    { key: 'country', header: 'Destination Country' },
    { key: 'visaType', header: 'Visa Type' },
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
    { key: 'date', header: 'Submission Date' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CRM Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time overview of leads, visas, and operations</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to={ROUTES.LEADS}>
            <Button variant="outline" size="sm">View Leads</Button>
          </Link>
          <Link to={ROUTES.APPLICATIONS}>
            <Button variant="primary" size="sm">+ New Application</Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs"
          >
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
              <span className={`text-xs font-semibold ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Applications</h2>
            <p className="text-xs text-slate-500">Latest visa submissions and their progress status</p>
          </div>
          <Link to={ROUTES.APPLICATIONS} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View All &rarr;
          </Link>
        </div>
        <Table columns={columns} data={recentApplications} />
      </div>
    </div>
  )
}

export default Dashboard
