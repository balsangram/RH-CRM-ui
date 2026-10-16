import ROUTES from './routes'
import { PERMISSIONS } from '../utils/permissions'

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import BusinessIcon from '@mui/icons-material/Business'
import LuggageIcon from '@mui/icons-material/Luggage'
import AssignmentIcon from '@mui/icons-material/Assignment'
import BarChartIcon from '@mui/icons-material/BarChart'
import BadgeIcon from '@mui/icons-material/Badge'
import CardTravelIcon from '@mui/icons-material/CardTravel'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import RateReviewIcon from '@mui/icons-material/RateReview'

export const SIDEBAR_ITEMS = [
  {
    title: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: DashboardIcon,
  },
  {
    title: 'Leads',
    path: ROUTES.LEADS,
    icon: GroupAddIcon,
    permission: PERMISSIONS.LEADS_VIEW,
  },
  {
    title: 'Visa Cases',
    path: ROUTES.VISA,
    icon: FlightTakeoffIcon,
    permission: PERMISSIONS.VISA_VIEW,
  },
  {
    title: 'Holiday Cases',
    path: ROUTES.HOLIDAYS,
    icon: BeachAccessIcon,
    permission: PERMISSIONS.HOLIDAYS_VIEW,
  },  
  {
    title: 'Companies',
    path: ROUTES.COMPANIES,
    icon: BusinessIcon,
    permission: PERMISSIONS.COMPANIES_VIEW,
  },
  {
    title: 'Travellers',
    path: ROUTES.TRAVELLERS,
    icon: LuggageIcon,
  },
  {
    title: 'Finance',
    path: ROUTES.FINANCE,
    icon: AccountBalanceWalletIcon,
  },
  // {
  //   title: 'Cases',
  //   path: ROUTES.APPLICATIONS,
  //   icon: AssignmentIcon,
  //   permission: PERMISSIONS.APPLICATIONS_VIEW,
  // },
  {
    title: 'Administration',
    divider: true,
  },
  {
    title: 'Staff & Roles',
    path: ROUTES.EMPLOYEES,
    icon: BadgeIcon,
    permission: PERMISSIONS.EMPLOYEES_MANAGE,
  },
  {
    title: 'Packages',
    path: ROUTES.PACKAGES,
    icon: CardTravelIcon,
    permission: PERMISSIONS.PACKAGES_VIEW,
  },
  {
    title: 'Reports & Analytics',
    path: ROUTES.REPORTS,
    icon: BarChartIcon,
    permission: PERMISSIONS.REPORTS_VIEW,
  },
  {
    title: 'Logs',
    path: ROUTES.AUDIT_LOGS,
    icon: FileDownloadIcon,
    permission: PERMISSIONS.AUDIT_LOGS_VIEW,
  },
  {
    title: 'Reviews & Ratings',
    path: ROUTES.REVIEWS,
    icon: RateReviewIcon,
    permission: PERMISSIONS.REVIEWS_MANAGE,
  },
]

export default SIDEBAR_ITEMS

