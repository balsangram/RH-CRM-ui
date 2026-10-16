/**
 * Employees and Staff Management Service
 * Manages staff profiles, roles, departments, active status, and application task assignments.
 */

const STORAGE_KEY_EMPLOYEES = 'rh_crm_employees_v2'
const STORAGE_KEY_ASSIGNMENTS = 'rh_crm_staff_assignments_v1'

const DEFAULT_EMPLOYEES = [
  {
    id: 'CO-101',
    name: 'Amit Verma',
    email: 'amit.v@rhglobal.com',
    role: 'Senior Case Officer',
    department: 'Visa Operations',
    status: 'ACTIVE',
    phone: '+91 98201 12345',
    joinedDate: '2024-03-15',
    assignedCasesCount: 5,
  },
  {
    id: 'CO-102',
    name: 'Priya Singh',
    email: 'priya.s@rhglobal.com',
    role: 'Holiday Specialist',
    department: 'Tour Operations',
    status: 'ACTIVE',
    phone: '+91 98202 23456',
    joinedDate: '2024-05-10',
    assignedCasesCount: 4,
  },
  {
    id: 'CO-103',
    name: 'Rohan Das',
    email: 'rohan.d@rhglobal.com',
    role: 'Sub-Admin Staff',
    department: 'Customer Support',
    status: 'ACTIVE',
    phone: '+91 98203 34567',
    joinedDate: '2024-08-01',
    assignedCasesCount: 2,
  },
  {
    id: 'CO-104',
    name: 'sipu Sharma',
    email: 'sipu@rhglobal.com',
    role: 'Case Officer',
    department: 'Visa Operations',
    status: 'ACTIVE',
    phone: '+91 98204 45678',
    joinedDate: '2024-09-12',
    assignedCasesCount: 3,
  },
  {
    id: 'CO-105',
    name: 'Kavita Reddy',
    email: 'kavita.r@rhglobal.com',
    role: 'Visa Filing Officer',
    department: 'Visa Operations',
    status: 'ACTIVE',
    phone: '+91 98205 56789',
    joinedDate: '2024-11-20',
    assignedCasesCount: 1,
  },
  {
    id: 'CO-106',
    name: 'Deepak Nair',
    email: 'deepak.n@rhglobal.com',
    role: 'Holiday Coordinator',
    department: 'Tour Operations',
    status: 'ACTIVE',
    phone: '+91 98206 67890',
    joinedDate: '2025-01-15',
    assignedCasesCount: 2,
  },
]

class EmployeesService {
  constructor() {
    this.employees = this.loadEmployees()
    this.assignments = this.loadAssignments()
  }

  loadEmployees() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_EMPLOYEES)
      if (data) return JSON.parse(data)
    } catch (e) {
      console.warn('Failed to load employees from localStorage:', e)
    }
    return [...DEFAULT_EMPLOYEES]
  }

  saveEmployees() {
    try {
      localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(this.employees))
    } catch (e) {
      console.warn('Failed to save employees to localStorage:', e)
    }
  }

  loadAssignments() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ASSIGNMENTS)
      if (data) return JSON.parse(data)
    } catch (e) {
      console.warn('Failed to load assignments from localStorage:', e)
    }
    return [
      {
        id: 'ASGN-101',
        caseId: 'VISA-302',
        caseTitle: 'VISA-302 — Sanya Malhotra (United Kingdom - Standard Visitor)',
        staffId: 'CO-101',
        staffName: 'Amit Verma',
        instructions: 'Verify flight vouchers, hotel reservations, and schedule biometric appointment at VFS Delhi.',
        assignedAt: '2026-10-15T14:30:00Z',
      },
      {
        id: 'ASGN-102',
        caseId: 'PKG-702',
        caseTitle: 'PKG-702 — Deepak Chopra (Dubai Luxury Marina & Desert Safari)',
        staffId: 'CO-102',
        staffName: 'Priya Singh',
        instructions: 'Finalize luxury yacht voucher and private desert safari booking confirmation.',
        assignedAt: '2026-10-14T11:00:00Z',
      },
    ]
  }

  saveAssignments() {
    try {
      localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(this.assignments))
    } catch (e) {
      console.warn('Failed to save assignments to localStorage:', e)
    }
  }

  getEmployees() {
    return [...this.employees]
  }

  getEmployeeById(id) {
    return this.employees.find((emp) => emp.id === id) || null
  }

  addEmployee(member) {
    const nextIdNum = this.employees.length + 101
    const newId = member.id || `CO-${nextIdNum}`
    const newMember = {
      id: newId,
      name: member.name || '',
      email: member.email || '',
      role: member.role || 'Case Officer',
      department: member.department || 'Visa Operations',
      status: member.status || 'ACTIVE',
      phone: member.phone || '+91 98000 00000',
      joinedDate: new Date().toISOString().split('T')[0],
      assignedCasesCount: 0,
    }
    this.employees.unshift(newMember)
    this.saveEmployees()
    return newMember
  }

  updateEmployee(id, data) {
    const idx = this.employees.findIndex((e) => e.id === id)
    if (idx !== -1) {
      this.employees[idx] = { ...this.employees[idx], ...data }
      this.saveEmployees()
      return this.employees[idx]
    }
    return null
  }

  toggleStatus(id) {
    const emp = this.employees.find((e) => e.id === id)
    if (emp) {
      emp.status = emp.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      this.saveEmployees()
      return emp
    }
    return null
  }

  deleteEmployee(id) {
    this.employees = this.employees.filter((e) => e.id !== id)
    this.saveEmployees()
    return true
  }

  assignApplicationTask({ caseId, caseTitle, staffId, staffName, instructions }) {
    const assignment = {
      id: `ASGN-${Date.now().toString().slice(-4)}`,
      caseId,
      caseTitle: caseTitle || caseId,
      staffId,
      staffName,
      instructions: instructions || 'Standard case processing and documentation review.',
      assignedAt: new Date().toISOString(),
    }
    this.assignments.unshift(assignment)
    this.saveAssignments()

    // Increment assigned count for employee
    const emp = this.employees.find((e) => e.id === staffId || e.name === staffName)
    if (emp) {
      emp.assignedCasesCount = (emp.assignedCasesCount || 0) + 1
      this.saveEmployees()
    }

    return assignment
  }

  getAssignments(staffId = null) {
    if (!staffId) return [...this.assignments]
    return this.assignments.filter((a) => a.staffId === staffId)
  }
}

const employeesService = new EmployeesService()
export default employeesService
