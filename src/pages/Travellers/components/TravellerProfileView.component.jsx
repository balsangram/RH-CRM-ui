import React, { useState } from 'react'

/**
 * TravellerProfileView Component
 * Displays the complete traveler profile drilldown view (matching Screenshot 3 & 4)
 * with Visa Applications History (Table, Cards, Kanban) and Holiday Booking History (Table, Kanban).
 */
export const TravellerProfileView = ({
  traveller,
  onBack,
  onEdit,
}) => {
  const [visaViewFormat, setVisaViewFormat] = useState('table') // 'table' | 'cards' | 'kanban'
  const [holidayViewFormat, setHolidayViewFormat] = useState('kanban') // 'table' | 'kanban'

  const visaApps = traveller.visaApplications || []
  const holidayBookings = traveller.holidayBookings || []

  const VISA_KANBAN_STAGES = [
    { id: 'UNDER_REVIEW', label: 'Under Review', color: 'border-amber-300 text-amber-700 bg-amber-50' },
    { id: 'DOCS_VERIFIED', label: 'Docs Verified', color: 'border-blue-300 text-blue-700 bg-blue-50' },
    { id: 'SUBMITTED', label: 'Submitted', color: 'border-purple-300 text-purple-700 bg-purple-50' },
    { id: 'PROCESSING', label: 'Processing', color: 'border-indigo-300 text-indigo-700 bg-indigo-50' },
    { id: 'APPROVED', label: 'Approved', color: 'border-emerald-300 text-emerald-700 bg-emerald-50' },
    { id: 'REJECTED', label: 'Rejected', color: 'border-rose-300 text-rose-700 bg-rose-50' },
  ]

  const HOLIDAY_KANBAN_STAGES = [
    { id: 'BOOKING_CREATED', label: 'Booking Created', subtitle: 'Reservation entered, awaiting itinerary' },
    { id: 'DOCS_ITINERARY', label: 'Docs & Itinerary', subtitle: 'Itinerary and flights arranged' },
    { id: 'VOUCHERS_CONFIRM', label: 'Vouchers & Confirm', subtitle: 'Confirmed booking & hotel vouchers' },
    { id: 'TOUR_IN_PROGRESS', label: 'Tour In-Progress', subtitle: 'Traveler currently on tour' },
    { id: 'COMPLETED', label: 'Completed', subtitle: 'Tour successfully concluded' },
    { id: 'CANCELLED', label: 'Cancelled', subtitle: 'Cancelled or refunded booking' },
  ]

  return (
    <div className="space-y-4 pb-12 font-sans text-xs">
      {/* Top Navigation & Action Row */}
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

      {/* Traveler Full Profile Card (Screenshot 3 & 4) */}
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
      {/* SECTION 1: VISA APPLICATIONS HISTORY (Screenshot 3 & 4)        */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        {/* Section Header */}
        <div className="p-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50/60">
          <h3 className="font-bold text-xs text-slate-900 tracking-tight">
            Visa Applications History ({visaApps.length} Total)
          </h3>

          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-slate-500 font-semibold">Format:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setVisaViewFormat('table')}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                  visaViewFormat === 'table' ? 'bg-[#0F0E2B] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                = Table
              </button>
              <button
                type="button"
                onClick={() => setVisaViewFormat('cards')}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                  visaViewFormat === 'cards' ? 'bg-[#0F0E2B] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ◼ Cards
              </button>
              <button
                type="button"
                onClick={() => setVisaViewFormat('kanban')}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                  visaViewFormat === 'kanban' ? 'bg-[#0F0E2B] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚏ Kanban
              </button>
            </div>
          </div>
        </div>

        {/* Section Body */}
        {visaApps.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs italic">
            No visa applications found for this traveler.
          </div>
        ) : visaViewFormat === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-3">APPLICATION ID</th>
                  <th className="py-2.5 px-3">TARGET COUNTRY</th>
                  <th className="py-2.5 px-3">VISA TYPE</th>
                  <th className="py-2.5 px-3">APPLICATION DATE</th>
                  <th className="py-2.5 px-3">CASE OFFICER</th>
                  <th className="py-2.5 px-3">PAYMENT TYPE</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visaApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{app.id}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{app.country}</td>
                    <td className="py-2.5 px-3 text-slate-600">{app.visaType}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{app.applicationDate}</td>
                    <td className="py-2.5 px-3 text-slate-700">{app.officer}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold border border-slate-200 bg-slate-50 text-slate-700">
                        {app.paymentType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${app.statusColor}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        className="px-2 py-1 rounded bg-[#0F0E2B] text-white hover:bg-[#181445] text-[9px] font-bold transition-colors cursor-pointer"
                      >
                        View Details &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : visaViewFormat === 'cards' ? (
          <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {visaApps.map((app) => (
              <div key={app.id} className="p-3 rounded-lg border border-slate-200 bg-white space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-slate-900">{app.id}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${app.statusColor}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{app.country}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{app.visaType}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500">
                  <span>📅 {app.applicationDate}</span>
                  <button
                    type="button"
                    className="px-2 py-0.5 rounded bg-[#0F0E2B] text-white text-[9px] font-bold"
                  >
                    Details &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* KANBAN VIEW */
          <div className="p-3 flex gap-3 overflow-x-auto">
            {VISA_KANBAN_STAGES.map((stg) => {
              const matched = visaApps.filter((a) => a.status === stg.id)
              return (
                <div key={stg.id} className="w-56 min-w-56 shrink-0 bg-slate-50 rounded-lg border border-slate-200 p-2 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-700">
                    <span>{stg.label}</span>
                    <span className="w-4 h-4 rounded bg-white text-slate-600 border border-slate-200 flex items-center justify-center font-mono text-[9px]">
                      {matched.length}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {matched.length === 0 ? (
                      <div className="py-4 text-center text-slate-400 text-[10px] italic">Empty</div>
                    ) : (
                      matched.map((app) => (
                        <div key={app.id} className="p-2 rounded bg-white border border-slate-200 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between font-mono text-[9px] text-slate-400 font-bold">
                            <span>{app.id}</span>
                            <span>{app.visaType}</span>
                          </div>
                          <p className="font-bold text-slate-900 text-[11px] truncate">{app.country}</p>
                          <div className="text-[9px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                            <span>{app.officer}</span>
                            <span className="text-indigo-600 font-bold hover:underline cursor-pointer">View &rarr;</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: HOLIDAY / TOUR BOOKING HISTORY (Screenshot 3 & 4)   */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        {/* Section Header */}
        <div className="p-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50/60">
          <h3 className="font-bold text-xs text-slate-900 tracking-tight">
            Holiday / Tour Booking History ({holidayBookings.length} Total)
          </h3>

          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-slate-500 font-semibold">Format:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setHolidayViewFormat('table')}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                  holidayViewFormat === 'table' ? 'bg-[#0F0E2B] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                = Table
              </button>
              <button
                type="button"
                onClick={() => setHolidayViewFormat('kanban')}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                  holidayViewFormat === 'kanban' ? 'bg-[#0F0E2B] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚏ Kanban
              </button>
            </div>
          </div>
        </div>

        {/* Section Body */}
        {holidayBookings.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs italic">
            No holiday bookings recorded for this traveler.
          </div>
        ) : holidayViewFormat === 'table' ? (
          /* TABLE FORMAT (Screenshot 4) */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-3">PACKAGE ID</th>
                  <th className="py-2.5 px-3">PACKAGE NAME</th>
                  <th className="py-2.5 px-3">DESTINATION</th>
                  <th className="py-2.5 px-3">DURATION</th>
                  <th className="py-2.5 px-3">BOOKING DATE</th>
                  <th className="py-2.5 px-3">DEPARTURE DATE</th>
                  <th className="py-2.5 px-3">TOTAL PRICE</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {holidayBookings.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{pkg.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{pkg.packageName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{pkg.destination}</td>
                    <td className="py-2.5 px-3 text-slate-600">{pkg.duration}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{pkg.bookingDate}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{pkg.departureDate}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      ₹{Number(pkg.price).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${pkg.statusColor}`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        className="px-2 py-1 rounded bg-[#0F0E2B] text-white hover:bg-[#181445] text-[9px] font-bold transition-colors cursor-pointer"
                      >
                        View Details &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* KANBAN FORMAT (Screenshot 3) */
          <div className="p-3 flex gap-3 overflow-x-auto">
            {HOLIDAY_KANBAN_STAGES.map((stage) => {
              const matched = holidayBookings.filter((b) => b.stage === stage.id)

              return (
                <div
                  key={stage.id}
                  className="w-60 min-w-60 shrink-0 bg-slate-50 rounded-xl border border-slate-200 flex flex-col shadow-2xs"
                >
                  {/* Column Header */}
                  <div className="p-2.5 border-b border-slate-200 bg-white rounded-t-xl space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[11px] text-slate-900 tracking-tight">{stage.label}</h4>
                      <span className="w-4 h-4 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[9px] font-bold flex items-center justify-center">
                        {matched.length}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-tight truncate">{stage.subtitle}</p>
                  </div>

                  {/* Cards inside stage */}
                  <div className="p-2 space-y-2 flex-1">
                    {matched.length === 0 ? (
                      <div className="py-6 text-center text-slate-400 text-[10px] italic">No bookings</div>
                    ) : (
                      matched.map((pkg) => (
                        <div
                          key={pkg.id}
                          className="p-2.5 rounded-lg border border-slate-200 bg-white shadow-2xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[9px]">
                            <span className="font-mono font-bold text-slate-400">{pkg.id}</span>
                            <span className="text-slate-600 truncate">{pkg.destination}</span>
                          </div>
                          <h5 className="font-bold text-slate-900 text-[11px] leading-tight line-clamp-2">
                            {pkg.packageName}
                          </h5>
                          <div className="text-[9px] text-slate-500 space-y-0.5">
                            <p>⏳ {pkg.duration}</p>
                            <p>📅 Dept: {pkg.departureDate}</p>
                          </div>
                          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="font-bold text-slate-900">
                              ₹{Number(pkg.price).toLocaleString('en-IN')}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border bg-slate-50 text-slate-700">
                              {pkg.status}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="w-full mt-1 py-1 rounded bg-[#0F0E2B] hover:bg-[#181445] text-white text-[9px] font-bold transition-colors cursor-pointer text-center"
                          >
                            View Details &rarr;
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TravellerProfileView
