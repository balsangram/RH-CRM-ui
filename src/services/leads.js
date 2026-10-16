/**
 * RH GLOBAL CRM - Leads Service
 * Full persistence (localStorage) for:
 * - Stage Pipeline & Kanban
 * - Configurable & Dynamic Stages
 * - Flexible / Custom Fields
 * - Staff Assignment & Case Conversion
 * - Itemized Proposal & Quotation Creator
 */

const STORAGE_KEY_LEADS = 'rh_crm_leads_v2'
const STORAGE_KEY_STAGES = 'rh_crm_leads_stages_v2'
const STORAGE_KEY_CASES = 'rh_crm_cases_v2'
import visaCasesService from './visaCases'
import holidayCasesService from './holidayCases'

export const STAFF_MEMBERS = [
  { id: 'STAFF-1', name: 'Amit Verma', role: 'Senior Visa & Immigration Officer', email: 'amit.v@rhglobal.com' },
  { id: 'STAFF-2', name: 'Priya Singh', role: 'Holiday & Leisure Tour Specialist', email: 'priya.s@rhglobal.com' },
  { id: 'STAFF-3', name: 'Alex Morgan', role: 'Senior Immigration Officer', email: 'alex.m@rhglobal.com' },
  { id: 'STAFF-4', name: 'Dev Patel', role: 'Visa Operations Lead', email: 'dev.p@rhglobal.com' },
  { id: 'STAFF-5', name: 'Sarah Connor', role: 'Super Admin', email: 'sarah.c@rhglobal.com' },
  { id: 'STAFF-6', name: 'sipu Sharma', role: 'Agent & Case Specialist', email: 'sipu.s@rhglobal.com' },
]

export const DEFAULT_STAGES = [
  {
    id: 'LEAD',
    stageNumber: 1,
    name: 'Stage 1: Lead',
    shortName: 'Lead',
    subtitle: 'Inbound inquiries from Website, Social & Direct',
    color: '#2E2B6E',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    defaultChecklist: [
      { id: 'chk-1', text: 'Initial contact made with applicant', required: true, completed: false },
      { id: 'chk-2', text: 'Understand travel purpose and dates', required: true, completed: false },
      { id: 'chk-3', text: 'Log applicant details & KYC into CRM', required: false, completed: false },
    ],
  },
  {
    id: 'QUALIFIED',
    stageNumber: 2,
    name: 'Stage 2: Qualified',
    shortName: 'Qualified',
    subtitle: 'Profile, travel dates & budget verified',
    color: '#D97706',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
    defaultChecklist: [
      { id: 'chk-4', text: 'Verify passport validity & financial proof', required: true, completed: true },
      { id: 'chk-5', text: 'Assess visa/tour eligibility criteria', required: true, completed: true },
      { id: 'chk-6', text: 'Confirm passenger count & travel window', required: false, completed: true },
    ],
  },
  {
    id: 'PROPOSAL',
    stageNumber: 3,
    name: 'Stage 3: Proposal',
    shortName: 'Proposal',
    subtitle: 'Proposal & quotation drafted / sent',
    highlightBanner: '⚡ Stage 3: Proposal Creator with Quotation enabled',
    color: '#7C3AED',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-300',
    defaultChecklist: [
      { id: 'chk-7', text: 'Generate itemized quotation with fees', required: true, completed: true },
      { id: 'chk-8', text: 'Send proposal document via email/Meta', required: true, completed: true },
      { id: 'chk-9', text: 'Follow up on proposal acceptance', required: false, completed: false },
    ],
  },
  {
    id: 'NEGOTIATION',
    stageNumber: 4,
    name: 'Stage 4: Negotiation',
    shortName: 'Negotiation',
    subtitle: 'Terms, discounts & itinerary finalization',
    color: '#2563EB',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-300',
    defaultChecklist: [
      { id: 'chk-10', text: 'Review customer objections & requested discounts', required: true, completed: true },
      { id: 'chk-11', text: 'Finalize payment terms and deposit schedule', required: true, completed: true },
      { id: 'chk-12', text: 'Obtain verbal or signed commitment', required: false, completed: false },
    ],
  },
  {
    id: 'CONVERTED',
    stageNumber: 5,
    name: 'Converted',
    shortName: 'Converted',
    subtitle: 'Deal won & converted into Cases',
    highlightBanner: '⭐ Ready for Cases & Staff Assignment',
    color: '#059669',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    defaultChecklist: [
      { id: 'chk-13', text: 'Receive initial advance fee / deposit', required: true, completed: true },
      { id: 'chk-14', text: 'Create Operations Case in CRM', required: true, completed: true },
      { id: 'chk-15', text: 'Assign Case specialist officer & handoff', required: true, completed: true },
    ],
  },
]

// Exact 10 reference leads from the user's reference screenshots
export const INITIAL_LEADS = [
  {
    id: 'LD-1001',
    name: 'Rahul Sharma',
    company: 'Apex Tours & Tech',
    email: 'rahul.s@apextours.com',
    phone: '+91 98765 43210',
    type: 'VISA',
    source: 'Website Form',
    targetCountry: 'United States',
    serviceRequired: 'B1/B2 Business Visa',
    stage: 'LEAD',
    value: 28000,
    assignedStaff: 'Amit Verma',
    createdDate: '2026-10-08',
    checklist: [
      { id: 'c1', text: 'Initial contact made with applicant', required: true, completed: true },
      { id: 'c2', text: 'Understand travel purpose and dates', required: true, completed: false },
      { id: 'c3', text: 'Log applicant details & KYC into CRM', required: false, completed: false },
    ],
    quotation: null,
    caseId: null,
    customFields: [
      { key: 'Travel Date', value: '2026-12-15' },
      { key: 'Passport Expiry', value: '2031-04-20' },
    ],
  },
  {
    id: 'LD-1008',
    name: 'Sneha Kulkarni',
    company: 'Individual Traveler',
    email: 'sneha.k@gmail.com',
    phone: '+91 98222 34567',
    type: 'HOLIDAY',
    source: 'FB / Instagram',
    targetCountry: 'Bali (Indonesia)',
    serviceRequired: '6D/5N Luxury Villa Package',
    stage: 'LEAD',
    value: 75000,
    assignedStaff: 'Priya Singh',
    createdDate: '2026-10-08',
    checklist: [
      { id: 'c1', text: 'Initial contact made with applicant', required: true, completed: true },
      { id: 'c2', text: 'Understand travel purpose and dates', required: true, completed: true },
      { id: 'c3', text: 'Log applicant details & KYC into CRM', required: false, completed: false },
    ],
    quotation: null,
    caseId: null,
    customFields: [
      { key: 'Travelers Count', value: '2 Adults' },
      { key: 'Resort Preference', value: 'Seminyak Private Pool Villa' },
    ],
  },
  {
    id: 'LD-1002',
    name: 'Ananya Roy',
    company: 'Individual Traveler',
    email: 'ananya.roy@gmail.com',
    phone: '+91 98123 45678',
    type: 'HOLIDAY',
    source: 'Direct entry',
    targetCountry: 'Switzerland',
    serviceRequired: '7 Days Alps Grand Tour',
    stage: 'QUALIFIED',
    value: 145000,
    assignedStaff: 'Priya Singh',
    createdDate: '2026-10-07',
    checklist: [
      { id: 'c1', text: 'Verify passport validity & financial proof', required: true, completed: true },
      { id: 'c2', text: 'Assess visa/tour eligibility criteria', required: true, completed: true },
      { id: 'c3', text: 'Confirm passenger count & travel window', required: false, completed: true },
    ],
    quotation: null,
    caseId: null,
    customFields: [
      { key: 'Swiss Pass Type', value: 'First Class 4-Day Flex' },
      { key: 'Hotel Category', value: '4-Star Central Zurich & Lucerne' },
    ],
  },
  {
    id: 'LD-1007',
    name: 'Meera Nair',
    company: 'Individual Traveler',
    email: 'meera.nair@hotmail.com',
    phone: '+91 97777 66655',
    type: 'VISA',
    source: 'FB / Instagram',
    targetCountry: 'Schengen (France)',
    serviceRequired: 'Short-stay Tourist C Visa',
    stage: 'QUALIFIED',
    value: 18500,
    assignedStaff: 'Amit Verma',
    createdDate: '2026-10-02',
    checklist: [
      { id: 'c1', text: 'Verify passport validity & financial proof', required: true, completed: true },
      { id: 'c2', text: 'Assess visa/tour eligibility criteria', required: true, completed: true },
      { id: 'c3', text: 'Confirm passenger count & travel window', required: false, completed: false },
    ],
    quotation: null,
    caseId: null,
    customFields: [
      { key: 'Consulate VFS Location', value: 'Mumbai VFS Centre' },
    ],
  },
  {
    id: 'LD-1006',
    name: 'Siddharth Rao',
    company: 'TechCorp Pvt Ltd',
    email: 's.rao@techcorp.com',
    phone: '+91 98888 77766',
    type: 'VISA',
    source: 'Website Form',
    targetCountry: 'United States',
    serviceRequired: 'Express B1 Business Visa Processing',
    stage: 'PROPOSAL',
    value: 35000,
    assignedStaff: 'Amit Verma',
    createdDate: '2026-10-03',
    checklist: [
      { id: 'c1', text: 'Generate itemized quotation with fees', required: true, completed: true },
      { id: 'c2', text: 'Send proposal document via email/Meta', required: true, completed: true },
      { id: 'c3', text: 'Follow up on proposal acceptance', required: false, completed: true },
    ],
    quotation: {
      code: '#QUO-2026-301',
      total: 35000,
      discount: 0,
      status: 'SENT',
      items: [
        { description: 'US Consulate MRV Visa Fee ($185)', amount: 16500 },
        { description: 'RH Priority Appointment Slot Booking & DS-160 Filing', amount: 12500 },
        { description: 'Mock Consulate Interview Preparation & Documentation Review', amount: 6000 },
      ],
      validUntil: '2026-11-15',
    },
    caseId: null,
    customFields: [
      { key: 'Corporate Sponsor', value: 'TechCorp USA Inc (San Jose)' },
    ],
  },
  {
    id: 'LD-1010',
    name: 'Dr. Manish & Neha Goel',
    company: 'Individual Traveler',
    email: 'm.goel@apollohospitals.org',
    phone: '+91 97111 88990',
    type: 'HOLIDAY',
    source: 'Direct entry',
    targetCountry: 'Japan',
    serviceRequired: '10 Days Cherry Blossom Cultural Tour',
    stage: 'PROPOSAL',
    value: 240000,
    assignedStaff: 'Priya Singh',
    createdDate: '2026-10-04',
    checklist: [
      { id: 'c1', text: 'Generate itemized quotation with fees', required: true, completed: true },
      { id: 'c2', text: 'Send proposal document via email/Meta', required: true, completed: true },
      { id: 'c3', text: 'Follow up on proposal acceptance', required: false, completed: false },
    ],
    quotation: {
      code: '#QUO-2026-302',
      total: 240000,
      discount: 10000,
      status: 'SENT',
      items: [
        { description: '10-Day Deluxe Tokyo, Kyoto & Osaka Itinerary (2 Pax)', amount: 190000 },
        { description: '7-Day JR All Japan Shinkansen Rail Pass (2 Pax)', amount: 35000 },
        { description: 'Japan eVisa Filing & Travel Medical Insurance', amount: 15000 },
      ],
      validUntil: '2026-11-10',
    },
    caseId: null,
    customFields: [
      { key: 'Cherry Blossom Peak', value: 'March 25 - April 5' },
    ],
  },
  {
    id: 'LD-1004',
    name: 'Priya Patel',
    company: 'Individual Traveler',
    email: 'priya.patel@yahoo.com',
    phone: '+91 97654 32109',
    type: 'HOLIDAY',
    source: 'FB / Instagram',
    targetCountry: 'Dubai (UAE)',
    serviceRequired: '5 Days Dubai Desert & Marina Experience',
    stage: 'NEGOTIATION',
    value: 92000,
    assignedStaff: 'Priya Singh',
    createdDate: '2026-10-05',
    checklist: [
      { id: 'c1', text: 'Review customer objections & requested discounts', required: true, completed: true },
      { id: 'c2', text: 'Finalize payment terms and deposit schedule', required: true, completed: true },
      { id: 'c3', text: 'Obtain verbal or signed commitment', required: false, completed: false },
    ],
    quotation: {
      code: '#QUO-2026-298',
      total: 92000,
      discount: 5000,
      status: 'UNDER_NEGOTIATION',
      items: [
        { description: 'Dubai 5-Star Marina Hotel 4N + Daily Buffet Breakfast', amount: 58000 },
        { description: '4x4 Red Dunes Safari + Marina Dhow Cruise Dinner + Burj Khalifa 124th', amount: 24000 },
        { description: 'Express UAE 30-Day Tourist Visa + OTB Verification', amount: 10000 },
      ],
      validUntil: '2026-10-25',
    },
    caseId: null,
    customFields: [
      { key: 'Preferred Flight', value: 'Emirates Direct BOM-DXB' },
    ],
  },
  {
    id: 'LD-1011',
    name: 'Rajiv Singhania',
    company: 'Zenith Logistics',
    email: 'r.singhania@zenithlog.com',
    phone: '+91 99000 44556',
    type: 'VISA',
    source: 'Direct entry',
    targetCountry: 'United Kingdom',
    serviceRequired: '2-Year Long Term Business Visa',
    stage: 'NEGOTIATION',
    value: 55000,
    assignedStaff: 'Amit Verma',
    createdDate: '2026-10-06',
    checklist: [
      { id: 'c1', text: 'Review customer objections & requested discounts', required: true, completed: true },
      { id: 'c2', text: 'Finalize payment terms and deposit schedule', required: true, completed: true },
      { id: 'c3', text: 'Obtain verbal or signed commitment', required: false, completed: true },
    ],
    quotation: {
      code: '#QUO-2026-295',
      total: 55000,
      discount: 0,
      status: 'UNDER_NEGOTIATION',
      items: [
        { description: 'UKVI 2-Year Standard Visitor Embassy Fee', amount: 41000 },
        { description: 'RH Priority Document Matrix Vetting & Corporate Invitation Attestation', amount: 14000 },
      ],
      validUntil: '2026-10-30',
    },
    caseId: null,
    customFields: [
      { key: 'UK Corporate Partner', value: 'Zenith UK Logistics Ltd (London)' },
    ],
  },
  {
    id: 'LD-1003',
    name: 'David Miller',
    company: 'Global Horizons Inc',
    email: 'dmiller@ghorizons.com',
    phone: '+1 415 555 0192',
    type: 'VISA',
    source: 'Website Form',
    targetCountry: 'Schengen (Germany)',
    serviceRequired: 'Multiple Entry Business Visa',
    stage: 'CONVERTED',
    value: 42000,
    assignedStaff: 'Amit Verma',
    createdDate: '2026-10-06',
    checklist: [
      { id: 'c1', text: 'Receive initial advance fee / deposit', required: true, completed: true },
      { id: 'c2', text: 'Create Operations Case in CRM', required: true, completed: true },
      { id: 'c3', text: 'Assign Case specialist officer & handoff', required: true, completed: true },
    ],
    quotation: {
      code: '#QUO-2026-290',
      total: 42000,
      discount: 0,
      status: 'ACCEPTED',
      items: [
        { description: 'Schengen Business Visa Official Embassy Fee', amount: 18500 },
        { description: 'RH Expedited Slot & Travel Insurance Cover €30,000', amount: 13500 },
        { description: 'Dedicated Concierge Document Compilation', amount: 10000 },
      ],
      validUntil: '2026-10-20',
    },
    caseId: 'CASE-3049',
    caseDetails: {
      caseId: 'CASE-3049',
      caseType: 'Visa Application Filing',
      specialist: 'Officer Mueller (German Desk)',
      status: 'IN_PROGRESS',
      createdAt: '2026-10-07',
    },
    customFields: [
      { key: 'Travel Purpose', value: 'Frankfurt Tech Expo 2026' },
    ],
  },
  {
    id: 'LD-1012',
    name: 'Ritu Varma',
    company: 'Individual Traveler',
    email: 'ritu.v@gmail.com',
    phone: '+91 99888 12345',
    type: 'HOLIDAY',
    source: 'FB / Instagram',
    targetCountry: 'Maldives',
    serviceRequired: 'All-Inclusive Overwater Villa 5D/4N',
    stage: 'CONVERTED',
    value: 195000,
    assignedStaff: 'Priya Singh',
    createdDate: '2026-10-04',
    checklist: [
      { id: 'c1', text: 'Receive initial advance fee / deposit', required: true, completed: true },
      { id: 'c2', text: 'Create Operations Case in CRM', required: true, completed: true },
      { id: 'c3', text: 'Assign Case specialist officer & handoff', required: true, completed: true },
    ],
    quotation: {
      code: '#QUO-2026-271',
      total: 195000,
      discount: 8000,
      status: 'ACCEPTED',
      items: [
        { description: 'Sun Siyam Olhuveli Overwater Villa 4N All-Inclusive (2 Pax)', amount: 165000 },
        { description: 'Speedboat Airport Transfers + Male Excursions', amount: 20000 },
        { description: 'Complimentary Sunset Cruise + Floating Breakfast Package', amount: 10000 },
      ],
      validUntil: '2026-10-18',
    },
    caseId: 'CASE-3050',
    caseDetails: {
      caseId: 'CASE-3050',
      caseType: 'Holiday Tour Execution',
      specialist: 'Priya Singh (Leisure Desk)',
      status: 'CONFIRMED_VOUCHER_ISSUED',
      createdAt: '2026-10-05',
    },
    customFields: [
      { key: 'Meal Plan', value: 'All-Inclusive Premium Beverages' },
    ],
  },
]

// Helpers to read / write local storage
const loadStages = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STAGES)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_STAGES, JSON.stringify(DEFAULT_STAGES))
      return DEFAULT_STAGES
    }
    return JSON.parse(raw)
  } catch {
    return DEFAULT_STAGES
  }
}

const saveStagesData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY_STAGES, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save stages', e)
  }
}

const loadLeads = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(INITIAL_LEADS))
      return INITIAL_LEADS
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_LEADS
  }
}

const saveLeadsData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save leads', e)
  }
}

export const leadsService = {
  // -------------------------------------------------------------
  // STAGES (Dynamic & Configurable)
  // -------------------------------------------------------------
  getStages() {
    return loadStages()
  },

  saveStages(stages) {
    saveStagesData(stages)
    return stages
  },

  addStage(newStage) {
    const stages = loadStages()
    const stageId = (newStage.name || 'NEW_STAGE')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_')
      .slice(0, 16)
    const order = stages.length + 1
    const created = {
      id: stageId,
      stageNumber: order,
      name: newStage.name,
      shortName: newStage.shortName || newStage.name,
      subtitle: newStage.subtitle || 'Custom stage workflow',
      color: newStage.color || '#4F46E5',
      badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-300',
      defaultChecklist: [
        { id: `chk-${Date.now()}-1`, text: 'Perform stage verification', required: true, completed: false },
        { id: `chk-${Date.now()}-2`, text: 'Log updates in CRM notes', required: false, completed: false },
      ],
    }
    const updated = [...stages, created]
    saveStagesData(updated)
    return created
  },

  updateStage(stageId, updates) {
    const stages = loadStages()
    const updated = stages.map((s) => (s.id === stageId ? { ...s, ...updates } : s))
    saveStagesData(updated)
    return updated
  },

  deleteStage(stageId) {
    const stages = loadStages()
    if (stages.length <= 1) return stages
    const updated = stages.filter((s) => s.id !== stageId)
    saveStagesData(updated)
    return updated
  },

  resetStagesToDefault() {
    saveStagesData(DEFAULT_STAGES)
    return DEFAULT_STAGES
  },

  // -------------------------------------------------------------
  // STAFF MEMBERS
  // -------------------------------------------------------------
  getStaffList() {
    return STAFF_MEMBERS
  },

  // -------------------------------------------------------------
  // LEADS CRUD & PIPELINE OPERATIONS
  // -------------------------------------------------------------
  getLeads() {
    return loadLeads()
  },

  getLeadById(id) {
    const list = loadLeads()
    return list.find((lead) => lead.id.toLowerCase() === id.toLowerCase()) || null
  },

  createLead(payload) {
    const list = loadLeads()
    const nextNum = 1000 + list.length + 1
    const newId = payload.id || `LD-${nextNum}`

    // Fetch default checklist for initial stage
    const stages = loadStages()
    const initialStageId = payload.stage || stages[0]?.id || 'LEAD'
    const targetStage = stages.find((s) => s.id === initialStageId) || stages[0]

    const initialChecklist =
      payload.checklist ||
      targetStage?.defaultChecklist?.map((c) => ({ ...c, completed: false })) ||
      []

    const newLead = {
      id: newId,
      name: payload.name,
      company: payload.company || 'Individual Traveler',
      email: payload.email || '',
      phone: payload.phone || '',
      type: payload.type || 'VISA',
      source: payload.source || 'Website Form',
      targetCountry: payload.targetCountry || 'United States',
      serviceRequired: payload.serviceRequired || 'Visitor Visa',
      stage: initialStageId,
      value: Number(payload.value) || 25000,
      assignedStaff: payload.assignedStaff || 'Amit Verma',
      createdDate: new Date().toISOString().slice(0, 10),
      checklist: initialChecklist,
      quotation: null,
      caseId: null,
      customFields: payload.customFields || [],
    }

    const updated = [newLead, ...list]
    saveLeadsData(updated)
    return newLead
  },

  updateLead(id, updates) {
    const list = loadLeads()
    const updated = list.map((lead) => {
      if (lead.id.toLowerCase() === id.toLowerCase()) {
        return { ...lead, ...updates }
      }
      return lead
    })
    saveLeadsData(updated)
    return updated.find((l) => l.id.toLowerCase() === id.toLowerCase())
  },

  deleteLead(id) {
    const list = loadLeads()
    const updated = list.filter((lead) => lead.id.toLowerCase() !== id.toLowerCase())
    saveLeadsData(updated)
    return updated
  },

  // Advance to next stage in pipeline
  advanceStage(leadId) {
    const list = loadLeads()
    const stages = loadStages()
    const lead = list.find((l) => l.id.toLowerCase() === leadId.toLowerCase())
    if (!lead) return null

    const currentIndex = stages.findIndex((s) => s.id === lead.stage)
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1]
      // If moving to CONVERTED and doesn't have a case yet, auto generate one
      let caseId = lead.caseId
      let caseDetails = lead.caseDetails
      if (nextStage.id === 'CONVERTED' && !caseId) {
        caseId = `CASE-${3000 + Math.floor(Math.random() * 900)}`
        caseDetails = {
          caseId,
          caseType: lead.type === 'VISA' ? 'Visa Application Filing' : 'Holiday Tour Execution',
          specialist: lead.assignedStaff,
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString().slice(0, 10),
        }
      }

      return this.updateLead(leadId, {
        stage: nextStage.id,
        caseId,
        caseDetails,
      })
    }
    return lead
  },

  // Move back to previous stage
  previousStage(leadId) {
    const list = loadLeads()
    const stages = loadStages()
    const lead = list.find((l) => l.id.toLowerCase() === leadId.toLowerCase())
    if (!lead) return null

    const currentIndex = stages.findIndex((s) => s.id === lead.stage)
    if (currentIndex > 0) {
      const prevStage = stages[currentIndex - 1]
      return this.updateLead(leadId, { stage: prevStage.id })
    }
    return lead
  },

  // Direct move to specific stage
  moveToStage(leadId, targetStageId) {
    const list = loadLeads()
    const lead = list.find((l) => l.id.toLowerCase() === leadId.toLowerCase())
    if (!lead) return null

    let caseId = lead.caseId
    let caseDetails = lead.caseDetails
    if (targetStageId === 'CONVERTED' && !caseId) {
      caseId = `CASE-${3000 + Math.floor(Math.random() * 900)}`
      caseDetails = {
        caseId,
        caseType: lead.type === 'VISA' ? 'Visa Application Filing' : 'Holiday Tour Execution',
        specialist: lead.assignedStaff,
        status: 'IN_PROGRESS',
        createdAt: new Date().toISOString().slice(0, 10),
      }
    }

    return this.updateLead(leadId, {
      stage: targetStageId,
      caseId,
      caseDetails,
    })
  },

  // Update checklist items for lead
  toggleChecklistItem(leadId, checkId) {
    const list = loadLeads()
    const lead = list.find((l) => l.id.toLowerCase() === leadId.toLowerCase())
    if (!lead) return null

    const updatedChecklist = (lead.checklist || []).map((item) => {
      if (item.id === checkId) {
        return { ...item, completed: !item.completed }
      }
      return item
    })

    return this.updateLead(leadId, { checklist: updatedChecklist })
  },

  addChecklistItem(leadId, text, required = false) {
    const list = loadLeads()
    const lead = list.find((l) => l.id.toLowerCase() === leadId.toLowerCase())
    if (!lead) return null

    const newItem = {
      id: `chk-${Date.now()}`,
      text,
      required,
      completed: false,
    }

    const updatedChecklist = [...(lead.checklist || []), newItem]
    return this.updateLead(leadId, { checklist: updatedChecklist })
  },

  // Save itemized quotation for proposal
  saveQuotation(leadId, quotationPayload) {
    const code = quotationPayload.code || `#QUO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
    const total = Number(quotationPayload.total) || 0
    const quotation = {
      ...quotationPayload,
      code,
      total,
      status: quotationPayload.status || 'SENT',
      updatedAt: new Date().toISOString().slice(0, 10),
    }

    return this.updateLead(leadId, {
      quotation,
      value: total > 0 ? total : undefined,
    })
  },

  // Convert Lead to Operations Case and assign specialist staff
  convertToCase(leadId, casePayload = {}) {
    const list = loadLeads()
    const lead = list.find((l) => l.id.toLowerCase() === leadId.toLowerCase())
    if (!lead) return null

    const caseId = casePayload.caseId || `CASE-${3000 + Math.floor(Math.random() * 900)}`
    const caseType =
      casePayload.caseType || (lead.type === 'VISA' ? 'Visa Application Filing' : 'Holiday Tour Execution')
    const specialist = casePayload.specialist || lead.assignedStaff || 'Amit Verma'

    const caseDetails = {
      caseId,
      caseType,
      specialist,
      status: casePayload.status || 'IN_PROGRESS',
      priority: casePayload.priority || 'Normal',
      createdAt: new Date().toISOString().slice(0, 10),
      notes: casePayload.notes || `Converted from lead ${lead.id} (${lead.name})`,
    }

    const updatedLead = this.updateLead(leadId, {
      stage: 'CONVERTED',
      caseId,
      caseDetails,
      assignedStaff: specialist,
    })

    if (lead.type === 'VISA') {
      try {
        visaCasesService.createCaseFromLead({
          ...lead,
          assignedStaff: specialist,
        })
      } catch (e) {
        console.warn('Sync to visa cases error:', e)
      }
    } else {
      try {
        holidayCasesService.createCaseFromLead({
          ...lead,
          assignedStaff: specialist,
        })
      } catch (e) {
        console.warn('Sync to holiday cases error:', e)
      }
    }

    return updatedLead
  },
}

export default leadsService
