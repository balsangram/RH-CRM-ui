import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import visaCasesService, { VISA_STAGES } from '../../services/visaCases'
import ROUTES from '../../config/routes'

export const Visa = () => {
  const navigate = useNavigate()

  // View state: 'table' | 'kanban'
  const [viewMode, setViewMode] = useState('table')

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

  // Full Profile Modal state
  const [profileModalCase, setProfileModalCase] = useState(null)

  // New Case Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCaseForm, setNewCaseForm] = useState({
    applicant: '',
    phone: '',
    email: '',
    country: 'United Kingdom',
    visaType: 'Standard Visitor',
    officer: 'Amit Verma',
    amount: 24000,
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

  // Filtered cases
  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
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
  }, [cases, filterStage, filterCountry, filterVisaType, filterOfficer, searchBy, searchQuery])

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

  // Toggle checklist item
  const handleToggleChecklist = (caseId, itemId, isChecked) => {
    visaCasesService.toggleChecklistItem(caseId, itemId, isChecked)
    reloadCases()
    setDrawerAlert('')
  }

  // Handle Add New Case submit
  const handleCreateCaseSubmit = (e) => {
    e.preventDefault()
    visaCasesService.createCase(newCaseForm)
    setIsAddModalOpen(false)
    setNewCaseForm({
      applicant: '',
      phone: '',
      email: '',
      country: 'United Kingdom',
      visaType: 'Standard Visitor',
      officer: 'Amit Verma',
      amount: 24000,
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
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Visa Cases — Processing Pipeline
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md border border-slate-300 bg-slate-50 text-slate-700 shadow-2xs">
                {filteredCases.length} of {cases.length} Cases
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 tracking-tight">
              <span className="font-semibold text-slate-700">Flow:</span> Under Review &rarr; Docs Verified &rarr; Submitted &rarr; Processing &rarr; Approved | Rejected
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
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
                {filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 font-medium">
                      No cases found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((caseItem) => {
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
        </div>
      ) : (
        /* KANBAN BOARD VIEW (Matching Screenshot 2) */
        <div className="flex gap-3.5 items-start overflow-x-auto pb-4">
          {VISA_STAGES.map((stage) => {
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
                    stageCases.map((caseItem) => {
                      const paidPercent =
                        caseItem.amount > 0
                          ? Math.round(((caseItem.paidAmount || 0) / caseItem.amount) * 100)
                          : 0

                      return (
                        <div
                          key={caseItem.id}
                          className="bg-white rounded-xl border border-slate-200/90 p-2.5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-1.5"
                        >
                          {/* Card Top Pill Row */}
                          <div className="flex items-center justify-between gap-1 text-[9px]">
                            <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
                              {caseItem.visaType}
                            </span>
                            <span className="font-mono font-bold text-slate-400 text-[9px]">
                              {caseItem.id}
                            </span>
                          </div>

                          {/* Applicant Name & Destination */}
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-900 leading-snug truncate">
                              {caseItem.applicant}
                            </h4>
                            <p className="text-[10px] text-slate-600 font-medium mt-0.5 flex items-center gap-1 truncate">
                              <span>📍</span> {caseItem.country}
                            </p>
                          </div>

                          {/* Amount & Paid Progress */}
                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                            <span className="font-bold text-slate-900">
                              {formatINR(caseItem.amount)}
                            </span>
                            <span
                              className={`text-[9px] font-bold ${
                                paidPercent === 100
                                  ? 'text-emerald-600'
                                  : paidPercent > 0
                                  ? 'text-amber-600'
                                  : 'text-slate-400'
                              }`}
                            >
                              {paidPercent}% paid ({caseItem.paymentType})
                            </span>
                          </div>

                          {/* Case Officer & Document Status */}
                          <div className="flex items-center justify-between text-[9px] text-slate-500">
                            <span className="flex items-center gap-1 truncate font-medium max-w-[130px]">
                              <span>👤</span> {caseItem.officer}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border shrink-0 ${
                                caseItem.docStatus === 'DOCS_VERIFIED'
                                  ? 'border-blue-300 text-blue-700 bg-blue-50'
                                  : caseItem.docStatus === 'APPROVED'
                                  ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                                  : 'border-amber-300 text-amber-700 bg-amber-50'
                              }`}
                            >
                              {caseItem.docStatus.replace('_', ' ')}
                            </span>
                          </div>

                          {/* Card Action Buttons */}
                          <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCaseId(caseItem.id)
                                setDrawerAlert('')
                              }}
                              className="px-2 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[9px] font-bold transition-colors cursor-pointer flex-1 text-center"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => setProfileModalCase(caseItem)}
                              className="px-2 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[9px] font-bold transition-colors cursor-pointer text-center"
                              title="Full Profile"
                            >
                              Profile &rarr;
                            </button>
                            {stage.nextStage && (
                              <button
                                type="button"
                                onClick={() => handleAdvanceStage(caseItem, stage.nextStage)}
                                className="px-2 py-1 rounded-lg bg-[#0F0E2B] text-white hover:bg-[#181445] text-[9px] font-bold transition-colors cursor-pointer shrink-0"
                                title={`Advance to ${stage.nextStage}`}
                              >
                                &rarr; Next
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* RIGHT SIDE SHEET DRAWER (Matching Screenshot 2) */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => {
              setSelectedCaseId(null)
              setDrawerAlert('')
            }}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
              {/* Drawer Top Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {selectedCase.applicant}
                  </h3>
                  <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                    {selectedCase.id}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCaseId(null)
                    setDrawerAlert('')
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>✕</span> Close
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5 text-xs">
                {/* Validation Alert Notice if checklist blocked */}
                {drawerAlert && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2 animate-in fade-in duration-150">
                    <span className="text-rose-600 font-bold text-sm">⚠</span>
                    <span>{drawerAlert}</span>
                  </div>
                )}

                {/* SECTION 1: STAGE CHECKLIST */}
                {(() => {
                  const currentStageDef =
                    VISA_STAGES.find((s) => s.id === selectedCase.stage) || VISA_STAGES[0]

                  return (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-black text-slate-800 uppercase tracking-wider text-[11px]">
                          <span>📋</span>
                          <span>Stage Checklist ({currentStageDef.shortTitle})</span>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-200 text-slate-700">
                          Side Sheet Rule: Mandatory
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 italic">
                        &ldquo;Without completing mandatory items, cannot move stages.&rdquo;
                      </p>

                      <div className="space-y-2 pt-1">
                        {currentStageDef.checklist.map((chk) => {
                          const isChecked = Boolean(
                            selectedCase.completedChecklists &&
                              selectedCase.completedChecklists[chk.id]
                          )

                          return (
                            <label
                              key={chk.id}
                              className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200/90 hover:border-slate-300 transition-colors cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) =>
                                  handleToggleChecklist(selectedCase.id, chk.id, e.target.checked)
                                }
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 mt-0.5 cursor-pointer"
                              />
                              <span
                                className={`flex-1 text-xs font-medium leading-snug ${
                                  isChecked ? 'text-slate-900 line-through/10' : 'text-slate-700'
                                }`}
                              >
                                {chk.label}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                  chk.mandatory
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {chk.mandatory ? 'Mandatory' : 'Optional'}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })()}

                {/* SECTION 2: APPLICANT INFORMATION */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                    Applicant Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Applicant Name</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedCase.applicant}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Case ID</p>
                      <p className="text-xs font-mono font-bold text-slate-900 mt-0.5">{selectedCase.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Phone</p>
                      <p className="text-xs font-medium text-slate-800 mt-0.5">{selectedCase.phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Email</p>
                      <p className="text-xs font-medium text-slate-800 mt-0.5 truncate">{selectedCase.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Passport</p>
                      <p className="text-xs font-mono font-semibold text-slate-800 mt-0.5">
                        {selectedCase.passport || 'P3492819'} (Exp: {selectedCase.passportExp || '2029-08-20'})
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Application Date</p>
                      <p className="text-xs font-mono font-semibold text-slate-800 mt-0.5">{selectedCase.appliedDate}</p>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: VISA DETAILS */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                    Visa Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Target Country</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedCase.country}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Visa Type</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedCase.visaType}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Case Officer</p>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">{selectedCase.officer}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Officer ID</p>
                      <p className="text-xs font-mono font-semibold text-slate-800 mt-0.5">{selectedCase.officerId || 'CO-101'}</p>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Document Status</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-300 text-blue-700 bg-blue-50">
                        {selectedCase.docStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: PAYMENT SUMMARY */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                    Payment Summary
                  </h4>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                        <p className="text-[9px] uppercase font-bold text-slate-400">Total Fee</p>
                        <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
                          {formatINR(selectedCase.amount)}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-center">
                        <p className="text-[9px] uppercase font-bold text-emerald-700">Paid</p>
                        <p className="text-xs sm:text-sm font-black text-emerald-700 mt-0.5">
                          {formatINR(selectedCase.paidAmount || 0)}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 text-center">
                        <p className="text-[9px] uppercase font-bold text-rose-700">Pending</p>
                        <p className="text-xs sm:text-sm font-black text-rose-700 mt-0.5">
                          {formatINR(
                            Math.max(0, selectedCase.amount - (selectedCase.paidAmount || 0))
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between pt-1 border-t border-slate-100">
                      <span>Type: <strong className="text-slate-800">{selectedCase.paymentType}</strong></span>
                      <span>Status: <strong className="text-slate-800">{selectedCase.paymentStatus.replace('_', ' ')}</strong></span>
                      <span className="font-mono text-[10px]">Ref: {selectedCase.txnId || 'TXN-998144'}</span>
                    </div>
                  </div>
                </div>

                {/* SECTION 5: ADVANCE STAGE ACTIONS */}
                <div className="space-y-2.5 pt-2 border-t border-slate-200">
                  <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                    Advance Stage
                  </h4>
                  {(() => {
                    const currentStageDef =
                      VISA_STAGES.find((s) => s.id === selectedCase.stage) || VISA_STAGES[0]

                    return (
                      <div className="flex items-center gap-2">
                        {currentStageDef.nextStage ? (
                          <button
                            type="button"
                            onClick={() => handleAdvanceStage(selectedCase, currentStageDef.nextStage)}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0F0E2B] to-[#2E2B6E] hover:from-[#181445] hover:to-[#221F56] text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>Move to {currentStageDef.nextButtonText.replace('→ ', '')}</span>
                            <span>&rarr;</span>
                          </button>
                        ) : (
                          <div className="flex-1 py-2 text-center text-xs font-semibold text-slate-400 bg-slate-100 rounded-xl">
                            Final Stage Reached
                          </div>
                        )}

                        {selectedCase.stage !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => handleAdvanceStage(selectedCase, 'REJECTED')}
                            className="py-2.5 px-3.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer"
                          >
                            Mark as Rejected
                          </button>
                        )}
                      </div>
                    )
                  })()}
                </div>

                {/* View Full Case Details Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileModalCase(selectedCase)
                      setSelectedCaseId(null)
                    }}
                    className="w-full py-2.5 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs transition-all cursor-pointer text-center"
                  >
                    View Full Case Details &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL PROFILE / CASE DETAILS MODAL */}
      {profileModalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => setProfileModalCase(null)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 font-sans p-6 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
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
              <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                Financial Status
              </h4>
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
                    Visa Type *
                  </label>
                  <select
                    value={newCaseForm.visaType}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, visaType: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Standard Visitor">Standard Visitor</option>
                    <option value="Tourist C">Tourist C</option>
                    <option value="B1/B2 Business">B1/B2 Business</option>
                    <option value="Student Visa">Student Visa</option>
                    <option value="Work Permit">Work Permit</option>
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
    </div>
  )
}

export default Visa
