import React, { useState, useEffect } from 'react'
import { VISA_STAGES } from '../../services/visaCases'
import { HOLIDAY_STAGES } from '../../services/holidayCases'
import AddPaymentModal from '../Modal/AddPaymentModal.component'
import {
  downloadApplicationDossier,
  downloadInvoice,
  downloadVisaDocument,
} from '../../utils/documentGenerators'

/**
 * Format currency in Indian Rupees (INR)
 */
const formatINR = (val) => {
  if (val === undefined || val === null) return '₹0'
  return `₹${Number(val).toLocaleString('en-IN')}`
}

/**
 * ============================================================================
 * CaseDetailsSideDrawer Component
 * ============================================================================
 * The single, unified slide-over Side Sheet & Details drawer used across:
 *  1. Visa Cases Page (/visas)
 *  2. Holiday Cases Page (/holidays)
 *  3. Company Applications Tab (/companies)
 *  4. Traveller Applications Tab (/travellers)
 *
 * HOW TO CUSTOMIZE MANUALLY (NO AI NEEDED):
 *  - Header & Top Actions: See [SECTION 0: HEADER & DOSSIER BUTTON]
 *  - Validation Alerts: See [SECTION 0b: VALIDATION ALERT]
 *  - Stage Checklist: See [SECTION 1: STAGE CHECKLIST & MANDATORY RULE]
 *  - Applicant / Booking Info: See [SECTION 2: PRIMARY INFO (VISA / HOLIDAY)]
 *  - Visa / Customer Info: See [SECTION 3: SECONDARY INFO (VISA / HOLIDAY)]
 *  - Payment Summary & Invoicing: See [SECTION 4: PAYMENT SUMMARY & INVOICE]
 *  - Visa Stamped Document (Upload/View/Download): See [SECTION 4b: VISA DOCUMENT ACTIONS]
 *  - Advance Stage & Reject/Cancel Buttons: See [SECTION 5: ADVANCE STAGE ACTIONS]
 *  - Full Case Details Modal Trigger: See [SECTION 6: VIEW FULL CASE DETAILS]
 * ============================================================================
 */
export const CaseDetailsSideDrawer = ({
  isOpen,
  onClose,
  caseItem,
  caseType, // 'VISA' | 'HOLIDAY' (auto-detected if omitted)
  onAdvanceStage, // (caseItem, targetStageId, notes, completedChecks) => void
  onRecordPayment, // (caseItem, paymentData) => void
  onToggleChecklist, // Optional: (caseId, checkId, checked) => void
  onViewFullDetails, // Optional: (caseItem) => void
  drawerAlert: externalAlert = '', // Optional external alert message
}) => {
  // 1. Detect whether this is a Visa or Holiday case
  const isVisa =
    caseType === 'VISA' ||
    (caseType !== 'HOLIDAY' &&
      (caseItem?.applicationType === 'VISA' ||
        Boolean(caseItem?.visaType) ||
        String(caseItem?.id || '').startsWith('VISA') ||
        (String(caseItem?.id || '').startsWith('APP-') && !caseItem?.packageName)))

  const stages = caseItem?.stages || (isVisa ? VISA_STAGES : HOLIDAY_STAGES)

  // 2. Normalize raw stage to stage definition
  const rawStage = (caseItem?.stage || caseItem?.status || '').toUpperCase().replace(/[\s-]/g, '_')
  const currentStageDef =
    stages.find(
      (s) =>
        s.id === rawStage ||
        s.shortTitle?.toUpperCase() === rawStage ||
        s.title?.toUpperCase().includes(rawStage)
    ) || stages[0]

  // 3. Local state
  const [completedChecks, setCompletedChecks] = useState({})
  const [localAlert, setLocalAlert] = useState('')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [visaDocUploaded, setVisaDocUploaded] = useState(false)

  // Sync state whenever active case changes
  useEffect(() => {
    if (caseItem) {
      setCompletedChecks(caseItem.completedChecklists || {})
      setLocalAlert('')
      setVisaDocUploaded(Boolean(caseItem.visaDocUploaded || caseItem.visaDocument))
    }
  }, [caseItem, currentStageDef])

  if (!isOpen || !caseItem) return null

  const displayAlert = localAlert || externalAlert

  // Toggle checklist checkbox
  const handleToggleCheck = (checkId, checked) => {
    setCompletedChecks((prev) => ({
      ...prev,
      [checkId]: checked,
    }))
    setLocalAlert('')
    if (onToggleChecklist) {
      onToggleChecklist(caseItem.id, checkId, checked)
    }
  }

  // Handle Advance Stage with mandatory validation
  const handleMoveToNext = (targetStageId) => {
    if (!targetStageId) return

    // Verify mandatory checklists for current stage
    const uncompletedMandatory = (currentStageDef.checklist || []).filter(
      (chk) => chk.mandatory && !completedChecks[chk.id]
    )

    if (uncompletedMandatory.length > 0) {
      setLocalAlert(
        `Cannot advance to ${targetStageId}: Please complete all mandatory checklist items (${uncompletedMandatory
          .map((c) => c.label)
          .join(', ')}) first.`
      )
      return
    }

    if (onAdvanceStage) {
      const result = onAdvanceStage(caseItem, targetStageId, caseItem.notes, completedChecks)
      if (result && result.success === false) {
        setLocalAlert(result.error || 'Failed to advance stage')
        return
      }
    }
    onClose?.()
  }

  // Handle Mark as Rejected / Cancelled
  const handleRejectOrCancel = () => {
    const targetStage = isVisa ? 'REJECTED' : 'CANCELLED'
    if (onAdvanceStage) {
      const result = onAdvanceStage(
        caseItem,
        targetStage,
        'Marked by user from side sheet',
        completedChecks
      )
      if (result && result.success === false) {
        setLocalAlert(result.error || 'Failed to update stage')
        return
      }
    }
    onClose?.()
  }

  // Common extracted fields
  const applicantName =
    caseItem.applicant || caseItem.applicantName || caseItem.customer || 'Applicant'
  const caseId = caseItem.id || (isVisa ? 'VISA-301' : 'PKG-701')
  const phone = caseItem.phone || '+91 98200 11223'
  const email = caseItem.email || 'customer@example.com'
  const passport = caseItem.passport || 'P9847291'
  const passportExp = caseItem.passportExp || caseItem.expiry || '2029-08-20'
  const appliedDate =
    caseItem.appliedDate || caseItem.applicationDate || caseItem.bookingDate || '2026-10-01'
  const country = caseItem.country || caseItem.destination || 'United States'
  const visaOrPkgType =
    caseItem.visaType || caseItem.serviceRequired || caseItem.packageName || 'Standard Visitor'
  const officer = caseItem.officer || caseItem.assignedOfficer || 'Amit Verma (CO-101)'
  const officerId = caseItem.officerId || 'CO-101'
  const docStatus =
    caseItem.docStatus ||
    (caseItem.status ? String(caseItem.status).replace(/_/g, ' ') : 'DOCS VERIFIED')

  // Amounts & Payment
  const totalAmount =
    caseItem.amount !== undefined
      ? caseItem.amount
      : caseItem.price !== undefined
      ? caseItem.price
      : isVisa
      ? 24000
      : 85000
  const paidAmount =
    caseItem.paidAmount !== undefined
      ? caseItem.paidAmount
      : caseItem.paymentStatus === 'COMPLETED' || caseItem.paymentStatus === 'PAID'
      ? totalAmount
      : 0
  const pendingAmount = Math.max(0, Number(totalAmount) - Number(paidAmount))
  const paymentType =
    caseItem.paymentType || (paidAmount === totalAmount ? 'Prepaid' : 'Postpaid')
  const paymentStatus =
    caseItem.paymentStatus ||
    (paidAmount === totalAmount ? 'COMPLETED' : paidAmount > 0 ? 'PARTIAL' : 'PENDING')
  const txnId = caseItem.txnId || caseItem.invoiceRef || 'TXN-998250'

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      />

      {/* Slide-over Sheet (Right aligned, max-w-lg) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* ----------------------------------------------------------- */}
          {/* [SECTION 0: HEADER & DOSSIER BUTTON]                        */}
          {/* ----------------------------------------------------------- */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-white shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                  {isVisa ? applicantName : caseItem.packageName || applicantName}
                </h3>
                <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                  {isVisa ? caseId : `${caseId} • Customer: ${applicantName}`}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>✕</span> Close
              </button>
            </div>

            {/* Download Application Dossier Button */}
            <button
              type="button"
              onClick={() => downloadApplicationDossier(caseItem, isVisa ? 'visa' : 'holiday')}
              className="mt-2.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-[11px] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>📄</span>
              <span>Download Application Dossier</span>
            </button>
          </div>

          {/* ----------------------------------------------------------- */}
          {/* SCROLLABLE DRAWER BODY                                      */}
          {/* ----------------------------------------------------------- */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5 text-xs">
            {/* [SECTION 0b: VALIDATION ALERT] */}
            {displayAlert && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2 animate-in fade-in duration-150">
                <span className="text-rose-600 font-bold text-sm">⚠</span>
                <span>{displayAlert}</span>
              </div>
            )}

            {/* --------------------------------------------------------- */}
            {/* [SECTION 1: STAGE CHECKLIST & MANDATORY RULE]             */}
            {/* --------------------------------------------------------- */}
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
                {currentStageDef.checklist && currentStageDef.checklist.length > 0 ? (
                  currentStageDef.checklist.map((chk) => {
                    const isChecked = Boolean(completedChecks[chk.id])

                    return (
                      <label
                        key={chk.id}
                        className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200/90 hover:border-slate-300 transition-colors cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleToggleCheck(chk.id, e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 mt-0.5 cursor-pointer"
                        />
                        <span
                          className={`flex-1 text-xs font-medium leading-snug ${
                            isChecked ? 'text-slate-900 line-through/10 font-bold' : 'text-slate-700'
                          }`}
                        >
                          {chk.label}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                            chk.mandatory
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {chk.mandatory ? 'Mandatory' : 'Optional'}
                        </span>
                      </label>
                    )
                  })
                ) : (
                  <p className="text-slate-400 text-center py-2 text-[11px] italic">
                    No checklist items defined for this stage.
                  </p>
                )}
              </div>

              {/* Stage Required Documents Tags (if defined in master template) */}
              {Array.isArray(currentStageDef.requiredDocuments) && currentStageDef.requiredDocuments.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                    <span>📑</span> Required Documents for this Stage:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentStageDef.requiredDocuments.map((doc, dIdx) => (
                      <span
                        key={dIdx}
                        className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-semibold"
                      >
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* --------------------------------------------------------- */}
            {/* [SECTION 2: PRIMARY INFO (VISA / HOLIDAY)]                */}
            {/* --------------------------------------------------------- */}
            {isVisa ? (
              /* Visa: Applicant Information */
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                  Applicant Information
                </h4>
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Applicant Name</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{applicantName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Case ID</p>
                    <p className="text-xs font-mono font-bold text-slate-900 mt-0.5">{caseId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Phone</p>
                    <p className="text-xs font-medium text-slate-800 mt-0.5">{phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Email</p>
                    <p className="text-xs font-medium text-slate-800 mt-0.5 truncate">{email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Passport</p>
                    <p className="text-xs font-mono font-semibold text-slate-800 mt-0.5">
                      {passport} (Exp: {passportExp})
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Application Date</p>
                    <p className="text-xs font-mono font-semibold text-slate-800 mt-0.5">{appliedDate}</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Holiday: Booking & Package Information */
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                  Booking & Package Information
                </h4>
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Package ID</p>
                    <p className="text-xs font-mono font-bold text-slate-900 mt-0.5">{caseId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Destination</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{country}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
                    <p className="text-xs font-medium text-slate-800 mt-0.5">
                      {caseItem.duration || '8 Days / 7 Nights'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Departure Date</p>
                    <p className="text-xs font-mono font-semibold text-slate-800 mt-0.5">
                      {caseItem.departureDate || caseItem.travelDate || '2026-12-01'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Booking Date</p>
                    <p className="text-xs font-mono font-semibold text-slate-800 mt-0.5">{appliedDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Case Officer</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">
                      {officer} ({officerId})
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------- */}
            {/* [SECTION 3: SECONDARY INFO (VISA / HOLIDAY)]              */}
            {/* --------------------------------------------------------- */}
            {isVisa ? (
              /* Visa: Visa Details */
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                  Visa Details
                </h4>
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Target Country</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{country}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Visa Type</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{visaOrPkgType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Case Officer</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{officer}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Officer ID</p>
                    <p className="text-xs font-mono font-semibold text-slate-800 mt-0.5">{officerId}</p>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Document Status</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-300 text-blue-700 bg-blue-50">
                      {docStatus}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Holiday: Customer Details */
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                  Customer Details
                </h4>
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Customer Name</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{applicantName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Contact Phone</p>
                    <p className="text-xs font-medium text-slate-800 mt-0.5">{phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Email</p>
                    <p className="text-xs font-medium text-slate-800 mt-0.5 truncate">{email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Invoice Ref</p>
                    <p className="text-xs font-mono font-semibold text-slate-800 mt-0.5">{txnId}</p>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------- */}
            {/* [SECTION 4: PAYMENT SUMMARY & INVOICE]                     */}
            {/* --------------------------------------------------------- */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                  {isVisa ? 'Payment Summary' : 'Payment Overview'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>+</span>
                  <span>Add Payment</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <p className="text-[9px] uppercase font-bold text-slate-400">
                      {isVisa ? 'Total Fee' : 'Total Price'}
                    </p>
                    <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
                      {formatINR(totalAmount)}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-center">
                    <p className="text-[9px] uppercase font-bold text-emerald-700">Paid</p>
                    <p className="text-xs sm:text-sm font-black text-emerald-700 mt-0.5">
                      {formatINR(paidAmount)}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 text-center">
                    <p className="text-[9px] uppercase font-bold text-rose-700">Pending</p>
                    <p className="text-xs sm:text-sm font-black text-rose-700 mt-0.5">
                      {formatINR(pendingAmount)}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between pt-1 border-t border-slate-100 flex-wrap gap-1">
                  <span>
                    Type: <strong className="text-slate-800">{paymentType}</strong>
                  </span>
                  <span>
                    Status:{' '}
                    <strong className="text-slate-800">
                      {String(paymentStatus).replace(/_/g, ' ')}
                    </strong>
                  </span>
                  <span className="font-mono text-[10px]">Ref: {txnId}</span>
                </div>

                {/* Download Invoice Button */}
                <button
                  type="button"
                  onClick={() => downloadInvoice(caseItem, isVisa ? 'visa' : 'holiday')}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white font-bold text-[10px] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🧾</span>
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>

            {/* --------------------------------------------------------- */}
            {/* [SECTION 4b: VISA DOCUMENT ACTIONS] (only for Visa)        */}
            {/* --------------------------------------------------------- */}
            {isVisa && (() => {
              const stageOrder = [
                'UNDER_REVIEW',
                'DOCS_VERIFIED',
                'SUBMITTED',
                'PROCESSING',
                'INTERVIEW',
                'APPROVED',
                'PAYMENT',
              ]
              const currentIdx = stageOrder.indexOf(currentStageDef.id)
              const paymentIdx = stageOrder.indexOf('PAYMENT')
              const isAfterPayment = currentIdx >= paymentIdx || rawStage === 'PAYMENT'

              if (!isAfterPayment) return null

              return (
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                    📋 Visa Document
                  </h4>
                  <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          visaDocUploaded ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                      <span className="text-xs font-semibold text-slate-700">
                        {visaDocUploaded
                          ? 'Visa Document Uploaded'
                          : 'No visa document uploaded yet'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Upload Visa */}
                      <label className="flex-1 py-2 px-3 rounded-lg bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-bold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1.5">
                        <span>⬆️</span>
                        <span>Upload Visa</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={() => setVisaDocUploaded(true)}
                        />
                      </label>
                      {/* View Visa */}
                      <button
                        type="button"
                        disabled={!visaDocUploaded}
                        onClick={() => alert('Official stamped visa document preview confirmed.')}
                        className="flex-1 py-2 px-3 rounded-lg bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-bold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        <span>👁️</span>
                        <span>View Visa</span>
                      </button>
                      {/* Download Visa */}
                      <button
                        type="button"
                        onClick={() => downloadVisaDocument(caseItem)}
                        className="flex-1 py-2 px-3 rounded-lg bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-bold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>⬇️</span>
                        <span>Download Visa</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* --------------------------------------------------------- */}
            {/* [SECTION 5: ADVANCE STAGE ACTIONS]                         */}
            {/* --------------------------------------------------------- */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200">
              <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                Advance Stage
              </h4>
              <div className="flex items-center gap-2">
                {currentStageDef.nextStage ? (
                  <button
                    type="button"
                    onClick={() => handleMoveToNext(currentStageDef.nextStage)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0F0E2B] to-[#2E2B6E] hover:from-[#181445] hover:to-[#221F56] text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>
                      Move to{' '}
                      {currentStageDef.nextButtonText
                        ? currentStageDef.nextButtonText.replace('→ ', '')
                        : currentStageDef.nextStage}
                    </span>
                    <span>&rarr;</span>
                  </button>
                ) : (
                  <div className="flex-1 py-2 text-center text-xs font-semibold text-slate-400 bg-slate-100 rounded-xl">
                    Final Stage Reached
                  </div>
                )}

                {currentStageDef.id !== (isVisa ? 'REJECTED' : 'CANCELLED') && (
                  <button
                    type="button"
                    onClick={handleRejectOrCancel}
                    className="px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    {isVisa ? 'Mark as Rejected' : 'Mark as Cancelled'}
                  </button>
                )}
              </div>
            </div>

            {/* --------------------------------------------------------- */}
            {/* [SECTION 6: VIEW FULL CASE DETAILS] (Optional)             */}
            {/* --------------------------------------------------------- */}
            {onViewFullDetails && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onViewFullDetails(caseItem)}
                  className="w-full py-2.5 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs transition-all cursor-pointer text-center"
                >
                  View Full Case Details &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Add Payment Modal */}
      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        caseItem={caseItem}
        onRecordPayment={(paymentData) => {
          if (onRecordPayment) {
            onRecordPayment(caseItem, paymentData)
          }
        }}
      />
    </div>
  )
}

export default CaseDetailsSideDrawer
