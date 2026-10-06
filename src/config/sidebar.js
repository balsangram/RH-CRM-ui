import ROUTES from './routes'
import { PERMISSIONS } from '../utils/permissions'

export const SIDEBAR_ITEMS = [
  {
    title: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'Dashboard',
  },
  {
    title: 'Leads',
    path: ROUTES.LEADS,
    icon: 'GroupAdd',
    permission: PERMISSIONS.LEADS_VIEW,
  },
  {
    title: 'Customers',
    path: ROUTES.CUSTOMERS,
    icon: 'People',
    permission: PERMISSIONS.CUSTOMERS_VIEW,
  },
  {
    title: 'Travellers',
    path: ROUTES.TRAVELLERS,
    icon: 'Luggage',
  },
  {
    title: 'Applications',
    path: ROUTES.APPLICATIONS,
    icon: 'Assignment',
    permission: PERMISSIONS.APPLICATIONS_VIEW,
  },
  {
    title: 'Visa Services',
    path: ROUTES.VISA,
    icon: 'FlightTakeoff',
    permission: PERMISSIONS.VISA_VIEW,
  },
  {
    title: 'Documents',
    path: ROUTES.DOCUMENTS,
    icon: 'FolderShared',
  },
  {
    title: 'Tasks',
    path: ROUTES.TASKS,
    icon: 'CheckCircleOutline',
  },
  {
    title: 'Reports & Analytics',
    path: ROUTES.REPORTS,
    icon: 'BarChart',
    permission: PERMISSIONS.REPORTS_VIEW,
  },
  {
    title: 'Administration',
    divider: true,
  },
  {
    title: 'Employees',
    path: ROUTES.EMPLOYEES,
    icon: 'Badge',
    permission: PERMISSIONS.EMPLOYEES_MANAGE,
  },
  {
    title: 'Roles & Permissions',
    path: ROUTES.ROLES,
    icon: 'AdminPanelSettings',
    permission: PERMISSIONS.ROLES_MANAGE,
  },
  {
    title: 'Audit Logs',
    path: ROUTES.AUDIT_LOGS,
    icon: 'History',
    permission: PERMISSIONS.AUDIT_LOGS_VIEW,
  },
  {
    title: 'Settings',
    path: ROUTES.SETTINGS,
    icon: 'Settings',
    permission: PERMISSIONS.SETTINGS_MANAGE,
  },
]

export default SIDEBAR_ITEMS
