import React, { useEffect } from 'react'

export const ConfirmModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Logout',
  message = 'Are you sure you want to log out of your session?',
  confirmText = 'Yes, Log Out',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'primary'
  icon = null,
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Variant styling
  const variantStyles = {
    danger: {
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-200/80',
      confirmBtn: 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-xs focus:ring-rose-500/20',
      defaultIcon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      ),
    },
    warning: {
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-200/80',
      confirmBtn: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-xs focus:ring-amber-500/20',
      defaultIcon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    primary: {
      iconBg: 'bg-slate-100 text-[#2E2B6E] border border-slate-200',
      confirmBtn: 'bg-gradient-to-r from-[#0F0E2B] to-[#2E2B6E] hover:from-[#181445] hover:to-[#221F56] text-white shadow-xs focus:ring-indigo-500/20',
      defaultIcon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  }

  const currentVariant = variantStyles[variant] || variantStyles.danger

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Confirmation Dialog Box */}
      <div className="relative w-full max-w-[340px] bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden transform transition-all z-10 animate-in fade-in zoom-in-95 duration-150 font-sans p-4.5 space-y-3">
        {/* Top Header: Icon + Title + Close Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${currentVariant.iconBg}`}
            >
              {icon || currentVariant.defaultIcon}
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight truncate">
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer text-xs font-semibold shrink-0"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Text Content */}
        <p className="text-xs text-slate-500 leading-relaxed font-normal">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="pt-1 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-2xs hover:border-slate-300"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer focus:outline-none focus:ring-2 flex items-center gap-1.5 ${currentVariant.confirmBtn}`}
          >
            {isLoading && (
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal

