import { useMemo } from 'react'
import useAuth from './useAuth'
import { hasPermission, hasRole } from '../utils/permissions'

export const usePermission = () => {
  const { user } = useAuth()

  const permissions = useMemo(() => user?.permissions || [], [user])
  const role = useMemo(() => user?.role || '', [user])

  const can = (permission) => {
    // Staff (AGENT/STAFF) permissions: remove leads, show visa and holiday cases
    if (['AGENT', 'STAFF'].includes(role)) {
      if (permission === 'leads:view') return false
      if (permission === 'visa:view' || permission === 'holidays:view') return true
    }

    // Reviews & Ratings is strictly admin-only
    if (permission === 'reviews:manage') {
      return ['SUPER_ADMIN', 'ADMIN'].includes(role)
    }

    if (permission === 'companies:view' || permission === 'customers:view') {
      if (['SUPER_ADMIN', 'ADMIN', 'AGENT', 'STAFF', 'MANAGER'].includes(role)) {
        return true
      }
    }
    return hasPermission(permissions, permission)
  }

  const isRole = (...roles) => {
    return hasRole(role, roles)
  }

  const isSuperAdmin = role === 'SUPER_ADMIN'
  const isAdmin = role === 'ADMIN' || isSuperAdmin

  return {
    permissions,
    role,
    can,
    isRole,
    isAdmin,
    isSuperAdmin,
  }
}

export default usePermission
