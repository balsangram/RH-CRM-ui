/**
 * Holiday & Tour Booking Cases Processing Pipeline Service
 * Manages Holiday Cases, stage workflows, mandatory stage checklists, and real-time state persistence.
 */

const STORAGE_KEY_HOLIDAY_CASES = 'rh_crm_holiday_cases_v2'

export const HOLIDAY_STAGES = [
  {
    id: 'BOOKING_CREATED',
    stepNumber: 1,
    title: 'Stage 1: Booking Created',
    shortTitle: 'Booking Created',
    subtitle: 'Lead converted / Travel dates & PAX confirmed',
    colorBadge: 'bg-amber-500 text-white',
    badgeBorder: 'border-amber-400 text-amber-700 bg-amber-50/90',
    headerBg: 'bg-amber-500/10 text-amber-900 border-amber-300',
    nextStage: 'DOCS_ITINERARY',
    nextButtonText: '→ Docs & Itinerary',
    checklist: [
      { id: 'b1', label: 'Travel dates & PAX count verified', mandatory: true },
      { id: 'b2', label: 'Primary contact & emergency details confirmed', mandatory: true },
      { id: 'b3', label: 'Room category & dietary preferences noted', mandatory: false },
    ],
  },
  {
    id: 'DOCS_ITINERARY',
    stepNumber: 2,
    title: 'Stage 2: Docs & Itinerary',
    shortTitle: 'Docs & Itinerary',
    subtitle: 'Passports verified & custom itinerary approved',
    colorBadge: 'bg-blue-600 text-white',
    badgeBorder: 'border-blue-400 text-blue-700 bg-blue-50/90',
    headerBg: 'bg-blue-500/10 text-blue-900 border-blue-300',
    nextStage: 'VOUCHERS_CONFIRM',
    nextButtonText: '→ Vouchers & Confirm',
    checklist: [
      { id: 'd1', label: 'Passports & travel insurance copies received', mandatory: true },
      { id: 'd2', label: 'Day-wise custom itinerary approved by client', mandatory: true },
      { id: 'd3', label: 'Hotel & transport confirmation holds active', mandatory: true },
      { id: 'd4', label: 'Special attraction add-on bookings selected', mandatory: false },
    ],
  },
  {
    id: 'VOUCHERS_CONFIRM',
    stepNumber: 3,
    title: 'Stage 3: Vouchers & Confirm',
    shortTitle: 'Vouchers & Confirm',
    subtitle: 'Flights, hotels booked & travel vouchers issued',
    colorBadge: 'bg-purple-600 text-white',
    badgeBorder: 'border-purple-400 text-purple-700 bg-purple-50/90',
    headerBg: 'bg-purple-500/10 text-purple-900 border-purple-300',
    nextStage: 'TOUR_IN_PROGRESS',
    nextButtonText: '→ Tour In-Progress',
    checklist: [
      { id: 'v1', label: 'Flight e-tickets & seat allocations finalized', mandatory: true },
      { id: 'v2', label: 'Hotel voucher & check-in confirmation generated', mandatory: true },
      { id: 'v3', label: 'Local tour guide & airport transfer details shared', mandatory: true },
      { id: 'v4', label: 'Pre-departure briefing call conducted with traveler', mandatory: false },
    ],
  },
  {
    id: 'TOUR_IN_PROGRESS',
    stepNumber: 4,
    title: 'Stage 4: Tour In-Progress',
    shortTitle: 'Tour In-Progress',
    subtitle: 'Travelers on trip / 24/7 on-ground assistance',
    colorBadge: 'bg-orange-500 text-white',
    badgeBorder: 'border-orange-400 text-orange-700 bg-orange-50/90',
    headerBg: 'bg-orange-500/10 text-orange-900 border-orange-300',
    nextStage: 'COMPLETED',
    nextButtonText: '→ Completed',
    checklist: [
      { id: 't1', label: 'Arrival confirmed & airport pickup verified', mandatory: true },
      { id: 't2', label: 'Mid-tour satisfaction check-in completed', mandatory: true },
      { id: 't3', label: 'Any on-ground itinerary adjustments accommodated', mandatory: false },
    ],
  },
  {
    id: 'COMPLETED',
    stepNumber: 5,
    title: 'Completed',
    shortTitle: 'Completed',
    subtitle: 'Tour finished / Customer review collected',
    bannerText: '✔ Tour Completed Successfully',
    colorBadge: 'bg-emerald-600 text-white',
    badgeBorder: 'border-emerald-500 text-emerald-700 bg-emerald-50/90',
    headerBg: 'bg-emerald-500/10 text-emerald-900 border-emerald-300',
    nextStage: null,
    nextButtonText: null,
    checklist: [
      { id: 'c1', label: 'Safe return verified & welcome back message sent', mandatory: true },
      { id: 'c2', label: 'Client review & feedback rating collected', mandatory: true },
      { id: 'c3', label: 'Post-tour final invoice settled and closed', mandatory: true },
    ],
  },
  {
    id: 'CANCELLED',
    stepNumber: 6,
    title: 'Cancelled',
    shortTitle: 'Cancelled',
    subtitle: 'Tour cancelled / Refund or credit processed',
    bannerText: '✕ Tour Cancelled',
    colorBadge: 'bg-rose-600 text-white',
    badgeBorder: 'border-rose-400 text-rose-700 bg-rose-50/90',
    headerBg: 'bg-rose-500/10 text-rose-900 border-rose-300',
    nextStage: null,
    nextButtonText: null,
    checklist: [
      { id: 'x1', label: 'Cancellation request logged & reason documented', mandatory: true },
      { id: 'x2', label: 'Airline & hotel refund policies calculated', mandatory: true },
      { id: 'x3', label: 'Credit voucher or refund processed to customer', mandatory: false },
    ],
  },
]

export const DEFAULT_HOLIDAY_CASES = [
  {
    id: 'PKG-701',
    customer: 'Sanya Malhotra',
    phone: '+91 98111 55443',
    email: 'sanya.m@gmail.com',
    packageName: 'Bali Island Beach Getaway',
    destination: 'Bali, Indonesia',
    duration: '6 Days / 5 Nights',
    stage: 'VOUCHERS_CONFIRM',
    price: 85000,
    paidAmount: 85000,
    paymentType: 'Prepaid',
    paymentStatus: 'PAID',
    departureDate: '2026-11-15',
    bookingDate: '2026-09-18',
    officer: 'Priya Singh',
    officerId: 'CO-102',
    invoiceRef: 'INV-2026-0854',
    completedChecklists: {
      b1: true,
      b2: true,
      d1: true,
      d2: true,
      d3: true,
    },
  },
  {
    id: 'PKG-702',
    customer: 'Deepak Chopra',
    phone: '+91 98200 22222',
    email: 'deepak.c@rhglobal.com',
    packageName: 'Swiss Alps & Paris Highlights',
    destination: 'France & Switzerland',
    duration: '8 Days / 7 Nights',
    stage: 'BOOKING_CREATED',
    price: 210000,
    paidAmount: 50000,
    paymentType: 'Postpaid',
    paymentStatus: 'PARTIAL',
    departureDate: '2026-12-01',
    bookingDate: '2026-09-28',
    officer: 'Priya Singh',
    officerId: 'CO-102',
    invoiceRef: 'INV-2026-0865',
    completedChecklists: {
      b1: true,
      b2: false,
      b3: false,
    },
  },
  {
    id: 'PKG-703',
    customer: 'Ananya Iyer',
    phone: '+91 98333 44551',
    email: 'ananya.iyer@gmail.com',
    packageName: 'Dubai Luxury Marina & Desert Safari',
    destination: 'Dubai, UAE',
    duration: '5 Days / 4 Nights',
    stage: 'DOCS_ITINERARY',
    price: 95000,
    paidAmount: 95000,
    paymentType: 'Prepaid',
    paymentStatus: 'PAID',
    departureDate: '2026-11-20',
    bookingDate: '2026-09-22',
    officer: 'Rohan Das',
    officerId: 'CO-103',
    invoiceRef: 'INV-2026-0859',
    completedChecklists: {
      b1: true,
      b2: true,
      d1: true,
      d2: true,
    },
  },
  {
    id: 'PKG-704',
    customer: 'Rohit Sharma',
    phone: '+91 98444 88990',
    email: 'rohit.s@outlook.com',
    packageName: 'Maldives Overwater Villa Honeymoon',
    destination: 'Male, Maldives',
    duration: '5 Days / 4 Nights',
    stage: 'TOUR_IN_PROGRESS',
    price: 175000,
    paidAmount: 175000,
    paymentType: 'Prepaid',
    paymentStatus: 'PAID',
    departureDate: '2026-10-12',
    bookingDate: '2026-09-10',
    officer: 'Priya Singh',
    officerId: 'CO-102',
    invoiceRef: 'INV-2026-0842',
    completedChecklists: {
      b1: true,
      b2: true,
      d1: true,
      d2: true,
      v1: true,
      v2: true,
      t1: true,
    },
  },
  {
    id: 'PKG-705',
    customer: 'Meera Patel',
    phone: '+91 98555 12345',
    email: 'meera.p@yahoo.com',
    packageName: 'Phuket & Krabi Island Explorer',
    destination: 'Phuket, Thailand',
    duration: '7 Days / 6 Nights',
    stage: 'COMPLETED',
    price: 72000,
    paidAmount: 72000,
    paymentType: 'Prepaid',
    paymentStatus: 'PAID',
    departureDate: '2026-09-25',
    bookingDate: '2026-08-30',
    officer: 'Rohan Das',
    officerId: 'CO-103',
    invoiceRef: 'INV-2026-0831',
    completedChecklists: {
      b1: true,
      b2: true,
      d1: true,
      v1: true,
      t1: true,
      c1: true,
      c2: true,
      c3: true,
    },
  },
  {
    id: 'PKG-706',
    customer: 'Rajesh Kapoor',
    phone: '+91 98666 77889',
    email: 'rajesh.k@kapoors.in',
    packageName: 'Tokyo & Kyoto Autumn Tour',
    destination: 'Japan',
    duration: '9 Days / 8 Nights',
    stage: 'DOCS_ITINERARY',
    price: 245000,
    paidAmount: 76000,
    paymentType: 'Postpaid',
    paymentStatus: 'PARTIAL',
    departureDate: '2026-12-10',
    bookingDate: '2026-09-15',
    officer: 'Amit Verma',
    officerId: 'CO-101',
    invoiceRef: 'INV-2026-0850',
    completedChecklists: {
      b1: true,
      b2: true,
    },
  },
  {
    id: 'PKG-707',
    customer: 'Arjun Nair',
    phone: '+91 98777 99001',
    email: 'arjun.n@techcorp.com',
    packageName: 'Singapore Sentosa & Universal Studios',
    destination: 'Singapore',
    duration: '4 Days / 3 Nights',
    stage: 'CANCELLED',
    price: 68000,
    paidAmount: 20000,
    paymentType: 'Postpaid',
    paymentStatus: 'PARTIAL',
    departureDate: '2026-10-05',
    bookingDate: '2026-09-01',
    officer: 'Priya Singh',
    officerId: 'CO-102',
    invoiceRef: 'INV-2026-0835',
    completedChecklists: {
      b1: true,
      x1: true,
      x2: true,
    },
  },
]

class HolidayCasesService {
  constructor() {
    this._initStorage()
  }

  _initStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HOLIDAY_CASES)
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_HOLIDAY_CASES, JSON.stringify(DEFAULT_HOLIDAY_CASES))
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for holiday cases:', e)
    }
  }

  getCases() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HOLIDAY_CASES)
      if (!raw) return DEFAULT_HOLIDAY_CASES
      return JSON.parse(raw)
    } catch (e) {
      return DEFAULT_HOLIDAY_CASES
    }
  }

  getCaseById(id) {
    const list = this.getCases()
    return list.find((c) => c.id === id) || null
  }

  saveCases(cases) {
    try {
      localStorage.setItem(STORAGE_KEY_HOLIDAY_CASES, JSON.stringify(cases))
      return true
    } catch (e) {
      console.error('Failed to save holiday cases:', e)
      return false
    }
  }

  updateCase(id, updates) {
    const list = this.getCases()
    const index = list.findIndex((c) => c.id === id)
    if (index === -1) return null
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() }
    this.saveCases(list)
    return list[index]
  }

  toggleChecklistItem(caseId, itemId, isChecked) {
    const list = this.getCases()
    const index = list.findIndex((c) => c.id === caseId)
    if (index === -1) return null

    const existingChecks = list[index].completedChecklists || {}
    const updatedChecks = {
      ...existingChecks,
      [itemId]: isChecked,
    }

    list[index] = {
      ...list[index],
      completedChecklists: updatedChecks,
      updatedAt: new Date().toISOString(),
    }

    this.saveCases(list)
    return list[index]
  }

  advanceStage(caseId, targetStageId) {
    const currentCase = this.getCaseById(caseId)
    if (!currentCase) return { success: false, error: 'Booking case not found' }

    // Check mandatory checklist validation for current stage
    const currentStageDef = HOLIDAY_STAGES.find((s) => s.id === currentCase.stage)
    if (currentStageDef && targetStageId !== 'CANCELLED') {
      const mandatoryItems = currentStageDef.checklist.filter((item) => item.mandatory)
      const checks = currentCase.completedChecklists || {}
      const missingMandatory = mandatoryItems.some((item) => !checks[item.id])

      if (missingMandatory) {
        return {
          success: false,
          error: 'Please complete all mandatory checklist items before advancing stage.',
          mandatoryRequired: true,
        }
      }
    }

    const updated = this.updateCase(caseId, {
      stage: targetStageId,
    })

    return { success: true, case: updated }
  }

  createCase(caseData) {
    const list = this.getCases()
    const nextNum = 700 + list.length + 1
    const newCase = {
      id: caseData.id || `PKG-${nextNum}`,
      customer: caseData.customer || 'New Traveler',
      phone: caseData.phone || '+91 98000 00000',
      email: caseData.email || 'traveler@example.com',
      packageName: caseData.packageName || 'Custom Holiday Experience',
      destination: caseData.destination || 'Bali, Indonesia',
      duration: caseData.duration || '6 Days / 5 Nights',
      stage: caseData.stage || 'BOOKING_CREATED',
      price: Number(caseData.price) || 120000,
      paidAmount: Number(caseData.paidAmount) || 0,
      paymentType: caseData.paymentType || 'Postpaid',
      paymentStatus: caseData.paymentStatus || 'PENDING',
      departureDate: caseData.departureDate || '2026-12-01',
      bookingDate: caseData.bookingDate || new Date().toISOString().split('T')[0],
      officer: caseData.officer || 'Priya Singh',
      officerId: caseData.officerId || 'CO-102',
      invoiceRef: caseData.invoiceRef || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      completedChecklists: {},
      createdAt: new Date().toISOString(),
    }

    list.unshift(newCase)
    this.saveCases(list)
    return newCase
  }

  createCaseFromLead(lead) {
    return this.createCase({
      customer: lead.name,
      phone: lead.phone,
      email: lead.email,
      destination: lead.destination || lead.country || 'Bali, Indonesia',
      packageName: lead.tourPackage || lead.purpose || 'Custom Leisure Tour',
      officer: lead.assignedStaff || 'Priya Singh',
      price: lead.expectedValue || lead.quotation?.totalAmount || 150000,
      paidAmount: 0,
      stage: 'BOOKING_CREATED',
    })
  }

  deleteCase(id) {
    const list = this.getCases()
    const filtered = list.filter((c) => c.id !== id)
    this.saveCases(filtered)
    return filtered
  }

  resetToDefaults() {
    this.saveCases(DEFAULT_HOLIDAY_CASES)
    return DEFAULT_HOLIDAY_CASES
  }
}

export const holidayCasesService = new HolidayCasesService()
export default holidayCasesService
