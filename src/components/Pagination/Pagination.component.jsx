import React from 'react'

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 5,
  onItemsPerPageChange = null,
  pageSizeOptions = [5, 10, 20, 50],
  className = '',
}) => {
  if (totalPages <= 0 && totalItems <= 0) return null

  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1))
  const startItem = totalItems > 0 ? (validCurrentPage - 1) * itemsPerPage + 1 : 0
  const endItem = Math.min(validCurrentPage * itemsPerPage, totalItems)

  // Smart page number generation (with ellipsis if pages > 7)
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages = []
    pages.push(1)

    if (validCurrentPage > 3) {
      pages.push('...')
    }

    const start = Math.max(2, validCurrentPage - 1)
    const end = Math.min(totalPages - 1, validCurrentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (validCurrentPage < totalPages - 2) {
      pages.push('...')
    }

    pages.push(totalPages)
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 mt-2 border-t border-border/70 text-xs text-muted ${className}`}>
      {/* Left Details & Rows Per Page Option */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
        {totalItems > 0 && (
          <span className="text-xs text-muted">
            Showing <strong className="text-main font-bold">{startItem}</strong>–
            <strong className="text-main font-bold">{endItem}</strong> of{' '}
            <strong className="text-main font-bold">{totalItems}</strong> entries
          </span>
        )}

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 sm:pl-3.5 sm:border-l sm:border-border/70">
            <span className="text-[11px] font-semibold text-muted">Per page:</span>
            <div className="flex items-center gap-1">
              {pageSizeOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onItemsPerPageChange(opt)
                    if (onPageChange) onPageChange(1)
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    itemsPerPage === opt
                      ? 'bg-primary text-white shadow-2xs font-extrabold'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Page Navigation Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange && onPageChange(validCurrentPage - 1)}
          disabled={validCurrentPage <= 1}
          className="px-2 py-1 rounded border border-border bg-slate-50 text-main hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold transition-colors flex items-center gap-1 text-[11px]"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Prev</span>
        </button>

        {/* Number Buttons */}
        {pageNumbers.map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-1.5 py-0.5 text-muted select-none">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange && onPageChange(page)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                validCurrentPage === page
                  ? 'bg-primary text-white shadow-2xs'
                  : 'border border-border bg-slate-50 text-main hover:bg-slate-100 hover:text-primary'
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange && onPageChange(validCurrentPage + 1)}
          disabled={validCurrentPage >= totalPages}
          className="px-2 py-1 rounded border border-border bg-slate-50 text-main hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold transition-colors flex items-center gap-1 text-[11px]"
        >
          <span>Next</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Pagination
