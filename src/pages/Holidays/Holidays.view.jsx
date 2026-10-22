import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import holidayCasesService, { HOLIDAY_STAGES } from '../../services/holidayCases'
import ROUTES from '../../config/routes'
import AddPaymentModal from '../../components/Modal/AddPaymentModal.component'
import { downloadApplicationDossier, downloadInvoice } from '../../utils/documentGenerators'
import useAuth from '../../hooks/useAuth'
import Pagination from '../../components/Pagination/Pagination.component'
import CaseStageCard from '../../components/Kanban/CaseStageCard.component'
import CaseDetailsSideDrawer from '../../components/Drawers/CaseDetailsSideDrawer.component'
import masterWorkflowTemplatesService from '../../services/masterWorkflowTemplates'

export const Holidays = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isStaff = user?.role === 'AGENT' || user?.role === 'STAFF'

  // View state: 'kanban' | 'table' (Kanban is active by default as shown in screenshot 1)
  const [viewMode, setViewMode] = useState('kanban')

  // Cases state
  const [cases, setCases] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters state
  const [filterDestination, setFilterDestination] = useState('ALL')
  const [filterOfficer, setFilterOfficer] = useState('ALL')
  const [filterPayment, setFilterPayment] = useState('ALL')
  const [filterStage, setFilterStage] = useState('ALL')
  const [searchBy, setSearchBy] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Side sheet drawer state
  const [selectedCaseId, setSelectedCaseId] = useState(null)
  const [drawerAlert, setDrawerAlert] = useState('')

  // Add Payment Modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  // Full Details Modal state
  const [detailsModalCase, setDetailsModalCase] = useState(null)

  // Add Booking Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const defaultHolidayTpl = masterWorkflowTemplatesService.getTemplates('HOLIDAY')[0]
  const [newBookingForm, setNewBookingForm] = useState({
    customer: '',
    phone: '',
    email: '',
    packageName: defaultHolidayTpl?.name || 'International Luxury Tour',
    category: defaultHolidayTpl?.category || 'INTERNATIONAL_LUXURY',
    templateId: defaultHolidayTpl?.id || null,
    stages: defaultHolidayTpl?.stages || null,
    stage: defaultHolidayTpl?.stages ? defaultHolidayTpl.stages[0]?.id : 'BOOKING_CREATED',
    destination: 'Bali, Indonesia',
    duration: '6 Days / 5 Nights',
    price: defaultHolidayTpl?.defaultFee || 185000,
    paidAmount: 50000,
    paymentType: 'Postpaid',
    departureDate: '2026-11-20',
    officer: 'Priya Singh',
  })

  // Reload cases
  const reloadCases = () => {
    const list = holidayCasesService.getCases()
    setCases(list)
    setIsLoading(false)
  }

  useEffect(() => {
    reloadCases()
  }, [])

  // Selected Case for Drawer
  const selectedCase = useMemo(() => {
    if (!selectedCaseId) return null
    return cases.find((c) => c.id === selectedCaseId) || null
  }, [cases, selectedCaseId])

  // Extract unique destinations and officers
  const uniqueDestinations = useMemo(() => {
    const set = new Set(cases.map((c) => c.destination).filter(Boolean))
    return Array.from(set)
  }, [cases])

  const uniqueOfficers = useMemo(() => {
    const set = new Set(cases.map((c) => c.officer).filter(Boolean))
    return Array.from(set)
  }, [cases])

  // Filter cases assigned to this staff member when logged in as AGENT / STAFF
  // TODO: Later replace with staff-assigned cases API endpoint
  const staffCases = useMemo(() => {
    if (!isStaff) return cases
    const staffName = (user?.name || 'sipu Sharma').toLowerCase().trim()
    const staffId = (user?.id || 'usr_staff_01').toLowerCase().trim()
    return cases.filter((c) => {
      const officer = (c.officer || '').toLowerCase()
      const officerId = (c.officerId || '').toLowerCase()
      const assigned = (c.assignedStaff || '').toLowerCase()
      return (
        officer.includes(staffName) ||
        officerId.includes(staffId) ||
        assigned.includes(staffName) ||
        (staffName.includes('sipu') && (officer.includes('sipu') || officer.includes('priya')))
      )
    })
  }, [cases, isStaff, user])

  // Filtered cases
  const filteredCases = useMemo(() => {
    return staffCases.filter((item) => {
      if (filterStage !== 'ALL' && item.stage !== filterStage) return false
      if (filterDestination !== 'ALL' && item.destination !== filterDestination) return false
      if (filterOfficer !== 'ALL' && item.officer !== filterOfficer) return false
      if (filterPayment !== 'ALL' && item.paymentType !== filterPayment) return false

      const q = searchQuery.toLowerCase().trim()
      if (!q) return true

      if (searchBy === 'CUSTOMER') return item.customer.toLowerCase().includes(q)
      if (searchBy === 'PACKAGE_ID') return item.id.toLowerCase().includes(q)
      if (searchBy === 'DESTINATION') return item.destination.toLowerCase().includes(q)
      if (searchBy === 'OFFICER') return item.officer.toLowerCase().includes(q)

      return (
        item.id.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.packageName.toLowerCase().includes(q) ||
        item.destination.toLowerCase().includes(q) ||
        item.officer.toLowerCase().includes(q) ||
        (item.invoiceRef || '').toLowerCase().includes(q) ||
        (item.phone || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q)
      )
    })
  }, [staffCases, filterStage, filterDestination, filterOfficer, filterPayment, searchBy, searchQuery])

  // Table View Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [filterStage, filterDestination, filterOfficer, filterPayment, searchBy, searchQuery])

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage) || 1
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredCases.slice(start, start + itemsPerPage)
  }, [filteredCases, currentPage, itemsPerPage])

  // Pipeline aggregate statistics
  const pipelineStats = useMemo(() => {
    const totalValue = staffCases.reduce((sum, c) => sum + (Number(c.price) || 0), 0)
    const completedCount = staffCases.filter((c) => c.stage === 'COMPLETED').length
    const inProgressCount = staffCases.filter((c) => c.stage === 'TOUR_IN_PROGRESS').length

    const stageMap = {}
    HOLIDAY_STAGES.forEach((stage) => {
      const stageCases = staffCases.filter((c) => c.stage === stage.id)
      const count = stageCases.length
      const value = stageCases.reduce((sum, c) => sum + (Number(c.price) || 0), 0)
      stageMap[stage.id] = { count, value }
    })

    return { totalValue, completedCount, inProgressCount, stageMap }
  }, [staffCases])

  // Advance Stage handler
  const handleAdvanceStage = (caseItem, targetStageId) => {
    setDrawerAlert('')
    const result = holidayCasesService.advanceStage(caseItem.id, targetStageId)
    if (!result.success) {
      setDrawerAlert(result.error)
      return
    }
    reloadCases()
  }

  // Previous Stage handler
  const handlePreviousStage = (caseItem, prevStageId) => {
    setDrawerAlert('')
    holidayCasesService.updateCase(caseItem.id, {
      stage: prevStageId,
    })
    reloadCases()
  }

  // Toggle checklist item
  const handleToggleChecklist = (caseId, itemId, isChecked) => {
    holidayCasesService.toggleChecklistItem(caseId, itemId, isChecked)
    reloadCases()
    setDrawerAlert('')
  }

  // Record Payment handler
  const handleRecordPayment = (paymentData) => {
    const activeCase = selectedCase || detailsModalCase
    if (!activeCase) return
    const updated = holidayCasesService.updateCase(activeCase.id, {
      paidAmount: paymentData.newPaidTotal,
      paymentStatus: paymentData.newPaymentStatus,
      invoiceRef: paymentData.referenceNo,
    })
    if (updated && detailsModalCase) {
      setDetailsModalCase(updated)
    }
    reloadCases()
  }

  // Create Booking handler
  const handleCreateBookingSubmit = (e) => {
    e.preventDefault()
    holidayCasesService.createCase(newBookingForm)
    setIsAddModalOpen(false)
    const defTpl = masterWorkflowTemplatesService.getTemplates('HOLIDAY')[0]
    setNewBookingForm({
      customer: '',
      phone: '',
      email: '',
      packageName: defTpl?.name || 'International Luxury Tour',
      category: defTpl?.category || 'INTERNATIONAL_LUXURY',
      templateId: defTpl?.id || null,
      stages: defTpl?.stages || null,
      stage: defTpl?.stages ? defTpl.stages[0]?.id : 'BOOKING_CREATED',
      destination: 'Bali, Indonesia',
      duration: '6 Days / 5 Nights',
      price: defTpl?.defaultFee || 185000,
      paidAmount: 50000,
      paymentType: 'Postpaid',
      departureDate: '2026-11-20',
      officer: 'Priya Singh',
    })
    reloadCases()
  }

  // Format currency in INR
  const formatINR = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN')
  }

  // Compact K formatter
  const formatK = (val) => {
    const n = Number(val || 0)
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
    if (n >= 1000) return `₹${Math.round(n / 1000)}k`
    return `₹${n}`
  }

  return (
    <div className="space-y-4 pb-12 font-sans">
      {/* Staff Assignment View Banner */}
      {isStaff && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-4 py-2.5 rounded-2xl text-xs flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-base">👤</span>
            <span>
              <strong>Staff View ({user?.name || 'Staff Officer'}):</strong> Showing holiday cases assigned to you.
            </span>
          </div>
          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold">
            Assigned: {staffCases.length} cases
          </span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Holiday & Tour Booking Cases — Processing Pipeline
              </h1>
              {/* <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md border border-slate-300 bg-slate-50 text-slate-700 shadow-2xs">
                {filteredCases.length} of {cases.length} Bookings
              </span> */}
            </div>
            <p className="text-xs font-medium text-slate-500 tracking-tight">
              <span className="font-semibold text-slate-700">Pipeline Flow:</span> Stage 1 (Created) &rarr; Stage 2 (Docs & Itinerary) &rarr; Stage 3 (Payment) &rarr; Stage 4 (Vouchers) &rarr; Stage 5 (In-Progress) &rarr; Completed
            </p>
          </div>

          {/* Action Buttons: New Booking + Kanban/Table Switcher */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            {/* View Switcher Toggle */}
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/90 p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-[#0F0E2B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <span>Kanban Board</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#0F0E2B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Table View</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-slate-800 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>+ Add Booking</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
          {/* Destination */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Destination:</span>
            <select
              value={filterDestination}
              onChange={(e) => setFilterDestination(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Destinations</option>
              {uniqueDestinations.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Case Officer */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Case Officer:</span>
            <select
              value={filterOfficer}
              onChange={(e) => setFilterOfficer(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Officers</option>
              {uniqueOfficers.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Payment:</span>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Payments</option>
              <option value="Prepaid">Prepaid</option>
              <option value="Postpaid">Postpaid</option>
            </select>
          </div>

          {/* Search By */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Search By:</span>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Fields</option>
              <option value="CUSTOMER">Customer Name</option>
              <option value="PACKAGE_ID">Package ID</option>
              <option value="DESTINATION">Destination</option>
              <option value="OFFICER">Case Officer</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="flex-1 min-w-[200px] flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Search:</span>
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Customer, PKG#, Destination, Officer..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status Summary Line */}
        <div className="mt-2 text-[10px] font-semibold text-slate-500 flex items-center gap-2">
          <span>
            Completed: <strong className="text-emerald-600 font-bold">{pipelineStats.completedCount}</strong>
          </span>
          <span>&bull;</span>
          <span>
            In-Progress: <strong className="text-amber-600 font-bold">{pipelineStats.inProgressCount}</strong>
          </span>
          {filterStage !== 'ALL' && (
            <button
              type="button"
              onClick={() => setFilterStage('ALL')}
              className="ml-auto text-[10px] text-indigo-600 hover:underline font-bold cursor-pointer"
            >
              Clear stage filter ({filterStage})
            </button>
          )}
        </div>
      </div>

      {/* Stage Stepper Progress Bar (Connected with arrows) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5">
        {HOLIDAY_STAGES.map((stage, idx) => {
          const stats = pipelineStats.stageMap[stage.id] || { count: 0, value: 0 }
          const isSelected = filterStage === stage.id

          return (
            <div
              key={stage.id}
              onClick={() => setFilterStage(filterStage === stage.id ? 'ALL' : stage.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none relative group ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-4 h-4 rounded text-[9px] flex items-center justify-center font-bold shrink-0 ${stage.colorBadge}`}
                >
                  {stage.stepNumber}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-slate-900 truncate leading-tight">
                    {stage.shortTitle}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                    {stats.count} {stats.count === 1 ? 'Booking' : 'Bookings'}
                  </p>
                </div>
              </div>

              {idx < HOLIDAY_STAGES.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs pointer-events-none z-10">
                  &rarr;
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* MAIN VIEW AREA */}
      {viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW (Matching Screenshot 1) */
        <div className="flex gap-3.5 items-start overflow-x-auto pb-4">
          {HOLIDAY_STAGES.map((stage, stageIdx) => {
            const stageCases = filteredCases.filter((c) => c.stage === stage.id)

            return (
              <div
                key={stage.id}
                className="bg-slate-50/80 rounded-2xl border border-slate-200/90 flex flex-col max-h-[calc(100vh-280px)] overflow-hidden shadow-2xs w-[285px] min-w-[285px] shrink-0"
              >
                {/* Column Header */}
                <div className="p-2.5 border-b border-slate-200 bg-white rounded-t-2xl space-y-0.5 shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-slate-900 tracking-tight">
                      {stage.title}
                    </h3>
                    <span className="w-4 h-4 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[9px] font-bold flex items-center justify-center">
                      {stageCases.length}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-medium leading-tight line-clamp-1">
                    {stage.subtitle}
                  </p>
                  {/* Completed / Cancelled Banner */}
                  {stage.bannerText && (
                    <div
                      className={`text-[8px] font-bold text-center py-0.5 rounded border ${
                        stage.id === 'COMPLETED'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-rose-200 bg-rose-50 text-rose-700'
                      }`}
                    >
                      {stage.bannerText}
                    </div>
                  )}
                </div>

                {/* Cards Container */}
                <div className="p-2 space-y-2 overflow-y-auto flex-1">
                  {stageCases.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-[10px] italic">
                      No bookings in this stage
                    </div>
                  ) : (
                    stageCases.map((caseItem) => (
                      <CaseStageCard
                        key={caseItem.id}
                        caseItem={caseItem}
                        caseType="HOLIDAY"
                        stages={caseItem.stages || HOLIDAY_STAGES}
                        stageIdx={stageIdx}
                        onOpenDetails={(item) => {
                          setSelectedCaseId(item.id)
                          setDrawerAlert('')
                        }}
                        onAdvanceStage={(item) => {
                          const activeStages = item.stages || HOLIDAY_STAGES
                          const curIdx = activeStages.findIndex((s) => s.id === item.stage)
                          const nextId = activeStages[curIdx]?.nextStage || activeStages[curIdx + 1]?.id
                          handleAdvanceStage(item, nextId)
                        }}
                        onPreviousStage={(item) => {
                          const activeStages = item.stages || HOLIDAY_STAGES
                          const curIdx = activeStages.findIndex((s) => s.id === item.stage)
                          const prevId = curIdx > 0 ? activeStages[curIdx - 1]?.id : null
                          if (prevId) handlePreviousStage(item, prevId)
                        }}
                        onDownloadDossier={(item) => downloadApplicationDossier(item, 'holiday')}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* TABLE VIEW (Matching Screenshot 2) */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  <th className="py-3 px-4">Package ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Package Name</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Total Price</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Departure Date</th>
                  <th className="py-3 px-4">Officer</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCases.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-slate-400 font-medium">
                      No booking cases found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedCases.map((caseItem) => {
                    const stageDef =
                      HOLIDAY_STAGES.find((s) => s.id === caseItem.stage) || HOLIDAY_STAGES[0]

                    return (
                      <tr
                        key={caseItem.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* PACKAGE ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {caseItem.id}
                        </td>

                        {/* CUSTOMER */}
                        <td className="py-3.5 px-4 min-w-[200px]">
                          <p className="font-bold text-slate-900 leading-tight">
                            {caseItem.customer}
                          </p>
                          <div className="flex flex-col gap-0.5 mt-1 text-[11px] text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <span>📞</span> {caseItem.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <span>✉</span> {caseItem.email}
                            </span>
                          </div>
                        </td>

                        {/* PACKAGE NAME */}
                        <td className="py-3.5 px-4 font-semibold text-slate-900 min-w-[180px]">
                          {caseItem.packageName}
                        </td>

                        {/* DESTINATION */}
                        <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                          {caseItem.destination}
                        </td>

                        {/* STAGE */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border tracking-wider ${stageDef.badgeBorder}`}
                          >
                            {stageDef.shortTitle}
                          </span>
                        </td>

                        {/* DURATION */}
                        <td className="py-3.5 px-4 font-medium text-slate-600 whitespace-nowrap">
                          {caseItem.duration}
                        </td>

                        {/* TOTAL PRICE */}
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {formatINR(caseItem.price)}
                        </td>

                        {/* PAYMENT */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div
                            className={`px-2 py-1 rounded-md border text-[10px] font-mono leading-tight inline-block ${
                              caseItem.paymentStatus === 'PAID'
                                ? 'border-emerald-300 text-emerald-800 bg-emerald-50/60'
                                : 'border-amber-300 text-amber-800 bg-amber-50/60'
                            }`}
                          >
                            <p className="font-bold">{caseItem.paymentStatus}</p>
                            <p className="text-[9px] text-slate-500 font-normal">{caseItem.paymentType}</p>
                          </div>
                        </td>

                        {/* DEPARTURE DATE */}
                        <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                          {caseItem.departureDate}
                        </td>

                        {/* OFFICER */}
                        <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                          {caseItem.officer}
                        </td>

                        {/* ACTIONS */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCaseId(caseItem.id)
                                setDrawerAlert('')
                              }}
                              className="px-2.5 py-1 rounded-lg bg-black text-white hover:bg-slate-800 font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
                            >
                              Side Sheet &rarr;
                            </button>
                            <button
                              type="button"
                              onClick={() => setDetailsModalCase(caseItem)}
                              className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => setDetailsModalCase(caseItem)}
                              className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
                            >
                              Extend
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table View Pagination Controls */}
          <div className="px-4 py-2.5 border-t border-slate-100 bg-white">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCases.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              onItemsPerPageChange={(size) => {
                setItemsPerPage(size)
                setCurrentPage(1)
              }}
              pageSizeOptions={[5, 10, 20, 50]}
            />
          </div>
        </div>
      )}

      {/* RIGHT SIDE SHEET DRAWER (Unified Component) */}
      <CaseDetailsSideDrawer
        isOpen={!!selectedCase}
        onClose={() => {
          setSelectedCaseId(null)
          setDrawerAlert('')
        }}
        caseItem={selectedCase}
        caseType="HOLIDAY"
        onAdvanceStage={handleAdvanceStage}
        onRecordPayment={(cItem, paymentData) => handleRecordPayment(paymentData)}
        onToggleChecklist={handleToggleChecklist}
        onViewFullDetails={(item) => {
          setDetailsModalCase(item)
          setSelectedCaseId(null)
        }}
        drawerAlert={drawerAlert}
      />

      {/* FULL DETAILS MODAL */}
      {detailsModalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => setDetailsModalCase(null)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 font-sans p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="border-b border-slate-200 pb-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-black text-slate-900">
                      {detailsModalCase.packageName}
                    </h3>
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700">
                      {detailsModalCase.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Destination: <strong className="text-slate-800">{detailsModalCase.destination}</strong> &bull; {detailsModalCase.duration}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDetailsModalCase(null)}
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
              </div>
              {/* Top Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadApplicationDossier(detailsModalCase, 'holiday')}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-[11px] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>📄</span>
                  <span>Download Application</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadInvoice(detailsModalCase, 'holiday')}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white font-bold text-[11px] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🧾</span>
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                  Customer & Contact
                </h4>
                <div className="space-y-1 text-slate-600">
                  <p><strong>Customer:</strong> {detailsModalCase.customer}</p>
                  <p><strong>Phone:</strong> {detailsModalCase.phone}</p>
                  <p><strong>Email:</strong> {detailsModalCase.email}</p>
                  <p><strong>Departure:</strong> {detailsModalCase.departureDate}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                  Execution & Officer
                </h4>
                <div className="space-y-1 text-slate-600">
                  <p><strong>Officer:</strong> {detailsModalCase.officer} ({detailsModalCase.officerId})</p>
                  <p><strong>Current Stage:</strong> <span className="font-bold text-indigo-700">{detailsModalCase.stage.replace('_', ' ')}</span></p>
                  <p><strong>Invoice Ref:</strong> {detailsModalCase.invoiceRef}</p>
                  <p><strong>Payment Plan:</strong> {detailsModalCase.paymentType}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                  Financial Summary
                </h4>
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>+</span>
                  <span>Add Payment</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50 text-center">
                  <p className="text-[10px] font-bold text-slate-400">Total Price</p>
                  <p className="text-sm font-black text-slate-900">{formatINR(detailsModalCase.price)}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 text-center">
                  <p className="text-[10px] font-bold text-emerald-700">Paid Amount</p>
                  <p className="text-sm font-black text-emerald-700">{formatINR(detailsModalCase.paidAmount)}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50 text-center">
                  <p className="text-[10px] font-bold text-rose-700">Balance Due</p>
                  <p className="text-sm font-black text-rose-700">
                    {formatINR(Math.max(0, detailsModalCase.price - detailsModalCase.paidAmount))}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedCaseId(detailsModalCase.id)
                  setDetailsModalCase(null)
                }}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                &larr; Open Side Sheet
              </button>

              <button
                type="button"
                onClick={() => setDetailsModalCase(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD BOOKING MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Add New Tour Booking</h3>
                <p className="text-xs text-slate-500">Create a holiday booking case into the pipeline</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBookingSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBookingForm.customer}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, customer: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBookingForm.phone}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, phone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Workflow Template / Tour Category *
                  </label>
                  <select
                    value={newBookingForm.templateId || ''}
                    onChange={(e) => {
                      const tplList = masterWorkflowTemplatesService.getTemplates('HOLIDAY')
                      const sel = tplList.find((t) => t.id === e.target.value)
                      if (sel) {
                        setNewBookingForm({
                          ...newBookingForm,
                          templateId: sel.id,
                          category: sel.category,
                          packageName: sel.name,
                          stages: sel.stages,
                          stage: sel.stages[0]?.id,
                          price: sel.defaultFee,
                        })
                      }
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-800 focus:ring-1 focus:ring-indigo-500"
                  >
                    {masterWorkflowTemplatesService.getTemplates('HOLIDAY').map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name} ({tpl.stages?.length || 0} Stages • {tpl.estimatedDays})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBookingForm.packageName}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, packageName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500 font-medium"
                    placeholder="e.g. Bali Island Beach Getaway"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBookingForm.destination}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, destination: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500 font-medium"
                    placeholder="e.g. Bali, Indonesia"
                  />
                </div>

                {/* Auto Config Info Banner */}
                <div className="col-span-2 p-2 rounded-lg bg-indigo-50/80 border border-indigo-200 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-indigo-900 flex items-center gap-1">
                    <span>✓</span>
                    <span>
                      Template Auto-Configured: <strong>{newBookingForm.stages?.length || 6} Stages</strong> &amp; <strong>{newBookingForm.stages?.reduce((a, s) => a + (s.checklist?.length || 0), 0) || 16} Checklists</strong> from Master Stage Config
                    </span>
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                    Stage Details Auto-Set
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Total Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newBookingForm.price}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Paid Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={newBookingForm.paidAmount}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, paidAmount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Payment Plan
                  </label>
                  <select
                    value={newBookingForm.paymentType}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, paymentType: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Postpaid">Postpaid</option>
                    <option value="Prepaid">Prepaid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={newBookingForm.departureDate}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, departureDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Case Officer
                  </label>
                  <select
                    value={newBookingForm.officer}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, officer: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Priya Singh">Priya Singh (CO-102)</option>
                    <option value="Rohan Das">Rohan Das (CO-103)</option>
                    <option value="Amit Verma">Amit Verma (CO-101)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-black text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Payment Modal Popup */}
      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        caseItem={selectedCase || detailsModalCase}
        onRecordPayment={handleRecordPayment}
      />
    </div>
  )
}

export default Holidays
