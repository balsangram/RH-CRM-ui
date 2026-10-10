import React from 'react'

/**
 * Base Skeleton Element Component
 */
export const Skeleton = ({
  className = '',
  width = '100%',
  height = '1rem',
  rounded = 'rounded-md',
}) => {
  return (
    <div
      className={`skeleton-shimmer ${rounded} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

/**
 * Stat Card Skeleton Placeholder Component
 */
export const StatCardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-surface rounded-lg p-2.5 sm:p-3 border border-border shadow-2xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-full">
              <Skeleton width="1.75rem" height="1.75rem" rounded="rounded-md" />
              <div className="space-y-1 flex-1">
                <Skeleton width="70%" height="0.65rem" />
                <Skeleton width="45%" height="0.55rem" />
              </div>
            </div>
          </div>
          <div className="pt-1">
            <Skeleton width="40%" height="1.25rem" rounded="rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Table Skeleton Placeholder Component
 */
export const TableSkeleton = ({ columnsCount = 6, rowsCount = 5, className = '' }) => {
  return (
    <div className={`w-full overflow-hidden rounded-xl border border-border bg-surface shadow-xs ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-primary-light/60 border-b border-border">
            <tr>
              {Array.from({ length: columnsCount }).map((_, colIdx) => (
                <th key={colIdx} className="px-4 py-3">
                  <Skeleton width="60%" height="0.7rem" rounded="rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: rowsCount }).map((_, rowIdx) => (
              <tr key={rowIdx} className="bg-surface">
                {Array.from({ length: columnsCount }).map((_, colIdx) => (
                  <td key={colIdx} className="px-4 py-3 whitespace-nowrap">
                    <Skeleton
                      width={colIdx === 0 ? '40%' : colIdx === 1 ? '80%' : '65%'}
                      height="0.75rem"
                      rounded="rounded"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Generic Card Skeleton Component
 */
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-surface rounded-xl border border-border p-4 shadow-2xs space-y-3 ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <Skeleton width="35%" height="1rem" rounded="rounded" />
        <Skeleton width="15%" height="0.75rem" rounded="rounded" />
      </div>
      <div className="space-y-2">
        <Skeleton width="100%" height="0.75rem" />
        <Skeleton width="90%" height="0.75rem" />
        <Skeleton width="75%" height="0.75rem" />
      </div>
    </div>
  )
}

/**
 * Analytics Chart Skeleton Placeholder Component
 */
export const ChartSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-surface rounded-xl border border-border p-4 shadow-2xs space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="space-y-1">
          <Skeleton width="140px" height="1rem" />
          <Skeleton width="200px" height="0.65rem" />
        </div>
        <Skeleton width="80px" height="1.5rem" rounded="rounded-lg" />
      </div>

      <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <Skeleton
              width="80%"
              height={`${Math.floor(Math.random() * 60) + 30}%`}
              rounded="rounded-t-sm"
            />
            <Skeleton width="60%" height="0.55rem" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Full Page Skeleton Layout Component
 */
export const PageSkeleton = () => {
  return (
    <div className="space-y-4 pb-6 animate-in fade-in duration-300">
      {/* Page Header Banner Skeleton */}
      <div className="p-4 rounded-xl bg-slate-200 border border-slate-300 space-y-2">
        <Skeleton width="25%" height="1.25rem" />
        <Skeleton width="45%" height="0.75rem" />
      </div>

      {/* 4 Stat Cards Skeleton */}
      <StatCardSkeleton count={4} />

      {/* Main Table Skeleton */}
      <TableSkeleton columnsCount={6} rowsCount={5} />
    </div>
  )
}

export default Skeleton
