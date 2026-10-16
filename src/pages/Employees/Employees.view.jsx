import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import employeesService from '../../services/employees'
import visaCasesService from '../../services/visaCases'
import holidayCasesService from '../../services/holidayCases'
import Pagination from '../../components/Pagination/Pagination.component'
import ROUTES from '../../config/routes'

export const Employees = () => {
  const navigate = useNavigate()

  // Employees data state
  const [employees, setEmployees] = useState([])
  const [visaCases, setVisaCases] = useState([])
  const [holidayCases, setHolidayCases] = useState([])

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Success Alert Banner
  const [successMessage, setSuccessMessage] = useState('')

  // Modals state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [viewingMember, setViewingMember] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)

  // Assignment Modal Form
  const [assignForm, setAssignForm] = useState({
    caseId: '',
    staffId: '',
    instructions: '',
  })

  // Add / Edit Member Form
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    role: 'Senior Case Officer',
    department: 'Visa Operations',
    phone: '',
    status: 'ACTIVE',
  })

  // Reload all datasets
  const reloadData = () => {
    setEmployees(employeesService.getEmployees())
    const vCases = visaCasesService.getCases ? visaCasesService.getCases() : []
    const hCases = holidayCasesService.getCases ? holidayCasesService.getCases() : []
    setVisaCases(vCases)
    setHolidayCases(hCases)

    // Pre-select first case and first staff member if empty
    if (vCases.length > 0 && !assignForm.caseId) {
      setAssignForm((prev) => ({
        ...prev,
        caseId: vCases[1]?.id || vCases[0]?.id || '',
      }))
    }
  }

  useEffect(() => {
    reloadData()
  }, [])

  // Auto-hide success message after 4s
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterDepartment, filterStatus])

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (filterDepartment !== 'ALL' && emp.department !== filterDepartment) return false
      if (filterStatus !== 'ALL' && emp.status !== filterStatus) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const match =
          emp.id.toLowerCase().includes(q) ||
          emp.name.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.role.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [employees, filterDepartment, filterStatus, searchQuery])

  // Pagination calculations
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredEmployees.slice(start, start + itemsPerPage)
  }, [filteredEmployees, currentPage, itemsPerPage])

  // Combined Cases list for Assignment Dropdown
  const allCasesForDropdown = useMemo(() => {
    const list = []
    visaCases.forEach((vc) => {
      list.push({
        id: vc.id,
        type: 'VISA',
        label: `${vc.id} - ${vc.applicant} (${vc.country || 'Global'} - ${vc.visaType || 'Visa'})`,
        officer: vc.officer,
      })
    })
    holidayCases.forEach((hc) => {
      list.push({
        id: hc.id,
        type: 'HOLIDAY',
        label: `${hc.id} - ${hc.customer} (${hc.packageName || hc.destination || 'Tour Booking'})`,
        officer: hc.officer,
      })
    })
    return list
  }, [visaCases, holidayCases])

  // Handle Toggle Status (Activate / Deactivate)
  const handleToggleStatus = (emp) => {
    const updated = employeesService.toggleStatus(emp.id)
    if (updated) {
      setSuccessMessage(`Employee ${emp.name} (${emp.id}) status set to ${updated.status}.`)
      reloadData()
    }
  }

  // Open Application Assignment Modal
  const handleOpenAssignModal = (preselectedStaff = null) => {
    const defaultCase = allCasesForDropdown[1]?.id || allCasesForDropdown[0]?.id || ''
    const defaultStaff = preselectedStaff ? preselectedStaff.id : (employees[0]?.id || 'CO-101')
    setAssignForm({
      caseId: defaultCase,
      staffId: defaultStaff,
      instructions: '',
    })
    setIsAssignModalOpen(true)
  }

  // Handle Submit Application Assignment Flow
  const handleSubmitAssignment = (e) => {
    e.preventDefault()
    if (!assignForm.caseId || !assignForm.staffId) return

    const selectedStaff = employees.find((emp) => emp.id === assignForm.staffId)
    const selectedCaseObj = allCasesForDropdown.find((c) => c.id === assignForm.caseId)

    if (!selectedStaff) return

    // 1. Log assignment in employeesService
    employeesService.assignApplicationTask({
      caseId: assignForm.caseId,
      caseTitle: selectedCaseObj ? selectedCaseObj.label : assignForm.caseId,
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      instructions: assignForm.instructions,
    })

    // 2. Update real case officer in respective service
    if (assignForm.caseId.startsWith('VISA')) {
      visaCasesService.updateCase(assignForm.caseId, {
        officer: selectedStaff.name,
        officerId: selectedStaff.id,
        assignedStaff: selectedStaff.name,
      })
    } else if (assignForm.caseId.startsWith('PKG') || assignForm.caseId.startsWith('HOL')) {
      holidayCasesService.updateCase(assignForm.caseId, {
        officer: selectedStaff.name,
        officerId: selectedStaff.id,
        assignedStaff: selectedStaff.name,
      })
    }

    setSuccessMessage(`Case ${assignForm.caseId} successfully assigned to ${selectedStaff.name} (${selectedStaff.id}).`)
    setIsAssignModalOpen(false)
    reloadData()
  }

  // Handle Open Add Member Modal
  const handleOpenAddModal = () => {
    setMemberForm({
      name: '',
      email: '',
      role: 'Senior Case Officer',
      department: 'Visa Operations',
      phone: '+91 ',
      status: 'ACTIVE',
    })
    setIsAddModalOpen(true)
  }

  // Handle Open Edit Member Modal
  const handleOpenEditModal = (emp) => {
    setEditingMember(emp)
    setMemberForm({
      name: emp.name,
      email: emp.email,
      role: emp.role,
      department: emp.department,
      phone: emp.phone || '',
      status: emp.status,
    })
    setIsAddModalOpen(true)
  }

  // Handle Save Member (Add or Edit)
  const handleSaveMember = (e) => {
    e.preventDefault()
    if (!memberForm.name.trim() || !memberForm.email.trim()) return

    if (editingMember) {
      employeesService.updateEmployee(editingMember.id, memberForm)
      setSuccessMessage(`Staff member ${memberForm.name} updated successfully.`)
      setEditingMember(null)
    } else {
      const added = employeesService.addEmployee(memberForm)
      setSuccessMessage(`New staff member ${added.name} (${added.id}) added successfully.`)
    }
    setIsAddModalOpen(false)
    reloadData()
  }

  // Get cases assigned to currently viewing member
  const memberAssignedCases = useMemo(() => {
    if (!viewingMember) return []
    const memberName = viewingMember.name.toLowerCase()
    const memberId = viewingMember.id.toLowerCase()

    const vList = visaCases
      .filter((c) => {
        const off = (c.officer || '').toLowerCase()
        const offId = (c.officerId || '').toLowerCase()
        const asgn = (c.assignedStaff || '').toLowerCase()
        return off.includes(memberName) || offId.includes(memberId) || asgn.includes(memberName)
      })
      .map((c) => ({
        id: c.id,
        type: 'Visa',
        client: c.applicant,
        detail: `${c.country} — ${c.visaType}`,
        stage: c.stage,
        amount: c.amount,
      }))

    const hList = holidayCases
      .filter((c) => {
        const off = (c.officer || '').toLowerCase()
        const offId = (c.officerId || '').toLowerCase()
        const asgn = (c.assignedStaff || '').toLowerCase()
        return off.includes(memberName) || offId.includes(memberId) || asgn.includes(memberName)
      })
      .map((c) => ({
        id: c.id,
        type: 'Holiday',
        client: c.customer,
        detail: `${c.packageName} (${c.destination})`,
        stage: c.stage,
        amount: c.price,
      }))

    return [...vList, ...hList]
  }, [viewingMember, visaCases, holidayCases])

  return (
    <div className="space-y-4 font-sans pb-12">
      {/* Success Notification Alert Banner */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="text-base">✓</span>
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-sm cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. MAIN CARD: Roles & Permissions (Staff Management)          */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Header (Matching Screenshot 1) */}
        <div className="p-3 sm:px-4 sm:py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Roles & Permissions (Staff Management)
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Manage internal team members, operational roles, and case application assignments.
            </p>
          </div>

          {/* Action Buttons (Matching Screenshot 1) */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleOpenAssignModal()}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <span>Application Assignment Flow</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-3 py-1.5 rounded-lg bg-[#0F0E2B] hover:bg-[#181445] text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span>+</span>
              <span>Add Member</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Subbar */}
        <div className="px-4 py-2.5 bg-slate-50/60 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <span className="text-slate-400">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member by ID, name, email, role, department..."
              className="w-full max-w-sm px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-semibold">Department:</span>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                <option value="Visa Operations">Visa Operations</option>
                <option value="Tour Operations">Tour Operations</option>
                <option value="Customer Support">Customer Support</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-semibold">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table (Matching Screenshot 1) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-700 uppercase tracking-wider">
                <th className="py-2.5 px-3.5">EMPLOYEE ID</th>
                <th className="py-2.5 px-3.5">NAME</th>
                <th className="py-2.5 px-3.5">EMAIL</th>
                <th className="py-2.5 px-3.5">ROLE</th>
                <th className="py-2.5 px-3.5">DEPARTMENT</th>
                <th className="py-2.5 px-3.5">STATUS</th>
                <th className="py-2.5 px-3.5 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 italic">
                    No staff members found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* EMPLOYEE ID */}
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {emp.id}
                    </td>

                    {/* NAME */}
                    <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {emp.name}
                    </td>

                    {/* EMAIL */}
                    <td className="py-3 px-3.5 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {emp.email}
                    </td>

                    {/* ROLE */}
                    <td className="py-3 px-3.5 font-medium text-slate-800 whitespace-nowrap">
                      {emp.role}
                    </td>

                    {/* DEPARTMENT */}
                    <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                      {emp.department}
                    </td>

                    {/* STATUS */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider border ${
                          emp.status === 'ACTIVE'
                            ? 'border-emerald-300 text-emerald-800 bg-emerald-50'
                            : 'border-slate-300 text-slate-500 bg-slate-50'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    {/* ACTIONS (Matching Screenshot 1) */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Member Button */}
                        <button
                          type="button"
                          onClick={() => setViewingMember(emp)}
                          className="px-2.5 py-1 rounded bg-[#0F0E2B] hover:bg-[#181445] text-white font-bold text-[10px] transition-colors cursor-pointer shadow-2xs"
                        >
                          View Member
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(emp)}
                          className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-[10px] transition-colors cursor-pointer shadow-2xs"
                        >
                          Edit
                        </button>

                        {/* Activate / Deactivate Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(emp)}
                          className={`px-2.5 py-1 rounded border text-[10px] font-bold transition-colors cursor-pointer shadow-2xs ${
                            emp.status === 'ACTIVE'
                              ? 'border-slate-300 hover:bg-slate-100 text-slate-700'
                              : 'border-emerald-300 hover:bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {emp.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination Component */}
        <div className="px-4 py-2 border-t border-slate-100 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredEmployees.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
            onItemsPerPageChange={(size) => {
              setItemsPerPage(size)
              setCurrentPage(1)
            }}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MODAL: APPLICATION ASSIGNMENT FLOW (Matching Screenshot 2) */}
      {/* ------------------------------------------------------------- */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Application Assignment Flow
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Flow: Select Application &rarr; Select Case Officer &rarr; Assign Task & Responsibilities
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-sm font-bold"
              >
                &times;
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitAssignment} className="p-4 sm:p-5 space-y-4 overflow-y-auto">
              {/* Field 1: Select Case */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  1. Select Case:
                </label>
                <select
                  required
                  value={assignForm.caseId}
                  onChange={(e) => setAssignForm({ ...assignForm, caseId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="">-- Choose Application Case --</option>
                  {allCasesForDropdown.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} {c.officer ? `(Current: ${c.officer})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 2: Select Staff Member / Case Officer */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  2. Select Staff Member / Case Officer:
                </label>
                <select
                  required
                  value={assignForm.staffId}
                  onChange={(e) => setAssignForm({ ...assignForm, staffId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="">-- Choose Case Officer --</option>
                  {employees
                    .filter((e) => e.status === 'ACTIVE')
                    .map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.id} - {emp.name} ({emp.department} / {emp.role})
                      </option>
                    ))}
                </select>
              </div>

              {/* Field 4: Specific Task Instructions / Responsibilities */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  4. Specific Task Instructions / Responsibilities:
                </label>
                <textarea
                  rows={4}
                  value={assignForm.instructions}
                  onChange={(e) => setAssignForm({ ...assignForm, instructions: e.target.value })}
                  placeholder="Enter specific work or task he will perform for this application..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F0E2B] text-white font-bold text-xs hover:bg-[#181445] transition-colors cursor-pointer shadow-xs"
                >
                  Assign Application & Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. MODAL / DRAWER: VIEW MEMBER PROFILE & ASSIGNED CASES       */}
      {/* ------------------------------------------------------------- */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F0E2B] text-white font-bold flex items-center justify-center text-sm">
                  {viewingMember.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {viewingMember.name} — Profile & Case Dossier
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {viewingMember.id} &bull; {viewingMember.role} &bull; {viewingMember.department}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingMember(null)}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-sm font-bold"
              >
                &times;
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs">
              {/* Member Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
                  <span className="font-mono text-slate-800 text-[11px] truncate block">{viewingMember.email}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone</span>
                  <span className="font-mono text-slate-800 text-[11px] block">{viewingMember.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                  <span className="font-bold text-emerald-700">{viewingMember.status}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Cases</span>
                  <span className="font-bold text-indigo-700">{memberAssignedCases.length} Active</span>
                </div>
              </div>

              {/* Assigned Cases Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Assigned Pipeline Cases ({memberAssignedCases.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const staff = viewingMember
                      setViewingMember(null)
                      handleOpenAssignModal(staff)
                    }}
                    className="text-[11px] text-indigo-600 hover:underline font-bold"
                  >
                    + Assign Another Case
                  </button>
                </div>

                {memberAssignedCases.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                    No cases currently assigned to this staff member.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[10px] font-bold text-slate-600 uppercase border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">CASE ID</th>
                          <th className="py-2 px-3">TYPE</th>
                          <th className="py-2 px-3">CLIENT</th>
                          <th className="py-2 px-3">PACKAGE / VISA</th>
                          <th className="py-2 px-3">STAGE</th>
                          <th className="py-2 px-3 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {memberAssignedCases.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/70">
                            <td className="py-2 px-3 font-mono font-bold text-slate-900">{c.id}</td>
                            <td className="py-2 px-3">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                c.type === 'Visa' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                              }`}>
                                {c.type}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-semibold text-slate-800">{c.client}</td>
                            <td className="py-2 px-3 text-slate-600">{c.detail}</td>
                            <td className="py-2 px-3">
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-slate-100 text-slate-700">
                                {c.stage}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  if (c.type === 'Visa') navigate(ROUTES.VISA)
                                  else navigate(ROUTES.HOLIDAYS)
                                }}
                                className="text-indigo-600 hover:underline font-bold text-[10px]"
                              >
                                View Case &rarr;
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
              <button
                type="button"
                onClick={() => setViewingMember(null)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. MODAL: ADD / EDIT STAFF MEMBER                             */}
      {/* ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {editingMember ? `Edit Staff Member (${editingMember.id})` : 'Register New Staff Member'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-sm font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  placeholder="e.g. Vikramaditya Roy"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Work Email *</label>
                <input
                  type="email"
                  required
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  placeholder="e.g. vikram.r@rhglobal.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Role Title</label>
                  <input
                    type="text"
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    placeholder="e.g. Senior Case Officer"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Department</label>
                  <select
                    value={memberForm.department}
                    onChange={(e) => setMemberForm({ ...memberForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Visa Operations">Visa Operations</option>
                    <option value="Tour Operations">Tour Operations</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Executive Management">Executive Management</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Contact Phone</label>
                  <input
                    type="text"
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    placeholder="+91 98201 12345"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Status</label>
                  <select
                    value={memberForm.status}
                    onChange={(e) => setMemberForm({ ...memberForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F0E2B] text-white font-bold text-xs hover:bg-[#181445] cursor-pointer shadow-xs"
                >
                  {editingMember ? 'Save Changes' : 'Register Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employees
