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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
              RH
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight">RH Global</span>
              <span className="block text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">
                CRM Portal
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
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
                  <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
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
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <span className="text-xs font-mono uppercase bg-slate-800/80 p-1 rounded text-slate-300">
                  {item.icon ? item.icon.slice(0, 2) : '•'}
                </span>
                <span>{item.title}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800">
          <div className="rounded-xl bg-slate-800/50 p-3 text-xs text-slate-400 border border-slate-700/50">
            <p className="font-medium text-slate-200">RH Global v1.0</p>
            <p className="text-[11px] mt-0.5">Enterprise Travel & Visa CRM</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
