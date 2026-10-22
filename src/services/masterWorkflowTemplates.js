/**
 * Master Stage & Workflow Config Service
 * ============================================================================
 * Manages customizable workflow templates for Visa Applications and Holiday Tours.
 * 
 * Includes:
 * 1. MASTER_VISA_STAGES_POOL (13 Exhaustive Master Stages with full checklist pools)
 * 2. MASTER_HOLIDAY_STAGES_POOL (11 Exhaustive Master Stages with full checklist pools)
 * 
 * When creating or customizing a category-wise template:
 * - Administrators can select ANY subset of stages (e.g. 5 or 7 out of 13 stages)
 * - Inside each stage, they can select WHICH checklist items to include (e.g. 6 out of 10 items)
 * - Toggle Mandatory vs Optional on each item
 * 
 * Lead Conversion & Direct Case Creation will automatically inherit the chosen stages
 * and selected checklist requirements!
 * ============================================================================
 */

import { VISA_STAGES } from './visaCases'
import { HOLIDAY_STAGES } from './holidayCases'

const STORAGE_KEY_WORKFLOW_TEMPLATES = 'rh_crm_master_workflow_templates_v3'

export const VISA_CATEGORIES = [
  { id: 'STUDENT_VISA', name: 'Student Visa / Study Permit', icon: '🎓', defaultDays: '25-35 Days', defaultFee: 35000 },
  { id: 'TOURIST_VISITOR', name: 'Tourist / Visitor Visa', icon: '🌍', defaultDays: '10-15 Days', defaultFee: 22000 },
  { id: 'BUSINESS_CORP', name: 'Business / Corporate Visa', icon: '💼', defaultDays: '7-12 Days', defaultFee: 28000 },
  { id: 'WORK_PERMIT', name: 'Work Permit & Employment', icon: '🛠️', defaultDays: '30-45 Days', defaultFee: 45000 },
  { id: 'FAMILY_PR', name: 'Family PR & Sponsorship', icon: '👨‍👩‍👧', defaultDays: '40-60 Days', defaultFee: 50000 },
]

export const HOLIDAY_CATEGORIES = [
  { id: 'INTERNATIONAL_LUXURY', name: 'International Luxury Tour', icon: '✨', defaultDays: '7-10 Days', defaultFee: 185000 },
  { id: 'GROUP_ADVENTURE', name: 'Group & Adventure Holiday', icon: '🏔️', defaultDays: '5-8 Days', defaultFee: 95000 },
  { id: 'CUSTOM_FAMILY', name: 'Custom Family Holiday', icon: '🏖️', defaultDays: '6-9 Days', defaultFee: 140000 },
  { id: 'HONEYMOON_SPECIAL', name: 'Honeymoon & Romantic Escapes', icon: '🥂', defaultDays: '5-7 Days', defaultFee: 160000 },
  { id: 'CORPORATE_MICE', name: 'Corporate MICE & Retreat', icon: '🏢', defaultDays: '4-6 Days', defaultFee: 220000 },
]

// ============================================================================
// 1. MASTER VISA STAGES POOL (13 Comprehensive Master Stages)
// ============================================================================
export const MASTER_VISA_STAGES_POOL = [
  {
    poolId: 'POOL_V1_INTAKE',
    defaultTitle: 'Stage 1: Lead Intake & Counseling',
    defaultShortTitle: 'Intake & Counseling',
    defaultSubtitle: 'Initial applicant profile & eligibility evaluation',
    colorBadge: 'bg-indigo-600 text-white',
    badgeBorder: 'border-indigo-400 text-indigo-700 bg-indigo-50/90',
    headerBg: 'bg-indigo-500/10 text-indigo-900 border-indigo-300',
    nextButtonText: '→ Docs Verified',
    checklistPool: [
      { id: 'v_int_1', label: 'Primary applicant personal identity & contact details verified', mandatory: true },
      { id: 'v_int_2', label: 'Valid Passport copy (min 6-18 months validity) verified', mandatory: true },
      { id: 'v_int_3', label: 'Target destination country & specific visa category finalized', mandatory: true },
      { id: 'v_int_4', label: 'Initial consulting intake fee confirmed & recorded', mandatory: true },
      { id: 'v_int_5', label: 'Educational & professional background history recorded', mandatory: false },
      { id: 'v_int_6', label: 'Previous overseas travel history & past visa rejection checks completed', mandatory: true },
      { id: 'v_int_7', label: 'Sponsor relationship & financial source identified', mandatory: true },
      { id: 'v_int_8', label: 'Client signed CRM service agreement & compliance terms', mandatory: false },
      { id: 'v_int_9', label: 'Emergency contact & parent/guardian details registered', mandatory: false },
      { id: 'v_int_10', label: 'Target travel / university session deadline locked in CRM', mandatory: true },
    ],
    requiredDocumentsPool: ['Valid Passport', 'Government ID', 'Intake Assessment Form', 'Service Agreement'],
    milestonePaymentPercent: 20,
  },
  {
    poolId: 'POOL_V2_DOCS',
    defaultTitle: 'Stage 2: Document Collection & Verification',
    defaultShortTitle: 'Docs Verified',
    defaultSubtitle: 'Document authenticity & compliance cross-checking',
    colorBadge: 'bg-blue-600 text-white',
    badgeBorder: 'border-blue-400 text-blue-700 bg-blue-50/90',
    headerBg: 'bg-blue-500/10 text-blue-900 border-blue-300',
    nextButtonText: '→ Academic/Filing',
    checklistPool: [
      { id: 'v_doc_1', label: 'Original passport physical inspection completed', mandatory: true },
      { id: 'v_doc_2', label: 'National ID / Aadhaar card / Voter ID verified', mandatory: true },
      { id: 'v_doc_3', label: 'Passport-size photographs matching embassy specs received', mandatory: true },
      { id: 'v_doc_4', label: 'Employment verification letter / Business registration verified', mandatory: true },
      { id: 'v_doc_5', label: 'Salary slips & Income Tax Returns (ITR) for last 3 years checked', mandatory: true },
      { id: 'v_doc_6', label: 'Police Clearance Certificate (PCC) verified (if applicable)', mandatory: false },
      { id: 'v_doc_7', label: 'Certified English translations for regional documents attached', mandatory: false },
      { id: 'v_doc_8', label: 'Official cover letter outlining itinerary and purpose drafted', mandatory: true },
      { id: 'v_doc_9', label: 'Document notarization & apostille stamp verified', mandatory: false },
      { id: 'v_doc_10', label: 'Document dossier signed off by senior visa specialist', mandatory: true },
    ],
    requiredDocumentsPool: ['Passport Photos', 'National ID', 'Employment Letter', 'ITR 3 Years', 'Cover Letter'],
    milestonePaymentPercent: 35,
  },
  {
    poolId: 'POOL_V3_ACADEMIC_CAS',
    defaultTitle: 'Stage 3: University Offer & CAS / I-20',
    defaultShortTitle: 'University Offer',
    defaultSubtitle: 'Admissions unconditional offer & CAS verification',
    colorBadge: 'bg-indigo-700 text-white',
    badgeBorder: 'border-indigo-500 text-indigo-800 bg-indigo-50/90',
    headerBg: 'bg-indigo-600/10 text-indigo-900 border-indigo-300',
    nextButtonText: '→ Financial Proof',
    checklistPool: [
      { id: 'v_aca_1', label: 'University unconditional admission offer letter verified', mandatory: true },
      { id: 'v_aca_2', label: 'Official CAS (UK) or I-20 (US) barcode slip issued & logged', mandatory: true },
      { id: 'v_aca_3', label: 'Academic transcripts & degree certificates verified', mandatory: true },
      { id: 'v_aca_4', label: 'English language proficiency test (IELTS / PTE / TOEFL) verified', mandatory: true },
      { id: 'v_aca_5', label: 'Statement of Purpose (SOP) & study justification reviewed', mandatory: true },
      { id: 'v_aca_6', label: 'University tuition fee advance deposit receipt confirmed', mandatory: true },
      { id: 'v_aca_7', label: 'GIC account opening certificate verified (Canada SDS)', mandatory: false },
      { id: 'v_aca_8', label: 'Gap year explanation affidavit & work experience letter attached', mandatory: false },
      { id: 'v_aca_9', label: 'Letters of recommendation (LOR) from academic professors attached', mandatory: false },
      { id: 'v_aca_10', label: 'Course start date & orientation deadline verified in portal', mandatory: true },
    ],
    requiredDocumentsPool: ['CAS / I-20 Letter', 'Unconditional Offer', 'IELTS / PTE Scorecard', 'Academic Transcripts', 'SOP'],
    milestonePaymentPercent: 45,
  },
  {
    poolId: 'POOL_V4_FINANCIAL',
    defaultTitle: 'Stage 4: Financial Proof & Sponsor Net-Worth',
    defaultShortTitle: 'Financial Proof',
    defaultSubtitle: '28-day funds holding & sponsor affidavit check',
    colorBadge: 'bg-blue-700 text-white',
    badgeBorder: 'border-blue-500 text-blue-800 bg-blue-50/90',
    headerBg: 'bg-blue-600/10 text-blue-900 border-blue-300',
    nextButtonText: '→ Portal Filing',
    checklistPool: [
      { id: 'v_fin_1', label: '28-day continuous funds holding bank statement verified with bank seal', mandatory: true },
      { id: 'v_fin_2', label: 'Bank balance certificate with contact officer details attached', mandatory: true },
      { id: 'v_fin_3', label: 'Notarized sponsorship affidavit & relationship proof attached', mandatory: true },
      { id: 'v_fin_4', label: 'Sponsor ITR & Form 16 for past 3 financial years verified', mandatory: true },
      { id: 'v_fin_5', label: 'Chartered Accountant (CA) net-worth valuation report uploaded', mandatory: false },
      { id: 'v_fin_6', label: 'Education loan sanction letter & disbursement schedule verified', mandatory: false },
      { id: 'v_fin_7', label: 'Property valuation / liquid assets valuation certificate verified', mandatory: false },
      { id: 'v_fin_8', label: 'Foreign exchange (Forex) card / traveler cheque proof checked', mandatory: false },
      { id: 'v_fin_9', label: 'Source of funds justification letter signed by sponsor', mandatory: true },
      { id: 'v_fin_10', label: 'Total financial coverage matches embassy maintenance requirements', mandatory: true },
    ],
    requiredDocumentsPool: ['28-Day Bank Statement', 'Bank Balance Certificate', 'Sponsor Affidavit', 'CA Valuation', 'Loan Sanction Letter'],
    milestonePaymentPercent: 55,
  },
  {
    poolId: 'POOL_V5_PORTAL_FILING',
    defaultTitle: 'Stage 5: Embassy Online Portal Filing',
    defaultShortTitle: 'Portal Filing',
    defaultSubtitle: 'Official government online application submission',
    colorBadge: 'bg-purple-600 text-white',
    badgeBorder: 'border-purple-400 text-purple-700 bg-purple-50/90',
    headerBg: 'bg-purple-500/10 text-purple-900 border-purple-300',
    nextButtonText: '→ Biometrics/Med',
    checklistPool: [
      { id: 'v_por_1', label: 'Embassy online portal applicant account created & authenticated', mandatory: true },
      { id: 'v_por_2', label: 'Online visa application form (DS-160 / UKVI / ImmiAccount) completed', mandatory: true },
      { id: 'v_por_3', label: 'Digital document uploads (financials, passport, cover letter) completed', mandatory: true },
      { id: 'v_por_4', label: 'Government visa processing fee paid & receipt archived', mandatory: true },
      { id: 'v_por_5', label: 'Immigration Health Surcharge (IHS) payment receipt cleared', mandatory: true },
      { id: 'v_por_6', label: 'Application submission confirmation barcode slip generated', mandatory: true },
      { id: 'v_por_7', label: 'Government application tracking reference (GWF / CEAC) recorded', mandatory: true },
      { id: 'v_por_8', label: 'Client review of submitted form completed and confirmed', mandatory: true },
      { id: 'v_por_9', label: 'Filing acknowledgement email dispatched to client', mandatory: false },
      { id: 'v_por_10', label: 'Application submitted timestamp locked in CRM', mandatory: true },
    ],
    requiredDocumentsPool: ['Submitted Portal Form', 'Visa Fee Receipt', 'IHS Surcharge Receipt', 'Submission Barcode'],
    milestonePaymentPercent: 65,
  },
  {
    poolId: 'POOL_V6_BIOMETRICS_MED',
    defaultTitle: 'Stage 6: VFS Biometrics & Medical Clearance',
    defaultShortTitle: 'Biometrics & Med',
    defaultSubtitle: 'VAC appointment attended & panel physician clearance',
    colorBadge: 'bg-orange-500 text-white',
    badgeBorder: 'border-orange-400 text-orange-700 bg-orange-50/90',
    headerBg: 'bg-orange-500/10 text-orange-900 border-orange-300',
    nextButtonText: '→ Interview/Review',
    checklistPool: [
      { id: 'v_bio_1', label: 'VFS / TLScontact / VAC appointment booked & confirmed', mandatory: true },
      { id: 'v_bio_2', label: 'Biometric appointment letter & barcode pass printed for client', mandatory: true },
      { id: 'v_bio_3', label: 'Panel physician medical examination & chest X-ray scheduled', mandatory: true },
      { id: 'v_bio_4', label: 'Medical clearance certificate / TB screening cleared', mandatory: true },
      { id: 'v_bio_5', label: 'Applicant attended biometric appointment (Fingerprints & Iris scan)', mandatory: true },
      { id: 'v_bio_6', label: 'VAC submission token & tracking barcode received from applicant', mandatory: true },
      { id: 'v_bio_7', label: 'CRM pipeline updated with biometric submission date', mandatory: true },
      { id: 'v_bio_8', label: 'Passport courier dispatch / tracking reference recorded', mandatory: false },
      { id: 'v_bio_9', label: 'SMS & WhatsApp tracking alerts enabled for applicant', mandatory: false },
      { id: 'v_bio_10', label: 'Embassy processing clock countdown initiated in CRM', mandatory: true },
    ],
    requiredDocumentsPool: ['VFS Appointment Slip', 'Medical Clearance / TB Certificate', 'VAC Submission Token'],
    milestonePaymentPercent: 75,
  },
  {
    poolId: 'POOL_V7_MOCK_INTERVIEW',
    defaultTitle: 'Stage 7: Consular Mock Interview Prep',
    defaultShortTitle: 'Mock Interview',
    defaultSubtitle: 'Mock interviews, coaching & original document binder',
    colorBadge: 'bg-indigo-800 text-white',
    badgeBorder: 'border-indigo-600 text-indigo-900 bg-indigo-50/90',
    headerBg: 'bg-indigo-700/10 text-indigo-900 border-indigo-300',
    nextButtonText: '→ Interview Day',
    checklistPool: [
      { id: 'v_moc_1', label: 'Consular interview date, time & consulate location verified', mandatory: true },
      { id: 'v_moc_2', label: 'Mock interview briefing dossier & question bank provided to applicant', mandatory: true },
      { id: 'v_moc_3', label: 'Mock interview round 1: Travel intent & study/business goals completed', mandatory: true },
      { id: 'v_moc_4', label: 'Mock interview round 2: Financial justification & sponsor details completed', mandatory: true },
      { id: 'v_moc_5', label: 'Mock interview round 3: Ties to home country & return plans completed', mandatory: true },
      { id: 'v_moc_6', label: 'Body language, dress code & confidence coaching session conducted', mandatory: false },
      { id: 'v_moc_7', label: 'Original document binder organized in mandatory sequence', mandatory: true },
      { id: 'v_moc_8', label: 'Emergency helpline contact given to applicant for interview day', mandatory: false },
      { id: 'v_moc_9', label: 'Final interview clearance mock score granted by head counselor', mandatory: true },
      { id: 'v_moc_10', label: 'Applicant self-confidence & readiness confirmed', mandatory: true },
    ],
    requiredDocumentsPool: ['Interview Appointment Slip', 'Mock Q&A Scorecard', 'Original Document Binder'],
    milestonePaymentPercent: 80,
  },
  {
    poolId: 'POOL_V8_EMBASSY_INTERVIEW',
    defaultTitle: 'Stage 8: Embassy Interview Attendance',
    defaultShortTitle: 'Interview Attended',
    defaultSubtitle: 'Consular appearance & preliminary interview outcome',
    colorBadge: 'bg-purple-700 text-white',
    badgeBorder: 'border-purple-500 text-purple-900 bg-purple-50/90',
    headerBg: 'bg-purple-600/10 text-purple-900 border-purple-300',
    nextButtonText: '→ Processing Track',
    checklistPool: [
      { id: 'v_emb_1', label: 'Applicant arrived on time at embassy / consulate gate', mandatory: true },
      { id: 'v_emb_2', label: 'Security check cleared and token number collected', mandatory: true },
      { id: 'v_emb_3', label: 'Fingerprint verification at consular window completed', mandatory: true },
      { id: 'v_emb_4', label: 'Consular officer interview attended in person', mandatory: true },
      { id: 'v_emb_5', label: 'Original documents submitted to consular officer', mandatory: true },
      { id: 'v_emb_6', label: 'Preliminary outcome recorded (Green slip / Passport retained / 221g)', mandatory: true },
      { id: 'v_emb_7', label: 'Immediate debrief call conducted with counselor after interview', mandatory: true },
      { id: 'v_emb_8', label: 'Any 221(g) additional document requests logged in system', mandatory: false },
    ],
    requiredDocumentsPool: ['Embassy Interview Token', 'Preliminary Outcome Slip'],
    milestonePaymentPercent: 85,
  },
  {
    poolId: 'POOL_V9_PROCESSING',
    defaultTitle: 'Stage 9: Embassy Processing & Tracking',
    defaultShortTitle: 'Processing',
    defaultSubtitle: 'Consular tracking & background security clearance',
    colorBadge: 'bg-orange-600 text-white',
    badgeBorder: 'border-orange-500 text-orange-800 bg-orange-50/90',
    headerBg: 'bg-orange-500/10 text-orange-900 border-orange-300',
    nextButtonText: '→ Visa Approved',
    checklistPool: [
      { id: 'v_pro_1', label: 'Daily consular portal tracking status logged in CRM', mandatory: true },
      { id: 'v_pro_2', label: 'Embassy background security clearance verified', mandatory: true },
      { id: 'v_pro_3', label: 'Additional verification inquiry or call from embassy cleared', mandatory: false },
      { id: 'v_pro_4', label: 'VAC tracking shows passport dispatched from embassy', mandatory: true },
      { id: 'v_pro_5', label: 'Courier airway bill tracking number verified', mandatory: true },
      { id: 'v_pro_6', label: 'Client alerted regarding courier delivery schedule', mandatory: false },
      { id: 'v_pro_7', label: 'Passport delivery OTP or signature instructions shared', mandatory: false },
      { id: 'v_pro_8', label: 'Safe receipt of courier confirmed with client', mandatory: true },
    ],
    requiredDocumentsPool: ['Courier Airway Bill', 'Consular Tracking Screenshot'],
    milestonePaymentPercent: 90,
  },
  {
    poolId: 'POOL_V10_APPROVED',
    defaultTitle: 'Stage 10: Visa Approved & Vignette Stamped',
    defaultShortTitle: 'Approved & Stamped',
    defaultSubtitle: 'Visa granted by embassy & passport stamped',
    colorBadge: 'bg-teal-600 text-white',
    badgeBorder: 'border-teal-500 text-teal-700 bg-teal-50/90',
    headerBg: 'bg-teal-500/10 text-teal-900 border-teal-300',
    nextButtonText: '→ Final Settlement',
    checklistPool: [
      { id: 'v_app_1', label: 'Passport opened & official visa vignette / sticker verified', mandatory: true },
      { id: 'v_app_2', label: 'Visa category, applicant name & passport number cross-checked', mandatory: true },
      { id: 'v_app_3', label: 'Visa validity dates & permitted duration of stay verified', mandatory: true },
      { id: 'v_app_4', label: 'Single / multiple entry conditions verified against booking', mandatory: true },
      { id: 'v_app_5', label: 'High-resolution color scan of stamped visa uploaded to CRM', mandatory: true },
      { id: 'v_app_6', label: 'Formal congratulations letter dispatched to client & family', mandatory: true },
      { id: 'v_app_7', label: 'Stamped passport handed over / dispatched with security seal', mandatory: true },
      { id: 'v_app_8', label: 'Client testimonial & Google review requested', mandatory: false },
      { id: 'v_app_9', label: 'Physical document dossier handed back to applicant', mandatory: true },
      { id: 'v_app_10', label: 'Social media celebration post shared (with client consent)', mandatory: false },
    ],
    requiredDocumentsPool: ['Stamped Visa Copy', 'Embassy Grant Letter', 'Passport Handover Receipt'],
    milestonePaymentPercent: 95,
  },
  {
    poolId: 'POOL_V11_PAYMENT',
    defaultTitle: 'Stage 11: Final Fee Settlement & Billing',
    defaultShortTitle: 'Payment & Billing',
    defaultSubtitle: 'Success commission & final consulting tax invoice',
    colorBadge: 'bg-emerald-600 text-white',
    badgeBorder: 'border-emerald-400 text-emerald-700 bg-emerald-50/90',
    headerBg: 'bg-emerald-500/10 text-emerald-900 border-emerald-300',
    nextButtonText: '→ Pre-Departure',
    checklistPool: [
      { id: 'v_pay_1', label: 'Final consulting success fee calculated according to agreement', mandatory: true },
      { id: 'v_pay_2', label: 'Official GST tax invoice generated and dispatched to client', mandatory: true },
      { id: 'v_pay_3', label: 'Client payment received via bank transfer / UPI / card', mandatory: true },
      { id: 'v_pay_4', label: 'Official payment receipt voucher issued', mandatory: true },
      { id: 'v_pay_5', label: 'Finance ledger reconciled and marked PAID in CRM', mandatory: true },
      { id: 'v_pay_6', label: 'Internal sales counselor success commission credited', mandatory: false },
      { id: 'v_pay_7', label: 'Accounting GST compliance entry filed', mandatory: false },
      { id: 'v_pay_8', label: 'Zero balance clearance certificate generated', mandatory: true },
    ],
    requiredDocumentsPool: ['Official Tax Invoice', 'Final Payment Receipt', 'Zero Balance Certificate'],
    milestonePaymentPercent: 100,
  },
  {
    poolId: 'POOL_V12_PRE_DEPARTURE',
    defaultTitle: 'Stage 12: Pre-Departure Briefing & Travel Kit',
    defaultShortTitle: 'Pre-Departure',
    defaultSubtitle: 'Travel dossier, international SIM, forex & packing guide',
    colorBadge: 'bg-slate-700 text-white',
    badgeBorder: 'border-slate-500 text-slate-800 bg-slate-100',
    headerBg: 'bg-slate-200 text-slate-900 border-slate-300',
    nextButtonText: null,
    checklistPool: [
      { id: 'v_pre_1', label: 'Pre-departure orientation session attended by traveler', mandatory: true },
      { id: 'v_pre_2', label: 'Flight tickets verified with baggage allowance rules explained', mandatory: true },
      { id: 'v_pre_3', label: 'International student / travel SIM card issued and activated', mandatory: false },
      { id: 'v_pre_4', label: 'Forex card loaded with foreign currency verified', mandatory: false },
      { id: 'v_pre_5', label: 'University campus dorm / hotel check-in voucher confirmed', mandatory: true },
      { id: 'v_pre_6', label: 'Airport immigration officer Q&A tips explained to client', mandatory: true },
      { id: 'v_pre_7', label: 'Customs regulations & prohibited items list provided', mandatory: false },
      { id: 'v_pre_8', label: 'Overseas student health cover (OSHC / Insurance) copy handed over', mandatory: true },
      { id: 'v_pre_9', label: '24/7 overseas emergency contact helpline shared', mandatory: true },
      { id: 'v_pre_10', label: 'Travel packing checklist cross-verified with applicant', mandatory: false },
    ],
    requiredDocumentsPool: ['Flight Ticket', 'Forex Card Slip', 'Immigration Guidebook'],
    milestonePaymentPercent: 100,
  },
  {
    poolId: 'POOL_V13_REJECTED',
    defaultTitle: 'Stage 13: Case Rejected / Appeal Analysis',
    defaultShortTitle: 'Rejected / Appeal',
    defaultSubtitle: 'Embassy refusal letter logging & re-application feasibility',
    colorBadge: 'bg-rose-600 text-white',
    badgeBorder: 'border-rose-400 text-rose-700 bg-rose-50/90',
    headerBg: 'bg-rose-500/10 text-rose-900 border-rose-300',
    nextButtonText: null,
    checklistPool: [
      { id: 'v_rej_1', label: 'Official embassy refusal letter uploaded and logged in CRM', mandatory: true },
      { id: 'v_rej_2', label: 'Exact refusal clauses (e.g. 214b, genuine visitor rule) analyzed', mandatory: true },
      { id: 'v_rej_3', label: 'Counselor debrief session conducted with applicant', mandatory: true },
      { id: 'v_rej_4', label: 'Administrative review / appeal filing feasibility evaluated', mandatory: false },
      { id: 'v_rej_5', label: 'Re-application strategy & root cause correction plan drafted', mandatory: false },
      { id: 'v_rej_6', label: 'Financial refund (if applicable under refund policy) processed', mandatory: false },
      { id: 'v_rej_7', label: 'Case closed in CRM with refusal reason category recorded', mandatory: true },
      { id: 'v_rej_8', label: 'Future re-filing reminder date set in calendar', mandatory: false },
    ],
    requiredDocumentsPool: ['Embassy Refusal Letter', 'Case Analysis Memo'],
    milestonePaymentPercent: 0,
  },
]

// ============================================================================
// 2. MASTER HOLIDAY STAGES POOL (11 Comprehensive Master Stages)
// ============================================================================
export const MASTER_HOLIDAY_STAGES_POOL = [
  {
    poolId: 'POOL_H1_INTAKE',
    defaultTitle: 'Stage 1: Lead Converted & Consultation',
    defaultShortTitle: 'Consultation',
    defaultSubtitle: 'Travel dates, passenger count & budget consultation',
    colorBadge: 'bg-indigo-600 text-white',
    badgeBorder: 'border-indigo-400 text-indigo-700 bg-indigo-50/90',
    headerBg: 'bg-indigo-500/10 text-indigo-900 border-indigo-300',
    nextButtonText: '→ Custom Itinerary',
    checklistPool: [
      { id: 'h_int_1', label: 'Lead conversion verified and primary traveler profile created', mandatory: true },
      { id: 'h_int_2', label: 'Destination preference, travel dates & total PAX count confirmed', mandatory: true },
      { id: 'h_int_3', label: 'Passenger age breakdown (adults, children, infants) recorded', mandatory: true },
      { id: 'h_int_4', label: 'Accommodation preference (5-star, luxury villa, all-inclusive) noted', mandatory: true },
      { id: 'h_int_5', label: 'Meal preferences (Vegetarian, Jain, Halal) documented', mandatory: false },
      { id: 'h_int_6', label: 'Special occasion amenities (Honeymoon, Anniversary) noted', mandatory: false },
      { id: 'h_int_7', label: 'Passport validity checked (min 6 months from travel date)', mandatory: true },
      { id: 'h_int_8', label: 'Budget expectations & preferred airline class recorded', mandatory: false },
      { id: 'h_int_9', label: 'Initial consultation notes logged in CRM', mandatory: true },
      { id: 'h_int_10', label: 'Client assigned to dedicated holiday specialist', mandatory: true },
    ],
    requiredDocumentsPool: ['Primary Contact Details', 'Travel Requirements Brief'],
    milestonePaymentPercent: 20,
  },
  {
    poolId: 'POOL_H2_ITINERARY',
    defaultTitle: 'Stage 2: Custom Itinerary & Quotation',
    defaultShortTitle: 'Custom Itinerary',
    defaultSubtitle: 'Day-wise customized itinerary & quotation approval',
    colorBadge: 'bg-blue-600 text-white',
    badgeBorder: 'border-blue-400 text-blue-700 bg-blue-50/90',
    headerBg: 'bg-blue-500/10 text-blue-900 border-blue-300',
    nextButtonText: '→ Flights/Resort Holds',
    checklistPool: [
      { id: 'h_iti_1', label: 'Day-wise detailed sightseeing & leisure itinerary prepared', mandatory: true },
      { id: 'h_iti_2', label: 'Selected luxury resorts verified for room availability', mandatory: true },
      { id: 'h_iti_3', label: 'Internal transfers (private car, speed boat, flights) mapped', mandatory: true },
      { id: 'h_iti_4', label: 'Activity & attraction tickets included in itinerary', mandatory: false },
      { id: 'h_iti_5', label: 'Itemized quotation with breakdown of GST + TCS drafted', mandatory: true },
      { id: 'h_iti_6', label: 'Quotation PDF dispatched to traveler via WhatsApp/Email', mandatory: true },
      { id: 'h_iti_7', label: 'Traveler feedback received and custom modifications incorporated', mandatory: true },
      { id: 'h_iti_8', label: 'Final itinerary signed off & approved by traveler', mandatory: true },
      { id: 'h_iti_9', label: 'Booking terms, cancellation policy & inclusions checklist accepted', mandatory: true },
      { id: 'h_iti_10', label: 'Quotation code locked in CRM', mandatory: true },
    ],
    requiredDocumentsPool: ['Custom Itinerary PDF', 'Approved Quotation'],
    milestonePaymentPercent: 30,
  },
  {
    poolId: 'POOL_H3_HOLDS',
    defaultTitle: 'Stage 3: Airline & Resort Holds',
    defaultShortTitle: 'Flights & Holds',
    defaultSubtitle: 'Blocking flight seats & resort room inventory',
    colorBadge: 'bg-blue-700 text-white',
    badgeBorder: 'border-blue-500 text-blue-800 bg-blue-50/90',
    headerBg: 'bg-blue-600/10 text-blue-900 border-blue-300',
    nextButtonText: '→ Advance Deposit',
    checklistPool: [
      { id: 'h_hld_1', label: 'International airline PNRs placed on hold with fare guarantee', mandatory: true },
      { id: 'h_hld_2', label: 'Hotel room reservations placed on confirmed hold', mandatory: true },
      { id: 'h_hld_3', label: 'Inter-island / domestic flight seats held', mandatory: false },
      { id: 'h_hld_4', label: 'Specific room category (Overwater villa / Suite) confirmed', mandatory: true },
      { id: 'h_hld_5', label: 'Flight seat selection & meal requests placed on airline system', mandatory: false },
      { id: 'h_hld_6', label: 'Vendor hold release deadline monitored in reservation system', mandatory: true },
      { id: 'h_hld_7', label: 'Ground handling partner notified of traveler arrival dates', mandatory: true },
      { id: 'h_hld_8', label: 'Hold confirmation slips archived in CRM', mandatory: true },
    ],
    requiredDocumentsPool: ['Airline PNR Holds', 'Hotel Room Hold Confirmation'],
    milestonePaymentPercent: 40,
  },
  {
    poolId: 'POOL_H4_ADVANCE_PAY',
    defaultTitle: 'Stage 4: Advance Deposit & Billing',
    defaultShortTitle: 'Advance Deposit',
    defaultSubtitle: '30-50% advance package deposit & formal billing',
    colorBadge: 'bg-emerald-600 text-white',
    badgeBorder: 'border-emerald-400 text-emerald-700 bg-emerald-50/90',
    headerBg: 'bg-emerald-500/10 text-emerald-900 border-emerald-300',
    nextButtonText: '→ Vendor Ticketing',
    checklistPool: [
      { id: 'h_adv_1', label: 'Advance deposit invoice generated and sent to client', mandatory: true },
      { id: 'h_adv_2', label: 'Advance deposit payment received in company bank account', mandatory: true },
      { id: 'h_adv_3', label: 'Official tax invoice with GST breakdown issued', mandatory: true },
      { id: 'h_adv_4', label: 'Official advance payment receipt shared with customer', mandatory: true },
      { id: 'h_adv_5', label: 'Payment transaction reference recorded in finance ledger', mandatory: true },
      { id: 'h_adv_6', label: 'Traveler payment status updated to PARTIAL in CRM', mandatory: true },
      { id: 'h_adv_7', label: 'Bank remittance receipt verified for international transfers', mandatory: false },
      { id: 'h_adv_8', label: 'Next installment due date reminder scheduled', mandatory: true },
    ],
    requiredDocumentsPool: ['Official Tax Invoice', 'Advance Payment Receipt'],
    milestonePaymentPercent: 60,
  },
  {
    poolId: 'POOL_H5_VENDOR_RELEASE',
    defaultTitle: 'Stage 5: Vendor Payments & Ticketing',
    defaultShortTitle: 'Vendor Payments',
    defaultSubtitle: 'Airline ticketing & hotel payment clearance',
    colorBadge: 'bg-purple-600 text-white',
    badgeBorder: 'border-purple-400 text-purple-700 bg-purple-50/90',
    headerBg: 'bg-purple-500/10 text-purple-900 border-purple-300',
    nextButtonText: '→ Visa & Insurance',
    checklistPool: [
      { id: 'h_ven_1', label: 'Non-refundable airline tickets ticketed & e-ticket numbers generated', mandatory: true },
      { id: 'h_ven_2', label: 'Hotel reservation advance release approved by accounts', mandatory: true },
      { id: 'h_ven_3', label: 'Local tour operator / DMC payment voucher released', mandatory: true },
      { id: 'h_ven_4', label: 'Special experience & yacht charter payments cleared', mandatory: false },
      { id: 'h_ven_5', label: 'Vendor payment vouchers and transaction slips collected', mandatory: true },
      { id: 'h_ven_6', label: 'Hotel confirmation numbers verified directly with front desk', mandatory: true },
      { id: 'h_ven_7', label: 'Transfer provider contact details and vehicle type confirmed', mandatory: true },
      { id: 'h_ven_8', label: 'All vendor contracts locked against booking in CRM', mandatory: true },
    ],
    requiredDocumentsPool: ['Flight E-Tickets', 'Vendor Payment Receipts', 'Hotel Confirmation Slips'],
    milestonePaymentPercent: 75,
  },
  {
    poolId: 'POOL_H6_VISA_INSURANCE',
    defaultTitle: 'Stage 6: Visa & Insurance Clearance',
    defaultShortTitle: 'Visa & Insurance',
    defaultSubtitle: 'Tourist visa / E-visa & travel insurance verified',
    colorBadge: 'bg-orange-500 text-white',
    badgeBorder: 'border-orange-400 text-orange-700 bg-orange-50/90',
    headerBg: 'bg-orange-500/10 text-orange-900 border-orange-300',
    nextButtonText: '→ Final Balance',
    checklistPool: [
      { id: 'h_vis_1', label: 'Tourist visa / E-Visa / Visa-on-Arrival eligibility verified', mandatory: true },
      { id: 'h_vis_2', label: 'E-Visa applied and approved copies received for all PAX', mandatory: true },
      { id: 'h_vis_3', label: 'Overseas comprehensive travel insurance policy issued', mandatory: true },
      { id: 'h_vis_4', label: 'Insurance medical coverage and flight cancellation protection verified', mandatory: true },
      { id: 'h_vis_5', label: 'Passport copies matching e-visa names cross-checked', mandatory: true },
      { id: 'h_vis_6', label: 'Health declaration & digital arrival cards filed', mandatory: false },
      { id: 'h_vis_7', label: 'Traveler emergency contact details registered', mandatory: true },
      { id: 'h_vis_8', label: 'Visa and insurance documents uploaded to case file in CRM', mandatory: true },
    ],
    requiredDocumentsPool: ['Approved E-Visa Copies', 'Travel Insurance Policies', 'Passport Scans'],
    milestonePaymentPercent: 85,
  },
  {
    poolId: 'POOL_H7_FINAL_PAYMENT',
    defaultTitle: 'Stage 7: Final Payment Settlement',
    defaultShortTitle: 'Final Payment',
    defaultSubtitle: '100% full package balance settlement',
    colorBadge: 'bg-emerald-700 text-white',
    badgeBorder: 'border-emerald-500 text-emerald-800 bg-emerald-50/90',
    headerBg: 'bg-emerald-600/10 text-emerald-900 border-emerald-300',
    nextButtonText: '→ Vouchers Issuance',
    checklistPool: [
      { id: 'h_pay_1', label: 'Final balance payment invoice generated and sent to traveler', mandatory: true },
      { id: 'h_pay_2', label: 'Balance payment received in full before voucher release', mandatory: true },
      { id: 'h_pay_3', label: 'Official full payment tax invoice issued', mandatory: true },
      { id: 'h_pay_4', label: 'Payment status marked COMPLETED in CRM', mandatory: true },
      { id: 'h_pay_5', label: 'Accounts reconciliation certificate issued', mandatory: false },
      { id: 'h_pay_6', label: 'Any optional excursions or upgrades added to bill', mandatory: false },
      { id: 'h_pay_7', label: 'Client receipt signed and confirmed', mandatory: true },
      { id: 'h_pay_8', label: 'Final ledger balance verified at zero', mandatory: true },
    ],
    requiredDocumentsPool: ['Final Full Tax Invoice', 'Payment Clearance Voucher'],
    milestonePaymentPercent: 100,
  },
  {
    poolId: 'POOL_H8_VOUCHERS',
    defaultTitle: 'Stage 8: Travel Vouchers & Concierge Setup',
    defaultShortTitle: 'Vouchers & Setup',
    defaultSubtitle: 'Flight e-tickets, hotel vouchers & WhatsApp concierge',
    colorBadge: 'bg-purple-700 text-white',
    badgeBorder: 'border-purple-500 text-purple-900 bg-purple-50/90',
    headerBg: 'bg-purple-600/10 text-purple-900 border-purple-300',
    nextButtonText: '→ Airport Arrival',
    checklistPool: [
      { id: 'h_vou_1', label: 'Comprehensive Travel Docket PDF compiled', mandatory: true },
      { id: 'h_vou_2', label: 'Flight e-tickets with web check-in guide included', mandatory: true },
      { id: 'h_vou_3', label: 'Hotel check-in vouchers with confirmation numbers attached', mandatory: true },
      { id: 'h_vou_4', label: 'Local sightseeing tour & transfer vouchers attached', mandatory: true },
      { id: 'h_vou_5', label: 'Airport pickup sign-board name & meeting point instructions shared', mandatory: true },
      { id: 'h_vou_6', label: '24/7 dedicated WhatsApp concierge support group created', mandatory: true },
      { id: 'h_vou_7', label: 'Emergency local coordinator phone numbers shared', mandatory: true },
      { id: 'h_vou_8', label: 'Packing advice, weather guide & local currency tips provided', mandatory: false },
      { id: 'h_vou_9', label: 'Travel documents dispatched to client email & WhatsApp', mandatory: true },
      { id: 'h_vou_10', label: 'Pre-departure briefing call conducted with travelers', mandatory: true },
    ],
    requiredDocumentsPool: ['Travel Docket PDF', 'Hotel Vouchers', 'Transfer Passes'],
    milestonePaymentPercent: 100,
  },
  {
    poolId: 'POOL_H9_ARRIVAL',
    defaultTitle: 'Stage 9: Airport Arrival & VIP Welcome',
    defaultShortTitle: 'Airport Arrival',
    defaultSubtitle: 'Destination arrival & on-ground private transfer',
    colorBadge: 'bg-orange-600 text-white',
    badgeBorder: 'border-orange-500 text-orange-800 bg-orange-50/90',
    headerBg: 'bg-orange-500/10 text-orange-900 border-orange-300',
    nextButtonText: '→ Tour In-Progress',
    checklistPool: [
      { id: 'h_arr_1', label: 'Flight landing time tracked in real-time', mandatory: true },
      { id: 'h_arr_2', label: 'Airport chauffeur at arrivals with name board confirmed', mandatory: true },
      { id: 'h_arr_3', label: 'Traveler successfully met by local representative', mandatory: true },
      { id: 'h_arr_4', label: 'Private transfer vehicle dispatched to hotel', mandatory: true },
      { id: 'h_arr_5', label: 'Hotel arrival & room check-in confirmed with front desk', mandatory: true },
      { id: 'h_arr_6', label: 'Welcome drinks & special amenities (honeymoon cake, fruits) verified', mandatory: false },
      { id: 'h_arr_7', label: 'Welcome message sent by CRM concierge', mandatory: true },
      { id: 'h_arr_8', label: 'Next day morning tour pickup time communicated', mandatory: true },
    ],
    requiredDocumentsPool: ['Arrival Confirmation Slip', 'Transfer Log'],
    milestonePaymentPercent: 100,
  },
  {
    poolId: 'POOL_H10_IN_PROGRESS',
    defaultTitle: 'Stage 10: Tour In-Progress & Concierge',
    defaultShortTitle: 'Tour In-Progress',
    defaultSubtitle: 'Daily sightseeing coordination & 24/7 care',
    colorBadge: 'bg-amber-600 text-white',
    badgeBorder: 'border-amber-500 text-amber-800 bg-amber-50/90',
    headerBg: 'bg-amber-500/10 text-amber-900 border-amber-300',
    nextButtonText: '→ Tour Completed',
    checklistPool: [
      { id: 'h_inp_1', label: 'Day 1 tour pickup & sightseeing completed smoothly', mandatory: true },
      { id: 'h_inp_2', label: 'Mid-trip satisfaction check-in call completed', mandatory: true },
      { id: 'h_inp_3', label: 'Hotel room comfort and food quality verified', mandatory: true },
      { id: 'h_inp_4', label: 'Any on-ground itinerary adjustments accommodated promptly', mandatory: false },
      { id: 'h_inp_5', label: 'Optional activity bookings (scuba, dinner cruise) arranged', mandatory: false },
      { id: 'h_inp_6', label: 'Guide and driver performance monitored', mandatory: false },
      { id: 'h_inp_7', label: 'Flight web check-in for return journey completed', mandatory: true },
      { id: 'h_inp_8', label: 'Hotel checkout & return airport transfer re-confirmed', mandatory: true },
      { id: 'h_inp_9', label: 'Traveler safety and well-being continuously tracked', mandatory: true },
      { id: 'h_inp_10', label: 'All service delivery milestones completed', mandatory: true },
    ],
    requiredDocumentsPool: ['Daily Activity Logs', 'Mid-Tour Check Record'],
    milestonePaymentPercent: 100,
  },
  {
    poolId: 'POOL_H11_COMPLETED',
    defaultTitle: 'Stage 11: Tour Completed & Review',
    defaultShortTitle: 'Completed',
    defaultSubtitle: 'Safe return, feedback & loyalty credits',
    colorBadge: 'bg-slate-700 text-white',
    badgeBorder: 'border-slate-500 text-slate-800 bg-slate-100',
    headerBg: 'bg-slate-200 text-slate-900 border-slate-300',
    nextButtonText: null,
    checklistPool: [
      { id: 'h_com_1', label: 'Traveler safe return arrival verified', mandatory: true },
      { id: 'h_com_2', label: 'Welcome home message and debrief conducted', mandatory: true },
      { id: 'h_com_3', label: 'Post-tour satisfaction survey & rating collected', mandatory: true },
      { id: 'h_com_4', label: 'Client photos / testimonial collected for gallery', mandatory: false },
      { id: 'h_com_5', label: 'Loyalty reward points credited to customer account', mandatory: false },
      { id: 'h_com_6', label: 'Referral incentive voucher issued to client', mandatory: false },
      { id: 'h_com_7', label: 'Accounting ledger closed and reconciled', mandatory: true },
      { id: 'h_com_8', label: 'Final case archive status marked COMPLETED', mandatory: true },
    ],
    requiredDocumentsPool: ['Customer Review Form', 'Final Reconciled Docket'],
    milestonePaymentPercent: 100,
  },
]

// ============================================================================
// 3. DEFAULT PRE-CONFIGURED TEMPLATES
// ============================================================================
export const DEFAULT_WORKFLOW_TEMPLATES = [
  // 1. VISA: Student Visa (Selects 7 stages from the 13 Master Pool stages)
  {
    id: 'tpl-visa-student',
    type: 'VISA',
    category: 'STUDENT_VISA',
    categoryName: 'Student Visa / Study Permit',
    name: 'Student Visa Master Workflow',
    description: 'Specialized 7-stage university admission and consular compliance pipeline selected from the 13 Master Stages.',
    isDefault: true,
    estimatedDays: '25-35 Days',
    defaultFee: 35000,
    createdAt: '2026-10-01',
    stages: [
      {
        id: 'STAGE_ACADEMIC_CAS',
        poolId: 'POOL_V3_ACADEMIC_CAS',
        stepNumber: 1,
        title: 'Stage 1: University Offer & CAS / I-20',
        shortTitle: 'University Offer',
        subtitle: 'Admissions unconditional offer & CAS verification',
        colorBadge: 'bg-indigo-600 text-white',
        badgeBorder: 'border-indigo-400 text-indigo-700 bg-indigo-50/90',
        headerBg: 'bg-indigo-500/10 text-indigo-900 border-indigo-300',
        nextStage: 'STAGE_FINANCIAL_PROOF',
        nextButtonText: '→ Financial Proof',
        checklist: [
          { id: 'v_aca_1', label: 'University unconditional admission offer letter verified', mandatory: true },
          { id: 'v_aca_2', label: 'Official CAS (UK) or I-20 (US) barcode slip issued & logged', mandatory: true },
          { id: 'v_aca_3', label: 'Academic transcripts & degree certificates verified', mandatory: true },
          { id: 'v_aca_4', label: 'English language proficiency test (IELTS / PTE / TOEFL) verified', mandatory: true },
          { id: 'v_aca_5', label: 'Statement of Purpose (SOP) & study justification reviewed', mandatory: true },
          { id: 'v_aca_6', label: 'University tuition fee advance deposit receipt confirmed', mandatory: false },
        ],
        requiredDocuments: ['CAS / I-20 Letter', 'Unconditional Offer', 'IELTS / PTE Scorecard'],
        milestonePaymentPercent: 25,
      },
      {
        id: 'STAGE_FINANCIAL_PROOF',
        poolId: 'POOL_V4_FINANCIAL',
        stepNumber: 2,
        title: 'Stage 2: Financial Proof & Sponsor Net-Worth',
        shortTitle: 'Financial Proof',
        subtitle: '28-day funds holding & sponsor affidavit check',
        colorBadge: 'bg-blue-600 text-white',
        badgeBorder: 'border-blue-400 text-blue-700 bg-blue-50/90',
        headerBg: 'bg-blue-500/10 text-blue-900 border-blue-300',
        nextStage: 'STAGE_PORTAL_FILING',
        nextButtonText: '→ Portal Filing',
        checklist: [
          { id: 'v_fin_1', label: '28-day continuous funds holding bank statement verified with bank seal', mandatory: true },
          { id: 'v_fin_2', label: 'Bank balance certificate with contact officer details attached', mandatory: true },
          { id: 'v_fin_3', label: 'Notarized sponsorship affidavit & relationship proof attached', mandatory: true },
          { id: 'v_fin_4', label: 'Sponsor ITR & Form 16 for past 3 financial years verified', mandatory: true },
          { id: 'v_fin_5', label: 'Chartered Accountant (CA) net-worth valuation report uploaded', mandatory: false },
        ],
        requiredDocuments: ['28-Day Bank Statement', 'Bank Balance Certificate', 'Sponsor Affidavit'],
        milestonePaymentPercent: 50,
      },
      {
        id: 'STAGE_PORTAL_FILING',
        poolId: 'POOL_V5_PORTAL_FILING',
        stepNumber: 3,
        title: 'Stage 3: Embassy Online Portal Filing',
        shortTitle: 'Portal Filing',
        subtitle: 'Official government online application submission',
        colorBadge: 'bg-purple-600 text-white',
        badgeBorder: 'border-purple-400 text-purple-700 bg-purple-50/90',
        headerBg: 'bg-purple-500/10 text-purple-900 border-purple-300',
        nextStage: 'STAGE_BIOMETRICS_MED',
        nextButtonText: '→ Biometrics/Med',
        checklist: [
          { id: 'v_por_1', label: 'Embassy online portal applicant account created & authenticated', mandatory: true },
          { id: 'v_por_2', label: 'Online visa application form (DS-160 / UKVI / ImmiAccount) completed', mandatory: true },
          { id: 'v_por_4', label: 'Government visa processing fee paid & receipt archived', mandatory: true },
          { id: 'v_por_5', label: 'Immigration Health Surcharge (IHS) payment receipt cleared', mandatory: true },
          { id: 'v_por_6', label: 'Application submission confirmation barcode slip generated', mandatory: true },
        ],
        requiredDocuments: ['Submitted Portal Form', 'Visa Fee Receipt', 'IHS Surcharge Receipt'],
        milestonePaymentPercent: 70,
      },
      {
        id: 'STAGE_BIOMETRICS_MED',
        poolId: 'POOL_V6_BIOMETRICS_MED',
        stepNumber: 4,
        title: 'Stage 4: VFS Biometrics & Medical Clearance',
        shortTitle: 'Biometrics & Med',
        subtitle: 'VAC appointment attended & panel physician clearance',
        colorBadge: 'bg-orange-500 text-white',
        badgeBorder: 'border-orange-400 text-orange-700 bg-orange-50/90',
        headerBg: 'bg-orange-500/10 text-orange-900 border-orange-300',
        nextStage: 'STAGE_MOCK_INTERVIEW',
        nextButtonText: '→ Mock Interview',
        checklist: [
          { id: 'v_bio_1', label: 'VFS / TLScontact / VAC appointment booked & confirmed', mandatory: true },
          { id: 'v_bio_3', label: 'Panel physician medical examination & chest X-ray scheduled', mandatory: true },
          { id: 'v_bio_4', label: 'Medical clearance certificate / TB screening cleared', mandatory: true },
          { id: 'v_bio_5', label: 'Applicant attended biometric appointment (Fingerprints & Iris scan)', mandatory: true },
          { id: 'v_bio_6', label: 'VAC submission token & tracking barcode received from applicant', mandatory: true },
        ],
        requiredDocuments: ['VFS Appointment Slip', 'Medical Clearance / TB Certificate'],
        milestonePaymentPercent: 80,
      },
      {
        id: 'STAGE_MOCK_INTERVIEW',
        poolId: 'POOL_V7_MOCK_INTERVIEW',
        stepNumber: 5,
        title: 'Stage 5: Consular Mock Interview Prep',
        shortTitle: 'Mock Interview',
        subtitle: 'Mock interviews, coaching & original document binder',
        colorBadge: 'bg-indigo-700 text-white',
        badgeBorder: 'border-indigo-500 text-indigo-800 bg-indigo-50/90',
        headerBg: 'bg-indigo-600/10 text-indigo-900 border-indigo-300',
        nextStage: 'STAGE_APPROVED',
        nextButtonText: '→ Visa Approved',
        checklist: [
          { id: 'v_moc_1', label: 'Consular interview date, time & consulate location verified', mandatory: true },
          { id: 'v_moc_2', label: 'Mock interview briefing dossier & question bank provided to applicant', mandatory: true },
          { id: 'v_moc_3', label: 'Mock interview round 1: Travel intent & study goals completed', mandatory: true },
          { id: 'v_moc_4', label: 'Mock interview round 2: Financial justification completed', mandatory: true },
          { id: 'v_moc_7', label: 'Original document binder organized in mandatory sequence', mandatory: true },
        ],
        requiredDocuments: ['Interview Appointment Slip', 'Mock Prep Dossier'],
        milestonePaymentPercent: 90,
      },
      {
        id: 'STAGE_APPROVED',
        poolId: 'POOL_V10_APPROVED',
        stepNumber: 6,
        title: 'Stage 6: Visa Approved & Vignette Stamped',
        shortTitle: 'Approved & Stamped',
        subtitle: 'Visa granted by embassy & passport stamped',
        colorBadge: 'bg-teal-600 text-white',
        badgeBorder: 'border-teal-500 text-teal-700 bg-teal-50/90',
        headerBg: 'bg-teal-500/10 text-teal-900 border-teal-300',
        nextStage: 'STAGE_PAYMENT',
        nextButtonText: '→ Final Settlement',
        checklist: [
          { id: 'v_app_1', label: 'Passport opened & official visa vignette / sticker verified', mandatory: true },
          { id: 'v_app_2', label: 'Visa category, applicant name & passport number cross-checked', mandatory: true },
          { id: 'v_app_3', label: 'Visa validity dates & permitted duration of stay verified', mandatory: true },
          { id: 'v_app_5', label: 'High-resolution color scan of stamped visa uploaded to CRM', mandatory: true },
          { id: 'v_app_7', label: 'Stamped passport handed over / dispatched with security seal', mandatory: true },
        ],
        requiredDocuments: ['Stamped Visa Copy', 'Embassy Grant Letter'],
        milestonePaymentPercent: 95,
      },
      {
        id: 'STAGE_PAYMENT',
        poolId: 'POOL_V11_PAYMENT',
        stepNumber: 7,
        title: 'Stage 7: Settlement & Briefing',
        shortTitle: 'Briefing & Settlement',
        subtitle: 'Pre-departure briefing & final fee invoice settlement',
        colorBadge: 'bg-emerald-600 text-white',
        badgeBorder: 'border-emerald-400 text-emerald-700 bg-emerald-50/90',
        headerBg: 'bg-emerald-500/10 text-emerald-900 border-emerald-300',
        nextStage: null,
        nextButtonText: null,
        checklist: [
          { id: 'v_pay_1', label: 'Final consulting success fee calculated according to agreement', mandatory: true },
          { id: 'v_pay_2', label: 'Official GST tax invoice generated and dispatched to client', mandatory: true },
          { id: 'v_pay_3', label: 'Client payment received via bank transfer / UPI / card', mandatory: true },
          { id: 'v_pay_8', label: 'Zero balance clearance certificate generated', mandatory: true },
        ],
        requiredDocuments: ['Official Tax Invoice', 'Final Payment Receipt'],
        milestonePaymentPercent: 100,
      },
    ],
  },

  // 2. VISA: Tourist / Visitor Visa (Selects 5 stages from Master Pool)
  {
    id: 'tpl-visa-tourist',
    type: 'VISA',
    category: 'TOURIST_VISITOR',
    categoryName: 'Tourist / Visitor Visa',
    name: 'Tourist & Visitor Visa Standard Workflow',
    description: 'Fast 5-stage consular processing pipeline selected from Master Stages for tourist, family visit & holiday visas.',
    isDefault: true,
    estimatedDays: '10-15 Days',
    defaultFee: 22000,
    createdAt: '2026-10-01',
    stages: [
      {
        id: 'STAGE_DOCS_VERIF',
        poolId: 'POOL_V2_DOCS',
        stepNumber: 1,
        title: 'Stage 1: Documents Collection & Verification',
        shortTitle: 'Docs Verified',
        subtitle: 'Passports, employment & bank statements verification',
        colorBadge: 'bg-indigo-600 text-white',
        badgeBorder: 'border-indigo-400 text-indigo-700 bg-indigo-50/90',
        headerBg: 'bg-indigo-500/10 text-indigo-900 border-indigo-300',
        nextStage: 'STAGE_PORTAL_FILING',
        nextButtonText: '→ Portal Filing',
        checklist: [
          { id: 'v_doc_1', label: 'Original passport physical inspection completed', mandatory: true },
          { id: 'v_doc_2', label: 'National ID / Aadhaar card / Voter ID verified', mandatory: true },
          { id: 'v_doc_3', label: 'Passport-size photographs matching embassy specs received', mandatory: true },
          { id: 'v_doc_4', label: 'Employment verification letter / Business registration verified', mandatory: true },
          { id: 'v_doc_5', label: 'Salary slips & Income Tax Returns (ITR) for last 3 years checked', mandatory: true },
          { id: 'v_doc_8', label: 'Official cover letter outlining itinerary and purpose drafted', mandatory: true },
        ],
        requiredDocuments: ['Passport Photos', 'National ID', 'Employment Letter', 'ITR 3 Years', 'Cover Letter'],
        milestonePaymentPercent: 30,
      },
      {
        id: 'STAGE_PORTAL_FILING',
        poolId: 'POOL_V5_PORTAL_FILING',
        stepNumber: 2,
        title: 'Stage 2: Embassy Portal Filing',
        shortTitle: 'Portal Filing',
        subtitle: 'Online submission & embassy visa fee payment',
        colorBadge: 'bg-purple-600 text-white',
        badgeBorder: 'border-purple-400 text-purple-700 bg-purple-50/90',
        headerBg: 'bg-purple-500/10 text-purple-900 border-purple-300',
        nextStage: 'STAGE_BIOMETRICS_MED',
        nextButtonText: '→ Biometrics',
        checklist: [
          { id: 'v_por_2', label: 'Online visa application form completed', mandatory: true },
          { id: 'v_por_3', label: 'Digital document uploads completed', mandatory: true },
          { id: 'v_por_4', label: 'Government visa processing fee paid & receipt archived', mandatory: true },
          { id: 'v_por_6', label: 'Application submission confirmation barcode slip generated', mandatory: true },
        ],
        requiredDocuments: ['Submitted Portal Form', 'Visa Fee Receipt'],
        milestonePaymentPercent: 60,
      },
      {
        id: 'STAGE_BIOMETRICS_MED',
        poolId: 'POOL_V6_BIOMETRICS_MED',
        stepNumber: 3,
        title: 'Stage 3: VFS Biometrics & Submission',
        shortTitle: 'Biometrics',
        subtitle: 'VAC appointment attended & passport submitted',
        colorBadge: 'bg-orange-500 text-white',
        badgeBorder: 'border-orange-400 text-orange-700 bg-orange-50/90',
        headerBg: 'bg-orange-500/10 text-orange-900 border-orange-300',
        nextStage: 'STAGE_APPROVED',
        nextButtonText: '→ Visa Approved',
        checklist: [
          { id: 'v_bio_1', label: 'VFS / VAC appointment booked & confirmed', mandatory: true },
          { id: 'v_bio_5', label: 'Applicant attended biometric appointment (Fingerprints & Iris scan)', mandatory: true },
          { id: 'v_bio_6', label: 'VAC submission token & tracking barcode received from applicant', mandatory: true },
        ],
        requiredDocuments: ['VFS Appointment Slip', 'VAC Submission Token'],
        milestonePaymentPercent: 80,
      },
      {
        id: 'STAGE_APPROVED',
        poolId: 'POOL_V10_APPROVED',
        stepNumber: 4,
        title: 'Stage 4: Visa Approved & Stamped',
        shortTitle: 'Approved & Stamped',
        subtitle: 'Visa grant letter verified & passport stamped',
        colorBadge: 'bg-teal-600 text-white',
        badgeBorder: 'border-teal-500 text-teal-700 bg-teal-50/90',
        headerBg: 'bg-teal-500/10 text-teal-900 border-teal-300',
        nextStage: 'STAGE_PAYMENT',
        nextButtonText: '→ Final Settlement',
        checklist: [
          { id: 'v_app_1', label: 'Passport opened & official visa vignette / sticker verified', mandatory: true },
          { id: 'v_app_2', label: 'Visa category, applicant name & passport number cross-checked', mandatory: true },
          { id: 'v_app_3', label: 'Visa validity dates & permitted duration of stay verified', mandatory: true },
          { id: 'v_app_5', label: 'High-resolution color scan of stamped visa uploaded to CRM', mandatory: true },
        ],
        requiredDocuments: ['Stamped Visa Copy'],
        milestonePaymentPercent: 90,
      },
      {
        id: 'STAGE_PAYMENT',
        poolId: 'POOL_V11_PAYMENT',
        stepNumber: 5,
        title: 'Stage 5: Final Settlement & Handover',
        shortTitle: 'Final Settlement',
        subtitle: 'Invoice balance settled & passport delivered',
        colorBadge: 'bg-emerald-600 text-white',
        badgeBorder: 'border-emerald-400 text-emerald-700 bg-emerald-50/90',
        headerBg: 'bg-emerald-500/10 text-emerald-900 border-emerald-300',
        nextStage: null,
        nextButtonText: null,
        checklist: [
          { id: 'v_pay_1', label: 'Final consulting success fee calculated according to agreement', mandatory: true },
          { id: 'v_pay_2', label: 'Official GST tax invoice generated and dispatched to client', mandatory: true },
          { id: 'v_pay_3', label: 'Client payment received via bank transfer / UPI / card', mandatory: true },
          { id: 'v_app_7', label: 'Stamped passport handed over / dispatched with security seal', mandatory: true },
        ],
        requiredDocuments: ['Official Tax Invoice', 'Handover Receipt'],
        milestonePaymentPercent: 100,
      },
    ],
  },

  // 3. HOLIDAY: International Luxury Tour (Selects 6 stages from the 11 Master Pool stages)
  {
    id: 'tpl-holiday-luxury',
    type: 'HOLIDAY',
    category: 'INTERNATIONAL_LUXURY',
    categoryName: 'International Luxury Tour',
    name: 'International Luxury Tour Master Workflow',
    description: 'High-touch 6-stage concierge workflow selected from Master Stages for international bespoke packages and villas.',
    isDefault: true,
    estimatedDays: '7-10 Days',
    defaultFee: 185000,
    createdAt: '2026-10-01',
    stages: [
      {
        id: 'STAGE_HOL_INTAKE',
        poolId: 'POOL_H1_INTAKE',
        stepNumber: 1,
        title: 'Stage 1: Lead Converted & Consultation',
        shortTitle: 'Consultation',
        subtitle: 'Travel dates, passenger count & budget consultation',
        colorBadge: 'bg-indigo-600 text-white',
        badgeBorder: 'border-indigo-400 text-indigo-700 bg-indigo-50/90',
        headerBg: 'bg-indigo-500/10 text-indigo-900 border-indigo-300',
        nextStage: 'STAGE_HOL_HOLDS',
        nextButtonText: '→ Flights/Resort Holds',
        checklist: [
          { id: 'h_int_1', label: 'Lead conversion verified and primary traveler profile created', mandatory: true },
          { id: 'h_int_2', label: 'Destination preference, travel dates & total PAX count confirmed', mandatory: true },
          { id: 'h_int_4', label: 'Accommodation preference (luxury villa, all-inclusive) noted', mandatory: true },
          { id: 'h_int_7', label: 'Passport validity checked (min 6 months from travel date)', mandatory: true },
        ],
        requiredDocuments: ['Primary Contact Details'],
        milestonePaymentPercent: 20,
      },
      {
        id: 'STAGE_HOL_HOLDS',
        poolId: 'POOL_H3_HOLDS',
        stepNumber: 2,
        title: 'Stage 2: Flights & Resort Holds',
        shortTitle: 'Flights & Holds',
        subtitle: 'Business class seats held & resort contract confirmed',
        colorBadge: 'bg-blue-600 text-white',
        badgeBorder: 'border-blue-400 text-blue-700 bg-blue-50/90',
        headerBg: 'bg-blue-500/10 text-blue-900 border-blue-300',
        nextStage: 'STAGE_HOL_ADVANCE',
        nextButtonText: '→ Advance Deposit',
        checklist: [
          { id: 'h_hld_1', label: 'International airline PNRs placed on hold with fare guarantee', mandatory: true },
          { id: 'h_hld_2', label: 'Hotel room reservations placed on confirmed hold', mandatory: true },
          { id: 'h_hld_4', label: 'Specific room category (Overwater villa / Suite) confirmed', mandatory: true },
          { id: 'h_hld_7', label: 'Ground handling partner notified of traveler arrival dates', mandatory: true },
        ],
        requiredDocuments: ['Airline PNR Holds', 'Hotel Room Hold Confirmation'],
        milestonePaymentPercent: 40,
      },
      {
        id: 'STAGE_HOL_ADVANCE',
        poolId: 'POOL_H4_ADVANCE_PAY',
        stepNumber: 3,
        title: 'Stage 3: Advance Deposit & Billing',
        shortTitle: 'Advance Deposit',
        subtitle: '50% advance package deposit collection & tax invoice',
        colorBadge: 'bg-emerald-600 text-white',
        badgeBorder: 'border-emerald-400 text-emerald-700 bg-emerald-50/90',
        headerBg: 'bg-emerald-500/10 text-emerald-900 border-emerald-300',
        nextStage: 'STAGE_HOL_VOUCHERS',
        nextButtonText: '→ Vouchers & Setup',
        checklist: [
          { id: 'h_adv_1', label: 'Advance deposit invoice generated and sent to client', mandatory: true },
          { id: 'h_adv_2', label: 'Advance deposit payment received in company bank account', mandatory: true },
          { id: 'h_adv_3', label: 'Official tax invoice with GST breakdown issued', mandatory: true },
          { id: 'h_adv_4', label: 'Official advance payment receipt shared with customer', mandatory: true },
        ],
        requiredDocuments: ['Official Tax Invoice', 'Advance Payment Receipt'],
        milestonePaymentPercent: 70,
      },
      {
        id: 'STAGE_HOL_VOUCHERS',
        poolId: 'POOL_H8_VOUCHERS',
        stepNumber: 4,
        title: 'Stage 4: Travel Vouchers & Concierge Setup',
        shortTitle: 'Vouchers & Setup',
        subtitle: 'Flight e-tickets, hotel vouchers & WhatsApp concierge connected',
        colorBadge: 'bg-purple-600 text-white',
        badgeBorder: 'border-purple-400 text-purple-700 bg-purple-50/90',
        headerBg: 'bg-purple-500/10 text-purple-900 border-purple-300',
        nextStage: 'STAGE_HOL_IN_PROGRESS',
        nextButtonText: '→ Tour In-Progress',
        checklist: [
          { id: 'h_vou_1', label: 'Comprehensive Travel Docket PDF compiled', mandatory: true },
          { id: 'h_vou_2', label: 'Flight e-tickets with web check-in guide included', mandatory: true },
          { id: 'h_vou_3', label: 'Hotel check-in vouchers with confirmation numbers attached', mandatory: true },
          { id: 'h_vou_6', label: '24/7 dedicated WhatsApp concierge support group created', mandatory: true },
          { id: 'h_vou_9', label: 'Travel documents dispatched to client email & WhatsApp', mandatory: true },
          { id: 'h_vou_10', label: 'Pre-departure briefing call conducted with travelers', mandatory: true },
        ],
        requiredDocuments: ['Travel Docket PDF', 'Hotel Vouchers', 'Transfer Passes'],
        milestonePaymentPercent: 100,
      },
      {
        id: 'STAGE_HOL_IN_PROGRESS',
        poolId: 'POOL_H10_IN_PROGRESS',
        stepNumber: 5,
        title: 'Stage 5: Tour In-Progress & Concierge',
        shortTitle: 'Tour In-Progress',
        subtitle: 'Daily sightseeing coordination & 24/7 on-ground assistance',
        colorBadge: 'bg-orange-500 text-white',
        badgeBorder: 'border-orange-400 text-orange-700 bg-orange-50/90',
        headerBg: 'bg-orange-500/10 text-orange-900 border-orange-300',
        nextStage: 'STAGE_HOL_COMPLETED',
        nextButtonText: '→ Tour Completed',
        checklist: [
          { id: 'h_inp_1', label: 'Day 1 tour pickup & sightseeing completed smoothly', mandatory: true },
          { id: 'h_inp_2', label: 'Mid-trip satisfaction check-in call completed', mandatory: true },
          { id: 'h_inp_3', label: 'Hotel room comfort and food quality verified', mandatory: true },
          { id: 'h_inp_7', label: 'Flight web check-in for return journey completed', mandatory: true },
        ],
        requiredDocuments: ['Daily Activity Logs'],
        milestonePaymentPercent: 100,
      },
      {
        id: 'STAGE_HOL_COMPLETED',
        poolId: 'POOL_H11_COMPLETED',
        stepNumber: 6,
        title: 'Stage 6: Tour Completed & Review',
        shortTitle: 'Completed',
        subtitle: 'Safe return verified & customer satisfaction review',
        colorBadge: 'bg-slate-700 text-white',
        badgeBorder: 'border-slate-400 text-slate-800 bg-slate-100',
        headerBg: 'bg-slate-200 text-slate-900 border-slate-300',
        nextStage: null,
        nextButtonText: null,
        checklist: [
          { id: 'h_com_1', label: 'Traveler safe return arrival verified', mandatory: true },
          { id: 'h_com_2', label: 'Welcome home message and debrief conducted', mandatory: true },
          { id: 'h_com_3', label: 'Post-tour satisfaction survey & rating collected', mandatory: true },
          { id: 'h_com_5', label: 'Loyalty reward points credited to customer account', mandatory: false },
        ],
        requiredDocuments: ['Customer Review Form'],
        milestonePaymentPercent: 100,
      },
    ],
  },
]

class MasterWorkflowTemplatesService {
  constructor() {
    this.ensureInitialized()
  }

  ensureInitialized() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_WORKFLOW_TEMPLATES)
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_WORKFLOW_TEMPLATES, JSON.stringify(DEFAULT_WORKFLOW_TEMPLATES))
      }
    } catch (e) {
      console.warn('Unable to access localStorage for workflow templates:', e)
    }
  }

  getMasterStagesPool(type = 'VISA') {
    return type === 'VISA' ? MASTER_VISA_STAGES_POOL : MASTER_HOLIDAY_STAGES_POOL
  }

  getTemplates(type = null) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_WORKFLOW_TEMPLATES)
      const list = raw ? JSON.parse(raw) : DEFAULT_WORKFLOW_TEMPLATES
      if (type) {
        return list.filter((t) => t.type === type)
      }
      return list
    } catch (e) {
      return DEFAULT_WORKFLOW_TEMPLATES.filter((t) => !type || t.type === type)
    }
  }

  getTemplateById(id) {
    const list = this.getTemplates()
    return list.find((t) => t.id === id) || null
  }

  getTemplateByCategory(type, category) {
    const list = this.getTemplates(type)
    return list.find((t) => t.category === category) || list.find((t) => t.isDefault) || list[0]
  }

  getCategories(type) {
    return type === 'VISA' ? VISA_CATEGORIES : HOLIDAY_CATEGORIES
  }

  saveTemplates(templates) {
    try {
      localStorage.setItem(STORAGE_KEY_WORKFLOW_TEMPLATES, JSON.stringify(templates))
      return true
    } catch (e) {
      console.error('Failed to save workflow templates:', e)
      return false
    }
  }

  upsertTemplate(templateData) {
    const list = this.getTemplates()
    const id = templateData.id || `tpl-${templateData.type.toLowerCase()}-${Date.now()}`
    const existingIndex = list.findIndex((t) => t.id === id)

    const templateToSave = {
      ...templateData,
      id,
      updatedAt: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      list[existingIndex] = templateToSave
    } else {
      list.push(templateToSave)
    }

    this.saveTemplates(list)
    return templateToSave
  }

  deleteTemplate(id) {
    const list = this.getTemplates()
    const filtered = list.filter((t) => t.id !== id)
    this.saveTemplates(filtered)
    return filtered
  }

  duplicateTemplate(id) {
    const target = this.getTemplateById(id)
    if (!target) return null

    const copy = {
      ...JSON.parse(JSON.stringify(target)),
      id: `tpl-${target.type.toLowerCase()}-${Date.now()}`,
      name: `${target.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString().split('T')[0],
    }

    return this.upsertTemplate(copy)
  }

  resetToDefaults() {
    this.saveTemplates(DEFAULT_WORKFLOW_TEMPLATES)
    return DEFAULT_WORKFLOW_TEMPLATES
  }

  /**
   * Helper: Resolves the dynamic stages array for any given Case.
   * If case has its own saved stages, returns them.
   * If case has a templateId, resolves template stages.
   * Otherwise falls back to system defaults.
   */
  getStagesForCase(caseItem, caseType = null) {
    if (!caseItem) return []

    // 1. Case already has custom stages assigned directly
    if (Array.isArray(caseItem.stages) && caseItem.stages.length > 0) {
      return caseItem.stages
    }

    // 2. Case has a templateId attached
    if (caseItem.templateId) {
      const tpl = this.getTemplateById(caseItem.templateId)
      if (tpl && Array.isArray(tpl.stages) && tpl.stages.length > 0) {
        return tpl.stages
      }
    }

    // 3. Match by category / visaType / packageName
    const isVisa =
      caseType === 'VISA' ||
      (caseType !== 'HOLIDAY' &&
        (caseItem.applicationType === 'VISA' ||
          Boolean(caseItem.visaType) ||
          String(caseItem.id || '').startsWith('VISA') ||
          (String(caseItem.id || '').startsWith('APP-') && !caseItem.packageName)))

    if (isVisa) {
      const categoryMatch = this.getTemplates('VISA').find(
        (t) =>
          t.category === caseItem.category ||
          t.name.toLowerCase().includes((caseItem.visaType || '').toLowerCase()) ||
          t.categoryName.toLowerCase().includes((caseItem.visaType || '').toLowerCase())
      )
      return categoryMatch?.stages || VISA_STAGES
    } else {
      const categoryMatch = this.getTemplates('HOLIDAY').find(
        (t) =>
          t.category === caseItem.category ||
          t.name.toLowerCase().includes((caseItem.packageName || '').toLowerCase())
      )
      return categoryMatch?.stages || HOLIDAY_STAGES
    }
  }
}

export const masterWorkflowTemplatesService = new MasterWorkflowTemplatesService()
export default masterWorkflowTemplatesService
