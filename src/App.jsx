import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ROUTES from './config/routes'
import './App.css'

// Layouts
import AdminLayout from './layouts/AdminLayout'
import CustomerLayout from './layouts/CustomerLayout'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Customers from './pages/Customers'
import Travellers from './pages/Travellers'
import Applications from './pages/Applications'
import Documents from './pages/Documents'
import Tasks from './pages/Tasks'
import Visa from './pages/Visa'
import Reports from './pages/Reports'
import Employees from './pages/Employees'
import Roles from './pages/Roles'
import Notifications from './pages/Notifications'
import AuditLogs from './pages/AuditLogs'
import Settings from './pages/Settings'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />

        {/* Admin CRM Workspace */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.LEADS} element={<Leads />} />
          <Route path={ROUTES.CUSTOMERS} element={<Customers />} />
          <Route path={ROUTES.TRAVELLERS} element={<Travellers />} />
          <Route path={ROUTES.APPLICATIONS} element={<Applications />} />
          <Route path={ROUTES.DOCUMENTS} element={<Documents />} />
          <Route path={ROUTES.TASKS} element={<Tasks />} />
          <Route path={ROUTES.VISA} element={<Visa />} />
          <Route path={ROUTES.REPORTS} element={<Reports />} />
          <Route path={ROUTES.EMPLOYEES} element={<Employees />} />
          <Route path={ROUTES.ROLES} element={<Roles />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
          <Route path={ROUTES.AUDIT_LOGS} element={<AuditLogs />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
        </Route>

        {/* Customer Portal */}
        <Route path="/portal" element={<CustomerLayout />}>
          <Route index element={<Applications />} />
          <Route path="applications" element={<Applications />} />
          <Route path="documents" element={<Documents />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
