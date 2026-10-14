import React from 'react'

/**
 * Reusable KanbanColumn Component
 */
export const KanbanColumn = ({
  column,
  count = 0,
  emptyText = 'No items in this stage',
  children,
  className = '',
}) => {
  const topBorderClass = column.color || 'border-t-2 border-slate-400'

  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 flex flex-col ${topBorderClass} shadow-2xs overflow-hidden ${className}`}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">{column.title}</h3>
          <span className="w-5 h-5 rounded border border-slate-300 text-[10px] font-bold flex items-center justify-center text-slate-700 bg-slate-50 font-mono">
            {count}
          </span>
        </div>
        {column.subtitle && (
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
            {column.subtitle}
          </p>
        )}
      </div>

      {/* Cards Scrollable / Stack Area */}
      <div className="p-2 space-y-2.5 flex-1 min-h-[220px]">
        {count === 0 ? (
          <div className="border border-dashed border-slate-200 rounded p-4 text-center text-[11px] text-slate-400 mt-2">
            {emptyText}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default KanbanColumn
