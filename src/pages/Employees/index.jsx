import React from 'react'
import Button from '../../components/Button'
import Table from '../../components/Table'

export const Employees = () => {
  const staff = [
    { id: 'EMP-01', name: 'Sarah Connor', email: 'sarah.c@rhglobal.com', role: 'Super Admin', department: 'Executive Management', status: 'Active' },
    { id: 'EMP-02', name: 'Alex Morgan', email: 'alex.m@rhglobal.com', role: 'Senior Immigration Officer', department: 'Canada Operations', status: 'Active' },
    { id: 'EMP-03', name: 'Dev Patel', email: 'dev.p@rhglobal.com', role: 'Visa Specialist', department: 'UK & Europe Operations', status: 'Active' },
    { id: 'EMP-04', name: 'Maya Lin', email: 'maya.l@rhglobal.com', role: 'Client Relationship Manager', department: 'Sales & Onboarding', status: 'Active' },
  ]

  const columns = [
    { key: 'id', header: 'Staff ID', render: (val) => <span className="font-mono text-xs">{val}</span> },
    {
      key: 'name',
      header: 'Employee',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-900">{val}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    { key: 'role', header: 'System Role' },
    { key: 'department', header: 'Department' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => (
        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
          {val}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage staff accounts, departments, and immigration case officers</p>
        </div>
        <Button variant="primary" size="md">+ Add Employee</Button>
      </div>

      <Table columns={columns} data={staff} />
    </div>
  )
}

export default Employees
