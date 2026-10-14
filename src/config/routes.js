export const ROUTES = {
  // Public
  LOGIN: '/login',

  // Admin / Staff
  DASHBOARD: '/dashboard',
  STAFF_DASHBOARD: '/staff/dashboard',

  LEADS: '/leads',
  LEADS_ADD: '/leads/add',
  LEADS_EDIT: '/leads/edit/:id',

  COMPANIES: '/companies',
  COMPANIES_ADD: '/companies/add',
  COMPANIES_EDIT: '/companies/edit/:id',
  COMPANIES_DETAIL: '/companies/:id',

  // Backward compatibility alias for CUSTOMERS
  CUSTOMERS: '/companies',
  CUSTOMERS_ADD: '/companies/add',
  CUSTOMERS_EDIT: '/companies/edit/:id',

  TRAVELLERS: '/travellers',
  TRAVELLERS_ADD: '/travellers/add',
  TRAVELLERS_EDIT: '/travellers/edit/:id',

  APPLICATIONS: '/applications',
  APPLICATIONS_ADD: '/applications/add',
  APPLICATIONS_EDIT: '/applications/edit/:id',

  HOLIDAYS: '/holidays',
  HOLIDAYS_ADD: '/holidays/add',
  HOLIDAYS_EDIT: '/holidays/edit/:id',

  TASKS: '/tasks',
  TASKS_ADD: '/tasks/add',
  TASKS_EDIT: '/tasks/edit/:id',

  VISA: '/visa',
  VISA_ADD: '/visa/add',
  VISA_EDIT: '/visa/edit/:id',

  PACKAGES: '/packages',
  PACKAGES_VISA_DETAIL: '/packages/visa/:id',
  PACKAGES_HOLIDAY_DETAIL: '/packages/holiday/:id',

  REPORTS: '/reports',

  EMPLOYEES: '/employees',
  EMPLOYEES_ADD: '/employees/add',
  EMPLOYEES_EDIT: '/employees/edit/:id',

  ROLES: '/roles',
  NOTIFICATIONS: '/notifications',
  AUDIT_LOGS: '/audit-logs',
  SETTINGS: '/settings',

  // Customer Portal
  CUSTOMER_PORTAL: {
    DASHBOARD: '/portal',
    APPLICATIONS: '/portal/applications',
    HOLIDAYS: '/portal/holidays',
    PROFILE: '/portal/profile',
  },
}

export default ROUTES
