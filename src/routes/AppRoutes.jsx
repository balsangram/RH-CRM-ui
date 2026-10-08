import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ROUTES from '../config/routes'

// Layouts
import AdminLayout from '../layouts/AdminLayout'
import CustomerLayout from '../layouts/CustomerLayout'

// Pages - View
import Login from '../pages/Login/Login.view'
import Dashboard from '../pages/Dashboard/Dashboard.view'
import Leads from '../pages/Leads/Leads.view'
import Customers from '../pages/Customers/Customers.view'
import Travellers from '../pages/Travellers/Travellers.view'
import Applications from '../pages/Applications/Applications.view'
import Holidays from '../pages/Holidays/Holidays.view'
import Tasks from '../pages/Tasks/Tasks.view'
import Visa from '../pages/Visa/Visa.view'
import Reports from '../pages/Reports/Reports.view'
import Employees from '../pages/Employees/Employees.view'
import Roles from '../pages/Roles/Roles.view'
import Notifications from '../pages/Notifications/Notifications.view'
import AuditLogs from '../pages/AuditLogs/AuditLogs.view'
import Settings from '../pages/Settings/Settings.view'

// Pages - Add
import LeadsAdd from '../pages/Leads/Leads.add'
import ApplicationsAdd from '../pages/Applications/Applications.add'
import CustomersAdd from '../pages/Customers/Customers.add'
import VisaAdd from '../pages/Visa/Visa.add'
import EmployeesAdd from '../pages/Employees/Employees.add'
import TasksAdd from '../pages/Tasks/Tasks.add'
import HolidaysAdd from '../pages/Holidays/Holidays.add'
import TravellersAdd from '../pages/Travellers/Travellers.add'

// Pages - Edit
import LeadsEdit from '../pages/Leads/Leads.edit'
import ApplicationsEdit from '../pages/Applications/Applications.edit'
import CustomersEdit from '../pages/Customers/Customers.edit'
import VisaEdit from '../pages/Visa/Visa.edit'
import EmployeesEdit from '../pages/Employees/Employees.edit'
import TasksEdit from '../pages/Tasks/Tasks.edit'
import HolidaysEdit from '../pages/Holidays/Holidays.edit'
import TravellersEdit from '../pages/Travellers/Travellers.edit'

import NotFound from '../pages/NotFound/NotFound.view'

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />

      {/* Admin CRM Workspace */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

        {/* Leads */}
        <Route path={ROUTES.LEADS} element={<Leads />} />
        <Route path={ROUTES.LEADS_ADD} element={<LeadsAdd />} />
        <Route path={ROUTES.LEADS_EDIT} element={<LeadsEdit />} />

        {/* Customers */}
        <Route path={ROUTES.CUSTOMERS} element={<Customers />} />
        <Route path={ROUTES.CUSTOMERS_ADD} element={<CustomersAdd />} />
        <Route path={ROUTES.CUSTOMERS_EDIT} element={<CustomersEdit />} />

        {/* Travellers */}
        <Route path={ROUTES.TRAVELLERS} element={<Travellers />} />
        <Route path={ROUTES.TRAVELLERS_ADD} element={<TravellersAdd />} />
        <Route path={ROUTES.TRAVELLERS_EDIT} element={<TravellersEdit />} />

        {/* Applications */}
        <Route path={ROUTES.APPLICATIONS} element={<Applications />} />
        <Route path={ROUTES.APPLICATIONS_ADD} element={<ApplicationsAdd />} />
        <Route path={ROUTES.APPLICATIONS_EDIT} element={<ApplicationsEdit />} />

        {/* Holidays */}
        <Route path={ROUTES.HOLIDAYS} element={<Holidays />} />
        <Route path={ROUTES.HOLIDAYS_ADD} element={<HolidaysAdd />} />
        <Route path={ROUTES.HOLIDAYS_EDIT} element={<HolidaysEdit />} />

        {/* Tasks */}
        <Route path={ROUTES.TASKS} element={<Tasks />} />
        <Route path={ROUTES.TASKS_ADD} element={<TasksAdd />} />
        <Route path={ROUTES.TASKS_EDIT} element={<TasksEdit />} />

        {/* Visa */}
        <Route path={ROUTES.VISA} element={<Visa />} />
        <Route path={ROUTES.VISA_ADD} element={<VisaAdd />} />
        <Route path={ROUTES.VISA_EDIT} element={<VisaEdit />} />

        {/* Reports & Administration */}
        <Route path={ROUTES.REPORTS} element={<Reports />} />

        <Route path={ROUTES.EMPLOYEES} element={<Employees />} />
        <Route path={ROUTES.EMPLOYEES_ADD} element={<EmployeesAdd />} />
        <Route path={ROUTES.EMPLOYEES_EDIT} element={<EmployeesEdit />} />

        <Route path={ROUTES.ROLES} element={<Roles />} />
        <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
        <Route path={ROUTES.AUDIT_LOGS} element={<AuditLogs />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
      </Route>

      {/* Customer Portal */}
      <Route path="/portal" element={<CustomerLayout />}>
        <Route index element={<Applications />} />
        <Route path="applications" element={<Applications />} />
        <Route path="holidays" element={<Holidays />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
