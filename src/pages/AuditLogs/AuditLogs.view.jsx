import React, { useState, useMemo, useEffect } from 'react'
import downloadLogsService, {
  DOCUMENT_CATEGORIES,
  USER_TYPES,
} from '../../services/downloadLogs'
import Pagination from '../../components/Pagination/Pagination.component'

export const AuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [activeUserType, setActiveUserType] = useState('ALL') // 'ALL' | 'TRAVELLER' | 'COMPANY'
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('ALL') // 'ALL' | 'TODAY' | '7_DAYS' | '30_DAYS'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Selected Log for detail modal
  const [selectedLog, setSelectedLog] = useState(null)
  const [copiedToken, setCopiedToken] = useState(false)

  // Load logs
  const reloadLogs = () => {
    const list = downloadLogsService.getLogs()
    setLogs(list)
    setIsLoading(false)
  }

  useEffect(() => {
    reloadLogs()
  }, [])

  // Filtered dataset
  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      // User type filter (Traveller vs Company)
      if (activeUserType !== 'ALL' && item.userType !== activeUserType) {
        return false
      }

      // Category filter (Invoice, Case stages, Visa)
      if (categoryFilter !== 'ALL' && item.docCategory !== categoryFilter) {
        return false
      }

      // Date range filter
      if (dateFilter === 'TODAY') {
        const todayStr = new Date().toISOString().slice(0, 10)
        if (!item.timestamp.startsWith(todayStr)) return false
      }

      // Search query
      const q = searchQuery.toLowerCase().trim()
      if (!q) return true

      return (
        item.id.toLowerCase().includes(q) ||
        item.user.toLowerCase().includes(q) ||
        (item.contactPerson || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q) ||
        (item.caseId || '').toLowerCase().includes(q) ||
        (item.refNo || '').toLowerCase().includes(q) ||
        item.docName.toLowerCase().includes(q) ||
        (item.ipAddress || '').toLowerCase().includes(q) ||
        (item.location || '').toLowerCase().includes(q) ||
        (item.gstNumber || '').toLowerCase().includes(q)
      )
    })
  }, [logs, activeUserType, categoryFilter, dateFilter, searchQuery])

  // Pagination calculation
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredLogs.slice(start, start + itemsPerPage)
  }, [filteredLogs, currentPage, itemsPerPage])

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeUserType, categoryFilter, dateFilter, searchQuery, itemsPerPage])

  // Metric stats
  const metrics = useMemo(() => {
    const total = logs.length
    const invoices = logs.filter((l) => l.docCategory === 'INVOICE').length
    const visaDocs = logs.filter((l) => l.docCategory === 'VISA_DOCUMENT').length
    const caseStages = logs.filter((l) => l.docCategory === 'CASE_STAGES').length
    const travellers = logs.filter((l) => l.userType === 'TRAVELLER').length
    const companies = logs.filter((l) => l.userType === 'COMPANY').length

    return { total, invoices, visaDocs, caseStages, travellers, companies }
  }, [logs])

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = [
      'Log ID',
      'Timestamp',
      'Entity Type',
      'User / Entity Name',
      'Contact Person',
      'Email',
      'Phone',
      'GST / Reg',
      'Document Category',
      'Document Name',
      'Case ID',
      'Ref Number',
      'File Size',
      'IP Address',
      'Location',
      'Device / Browser',
      'Status',
      'Verification Hash',
    ]

    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      l.userType,
      `"${l.user}"`,
      `"${l.contactPerson || ''}"`,
      l.email,
      l.phone,
      l.gstNumber || '',
      l.docCategory,
      `"${l.docName}"`,
      l.caseId,
      l.refNo,
      l.fileSize,
      l.ipAddress,
      `"${l.location}"`,
      `"${l.device}"`,
      l.status,
      l.downloadToken,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `RH_Download_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Copy token to clipboard
  const handleCopyToken = (token) => {
    navigator.clipboard?.writeText(token)
    setCopiedToken(true)
    setTimeout(() => setCopiedToken(false), 2000)
  }

  // Category Badge Helper
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'INVOICE':
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
            <span>📄</span> Invoice / Receipt
          </span>
        )
      case 'VISA_DOCUMENT':
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span>✈</span> Visa Document
          </span>
        )
      case 'CASE_STAGES':
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200">
            <span>📑</span> Case Stages
          </span>
        )
      case 'TOUR_VOUCHER':
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-purple-50 text-purple-800 border border-purple-200">
            <span>🌴</span> Tour Voucher
          </span>
        )
      default:
        return (
          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {category}
          </span>
        )
    }
  }

  return (
    <div className="space-y-3 pb-8 font-sans">
      {/* Top Header Card - Compact */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-3 sm:p-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="space-y-0.5">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Download & Access Audit Logs
            </h1>
            <p className="text-[11px] text-slate-500">
              Security & compliance trail tracking travellers and corporate companies downloading case stages, invoices, and visa documents.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-2.5 py-1.5 rounded-md bg-[#0F0E2B] hover:bg-[#181445] text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export CSV Report</span>
            </button>
          </div>
        </div>

        {/* Aggregate Metric Cards - Compact */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {/* Total */}
          <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Total Downloads</p>
            <p className="text-base sm:text-lg font-black text-slate-900 leading-tight mt-0.5">{metrics.total}</p>
            <p className="text-[9px] text-slate-400">All downloaded assets</p>
          </div>

          {/* Invoices */}
          <div className="p-2 sm:p-2.5 rounded-lg bg-amber-50/60 border border-amber-200">
            <p className="text-[9px] font-bold uppercase text-amber-700 tracking-wider">Invoices & Receipts</p>
            <p className="text-base sm:text-lg font-black text-amber-900 leading-tight mt-0.5">{metrics.invoices}</p>
            <p className="text-[9px] text-amber-600">Tax invoices & receipts</p>
          </div>

          {/* Visa Docs */}
          <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
            <p className="text-[9px] font-bold uppercase text-emerald-700 tracking-wider">Visa & Approvals</p>
            <p className="text-base sm:text-lg font-black text-emerald-900 leading-tight mt-0.5">{metrics.visaDocs}</p>
            <p className="text-[9px] text-emerald-600">E-Visas & grant letters</p>
          </div>

          {/* Case Stages */}
          <div className="p-2 sm:p-2.5 rounded-lg bg-blue-50/60 border border-blue-200">
            <p className="text-[9px] font-bold uppercase text-blue-700 tracking-wider">Case Stages Dossiers</p>
            <p className="text-base sm:text-lg font-black text-blue-900 leading-tight mt-0.5">{metrics.caseStages}</p>
            <p className="text-[9px] text-blue-600">Stage progress sheets</p>
          </div>

          {/* Entities */}
          <div className="p-2 sm:p-2.5 rounded-lg bg-purple-50/60 border border-purple-200 col-span-2 sm:col-span-1">
            <p className="text-[9px] font-bold uppercase text-purple-700 tracking-wider">Active Entities</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-black text-purple-900">
                {metrics.travellers} <span className="text-[9px] font-normal text-slate-500">Travellers</span>
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-xs font-black text-purple-900">
                {metrics.companies} <span className="text-[9px] font-normal text-slate-500">Companies</span>
              </span>
            </div>
            <p className="text-[9px] text-purple-600">B2C & B2B accounts</p>
          </div>
        </div>

        {/* Filter Controls Row - Compact */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          {/* Entity Type Toggle Tabs (Travellers vs Companies) */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveUserType('ALL')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                activeUserType === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Entities ({metrics.total})
            </button>

            <button
              type="button"
              onClick={() => setActiveUserType('TRAVELLER')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeUserType === 'TRAVELLER'
                  ? 'bg-white text-sky-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>👤</span>
              <span>Travellers ({metrics.travellers})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveUserType('COMPANY')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeUserType === 'COMPANY'
                  ? 'bg-white text-purple-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🏢</span>
              <span>Companies ({metrics.companies})</span>
            </button>
          </div>

          {/* Category Dropdown Filter & Search */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-700">Document:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2 py-1 rounded-md border border-slate-200 bg-white text-[11px] font-medium text-slate-800 focus:outline-hidden focus:border-[#E11D2E] cursor-pointer"
              >
                {DOCUMENT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-1 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-700">Time:</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-2 py-1 rounded-md border border-slate-200 bg-white text-[11px] font-medium text-slate-800 focus:outline-hidden focus:border-[#E11D2E] cursor-pointer"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user, company, case ID, IP..."
                className="w-full px-2.5 py-1 rounded-md border border-slate-200 bg-white text-[11px] text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#E11D2E]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Audit Logs Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-2 px-3">Log ID</th>
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">User / Entity</th>
                <th className="py-2 px-3">Downloaded Asset</th>
                <th className="py-2 px-3">Case Reference</th>
                <th className="py-2 px-3 text-center">Status</th>
                <th className="py-2 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    No download activity logs found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      {/* Log ID */}
                      <td className="py-2 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {log.id}
                      </td>

                      {/* Timestamp */}
                      <td className="py-2 px-3 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      {/* User / Entity */}
                      <td className="py-2 px-3 max-w-[200px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 leading-tight truncate">
                            {log.user}
                          </span>
                          <span
                            className={`px-1 py-0.2 rounded text-[9px] font-bold uppercase shrink-0 border ${
                              log.userType === 'COMPANY'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-sky-50 text-sky-700 border-sky-200'
                            }`}
                          >
                            {log.userType === 'COMPANY' ? '🏢 Company' : '👤 Traveller'}
                          </span>
                        </div>
                        <div className="flex flex-col text-[10px] text-slate-400 mt-0.5">
                          {log.contactPerson && log.userType === 'COMPANY' && (
                            <span className="text-slate-500 truncate">
                              Attn: {log.contactPerson}
                            </span>
                          )}
                          <span className="truncate">✉ {log.email}</span>
                          {log.gstNumber && (
                            <span className="font-mono text-[9px] text-purple-700">
                              GST: {log.gstNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Downloaded Asset */}
                      <td className="py-2 px-3 max-w-[210px]">
                        <p className="font-bold text-slate-900 leading-tight truncate" title={log.docName}>
                          {log.docName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {getCategoryBadge(log.docCategory)}
                          <span className="font-mono text-[9px] text-slate-400">
                            {log.fileSize}
                          </span>
                        </div>
                      </td>

                      {/* Case Reference */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 block leading-tight">
                          {log.caseId}
                        </span>
                        <span className="font-mono text-[9px] text-slate-400">
                          Ref: {log.refNo}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2 px-3 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Downloaded</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-2 px-3 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="px-2 py-0.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[10px] transition-colors cursor-pointer shadow-2xs"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination Component */}
        <div className="px-3 py-2 border-t border-slate-200 bg-slate-50/40">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredLogs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </div>

      {/* DETAIL AUDIT MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 font-sans">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setSelectedLog(null)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 p-5 space-y-3.5 animate-fade-in text-xs">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Audit Verification Payload
                  </h3>
                  <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-slate-100 border border-slate-200 text-slate-700">
                    {selectedLog.id}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Timestamp: {selectedLog.timestamp}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="w-6 h-6 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Entity Details Card */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 uppercase text-[9px] tracking-wider">
                  Entity Information
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border ${
                    selectedLog.userType === 'COMPANY'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-sky-50 text-sky-700 border-sky-200'
                  }`}
                >
                  {selectedLog.userType === 'COMPANY' ? 'Corporate Company' : 'Individual Traveller'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-slate-700 pt-1 text-[11px]">
                <p><strong>Name:</strong> {selectedLog.user}</p>
                <p><strong>Contact:</strong> {selectedLog.contactPerson || '—'}</p>
                <p><strong>Email:</strong> {selectedLog.email}</p>
                <p><strong>Phone:</strong> {selectedLog.phone || '—'}</p>
              </div>
            </div>

            {/* Asset Details Card */}
            <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5 text-xs">
              <span className="font-bold text-slate-900 uppercase text-[9px] tracking-wider block">
                Downloaded Document Asset
              </span>
              <div className="space-y-1 text-slate-700 text-[11px]">
                <p><strong>Document Name:</strong> {selectedLog.docName}</p>
                <p><strong>Category:</strong> {selectedLog.docCategory}</p>
                <p><strong>Linked Case:</strong> <span className="font-mono font-bold text-indigo-700">{selectedLog.caseId}</span></p>
                <p><strong>Document Ref No:</strong> <span className="font-mono">{selectedLog.refNo}</span></p>
                <p><strong>File Specifications:</strong> {selectedLog.fileSize} ({selectedLog.fileFormat})</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-3.5 py-1.5 rounded-md bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuditLogs
