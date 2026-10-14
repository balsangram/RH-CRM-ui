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
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs hover:border-slate-400 transition-all flex flex-col justify-between space-y-3.5 text-left">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Square Avatar with Initials */}
            <div className="w-9 h-9 rounded bg-black text-white font-bold flex items-center justify-center text-xs shrink-0 tracking-wider">
              {company.avatar || 'CO'}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-xs leading-tight truncate">
                {company.name}
              </h3>
              <span className="font-mono text-[10px] text-slate-400 font-semibold">{company.id}</span>
            </div>
          </div>

          <span
            className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border shrink-0 ${
              company.status === 'ACTIVE'
                ? 'border-slate-300 text-slate-700 bg-white'
                : 'border-slate-300 text-slate-400 bg-slate-50'
            }`}
          >
            {company.status}
          </span>
        </div>

        {/* Reg Details & Country */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>
            <strong className="text-slate-800">Reg Details:</strong> {company.regNo}
          </span>
          <span>
            <strong className="text-slate-800">Country:</strong> {company.country}
          </span>
        </div>

        {/* Contact & Meta List */}
        <div className="mt-2.5 space-y-1 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <span>👤</span>
            <span className="font-semibold text-slate-800">Contact:</span>
            <span className="truncate">{company.contactPerson}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <span>✉️</span>
            <a href={`mailto:${company.email}`} className="truncate hover:underline">
              {company.email}
            </a>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <span>📞</span>
            <span className="truncate">{company.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <span>📍</span>
            <span className="truncate">{company.address}</span>
          </div>
        </div>
      </div>

      {/* Travelers & Applications Stats Box */}
      <div>
        <div className="bg-slate-50 border border-slate-100 rounded-md p-2 grid grid-cols-2 text-center">
          <div>
            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Travelers
            </span>
            <span className="text-sm font-black text-slate-900">{company.totalTravelers}</span>
          </div>
          <div className="border-l border-slate-200">
            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Applications
            </span>
            <span className="text-sm font-black text-slate-900">{company.totalApplications}</span>
          </div>
        </div>

        {/* Bottom Buttons Row */}
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onView}
            className="flex-1 py-1.5 text-[11px] font-bold rounded bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <span>👁️</span>
            <span>View Details</span>
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="px-2.5 py-1.5 text-[11px] font-medium rounded border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            title="Edit Company"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onToggleStatus}
            className="px-2 py-1.5 text-[11px] font-medium rounded border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            title={company.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          >
            {company.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-[11px] rounded border border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 text-slate-500 transition-colors cursor-pointer"
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
