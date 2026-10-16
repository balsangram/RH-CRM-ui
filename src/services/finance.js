/**
 * Finance & Payment Management Service
 * Manages receipts ledger, prepaid orders, postpaid installments, and transaction logs.
 * Persistent in localStorage.
 */

const STORAGE_KEY_ENTRIES = 'rh_crm_finance_entries_v1'
const STORAGE_KEY_POSTPAID = 'rh_crm_finance_postpaid_v1'

// Initial 9 Multiple Payment Entries matching Screenshot 1
const INITIAL_PAYMENT_ENTRIES = [
  {
    id: 'PAY-101',
    caseRef: 'VISA-301',
    clientName: 'Vikramaditya Roy',
    service: 'Visa',
    orderType: 'PREPAID',
    paymentMode: 'UPI / NetBanking',
    amount: 10000,
    date: '2026-10-02',
    txnRef: 'TXN-998120',
    status: 'COMPLETED',
  },
  {
    id: 'PAY-102',
    caseRef: 'VISA-302',
    clientName: 'Sanya Malhotra',
    service: 'Visa',
    orderType: 'POSTPAID',
    paymentMode: 'Bank Transfer',
    amount: 8500,
    date: '2026-10-06',
    txnRef: 'TXN-998144',
    status: 'COMPLETED',
  },
  {
    id: 'PAY-103',
    caseRef: 'VISA-303',
    clientName: 'Ananya Iyer',
    service: 'Visa',
    orderType: 'PREPAID',
    paymentMode: 'Credit / Debit Card',
    amount: 16000,
    date: '2026-10-08',
    txnRef: 'TXN-998170',
    status: 'COMPLETED',
  },
  {
    id: 'PAY-104',
    caseRef: 'VISA-304',
    clientName: 'Rahul Mehta',
    service: 'Visa',
    orderType: 'POSTPAID',
    paymentMode: 'Bank Transfer',
    amount: 12000,
    date: '2026-10-09',
    txnRef: 'TXN-998188',
    status: 'COMPLETED',
  },
  {
    id: 'PAY-701',
    caseRef: 'PKG-701',
    clientName: 'Sanya Malhotra',
    service: 'Holiday',
    orderType: 'PREPAID',
    paymentMode: 'Bank Transfer',
    amount: 35000,
    date: '2026-10-01',
    txnRef: 'TXN-998200',
    status: 'COMPLETED',
  },
  {
    id: 'PAY-702',
    caseRef: 'PKG-701',
    clientName: 'Sanya Malhotra',
    service: 'Holiday',
    orderType: 'PREPAID',
    paymentMode: 'UPI / NetBanking',
    amount: 50000,
    date: '2026-10-05',
    txnRef: 'TXN-998205',
    status: 'COMPLETED',
  },
  {
    id: 'PAY-703',
    caseRef: 'PKG-702',
    clientName: 'Deepak Chopra',
    service: 'Holiday',
    orderType: 'POSTPAID',
    paymentMode: 'Bank Transfer',
    amount: 50000,
    date: '2026-09-29',
    txnRef: 'TXN-998220',
    status: 'COMPLETED',
  },
  {
    id: 'PAY-704',
    caseRef: 'PKG-703',
    clientName: 'Ananya Iyer',
    service: 'Holiday',
    orderType: 'PREPAID',
    paymentMode: 'Credit / Debit Card',
    amount: 95000,
    date: '2026-10-04',
    txnRef: 'TXN-998235',
    status: 'COMPLETED',
  },
  {
    id: 'PAY-705',
    caseRef: 'PKG-704',
    clientName: 'Rohit Sharma',
    service: 'Holiday',
    orderType: 'PREPAID',
    paymentMode: 'Bank Transfer',
    amount: 175000,
    date: '2026-09-22',
    txnRef: 'TXN-998250',
    status: 'COMPLETED',
  },
]

// Initial 9 Prepaid Orders matching Screenshot 5
const INITIAL_PREPAID_ORDERS = [
  {
    caseId: 'VISA-301',
    customerName: 'Vikramaditya Roy',
    serviceType: 'Visa',
    category: 'Schengen (France) - Tourist C',
    totalAmount: 18500,
    paidAmount: 18500,
    status: 'PAID IN FULL',
    paymentRef: 'TXN-998120',
  },
  {
    caseId: 'VISA-303',
    customerName: 'Rohan Joshi',
    serviceType: 'Visa',
    category: 'United States - B1/B2 Business',
    totalAmount: 21000,
    paidAmount: 21000,
    status: 'PAID IN FULL',
    paymentRef: 'TXN-997500',
  },
  {
    caseId: 'VISA-304',
    customerName: 'Priya Patel',
    serviceType: 'Visa',
    category: 'United States - B1/B2 Business',
    totalAmount: 21000,
    paidAmount: 21000,
    status: 'PAID IN FULL',
    paymentRef: 'TXN-998200',
  },
  {
    caseId: 'VISA-306',
    customerName: 'Meera Kapoor',
    serviceType: 'Visa',
    category: 'United Kingdom - Standard Visitor',
    totalAmount: 24000,
    paidAmount: 24000,
    status: 'PAID IN FULL',
    paymentRef: 'TXN-997800',
  },
  {
    caseId: 'VISA-307',
    customerName: 'Deepak Nair',
    serviceType: 'Visa',
    category: 'United States - B1/B2 Business',
    totalAmount: 21000,
    paidAmount: 21000,
    status: 'PAID IN FULL',
    paymentRef: 'TXN-997200',
  },
  {
    caseId: 'PKG-701',
    customerName: 'Sanya Malhotra',
    serviceType: 'Holiday',
    category: 'Bali Island Beach Getaway (Bali, Indonesia)',
    totalAmount: 85000,
    paidAmount: 85000,
    status: 'PAID IN FULL',
    paymentRef: 'INV-2026-0881',
  },
  {
    caseId: 'PKG-703',
    customerName: 'Ananya Iyer',
    serviceType: 'Holiday',
    category: 'Dubai Luxury Marina & Desert Safari (Dubai, UAE)',
    totalAmount: 95000,
    paidAmount: 95000,
    status: 'PAID IN FULL',
    paymentRef: 'INV-2026-0890',
  },
  {
    caseId: 'PKG-704',
    customerName: 'Rohit Sharma',
    serviceType: 'Holiday',
    category: 'Maldives Overwater Villa Honeymoon (Male, Maldives)',
    totalAmount: 175000,
    paidAmount: 175000,
    status: 'PAID IN FULL',
    paymentRef: 'INV-2026-0850',
  },
  {
    caseId: 'PKG-705',
    customerName: 'Meera Patel',
    serviceType: 'Holiday',
    category: 'Phuket & Krabi Island Explorer (Phuket, Thailand)',
    totalAmount: 72000,
    paidAmount: 72000,
    status: 'PAID IN FULL',
    paymentRef: 'INV-2026-0832',
  },
]

// Initial 5 Postpaid Orders matching Screenshot 3
const INITIAL_POSTPAID_ORDERS = [
  {
    caseId: 'VISA-302',
    customerName: 'Sanya Malhotra',
    service: 'Visa',
    totalAmount: 24000,
    paidSoFar: 10000,
    pendingBalance: 14000,
    progress: 42,
    status: 'PARTIALLY PAID',
  },
  {
    caseId: 'VISA-305',
    customerName: 'Arjun Mehta',
    service: 'Visa',
    totalAmount: 18500,
    paidSoFar: 0,
    pendingBalance: 18500,
    progress: 0,
    status: 'PENDING',
  },
  {
    caseId: 'PKG-702',
    customerName: 'Deepak Chopra',
    service: 'Holiday',
    totalAmount: 210000,
    paidSoFar: 50000,
    pendingBalance: 160000,
    progress: 24,
    status: 'PARTIAL',
  },
  {
    caseId: 'PKG-706',
    customerName: 'Rajesh Kapoor',
    service: 'Holiday',
    totalAmount: 245000,
    paidSoFar: 75000,
    pendingBalance: 170000,
    progress: 31,
    status: 'PARTIAL',
  },
  {
    caseId: 'PKG-707',
    customerName: 'Arjun Nair',
    service: 'Holiday',
    totalAmount: 68000,
    paidSoFar: 20000,
    pendingBalance: 48000,
    progress: 29,
    status: 'PARTIAL',
  },
]

// Initial 3 Revenue & Invoice Transaction Logs matching Screenshot 4
const INITIAL_TRANSACTION_LOGS = [
  {
    txnId: 'TXN-998120',
    appName: 'VISA-301 (France Tourist)',
    customerName: 'Vikramaditya Roy',
    txnType: 'Visa Fee',
    amount: 18500,
    paymentType: 'Prepaid',
    date: '2026-10-02',
    invoice: 'INV-998120',
  },
  {
    txnId: 'TXN-998144',
    appName: 'VISA-302 (UK Visitor)',
    customerName: 'Sanya Malhotra',
    txnType: 'Visa Deposit',
    amount: 10000,
    paymentType: 'Postpaid',
    date: '2026-10-05',
    invoice: 'INV-998144',
  },
  {
    txnId: 'TXN-998200',
    appName: 'PKG-701 (Bali Package)',
    customerName: 'Sanya Malhotra',
    txnType: 'Holiday Tour',
    amount: 85000,
    paymentType: 'Prepaid',
    date: '2026-10-01',
    invoice: 'INV-2026-0881',
  },
]

export const financeService = {
  // Get all payment entries
  getPaymentEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ENTRIES)
      if (raw) return JSON.parse(raw)
    } catch {
      // fallback
    }
    localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(INITIAL_PAYMENT_ENTRIES))
    return INITIAL_PAYMENT_ENTRIES
  },

  // Save payment entries
  savePaymentEntries(entries) {
    try {
      localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries))
    } catch (e) {
      console.error('Error saving finance entries:', e)
    }
  },

  // Add new payment entry
  addPaymentEntry(entryData) {
    const list = this.getPaymentEntries()
    const newId = `PAY-${Math.floor(100 + Math.random() * 900)}`
    const newEntry = {
      id: entryData.id || newId,
      caseRef: entryData.caseRef || 'VISA-301',
      clientName: entryData.clientName || 'Applicant',
      service: entryData.service || (entryData.caseRef?.startsWith('PKG') ? 'Holiday' : 'Visa'),
      orderType: entryData.orderType || 'PREPAID',
      paymentMode: entryData.paymentMode || 'Bank Transfer',
      amount: Number(entryData.amount) || 0,
      date: entryData.date || new Date().toISOString().split('T')[0],
      txnRef: entryData.txnRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      status: entryData.status || 'COMPLETED',
    }
    const updated = [newEntry, ...list]
    this.savePaymentEntries(updated)

    // Update postpaid list if matching case
    if (newEntry.orderType === 'POSTPAID') {
      this.recordInstallment(newEntry.caseRef, newEntry.amount)
    }

    return newEntry
  },

  // Update existing payment entry
  updatePaymentEntry(id, updatedFields) {
    const list = this.getPaymentEntries()
    const updated = list.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    this.savePaymentEntries(updated)
    return updated
  },

  // Delete payment entry
  deletePaymentEntry(id) {
    const list = this.getPaymentEntries()
    const updated = list.filter((item) => item.id !== id)
    this.savePaymentEntries(updated)
    return updated
  },

  // Get prepaid orders
  getPrepaidOrders() {
    return INITIAL_PREPAID_ORDERS
  },

  // Get postpaid orders
  getPostpaidOrders() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_POSTPAID)
      if (raw) return JSON.parse(raw)
    } catch {
      // fallback
    }
    localStorage.setItem(STORAGE_KEY_POSTPAID, JSON.stringify(INITIAL_POSTPOST_ORDERS()))
    return INITIAL_POSTPOST_ORDERS()
  },

  // Record an installment for a postpaid case
  recordInstallment(caseId, installmentAmount) {
    const list = this.getPostpaidOrders()
    const updated = list.map((item) => {
      if (item.caseId === caseId) {
        const newPaid = Number(item.paidSoFar || 0) + Number(installmentAmount || 0)
        const newPending = Math.max(0, Number(item.totalAmount) - newPaid)
        const newProgress = Math.min(100, Math.round((newPaid / Number(item.totalAmount)) * 100))
        return {
          ...item,
          paidSoFar: newPaid,
          pendingBalance: newPending,
          progress: newProgress,
          status: newPending === 0 ? 'COMPLETED' : 'PARTIALLY PAID',
        }
      }
      return item
    })
    try {
      localStorage.setItem(STORAGE_KEY_POSTPAID, JSON.stringify(updated))
    } catch (e) {
      console.error('Error updating postpaid orders:', e)
    }
    return updated
  },

  // Get transaction logs
  getTransactionLog() {
    return INITIAL_TRANSACTION_LOGS
  },

  // Calculate summary metrics
  getFinanceSummary() {
    const entries = this.getPaymentEntries()
    const postpaid = this.getPostpaidOrders()
    const prepaid = this.getPrepaidOrders()

    const totalCollected = entries.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
    const totalPending = postpaid.reduce((sum, p) => sum + (Number(p.pendingBalance) || 0), 0)
    const totalOrderValue =
      prepaid.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0) +
      postpaid.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0)

    const prepaidCount = prepaid.length
    const postpaidCount = postpaid.length

    return {
      totalCollected,
      entriesCount: entries.length,
      totalPending,
      totalOrderValue,
      prepaidCount,
      postpaidCount,
    }
  },
}

function INITIAL_POSTPOST_ORDERS() {
  return INITIAL_POSTPAID_ORDERS
}

export default financeService
