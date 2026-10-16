import React, { useState, useMemo, useEffect } from 'react'
import financeService from '../../services/finance'
import { downloadInvoice } from '../../utils/documentGenerators'
import Pagination from '../../components/Pagination/Pagination.component'

const formatINR = (val) => {
  if (val === undefined || val === null) return '₹0'
  return `₹${Number(val).toLocaleString('en-IN')}`
}

export const Finance = () => {
  // Active Tab: 'ENTRIES' | 'PREPAID' | 'POSTPAID' | 'LOGS'
  const [activeTab, setActiveTab] = useState('ENTRIES')

  // Data states
  const [entries, setEntries] = useState([])
  const [prepaidOrders, setPrepaidOrders] = useState([])
  const [postpaidOrders, setPostpaidOrders] = useState([])
  const [transactionLogs, setTransactionLogs] = useState([])
  const [metrics, setMetrics] = useState({
    totalCollected: 451500,
    entriesCount: 9,
    totalPending: 410500,
    totalOrderValue: 1098000,
    prepaidCount: 9,
    postpaidCount: 5,
  })

  // Filters for Receipts Ledger (Tab 1)
  const [serviceFilter, setServiceFilter] = useState('ALL')
  const [modeFilter, setModeFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [recordingInstallmentCase, setRecordingInstallmentCase] = useState(null)

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    serviceCategory: 'Visa', // 'Visa' | 'Holiday'
    caseRef: 'VISA-301 — Vikramaditya Roy (Due: ₹0)',
    clientName: 'Vikramaditya Roy',
    amount: '5000',
    paymentScheme: 'Prepaid (Full Advance)',
    paymentMode: 'Bank Transfer (NEFT/RTGS/IMPS)',
    paymentDate: new Date().toISOString().split('T')[0],
    txnRef: 'TXN-720132',
    paymentStatus: 'Completed (Verified)',
  })

  // Refresh all data
  const refreshData = () => {
    const ent = financeService.getPaymentEntries()
    const prep = financeService.getPrepaidOrders()
    const post = financeService.getPostpaidOrders()
    const logs = financeService.getTransactionLog()
    const summary = financeService.getFinanceSummary()

    setEntries(ent)
    setPrepaidOrders(prep)
    setPostpaidOrders(post)
    setTransactionLogs(logs)
    setMetrics(summary)
  }

  useEffect(() => {
    refreshData()
  }, [])

  // Filtered payment entries (Tab 1)
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      if (serviceFilter !== 'ALL' && item.service.toLowerCase() !== serviceFilter.toLowerCase()) {
        return false
      }
      if (modeFilter !== 'ALL') {
        if (!item.paymentMode.toLowerCase().includes(modeFilter.toLowerCase())) {
          return false
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matches =
          item.id.toLowerCase().includes(q) ||
          item.caseRef.toLowerCase().includes(q) ||
          item.clientName.toLowerCase().includes(q) ||
          item.txnRef.toLowerCase().includes(q) ||
          item.paymentMode.toLowerCase().includes(q)
        if (!matches) return false
      }
      return true
    })
  }, [entries, serviceFilter, modeFilter, searchQuery])

  // Pagination states for all 4 tabs
  const [entriesPage, setEntriesPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(5)

  const [prepaidPage, setPrepaidPage] = useState(1)
  const [prepaidPerPage, setPrepaidPerPage] = useState(5)

  const [postpaidPage, setPostpaidPage] = useState(1)
  const [postpaidPerPage, setPostpaidPerPage] = useState(5)

  const [logsPage, setLogsPage] = useState(1)
  const [logsPerPage, setLogsPerPage] = useState(5)

  // Reset tab 1 page when filters change
  useEffect(() => {
    setEntriesPage(1)
  }, [serviceFilter, modeFilter, searchQuery])

  // Tab 1 Paginated Entries
  const totalEntriesPages = Math.ceil(filteredEntries.length / entriesPerPage) || 1
  const paginatedEntries = useMemo(() => {
    const start = (entriesPage - 1) * entriesPerPage
    return filteredEntries.slice(start, start + entriesPerPage)
  }, [filteredEntries, entriesPage, entriesPerPage])

  // Tab 2 Paginated Prepaid Orders
  const totalPrepaidPages = Math.ceil(prepaidOrders.length / prepaidPerPage) || 1
  const paginatedPrepaid = useMemo(() => {
    const start = (prepaidPage - 1) * prepaidPerPage
    return prepaidOrders.slice(start, start + prepaidPerPage)
  }, [prepaidOrders, prepaidPage, prepaidPerPage])

  // Tab 3 Paginated Postpaid Orders
  const totalPostpaidPages = Math.ceil(postpaidOrders.length / postpaidPerPage) || 1
  const paginatedPostpaid = useMemo(() => {
    const start = (postpaidPage - 1) * postpaidPerPage
    return postpaidOrders.slice(start, start + postpaidPerPage)
  }, [postpaidOrders, postpaidPage, postpaidPerPage])

  // Tab 4 Paginated Transaction Logs
  const totalLogsPages = Math.ceil(transactionLogs.length / logsPerPage) || 1
  const paginatedLogs = useMemo(() => {
    const start = (logsPage - 1) * logsPerPage
    return transactionLogs.slice(start, start + logsPerPage)
  }, [transactionLogs, logsPage, logsPerPage])

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      serviceCategory: 'Visa',
      caseRef: 'VISA-301 — Vikramaditya Roy (Due: ₹0)',
      clientName: 'Vikramaditya Roy',
      amount: '5000',
      paymentScheme: 'Prepaid (Full Advance)',
      paymentMode: 'Bank Transfer (NEFT/RTGS/IMPS)',
      paymentDate: new Date().toISOString().split('T')[0],
      txnRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentStatus: 'Completed (Verified)',
    })
    setShowAddModal(true)
  }

  // Open Record Installment Modal for Postpaid case
  const handleOpenRecordInstallment = (postpaidCase) => {
    setRecordingInstallmentCase(postpaidCase)
    setFormData({
      serviceCategory: postpaidCase.service,
      caseRef: `${postpaidCase.caseId} — ${postpaidCase.customerName} (Due: ${formatINR(postpaidCase.pendingBalance)})`,
      clientName: postpaidCase.customerName,
      amount: String(postpaidCase.pendingBalance > 0 ? Math.min(postpaidCase.pendingBalance, 10000) : 5000),
      paymentScheme: 'Postpaid (Milestone Installment)',
      paymentMode: 'Bank Transfer (NEFT/RTGS/IMPS)',
      paymentDate: new Date().toISOString().split('T')[0],
      txnRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentStatus: 'Completed (Verified)',
    })
    setShowAddModal(true)
  }

  // Handle Save Payment Entry
  const handleSaveEntry = (e) => {
    e.preventDefault()
    const cleanCaseRef = formData.caseRef.split(' ')[0]
    const cleanOrderType = formData.paymentScheme.toLowerCase().includes('postpaid') ? 'POSTPAID' : 'PREPAID'
    const cleanMode = formData.paymentMode.replace(/\s*\([^)]*\)/g, '')
    const cleanStatus = formData.paymentStatus.includes('Completed') ? 'COMPLETED' : 'PENDING'

    if (editingEntry) {
      financeService.updatePaymentEntry(editingEntry.id, {
        caseRef: cleanCaseRef,
        clientName: formData.clientName,
        service: formData.serviceCategory,
        orderType: cleanOrderType,
        paymentMode: cleanMode,
        amount: Number(formData.amount) || 0,
        date: formData.paymentDate,
        txnRef: formData.txnRef,
        status: cleanStatus,
      })
      setEditingEntry(null)
    } else {
      financeService.addPaymentEntry({
        caseRef: cleanCaseRef,
        clientName: formData.clientName,
        service: formData.serviceCategory,
        orderType: cleanOrderType,
        paymentMode: cleanMode,
        amount: Number(formData.amount) || 0,
        date: formData.paymentDate,
        txnRef: formData.txnRef,
        status: cleanStatus,
      })
      if (recordingInstallmentCase) {
        financeService.recordInstallment(recordingInstallmentCase.caseId, Number(formData.amount) || 0)
        setRecordingInstallmentCase(null)
      }
    }

    setShowAddModal(false)
    refreshData()
  }

  // Handle Delete
  const handleDeleteEntry = () => {
    if (deleteConfirmId) {
      financeService.deletePaymentEntry(deleteConfirmId)
      setDeleteConfirmId(null)
      refreshData()
    }
  }

  // Handle Download Receipt for an entry
  const handleDownloadReceipt = (entry) => {
    downloadInvoice(
      {
        id: entry.caseRef,
        applicant: entry.clientName,
        customer: entry.clientName,
        amount: entry.amount,
        price: entry.amount,
        paidAmount: entry.amount,
        paymentType: entry.orderType,
        paymentStatus: 'COMPLETED',
        txnId: entry.txnRef,
        invoiceRef: entry.txnRef,
        country: entry.service === 'Visa' ? 'International' : 'Global Tour',
        visaType: entry.service,
        packageName: `${entry.service} Package`,
      },
      entry.service.toLowerCase()
    )
  }

  // Export handlers
  const handleExportExcel = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Payment ID,Case Ref,Client Name,Service,Order Type,Payment Mode,Amount,Date,Txn Ref,Status\n' +
      entries
        .map(
          (e) =>
            `${e.id},${e.caseRef},"${e.clientName}",${e.service},${e.orderType},"${e.paymentMode}",${e.amount},${e.date},${e.txnRef},${e.status}`
        )
        .join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Finance_Ledger_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <div className="space-y-3.5 font-sans pb-12">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER SECTION (Matching Screenshot 1)                 */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white px-3.5 py-3 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Finance & Payment Management
            </h1>
            {/* <span className="px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50 font-mono text-[10px] font-semibold text-slate-600">
              {metrics.entriesCount} Payment Entries
            </span> */}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Manage multiple payment entries, prepaid & postpaid orders, and installment collections.
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-2.5 py-1.5 rounded-lg bg-[#0F0E2B] hover:bg-[#181445] text-white text-[11px] font-semibold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Add Payment Entry</span>
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
          >
            Export Excel
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. TOP 4 KPI METRIC CARDS (Matching Screenshot 1-5)           */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Card 1: Total Collected (Paid) */}
        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-0.5">
          <p className="text-[9.5px] font-bold tracking-wider uppercase text-slate-400">
            TOTAL COLLECTED (PAID)
          </p>
          <p className="text-lg sm:text-xl font-bold text-emerald-600 tracking-tight">
            {formatINR(metrics.totalCollected)}
          </p>
          <p className="text-[10px] text-emerald-700/80 font-medium">
            Across {metrics.entriesCount} recorded payments
          </p>
        </div>

        {/* Card 2: Pending Balance (Postpaid) */}
        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-0.5">
          <p className="text-[9.5px] font-bold tracking-wider uppercase text-slate-400">
            PENDING BALANCE (POSTPAID)
          </p>
          <p className="text-lg sm:text-xl font-bold text-rose-500 tracking-tight">
            {formatINR(metrics.totalPending)}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            Awaiting installment clearances
          </p>
        </div>

        {/* Card 3: Total Invoiced Order Value */}
        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-0.5">
          <p className="text-[9.5px] font-bold tracking-wider uppercase text-slate-400">
            TOTAL INVOICED ORDER VALUE
          </p>
          <p className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {formatINR(metrics.totalOrderValue)}
          </p>
          <p className="text-[10px] text-slate-500 font-medium">
            7 Visa cases + 7 Holiday bookings
          </p>
        </div>

        {/* Card 4: Order Category Split */}
        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-0.5">
          <p className="text-[9.5px] font-bold tracking-wider uppercase text-slate-400">
            ORDER CATEGORY SPLIT
          </p>
          <p className="text-sm sm:text-base font-bold text-slate-900 tracking-tight pt-0.5">
            {metrics.prepaidCount} Prepaid / {metrics.postpaidCount} Postpaid
          </p>
          <p className="text-[10px] text-slate-500 font-medium">
            Prepaid vs Postpaid schemes
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. FOUR NAVIGATION TABS (Matching Screenshot 1)               */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
        <button
          type="button"
          onClick={() => setActiveTab('ENTRIES')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'ENTRIES'
              ? 'bg-[#0F0E2B] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>💳</span>
          <span>Multiple Payment Entries ({metrics.entriesCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PREPAID')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'PREPAID'
              ? 'bg-[#0F0E2B] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>🧳</span>
          <span>Prepaid Orders ({metrics.prepaidCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('POSTPAID')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'POSTPAID'
              ? 'bg-[#0F0E2B] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>⏳</span>
          <span>Postpaid Orders & Balances ({metrics.postpaidCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('LOGS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'LOGS'
              ? 'bg-[#0F0E2B] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>📄</span>
          <span>Invoices & Transaction Log ({transactionLogs.length})</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. TAB 1: ALL MULTIPLE PAYMENT ENTRIES (RECEIPTS LEDGER)      */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'ENTRIES' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Header & Filter Bar */}
          <div className="p-3 sm:px-4 sm:py-3 border-b border-slate-200 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                All Multiple Payment Entries (Receipts Ledger)
              </h3>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-2.5 py-1.5 rounded-lg bg-[#0F0E2B] hover:bg-[#181445] text-white text-[11px] font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1"
              >
                <span>+</span>
                <span>Add Payment Entry</span>
              </button>
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">Service Type:</span>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Services</option>
                  <option value="Visa">Visa Application Cases</option>
                  <option value="Holiday">Holiday Tour Bookings</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">Payment Mode:</span>
                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Modes</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI / NetBanking</option>
                  <option value="Card">Credit / Debit Card</option>
                </select>
              </div>

              <div className="flex-1 min-w-[220px] flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">Search:</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search payment ID, case#, client, TXN..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">PAYMENT ID</th>
                  <th className="py-3 px-3.5">CASE / ORDER REF</th>
                  <th className="py-3 px-3.5">CLIENT NAME</th>
                  <th className="py-3 px-3.5">SERVICE</th>
                  <th className="py-3 px-3.5">ORDER TYPE</th>
                  <th className="py-3 px-3.5">PAYMENT MODE</th>
                  <th className="py-3 px-3.5">AMOUNT (₹)</th>
                  <th className="py-3 px-3.5">DATE</th>
                  <th className="py-3 px-3.5">TXN REFERENCE</th>
                  <th className="py-3 px-3.5">STATUS</th>
                  <th className="py-3 px-3.5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedEntries.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-400 italic">
                      No payment entries found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedEntries.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {item.id}
                      </td>
                      <td className="py-3 px-3.5 font-mono font-bold text-blue-600 hover:underline cursor-pointer whitespace-nowrap">
                        {item.caseRef}
                      </td>
                      <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {item.clientName}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                            item.service === 'Visa'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {item.service === 'Visa' ? '🛂 Visa' : '🌴 Holiday'}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border border-slate-200 bg-slate-50 text-slate-700">
                          {item.orderType}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 font-medium whitespace-nowrap">
                        {item.paymentMode}
                      </td>
                      <td className="py-3 px-3.5 font-black text-slate-900 whitespace-nowrap">
                        {formatINR(item.amount)}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                        {item.txnRef}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border border-slate-200 bg-slate-50 text-slate-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleDownloadReceipt(item)}
                            className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[9px] cursor-pointer transition-colors"
                          >
                            Receipt
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEntry(item)
                              setFormData({
                                serviceCategory: item.service,
                                caseRef: item.caseRef,
                                clientName: item.clientName,
                                amount: String(item.amount),
                                paymentScheme: item.orderType === 'POSTPAID' ? 'Postpaid (Milestone Installment)' : 'Prepaid (Full Advance)',
                                paymentMode: item.paymentMode,
                                paymentDate: item.date,
                                txnRef: item.txnRef,
                                paymentStatus: item.status === 'COMPLETED' ? 'Completed (Verified)' : 'Pending Clearance',
                              })
                              setShowAddModal(true)
                            }}
                            className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[9px] cursor-pointer transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="px-2 py-1 rounded border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-[9px] cursor-pointer transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination for Tab 1 */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white">
            <Pagination
              currentPage={entriesPage}
              totalPages={totalEntriesPages}
              totalItems={filteredEntries.length}
              itemsPerPage={entriesPerPage}
              onPageChange={(page) => setEntriesPage(page)}
              onItemsPerPageChange={(size) => {
                setEntriesPerPage(size)
                setEntriesPage(1)
              }}
              pageSizeOptions={[5, 10, 20]}
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. TAB 2: PREPAID ORDERS (100% UPFRONT ADVANCE) (Image 5)     */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'PREPAID' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3 sm:px-4 sm:py-2.5 border-b border-slate-200">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              Prepaid Orders (100% Upfront Advance)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Orders where the client settled the entire billing amount upfront.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">CASE ID</th>
                  <th className="py-3 px-3.5">CUSTOMER NAME</th>
                  <th className="py-3 px-3.5">SERVICE TYPE</th>
                  <th className="py-3 px-3.5">PACKAGE / VISA CATEGORY</th>
                  <th className="py-3 px-3.5">TOTAL AMOUNT</th>
                  <th className="py-3 px-3.5">PAID AMOUNT</th>
                  <th className="py-3 px-3.5">PAYMENT STATUS</th>
                  <th className="py-3 px-3.5">PAYMENT REF</th>
                  <th className="py-3 px-3.5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedPrepaid.map((order) => (
                  <tr key={order.caseId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {order.caseId}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                          order.serviceType === 'Visa'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {order.serviceType === 'Visa' ? '🛂 Visa' : '🌴 Holiday'}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-700 font-medium whitespace-nowrap">
                      {order.category}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {formatINR(order.totalAmount)}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-emerald-600 whitespace-nowrap">
                      {formatINR(order.paidAmount)}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-emerald-200 bg-emerald-50 text-emerald-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                      {order.paymentRef}
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          downloadInvoice(
                            {
                              id: order.caseId,
                              applicant: order.customerName,
                              amount: order.totalAmount,
                              paidAmount: order.paidAmount,
                              paymentType: 'Prepaid',
                              paymentStatus: 'PAID IN FULL',
                              country: order.category,
                              visaType: order.category,
                              packageName: order.category,
                            },
                            order.serviceType.toLowerCase()
                          )
                        }
                        className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-[9px] cursor-pointer transition-colors"
                      >
                        View Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination for Tab 2 */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white">
            <Pagination
              currentPage={prepaidPage}
              totalPages={totalPrepaidPages}
              totalItems={prepaidOrders.length}
              itemsPerPage={prepaidPerPage}
              onPageChange={(page) => setPrepaidPage(page)}
              onItemsPerPageChange={(size) => {
                setPrepaidPerPage(size)
                setPrepaidPage(1)
              }}
              pageSizeOptions={[5, 10, 20]}
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. TAB 3: POSTPAID ORDERS & INSTALLMENTS (Image 3)            */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'POSTPAID' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3 sm:px-4 sm:py-2.5 border-b border-slate-200">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              Postpaid Orders & Installments (Pending Balances)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Orders operating on milestone partial payments. Click &ldquo;Record Installment&rdquo; to log an installment.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">CASE ID</th>
                  <th className="py-3 px-3.5">CUSTOMER NAME</th>
                  <th className="py-3 px-3.5">SERVICE</th>
                  <th className="py-3 px-3.5">TOTAL AMOUNT</th>
                  <th className="py-3 px-3.5">PAID SO FAR</th>
                  <th className="py-3 px-3.5">PENDING BALANCE</th>
                  <th className="py-3 px-3.5">COLLECTION PROGRESS</th>
                  <th className="py-3 px-3.5">STATUS</th>
                  <th className="py-3 px-3.5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedPostpaid.map((post) => (
                  <tr key={post.caseId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {post.caseId}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {post.customerName}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                          post.service === 'Visa'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {post.service === 'Visa' ? '🛂 Visa' : '🌴 Holiday'}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {formatINR(post.totalAmount)}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-emerald-600 whitespace-nowrap">
                      {formatINR(post.paidSoFar)}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-rose-600 whitespace-nowrap">
                      {formatINR(post.pendingBalance)}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-500"
                            style={{ width: `${post.progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-slate-500 font-bold shrink-0">
                          {post.progress}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {formatINR(post.pendingBalance)} due
                      </span>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border border-slate-200 bg-slate-50 text-slate-700">
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenRecordInstallment(post)}
                        className="px-2.5 py-1 rounded bg-[#0F0E2B] hover:bg-[#181445] text-white font-bold text-[9px] transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                      >
                        <span>+</span>
                        <span>Record Installment</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination for Tab 3 */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white">
            <Pagination
              currentPage={postpaidPage}
              totalPages={totalPostpaidPages}
              totalItems={postpaidOrders.length}
              itemsPerPage={postpaidPerPage}
              onPageChange={(page) => setPostpaidPage(page)}
              onItemsPerPageChange={(size) => {
                setPostpaidPerPage(size)
                setPostpaidPage(1)
              }}
              pageSizeOptions={[5, 10, 20]}
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. TAB 4: REVENUE & INVOICE TRANSACTION LOG (Image 4)         */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'LOGS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3 sm:px-4 sm:py-2.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              Revenue & Invoice Transaction Log
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportExcel}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-medium cursor-pointer"
              >
                Export Excel
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-medium cursor-pointer"
              >
                Export PDF
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">TRANSACTION ID</th>
                  <th className="py-3 px-3.5">APPLICATION NAME</th>
                  <th className="py-3 px-3.5">CUSTOMER NAME</th>
                  <th className="py-3 px-3.5">TRANSACTION TYPE</th>
                  <th className="py-3 px-3.5">AMOUNT</th>
                  <th className="py-3 px-3.5">PAYMENT TYPE</th>
                  <th className="py-3 px-3.5">TRANSACTION DATE</th>
                  <th className="py-3 px-3.5">INVOICE</th>
                  <th className="py-3 px-3.5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLogs.map((log) => (
                  <tr key={log.txnId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {log.txnId}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {log.appName}
                    </td>
                    <td className="py-3 px-3.5 font-medium text-slate-800 whitespace-nowrap">
                      {log.customerName}
                    </td>
                    <td className="py-3 px-3.5 text-slate-700 whitespace-nowrap">
                      {log.txnType}
                    </td>
                    <td className="py-3 px-3.5 font-black text-slate-900 whitespace-nowrap">
                      {formatINR(log.amount)}
                    </td>
                    <td className="py-3 px-3.5 text-slate-700 whitespace-nowrap">
                      {log.paymentType}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {log.date}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                      {log.invoice}
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          downloadInvoice(
                            {
                              id: log.appName,
                              applicant: log.customerName,
                              amount: log.amount,
                              paidAmount: log.amount,
                              paymentType: log.paymentType,
                              paymentStatus: 'COMPLETED',
                              invoiceRef: log.invoice,
                              txnId: log.txnId,
                              country: 'International',
                              visaType: log.txnType,
                              packageName: log.appName,
                            },
                            log.appName.startsWith('PKG') ? 'holiday' : 'visa'
                          )
                        }
                        className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-[9px] cursor-pointer transition-colors"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination for Tab 4 */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white">
            <Pagination
              currentPage={logsPage}
              totalPages={totalLogsPages}
              totalItems={transactionLogs.length}
              itemsPerPage={logsPerPage}
              onPageChange={(page) => setLogsPage(page)}
              onItemsPerPageChange={(size) => {
                setLogsPerPage(size)
                setLogsPage(1)
              }}
              pageSizeOptions={[5, 10, 20]}
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. MODAL: ADD / EDIT MULTIPLE PAYMENT ENTRY (Image 2)          */}
      {/* ------------------------------------------------------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                {editingEntry ? 'Edit Payment Entry' : 'Add Multiple Payment Entry'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false)
                  setEditingEntry(null)
                  setRecordingInstallmentCase(null)
                }}
                className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEntry} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              {/* Service Category */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Service Category:
                </label>
                <select
                  value={formData.serviceCategory}
                  onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Visa">🛂 Visa Application Case</option>
                  <option value="Holiday">🌴 Holiday Tour Booking</option>
                </select>
              </div>

              {/* Select Case / Booking */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Select Case / Booking:
                </label>
                <select
                  value={formData.caseRef}
                  onChange={(e) => {
                    const sel = e.target.value
                    const name = sel.includes('—') ? sel.split('—')[1].split('(')[0].trim() : 'Applicant'
                    setFormData({ ...formData, caseRef: sel, clientName: name })
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="VISA-301 — Vikramaditya Roy (Due: ₹0)">VISA-301 — Vikramaditya Roy (Due: ₹0)</option>
                  <option value="VISA-302 — Sanya Malhotra (Due: ₹14,000)">VISA-302 — Sanya Malhotra (Due: ₹14,000)</option>
                  <option value="VISA-303 — Ananya Iyer (Due: ₹0)">VISA-303 — Ananya Iyer (Due: ₹0)</option>
                  <option value="VISA-304 — Rahul Mehta (Due: ₹9,000)">VISA-304 — Rahul Mehta (Due: ₹9,000)</option>
                  <option value="VISA-305 — Arjun Mehta (Due: ₹18,500)">VISA-305 — Arjun Mehta (Due: ₹18,500)</option>
                  <option value="PKG-701 — Sanya Malhotra (Due: ₹0)">PKG-701 — Sanya Malhotra (Due: ₹0)</option>
                  <option value="PKG-702 — Deepak Chopra (Due: ₹160,000)">PKG-702 — Deepak Chopra (Due: ₹160,000)</option>
                  <option value="PKG-703 — Ananya Iyer (Due: ₹0)">PKG-703 — Ananya Iyer (Due: ₹0)</option>
                  <option value="PKG-704 — Rohit Sharma (Due: ₹0)">PKG-704 — Rohit Sharma (Due: ₹0)</option>
                  <option value="PKG-706 — Rajesh Kapoor (Due: ₹170,000)">PKG-706 — Rajesh Kapoor (Due: ₹170,000)</option>
                </select>
              </div>

              {/* Payment Entry Amount */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Payment Entry Amount (₹):
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="5000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Payment Scheme */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Payment Scheme:
                </label>
                <select
                  value={formData.paymentScheme}
                  onChange={(e) => setFormData({ ...formData, paymentScheme: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Prepaid (Full Advance)">Prepaid (Full Advance)</option>
                  <option value="Postpaid (Milestone Installment)">Postpaid (Milestone Installment)</option>
                </select>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Payment Mode:
                </label>
                <select
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Bank Transfer (NEFT/RTGS/IMPS)">Bank Transfer (NEFT/RTGS/IMPS)</option>
                  <option value="UPI / NetBanking">UPI / NetBanking</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                  <option value="Cash / Cheque">Cash / Cheque</option>
                </select>
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Payment Date:
                </label>
                <input
                  type="date"
                  required
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Reference / TXN ID */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Reference / TXN ID:
                </label>
                <input
                  type="text"
                  required
                  value={formData.txnRef}
                  onChange={(e) => setFormData({ ...formData, txnRef: e.target.value })}
                  placeholder="TXN-720132"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Payment Status:
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Completed (Verified)">Completed (Verified)</option>
                  <option value="Pending Clearance">Pending Clearance</option>
                </select>
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingEntry(null)
                    setRecordingInstallmentCase(null)
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F0E2B] hover:bg-[#181445] text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  Save Payment Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h4 className="text-base font-black text-slate-900">Delete Payment Entry?</h4>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete payment entry <strong className="font-mono">{deleteConfirmId}</strong>? This will update collection totals.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteEntry}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Finance
