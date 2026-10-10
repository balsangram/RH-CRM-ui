import React from 'react'
import {
  Skeleton,
  StatCardSkeleton,
  TableSkeleton,
  CardSkeleton,
  ChartSkeleton,
  PageSkeleton,
} from '../Skeleton/Skeleton.component'

/**
 * Unified Global Skeleton Loader Component Wrapper
 *
 * @param {boolean} isLoading - Whether loading state is active
 * @param {string} type - 'page' | 'table' | 'statCard' | 'chart' | 'card'
 * @param {number} count - Number of skeleton items (for statCard)
 * @param {number} columnsCount - Number of table columns
 * @param {number} rowsCount - Number of table rows
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Content rendered when isLoading is false
 */
export const Loader = ({
  isLoading = true,
  type = 'page',
  count = 4,
  columnsCount = 6,
  rowsCount = 5,
  className = '',
  children = null,
}) => {
  if (!isLoading) {
    return children || null
  }

  if (type === 'table') {
    return <TableSkeleton columnsCount={columnsCount} rowsCount={rowsCount} className={className} />
  }

  if (type === 'statCard') {
    return <StatCardSkeleton count={count} />
  }

  if (type === 'chart') {
    return <ChartSkeleton className={className} />
  }

  if (type === 'card') {
    return <CardSkeleton className={className} />
  }

  // Default Page Skeleton
  return <PageSkeleton />
}

export default Loader
