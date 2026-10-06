import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import Table from '../../components/Table/Table.component'

export const Employees = () => {
  const navigate = useNavigate()
  const staff = [
    { id: 'EMP-01', name: 'Sarah Connor', email: 'sarah.c@rhglobal.com', role: 'Super Admin', department: 'Executive Management', status: 'Active' },
    { id: 'EMP-02', name: 'Alex Morgan', email: 'alex.m@rhglobal.com', role: 'Senior Immigration Officer', department: 'Canada Operations', status: 'Active' },
    { id: 'EMP-03', name: 'Dev Patel', email: 'dev.p@rhglobal.com', role: 'Visa Specialist', department: 'UK & Europe Operations', status: 'Active' },
    { id: 'EMP-04', name: 'Maya Lin', email: 'maya.l@rhglobal.com', role: 'Client Relationship Manager', department: 'Sales & Onboarding', status: 'Active' },
  ]

  const columns = [
    { key: 'id', header: 'Employee ID', render: (val) => <span className="font-semibold text-main">{val}</span> },
    { key: 'name', header: 'Staff Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role Title' },
    { key: 'department', header: 'Department' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          {val}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/employees/edit/${row.id}`)
          }}
          className="text-xs font-semibold text-primary hover:text-primary-hover underline"
        >
          Edit
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main">Employee Directory</h1>
          <p className="text-sm text-muted mt-1">Manage staff accounts, department assignments, and permissions</p>
        </div>
        <Button onClick={() => navigate('/employees/add')} variant="primary" size="md">+ Add Team Member</Button>
      </div>

      <Table columns={columns} data={staff} />
    </div>
  )
}

export default Employees
