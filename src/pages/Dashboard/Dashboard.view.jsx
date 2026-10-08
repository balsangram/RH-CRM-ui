import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ROUTES from '../../config/routes'
import { StatCard } from '../../components/Card/StatCard.component'
import { LeadAnalyticsChart, LeadSourceBreakdownChart } from '../../components/Charts'
import Table from '../../components/Table/Table.component'
import Button from '../../components/Button/Button.component'

export const Dashboard = () => {
  const navigate = useNavigate()

  // Sample data for summary cards
  const summaryMetrics = [
    {
      title: 'Total Companies',
      value: '148',
      change: '8.2%',
      isUp: true,
      viewAllLink: ROUTES.CUSTOMERS,
      color: 'indigo',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h5m-5 0V11m0 10V11m0 0h5m-5 0H7" />
        </svg>
      ),
    },
    {
      title: 'Total Travelers',
      value: '3,842',
      change: '14.5%',
      isUp: true,
      viewAllLink: ROUTES.TRAVELLERS,
      color: 'primary',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'Total Staffs',
      value: '46',
      change: '+4 new',
      isUp: true,
      viewAllLink: ROUTES.EMPLOYEES,
      color: 'red',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
    },
    {
      title: 'Total Leads',
      value: '1,290',
      change: '18.7%',
      isUp: true,
      viewAllLink: ROUTES.LEADS,
      color: 'emerald',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ]

  // 5 Recent Leads
  const recentLeads = [
    {
      id: 'LD-501',
      name: 'Alexander Wright',
      company: 'Apex Logistics Ltd',
      email: 'alex.wright@apex.co.uk',
      phone: '+44 7700 900077',
      country: 'United Kingdom',
      leadType: 'Holiday',
      source: 'Website',
      status: 'New',
    },
    {
      id: 'LD-502',
      name: 'Sophia Martinez',
      company: 'Innovate Tech Corp',
      email: 's.martinez@innovatetech.ca',
      phone: '+1 416 555 0192',
      country: 'Canada',
      leadType: 'Visa',
      source: 'Referral',
      status: 'Contacted',
    },
    {
      id: 'LD-503',
      name: 'David Chen',
      company: 'Pacific Ocean Trading',
      email: 'david.chen@pacifictrade.sg',
      phone: '+65 6789 0123',
      country: 'Singapore',
      leadType: 'Visa',
      source: 'Partner',
      status: 'In Discussion',
    },
    {
      id: 'LD-504',
      name: 'Elena Rostova',
      company: 'EuroConsulting GmbH',
      email: 'elena.rostova@euroconsult.de',
      phone: '+49 30 123456',
      country: 'Germany',
      leadType: 'Holiday',
      source: 'Direct',
      status: 'Converted',
    },
    {
      id: 'LD-505',
      name: 'Michael Brown',
      company: 'Global Health Inc',
      email: 'm.brown@globalhealth.us',
      phone: '+1 212 555 0144',
      country: 'United States',
      leadType: 'Visa',
      source: 'Website',
      status: 'New',
    },
  ]

  // Columns for Recent Leads Table
  const recentLeadsColumns = [
    {
      key: 'name',
      header: 'Lead Name',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-main leading-tight">{val}</p>
          <p className="text-[11px] text-muted">{row.id}</p>
        </div>
      ),
    },
    { key: 'company', header: 'Company Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone Number' },
    { key: 'country', header: 'Country' },
    {
      key: 'leadType',
      header: 'Lead Type',
      render: (val) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            val === 'Holiday'
              ? 'bg-purple-100 text-purple-700 border border-purple-200'
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}
        >
          {val}
        </span>
      ),
    },
    { key: 'source', header: 'Source' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => {
        const badgeColors = {
          New: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          Contacted: 'bg-amber-100 text-amber-800 border-amber-200',
          'In Discussion': 'bg-sky-100 text-sky-800 border-sky-200',
          Converted: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        }
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
              badgeColors[val] || 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {val}
          </span>
        )
      },
    },
    {
      key: 'action',
      header: 'Action',
      render: (_, row) => (
        <button
          onClick={() => navigate(ROUTES.LEADS)}
          className="text-[11px] font-semibold text-primary hover:text-primary-hover hover:underline"
        >
          View
        </button>
      ),
    },
  ]

  // 5 Recent Rejected Applications
  const rejectedApplications = [
    {
      id: 'APP-890',
      applicant: 'Lucas Dubois',
      type: 'Schengen Business Visa',
      country: 'France',
      rejectionDate: '2026-10-07',
      reason: 'Incomplete financial proof & hotel vouchers',
      status: 'Rejected',
    },
    {
      id: 'APP-886',
      applicant: 'Fatima Al-Zahra',
      type: 'UK Visitor Visa',
      country: 'United Kingdom',
      rejectionDate: '2026-10-06',
      reason: 'Passport validity less than 6 months',
      status: 'Rejected',
    },
    {
      id: 'APP-881',
      applicant: 'Vikram Sharma',
      type: 'Canada Work Permit (LMIA)',
      country: 'Canada',
      rejectionDate: '2026-10-05',
      reason: 'LMIA approval document expired',
      status: 'Rejected',
    },
    {
      id: 'APP-874',
      applicant: 'Klaus Mueller',
      type: 'US B1/B2 Tourist Visa',
      country: 'United States',
      rejectionDate: '2026-10-04',
      reason: 'Section 214(b) insufficient ties to home country',
      status: 'Rejected',
    },
    {
      id: 'APP-869',
      applicant: 'Mei Lin',
      type: 'Australia Tourist (Subclass 600)',
      country: 'Australia',
      rejectionDate: '2026-10-03',
      reason: 'Missing travel insurance verification',
      status: 'Rejected',
    },
  ]

  // Columns for Recent Rejected Applications Table
  const rejectedColumns = [
    {
      key: 'id',
      header: 'Application ID',
      render: (val) => <span className="font-bold text-main">{val}</span>,
    },
    { key: 'applicant', header: 'Applicant Name' },
    { key: 'type', header: 'Application Type' },
    { key: 'country', header: 'Country' },
    { key: 'rejectionDate', header: 'Rejection Date' },
    {
      key: 'reason',
      header: 'Rejection Reason',
      render: (val) => (
        <span className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md font-medium block max-w-xs truncate">
          {val}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: () => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-1.5" />
          Rejected
        </span>
      ),
    },
    {
      key: 'view',
      header: 'View',
      render: (_, row) => (
        <button
          onClick={() => navigate(ROUTES.APPLICATIONS)}
          className="text-[11px] font-semibold text-secondary hover:text-secondary-hover hover:underline"
        >
          View Details
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-5 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-main tracking-tight">Super Admin Dashboard</h1>
          <p className="text-xs text-muted mt-0.5">
            Overall CRM overview, lead intelligence, and application statuses
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link to={ROUTES.LEADS}>
            <Button variant="outline" size="sm">
              Manage Leads
            </Button>
          </Link>
          <Link to={ROUTES.APPLICATIONS}>
            <Button variant="primary" size="sm">
              + New Application
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Compact Summary Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {summaryMetrics.map((metric, idx) => (
          <StatCard
            key={idx}
            title={metric.title}
            subtitle={metric.subtitle}
            value={metric.value}
            change={metric.change}
            isUp={metric.isUp}
            icon={metric.icon}
            viewAllLink={metric.viewAllLink}
            color={metric.color}
          />
        ))}
      </div>

      {/* 2. Interactive Lead Graphs Section (Compact 2-Column Grid Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Bar Analytics Chart (2 columns wide) */}
        <div className="lg:col-span-2">
          <LeadAnalyticsChart />
        </div>

        {/* Lead Source Radial Concentric Breakdown Chart (1 column wide) */}
        <div className="lg:col-span-1">
          <LeadSourceBreakdownChart />
        </div>
      </div>

      {/* 3. Recent Leads Table Section */}
      <div className="bg-surface rounded-2xl border border-border p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-main">Recent Leads</h2>
            <p className="text-[11px] text-muted">The 5 most recent lead inquiries received</p>
          </div>
          <Link
            to={ROUTES.LEADS}
            className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
          >
            <span>View All Leads</span>
            <span>&rarr;</span>
          </Link>
        </div>
        <Table columns={recentLeadsColumns} data={recentLeads} />
      </div>

      {/* 4. Recent Rejected Applications Section */}
      <div className="bg-surface rounded-2xl border border-border p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h2 className="text-base font-bold text-rose-950 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              Recent Rejected Applications
            </h2>
            <p className="text-[11px] text-muted">Recently rejected visa applications requiring review</p>
          </div>
          <Link
            to={ROUTES.APPLICATIONS}
            className="text-xs font-semibold text-secondary hover:text-secondary-hover flex items-center gap-1"
          >
            <span>View All Applications</span>
            <span>&rarr;</span>
          </Link>
        </div>
        <Table columns={rejectedColumns} data={rejectedApplications} />
      </div>
    </div>
  )
}

export default Dashboard
