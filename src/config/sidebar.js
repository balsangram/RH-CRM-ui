import ROUTES from './routes'
import { PERMISSIONS } from '../utils/permissions'

export const SIDEBAR_ITEMS = [
  {
    title: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'Dashboard',
    badge: 'DA',
  },
  // {
  //   title: 'Staff Dashboard',
  //   path: ROUTES.STAFF_DASHBOARD,
  //   icon: 'AssignmentInd',
  //   badge: 'SD',
  // },
  {
    title: 'Leads',
    path: ROUTES.LEADS,
    icon: 'GroupAdd',
    badge: 'GR',
    permission: PERMISSIONS.LEADS_VIEW,
  },
  {
    title: 'Customers',
    path: ROUTES.CUSTOMERS,
    icon: 'People',
    badge: 'PE',
    permission: PERMISSIONS.CUSTOMERS_VIEW,
  },
  {
    title: 'Travellers',
    path: ROUTES.TRAVELLERS,
    icon: 'Luggage',
    badge: 'LU',
  },
  {
    title: 'Applications',
    path: ROUTES.APPLICATIONS,
    icon: 'Assignment',
    badge: 'AS',
    permission: PERMISSIONS.APPLICATIONS_VIEW,
  },
  {
    title: 'Visa Services',
    path: ROUTES.VISA,
    icon: 'FlightTakeoff',
    badge: 'FL',
    permission: PERMISSIONS.VISA_VIEW,
  },
  {
    title: 'Holidays',
    path: ROUTES.HOLIDAYS,
    icon: 'BeachAccess',
    badge: 'BE',
    permission: PERMISSIONS.HOLIDAYS_VIEW,
  },
  {
    title: 'Reports & Analytics',
    path: ROUTES.REPORTS,
    icon: 'BarChart',
    badge: 'BA',
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
    badge: 'BA',
    permission: PERMISSIONS.EMPLOYEES_MANAGE,
  },
  {
    title: 'Roles & Permissions',
    path: ROUTES.ROLES,
    icon: 'AdminPanelSettings',
    badge: 'AD',
    permission: PERMISSIONS.ROLES_MANAGE,
  },
  // {
  //   title: 'Audit Logs',
  //   path: ROUTES.AUDIT_LOGS,
  //   icon: 'History',
  //   badge: 'HI',
  //   permission: PERMISSIONS.AUDIT_LOGS_VIEW,
  // },
  // {
  //   title: 'Settings',
  //   path: ROUTES.SETTINGS,
  //   icon: 'Settings',
  //   badge: 'SE',
  //   permission: PERMISSIONS.SETTINGS_MANAGE,
  // },
]

export default SIDEBAR_ITEMS
