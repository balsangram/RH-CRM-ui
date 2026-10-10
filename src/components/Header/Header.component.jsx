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

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'SA'

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between bg-[#181445] border-b border-white/10 px-3 sm:px-4 text-white shadow-md">
      {/* Left section: mobile toggle button + Brand Logo */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-[#E11D2E] text-white font-black flex items-center justify-center text-xs shadow-xs">
            RH
          </div>
          <span className="font-bold text-white text-sm tracking-tight truncate">RH Global CRM</span>
        </div>
      </div>

      {/* Right section: Mobile User Profile Menu */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-[#E11D2E] text-white font-bold flex items-center justify-center text-[11px]">
            {userInitials}
          </div>
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#181445] rounded-xl border border-white/15 p-1 shadow-2xl z-50 text-white animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b border-white/10">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-white/60 truncate">{user?.email || 'user@example.com'}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-xs text-rose-400 font-bold hover:bg-rose-500/10 rounded-lg transition-colors mt-1 cursor-pointer"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
