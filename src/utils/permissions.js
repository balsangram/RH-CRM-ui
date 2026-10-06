export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  AGENT: 'AGENT',
  ACCOUNTANT: 'ACCOUNTANT',
  CUSTOMER: 'CUSTOMER',
}

export const PERMISSIONS = {
  // Leads
  LEADS_VIEW: 'leads:view',
  LEADS_CREATE: 'leads:create',
  LEADS_EDIT: 'leads:edit',
  LEADS_DELETE: 'leads:delete',

  // Customers
  CUSTOMERS_VIEW: 'customers:view',
  CUSTOMERS_CREATE: 'customers:create',
  CUSTOMERS_EDIT: 'customers:edit',
  CUSTOMERS_DELETE: 'customers:delete',

  // Applications & Visa
  APPLICATIONS_VIEW: 'applications:view',
  APPLICATIONS_MANAGE: 'applications:manage',
  VISA_VIEW: 'visa:view',
  VISA_MANAGE: 'visa:manage',

  // Admin / HR
  EMPLOYEES_MANAGE: 'employees:manage',
  ROLES_MANAGE: 'roles:manage',
  AUDIT_LOGS_VIEW: 'audit_logs:view',
  SETTINGS_MANAGE: 'settings:manage',
  REPORTS_VIEW: 'reports:view',
}

/**
 * Check if a user has a specific permission
 * @param {Array<string>} userPermissions
 * @param {string} requiredPermission
 * @returns {boolean}
 */
export const hasPermission = (userPermissions = [], requiredPermission) => {
  if (!requiredPermission) return true
  if (userPermissions.includes('*') || userPermissions.includes('ALL')) return true
  return userPermissions.includes(requiredPermission)
}

/**
 * Check if user has any of the listed roles
 * @param {string} userRole
 * @param {Array<string>} allowedRoles
 * @returns {boolean}
 */
export const hasRole = (userRole, allowedRoles = []) => {
  if (!allowedRoles || allowedRoles.length === 0) return true
  return allowedRoles.includes(userRole)
}
