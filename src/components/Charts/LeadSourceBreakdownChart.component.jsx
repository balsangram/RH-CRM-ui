import React from 'react'

export const LeadSourceBreakdownChart = ({ className = '' }) => {
  return (
    <div className={`bg-surface rounded-2xl border border-border p-4 sm:p-5 shadow-2xs flex flex-col justify-between h-full ${className}`}>
      {/* Header */}
      <div className="pb-3 border-b border-border/60">
        <h2 className="text-base font-bold text-main flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-red)]" />
          Lead Sources Channels
        </h2>
        <p className="text-[11px] text-muted mt-0.5">Distribution of lead inquiries by acquisition channel</p>
      </div>

      {/* Enlarged Concentric Circle Graphic */}
      <div className="my-auto py-3 flex items-center justify-center">
        <div className="relative w-56 h-56 rounded-full flex items-center justify-center border border-slate-200 shadow-inner overflow-hidden p-2.5 bg-slate-50">
          {/* Background Striped Pattern */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, #CBD5E1, #CBD5E1 3px, transparent 3px, transparent 6px)',
            }}
          />

          {/* Outer Ring Circle 1 (45% Website) */}
          <div className="w-52 h-52 rounded-full bg-[var(--brand-primary)]/15 border border-[var(--brand-primary)]/35 flex flex-col items-center pt-3 relative z-10 transition-transform hover:scale-105 duration-200">
            <span className="text-sm font-black text-main leading-tight">45%</span>
            <span className="text-xs font-bold text-muted leading-tight">Website</span>

            {/* Ring Circle 2 (32% WhatsApp) */}
            <div className="w-40 h-40 rounded-full bg-[var(--brand-red)]/20 border border-[var(--brand-red)]/40 flex flex-col items-center pt-2.5 mt-1 shadow-2xs transition-transform hover:scale-105 duration-200">
              <span className="text-xs font-black text-main leading-tight">32%</span>
              <span className="text-[11px] font-bold text-muted leading-tight">WhatsApp</span>

              {/* Ring Circle 3 (18% Referral) */}
              <div className="w-28 h-28 rounded-full bg-blue-100 border border-blue-300 flex flex-col items-center pt-2 mt-1 shadow-2xs transition-transform hover:scale-105 duration-200">
                <span className="text-[11px] font-black text-blue-900 leading-tight">18%</span>
                <span className="text-[9px] font-bold text-blue-700 leading-tight">Referral</span>

                {/* Inner Circle 4 (15% Email & Social) */}
                <div className="w-18 h-18 rounded-full bg-[var(--brand-primary)] text-white flex flex-col items-center justify-center shadow-xs mt-1 transition-transform hover:scale-105 duration-200">
                  <span className="text-[10px] font-black leading-tight">15%</span>
                  <span className="text-[8px] font-semibold text-white/90 leading-tight mt-0.5">Email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadSourceBreakdownChart
