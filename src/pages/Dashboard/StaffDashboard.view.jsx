import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ROUTES from '../../config/routes'
import StatCard from '../../components/Card/StatCard.component'
import Table from '../../components/Table/Table.component'
import Button from '../../components/Button/Button.component'
import { getStatusBadgeStyle } from '../../utils/helpers'
import useAuth from '../../hooks/useAuth'

export const StaffDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)
  const [editModalApp, setEditModalApp] = useState(null)
  const [editStatus, setEditStatus] = useState('')
  const [editNotes, setEditNotes] = useState('')

  // Staff member name & ID
  const staffName = user?.name || 'sipu Sharma'
  const staffId = user?.id || 'usr_staff_01'

  // Master applications list assigned specifically to this staff member
  const [assignedApplications, setAssignedApplications] = useState([
    {
      id: 'APP-801',
      applicant: 'Amina Al-Mansoor',
      email: 'amina.m@example.com',
      phone: '+971 50 123 4567',
      applicationType: 'Schengen Business Visa',
      country: 'France',
      passportNo: 'A8942104',
      assignedDate: '2026-10-05',
      status: 'Active', // Active / Processing
      subStatus: 'Under Review',
      lastUpdated: '2026-10-08 11:30 AM',
      officer: staffName,
      officerNotes: 'Client submitted hotel voucher. Awaiting bank statement endorsement.',
    },
    {
      id: 'APP-802',
      applicant: 'Carlos Mendoza',
      email: 'carlos.m@example.com',
      phone: '+1 416 555 0192',
      applicationType: 'Work Permit (LMIA)',
      country: 'Canada',
      passportNo: 'C9921458',
      assignedDate: '2026-10-04',
      status: 'Active',
      subStatus: 'Under Review',
      lastUpdated: '2026-10-08 10:15 AM',
      officer: staffName,
      officerNotes: 'LMIA approval copy received. Submitting VFS biometric appointment.',
    },
    {
      id: 'APP-803',
      applicant: 'Emma Watson',
      email: 'emma.w@example.co.uk',
      phone: '+44 7700 900077',
      applicationType: 'Standard Visitor Visa',
      country: 'United Kingdom',
      passportNo: 'UK774120',
      assignedDate: '2026-10-03',
      status: 'Pending',
      subStatus: 'Pending Review',
      lastUpdated: '2026-10-07 04:45 PM',
      officer: staffName,
      officerNotes: 'Waiting for applicant to upload recent 6-month bank statements.',
    },
    {
      id: 'APP-804',
      applicant: 'Rahul Verma',
      email: 'rahul.v@example.com',
      phone: '+91 98765 43210',
      applicationType: 'B1/B2 Tourist Visa',
      country: 'United States',
      passportNo: 'Z4410982',
      assignedDate: '2026-10-02',
      status: 'Pending',
      subStatus: 'Pending Action',
      lastUpdated: '2026-10-07 02:20 PM',
      officer: staffName,
      officerNotes: 'DS-160 draft completed. Needs confirmation on interview location.',
    },
    {
      id: 'APP-805',
      applicant: 'Elena Rostova',
      email: 'elena.r@example.com',
      phone: '+49 30 123456',
      applicationType: 'Student Exchange Visa',
      country: 'Germany',
      passportNo: 'D5581203',
      assignedDate: '2026-10-01',
      status: 'Completed',
      subStatus: 'Approved',
      lastUpdated: '2026-10-06 05:10 PM',
      officer: staffName,
      officerNotes: 'Visa stamped successfully. Passport dispatched via DHL.',
    },
    {
      id: 'APP-806',
      applicant: 'David Miller',
      email: 'david.m@example.com',
      phone: '+1 212 555 0144',
      applicationType: 'Subclass 600 Tourist',
      country: 'Australia',
      passportNo: 'US9812401',
      assignedDate: '2026-09-28',
      status: 'Completed',
      subStatus: 'Approved',
      lastUpdated: '2026-10-05 01:15 PM',
      officer: staffName,
      officerNotes: 'Grant notice received from Australian Home Affairs.',
    },
    {
      id: 'APP-807',
      applicant: 'Tariq Al-Mansouri',
      email: 'tariq.a@example.com',
      phone: '+971 55 987 6543',
      applicationType: 'Golden Visa Investor',
      country: 'UAE',
      passportNo: 'E1049281',
      assignedDate: '2026-09-26',
      status: 'Active',
      subStatus: 'Under Review',
      lastUpdated: '2026-10-05 11:00 AM',
      officer: staffName,
      officerNotes: 'Medical check cleared. Awaiting Emirates ID issue.',
    },
    {
      id: 'APP-808',
      applicant: 'Sofia Chen',
      email: 'sofia.c@example.com',
      phone: '+65 9123 4567',
      applicationType: 'Business Visit Visa',
      country: 'Japan',
      passportNo: 'SG881204',
      assignedDate: '2026-09-25',
      status: 'Active',
      subStatus: 'Under Review',
      lastUpdated: '2026-10-04 03:40 PM',
      officer: staffName,
      officerNotes: 'Guarantor letter verified by Tokyo office.',
    },
    {
      id: 'APP-809',
      applicant: 'Marcus Vance',
      email: 'marcus.v@example.com',
      phone: '+44 20 7946 0912',
      applicationType: 'Schengen Tourist',
      country: 'Italy',
      passportNo: 'UK551299',
      assignedDate: '2026-09-24',
      status: 'Pending',
      subStatus: 'Pending Action',
      lastUpdated: '2026-10-03 09:30 AM',
      officer: staffName,
      officerNotes: 'Travel insurance policy uploaded needs verification.',
    },
    {
      id: 'APP-810',
      applicant: 'Fatima Zahra',
      email: 'fatima.z@example.com',
      phone: '+212 661 123456',
      applicationType: 'Family Visit Visa',
      country: 'Spain',
      passportNo: 'M1294821',
      assignedDate: '2026-09-22',
      status: 'Active',
      subStatus: 'Under Review',
      lastUpdated: '2026-10-02 04:00 PM',
      officer: staffName,
      officerNotes: 'Embassy interview scheduled for Oct 12.',
    },
    {
      id: 'APP-811',
      applicant: 'Kenji Sato',
      email: 'kenji.s@example.jp',
      phone: '+81 90 1234 5678',
      applicationType: 'Work Permit',
      country: 'Singapore',
      passportNo: 'JP4410291',
      assignedDate: '2026-09-20',
      status: 'Pending',
      subStatus: 'Pending Action',
      lastUpdated: '2026-10-01 10:20 AM',
      officer: staffName,
      officerNotes: 'EP Online submission pending employer declaration.',
    },
    {
      id: 'APP-812',
      applicant: 'Ananya Roy',
      email: 'ananya.r@example.com',
      phone: '+91 98200 12345',
      applicationType: 'Student Visa',
      country: 'Canada',
      passportNo: 'Z1092841',
      assignedDate: '2026-09-18',
      status: 'Active',
      subStatus: 'Under Review',
      lastUpdated: '2026-09-30 02:15 PM',
      officer: staffName,
      officerNotes: 'PAL letter attached. Biometric instruction letter issued.',
    },
  ])

  // Summary Metrics computed from assigned applications only
  const metrics = useMemo(() => {
    const total = assignedApplications.length
    const active = assignedApplications.filter((a) => a.status === 'Active').length
    const pending = assignedApplications.filter((a) => a.status === 'Pending').length
    const completed = assignedApplications.filter((a) => a.status === 'Completed').length

    return { total, active, pending, completed }
  }, [assignedApplications])

  // Filtered applications list
  const filteredApps = useMemo(() => {
    return assignedApplications.filter((app) => {
      // Filter by tab status
      const matchesFilter =
        activeFilter === 'ALL' ||
        (activeFilter === 'Active' && app.status === 'Active') ||
        (activeFilter === 'Pending' && app.status === 'Pending') ||
        (activeFilter === 'Completed' && app.status === 'Completed')

      // Filter by search query
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        app.id.toLowerCase().includes(query) ||
        app.applicant.toLowerCase().includes(query) ||
        app.applicationType.toLowerCase().includes(query) ||
        app.country.toLowerCase().includes(query)

      return matchesFilter && matchesSearch
    })
  }, [assignedApplications, activeFilter, searchQuery])

  // Top 10 Recent Applications to display on dashboard
  const recentTenApps = useMemo(() => {
    return filteredApps.slice(0, 10)
  }, [filteredApps])

  // Open Edit Modal
  const handleOpenEdit = (app) => {
    setEditModalApp(app)
    setEditStatus(app.status)
    setEditNotes(app.officerNotes || '')
  }

  // Save Edit Changes
  const handleSaveEdit = () => {
    if (!editModalApp) return
    setAssignedApplications((prev) =>
      prev.map((item) =>
        item.id === editModalApp.id
          ? {
              ...item,
              status: editStatus,
              subStatus: editStatus === 'Active' ? 'Under Review' : editStatus === 'Pending' ? 'Pending Action' : 'Approved',
              officerNotes: editNotes,
              lastUpdated: `${new Date().toISOString().split('T')[0]} Just now`,
            }
          : item
      )
    )
    setEditModalApp(null)
  }

  // Table Column Definitions
  const columns = [
    {
      key: 'id',
      header: 'Application ID',
      render: (val, row) => (
        <button
          type="button"
          onClick={() => setSelectedApp(row)}
          className="font-bold text-primary hover:text-primary-hover hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>{val}</span>
        </button>
      ),
    },
    {
      key: 'applicant',
      header: 'Applicant Name',
      render: (val, row) => (
        <div>
          <span className="font-bold text-main block">{val}</span>
          <span className="text-[11px] text-muted">{row.email}</span>
        </div>
      ),
    },
    {
      key: 'applicationType',
      header: 'Application Type',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-main block text-xs">{val}</span>
          <span className="text-[11px] text-muted font-medium">{row.country}</span>
        </div>
      ),
    },
    {
      key: 'assignedDate',
      header: 'Assigned Date',
      render: (val) => <span className="text-xs text-muted font-medium">{val}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val, row) => {
        let badgeBg = 'bg-[#2E2B6E]/10 text-[#2E2B6E]'
        let badgeDot = 'bg-[#2E2B6E]'

        if (val === 'Active') {
          badgeBg = 'bg-blue-500/10 text-blue-700 border border-blue-200'
          badgeDot = 'bg-blue-600'
        } else if (val === 'Pending') {
          badgeBg = 'bg-amber-500/10 text-amber-700 border border-amber-200'
          badgeDot = 'bg-amber-500'
        } else if (val === 'Completed') {
          badgeBg = 'bg-emerald-500/10 text-emerald-700 border border-emerald-200'
          badgeDot = 'bg-emerald-500'
        }

        return (
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badgeBg}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${badgeDot}`} />
              {row.subStatus || val}
            </span>
          </div>
        )
      },
    },
    {
      key: 'lastUpdated',
      header: 'Last Updated',
      render: (val) => <span className="text-[11px] text-muted">{val}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedApp(row)
            }}
            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            View
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleOpenEdit(row)
            }}
            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
          >
            Edit
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4 pb-6">
      {/* -------------------------------------------------------------------- */}
      {/* PAGE HEADER & WELCOME GREETING                                       */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-[#181445] via-[#2E2B6E] to-[#181445] text-white shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 text-[8px] font-bold rounded-full bg-[#E11D2E] text-white uppercase tracking-wider">
              Staff / Agent Portal
            </span>
            <span className="text-[10px] text-white/70">● Assigned Cases Only</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
            Welcome back, {staffName} 👋
          </h1>
          <p className="text-[10px] text-white/80 leading-tight">
            Overview of visa filings, case processing statuses, and assigned applications.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">{staffName}</p>
            <p className="text-[9px] text-white/70">Case Officer ({staffId})</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xs text-white shadow-inner">
            PS
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 4 SUMMARY CARDS (Clicking any card navigates to Applications tab)    */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        {/* Card 1: Total Assigned Applications */}
        <StatCard
          title="Total Assigned Applications"
          value={metrics.total}
          subtitle="All cases assigned to you"
          color="indigo"
          to={ROUTES.APPLICATIONS}
          icon={
            <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />

        {/* Card 2: Active Applications */}
        <StatCard
          title="Active Applications"
          value={metrics.active}
          subtitle="Currently processing / Under review"
          color="primary"
          to={ROUTES.APPLICATIONS}
          icon={
            <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />

        {/* Card 3: Pending Applications */}
        <StatCard
          title="Pending Applications"
          value={metrics.pending}
          subtitle="Waiting for action / client documents"
          color="amber"
          to={ROUTES.APPLICATIONS}
          icon={
            <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* Card 4: Completed Applications */}
        <StatCard
          title="Completed Applications"
          value={metrics.completed}
          subtitle="Approved & dispatched cases"
          color="emerald"
          to={ROUTES.APPLICATIONS}
          icon={
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* FILTER BAR & SEARCH INPUT                                            */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-surface rounded-lg border border-border p-2.5 sm:p-3 shadow-2xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, applicant name..."
              className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-slate-50 border border-border text-main placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <svg
              className="w-3.5 h-3.5 text-muted absolute left-2.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* -------------------------------------------------------------------- */}
        {/* RECENT APPLICATIONS TABLE (Top 10 Recent Assigned Applications)       */}
        {/* -------------------------------------------------------------------- */}
        <div>
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-border/60">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-main">Recent Assigned Applications</h2>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[9px] font-bold">
                Top 10 Recent
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate(ROUTES.APPLICATIONS)}
              className="text-[11px] font-semibold text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer transition-colors group"
            >
              <span>View All Applications</span>
              <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <Table columns={columns} data={recentTenApps} />
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* VIEW APPLICATION DETAIL MODAL                                        */}
      {/* -------------------------------------------------------------------- */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-primary/10 text-primary">
                  {selectedApp.id}
                </span>
                <h3 className="text-lg font-bold text-main mt-1">{selectedApp.applicant}</h3>
                <p className="text-xs text-muted">{selectedApp.applicationType} • {selectedApp.country}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-muted block text-[10px]">Email Address</span>
                <span className="font-bold text-main">{selectedApp.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-muted block text-[10px]">Phone Number</span>
                <span className="font-bold text-main">{selectedApp.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-muted block text-[10px]">Passport No.</span>
                <span className="font-bold text-main">{selectedApp.passportNo}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-muted block text-[10px]">Assigned Date</span>
                <span className="font-bold text-main">{selectedApp.assignedDate}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-muted block text-[10px] font-bold uppercase">Case Officer Notes</span>
              <p className="text-xs text-main font-medium">{selectedApp.officerNotes || 'No notes added yet.'}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const appToEdit = selectedApp
                  setSelectedApp(null)
                  handleOpenEdit(appToEdit)
                }}
              >
                Edit Application
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* EDIT APPLICATION MODAL                                               */}
      {/* -------------------------------------------------------------------- */}
      {editModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-main">Edit Application: {editModalApp.id}</h3>
                <p className="text-xs text-muted">{editModalApp.applicant} ({editModalApp.country})</p>
              </div>
              <button
                type="button"
                onClick={() => setEditModalApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-main mb-1">Update Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-border text-main focus:outline-none focus:border-primary"
                >
                  <option value="Active">Active (Under Review)</option>
                  <option value="Pending">Pending (Action Required)</option>
                  <option value="Completed">Completed (Approved)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-main mb-1">Case Officer Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-border text-main placeholder-muted focus:outline-none focus:border-primary"
                  placeholder="Enter notes about document verification, embassy appointment, etc..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setEditModalApp(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffDashboard
