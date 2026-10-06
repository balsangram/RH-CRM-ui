import React from 'react'
import { NavLink } from 'react-router-dom'
import SIDEBAR_ITEMS from '../../config/sidebar'
import usePermission from '../../hooks/usePermission'

export const Sidebar = ({ isOpen = false, onClose }) => {
  const { can } = usePermission()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar-bg text-sidebar-text transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center font-bold text-white shadow-md shadow-primary/30">
              RH
            </div>
            <div>
              <span className="font-bold text-sidebar-text text-base tracking-tight">RH Global</span>
              <span className="block text-[10px] uppercase font-semibold text-secondary tracking-wider">
                CRM Portal
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover-bg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {SIDEBAR_ITEMS.map((item, index) => {
            if (item.divider) {
              return (
                <div key={index} className="pt-4 pb-2 px-3">
                  <p className="text-[11px] font-semibold tracking-wider text-sidebar-muted uppercase">
                    {item.title}
                  </p>
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
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sidebar-active-bg text-sidebar-active-text shadow-xs'
                      : 'text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover-bg'
                  }`
                }
              >
                <span className="text-xs font-mono uppercase bg-sidebar-hover-bg p-1 rounded text-sidebar-text">
                  {item.icon ? item.icon.slice(0, 2) : '•'}
                </span>
                <span>{item.title}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="rounded-xl bg-sidebar-hover-bg p-3 text-xs text-sidebar-muted border border-sidebar-border">
            <p className="font-medium text-sidebar-text">RH Global v1.0</p>
            <p className="text-[11px] mt-0.5">Enterprise Travel & Visa CRM</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
