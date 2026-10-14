import { useMemo } from 'react'
import useAuth from './useAuth'
import { hasPermission, hasRole } from '../utils/permissions'

export const usePermission = () => {
  const { user } = useAuth()

  const permissions = useMemo(() => user?.permissions || [], [user])
  const role = useMemo(() => user?.role || '', [user])

  const can = (permission) => {
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
