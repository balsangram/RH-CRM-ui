import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import visaCasesService, { VISA_STAGES } from '../../services/visaCases'
import ROUTES from '../../config/routes'
import AddPaymentModal from '../../components/Modal/AddPaymentModal.component'
import { downloadApplicationDossier, downloadInvoice, downloadVisaDocument } from '../../utils/documentGenerators'
import useAuth from '../../hooks/useAuth'
import Pagination from '../../components/Pagination/Pagination.component'
import CaseStageCard from '../../components/Kanban/CaseStageCard.component'
import CaseDetailsSideDrawer from '../../components/Drawers/CaseDetailsSideDrawer.component'
import masterWorkflowTemplatesService from '../../services/masterWorkflowTemplates'

export const Visa = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isStaff = user?.role === 'AGENT' || user?.role === 'STAFF'

// View state: 'table' | 'kanban'
  const [viewMode, setViewMode] = useState('kanban')

// Cases state from service
  const [cases, setCases] = useState([])
  const [isLoading, setIsLoading] = useState(true)

// Filters state
  const [filterCountry, setFilterCountry] = useState('ALL')
  const [filterVisaType, setFilterVisaType] = useState('ALL')
  const [filterOfficer, setFilterOfficer] = useState('ALL')
  const [filterStage, setFilterStage] = useState('ALL')
  const [searchBy, setSearchBy] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

// Side sheet drawer state
  const [selectedCaseId, setSelectedCaseId] = useState(null)
  const [drawerAlert, setDrawerAlert] = useState('')

// Add Payment Modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

// Full Profile Modal state
  const [profileModalCase, setProfileModalCase] = useState(null)

  // Visa Document state (upload simulation)
  const [visaDocUploaded, setVisaDocUploaded] = useState(false)

// New Case Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const defaultVisaTpl = masterWorkflowTemplatesService.getTemplates('VISA')[0]
  const [newCaseForm, setNewCaseForm] = useState({
    applicant: '',
    phone: '',
    email: '',
    country: 'United Kingdom',
    visaType: defaultVisaTpl?.categoryName || 'Student Visa / Study Permit',
    category: defaultVisaTpl?.category || 'STUDENT_VISA',
    templateId: defaultVisaTpl?.id || null,
    stages: defaultVisaTpl?.stages || null,
    stage: defaultVisaTpl?.stages ? defaultVisaTpl.stages[0]?.id : 'UNDER_REVIEW',
    officer: 'Amit Verma',
    amount: defaultVisaTpl?.defaultFee || 35000,
    paidAmount: 10000,
    paymentType: 'Postpaid',
    passport: '',
    passportExp: '',
  })

// Load cases
  const reloadCases = () => {
    const list = visaCasesService.getCases()
    setCases(list)
    setIsLoading(false)
  }

useEffect(() => {
    reloadCases()
  }, [])

// Selected case for Side Sheet
  const selectedCase = useMemo(() => {
    if (!selectedCaseId) return null
    return cases.find((c) => c.id === selectedCaseId) || null
  }, [cases, selectedCaseId])

// Extract unique filter dropdown values
  const uniqueCountries = useMemo(() => {
    const set = new Set(cases.map((c) => c.country).filter(Boolean))
    return Array.from(set)
  }, [cases])

const uniqueVisaTypes = useMemo(() => {
    const set = new Set(cases.map((c) => c.visaType).filter(Boolean))
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
        (staffName.includes('sipu') && (officer.includes('sipu') || officer.includes('amit')))
      )
    })
  }, [cases, isStaff, user])

// Filtered cases
  const filteredCases = useMemo(() => {
    return staffCases.filter((item) => {
      // Stage filter
      if (filterStage !== 'ALL' && item.stage !== filterStage) return false

// Country filter
      if (filterCountry !== 'ALL' && item.country !== filterCountry) return false

// Visa type filter
      if (filterVisaType !== 'ALL' && item.visaType !== filterVisaType) return false

// Officer filter
      if (filterOfficer !== 'ALL' && item.officer !== filterOfficer) return false

// Search Query
      const q = searchQuery.toLowerCase().trim()
      if (!q) return true

if (searchBy === 'APPLICANT') return item.applicant.toLowerCase().includes(q)
      if (searchBy === 'CASE_ID') return item.id.toLowerCase().includes(q)
      if (searchBy === 'COUNTRY') return item.country.toLowerCase().includes(q)
      if (searchBy === 'OFFICER') return item.officer.toLowerCase().includes(q)
      if (searchBy === 'TXN') return (item.txnId || '').toLowerCase().includes(q)

// ALL Fields
      return (
        item.id.toLowerCase().includes(q) ||
        item.applicant.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.visaType.toLowerCase().includes(q) ||
        item.officer.toLowerCase().includes(q) ||
        (item.txnId || '').toLowerCase().includes(q) ||
        (item.phone || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q)
      )
    })
  }, [staffCases, filterStage, filterCountry, filterVisaType, filterOfficer, searchBy, searchQuery])

  // Table View Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [filterStage, filterCountry, filterVisaType, filterOfficer, searchBy, searchQuery])

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage) || 1
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredCases.slice(start, start + itemsPerPage)
  }, [filteredCases, currentPage, itemsPerPage])

// Pipeline aggregate statistics
  const pipelineStats = useMemo(() => {
    const totalValue = cases.reduce((sum, c) => sum + (Number(c.amount) || 0), 0)
    const approvedCount = cases.filter((c) => c.stage === 'APPROVED').length
    const rejectedCount = cases.filter((c) => c.stage === 'REJECTED').length

// Stage by stage stats
    const stageMap = {}
    VISA_STAGES.forEach((stage) => {
      const stageCases = cases.filter((c) => c.stage === stage.id)
      const count = stageCases.length
      const value = stageCases.reduce((sum, c) => sum + (Number(c.amount) || 0), 0)
      stageMap[stage.id] = { count, value }
    })

return { totalValue, approvedCount, rejectedCount, stageMap }
  }, [cases])

// Quick Advance Stage handler
  const handleAdvanceStage = (caseItem, targetStageId) => {
    setDrawerAlert('')
    const result = visaCasesService.advanceStage(caseItem.id, targetStageId)
    if (!result.success) {
      setDrawerAlert(result.error)
      return
    }
    reloadCases()
  }

// Previous Stage handler
  const handlePreviousStage = (caseItem, prevStageId) => {
    setDrawerAlert('')
    visaCasesService.updateCase(caseItem.id, {
      stage: prevStageId,
      docStatus: prevStageId,
    })
    reloadCases()
  }

// Toggle checklist item
  const handleToggleChecklist = (caseId, itemId, isChecked) => {
    visaCasesService.toggleChecklistItem(caseId, itemId, isChecked)
    reloadCases()
    setDrawerAlert('')
  }

// Record Payment handler
  const handleRecordPayment = (paymentData) => {
    if (!selectedCase) return
    visaCasesService.updateCase(selectedCase.id, {
      paidAmount: paymentData.newPaidTotal,
      paymentStatus: paymentData.newPaymentStatus,
      txnId: paymentData.referenceNo,
    })
    reloadCases()
  }

// Handle Add New Case submit
  const handleCreateCaseSubmit = (e) => {
    e.preventDefault()
    visaCasesService.createCase(newCaseForm)
    setIsAddModalOpen(false)
    const defTpl = masterWorkflowTemplatesService.getTemplates('VISA')[0]
    setNewCaseForm({
      applicant: '',
      phone: '',
      email: '',
      country: 'United Kingdom',
      visaType: defTpl?.categoryName || 'Student Visa / Study Permit',
      category: defTpl?.category || 'STUDENT_VISA',
      templateId: defTpl?.id || null,
      stages: defTpl?.stages || null,
      stage: defTpl?.stages ? defTpl.stages[0]?.id : 'UNDER_REVIEW',
      officer: 'Amit Verma',
      amount: defTpl?.defaultFee || 35000,
      paidAmount: 10000,
      paymentType: 'Postpaid',
      passport: '',
      passportExp: '',
    })
    reloadCases()
  }

// Currency Formatter
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
              <strong>Staff View ({user?.name || 'Staff Officer'}):</strong> Showing cases assigned to you.
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
                Visa Cases — Processing Pipeline
              </h1>
              {/* <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md border border-slate-300 bg-slate-50 text-slate-700 shadow-2xs">
                {filteredCases.length} of {cases.length} Cases
              </span> */}
            </div>
            <p className="text-xs font-medium text-slate-500 tracking-tight">
              <span className="font-semibold text-slate-700">Flow:</span> Under Review &rarr; Docs Verified &rarr; Submitted &rarr; Processing &rarr; Approved &rarr; Payment | Rejected
            </p>
          </div>

{/* Action Buttons: New Case + Kanban/Table Switcher */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0F0E2B] to-[#2E2B6E] hover:from-[#181445] hover:to-[#221F56] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>+ New Case</span>
            </button>

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
          </div>
        </div>

{/* Filter Controls Row */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
          {/* Country */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Country:</span>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Countries</option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

{/* Visa Type */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Visa Type:</span>
            <select
              value={filterVisaType}
              onChange={(e) => setFilterVisaType(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Types</option>
              {uniqueVisaTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
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

{/* Search By */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Search By:</span>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Fields</option>
              <option value="APPLICANT">Applicant Name</option>
              <option value="CASE_ID">Case ID</option>
              <option value="COUNTRY">Country</option>
              <option value="OFFICER">Case Officer</option>
              <option value="TXN">TXN#</option>
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
                placeholder="Name, ID, country, officer, TXN#..."
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
            Approved: <strong className="text-emerald-600 font-bold">{pipelineStats.approvedCount}</strong>
          </span>
          <span>&bull;</span>
          <span>
            Rejected: <strong className="text-rose-600 font-bold">{pipelineStats.rejectedCount}</strong>
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

{/* Stage Stepper Progress Bar (Matching Reference Screenshot) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2 sm:gap-2.5">
        {VISA_STAGES.map((stage, idx) => {
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
                    {stats.count} {stats.count === 1 ? 'Case' : 'Cases'}
                  </p>
                </div>
              </div>

{/* Indicator Arrow between cards on desktop */}
              {idx < VISA_STAGES.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs pointer-events-none z-10">
                  &rarr;
                </div>
              )}
            </div>
          )
        })}
      </div>

{/* Main View Area */}
      {viewMode === 'table' ? (
        /* TABLE VIEW (Matching Screenshot 1) */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Visa Type</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Case Officer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCases.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 font-medium">
                      No cases found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedCases.map((caseItem) => {
                    const stageDef = VISA_STAGES.find((s) => s.id === caseItem.stage) || VISA_STAGES[0]

return (
                      <tr
                        key={caseItem.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* CASE ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {caseItem.id}
                        </td>

{/* APPLICANT */}
                        <td className="py-3.5 px-4 min-w-[200px]">
                          <p className="font-bold text-slate-900 leading-tight">
                            {caseItem.applicant}
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

{/* COUNTRY */}
                        <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                          {caseItem.country}
                        </td>

{/* VISA TYPE */}
                        <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                          {caseItem.visaType}
                        </td>

{/* STAGE */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border tracking-wider ${stageDef.badgeBorder}`}
                          >
                            {stageDef.shortTitle}
                          </span>
                        </td>

{/* CASE OFFICER */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <p className="font-semibold text-slate-900 leading-tight">
                            {caseItem.officer}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {caseItem.officerId || 'CO-101'}
                          </p>
                        </td>

{/* AMOUNT */}
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {formatINR(caseItem.amount)}
                        </td>

{/* PAYMENT */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div
                            className={`px-2 py-1 rounded-md border text-[10px] font-mono leading-tight inline-block ${
                              caseItem.paymentStatus === 'COMPLETED'
                                ? 'border-emerald-300 text-emerald-800 bg-emerald-50/60'
                                : caseItem.paymentStatus === 'PARTIALLY_PAID'
                                ? 'border-amber-300 text-amber-800 bg-amber-50/60'
                                : 'border-slate-300 text-slate-700 bg-slate-50'
                            }`}
                          >
                            <p className="font-bold">{caseItem.paymentStatus.replace('_', ' ')}</p>
                            <p className="text-[9px] text-slate-500 font-normal">{caseItem.txnId || 'TXN-998120'}</p>
                          </div>
                        </td>

{/* APPLIED DATE */}
                        <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                          {caseItem.appliedDate}
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
                              className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
                            >
                              Quick View
                            </button>
                            <button
                              type="button"
                              onClick={() => setProfileModalCase(caseItem)}
                              className="px-2.5 py-1 rounded-lg bg-[#0F0E2B] text-white hover:bg-[#181445] font-bold text-[11px] transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                            >
                              <span>View Profile</span>
                              <span>&rarr;</span>
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
      ) : (
        /* KANBAN BOARD VIEW (Matching Screenshot 2) */
        <div className="flex gap-3.5 items-start overflow-x-auto pb-4">
          {VISA_STAGES.map((stage, stageIdx) => {
            const stageCases = filteredCases.filter((c) => c.stage === stage.id)

return (
              <div
                key={stage.id}
                className="bg-slate-50/80 rounded-2xl border border-slate-200/90 flex flex-col max-h-[calc(100vh-280px)] overflow-hidden shadow-2xs w-[285px] min-w-[285px] shrink-0"
              >
                {/* Column Header */}
                <div className="p-2.5 border-b border-slate-200 bg-white rounded-t-2xl shrink-0 space-y-0.5">
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
                </div>

{/* Cards Container */}
                <div className="p-2 space-y-2 overflow-y-auto flex-1">
                  {stageCases.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-[10px] italic">
                      No cases in this stage
                    </div>
                  ) : (
                    stageCases.map((caseItem) => (
                      <CaseStageCard
                        key={caseItem.id}
                        caseItem={caseItem}
                        caseType="VISA"
                        stages={caseItem.stages || VISA_STAGES}
                        stageIdx={stageIdx}
                        onOpenDetails={(item) => {
                          setSelectedCaseId(item.id)
                          setDrawerAlert('')
                        }}
                        onAdvanceStage={(item) => {
                          const activeStages = item.stages || VISA_STAGES
                          const curIdx = activeStages.findIndex((s) => s.id === item.stage)
                          const nextId = activeStages[curIdx]?.nextStage || activeStages[curIdx + 1]?.id
                          handleAdvanceStage(item, nextId)
                        }}
                        onPreviousStage={(item) => {
                          const activeStages = item.stages || VISA_STAGES
                          const curIdx = activeStages.findIndex((s) => s.id === item.stage)
                          const prevId = curIdx > 0 ? activeStages[curIdx - 1]?.id : null
                          if (prevId) handlePreviousStage(item, prevId)
                        }}
                        onDownloadDossier={(item) => downloadApplicationDossier(item, 'visa')}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
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
        caseType="VISA"
        onAdvanceStage={handleAdvanceStage}
        onRecordPayment={(cItem, paymentData) => handleRecordPayment(paymentData)}
        onToggleChecklist={handleToggleChecklist}
        onViewFullDetails={(item) => {
          setProfileModalCase(item)
          setSelectedCaseId(null)
        }}
        drawerAlert={drawerAlert}
      />

{/* FULL PROFILE / CASE DETAILS MODAL */}
      {profileModalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => setProfileModalCase(null)}
          />

<div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 font-sans p-6 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="border-b border-slate-200 pb-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-black text-slate-900">
                      {profileModalCase.applicant}
                    </h3>
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700">
                      {profileModalCase.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Visa Case for <strong className="text-slate-800">{profileModalCase.country}</strong> &bull; {profileModalCase.visaType}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setProfileModalCase(null)}
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
              </div>
              {/* Top Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadApplicationDossier(profileModalCase, 'visa')}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-[11px] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>📄</span>
                  <span>Download Application</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadInvoice(profileModalCase, 'visa')}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white font-bold text-[11px] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🧾</span>
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>

{/* Profile Grid Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                  Contact & Identity
                </h4>
                <div className="space-y-1 text-slate-600">
                  <p><strong>Phone:</strong> {profileModalCase.phone}</p>
                  <p><strong>Email:</strong> {profileModalCase.email}</p>
                  <p><strong>Passport:</strong> {profileModalCase.passport} (Exp: {profileModalCase.passportExp})</p>
                  <p><strong>Applied Date:</strong> {profileModalCase.appliedDate}</p>
                </div>
              </div>

<div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                  Case Execution
                </h4>
                <div className="space-y-1 text-slate-600">
                  <p><strong>Assigned Officer:</strong> {profileModalCase.officer} ({profileModalCase.officerId})</p>
                  <p><strong>Current Stage:</strong> <span className="font-bold text-indigo-700">{profileModalCase.stage.replace('_', ' ')}</span></p>
                  <p><strong>Document Verification:</strong> {profileModalCase.docStatus}</p>
                  <p><strong>Transaction Ref:</strong> {profileModalCase.txnId}</p>
                </div>
              </div>
            </div>

{/* Financial Ledger */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                  Financial Status
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
                  <p className="text-[10px] font-bold text-slate-400">Total Fee</p>
                  <p className="text-sm font-black text-slate-900">{formatINR(profileModalCase.amount)}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 text-center">
                  <p className="text-[10px] font-bold text-emerald-700">Paid Amount</p>
                  <p className="text-sm font-black text-emerald-700">{formatINR(profileModalCase.paidAmount)}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50 text-center">
                  <p className="text-[10px] font-bold text-rose-700">Balance Due</p>
                  <p className="text-sm font-black text-rose-700">
                    {formatINR(Math.max(0, profileModalCase.amount - profileModalCase.paidAmount))}
                  </p>
                </div>
              </div>
            </div>

            {/* Visa Document Actions (only if past Payment stage) */}
            {(() => {
              const stageOrder = ['UNDER_REVIEW', 'DOCS_VERIFIED', 'SUBMITTED', 'PROCESSING', 'INTERVIEW', 'APPROVED', 'PAYMENT']
              const currentIdx = stageOrder.indexOf(profileModalCase.stage)
              const paymentIdx = stageOrder.indexOf('PAYMENT')
              const isAfterPayment = currentIdx >= paymentIdx

              if (!isAfterPayment) return null

              return (
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2 text-xs">
                  <h4 className="font-bold text-indigo-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <span>📋</span> Visa Document Actions
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${visaDocUploaded ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="text-xs font-semibold text-slate-700">
                      {visaDocUploaded ? 'Visa Document Uploaded' : 'No visa document uploaded yet'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex-1 py-2 px-3 rounded-lg bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-bold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1.5">
                      <span>⬆️</span> Upload Visa
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={() => setVisaDocUploaded(true)} />
                    </label>
                    <button
                      type="button"
                      disabled={!visaDocUploaded}
                      onClick={() => alert('Visa document preview would open here.')}
                      className="flex-1 py-2 px-3 rounded-lg bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-bold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <span>👁️</span> View Visa
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadVisaDocument(profileModalCase)}
                      className="flex-1 py-2 px-3 rounded-lg bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-bold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>⬇️</span> Download Visa
                    </button>
                  </div>
                </div>
              )
            })()}

{/* Footer */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedCaseId(profileModalCase.id)
                  setProfileModalCase(null)
                }}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                &larr; Open Stage Side Sheet
              </button>

<button
                type="button"
                onClick={() => setProfileModalCase(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

{/* NEW CASE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => setIsAddModalOpen(false)}
          />

<div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Create New Visa Case</h3>
                <p className="text-xs text-slate-500">Initiate a new client visa case into the processing pipeline</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

<form onSubmit={handleCreateCaseSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Applicant Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCaseForm.applicant}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, applicant: e.target.value })}
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
                    value={newCaseForm.phone}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, phone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

<div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newCaseForm.email}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, email: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                    placeholder="rahul@example.com"
                  />
                </div>

<div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Destination Country *
                  </label>
                  <select
                    value={newCaseForm.country}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, country: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Schengen (France)">Schengen (France)</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Japan">Japan</option>
                    <option value="UAE">UAE</option>
                  </select>
                </div>
              </div>

<div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Workflow Template / Visa Category *
                  </label>
                  <select
                    value={newCaseForm.templateId || ''}
                    onChange={(e) => {
                      const tplList = masterWorkflowTemplatesService.getTemplates('VISA')
                      const sel = tplList.find((t) => t.id === e.target.value)
                      if (sel) {
                        setNewCaseForm({
                          ...newCaseForm,
                          templateId: sel.id,
                          category: sel.category,
                          visaType: sel.categoryName,
                          stages: sel.stages,
                          stage: sel.stages[0]?.id,
                          amount: sel.defaultFee,
                        })
                      }
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-800 focus:ring-1 focus:ring-indigo-500"
                  >
                    {masterWorkflowTemplatesService.getTemplates('VISA').map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name} ({tpl.stages?.length || 0} Stages • {tpl.estimatedDays})
                      </option>
                    ))}
                  </select>
                </div>

<div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Assigned Case Officer *
                  </label>
                  <select
                    value={newCaseForm.officer}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, officer: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Amit Verma">Amit Verma (CO-101)</option>
                    <option value="Priya Singh">Priya Singh (CO-102)</option>
                    <option value="Rohan Das">Rohan Das (CO-103)</option>
                  </select>
                </div>

                {/* Auto Config Banner */}
                <div className="col-span-2 p-2 rounded-lg bg-indigo-50/80 border border-indigo-200 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-indigo-900 flex items-center gap-1">
                    <span>✓</span>
                    <span>
                      Template Auto-Configured: <strong>{newCaseForm.stages?.length || 7} Stages</strong> &amp; <strong>{newCaseForm.stages?.reduce((a, s) => a + (s.checklist?.length || 0), 0) || 18} Checklists</strong> from Master Stage Config
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
                    Total Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newCaseForm.amount}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

<div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Initial Paid (₹)
                  </label>
                  <input
                    type="number"
                    value={newCaseForm.paidAmount}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, paidAmount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

<div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Payment Plan
                  </label>
                  <select
                    value={newCaseForm.paymentType}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, paymentType: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Postpaid">Postpaid</option>
                    <option value="Prepaid">Prepaid</option>
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
                  className="px-4 py-2 rounded-xl bg-[#0F0E2B] text-white font-bold hover:bg-[#181445] transition-colors cursor-pointer"
                >
                  Add Case to Pipeline
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
        caseItem={selectedCase || profileModalCase}
        onRecordPayment={handleRecordPayment}
      />
    </div>
  )
}

export default Visa
