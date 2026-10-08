import React from 'react'
import { NavLink } from 'react-router-dom'
import SIDEBAR_ITEMS from '../../config/sidebar'
import usePermission from '../../hooks/usePermission'

export const Sidebar = ({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { can } = usePermission()

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container - Flush Left Vertical Layout */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col crm-sidebar transition-all duration-300 ease-in-out lg:static lg:h-screen shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20 w-64' : 'lg:w-64 w-64'}`}
      >
        {/* Brand Header */}
        <div className={`flex items-center h-16 px-4 border-b border-white/10 transition-all ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Red Circle Brand Logo Badge */}
            <div className="h-9 w-9 rounded-full bg-[#E11D2E] text-white font-black flex items-center justify-center text-sm shadow-md flex-shrink-0">
              RH
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="font-bold text-white text-base tracking-tight leading-none block truncate">
                  RH Global
                </span>
                <span className="text-[10px] uppercase font-bold text-[#E11D2E] tracking-wider block mt-0.5">
                  CRM PORTAL
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle Button */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white items-center justify-center transition-all cursor-pointer"
              title="Collapse Sidebar"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Collapsed Expand Toggle */}
        {isCollapsed && (
          <div className="hidden lg:flex justify-center py-2 border-b border-white/10">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Expand Sidebar"
            >
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-1 scrollbar-none">
          {SIDEBAR_ITEMS.map((item, index) => {
            if (item.divider) {
              return (
                <div key={index} className="pt-4 pb-1">
                  {!isCollapsed ? (
                    <p className="px-4 text-[10px] font-bold tracking-widest text-white/40 uppercase">
                      {item.title}
                    </p>
                  ) : (
                    <div className="border-t border-white/10 my-2 mx-3" />
                  )}
                </div>
              )
            }

            if (item.permission && !can(item.permission)) {
              return null
            }

            return (
              <NavLink
                key={item.path || index}
                to={item.path}
                onClick={() => onClose?.()}
                title={isCollapsed ? item.title : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 transition-all duration-150 ${
                    isCollapsed
                      ? 'w-12 h-10 mx-auto justify-center rounded-lg'
                      : 'px-4 py-2.5 rounded-r-xl text-sm'
                  } ${
                    isActive
                      ? 'crm-sidebar-nav-active'
                      : 'crm-sidebar-nav-item'
                  }`
                }
              >
                {/* Round Badge Initials Icon (matching original design) */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-colors ${
                  isCollapsed ? '' : ''
                } bg-white/10 text-white/80`}>
                  {item.badge || item.title.slice(0, 2).toUpperCase()}
                </div>

                {!isCollapsed && <span className="truncate font-medium">{item.title}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* Sidebar Footer Info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs font-bold text-white">RH Global v1.0</p>
              <p className="text-[10px] text-white/50 mt-0.5">Enterprise Travel & Visa CRM</p>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar
