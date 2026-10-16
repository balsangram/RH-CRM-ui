import React, { useState, useEffect } from 'react'
import { VISA_STAGES } from '../../services/visaCases'
import { HOLIDAY_STAGES } from '../../services/holidayCases'

/**
 * CaseStageDetailsModal Component
 * Interactive modal showing current stage details, checklist requirements,
 * and stage advancement controls for Visa Cases and Holiday Bookings.
 */
export const CaseStageDetailsModal = ({
  isOpen,
  onClose,
  caseItem,
  caseType = 'VISA', // 'VISA' | 'HOLIDAY'
  onAdvanceStage,
}) => {
  const isVisa = caseType === 'VISA'
  const stages = isVisa ? VISA_STAGES : HOLIDAY_STAGES

  // Find active stage
  const rawStage = (caseItem?.stage || caseItem?.status || '').toUpperCase().replace(/[\s-]/g, '_')
  const currentStageDef =
    stages.find(
      (s) =>
        s.id === rawStage ||
        s.shortTitle?.toUpperCase() === rawStage ||
        s.title?.toUpperCase().includes(rawStage)
    ) || stages[0]

  // Local checklist state
  const [checkedItems, setCheckedItems] = useState({})
  const [selectedNextStage, setSelectedNextStage] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (caseItem) {
      setCheckedItems(caseItem.completedChecklists || {})
      setNotes(caseItem.notes || '')
      setSelectedNextStage(currentStageDef.nextStage || '')
    }
  }, [caseItem, currentStageDef])

  if (!isOpen || !caseItem) return null

  const handleToggleCheck = (checkId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [checkId]: !prev[checkId],
    }))
  }

  const handleApplyStageChange = (targetStageId) => {
    if (!targetStageId) return
    onAdvanceStage(caseItem, targetStageId, notes, checkedItems)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto font-sans text-xs">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold shadow-2xs ${
                isVisa ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isVisa ? '🛂' : '🌴'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                  {caseItem.applicantName || caseItem.applicant || caseItem.customer || caseItem.packageName}
                </h3>
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {caseItem.id}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                    isVisa ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}
                >
                  {isVisa ? 'Visa Application' : 'Holiday Booking'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {caseItem.serviceRequired || caseItem.visaType || caseItem.destination} &bull; Officer: {caseItem.assignedOfficer || caseItem.officer || 'Unassigned'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Pipeline Stepper Progress Bar */}
        <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            {isVisa ? 'Visa Processing Pipeline' : 'Holiday Booking Pipeline'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
            {stages.map((stg, idx) => {
              const isActive = stg.id === currentStageDef.id
              const isPast = stages.findIndex((s) => s.id === currentStageDef.id) > idx

              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => handleApplyStageChange(stg.id)}
                  className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-2xs'
                      : isPast
                      ? 'border-emerald-200 bg-emerald-50/40 text-emerald-800'
                      : 'border-slate-200 bg-white hover:border-slate-300 opacity-70'
                  }`}
                  title={`Click to set stage to ${stg.shortTitle}`}
                >
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-3.5 h-3.5 rounded text-[8px] font-bold flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-[#0F0E2B] text-white' : isPast ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isPast ? '✓' : stg.stepNumber}
                    </span>
                    <span className="font-bold text-[10px] truncate leading-tight text-slate-900">
                      {stg.shortTitle}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Current Stage Details Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Active Stage {currentStageDef.stepNumber} of {stages.length}
              </span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                {currentStageDef.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{currentStageDef.subtitle}</p>
            </div>

            <span
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${currentStageDef.badgeBorder || 'border-slate-300 bg-slate-50 text-slate-700'}`}
            >
              {currentStageDef.shortTitle}
            </span>
          </div>

          {/* Stage Checklist Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-700 tracking-wider">
                Stage Verification Checklist ({currentStageDef.checklist?.length || 0} Items)
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Check off items to track progress
              </span>
            </div>

            <div className="space-y-1.5 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
              {currentStageDef.checklist && currentStageDef.checklist.length > 0 ? (
                currentStageDef.checklist.map((chk) => {
                  const isChecked = !!checkedItems[chk.id]

                  return (
                    <label
                      key={chk.id}
                      className="flex items-start gap-2 p-1.5 rounded hover:bg-white transition-colors cursor-pointer select-none group"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCheck(chk.id)}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className={`text-[11px] leading-tight flex-1 ${isChecked ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
                        {chk.label}
                      </span>
                      {chk.mandatory && (
                        <span className="text-[8px] font-bold uppercase px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                          Mandatory
                        </span>
                      )}
                    </label>
                  )
                })
              ) : (
                <p className="text-slate-400 text-center py-2 text-[10px] italic">
                  No specific checklist items defined for this stage.
                </p>
              )}
            </div>
          </div>

          {/* Case Notes / Remarks */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-700 tracking-wider block">
              Stage Notes & Remarks
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record any client communications, document approvals, or stage remarks..."
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Stage Transition Control Bar */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-bold whitespace-nowrap">Move to Stage:</span>
            <select
              value={selectedNextStage}
              onChange={(e) => setSelectedNextStage(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">Select Stage...</option>
              {stages.map((stg) => (
                <option key={stg.id} value={stg.id}>
                  Stage {stg.stepNumber}: {stg.shortTitle} {stg.id === currentStageDef.id ? '(Current)' : ''}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!selectedNextStage || selectedNextStage === currentStageDef.id}
              onClick={() => handleApplyStageChange(selectedNextStage)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-700 text-xs cursor-pointer transition-colors shadow-2xs"
            >
              Update Stage
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
            >
              Close
            </button>

            {currentStageDef.nextStage && (
              <button
                type="button"
                onClick={() => handleApplyStageChange(currentStageDef.nextStage)}
                className="px-4 py-1.5 rounded-lg bg-[#0F0E2B] hover:bg-[#181445] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{currentStageDef.nextButtonText || `Advance to ${currentStageDef.nextStage}`}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseStageDetailsModal
