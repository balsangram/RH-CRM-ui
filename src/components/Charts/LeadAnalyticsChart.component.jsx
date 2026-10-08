import React, { useState } from 'react'

export const LeadAnalyticsChart = ({ className = '' }) => {
  const [filter, setFilter] = useState('year')
  const [activeHoverIdx, setActiveHoverIdx] = useState(11) // Default hover on 'Jan'
  const [customStartDate, setCustomStartDate] = useState('2026-01-01')
  const [customEndDate, setCustomEndDate] = useState('2026-10-08')

  // Datasets matching the inspiration layout
  const dataPresets = {
    year: [
      { label: 'Feb', holiday: 1800, visa: 1000, fullDate: 'February 2025' },
      { label: 'Mar', holiday: 4600, visa: 2000, fullDate: 'March 2025' },
      { label: 'Apr', holiday: 3800, visa: 0, fullDate: 'April 2025' },
      { label: 'May', holiday: 4200, visa: 0, fullDate: 'May 2025' },
      { label: 'Jun', holiday: 5100, visa: 0, fullDate: 'June 2025' },
      { label: 'Jul', holiday: 6300, visa: 0, fullDate: 'July 2025' },
      { label: 'Aug', holiday: 5100, visa: 0, fullDate: 'August 2025' },
      { label: 'Sep', holiday: 5900, visa: 0, fullDate: 'September 2025' },
      { label: 'Oct', holiday: 6700, visa: 0, fullDate: 'October 2025' },
      { label: 'Nov', holiday: 7100, visa: 0, fullDate: 'November 2025' },
      { label: 'Dec', holiday: 6200, visa: 0, fullDate: 'December 2025' },
      { label: 'Jan', holiday: 6960, visa: 8400, fullDate: 'January 2026' },
      { label: 'Feb', holiday: 5400, visa: 0, fullDate: 'February 2026' },
      { label: 'Mar', holiday: 0, visa: 0, fullDate: 'March 2026' },
    ],
    month: [
      { label: 'W1', holiday: 1800, visa: 2400, fullDate: 'Week 1' },
      { label: 'W2', holiday: 2900, visa: 3100, fullDate: 'Week 2' },
      { label: 'W3', holiday: 3400, visa: 4200, fullDate: 'Week 3' },
      { label: 'W4', holiday: 4100, visa: 5600, fullDate: 'Week 4' },
    ],
    week: [
      { label: 'Mon', holiday: 420, visa: 680, fullDate: 'Monday' },
      { label: 'Tue', holiday: 510, visa: 750, fullDate: 'Tuesday' },
      { label: 'Wed', holiday: 480, visa: 820, fullDate: 'Wednesday' },
      { label: 'Thu', holiday: 620, visa: 910, fullDate: 'Thursday' },
      { label: 'Fri', holiday: 790, visa: 1100, fullDate: 'Friday' },
      { label: 'Sat', holiday: 550, visa: 690, fullDate: 'Saturday' },
      { label: 'Sun', holiday: 380, visa: 450, fullDate: 'Sunday' },
    ],
    today: [
      { label: '09:00', holiday: 4500, visa: 2500, fullDate: '09:00 AM' },
      { label: '11:00', holiday: 8500, visa: 4000, fullDate: '11:00 AM' },
      { label: '13:00', holiday: 1100, visa: 1600, fullDate: '01:00 PM' },
      { label: '15:00', holiday: 9500, visa: 1400, fullDate: '03:00 PM' },
      { label: '17:00', holiday: 1300, visa: 19500, fullDate: '05:00 PM' },
      { label: '19:00', holiday: 800, visa: 1150, fullDate: '07:00 PM' },
      { label: '09:00', holiday: 4500, visa: 2500, fullDate: '09:00 AM' },
      { label: '11:00', holiday: 8500, visa: 4000, fullDate: '11:00 AM' },
      { label: '13:00', holiday: 1100, visa: 1600, fullDate: '01:00 PM' },
      { label: '15:00', holiday: 9500, visa: 1400, fullDate: '03:00 PM' },
      { label: '17:00', holiday: 1300, visa: 19500, fullDate: '05:00 PM' },
      { label: '19:00', holiday: 800, visa: 1150, fullDate: '07:00 PM' },
    ],
    custom: [
      { label: 'Day 1', holiday: 320, visa: 480, fullDate: 'Custom Day 1' },
      { label: 'Day 2', holiday: 410, visa: 590, fullDate: 'Custom Day 2' },
      { label: 'Day 3', holiday: 550, visa: 720, fullDate: 'Custom Day 3' },
      { label: 'Day 4', holiday: 480, visa: 640, fullDate: 'Custom Day 4' },
      { label: 'Day 5', holiday: 620, visa: 890, fullDate: 'Custom Day 5' },
    ],
  }

  const chartData = dataPresets[filter] || dataPresets.year
  const maxScale = 10500
  const yAxisTicks = [10500, 7500, 5000, 2500, 0]

  return (
    <div className={`bg-surface rounded-2xl border border-border p-4 sm:p-5 shadow-2xs flex flex-col justify-between ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          <h2 className="text-base font-bold text-main flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)]" />
            Lead Analytics Overview
          </h2>
          <p className="text-[11px] text-muted mt-0.5">
            Comparison of Holiday Leads vs. Visa Leads received
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'year', label: 'This Year' },
            { id: 'custom', label: 'Custom Date' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                filter === tab.id
                  ? 'crm-btn-primary text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Interval Inputs */}
      {filter === 'custom' && (
        <div className="mt-3 flex flex-wrap items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
          <span className="font-bold text-main">Range:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-muted">Start:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-2 py-0.5 rounded-md border border-border bg-white text-main"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted">End:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-2 py-0.5 rounded-md border border-border bg-white text-main"
            />
          </div>
        </div>
      )}

      {/* Chart Legend */}
      <div className="flex items-center gap-5 mt-3 mb-1 text-[11px] font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)]" />
          <span className="text-main">Holiday Leads</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-red)]" />
          <span className="text-main">Visa Leads</span>
        </div>
      </div>

      {/* Bar Chart Graphics Area (Scaled down to h-48 for viewport compliance) */}
      <div className="relative mt-2 pt-5 flex items-stretch gap-3 h-48">
        {/* Y-Axis Numerical Labels */}
        <div className="flex flex-col justify-between text-[10px] font-medium text-slate-400 select-none pr-2 border-r border-slate-100">
          {yAxisTicks.map((val) => (
            <span key={val}>{val.toLocaleString()}</span>
          ))}
        </div>

        {/* Columns Grid */}
        <div className="flex-1 flex items-end justify-between gap-1.5 relative h-full">
          {chartData.map((item, idx) => {
            const isHovered = activeHoverIdx === idx
            // Compute percentage heights relative to max scale (10,500)
            const hPct = Math.min(Math.round((item.holiday / maxScale) * 100), 100)
            const vPct = Math.min(Math.round((item.visa / maxScale) * 100), 100)

            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveHoverIdx(idx)}
                className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              >
                {/* Floating Interactive Card Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 z-30 bg-white border border-slate-200/90 rounded-lg p-2 shadow-lg min-w-[120px] pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <p className="text-[10px] font-bold text-slate-800 pb-0.5 border-b border-slate-100 mb-0.5">
                      {item.fullDate}
                    </p>
                    <div className="space-y-0.5 text-[10px] font-semibold">
                      <div className="flex items-center gap-1 text-[var(--brand-primary)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" />
                        <span>Holiday: {item.holiday ? item.holiday.toLocaleString() : '0'}</span>
                      </div>
                      {item.visa > 0 && (
                        <div className="flex items-center gap-1 text-[var(--brand-red)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-red)]" />
                          <span>Visa: {item.visa.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Striped Background Track Capsule */}
                <div className="w-full h-full rounded-full bg-slate-100/80 border border-slate-200/50 relative overflow-hidden flex flex-col justify-end p-0.5 group-hover:border-slate-300 transition-colors">
                  {/* Background Striped Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(135deg, #CBD5E1, #CBD5E1 3px, transparent 3px, transparent 6px)',
                    }}
                  />

                  {/* Primary Rounded Pill Bar (Holiday Leads) */}
                  {hPct > 0 && (
                    <div
                      style={{ height: `${hPct}%` }}
                      className={`w-full rounded-full bg-[var(--brand-primary)] transition-all duration-300 relative z-10 ${
                        isHovered ? 'brightness-110 shadow-md' : ''
                      }`}
                    />
                  )}

                  {/* Secondary Overlay Pill Bar (Visa Leads) */}
                  {vPct > 0 && (
                    <div
                      style={{ height: `${vPct}%` }}
                      className={`w-full rounded-full bg-[var(--brand-red)] transition-all duration-300 absolute bottom-0 left-0 right-0 z-20 ${
                        isHovered ? 'brightness-110 shadow-md' : ''
                      }`}
                    />
                  )}
                </div>

                {/* X-Axis Label */}
                <span
                  className={`text-[10px] mt-1.5 transition-all ${
                    isHovered ? 'font-black text-main' : 'font-medium text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default LeadAnalyticsChart
