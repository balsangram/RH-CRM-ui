/**
 * Format currency amount
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format date string into human readable format
 * @param {string|Date} date
 * @param {Intl.DateTimeFormatOptions} options
 * @returns {string}
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(d)
}

/**
 * Get status color badge CSS classes
 * @param {string} status
 * @returns {{ bg: string, text: string, border: string }}
 */
export const getStatusBadgeStyle = (status = '') => {
  const normalized = status.toLowerCase()
  switch (normalized) {
    case 'approved':
    case 'completed':
    case 'active':
    case 'won':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        badge: 'bg-emerald-500',
      }
    case 'pending':
    case 'in_progress':
    case 'under_review':
      return {
        bg: 'bg-amber-50 text-amber-700 border border-amber-200',
        badge: 'bg-amber-500',
      }
    case 'rejected':
    case 'failed':
    case 'cancelled':
    case 'lost':
      return {
        bg: 'bg-rose-50 text-rose-700 border border-rose-200',
        badge: 'bg-rose-500',
      }
    case 'new':
    case 'draft':
      return {
        bg: 'bg-sky-50 text-sky-700 border border-sky-200',
        badge: 'bg-sky-500',
      }
    default:
      return {
        bg: 'bg-slate-100 text-slate-700 border border-slate-200',
        badge: 'bg-slate-400',
      }
  }
}

/**
 * Capitalize first letter of string
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str = '') => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Truncate long strings
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
export const truncate = (str = '', length = 30) => {
  if (!str) return ''
  return str.length > length ? `${str.slice(0, length)}...` : str
}
