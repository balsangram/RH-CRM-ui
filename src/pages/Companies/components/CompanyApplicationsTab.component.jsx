import React, { useState, useMemo } from 'react'
import { VISA_STAGES } from '../../../services/visaCases'
import { HOLIDAY_STAGES } from '../../../services/holidayCases'
import companiesService from '../../../services/companies'
import CaseDetailsSideDrawer from '../../../components/Drawers/CaseDetailsSideDrawer.component'
import CaseStageCard from '../../../components/Kanban/CaseStageCard.component'
import {
  downloadApplicationDossier,
  downloadInvoice,
  downloadVisaDocument,
} from '../../../utils/documentGenerators'

/**
 * Normalizes an application's stage/status into the proper stage ID
 */
const normalizeStageId = (app, isVisa) => {
  const raw = (app.stage || app.status || '').toUpperCase().replace(/[\s-]/g, '_')
  if (isVisa) {
    if (raw === 'UNDER_REVIEW') return 'UNDER_REVIEW'
    if (raw === 'DOCS_VERIFIED') return 'DOCS_VERIFIED'
    if (raw === 'PAYMENT' || raw === 'PAYMENT_PENDING' || raw === 'PAYMENT_VERIFIED') return 'PAYMENT'
    if (raw === 'SUBMITTED') return 'SUBMITTED'
    if (raw === 'PROCESSING' || raw === 'IN_PROGRESS') return 'PROCESSING'
    if (raw === 'INTERVIEW' || raw === 'INTERVIEW_SCHEDULED' || raw === 'INTERVIEW_PENDING') return 'INTERVIEW'
    if (raw === 'APPROVED') return 'APPROVED'
    if (raw === 'REJECTED' || raw === 'CANCELLED') return 'REJECTED'
    return 'UNDER_REVIEW'
  } else {
    if (raw === 'BOOKING_CREATED' || raw === 'UNDER_REVIEW') return 'BOOKING_CREATED'
    if (raw === 'DOCS_ITINERARY' || raw === 'DOCS_VERIFIED') return 'DOCS_ITINERARY'
    if (raw === 'PAYMENT' || raw === 'PAYMENT_PENDING' || raw === 'PAYMENT_VERIFIED') return 'PAYMENT'
    if (raw === 'VOUCHERS_CONFIRM' || raw === 'SUBMITTED') return 'VOUCHERS_CONFIRM'
    if (raw === 'TOUR_IN_PROGRESS' || raw === 'IN_PROGRESS') return 'TOUR_IN_PROGRESS'
    if (raw === 'COMPLETED' || raw === 'APPROVED') return 'COMPLETED'
    if (raw === 'CANCELLED' || raw === 'REJECTED') return 'CANCELLED'
    return 'BOOKING_CREATED'
  }
}

/**
 * CompanyApplicationsTab Component
 * Accommodates Visa Cases Pipeline and Holiday Cases Pipeline separately with stage details
 * and stage progression actions (matching Visa and Holiday workflows).
 */
export const CompanyApplicationsTab = ({
  companyId,
  applications = [],
  onNewApplication,
  onViewApplication,
  onStageChange,
}) => {
  // Active pipeline view: 'VISA' | 'HOLIDAY' | 'ALL'
  const [pipelineType, setPipelineType] = useState('VISA')
  // Display format: 'kanban' | 'table'
  const [format, setFormat] = useState('kanban')
  const [search, setSearch] = useState('')
  const [selectedCaseModal, setSelectedCaseModal] = useState(null)

  // Local copy of applications for instantaneous responsive UI updates
  const [localApps, setLocalApps] = useState(applications)

  // Sync if prop changes
  React.useEffect(() => {
    setLocalApps(applications)
  }, [applications])

  // Visa and Holiday partitioned collections
  const visaApps = useMemo(() => {
    return localApps.filter((a) => a.applicationType === 'VISA')
  }, [localApps])

  const holidayApps = useMemo(() => {
    return localApps.filter((a) => a.applicationType === 'HOLIDAY')
  }, [localApps])

  // Filtered applications based on search & pipeline tab
  const displayedApps = useMemo(() => {
    const list =
      pipelineType === 'VISA'
        ? visaApps
        : pipelineType === 'HOLIDAY'
        ? holidayApps
        : localApps

    if (!search.trim()) return list
    const q = search.toLowerCase().trim()
    return list.filter(
      (app) =>
        app.id.toLowerCase().includes(q) ||
        app.applicantName?.toLowerCase().includes(q) ||
        app.country?.toLowerCase().includes(q) ||
        app.serviceRequired?.toLowerCase().includes(q) ||
        app.assignedOfficer?.toLowerCase().includes(q)
    )
  }, [pipelineType, visaApps, holidayApps, localApps, search])

  // Advance stage handler
  const handleAdvanceStage = (app, targetStageId, newNotes, checklists) => {
    // 1. Update in service
    if (companyId) {
      companiesService.updateApplicationStage(companyId, app.id, targetStageId, newNotes)
    }

    // 2. Update local state
    setLocalApps((prev) =>
      prev.map((item) =>
        item.id === app.id
          ? {
              ...item,
              stage: targetStageId,
              status: targetStageId,
              notes: newNotes !== undefined ? newNotes : item.notes,
              completedChecklists: checklists || item.completedChecklists,
            }
          : item
      )
    )

    // 3. Notify parent if callback provided
    if (onStageChange) {
      onStageChange()
    }
  }

  // Record payment handler
  const handleRecordPayment = (app, paymentData) => {
    if (companyId) {
      companiesService.updateApplicationPayment(companyId, app.id, paymentData)
    }

    setLocalApps((prev) =>
      prev.map((item) =>
        item.id === app.id
          ? {
              ...item,
              paidAmount: paymentData.newPaidTotal,
              paymentStatus: paymentData.newPaymentStatus,
              txnId: paymentData.referenceNo,
              invoiceRef: paymentData.referenceNo,
            }
          : item
      )
    )

    setSelectedCaseModal((prev) =>
      prev && prev.item.id === app.id
        ? {
            ...prev,
            item: {
              ...prev.item,
              paidAmount: paymentData.newPaidTotal,
              paymentStatus: paymentData.newPaymentStatus,
              txnId: paymentData.referenceNo,
              invoiceRef: paymentData.referenceNo,
            },
          }
        : prev
    )

    if (onStageChange) {
      onStageChange()
    }
  }

  // Active stages array based on pipeline
  const isVisa = pipelineType === 'VISA'
  const currentStages = isVisa ? VISA_STAGES : HOLIDAY_STAGES

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP PIPELINE NAVIGATION & ACTIONS ROW                      */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        {/* Pipeline Type Switcher Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setPipelineType('VISA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              pipelineType === 'VISA'
                ? 'bg-[#0F0E2B] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🛂</span>
            <span>Visa Cases Pipeline</span>
            <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
              pipelineType === 'VISA' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
            }`}>
              {visaApps.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPipelineType('HOLIDAY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              pipelineType === 'HOLIDAY'
                ? 'bg-[#0F0E2B] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🌴</span>
            <span>Holiday Cases Pipeline</span>
            <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
              pipelineType === 'HOLIDAY' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
            }`}>
              {holidayApps.length}
            </span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Format Toggle */}
          {pipelineType !== 'ALL' && (
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
              <button
                type="button"
                onClick={() => setFormat('kanban')}
                className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                  format === 'kanban'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚏ Kanban
              </button>
              <button
                type="button"
                onClick={() => setFormat('table')}
                className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                  format === 'table'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                = Table
              </button>
            </div>
          )}

          {onNewApplication && (
            <button
              type="button"
              onClick={onNewApplication}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#0F0E2B] hover:bg-[#181445] text-white shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>+</span>
              <span>New Application</span>
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. FILTER & SEARCH TOOLBAR                                    */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <span className="text-slate-600 font-semibold whitespace-nowrap">Filter Search:</span>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search applicant name, ID, country, service, or officer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          Showing <strong className="text-slate-800">{displayedApps.length}</strong> {pipelineType === 'VISA' ? 'Visa applications' : pipelineType === 'HOLIDAY' ? 'Holiday bookings' : 'total applications'}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. WORKFLOW PIPELINE VIEW (KANBAN / TABLE)                     */}
      {/* ------------------------------------------------------------- */}
      {format === 'kanban' && pipelineType !== 'ALL' ? (
        /* KANBAN BOARD WITH HORIZONTAL SCROLL (Matching Visa/Holiday Cases) */
        <div className="flex gap-3.5 items-start overflow-x-auto pb-4">
          {currentStages.map((stage, stageIdx) => {
            const stageApps = displayedApps.filter(
              (app) => normalizeStageId(app, isVisa) === stage.id
            )

            return (
              <div
                key={stage.id}
                className="bg-slate-50/80 rounded-2xl border border-slate-200/90 flex flex-col max-h-[calc(100vh-320px)] overflow-hidden shadow-2xs w-[285px] min-w-[285px] shrink-0"
              >
                {/* Column Header */}
                <div className="p-2.5 border-b border-slate-200 bg-white rounded-t-2xl space-y-0.5 shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-slate-900 tracking-tight">
                      {stage.title}
                    </h3>
                    <span className="w-4 h-4 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[9px] font-bold flex items-center justify-center">
                      {stageApps.length}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-medium leading-tight line-clamp-1">
                    {stage.subtitle}
                  </p>
                </div>

                {/* Cards Container */}
                <div className="p-2 space-y-2 overflow-y-auto flex-1">
                  {stageApps.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-[10px] italic">
                      No applications in this stage
                    </div>
                  ) : (
                    stageApps.map((app) => (
                      <CaseStageCard
                        key={app.id}
                        caseItem={app}
                        caseType={isVisa ? 'VISA' : 'HOLIDAY'}
                        stages={currentStages}
                        stageIdx={stageIdx}
                        onOpenDetails={(item) =>
                          setSelectedCaseModal({ item, type: isVisa ? 'VISA' : 'HOLIDAY' })
                        }
                        onAdvanceStage={(item) => handleAdvanceStage(item, stage.nextStage)}
                        onPreviousStage={(item) => {
                          const prevStageId = currentStages[stageIdx - 1]?.id
                          if (prevStageId) handleAdvanceStage(item, prevStageId)
                        }}
                        onDownloadDossier={(item) =>
                          downloadApplicationDossier(item, isVisa ? 'visa' : 'holiday')
                        }
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-900 uppercase border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="px-3.5 py-3">APPLICATION ID</th>
                  <th className="px-3.5 py-3">APPLICANT NAME</th>
                  <th className="px-3.5 py-3">TYPE</th>
                  <th className="px-3.5 py-3">CURRENT STAGE</th>
                  <th className="px-3.5 py-3">COUNTRY / DESTINATION</th>
                  <th className="px-3.5 py-3">SERVICE REQUIRED</th>
                  <th className="px-3.5 py-3">CASE OFFICER</th>
                  <th className="px-3.5 py-3">DATE</th>
                  <th className="px-3.5 py-3 text-right">STAGE ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedApps.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-slate-400 italic">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  displayedApps.map((app) => {
                    const appIsVisa = app.applicationType === 'VISA'
                    const stageId = normalizeStageId(app, appIsVisa)
                    const stagesList = appIsVisa ? VISA_STAGES : HOLIDAY_STAGES
                    const stageDef = stagesList.find((s) => s.id === stageId) || stagesList[0]

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-3.5 py-2.5 font-bold font-mono text-slate-900 whitespace-nowrap">
                          {app.id}
                        </td>
                        <td className="px-3.5 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                          {app.applicantName}
                        </td>
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                              appIsVisa
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}
                          >
                            {app.applicationType}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${stageDef.badgeBorder || 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                            {stageDef.shortTitle}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-700 whitespace-nowrap">
                          {app.country}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-700 whitespace-nowrap">
                          {app.serviceRequired}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-700 whitespace-nowrap">
                          {app.assignedOfficer}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-500 font-mono text-[10px] whitespace-nowrap">
                          {app.applicationDate}
                        </td>
                        <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => downloadApplicationDossier(app, appIsVisa ? 'visa' : 'holiday')}
                              className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[9px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                              title="Download Application Dossier"
                            >
                              <span>📄</span>
                              <span>Dossier</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => downloadInvoice(app, appIsVisa ? 'visa' : 'holiday')}
                              className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[9px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                              title="Download Invoice"
                            >
                              <span>🧾</span>
                              <span>Invoice</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedCaseModal({ item: app, type: appIsVisa ? 'VISA' : 'HOLIDAY' })}
                              className="px-2 py-1 rounded bg-[#0F0E2B] text-white hover:bg-[#181445] text-[9px] font-bold transition-colors cursor-pointer"
                            >
                              Stage Details
                            </button>

                            {stageDef.nextStage && (
                              <button
                                type="button"
                                onClick={() => handleAdvanceStage(app, stageDef.nextStage)}
                                className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[9px] font-bold transition-colors cursor-pointer"
                                title={`Advance to ${stageDef.nextStage}`}
                              >
                                &rarr; Next
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. INTERACTIVE STAGE DETAILS & ADVANCEMENT SIDE DRAWER (Matching Screenshot 4 & 5) */}
      {selectedCaseModal && (
        <CaseDetailsSideDrawer
          isOpen={!!selectedCaseModal}
          onClose={() => setSelectedCaseModal(null)}
          caseItem={selectedCaseModal.item}
          caseType={selectedCaseModal.type}
          onAdvanceStage={(item, nextStageId, notes, checklists) =>
            handleAdvanceStage(item, nextStageId, notes, checklists)
          }
          onRecordPayment={(item, paymentData) =>
            handleRecordPayment(item, paymentData)
          }
        />
      )}
    </div>
  )
}

export default CompanyApplicationsTab
