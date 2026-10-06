import React from 'react'
import Button from '../../components/Button/Button.component'
import Table from '../../components/Table/Table.component'

export const Roles = () => {
  const roles = [
    { name: 'SUPER_ADMIN', label: 'Super Administrator', usersCount: 2, description: 'Unrestricted full access across all modules, billing, and logs' },
    { name: 'ADMIN', label: 'Branch Administrator', usersCount: 5, description: 'Manages team members, leads, customers, and operations' },
    { name: 'MANAGER', label: 'Case Manager', usersCount: 8, description: 'Supervises case officers, reviews visa submissions, and reports' },
    { name: 'AGENT', label: 'Immigration Agent', usersCount: 24, description: 'Manages customer applications, documents, and lead follow-ups' },
    { name: 'CUSTOMER', label: 'Client / Applicant', usersCount: 840, description: 'Access restricted strictly to client portal and uploaded files' },
  ]

  const columns = [
    { key: 'label', header: 'Role Title', render: (val) => <span className="font-semibold text-slate-900">{val}</span> },
    { key: 'name', header: 'Key Code', render: (val) => <span className="font-mono text-xs text-indigo-600">{val}</span> },
    { key: 'description', header: 'Scope & Description' },
    { key: 'usersCount', header: 'Active Users', render: (val) => `${val} users` },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Roles & Permissions</h1>
          <p className="text-sm text-slate-500 mt-1">Configure role-based access control (RBAC) and security tiers</p>
        </div>
        <Button variant="primary" size="md">+ Create Custom Role</Button>
      </div>

      <Table columns={columns} data={roles} />
    </div>
  )
}

export default Roles
