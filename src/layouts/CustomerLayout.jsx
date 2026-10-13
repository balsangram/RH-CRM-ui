import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import ROUTES from '../config/routes'
import ConfirmModal from '../components/Modal/ConfirmModal.component'

const currentYear = new Date().getFullYear()

export const CustomerLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    setShowLogoutConfirm(false)
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg text-main">
      {/* Customer Header */}
      <header className="border-b border-border bg-surface sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white text-sm">
              RH
            </div>
            <span className="font-semibold text-base">RH Global Customer Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">
              Welcome, <strong className="text-main">{user?.name || 'Customer'}</strong>
            </span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-primary-light font-medium transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Customer Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Customer Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted bg-surface">
        <p>&copy; {currentYear} RH Global Services. All rights reserved.</p>
      </footer>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of the Customer Portal?"
        confirmText="Yes, Log Out"
        cancelText="Cancel"
      />
    </div>
  )
}

export default CustomerLayout

