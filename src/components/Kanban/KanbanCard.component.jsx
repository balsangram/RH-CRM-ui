import React from 'react'

/**
 * Reusable KanbanCard Component
 * Displays an application, case, or task card inside a Kanban board column
 * Matches the design in the user screenshot.
 */
export const KanbanCard = ({
  id,
  badge,
  badgeClassName,
  title,
  subtitle,
  meta = [],
  tags = [],
  actionText = 'View Details →',
  onAction,
  onClick,
  className = '',
  children,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-md p-3 shadow-xs hover:border-slate-400 hover:shadow-sm transition-all space-y-2 text-left ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Top Header: ID & Badge */}
      <div className="flex items-center justify-between gap-1">
        {id && (
          <span className="font-mono text-[11px] text-slate-400 font-semibold tracking-tight">
            {id}
          </span>
        )}
        {badge && (
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 border border-slate-300 text-slate-700 rounded uppercase tracking-wider ${
              badgeClassName || ''
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Main Title & Subtitle */}
      <div>
        {title && <h4 className="text-xs font-bold text-slate-900 leading-snug">{title}</h4>}
        {subtitle && <p className="text-[11px] text-slate-600 mt-0.5">{subtitle}</p>}
      </div>

      {/* Tags if any */}
      {tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-slate-100 text-slate-600 border border-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta rows (Location, Officer, Date) */}
      {meta.length > 0 && (
        <div className="space-y-1 text-[10px] text-slate-500 pt-0.5">
          {meta.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 truncate">
              {item.icon && <span>{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Custom children slot */}
      {children}

      {/* Action Button */}
      {actionText && (
        <button
          type="button"
          onClick={(e) => {
            if (onAction) {
              e.stopPropagation()
              onAction()
            }
          }}
          className="w-full mt-1.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <span>{actionText}</span>
        </button>
      )}
    </div>
  )
}

export default KanbanCard
