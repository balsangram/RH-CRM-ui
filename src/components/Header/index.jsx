import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import ROUTES from '../../config/routes'

export const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-header-border bg-header-bg/95 backdrop-blur-md px-4 sm:px-6">
      {/* Left section: mobile toggle & search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-header-muted hover:text-header-text hover:bg-primary-light lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Global Search Bar */}
        <div className="relative max-w-md w-full hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-header-muted">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="search"
            placeholder="Search leads, customers, passports, applications..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-primary-light/40 border border-header-border rounded-lg text-header-text placeholder-header-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Right section: notifications & profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Link
          to={ROUTES.NOTIFICATIONS}
          className="relative p-2 rounded-lg text-header-muted hover:text-header-text hover:bg-primary-light transition-colors"
          title="Notifications"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger ring-2 ring-header-bg" />
        </Link>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-primary-light transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white font-semibold flex items-center justify-center text-xs shadow-xs">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'RH'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-header-text leading-tight">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-[10px] text-header-muted capitalize">
                {user?.role || 'Super Admin'}
              </p>
            </div>
            <svg className="w-4 h-4 text-header-muted hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-header-bg rounded-xl shadow-xl border border-header-border py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-header-border">
                <p className="text-xs font-medium text-header-muted">Signed in as</p>
                <p className="text-sm font-semibold text-header-text truncate">
                  {user?.email || 'admin@rhglobal.com'}
                </p>
              </div>
              <Link
                to={ROUTES.SETTINGS}
                onClick={() => setUserMenuOpen(false)}
                className="block px-4 py-2 text-sm text-header-text hover:bg-primary-light"
              >
                Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
