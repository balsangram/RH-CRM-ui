import React, { useState, useEffect } from 'react'
import { VISA_STAGES } from '../../services/visaCases'
import { HOLIDAY_STAGES } from '../../services/holidayCases'
import AddPaymentModal from '../Modal/AddPaymentModal.component'
import {
  downloadApplicationDossier,
  downloadInvoice,
  downloadVisaDocument,
} from '../../utils/documentGenerators'

const formatINR = (val) => {
  if (val === undefined || val === null) return '₹0'
  return `₹${Number(val).toLocaleString('en-IN')}`
}

/**
 * CaseDetailsSideDrawer Component
 * Slide-over side sheet drawer matching Screenshots 4 & 5 from Visa Cases
 * Used for displaying and advancing stage details in Companies & Travellers
 */
export const CaseDetailsSideDrawer = ({
  isOpen,
  onClose,
  caseItem,
  caseType = 'VISA', // 'VISA' | 'HOLIDAY'
  onAdvanceStage,
  onRecordPayment,
}) => {
  const isVisa =
    caseType === 'VISA' ||
    caseItem?.applicationType === 'VISA' ||
    Boolean(caseItem?.visaType) ||
    String(caseItem?.id || '').startsWith('VISA')
  const stages = isVisa ? VISA_STAGES : HOLIDAY_STAGES

  // Normalize raw stage to stage ID
  const rawStage = (caseItem?.stage || caseItem?.status || '').toUpperCase().replace(/[\s-]/g, '_')
  const currentStageDef =
    stages.find(
      (s) =>
        s.id === rawStage ||
        s.shortTitle?.toUpperCase() === rawStage ||
        s.title?.toUpperCase().includes(rawStage)
    ) || stages[0]

  const [completedChecks, setCompletedChecks] = useState({})
  const [drawerAlert, setDrawerAlert] = useState('')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [visaDocUploaded, setVisaDocUploaded] = useState(false)

  useEffect(() => {
    if (caseItem) {
      setCompletedChecks(caseItem.completedChecklists || {})
      setDrawerAlert('')
      setVisaDocUploaded(Boolean(caseItem.visaDocUploaded || caseItem.visaDocument))
    }
  }, [caseItem, currentStageDef])

  if (!isOpen || !caseItem) return null

  // Toggle checklist checkbox
  const handleToggleCheck = (checkId, checked) => {
    setCompletedChecks((prev) => ({
      ...prev,
      [checkId]: checked,
    }))
    setDrawerAlert('')
  }

  // Handle Advance Stage with mandatory validation
  const handleMoveToNext = (targetStageId) => {
    if (!targetStageId) return

    // Verify mandatory checklists for current stage
    const uncompletedMandatory = (currentStageDef.checklist || []).filter(
      (chk) => chk.mandatory && !completedChecks[chk.id]
    )

    if (uncompletedMandatory.length > 0) {
      setDrawerAlert(
        `Cannot advance to ${targetStageId}: Please complete all mandatory checklist items (${uncompletedMandatory
          .map((c) => c.label)
          .join(', ')}) first.`
      )
      return
    }

    onAdvanceStage(caseItem, targetStageId, caseItem.notes, completedChecks)
    onClose()
  }

  // Handle Mark as Rejected / Cancelled
  const handleRejectOrCancel = () => {
    const targetStage = isVisa ? 'REJECTED' : 'CANCELLED'
    onAdvanceStage(caseItem, targetStage, 'Marked as rejected/cancelled by user', completedChecks)
    onClose()
  }

  // Dynamic values
  const applicantName =
    caseItem.applicantName || caseItem.applicant || caseItem.customer || 'Applicant'
  const caseId = caseItem.id || (isVisa ? 'VISA-301' : 'PKG-701')
  const phone = caseItem.phone || '+91 98200 11223'
  const email = caseItem.email || 'applicant@example.com'
  const passport = caseItem.passport || 'P9847291'
  const passportExp = caseItem.passportExp || caseItem.expiry || '2029-08-20'
  const appliedDate = caseItem.applicationDate || caseItem.bookingDate || '2026-10-01'
  const country = caseItem.country || caseItem.destination || 'United States'
  const visaOrPkgType = caseItem.serviceRequired || caseItem.visaType || caseItem.packageName || 'Visitor Visa'
  const officer = caseItem.assignedOfficer || caseItem.officer || 'Amit Verma (CO-101)'
  const officerId = caseItem.officerId || 'CO-101'
  const docStatus = caseItem.docStatus || (caseItem.status ? String(caseItem.status).replace('_', ' ') : 'PENDING VERIFICATION')

  // Amounts
  const totalAmount = caseItem.amount || caseItem.price || (isVisa ? 18500 : 85000)
  const paidAmount = caseItem.paidAmount !== undefined ? caseItem.paidAmount : (caseItem.paymentStatus === 'COMPLETED' || caseItem.paymentStatus === 'PAID' ? totalAmount : 0)
  const pendingAmount = Math.max(0, totalAmount - paidAmount)
  const paymentType = caseItem.paymentType || (paidAmount === totalAmount ? 'Prepaid' : 'Postpaid')
  const paymentStatus = caseItem.paymentStatus || (paidAmount === totalAmount ? 'COMPLETED' : paidAmount > 0 ? 'PARTIAL' : 'PENDING')
  const txnId = caseItem.txnId || caseItem.invoiceRef || 'TXN-998250'

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-2xs transition-opacity duration-300"
      />

      {/* Slide-over Sheet (Right aligned, max-w-xl) */}
      <div className="fixed inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl border-l border-slate-200 flex flex-col z-10 animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                {applicantName}
              </h3>
              <span className="font-mono text-xs text-slate-500 font-bold block mt-0.5">
                {caseId}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>✕</span>
              <span>Close</span>
            </button>
          </div>

          {/* Download Application Button */}
          <button
            type="button"
            onClick={() => downloadApplicationDossier(caseItem, isVisa ? 'visa' : 'holiday')}
            className="mt-2.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-[11px] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>📄</span>
            <span>Download Application Dossier</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Validation Alert */}
          {drawerAlert && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2">
              <span className="text-rose-600 font-bold text-sm">⚠</span>
              <span>{drawerAlert}</span>
            </div>
          )}

          {/* SECTION 1: STAGE CHECKLIST */}
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
          </div>

          {/* SECTION 2: APPLICANT INFORMATION */}
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

          {/* SECTION 3: VISA / HOLIDAY DETAILS */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
              {isVisa ? 'Visa Details' : 'Holiday Booking Details'}
            </h4>
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  {isVisa ? 'Target Country' : 'Destination'}
                </p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{country}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  {isVisa ? 'Visa Type' : 'Package Name'}
                </p>
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

          {/* SECTION 4: PAYMENT SUMMARY */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                Payment Summary
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
                  <p className="text-[9px] uppercase font-bold text-slate-400">Total Fee</p>
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
              <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between pt-1 border-t border-slate-100">
                <span>Type: <strong className="text-slate-800">{paymentType}</strong></span>
                <span>Status: <strong className="text-slate-800">{paymentStatus}</strong></span>
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

          {/* SECTION 4b: VISA DOCUMENT ACTIONS (only after Payment stage) */}
          {isVisa && (() => {
            const stageOrder = ['UNDER_REVIEW', 'DOCS_VERIFIED', 'SUBMITTED', 'PROCESSING', 'INTERVIEW', 'APPROVED', 'PAYMENT']
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
                    <span className={`w-2.5 h-2.5 rounded-full ${visaDocUploaded ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="text-xs font-semibold text-slate-700">
                      {visaDocUploaded ? 'Visa Document Uploaded' : 'No visa document uploaded yet'}
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

          {/* SECTION 5: ADVANCE STAGE ACTIONS */}
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
                  <span>Move to {currentStageDef.nextButtonText ? currentStageDef.nextButtonText.replace('→ ', '') : currentStageDef.nextStage}</span>
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
        </div>
      </div>

      {/* Add Payment Modal Popup */}
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
