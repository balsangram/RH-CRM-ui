import React from 'react'

/**
 * CompanyCard Component
 * Displays a single company card in the Card View format (Screenshot 2)
 */
export const CompanyCard = ({
  company,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-2.5 text-left">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex items-center gap-2 min-w-0">
            {/* Square Avatar with Initials */}
            <div className="w-7 h-7 rounded bg-[#0F0E2B] text-white font-bold flex items-center justify-center text-[10px] shrink-0 tracking-wide">
              {company.avatar || 'CO'}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-[11px] leading-tight truncate">
                {company.name}
              </h3>
              <span className="font-mono text-[9px] text-slate-400 font-semibold">{company.id}</span>
            </div>
          </div>

          <span
            className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase border shrink-0 ${
              company.status === 'ACTIVE'
                ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50'
                : 'border-slate-300 text-slate-400 bg-slate-50'
            }`}
          >
            {company.status}
          </span>
        </div>

        {/* Reg Details & Country */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 gap-1">
          <span className="truncate">
            <strong className="text-slate-700 font-medium">Reg:</strong> {company.regNo}
          </span>
          <span className="shrink-0">
            <strong className="text-slate-700 font-medium">Country:</strong> {company.country}
          </span>
        </div>

        {/* Contact & Meta List */}
        <div className="mt-2 space-y-1 text-[10px] text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[10px]">👤</span>
            <span className="font-medium text-slate-700 shrink-0">Contact:</span>
            <span className="truncate">{company.contactPerson}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[10px]">✉️</span>
            <a href={`mailto:${company.email}`} className="truncate hover:underline text-slate-600">
              {company.email}
            </a>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[10px]">📞</span>
            <span className="truncate">{company.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[10px]">📍</span>
            <span className="truncate">{company.address}</span>
          </div>
        </div>
      </div>

      {/* Travelers & Applications Stats Box */}
      <div>
        <div className="bg-slate-50/80 border border-slate-100 rounded p-1.5 grid grid-cols-2 text-center">
          <div>
            <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400">
              Travelers
            </span>
            <span className="text-xs font-bold text-slate-800">{company.totalTravelers}</span>
          </div>
          <div className="border-l border-slate-200">
            <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400">
              Applications
            </span>
            <span className="text-xs font-bold text-slate-800">{company.totalApplications}</span>
          </div>
        </div>

        {/* Bottom Buttons Row */}
        <div className="flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onView}
            className="flex-1 py-1 px-1.5 text-[9px] font-bold rounded bg-[#0F0E2B] hover:bg-[#181445] text-white transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0 truncate"
          >
            <span>👁️</span>
            <span>View Details</span>
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="px-2 py-1 text-[9px] font-medium rounded border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shrink-0"
            title="Edit Company"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onToggleStatus}
            className="px-1.5 py-1 text-[9px] font-medium rounded border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shrink-0"
            title={company.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          >
            {company.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="p-1 text-[9px] rounded border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 text-slate-400 transition-colors cursor-pointer shrink-0"
            title="Delete Company"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompanyCard
