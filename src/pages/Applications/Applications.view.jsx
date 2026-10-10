import React, { useState, useMemo } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Table from '../../components/Table/Table.component'
import Button from '../../components/Button/Button.component'
import Pagination from '../../components/Pagination/Pagination.component'
import ROUTES from '../../config/routes'
import { getStatusBadgeStyle } from '../../utils/helpers'
import usePermission from '../../hooks/usePermission'

export const Applications = () => {
  const navigate = useNavigate()
  const { isRole, can } = usePermission()

  if (isRole('ADMIN', 'SUPER_ADMIN') || !can('applications:view')) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  // Main Category Tab: 'VISA' | 'HOLIDAY'
  const [categoryTab, setCategoryTab] = useState('VISA')

  // Sub-Status Filter Tab & Search Query
  const [activeSubTab, setActiveSubTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // 1. Visa Applications Dataset
  const visaApplications = [
    { id: 'APP-901', applicant: 'Emma Watson', country: 'United Kingdom', visaType: 'Standard Visitor Visa', officer: 'Officer Davies', status: 'Under_Review', date: '2026-10-04' },
    { id: 'APP-902', applicant: 'Carlos Mendoza', country: 'Canada', visaType: 'Work Permit (LMIA)', officer: 'Officer Tremblay', status: 'Approved', date: '2026-10-03' },
    { id: 'APP-903', applicant: 'Amina Al-Mansoor', country: 'France (Schengen)', visaType: 'Business Visit', officer: 'Officer Dubois', status: 'Pending', date: '2026-10-02' },
    { id: 'APP-904', applicant: 'Liam O’Connor', country: 'United States', visaType: 'B1/B2 Visitor', officer: 'Officer Miller', status: 'Approved', date: '2026-10-01' },
    { id: 'APP-905', applicant: 'Rahul Verma', country: 'United States', visaType: 'B1/B2 Visitor', officer: 'Officer Sharma', status: 'Pending', date: '2026-09-29' },
    { id: 'APP-906', applicant: 'Sofia Chen', country: 'Japan', visaType: 'Business Visit', officer: 'Officer Sato', status: 'Under_Review', date: '2026-09-28' },
    { id: 'APP-907', applicant: 'Tariq Al-Mansouri', country: 'UAE', visaType: 'Golden Visa Investor', officer: 'Officer Al-Hassan', status: 'Approved', date: '2026-09-25' },
    { id: 'APP-908', applicant: 'Ananya Roy', country: 'Canada', visaType: 'Student Visa (PAL)', officer: 'Officer Miller', status: 'Under_Review', date: '2026-09-20' },
    { id: 'APP-909', applicant: 'Elena Rostova', country: 'Germany', visaType: 'Student Exchange Visa', officer: 'Officer Mueller', status: 'Approved', date: '2026-09-18' },
    { id: 'APP-910', applicant: 'Marcus Vance', country: 'Italy', visaType: 'Schengen Tourist', officer: 'Officer Davies', status: 'Pending', date: '2026-09-15' },
    { id: 'APP-911', applicant: 'Kenji Sato', country: 'Singapore', visaType: 'Work Permit', officer: 'Officer Sato', status: 'Under_Review', date: '2026-09-12' },
    { id: 'APP-912', applicant: 'David Miller', country: 'Australia', visaType: 'Subclass 600 Tourist', officer: 'Officer Miller', status: 'Approved', date: '2026-09-10' },
  ]

  // 2. Holiday Package Applications Dataset
  const holidayApplications = [
    { id: 'HOL-301', title: 'Swiss Alps Luxury Tour', destination: 'Switzerland', traveler: 'Sarah Jenkins', duration: '7 Nights / 8 Days', price: '$3,450', status: 'Confirmed', date: '2026-10-05' },
    { id: 'HOL-302', title: 'Bali Beach & Cultural Escape', destination: 'Indonesia', traveler: 'Michael Chang', duration: '5 Nights / 6 Days', price: '$1,890', status: 'Under_Booking', date: '2026-10-04' },
    { id: 'HOL-303', title: 'Tokyo & Kyoto Cherry Blossom', destination: 'Japan', traveler: 'David Vance', duration: '9 Nights / 10 Days', price: '$4,200', status: 'Pending_Payment', date: '2026-10-03' },
    { id: 'HOL-304', title: 'Paris & French Riviera Special', destination: 'France', traveler: 'Elena Rostova', duration: '6 Nights / 7 Days', price: '$2,950', status: 'Confirmed', date: '2026-10-01' },
    { id: 'HOL-305', title: 'Dubai Desert Safari & Luxury Stay', destination: 'UAE', traveler: 'Marcus Vance', duration: '4 Nights / 5 Days', price: '$2,100', status: 'Confirmed', date: '2026-09-28' },
    { id: 'HOL-306', title: 'Maldives Overwater Villa Getaway', destination: 'Maldives', traveler: 'Fatima Zahra', duration: '5 Nights / 6 Days', price: '$5,600', status: 'Under_Booking', date: '2026-09-26' },
    { id: 'HOL-307', title: 'Rome & Amalfi Coast Experience', destination: 'Italy', traveler: 'Arthur Dent', duration: '8 Nights / 9 Days', price: '$3,800', status: 'Pending_Payment', date: '2026-09-22' },
    { id: 'HOL-308', title: 'Santorini Sunset Island Hopping', destination: 'Greece', traveler: 'Claire Redfield', duration: '6 Nights / 7 Days', price: '$2,650', status: 'Confirmed', date: '2026-09-20' },
  ]

  // Sub-status tabs config per category
  const visaSubTabs = [
    { label: 'All Cases', value: 'ALL' },
    { label: 'Under Review', value: 'Under_Review' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Pending Action', value: 'Pending' },
  ]

  const holidaySubTabs = [
    { label: 'All Bookings', value: 'ALL' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Under Booking', value: 'Under_Booking' },
    { label: 'Pending Payment', value: 'Pending_Payment' },
  ]

  const currentSubTabs = categoryTab === 'VISA' ? visaSubTabs : holidaySubTabs
  const currentDataset = categoryTab === 'VISA' ? visaApplications : holidayApplications

  // Filtered dataset
  const filteredData = useMemo(() => {
    return currentDataset.filter((item) => {
      // Match Sub-Tab
      const matchesTab = activeSubTab === 'ALL' || item.status === activeSubTab

      // Match Search
      const query = searchQuery.toLowerCase().trim()
      if (!query) return matchesTab

      if (categoryTab === 'VISA') {
        return (
          matchesTab &&
          (item.id.toLowerCase().includes(query) ||
            item.applicant.toLowerCase().includes(query) ||
            item.country.toLowerCase().includes(query) ||
            item.visaType.toLowerCase().includes(query) ||
            item.officer.toLowerCase().includes(query))
        )
      } else {
        return (
          matchesTab &&
          (item.id.toLowerCase().includes(query) ||
            item.title.toLowerCase().includes(query) ||
            item.destination.toLowerCase().includes(query) ||
            item.traveler.toLowerCase().includes(query))
        )
      }
    })
  }, [categoryTab, activeSubTab, searchQuery, currentDataset])

  // Total Pages computation
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage))

  // Paginated dataset slice
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredData.slice(start, start + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  // Visa Table Columns
  const visaColumns = [
    { key: 'id', header: 'Application ID', render: (val) => <span className="font-bold text-main">{val}</span> },
    {
      key: 'applicant',
      header: 'Applicant Name',
      render: (val) => <span className="font-semibold text-main">{val}</span>,
    },
    { key: 'country', header: 'Country' },
    { key: 'visaType', header: 'Visa Type' },
    { key: 'officer', header: 'Case Officer' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => {
        const badge = getStatusBadgeStyle(val)
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${badge.badge}`} />
            {val.replace('_', ' ')}
          </span>
        )
      },
    },
    { key: 'date', header: 'Submission Date' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/applications/edit/${row.id}`)
          }}
          className="text-xs font-semibold text-primary hover:text-primary-hover underline cursor-pointer"
        >
          Edit
        </button>
      ),
    },
  ]

  // Holiday Table Columns
  const holidayColumns = [
    { key: 'id', header: 'Booking ID', render: (val) => <span className="font-bold text-main">{val}</span> },
    {
      key: 'title',
      header: 'Package Title / Destination',
      render: (val, row) => (
        <div>
          <span className="font-bold text-main block">{val}</span>
          <span className="text-[11px] text-muted">{row.destination}</span>
        </div>
      ),
    },
    {
      key: 'traveler',
      header: 'Primary Traveler',
      render: (val) => <span className="font-semibold text-main">{val}</span>,
    },
    { key: 'duration', header: 'Duration' },
    { key: 'price', header: 'Total Price', render: (val) => <span className="font-bold text-emerald-700">{val}</span> },
    {
      key: 'status',
      header: 'Booking Status',
      render: (val) => {
        let badgeStyle = 'bg-emerald-100 text-emerald-800'
        if (val === 'Under_Booking') badgeStyle = 'bg-blue-100 text-blue-800'
        if (val === 'Pending_Payment') badgeStyle = 'bg-amber-100 text-amber-800'

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeStyle}`}>
            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current" />
            {val.replace('_', ' ')}
          </span>
        )
      },
    },
    { key: 'date', header: 'Booking Date' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/applications/edit/${row.id}`)
          }}
          className="text-xs font-semibold text-primary hover:text-primary-hover underline cursor-pointer"
        >
          Edit
        </button>
      ),
    },
  ]

  // Handle Category Tab Switch
  const handleCategorySwitch = (cat) => {
    setCategoryTab(cat)
    setActiveSubTab('ALL')
    setSearchQuery('')
    setCurrentPage(1)
  }

  // Handle Sub-Status Tab Switch
  const handleSubTabSwitch = (tabValue) => {
    setActiveSubTab(tabValue)
    setCurrentPage(1)
  }

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-3 pb-6">
      {/* -------------------------------------------------------------------- */}
      {/* 1. HEADER SECTION                                                    */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-main tracking-tight">Applications & Bookings</h1>
          <p className="text-[11px] text-muted mt-0.5">
            Manage visa filings, embassy cases, and holiday package bookings
          </p>
        </div>

        <Button
          onClick={() => navigate(categoryTab === 'VISA' ? '/applications/add' : ROUTES.HOLIDAYS_ADD)}
          variant="primary"
          size="sm"
        >
          {categoryTab === 'VISA' ? '+ New Visa Application' : '+ New Holiday Booking'}
        </Button>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. MAIN UPPER CATEGORY TABS (VISA vs HOLIDAY)                        */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-surface rounded-lg border border-border p-1.5 sm:p-2 shadow-2xs">
        <div className="flex items-center justify-between gap-2.5 pb-1.5 border-b border-border/60">
          {/* Main Category Selector Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200">
            {/* Visa Applications Tab */}
            <button
              type="button"
              onClick={() => handleCategorySwitch('VISA')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${categoryTab === 'VISA'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Visa Applications</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${categoryTab === 'VISA' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                {visaApplications.length}
              </span>
            </button>

            {/* Holiday Applications Tab */}
            <button
              type="button"
              onClick={() => handleCategorySwitch('HOLIDAY')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${categoryTab === 'HOLIDAY'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V7a2 2 0 00-2-2h-1.5A2.5 2.5 0 0113 2.5V1" />
              </svg>
              <span>Holiday Applications</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${categoryTab === 'HOLIDAY' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                {holidayApplications.length}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={categoryTab === 'VISA' ? 'Search by ID, applicant...' : 'Search by package, traveler...'}
              className="w-full pl-7 pr-2.5 py-1 text-[11px] rounded-md bg-slate-50 border border-border text-main placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <svg
              className="w-3.5 h-3.5 text-muted absolute left-2 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* -------------------------------------------------------------------- */}
        {/* 3. SUB-STATUS FILTER TABS                                            */}
        {/* -------------------------------------------------------------------- */}
        <div className="flex items-center gap-1 pt-1.5">
          {currentSubTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleSubTabSwitch(tab.value)}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded transition-colors cursor-pointer ${activeSubTab === tab.value
                  ? 'bg-primary/10 text-primary border border-primary/30 font-bold'
                  : 'text-muted hover:bg-slate-100 hover:text-main'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 4. APPLICATIONS TABLE WITH PAGINATION                                */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-surface rounded-lg border border-border p-2.5 sm:p-3 shadow-2xs">
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-border/60">
          <h2 className="text-xs font-bold text-main">
            {categoryTab === 'VISA' ? 'Visa Application Filings' : 'Holiday Tour Bookings'}
          </h2>
          <span className="text-[10px] text-muted font-medium">
            Showing {paginatedData.length} of {filteredData.length} records
          </span>
        </div>

        {/* Table View */}
        <Table
          columns={categoryTab === 'VISA' ? visaColumns : holidayColumns}
          data={paginatedData}
        />

        {/* Reusable Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onItemsPerPageChange={(size) => setItemsPerPage(size)}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  )
}

export default Applications
