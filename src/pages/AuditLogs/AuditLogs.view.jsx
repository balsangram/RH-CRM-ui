import React, { useState, useMemo, useEffect } from 'react'
import downloadLogsService, {
  DOCUMENT_CATEGORIES,
  USER_TYPES,
} from '../../services/downloadLogs'

export const AuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [activeUserType, setActiveUserType] = useState('ALL') // 'ALL' | 'TRAVELLER' | 'COMPANY'
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('ALL') // 'ALL' | 'TODAY' | '7_DAYS' | '30_DAYS'

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
      'Download Token',
    ]

    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      l.userType,
      `"${l.user}"`,
      `"${l.contactPerson || ''}"`,
      l.email,
      l.phone,
      l.gstNumber || 'N/A',
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
            <span>📄</span> Invoice / Receipt
          </span>
        )
      case 'VISA_DOCUMENT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span>✈</span> Visa Document
          </span>
        )
      case 'CASE_STAGES':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200">
            <span>📑</span> Case Stages
          </span>
        )
      case 'TOUR_VOUCHER':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-purple-50 text-purple-800 border border-purple-200">
            <span>🌴</span> Tour Voucher
          </span>
        )
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {category}
          </span>
        )
    }
  }

  return (
    <div className="space-y-4 pb-12 font-sans">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Download & Access Audit Logs
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md border border-slate-300 bg-slate-50 text-slate-700 shadow-2xs">
                {filteredLogs.length} of {logs.length} Download Events
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 tracking-tight">
              Security & compliance trail tracking travellers and corporate companies downloading case stages, invoices, and visa documents.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0F0E2B] to-[#2E2B6E] hover:from-[#181445] hover:to-[#221F56] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export CSV Report</span>
            </button>
          </div>
        </div>

        {/* Aggregate Metric Cards */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* Total */}
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200">
            <p className="text-[10px] font-bold uppercase text-slate-500">Total Downloads</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{metrics.total}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">All downloaded assets</p>
          </div>

          {/* Invoices */}
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
            <p className="text-[10px] font-bold uppercase text-amber-700">Invoices & Receipts</p>
            <p className="text-lg font-black text-amber-900 mt-0.5">{metrics.invoices}</p>
            <p className="text-[10px] text-amber-600 mt-0.5">Tax invoices & receipts</p>
          </div>

          {/* Visa Docs */}
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <p className="text-[10px] font-bold uppercase text-emerald-700">Visa & Approvals</p>
            <p className="text-lg font-black text-emerald-900 mt-0.5">{metrics.visaDocs}</p>
            <p className="text-[10px] text-emerald-600 mt-0.5">E-Visas & grant letters</p>
          </div>

          {/* Case Stages */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
            <p className="text-[10px] font-bold uppercase text-blue-700">Case Stages Dossiers</p>
            <p className="text-lg font-black text-blue-900 mt-0.5">{metrics.caseStages}</p>
            <p className="text-[10px] text-blue-600 mt-0.5">Stage progress sheets</p>
          </div>

          {/* Entities */}
          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 col-span-2 sm:col-span-1">
            <p className="text-[10px] font-bold uppercase text-purple-700">Active Entities</p>
            <p className="text-sm font-black text-purple-900 mt-1">
              {metrics.travellers} <span className="text-[10px] font-semibold text-slate-600">Travellers</span>
            </p>
            <p className="text-[11px] font-bold text-purple-700 mt-0.5">
              {metrics.companies} <span className="text-[10px] font-semibold text-slate-600">Companies (B2B)</span>
            </p>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {/* Entity Type Toggle Tabs (Travellers vs Companies) */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/90 p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveUserType('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeUserType === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Entities ({metrics.total})
            </button>

            <button
              type="button"
              onClick={() => setActiveUserType('TRAVELLER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeUserType === 'TRAVELLER'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>👤</span>
              <span>Travellers ({metrics.travellers})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveUserType('COMPANY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeUserType === 'COMPANY'
                  ? 'bg-white text-purple-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🏢</span>
              <span>Companies ({metrics.companies})</span>
            </button>
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Document:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {DOCUMENT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Time:</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user, company, case ID, IP..."
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
      </div>

      {/* Main Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User / Entity</th>
                <th className="py-3 px-4">Downloaded Asset</th>
                <th className="py-3 px-4">Case Reference</th>
                <th className="py-3 px-4">IP & Device</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    No download activity logs found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Log ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {log.id}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      {/* User / Entity */}
                      <td className="py-3.5 px-4 min-w-[220px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 leading-tight">
                            {log.user}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border ${
                              log.userType === 'COMPANY'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-sky-50 text-sky-700 border-sky-200'
                            }`}
                          >
                            {log.userType === 'COMPANY' ? '🏢 Company' : '👤 Traveller'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5 mt-1 text-[11px] text-slate-500 font-medium">
                          {log.contactPerson && log.userType === 'COMPANY' && (
                            <span className="text-slate-600 font-normal">
                              Attn: {log.contactPerson}
                            </span>
                          )}
                          <span className="truncate">✉ {log.email}</span>
                          {log.gstNumber && (
                            <span className="font-mono text-[10px] text-purple-700">
                              GST: {log.gstNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Downloaded Asset */}
                      <td className="py-3.5 px-4 min-w-[220px]">
                        <p className="font-bold text-slate-900 leading-tight">
                          {log.docName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {getCategoryBadge(log.docCategory)}
                          <span className="font-mono text-[10px] text-slate-400">
                            {log.fileSize}
                          </span>
                        </div>
                      </td>

                      {/* Case Reference */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 block">
                          {log.caseId}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">
                          Ref: {log.refNo}
                        </span>
                      </td>

                      {/* IP & Device */}
                      <td className="py-3.5 px-4 min-w-[170px]">
                        <p className="font-mono font-semibold text-slate-800 text-[11px] leading-tight">
                          {log.ipAddress}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {log.location} &bull; {log.device}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Downloaded</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
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
      </div>

      {/* DETAIL AUDIT MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => setSelectedLog(null)}
          />

          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">
                    Audit Verification Payload
                  </h3>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700">
                    {selectedLog.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Timestamp: {selectedLog.timestamp}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Entity Details Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                  Entity Information
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    selectedLog.userType === 'COMPANY'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-sky-50 text-sky-700 border-sky-200'
                  }`}
                >
                  {selectedLog.userType === 'COMPANY' ? 'Corporate Company' : 'Individual Traveller'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                <p><strong>Name:</strong> {selectedLog.user}</p>
                <p><strong>Contact:</strong> {selectedLog.contactPerson}</p>
                <p><strong>Email:</strong> {selectedLog.email}</p>
                <p><strong>Phone:</strong> {selectedLog.phone}</p>
                {selectedLog.gstNumber && (
                  <p className="col-span-2">
                    <strong>GST / Registration:</strong> <span className="font-mono text-purple-700">{selectedLog.gstNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Asset Details Card */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                Downloaded Document Asset
              </span>
              <div className="space-y-1 text-slate-700">
                <p><strong>Document Name:</strong> {selectedLog.docName}</p>
                <p><strong>Category:</strong> {selectedLog.docCategory}</p>
                <p><strong>Linked Case / Booking:</strong> <span className="font-mono font-bold text-indigo-700">{selectedLog.caseId}</span></p>
                <p><strong>Document Ref No:</strong> <span className="font-mono">{selectedLog.refNo}</span></p>
                <p><strong>File Specifications:</strong> {selectedLog.fileSize} ({selectedLog.fileFormat})</p>
              </div>
            </div>

            {/* Security & Client Network Footprint */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                Security & Network Footprint
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <p><strong>IP Address:</strong> <span className="font-mono">{selectedLog.ipAddress}</span></p>
                <p><strong>Geolocation:</strong> {selectedLog.location}</p>
                <p className="col-span-2"><strong>Device / User-Agent:</strong> {selectedLog.device}</p>
              </div>

              {/* Verification Token */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Verification Token</p>
                  <p className="font-mono text-[11px] text-slate-900 font-semibold">{selectedLog.downloadToken}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyToken(selectedLog.downloadToken)}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold text-[10px] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {copiedToken ? '✔ Copied' : 'Copy Hash'}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
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
