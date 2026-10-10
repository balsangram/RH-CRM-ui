import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import SIDEBAR_ITEMS from '../../config/sidebar'
import usePermission from '../../hooks/usePermission'
import useAuth from '../../hooks/useAuth'
import ROUTES from '../../config/routes'

export const Sidebar = ({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { can } = usePermission()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'SA'

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Floating Pill Card Sidebar Panel Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col crm-sidebar transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          isCollapsed ? 'lg:w-20 w-64' : 'lg:w-64 w-64'
        } rounded-r-2xl lg:rounded-2xl lg:relative lg:my-3 lg:ml-3 lg:h-[calc(100vh-1.5rem)] shadow-2xl lg:shadow-xl border-r lg:border border-white/10`}
      >
        {/* Floating Border Expand/Collapse Toggle Button (Desktop Only - matching user reference image) */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex h-7 w-7 rounded-full bg-[#E11D2E] text-white border-2 border-[#181445] shadow-lg items-center justify-center hover:scale-110 transition-all cursor-pointer absolute -right-3.5 top-5 z-30"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Brand Header */}
        <div
          className={`flex items-center h-16 px-4 border-b border-white/10 transition-all ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
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

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-1 scrollbar-none px-2">
          {SIDEBAR_ITEMS.map((item, index) => {
            if (item.divider) {
              return (
                <div key={index} className="pt-4 pb-1">
                  {!isCollapsed ? (
                    <p className="px-3 text-[10px] font-bold tracking-widest text-white/40 uppercase">
                      {item.title}
                    </p>
                  ) : (
                    <div className="border-t border-white/10 my-2 mx-2" />
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
                  `flex items-center gap-3 transition-all duration-150 ${
                    isCollapsed
                      ? 'w-10 h-10 mx-auto justify-center rounded-xl'
                      : 'px-3 py-2.5 rounded-xl text-sm'
                  } ${
                    isActive ? 'crm-sidebar-nav-active' : 'crm-sidebar-nav-item'
                  }`
                }
              >
                {/* Round Badge Initials Icon */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-colors bg-white/10 text-white/80`}
                >
                  {item.badge || item.title.slice(0, 2).toUpperCase()}
                </div>

                {!isCollapsed && <span className="truncate font-medium">{item.title}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* User Profile Section in Sidebar (Desktop & Mobile Drawer) */}
        <div className="p-3 border-t border-white/10 mt-auto">
          {!isCollapsed ? (
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#E11D2E] text-white font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">
                  {userInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate leading-tight">
                    {user?.name || 'Sarah Connor'}
                  </p>
                  <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider truncate leading-tight mt-0.5">
                    {user?.role || 'ADMIN'}
                  </p>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-secondary/20 hover:text-secondary transition-colors cursor-pointer flex-shrink-0"
                title="Sign out"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-full bg-[#E11D2E] text-white font-bold flex items-center justify-center text-xs shadow-sm cursor-pointer"
                title={`${user?.name || 'User'} (${user?.role || 'Role'})`}
              >
                {userInitials}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-white/60 hover:text-secondary hover:bg-secondary/20 transition-colors cursor-pointer"
                title="Sign out"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
