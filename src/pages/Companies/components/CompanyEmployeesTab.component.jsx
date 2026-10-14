import React, { useState, useMemo } from 'react'

/**
 * CompanyEmployeesTab Component
 * Displays company employees table with Add Employee action and status toggles (Screenshot 5)
 */
export const CompanyEmployeesTab = ({
  employees = [],
  onAddEmployee,
  onEditEmployee,
  onToggleStatus,
}) => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (statusFilter !== 'all' && emp.status.toLowerCase() !== statusFilter.toLowerCase()) return false
      if (!search.trim()) return true
      const q = search.toLowerCase().trim()
      return (
        emp.id.toLowerCase().includes(q) ||
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.phone.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.designation.toLowerCase().includes(q)
      )
    })
  }, [employees, statusFilter, search])

  return (
    <div className="space-y-4">
      {/* Header with + Add Employee */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-slate-900">Company Employees / Staff Members</h2>
        {onAddEmployee && (
          <button
            type="button"
            onClick={onAddEmployee}
            className="px-3.5 py-1.5 text-xs font-bold rounded bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>+</span>
            <span>Add Employee</span>
          </button>
        )}
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <label className="text-slate-600 font-medium whitespace-nowrap">Search Employee Name / ID:</label>
          <input
            type="text"
            placeholder="Type to filter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-600 font-medium whitespace-nowrap">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Employees Table (Screenshot 5) */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-900 uppercase border-b border-slate-200 tracking-wider">
            <tr>
              <th className="px-4 py-3">EMPLOYEE ID</th>
              <th className="px-4 py-3">NAME</th>
              <th className="px-4 py-3">EMAIL</th>
              <th className="px-4 py-3">PHONE NUMBER</th>
              <th className="px-4 py-3">DEPARTMENT</th>
              <th className="px-4 py-3">DESIGNATION</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  No company employees found. Click "+ Add Employee" above to register staff.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900">{emp.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{emp.name}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${emp.email}`} className="text-slate-600 hover:underline">
                      {emp.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{emp.phone}</td>
                  <td className="px-4 py-3 text-slate-700">{emp.department}</td>
                  <td className="px-4 py-3 text-slate-700">{emp.designation}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                        emp.status === 'ACTIVE'
                          ? 'border-slate-300 text-slate-700 bg-white'
                          : 'border-slate-300 text-slate-400 bg-slate-50'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onEditEmployee?.(emp)}
                        className="px-2.5 py-1 text-[11px] font-medium rounded border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleStatus?.(emp.id)}
                        className="px-2.5 py-1 text-[11px] font-medium rounded border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                      >
                        Activate/Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CompanyEmployeesTab
