import React, { useState, useMemo } from 'react'
import { VISA_STAGES } from '../../../services/visaCases'
import { HOLIDAY_STAGES } from '../../../services/holidayCases'
import travellersService from '../../../services/travellers'
import CaseDetailsSideDrawer from '../../../components/Drawers/CaseDetailsSideDrawer.component'
import {
  downloadApplicationDossier,
  downloadInvoice,
  downloadVisaDocument,
} from '../../../utils/documentGenerators'

/**
 * Normalizes stage string to standard stage ID
 */
const normalizeStageId = (item, isVisa) => {
  const raw = (item.stage || item.status || '').toUpperCase().replace(/[\s-]/g, '_')
  if (isVisa) {
    if (raw === 'UNDER_REVIEW') return 'UNDER_REVIEW'
    if (raw === 'DOCS_VERIFIED') return 'DOCS_VERIFIED'
    if (raw === 'PAYMENT' || raw === 'PAYMENT_PENDING' || raw === 'PAYMENT_VERIFIED') return 'PAYMENT'
    if (raw === 'SUBMITTED') return 'SUBMITTED'
    if (raw === 'PROCESSING' || raw === 'IN_PROGRESS') return 'PROCESSING'
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
 * TravellerProfileView Component
 * Displays the complete traveler profile view matching CompanyApplicationsTab:
 * Top pipeline selector for Visa vs Holiday pipelines, Kanban/Table view,
 * search filter, and Right-side slide-over sheet drawer for stage checklist & advancement.
 */
export const TravellerProfileView = ({
  traveller,
  onBack,
  onEdit,
}) => {
  // Active pipeline view: 'VISA' | 'HOLIDAY'
  const [pipelineType, setPipelineType] = useState('VISA')
  // Display format: 'kanban' | 'table'
  const [format, setFormat] = useState('kanban')
  const [search, setSearch] = useState('')
  const [selectedCaseModal, setSelectedCaseModal] = useState(null)

  // Local state for instant interactive updates
  const [localVisaApps, setLocalVisaApps] = useState(traveller.visaApplications || [])
  const [localHolidayBookings, setLocalHolidayBookings] = useState(traveller.holidayBookings || [])

  // Sync if prop updates
  React.useEffect(() => {
    setLocalVisaApps(traveller.visaApplications || [])
    setLocalHolidayBookings(traveller.holidayBookings || [])
  }, [traveller])

  // Advance Visa Stage
  const handleAdvanceVisaStage = (app, nextStageId, notes, checklists) => {
    travellersService.updateVisaStage(traveller.id, app.id, nextStageId, notes)
    setLocalVisaApps((prev) =>
      prev.map((item) =>
        item.id === app.id
          ? {
              ...item,
              stage: nextStageId,
              status: nextStageId,
              notes: notes !== undefined ? notes : item.notes,
              completedChecklists: checklists || item.completedChecklists,
            }
          : item
      )
    )
  }

  // Advance Holiday Stage
  const handleAdvanceHolidayStage = (booking, nextStageId, notes, checklists) => {
    travellersService.updateHolidayStage(traveller.id, booking.id, nextStageId, notes)
    setLocalHolidayBookings((prev) =>
      prev.map((item) =>
        item.id === booking.id
          ? {
              ...item,
              stage: nextStageId,
              status: nextStageId,
              notes: notes !== undefined ? notes : item.notes,
              completedChecklists: checklists || item.completedChecklists,
            }
          : item
      )
    )
  }

  // Record Payment
  const handleRecordPayment = (item, paymentData) => {
    if (pipelineType === 'VISA') {
      travellersService.updateVisaPayment(traveller.id, item.id, paymentData)
      setLocalVisaApps((prev) =>
        prev.map((app) =>
          app.id === item.id
            ? {
                ...app,
                paidAmount: paymentData.newPaidTotal,
                paymentStatus: paymentData.newPaymentStatus,
                txnId: paymentData.referenceNo,
              }
            : app
        )
      )
    } else {
      travellersService.updateHolidayPayment(traveller.id, item.id, paymentData)
      setLocalHolidayBookings((prev) =>
        prev.map((b) =>
          b.id === item.id
            ? {
                ...b,
                paidAmount: paymentData.newPaidTotal,
                paymentStatus: paymentData.newPaymentStatus,
                invoiceRef: paymentData.referenceNo,
              }
            : b
        )
      )
    }

    setSelectedCaseModal((prev) =>
      prev && prev.item.id === item.id
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
  }

  // Active collection and stages
  const isVisa = pipelineType === 'VISA'
  const currentStages = isVisa ? VISA_STAGES : HOLIDAY_STAGES
  const activeList = isVisa ? localVisaApps : localHolidayBookings

  // Filtered applications based on search & pipeline tab
  const displayedItems = useMemo(() => {
    if (!search.trim()) return activeList
    const q = search.toLowerCase().trim()
    return activeList.filter((item) => {
      if (isVisa) {
        return (
          item.id?.toLowerCase().includes(q) ||
          item.country?.toLowerCase().includes(q) ||
          item.visaType?.toLowerCase().includes(q) ||
          item.officer?.toLowerCase().includes(q) ||
          item.paymentType?.toLowerCase().includes(q)
        )
      } else {
        return (
          item.id?.toLowerCase().includes(q) ||
          item.packageName?.toLowerCase().includes(q) ||
          item.destination?.toLowerCase().includes(q) ||
          item.officer?.toLowerCase().includes(q) ||
          item.paymentType?.toLowerCase().includes(q)
        )
      }
    })
  }, [activeList, isVisa, search])

  return (
    <div className="space-y-4 pb-12 font-sans text-xs">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP NAVIGATION & ACTION ROW                                */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>&larr;</span>
          <span>Back to Traveler Listing</span>
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="px-3.5 py-1.5 rounded-lg bg-[#0F0E2B] hover:bg-[#181445] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
        >
          Edit Traveler Details
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. TRAVELER FULL PROFILE CARD                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#0F0E2B] text-white font-bold flex items-center justify-center text-xs tracking-wider shadow-2xs">
              {traveller.avatar || (traveller.name ? traveller.name.slice(0, 2).toUpperCase() : 'TR')}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                Traveler Full Profile: {traveller.name} ({traveller.id})
              </h2>
              <span className="text-[10px] text-slate-400">Created: {traveller.regDate}</span>
            </div>
          </div>

          <span
            className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border shrink-0 ${
              traveller.status === 'ACTIVE'
                ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50'
                : 'border-rose-200 text-rose-700 bg-rose-50/50'
            }`}
          >
            {traveller.status}
          </span>
        </div>

        {/* Profile Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[11px] pt-1">
          <div>
            <span className="text-slate-400 font-semibold block text-[10px]">Unique Traveler ID:</span>
            <span className="font-mono font-bold text-slate-800">{traveller.id}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block text-[10px]">Applicant Name:</span>
            <span className="font-bold text-slate-800">{traveller.name}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block text-[10px]">Mobile Number:</span>
            <span className="font-medium text-slate-800">{traveller.phone}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block text-[10px]">Email ID:</span>
            <a href={`mailto:${traveller.email}`} className="font-medium text-slate-700 hover:underline truncate block">
              {traveller.email}
            </a>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block text-[10px]">Country:</span>
            <span className="font-medium text-slate-800">{traveller.country}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block text-[10px]">Passport Information:</span>
            <span className="font-mono font-medium text-slate-800">
              {traveller.passport} <span className="text-slate-500 text-[10px]">(Exp: {traveller.expiry})</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block text-[10px]">Registration Date:</span>
            <span className="font-medium text-slate-800">{traveller.regDate}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block text-[10px]">Account Status:</span>
            <span className="font-bold text-slate-800 capitalize">{traveller.status?.toLowerCase()}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. PIPELINE SELECTOR & FORMAT TOGGLE (MATCHING COMPANY)        */}
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
            <span
              className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
                pipelineType === 'VISA' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
              }`}
            >
              {localVisaApps.length}
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
            <span
              className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
                pipelineType === 'HOLIDAY' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
              }`}
            >
              {localHolidayBookings.length}
            </span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Format Toggle */}
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
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. FILTER & SEARCH TOOLBAR                                    */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <span className="text-slate-600 font-semibold whitespace-nowrap">Filter Search:</span>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search case ID, country, destination, package, or officer..."
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
          Showing <strong className="text-slate-800">{displayedItems.length}</strong>{' '}
          {pipelineType === 'VISA' ? 'Visa applications' : 'Holiday bookings'}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. ACTIVE PIPELINE WORKFLOW (KANBAN / TABLE)                  */}
      {/* ------------------------------------------------------------- */}
      {displayedItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs italic">
          No {pipelineType === 'VISA' ? 'visa applications' : 'holiday bookings'} match your search.
        </div>
      ) : format === 'kanban' ? (
        /* KANBAN BOARD WITH HORIZONTAL SCROLL */
        <div className="flex gap-3.5 items-start overflow-x-auto pb-4">
          {currentStages.map((stage, stageIdx) => {
            const matchedItems = displayedItems.filter(
              (item) => normalizeStageId(item, isVisa) === stage.id
            )

            return (
              <div
                key={stage.id}
                className="bg-slate-50/80 rounded-2xl border border-slate-200/90 flex flex-col max-h-[calc(100vh-320px)] overflow-hidden shadow-2xs w-[285px] min-w-[285px] shrink-0"
              >
                {/* Column Header */}
                <div className="p-2.5 border-b border-slate-200 bg-white rounded-t-2xl space-y-0.5 shrink-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-black text-slate-900 tracking-tight">
                      {stage.title}
                    </h4>
                    <span className="w-4 h-4 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[9px] font-bold flex items-center justify-center">
                      {matchedItems.length}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-medium leading-tight line-clamp-1">
                    {stage.subtitle}
                  </p>
                </div>

                {/* Cards Inside Column */}
                <div className="p-2 space-y-2 overflow-y-auto flex-1">
                  {matchedItems.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-[10px] italic">
                      No cases in this stage
                    </div>
                  ) : (
                    matchedItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border border-slate-200/90 p-2.5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-1.5 text-left"
                      >
                        {/* Top tag & ID */}
                        <div className="flex items-center justify-between gap-1 text-[9px]">
                          <span
                            className={`px-1.5 py-0.5 rounded-md font-bold border ${
                              isVisa
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {isVisa ? item.visaType || 'Visa' : item.duration || 'Holiday'}
                          </span>
                          <span className="font-mono font-bold text-slate-400 text-[9px]">
                            {item.id}
                          </span>
                        </div>

                        {/* Case Title / Destination */}
                        <div>
                          <h5
                            onClick={() => setSelectedCaseModal({ item, type: pipelineType })}
                            className="text-[11px] font-bold text-slate-900 leading-snug truncate hover:text-indigo-600 cursor-pointer"
                          >
                            {isVisa ? item.country : item.packageName || item.destination}
                          </h5>
                          <p className="text-[10px] text-slate-600 mt-0.5 flex items-center gap-1">
                            <span>👤</span> {item.officer || item.assignedOfficer || 'Amit Verma (CO-101)'}
                          </p>
                        </div>

                        {/* Date & Payment Tag */}
                        <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-100">
                          <span className="font-mono">
                            📅 {item.applicationDate || item.bookingDate || '2026-10-01'}
                          </span>
                          {isVisa ? (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border bg-slate-50 text-slate-700">
                              {item.paymentType || 'PREPAID'}
                            </span>
                          ) : (
                            <span className="font-bold text-slate-800">
                              ₹{Number(item.price || 0).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        {/* Bottom Actions: Previous / Side Sheet / Advance */}
                        <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1">
                          <button
                            type="button"
                            disabled={stageIdx === 0}
                            onClick={(e) => {
                              e.stopPropagation()
                              const prevStageId = currentStages[stageIdx - 1]?.id
                              if (prevStageId) {
                                if (isVisa) {
                                  handleAdvanceVisaStage(item, prevStageId)
                                } else {
                                  handleAdvanceHolidayStage(item, prevStageId)
                                }
                              }
                            }}
                            className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-700 font-bold text-[9px] cursor-pointer"
                            title="Move back to previous stage"
                          >
                            &larr;
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedCaseModal({ item, type: pipelineType })}
                            className="flex-1 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-[9px] transition-colors cursor-pointer text-center"
                          >
                            Side Sheet & Details
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              downloadApplicationDossier({
                                ...item,
                                applicantName: item.applicantName || traveller.name,
                                phone: item.phone || traveller.phone,
                                email: item.email || traveller.email,
                                passport: item.passport || traveller.passport,
                                passportExp: item.passportExp || traveller.expiry,
                              }, isVisa ? 'visa' : 'holiday')
                            }}
                            className="px-1.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[9px] cursor-pointer transition-colors"
                            title="Download Application Dossier"
                          >
                            📄
                          </button>

                          <button
                            type="button"
                            disabled={!stage.nextStage}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (isVisa) {
                                handleAdvanceVisaStage(item, stage.nextStage)
                              } else {
                                handleAdvanceHolidayStage(item, stage.nextStage)
                              }
                            }}
                            className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-700 font-bold text-[9px] cursor-pointer"
                            title="Advance to next stage"
                          >
                            &rarr;
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* TABLE VIEW (RESPONSIVE TABLE) */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-3">CASE ID</th>
                  <th className="py-2.5 px-3">{isVisa ? 'TARGET COUNTRY' : 'PACKAGE NAME'}</th>
                  <th className="py-2.5 px-3">{isVisa ? 'VISA TYPE' : 'DESTINATION'}</th>
                  <th className="py-2.5 px-3">STAGE</th>
                  <th className="py-2.5 px-3">{isVisa ? 'APPLICATION DATE' : 'BOOKING DATE'}</th>
                  <th className="py-2.5 px-3">CASE OFFICER</th>
                  <th className="py-2.5 px-3">{isVisa ? 'PAYMENT' : 'PRICE'}</th>
                  <th className="py-2.5 px-3 text-right">STAGE ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedItems.map((item) => {
                  const stageId = normalizeStageId(item, isVisa)
                  const stageDef = currentStages.find((s) => s.id === stageId) || currentStages[0]

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{item.id}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {isVisa ? item.country : item.packageName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {isVisa ? item.visaType : item.destination}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                            stageDef.badgeBorder || 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                        >
                          {stageDef.shortTitle}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">
                        {item.applicationDate || item.bookingDate}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {item.officer || item.assignedOfficer || 'Amit Verma (CO-101)'}
                      </td>
                      <td className="py-2.5 px-3">
                        {isVisa ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold border border-slate-200 bg-slate-50 text-slate-700">
                            {item.paymentType || 'PREPAID'}
                          </span>
                        ) : (
                          <span className="font-bold text-slate-900">
                            ₹{Number(item.price || 0).toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => downloadApplicationDossier({
                              ...item,
                              applicantName: item.applicantName || traveller.name,
                              phone: item.phone || traveller.phone,
                              email: item.email || traveller.email,
                              passport: item.passport || traveller.passport,
                              passportExp: item.passportExp || traveller.expiry,
                            }, isVisa ? 'visa' : 'holiday')}
                            className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[9px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Download Application Dossier"
                          >
                            <span>📄</span>
                            <span>Dossier</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => downloadInvoice({
                              ...item,
                              applicantName: item.applicantName || traveller.name,
                              phone: item.phone || traveller.phone,
                              email: item.email || traveller.email,
                              passport: item.passport || traveller.passport,
                              passportExp: item.passportExp || traveller.expiry,
                            }, isVisa ? 'visa' : 'holiday')}
                            className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[9px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Download Invoice"
                          >
                            <span>🧾</span>
                            <span>Invoice</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedCaseModal({ item, type: pipelineType })}
                            className="px-2 py-1 rounded bg-[#0F0E2B] text-white hover:bg-[#181445] text-[9px] font-bold transition-colors cursor-pointer"
                          >
                            Stage Details
                          </button>

                          {stageDef.nextStage && (
                            <button
                              type="button"
                              onClick={() => {
                                if (isVisa) {
                                  handleAdvanceVisaStage(item, stageDef.nextStage)
                                } else {
                                  handleAdvanceHolidayStage(item, stageDef.nextStage)
                                }
                              }}
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. SLIDE-OVER SHEET SIDE DRAWER (MATCHING SCREENSHOTS 4 & 5)   */}
      {/* ------------------------------------------------------------- */}
      {selectedCaseModal && (
        <CaseDetailsSideDrawer
          isOpen={!!selectedCaseModal}
          onClose={() => setSelectedCaseModal(null)}
          caseItem={{
            ...selectedCaseModal.item,
            applicantName: selectedCaseModal.item.applicantName || traveller.name,
            phone: selectedCaseModal.item.phone || traveller.phone,
            email: selectedCaseModal.item.email || traveller.email,
            passport: selectedCaseModal.item.passport || traveller.passport,
            passportExp: selectedCaseModal.item.passportExp || traveller.expiry,
          }}
          caseType={selectedCaseModal.type}
          onAdvanceStage={(item, nextStageId, notes, checklists) => {
            if (selectedCaseModal.type === 'VISA') {
              handleAdvanceVisaStage(item, nextStageId, notes, checklists)
            } else {
              handleAdvanceHolidayStage(item, nextStageId, notes, checklists)
            }
          }}
          onRecordPayment={(item, paymentData) => {
            handleRecordPayment(item, paymentData)
          }}
        />
      )}
    </div>
  )
}

export default TravellerProfileView
