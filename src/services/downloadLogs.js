/**
 * Download & Audit Logs Service
 * Tracks when Travellers (individuals) and Companies (corporate/B2B clients)
 * download Case Stage dossiers, Invoices/Receipts, and Visa documents.
 */

const STORAGE_KEY_DOWNLOAD_LOGS = 'rh_crm_download_logs_v1'

export const DOCUMENT_CATEGORIES = [
  { id: 'ALL', label: 'All Document Types' },
  { id: 'INVOICE', label: 'Invoices & Receipts', color: 'amber' },
  { id: 'CASE_STAGES', label: 'Case Stages & Dossiers', color: 'blue' },
  { id: 'VISA_DOCUMENT', label: 'Visa & Approvals', color: 'emerald' },
  { id: 'TOUR_VOUCHER', label: 'Tour Vouchers & Passes', color: 'purple' },
]

export const USER_TYPES = [
  { id: 'ALL', label: 'All Entities' },
  { id: 'TRAVELLER', label: 'Travellers (Individual)', badgeBg: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'COMPANY', label: 'Companies (Corporate / B2B)', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' },
]

export const DEFAULT_DOWNLOAD_LOGS = [
  {
    id: 'LOG-801',
    timestamp: '2026-10-13 17:45:12',
    userType: 'COMPANY',
    user: 'Global Voyages B2B Ltd',
    contactPerson: 'Arunav Sengupta (Corporate Admin)',
    email: 'corporate@globalvoyages.com',
    phone: '+91 22 6789 4400',
    gstNumber: '27AAACG1234F1Z8',
    docCategory: 'INVOICE',
    docName: 'Corporate Tax Invoice & GST Summary',
    caseId: 'VISA-301',
    refNo: 'INV-2026-0854',
    fileSize: '1.8 MB',
    fileFormat: 'PDF',
    ipAddress: '103.21.124.58',
    location: 'Mumbai, India',
    device: 'Chrome / macOS 15.2',
    status: 'SUCCESS',
    downloadToken: 'TKN-883921-GV',
  },
  {
    id: 'LOG-802',
    timestamp: '2026-10-13 16:30:45',
    userType: 'TRAVELLER',
    user: 'Sanya Malhotra',
    contactPerson: 'Sanya Malhotra',
    email: 'sanya.m@gmail.com',
    phone: '+91 98111 55443',
    gstNumber: null,
    docCategory: 'VISA_DOCUMENT',
    docName: 'UK Standard Visitor E-Visa Grant PDF',
    caseId: 'VISA-302',
    refNo: 'UK-EV-89412',
    fileSize: '850 KB',
    fileFormat: 'PDF',
    ipAddress: '49.36.110.22',
    location: 'New Delhi, India',
    device: 'Safari / iPhone iOS 18',
    status: 'SUCCESS',
    downloadToken: 'TKN-492104-SM',
  },
  {
    id: 'LOG-803',
    timestamp: '2026-10-13 15:18:20',
    userType: 'TRAVELLER',
    user: 'Deepak Chopra',
    contactPerson: 'Deepak Chopra',
    email: 'deepak.c@rhglobal.com',
    phone: '+91 98200 22222',
    gstNumber: null,
    docCategory: 'CASE_STAGES',
    docName: 'Case Stage Progress Dossier (Stage 1: Booking Created)',
    caseId: 'PKG-702',
    refNo: 'DOS-PKG-702-S1',
    fileSize: '3.2 MB',
    fileFormat: 'PDF',
    ipAddress: '122.161.45.19',
    location: 'Bengaluru, India',
    device: 'Chrome / Windows 11',
    status: 'SUCCESS',
    downloadToken: 'TKN-120498-DC',
  },
  {
    id: 'LOG-804',
    timestamp: '2026-10-13 14:02:11',
    userType: 'COMPANY',
    user: 'Tata Consultancy Services - Travel Desk',
    contactPerson: 'Neha Deshmukh (Procurement Lead)',
    email: 'travel.desk@tcs.com',
    phone: '+91 20 6699 1200',
    gstNumber: '27AAACT2727Q1ZW',
    docCategory: 'INVOICE',
    docName: 'Consolidated B1/B2 Business Filing Tax Invoice',
    caseId: 'VISA-303',
    refNo: 'INV-2026-0865',
    fileSize: '2.1 MB',
    fileFormat: 'PDF',
    ipAddress: '115.112.89.4',
    location: 'Pune, India',
    device: 'Edge / Windows 11',
    status: 'SUCCESS',
    downloadToken: 'TKN-992145-TCS',
  },
  {
    id: 'LOG-805',
    timestamp: '2026-10-13 12:45:00',
    userType: 'TRAVELLER',
    user: 'Vikramaditya Roy',
    contactPerson: 'Vikramaditya Roy',
    email: 'vikram.roy@gmail.com',
    phone: '+91 97115 22345',
    gstNumber: null,
    docCategory: 'VISA_DOCUMENT',
    docName: 'France Schengen Consulate VFS Appointment & Submission Slip',
    caseId: 'VISA-301',
    refNo: 'VFS-FR-991240',
    fileSize: '620 KB',
    fileFormat: 'PDF',
    ipAddress: '103.88.232.14',
    location: 'Kolkata, India',
    device: 'Firefox / macOS',
    status: 'SUCCESS',
    downloadToken: 'TKN-330192-VR',
  },
  {
    id: 'LOG-806',
    timestamp: '2026-10-13 11:20:30',
    userType: 'COMPANY',
    user: 'Apex Technologies Pvt Ltd',
    contactPerson: 'Ramanathan Iyer (HR Manager)',
    email: 'hr@apextech.in',
    phone: '+91 80 4111 8899',
    gstNumber: '29AABCA9876C1Z5',
    docCategory: 'CASE_STAGES',
    docName: 'Multi-Applicant US B1/B2 Stage 3: Submitted Filing Pack',
    caseId: 'VISA-304',
    refNo: 'DOS-VISA-304-S3',
    fileSize: '4.5 MB',
    fileFormat: 'PDF',
    ipAddress: '182.73.19.66',
    location: 'Hyderabad, India',
    device: 'Chrome / macOS',
    status: 'SUCCESS',
    downloadToken: 'TKN-449102-APX',
  },
  {
    id: 'LOG-807',
    timestamp: '2026-10-13 09:55:18',
    userType: 'TRAVELLER',
    user: 'Rohit Sharma',
    contactPerson: 'Rohit Sharma',
    email: 'rohit.s@outlook.com',
    phone: '+91 98444 88990',
    gstNumber: null,
    docCategory: 'TOUR_VOUCHER',
    docName: 'Maldives Overwater Resort Voucher & Seaplane Transfer Pass',
    caseId: 'PKG-704',
    refNo: 'VOUCH-MLE-704',
    fileSize: '2.9 MB',
    fileFormat: 'PDF',
    ipAddress: '157.48.201.90',
    location: 'Ahmedabad, India',
    device: 'Chrome / Android 14',
    status: 'SUCCESS',
    downloadToken: 'TKN-771204-RS',
  },
  {
    id: 'LOG-808',
    timestamp: '2026-10-12 18:10:45',
    userType: 'COMPANY',
    user: 'Zenith Holidays & Corporate Travel',
    contactPerson: 'Kunal Kapoor (Partner)',
    email: 'accounts@zenithtravel.com',
    phone: '+91 11 4321 9000',
    gstNumber: '07AAACZ4321K1ZF',
    docCategory: 'INVOICE',
    docName: 'Advance Intake Payment Receipt TXN-998144',
    caseId: 'VISA-302',
    refNo: 'REC-TXN-998144',
    fileSize: '780 KB',
    fileFormat: 'PDF',
    ipAddress: '182.68.241.110',
    location: 'Gurugram, India',
    device: 'Chrome / Windows 10',
    status: 'SUCCESS',
    downloadToken: 'TKN-552190-ZH',
  },
  {
    id: 'LOG-809',
    timestamp: '2026-10-12 14:32:00',
    userType: 'TRAVELLER',
    user: 'Meera Patel',
    contactPerson: 'Meera Patel',
    email: 'meera.p@yahoo.com',
    phone: '+91 98555 12345',
    gstNumber: null,
    docCategory: 'INVOICE',
    docName: 'Phuket & Krabi Final Paid Settlement Invoice',
    caseId: 'PKG-705',
    refNo: 'INV-2026-0831',
    fileSize: '1.4 MB',
    fileFormat: 'PDF',
    ipAddress: '103.248.118.77',
    location: 'Chandigarh, India',
    device: 'Safari / iPad',
    status: 'SUCCESS',
    downloadToken: 'TKN-229104-MP',
  },
]

class DownloadLogsService {
  constructor() {
    this._initStorage()
  }

  _initStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DOWNLOAD_LOGS)
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_DOWNLOAD_LOGS, JSON.stringify(DEFAULT_DOWNLOAD_LOGS))
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for download logs:', e)
    }
  }

  getLogs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DOWNLOAD_LOGS)
      if (!raw) return DEFAULT_DOWNLOAD_LOGS
      return JSON.parse(raw)
    } catch (e) {
      return DEFAULT_DOWNLOAD_LOGS
    }
  }

  getLogById(id) {
    const list = this.getLogs()
    return list.find((item) => item.id === id) || null
  }

  addLog(entry) {
    const list = this.getLogs()
    const nextNum = 800 + list.length + 1
    const newLog = {
      id: entry.id || `LOG-${nextNum}`,
      timestamp: entry.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19),
      userType: entry.userType || 'TRAVELLER',
      user: entry.user || 'Customer',
      contactPerson: entry.contactPerson || entry.user,
      email: entry.email || 'user@example.com',
      phone: entry.phone || '+91 98000 00000',
      gstNumber: entry.gstNumber || null,
      docCategory: entry.docCategory || 'INVOICE',
      docName: entry.docName || 'Document Download',
      caseId: entry.caseId || 'CASE-GENERAL',
      refNo: entry.refNo || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      fileSize: entry.fileSize || '1.2 MB',
      fileFormat: entry.fileFormat || 'PDF',
      ipAddress: entry.ipAddress || '103.21.124.58',
      location: entry.location || 'India',
      device: entry.device || 'Chrome / macOS',
      status: 'SUCCESS',
      downloadToken: `TKN-${Math.floor(100000 + Math.random() * 900000)}`,
    }

    list.unshift(newLog)
    try {
      localStorage.setItem(STORAGE_KEY_DOWNLOAD_LOGS, JSON.stringify(list))
    } catch (e) {
      console.error('Failed to save download log:', e)
    }
    return newLog
  }

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEY_DOWNLOAD_LOGS, JSON.stringify(DEFAULT_DOWNLOAD_LOGS))
    return DEFAULT_DOWNLOAD_LOGS
  }
}

export const downloadLogsService = new DownloadLogsService()
export default downloadLogsService
