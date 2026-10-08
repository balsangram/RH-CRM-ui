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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between crm-header px-4 sm:px-6">
      {/* Left section: mobile toggle */}
      <div className="flex items-center gap-4 flex-1">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg crm-header-icon-btn lg:hidden transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Right section: User profile menu */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            {/* Red Circle User Avatar matching original Image 1 */}
            <div className="w-8 h-8 rounded-full bg-[#E11D2E] text-white font-bold flex items-center justify-center text-xs shadow-sm">
              SA
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold leading-tight text-white">
                {user?.name || 'Sarah Connor'}
              </p>
              <p className="text-[10px] text-white/60 uppercase font-bold tracking-wider leading-tight">
                {user?.role || 'ADMIN'}
              </p>
            </div>
            <svg className="w-4 h-4 text-white/70 hidden sm:block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 crm-dropdown-menu rounded-xl border py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-white/10">
                <p className="text-xs font-medium opacity-70">Signed in as</p>
                <p className="text-sm font-semibold truncate">
                  {user?.email || 'sarah.connor@rhglobal.com'}
                </p>
              </div>
              <Link
                to={ROUTES.SETTINGS}
                onClick={() => setUserMenuOpen(false)}
                className="block px-4 py-2 text-sm crm-dropdown-item"
              >
                Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-secondary font-medium hover:bg-secondary/10 transition-colors"
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
