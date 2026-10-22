/**
 * Visa Cases Processing Pipeline Service
 * Manages Visa Cases, stage workflows, mandatory stage checklists, and real-time state persistence.
 */

const STORAGE_KEY_VISA_CASES = 'rh_crm_visa_cases_v5'

export const VISA_STAGES = [
  {
    id: 'UNDER_REVIEW',
    stepNumber: 1,
    title: 'Stage 1: Under Review',
    shortTitle: 'Under Review',
    subtitle: 'Documents collection & initial assessment',
    colorBadge: 'bg-amber-500 text-white',
    badgeBorder: 'border-amber-400 text-amber-700 bg-amber-50/90',
    headerBg: 'bg-amber-500/10 text-amber-900 border-amber-300',
    nextStage: 'DOCS_VERIFIED',
    nextButtonText: '→ Docs Verified',
    checklist: [
      { id: 'c1', label: 'Passport valid for at least 6 months checked', mandatory: true },
      { id: 'c2', label: 'Application form & personal details reviewed', mandatory: true },
      { id: 'c3', label: 'Initial service intake fee verified', mandatory: true },
      { id: 'c4', label: 'Special travel purpose notes recorded', mandatory: false },
    ],
  },
  {
    id: 'DOCS_VERIFIED',
    stepNumber: 2,
    title: 'Stage 2: Docs Verified',
    shortTitle: 'Docs Verified',
    subtitle: 'All documents checked & verified',
    colorBadge: 'bg-blue-600 text-white',
    badgeBorder: 'border-blue-400 text-blue-700 bg-blue-50/90',
    headerBg: 'bg-blue-500/10 text-blue-900 border-blue-300',
    nextStage: 'SUBMITTED',
    nextButtonText: '→ Submitted',
    checklist: [
      { id: 'd1', label: 'Financial statements & bank balance certificates verified', mandatory: true },
      { id: 'd2', label: 'Employment / Business verification letter attached', mandatory: true },
      { id: 'd3', label: 'Flight & accommodation itinerary confirmed', mandatory: true },
      { id: 'd4', label: 'Cover letter & travel itinerary verified', mandatory: false },
    ],
  },
  {
    id: 'SUBMITTED',
    stepNumber: 3,
    title: 'Stage 3: Submitted',
    shortTitle: 'Submitted',
    subtitle: 'Application submitted to embassy',
    colorBadge: 'bg-purple-600 text-white',
    badgeBorder: 'border-purple-400 text-purple-700 bg-purple-50/90',
    headerBg: 'bg-purple-500/10 text-purple-900 border-purple-300',
    nextStage: 'PROCESSING',
    nextButtonText: '→ Processing',
    checklist: [
      { id: 's1', label: 'Embassy online portal application submitted', mandatory: true },
      { id: 's2', label: 'Government visa fee payment receipt uploaded', mandatory: true },
      { id: 's3', label: 'Biometrics / VFS appointment scheduled', mandatory: true },
      { id: 's4', label: 'Acknowledgement slip dispatched to applicant', mandatory: false },
    ],
  },
  {
    id: 'PROCESSING',
    stepNumber: 4,
    title: 'Stage 4: Processing',
    shortTitle: 'Processing',
    subtitle: 'Embassy processing & biometric verification',
    colorBadge: 'bg-orange-500 text-white',
    badgeBorder: 'border-orange-400 text-orange-700 bg-orange-50/90',
    headerBg: 'bg-orange-500/10 text-orange-900 border-orange-300',
    nextStage: 'INTERVIEW',
    nextButtonText: '→ Interview',
    checklist: [
      { id: 'p1', label: 'Biometrics registration completed at center', mandatory: true },
      { id: 'p2', label: 'Initial embassy background processing verification completed', mandatory: true },
      { id: 'p3', label: 'Consulate application tracking status verified', mandatory: true },
      { id: 'p4', label: 'Additional embassy documentation cleared', mandatory: false },
    ],
  },
  {
    id: 'INTERVIEW',
    stepNumber: 5,
    title: 'Stage 5: Interview',
    shortTitle: 'Interview',
    subtitle: 'Consular interview prep, appointment & attendance',
    colorBadge: 'bg-indigo-600 text-white',
    badgeBorder: 'border-indigo-400 text-indigo-700 bg-indigo-50/90',
    headerBg: 'bg-indigo-500/10 text-indigo-900 border-indigo-300',
    nextStage: 'APPROVED',
    nextButtonText: '→ Approved',
    checklist: [
      { id: 'i1', label: 'Embassy / Consulate interview appointment date & slot scheduled', mandatory: true },
      { id: 'i2', label: 'Appointment confirmation letter & barcode slip issued', mandatory: true },
      { id: 'i3', label: 'Consular interview Q&A coaching & mock session completed with applicant', mandatory: true },
      { id: 'i4', label: 'Original document dossier (Financials, NOC, Passport, Cover Letter) handed over', mandatory: true },
      { id: 'i5', label: 'Consular interview attended & preliminary outcome / visa slip recorded', mandatory: true },
      { id: 'i6', label: '221(g) / additional embassy processing documents cleared (if applicable)', mandatory: false },
    ],
  },
  {
    id: 'APPROVED',
    stepNumber: 6,
    title: 'Stage 6: Approved',
    shortTitle: 'Approved',
    subtitle: 'Visa granted by embassy & passport stamped',
    colorBadge: 'bg-teal-600 text-white',
    badgeBorder: 'border-teal-500 text-teal-700 bg-teal-50/90',
    headerBg: 'bg-teal-500/10 text-teal-900 border-teal-300',
    nextStage: 'PAYMENT',
    nextButtonText: '→ Payment',
    checklist: [
      { id: 'a1', label: 'Visa grant letter received and validity confirmed', mandatory: true },
      { id: 'a2', label: 'Passport collected / returned to client with visa stamped', mandatory: true },
      { id: 'a3', label: 'Client notified of successful approval', mandatory: true },
    ],
  },
  {
    id: 'PAYMENT',
    stepNumber: 7,
    title: 'Stage 7: Payment',
    shortTitle: 'Payment',
    subtitle: 'Final visa consultation & success fee settlement',
    bannerText: '✔ Visa Approved & Final Payment Settled',
    colorBadge: 'bg-emerald-600 text-white',
    badgeBorder: 'border-emerald-400 text-emerald-700 bg-emerald-50/90',
    headerBg: 'bg-emerald-500/10 text-emerald-900 border-emerald-300',
    nextStage: null,
    nextButtonText: null,
    checklist: [
      { id: 'pay1', label: 'Final service fee & success commission invoice generated', mandatory: true },
      { id: 'pay2', label: 'Client final invoice balance settled & verified', mandatory: true },
      { id: 'pay3', label: 'Official tax invoice and payment receipt issued', mandatory: true },
      { id: 'pay4', label: 'Stamped passport & document dossier delivered to client', mandatory: false },
    ],
  },
  {
    id: 'REJECTED',
    stepNumber: 8,
    title: 'Stage 8: Rejected',
    shortTitle: 'Rejected',
    subtitle: 'Visa declined or withdrawn',
    colorBadge: 'bg-rose-600 text-white',
    badgeBorder: 'border-rose-400 text-rose-700 bg-rose-50/90',
    headerBg: 'bg-rose-500/10 text-rose-900 border-rose-300',
    nextStage: null,
    nextButtonText: null,
    checklist: [
      { id: 'r1', label: 'Embassy refusal letter logged in system', mandatory: true },
      { id: 'r2', label: 'Detailed refusal reason communicated to client', mandatory: true },
      { id: 'r3', label: 'Re-application or appeal feasibility analyzed', mandatory: false },
    ],
  },
]

export const DEFAULT_VISA_CASES = [
  {
    id: 'VISA-301',
    applicant: 'Vikramaditya Roy',
    phone: '+91 97115 22345',
    email: 'vikram.roy@gmail.com',
    passport: 'K8921453',
    passportExp: '2030-04-12',
    country: 'Schengen (France)',
    visaType: 'Tourist C',
    stage: 'DOCS_VERIFIED',
    officer: 'Amit Verma',
    officerId: 'CO-101',
    amount: 18500,
    paidAmount: 18500,
    paymentType: 'Prepaid',
    paymentStatus: 'COMPLETED',
    txnId: 'TXN-998120',
    docStatus: 'DOCS_VERIFIED',
    appliedDate: '2026-10-02',
    completedChecklists: {
      c1: true,
      c2: true,
      c3: true,
      c4: true,
      d1: true,
      d2: true,
      d3: true,
    },
  },
  {
    id: 'VISA-302',
    applicant: 'Sanya Malhotra',
    phone: '+91 98111 55443',
    email: 'sanya.m@gmail.com',
    passport: 'M1234567',
    passportExp: '2029-08-20',
    country: 'United Kingdom',
    visaType: 'Standard Visitor',
    stage: 'UNDER_REVIEW',
    officer: 'Priya Singh',
    officerId: 'CO-102',
    amount: 24000,
    paidAmount: 10000,
    paymentType: 'Postpaid',
    paymentStatus: 'PARTIALLY_PAID',
    txnId: 'TXN-998144',
    docStatus: 'PENDING_VERIFICATION',
    appliedDate: '2026-10-05',
    completedChecklists: {
      c1: true,
      c2: true,
      c3: true,
      c4: false,
    },
  },
  {
    id: 'VISA-303',
    applicant: 'Rohan Joshi',
    phone: '+91 98200 11122',
    email: 'rohan.j@rhglobal.com',
    passport: 'P4567891',
    passportExp: '2031-11-05',
    country: 'United States',
    visaType: 'B1/B2 Business',
    stage: 'APPROVED',
    officer: 'Amit Verma',
    officerId: 'CO-101',
    amount: 21000,
    paidAmount: 21000,
    paymentType: 'Prepaid',
    paymentStatus: 'COMPLETED',
    txnId: 'TXN-997500',
    docStatus: 'DOCS_VERIFIED',
    appliedDate: '2026-09-20',
    completedChecklists: {
      c1: true,
      c2: true,
      c3: true,
      d1: true,
      d2: true,
      d3: true,
      s1: true,
      s2: true,
      s3: true,
      p1: true,
      p2: true,
      p3: true,
      a1: true,
      a2: true,
      a3: true,
    },
  },
  {
    id: 'VISA-304',
    applicant: 'Priya Patel',
    phone: '+91 99881 44332',
    email: 'priya.patel@outlook.com',
    passport: 'N9876543',
    passportExp: '2028-06-15',
    country: 'United States',
    visaType: 'B1/B2 Business',
    stage: 'INTERVIEW',
    officer: 'Priya Singh',
    officerId: 'CO-102',
    amount: 21000,
    paidAmount: 21000,
    paymentType: 'Prepaid',
    paymentStatus: 'COMPLETED',
    txnId: 'TXN-998200',
    docStatus: 'INTERVIEW SCHEDULED',
    appliedDate: '2026-10-08',
    interviewDate: '2026-10-24',
    completedChecklists: {
      c1: true,
      c2: true,
      c3: true,
      d1: true,
      d2: true,
      d3: true,
      s1: true,
      s2: true,
      s3: true,
      p1: true,
      p2: true,
      p3: true,
      i1: true,
      i2: true,
      i3: true,
      i4: false,
      i5: false,
    },
  },
  {
    id: 'VISA-305',
    applicant: 'Arjun Mehta',
    phone: '+91 96321 77890',
    email: 'arjun.mehta@gmail.com',
    passport: 'L6789123',
    passportExp: '2027-12-30',
    country: 'Schengen (France)',
    visaType: 'Tourist C',
    stage: 'UNDER_REVIEW',
    officer: 'Rohan Das',
    officerId: 'CO-103',
    amount: 18500,
    paidAmount: 0,
    paymentType: 'Postpaid',
    paymentStatus: 'PENDING',
    txnId: 'TXN-998250',
    docStatus: 'PENDING_VERIFICATION',
    appliedDate: '2026-10-10',
    completedChecklists: {
      c1: false,
      c2: false,
      c3: false,
      c4: false,
    },
  },
  {
    id: 'VISA-306',
    applicant: 'Meera Kapoor',
    phone: '+91 97766 22110',
    email: 'meera.k@yahoo.com',
    passport: 'J3456789',
    passportExp: '2029-03-22',
    country: 'United Kingdom',
    visaType: 'Standard Visitor',
    stage: 'PROCESSING',
    officer: 'Amit Verma',
    officerId: 'CO-101',
    amount: 24000,
    paidAmount: 24000,
    paymentType: 'Prepaid',
    paymentStatus: 'COMPLETED',
    txnId: 'TXN-997880',
    docStatus: 'DOCS_VERIFIED',
    appliedDate: '2026-09-28',
    completedChecklists: {
      c1: true,
      c2: true,
      c3: true,
      d1: true,
      d2: true,
      d3: true,
      s1: true,
      s2: true,
      s3: true,
      p1: true,
      p2: true,
      p3: true,
    },
  },
  {
    id: 'VISA-307',
    applicant: 'Kabir Khanna',
    phone: '+91 98112 33445',
    email: 'kabir.k@gmail.com',
    passport: 'R1298345',
    passportExp: '2028-10-14',
    country: 'Canada',
    visaType: 'Standard Visitor',
    stage: 'REJECTED',
    officer: 'Rohan Das',
    officerId: 'CO-103',
    amount: 21000,
    paidAmount: 21000,
    paymentType: 'Prepaid',
    paymentStatus: 'COMPLETED',
    txnId: 'TXN-997610',
    docStatus: 'REJECTED',
    appliedDate: '2026-09-15',
    completedChecklists: {
      c1: true,
      c2: true,
      c3: true,
      r1: true,
      r2: true,
    },
  },
  {
    id: 'VISA-308',
    applicant: 'Aditya Sharma',
    phone: '+91 98330 44556',
    email: 'aditya.sharma@gmail.com',
    passport: 'T4492019',
    passportExp: '2030-07-25',
    country: 'United States',
    visaType: 'B1/B2 Business',
    stage: 'PAYMENT',
    officer: 'Priya Singh',
    officerId: 'CO-102',
    amount: 22500,
    paidAmount: 11000,
    paymentType: 'Postpaid',
    paymentStatus: 'PARTIAL',
    txnId: 'TXN-998310',
    docStatus: 'VISA APPROVED - PAYMENT PENDING',
    appliedDate: '2026-10-09',
    completedChecklists: {
      c1: true,
      c2: true,
      c3: true,
      d1: true,
      d2: true,
      d3: true,
      s1: true,
      s2: true,
      s3: true,
      p1: true,
      p2: true,
      p3: true,
      a1: true,
      a2: true,
      a3: true,
      pay1: true,
    },
  },
]

class VisaCasesService {
  constructor() {
    this._initStorage()
  }

  _initStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_VISA_CASES)
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_VISA_CASES, JSON.stringify(DEFAULT_VISA_CASES))
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for visa cases:', e)
    }
  }

  getCases() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_VISA_CASES)
      if (!raw) return DEFAULT_VISA_CASES
      return JSON.parse(raw)
    } catch (e) {
      return DEFAULT_VISA_CASES
    }
  }

  getCaseById(id) {
    const list = this.getCases()
    return list.find((c) => c.id === id) || null
  }

  saveCases(cases) {
    try {
      localStorage.setItem(STORAGE_KEY_VISA_CASES, JSON.stringify(cases))
      return true
    } catch (e) {
      console.error('Failed to save visa cases:', e)
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
    if (!currentCase) return { success: false, error: 'Case not found' }

    // Check mandatory checklist validation for current stage
    const activeStages = currentCase.stages || VISA_STAGES
    const currentStageDef = activeStages.find((s) => s.id === currentCase.stage)
    if (currentStageDef && targetStageId !== 'REJECTED') {
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

    const updates = {
      stage: targetStageId,
      docStatus:
        targetStageId === 'PAYMENT' || targetStageId === 'PAYMENT_BRIEFING'
          ? 'PAYMENT SETTLED'
          : targetStageId === 'APPROVED'
          ? 'APPROVED'
          : targetStageId === 'REJECTED'
          ? 'REJECTED'
          : targetStageId === 'INTERVIEW' || targetStageId === 'INTERVIEW_PREP'
          ? 'INTERVIEW SCHEDULED'
          : targetStageId === 'DOCS_VERIFIED' || targetStageId === 'FINANCIAL_PROOF'
          ? 'DOCS_VERIFIED'
          : targetStageId === 'SUBMITTED' || targetStageId === 'PORTAL_FILING'
          ? 'SUBMITTED'
          : 'PROCESSING',
    }

    if (targetStageId === 'PAYMENT' || targetStageId === 'PAYMENT_BRIEFING') {
      updates.paymentStatus = 'COMPLETED'
      updates.paidAmount = currentCase.amount || updates.paidAmount
    }

    const updated = this.updateCase(caseId, updates)

    return { success: true, case: updated }
  }

  createCase(caseData) {
    const list = this.getCases()
    const nextNum = 300 + list.length + 1
    const initialStage = caseData.stage || (caseData.stages && caseData.stages[0]?.id) || 'UNDER_REVIEW'
    const newCase = {
      id: caseData.id || `VISA-${nextNum}`,
      applicant: caseData.applicant || 'New Applicant',
      phone: caseData.phone || '+91 98000 00000',
      email: caseData.email || 'applicant@example.com',
      passport: caseData.passport || 'P' + Math.floor(1000000 + Math.random() * 9000000),
      passportExp: caseData.passportExp || '2030-01-01',
      country: caseData.country || 'United Kingdom',
      visaType: caseData.visaType || 'Standard Visitor',
      stage: initialStage,
      stages: caseData.stages || null,
      templateId: caseData.templateId || null,
      category: caseData.category || null,
      officer: caseData.officer || 'Amit Verma',
      officerId: caseData.officerId || 'CO-101',
      amount: Number(caseData.amount) || 20000,
      paidAmount: Number(caseData.paidAmount) || 0,
      paymentType: caseData.paymentType || 'Postpaid',
      paymentStatus: caseData.paymentStatus || 'PENDING',
      txnId: caseData.txnId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      docStatus: 'PENDING_VERIFICATION',
      appliedDate: caseData.appliedDate || new Date().toISOString().split('T')[0],
      completedChecklists: {},
      createdAt: new Date().toISOString(),
    }

    list.unshift(newCase)
    this.saveCases(list)
    return newCase
  }

  createCaseFromLead(lead, customCaseData = {}) {
    return this.createCase({
      applicant: lead.name,
      phone: lead.phone,
      email: lead.email,
      country: lead.country || lead.targetCountry || 'Schengen (France)',
      visaType: customCaseData.visaType || lead.visaType || lead.serviceRequired || lead.purpose || 'Tourist C',
      officer: customCaseData.specialist || lead.assignedStaff || 'Amit Verma',
      amount: customCaseData.amount || lead.value || lead.expectedValue || lead.quotation?.total || 22000,
      paidAmount: 0,
      stage: customCaseData.stage || (customCaseData.stages && customCaseData.stages[0]?.id) || 'UNDER_REVIEW',
      stages: customCaseData.stages || null,
      templateId: customCaseData.templateId || null,
      category: customCaseData.category || null,
    })
  }

  deleteCase(id) {
    const list = this.getCases()
    const filtered = list.filter((c) => c.id !== id)
    this.saveCases(filtered)
    return filtered
  }

  resetToDefaults() {
    this.saveCases(DEFAULT_VISA_CASES)
    return DEFAULT_VISA_CASES
  }
}

export const visaCasesService = new VisaCasesService()
export default visaCasesService
