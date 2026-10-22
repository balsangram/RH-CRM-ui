import React from 'react'
import { VISA_STAGES } from '../../services/visaCases'
import { HOLIDAY_STAGES } from '../../services/holidayCases'

/**
 * Helper to format currency in Indian Rupees (INR)
 */
const formatINR = (val) => {
  if (val === undefined || val === null || val === '') return null
  return `₹${Number(val).toLocaleString('en-IN')}`
}

/**
 * ============================================================================
 * CaseStageCard Component
 * ============================================================================
 * Unified Kanban Stage Card used across all processing pipelines:
 *  1. Holiday Cases (/holidays)
 *  2. Visa Cases (/visas)
 *  3. Company Applications Tab (/companies)
 *  4. Traveller Applications Tab (/travellers)
 *
 * HOW TO CUSTOMIZE MANUALLY (NO AI NEEDED):
 *  - Change Card Badges: See [SECTION 1: TOP BADGES & ID]
 *  - Change Title & Subtitles: See [SECTION 2: TITLE & DESTINATION]
 *  - Change Price / Payment format: See [SECTION 3: PRICE & PAYMENT PROGRESS]
 *  - Change Officer / Checklist badge: See [SECTION 4: OFFICER & STATUS]
 *  - Change Bottom Action Buttons: See [SECTION 5: BOTTOM ACTIONS]
 * ============================================================================
 */
export const CaseStageCard = ({
  caseItem,
  caseType, // 'VISA' | 'HOLIDAY' (auto-detected if omitted)
  stages, // Optional custom stages array
  stageIdx = 0, // 0-based column index
  onOpenDetails, // Callback when "Side Sheet & Details" is clicked: (caseItem) => void
  onAdvanceStage, // Callback when "→" (Advance) is clicked: (caseItem) => void
  onPreviousStage, // Callback when "←" (Previous) is clicked: (caseItem) => void
  onDownloadDossier, // Optional callback for "📄" Dossier button: (caseItem) => void
  showDossierButton, // Explicit boolean to show/hide "📄" button
  className = '',
}) => {
  if (!caseItem) return null

  // 1. Determine if this is a Visa or Holiday card
  const isVisa =
    caseType === 'VISA' ||
    (caseType !== 'HOLIDAY' &&
      (caseItem.applicationType === 'VISA' ||
        Boolean(caseItem.visaType) ||
        String(caseItem.id || '').startsWith('VISA') ||
        (String(caseItem.id || '').startsWith('APP-') && !caseItem.packageName)))

  // 2. Resolve active stages list & current stage definition
  const stagesList = stages || caseItem.stages || (isVisa ? VISA_STAGES : HOLIDAY_STAGES)
  const currentStageDef =
    stagesList.find((s) => s.id === (caseItem.stage || caseItem.status)) ||
    (typeof stageIdx === 'number' && stagesList[stageIdx] ? stagesList[stageIdx] : stagesList[0])

  // 3. Checklist count & progress
  const checklist = currentStageDef?.checklist || []
  const totalChecklist = checklist.length
  const completedCount = checklist.filter(
    (chk) => caseItem.completedChecklists && caseItem.completedChecklists[chk.id]
  ).length

  // 4. Financials & Paid Percentage
  const totalAmount = caseItem.amount !== undefined ? caseItem.amount : caseItem.price
  const paidAmount =
    caseItem.paidAmount !== undefined
      ? caseItem.paidAmount
      : caseItem.paymentStatus === 'PAID' || caseItem.paymentStatus === 'COMPLETED'
      ? totalAmount
      : 0
  const hasAmount = totalAmount !== undefined && totalAmount !== null && Number(totalAmount) > 0
  const paidPercent = hasAmount
    ? Math.min(100, Math.round(((Number(paidAmount) || 0) / Number(totalAmount)) * 100))
    : 0
  const paymentType =
    caseItem.paymentType || (paidPercent === 100 ? 'Prepaid' : 'Postpaid')

  // 5. Titles, Location, Officer, Date
  const title = isVisa
    ? caseItem.applicant || caseItem.applicantName || caseItem.name || caseItem.country || 'Applicant'
    : caseItem.packageName || caseItem.title || 'Tour Package'

  const caseId = caseItem.id || 'CASE-000'
  const destination = caseItem.destination || caseItem.country || ''
  const officer = caseItem.officer || caseItem.assignedOfficer || ''
  const date = caseItem.applicationDate || caseItem.bookingDate || caseItem.date || ''

  // Determine whether to display the dossier download button
  const shouldShowDossier =
    showDossierButton !== undefined ? showDossierButton : Boolean(onDownloadDossier)

  // Determine if advance button should be enabled
  const canAdvance =
    Boolean(onAdvanceStage) &&
    Boolean(currentStageDef?.nextStage) &&
    stageIdx < stagesList.length - 1

  const canGoPrevious = Boolean(onPreviousStage) && stageIdx > 0

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/90 p-2.5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-1.5 text-left ${className}`}
    >
      {/* ------------------------------------------------------------- */}
      {/* [SECTION 1: TOP BADGES & ID]                                  */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between gap-1 text-[9px]">
        {isVisa ? (
          <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200 truncate max-w-[170px]">
            {caseItem.visaType || '🛂 Visa'}
          </span>
        ) : (
          <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            🌴 Holiday
          </span>
        )}

        <span className="font-mono font-bold text-slate-400 text-[9px] shrink-0">
          {caseId}
        </span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* [SECTION 2: TITLE & DESTINATION]                              */}
      {/* ------------------------------------------------------------- */}
      <div>
        <h4
          onClick={() => onOpenDetails?.(caseItem)}
          className="text-[11px] font-bold text-slate-900 leading-snug truncate hover:text-indigo-600 transition-colors cursor-pointer"
          title={title}
        >
          {title}
        </h4>

        {/* Holiday Subtitles: Customer & Location + Duration */}
        {!isVisa && (
          <>
            {(caseItem.customer || caseItem.applicantName) && (
              <p className="text-[10px] text-slate-700 font-medium mt-0.5 flex items-center gap-1 truncate">
                <span>👤</span>
                <span className="truncate">{caseItem.customer || caseItem.applicantName}</span>
              </p>
            )}
            {destination && (
              <p className="text-[9px] text-slate-500 font-medium mt-0.5 flex items-center gap-1 truncate">
                <span>📍</span>
                <span className="truncate">
                  {destination}
                  {caseItem.duration ? ` • ${caseItem.duration}` : ''}
                </span>
              </p>
            )}
          </>
        )}

        {/* Visa Subtitles: Country & Service Required */}
        {isVisa && (
          <p className="text-[10px] text-slate-600 font-medium mt-0.5 flex items-center gap-1 truncate">
            <span>📍</span>
            <span className="truncate">
              {destination}
              {caseItem.serviceRequired ? ` • ${caseItem.serviceRequired}` : ''}
            </span>
          </p>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* [SECTION 3: PRICE & PAYMENT PROGRESS] (if amount exists)       */}
      {/* ------------------------------------------------------------- */}
      {hasAmount && (
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
          <span className="font-bold text-slate-900">
            {formatINR(totalAmount)}
          </span>
          <span
            className={`text-[9px] font-bold ${
              paidPercent === 100
                ? 'text-emerald-600'
                : paidPercent > 0
                ? 'text-amber-600'
                : 'text-slate-400'
            }`}
          >
            {paidPercent}% paid ({paymentType})
          </span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* [SECTION 4: OFFICER & STATUS]                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between text-[9px] text-slate-500 pt-0.5">
        {/* Officer name or Date */}
        <span className="flex items-center gap-1 truncate font-medium max-w-[130px]">
          {officer ? (
            <>
              <span>👤</span>
              <span className="truncate">{officer}</span>
            </>
          ) : date ? (
            <>
              <span>📅</span>
              <span className="font-mono">{date}</span>
            </>
          ) : (
            <span className="text-slate-400 italic">Unassigned</span>
          )}
        </span>

        {/* Right Status Pill: Checklist progress OR Doc Status OR Payment Tag */}
        {totalChecklist > 0 ? (
          <span
            className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border shrink-0 ${
              completedCount === totalChecklist
                ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                : 'border-amber-300 text-amber-700 bg-amber-50'
            }`}
          >
            {completedCount}/{totalChecklist} done
          </span>
        ) : caseItem.docStatus ? (
          <span
            className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border shrink-0 ${
              caseItem.docStatus === 'DOCS_VERIFIED'
                ? 'border-blue-300 text-blue-700 bg-blue-50'
                : caseItem.docStatus === 'APPROVED'
                ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                : 'border-amber-300 text-amber-700 bg-amber-50'
            }`}
          >
            {String(caseItem.docStatus).replace(/_/g, ' ')}
          </span>
        ) : date && officer ? (
          <span className="font-mono text-slate-400">
            📅 {date}
          </span>
        ) : caseItem.paymentType ? (
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border bg-slate-50 text-slate-700">
            {caseItem.paymentType}
          </span>
        ) : null}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* [SECTION 5: BOTTOM ACTIONS] (Previous, Side Sheet, Dossier, Next)*/}
      {/* ------------------------------------------------------------- */}
      <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1">
        {/* Previous Stage Button (←) */}
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={(e) => {
            e.stopPropagation()
            onPreviousStage?.(caseItem)
          }}
          className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-700 font-bold text-[9px] cursor-pointer transition-colors"
          title="Move back to previous stage"
        >
          &larr;
        </button>

        {/* Side Sheet & Details Button */}
        <button
          type="button"
          onClick={() => onOpenDetails?.(caseItem)}
          className="flex-1 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-[9px] transition-colors cursor-pointer text-center"
        >
          Side Sheet & Details
        </button>

        {/* Optional Application Dossier Download Button (📄) */}
        {shouldShowDossier && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDownloadDossier?.(caseItem)
            }}
            className="px-1.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[9px] cursor-pointer transition-colors shrink-0"
            title="Download Application Dossier"
          >
            📄
          </button>
        )}

        {/* Advance Stage Button (→) */}
        <button
          type="button"
          disabled={!canAdvance}
          onClick={(e) => {
            e.stopPropagation()
            onAdvanceStage?.(caseItem)
          }}
          className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-700 font-bold text-[9px] cursor-pointer transition-colors"
          title="Advance to next stage"
        >
          &rarr;
        </button>
      </div>
    </div>
  )
}

export default CaseStageCard
