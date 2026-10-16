import React, { useState, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import companiesService from '../../services/companies'
import ROUTES from '../../config/routes'
import Table from '../../components/Table/Table.component'
import Button from '../../components/Button/Button.component'
import ConfirmModal from '../../components/Modal/ConfirmModal.component'

// Modular Components
import CompanyCard from './components/CompanyCard.component'
import CompanyDetailsHeader from './components/CompanyDetailsHeader.component'
import CompanyApplicationsTab from './components/CompanyApplicationsTab.component'
import CompanyEmployeesTab from './components/CompanyEmployeesTab.component'
import CompanyFinancialsTab from './components/CompanyFinancialsTab.component'

export const Companies = () => {
  const navigate = useNavigate()
  const { id: paramCompanyId } = useParams()
  const [searchParams] = useSearchParams()

  // Master companies list
  const [companies, setCompanies] = useState(() => companiesService.getCompanies())

  // View state: 'table' or 'card'
  const [viewFormat, setViewFormat] = useState('table')

  // Selected company for detailed view
  const [internalSelectedId, setInternalSelectedId] = useState(null)
  const selectedCompanyId = paramCompanyId || internalSelectedId || searchParams.get('id') || null
  const setSelectedCompanyId = setInternalSelectedId

  // Filters for listing
  const [searchField, setSearchField] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name-asc')

  // Pagination for table & cards
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(8)

  // Detail view active tab: 'applications' | 'employees' | 'financial'
  const [detailTab, setDetailTab] = useState('applications')

  // Modals state
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false)
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)

  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)

  const [showAddAppModal, setShowAddAppModal] = useState(false)
  const [selectedAppDetail, setSelectedAppDetail] = useState(null)

  const [deleteConfirmCompany, setDeleteConfirmCompany] = useState(null)

  const refreshCompanies = () => {
    setCompanies(companiesService.getCompanies())
  }

  // Active detailed company
  const activeCompany = useMemo(() => {
    if (!selectedCompanyId) return null
    return (
      companies.find(
        (c) => c.id.toLowerCase() === selectedCompanyId.toLowerCase()
      ) || null
    )
  }, [companies, selectedCompanyId])

  // Filtered companies list
  const filteredCompanies = useMemo(() => {
    return companies
      .filter((comp) => {
        // Status filter
        if (statusFilter !== 'all') {
          if (comp.status.toLowerCase() !== statusFilter.toLowerCase()) return false
        }

        // Search text
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase().trim()

        if (searchField === 'name') {
          return comp.name.toLowerCase().includes(q)
        }
        if (searchField === 'contact') {
          return comp.contactPerson.toLowerCase().includes(q)
        }
        if (searchField === 'email') {
          return comp.email.toLowerCase().includes(q)
        }
        if (searchField === 'phone') {
          return comp.phone.toLowerCase().includes(q)
        }
        if (searchField === 'country') {
          return comp.country.toLowerCase().includes(q) || comp.address.toLowerCase().includes(q)
        }

        // All fields
        return (
          comp.name.toLowerCase().includes(q) ||
          comp.id.toLowerCase().includes(q) ||
          comp.regNo.toLowerCase().includes(q) ||
          comp.contactPerson.toLowerCase().includes(q) ||
          comp.email.toLowerCase().includes(q) ||
          comp.phone.toLowerCase().includes(q) ||
          comp.country.toLowerCase().includes(q) ||
          comp.address.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
        if (sortBy === 'travelers-desc') return b.totalTravelers - a.totalTravelers
        if (sortBy === 'apps-desc') return b.totalApplications - a.totalApplications
        if (sortBy === 'id-asc') return a.id.localeCompare(b.id)
        return 0
      })
  }, [companies, searchField, searchQuery, statusFilter, sortBy])

  // Paginated companies
  const totalItems = filteredCompanies.length
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredCompanies.slice(start, start + rowsPerPage)
  }, [filteredCompanies, currentPage, rowsPerPage])

  // Status toggle handler
  const handleToggleStatus = (companyId) => {
    companiesService.toggleStatus(companyId)
    refreshCompanies()
  }

  // Delete handler
  const handleDeleteCompany = () => {
    if (!deleteConfirmCompany) return
    companiesService.deleteCompany(deleteConfirmCompany.id)
    if (selectedCompanyId === deleteConfirmCompany.id) {
      setSelectedCompanyId(null)
    }
    setDeleteConfirmCompany(null)
    refreshCompanies()
  }

  // Table columns for listing format
  const columns = [
    {
      key: 'name',
      header: 'COMPANY ID & NAME',
      render: (_, row) => (
        <div>
          <button
            type="button"
            onClick={() => setSelectedCompanyId(row.id)}
            className="font-bold text-slate-900 hover:text-primary transition-colors text-left block cursor-pointer"
          >
            {row.name}
          </button>
          <span className="font-mono text-[11px] text-slate-500 block mt-0.5">
            {row.id} • {row.regNo}
          </span>
        </div>
      ),
    },
    {
      key: 'contactPerson',
      header: 'CONTACT PERSON',
      render: (val) => <span className="text-slate-800 text-xs font-medium">{val}</span>,
    },
    {
      key: 'email',
      header: 'EMAIL',
      render: (val) => (
        <a
          href={`mailto:${val}`}
          className="text-xs text-slate-700 hover:text-primary underline truncate max-w-[180px] block"
        >
          {val}
        </a>
      ),
    },
    {
      key: 'phone',
      header: 'PHONE',
      render: (val) => <span className="text-slate-700 text-xs whitespace-nowrap">{val}</span>,
    },
    {
      key: 'address',
      header: 'ADDRESS / COUNTRY',
      render: (val) => (
        <div className="max-w-[200px] truncate text-xs text-slate-700">
          <span>{val}</span>
        </div>
      ),
    },
    {
      key: 'totalTravelers',
      header: 'TOTAL TRAVELERS',
      render: (val) => (
        <div className="text-center">
          <span className="font-bold text-slate-900 text-xs">{val}</span>
        </div>
      ),
    },
    {
      key: 'totalApplications',
      header: 'TOTAL APPLICATIONS',
      render: (val) => (
        <div className="text-center">
          <span className="font-bold text-slate-900 text-xs">{val}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (val) => (
        <span
          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
            val === 'ACTIVE'
              ? 'border-slate-300 text-slate-700 bg-white'
              : 'border-slate-300 text-slate-400 bg-slate-50'
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      render: (_, row) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {/* View Button */}
          <button
            type="button"
            onClick={() => setSelectedCompanyId(row.id)}
            className="px-2.5 py-1 text-[11px] font-bold rounded bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
          >
            View
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => {
              setEditingCompany(row)
              setShowEditCompanyModal(true)
            }}
            className="px-2.5 py-1 text-[11px] font-medium rounded border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            Edit
          </button>

          {/* Deactivate / Activate Button */}
          <button
            type="button"
            onClick={() => handleToggleStatus(row.id)}
            className="px-2.5 py-1 text-[11px] font-medium rounded border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            {row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => setDeleteConfirmCompany(row)}
            className="px-2.5 py-1 text-[11px] font-medium rounded border border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 text-slate-700 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  // =========================================================================
  // VIEW: COMPANY DETAILS (When a company is viewed)
  // =========================================================================
  if (activeCompany) {
    return (
      <div className="space-y-5 pb-12 font-sans animate-in fade-in duration-200">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setSelectedCompanyId(null)
              if (paramCompanyId) navigate(ROUTES.COMPANIES)
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
          >
            <span>&larr;</span>
            <span>Back to Company Listing</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingCompany(activeCompany)
              setShowEditCompanyModal(true)
            }}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-md border border-slate-300 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
          >
            Edit Company Details
          </button>
        </div>

        {/* Company Header Box Component */}
        <CompanyDetailsHeader company={activeCompany} />

        {/* Tab Navigation (5.1, 5.2, 5.3) */}
        <div className="flex border-b border-slate-200 space-x-1 sm:space-x-2">
          <button
            type="button"
            onClick={() => setDetailTab('applications')}
            className={`px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              detailTab === 'applications'
                ? 'border-slate-900 text-slate-900 bg-slate-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            5.1 Applications ({activeCompany.applications?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setDetailTab('employees')}
            className={`px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              detailTab === 'employees'
                ? 'border-slate-900 text-slate-900 bg-slate-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            5.2 Employees ({activeCompany.employees?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setDetailTab('financial')}
            className={`px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              detailTab === 'financial'
                ? 'border-slate-900 text-slate-900 bg-slate-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            5.3 Issuing / Booking / Financial Information
          </button>
        </div>

        {/* TAB 5.1: APPLICATIONS (Kanban / Table) */}
        {detailTab === 'applications' && (
          <CompanyApplicationsTab
            applications={activeCompany.applications || []}
            onNewApplication={() => setShowAddAppModal(true)}
            onViewApplication={(app) => setSelectedAppDetail(app)}
          />
        )}

        {/* TAB 5.2: EMPLOYEES */}
        {detailTab === 'employees' && (
          <CompanyEmployeesTab
            employees={activeCompany.employees || []}
            onAddEmployee={() => setShowAddEmployeeModal(true)}
            onEditEmployee={(emp) => {
              setEditingEmployee(emp)
              setShowEditEmployeeModal(true)
            }}
            onToggleStatus={(empId) => {
              companiesService.toggleEmployeeStatus(activeCompany.id, empId)
              refreshCompanies()
            }}
          />
        )}

        {/* TAB 5.3: FINANCIAL INFO */}
        {detailTab === 'financial' && (
          <CompanyFinancialsTab company={activeCompany} />
        )}

        {/* Modal: View Application Details */}
        {selectedAppDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded">
                    {selectedAppDetail.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{selectedAppDetail.applicantName}</h3>
                  <p className="text-xs text-slate-500">{selectedAppDetail.serviceRequired} • {selectedAppDetail.country}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAppDetail(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Application Type</span>
                  <span className="font-bold text-slate-800">{selectedAppDetail.applicationType}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                  <span className="font-bold text-slate-800">{selectedAppDetail.status}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Case Officer</span>
                  <span className="font-bold text-slate-800">{selectedAppDetail.assignedOfficer}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Filing Date</span>
                  <span className="font-bold text-slate-800">{selectedAppDetail.applicationDate}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Processing Notes & Remarks</span>
                <p className="text-xs text-slate-800">{selectedAppDetail.notes || 'No notes on file.'}</p>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => setSelectedAppDetail(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add New Application */}
        {showAddAppModal && (
          <AddApplicationModal
            company={activeCompany}
            onClose={() => setShowAddAppModal(false)}
            onSave={(appData) => {
              companiesService.addApplication(activeCompany.id, appData)
              setShowAddAppModal(false)
              refreshCompanies()
            }}
          />
        )}

        {/* Modal: Add New Employee */}
        {showAddEmployeeModal && (
          <AddEmployeeModal
            company={activeCompany}
            onClose={() => setShowAddEmployeeModal(false)}
            onSave={(empData) => {
              companiesService.addEmployee(activeCompany.id, empData)
              setShowAddEmployeeModal(false)
              refreshCompanies()
            }}
          />
        )}

        {/* Modal: Edit Employee */}
        {showEditEmployeeModal && editingEmployee && (
          <EditEmployeeModal
            employee={editingEmployee}
            onClose={() => {
              setEditingEmployee(null)
              setShowEditEmployeeModal(false)
            }}
            onSave={(updated) => {
              const emps = (activeCompany.employees || []).map((e) =>
                e.id === editingEmployee.id ? { ...e, ...updated } : e
              )
              companiesService.updateCompany(activeCompany.id, { employees: emps })
              setEditingEmployee(null)
              setShowEditEmployeeModal(false)
              refreshCompanies()
            }}
          />
        )}

        {/* Modal: Edit Company Details */}
        {showEditCompanyModal && editingCompany && (
          <EditCompanyModal
            company={editingCompany}
            onClose={() => {
              setEditingCompany(null)
              setShowEditCompanyModal(false)
            }}
            onSave={(updated) => {
              companiesService.updateCompany(editingCompany.id, updated)
              setEditingCompany(null)
              setShowEditCompanyModal(false)
              refreshCompanies()
            }}
          />
        )}
      </div>
    )
  }

  // =========================================================================
  // VIEW: COMPANY LISTING (Table & Card formats)
  // =========================================================================
  return (
    <div className="space-y-4 pb-12 font-sans animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Companies / Clients Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage corporate client accounts, company travelers, and corporate visa/tour processing
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setViewFormat('table')}
            className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
              viewFormat === 'table'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>=</span>
            <span>Table View</span>
          </button>

          <button
            type="button"
            onClick={() => setViewFormat('card')}
            className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
              viewFormat === 'card'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>⊞</span>
            <span>Card View</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddCompanyModal(true)}
            className="px-3.5 py-1.5 text-xs font-bold rounded bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>+</span>
            <span>Add Company</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="flex items-center gap-1.5">
            <label className="text-slate-600 font-medium whitespace-nowrap">Search By:</label>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="px-2.5 py-1.5 rounded border border-slate-300 text-slate-800 bg-white focus:outline-none focus:border-slate-800"
            >
              <option value="all">All Fields</option>
              <option value="name">Company Name</option>
              <option value="contact">Contact Person</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="country">Address / Country</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
            <label className="text-slate-600 font-medium whitespace-nowrap">Search:</label>
            <input
              type="text"
              placeholder="Search companies, persons, emails..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-1.5 rounded border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-slate-600 font-medium whitespace-nowrap">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-2.5 py-1.5 rounded border border-slate-300 text-slate-800 bg-white focus:outline-none focus:border-slate-800"
            >
              <option value="all">All Statuses ({companies.length})</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-slate-600 font-medium whitespace-nowrap">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded border border-slate-300 text-slate-800 bg-white focus:outline-none focus:border-slate-800"
            >
              <option value="name-asc">Name (A &rarr; Z)</option>
              <option value="name-desc">Name (Z &rarr; A)</option>
              <option value="travelers-desc">Total Travelers</option>
              <option value="apps-desc">Total Applications</option>
              <option value="id-asc">Company ID</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 whitespace-nowrap">
          Showing {totalItems > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}&ndash;
          {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems} companies
        </div>
      </div>

      {/* 3. Section Card / Table Container */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {/* Section Heading Bar */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900">
            Company Listing &mdash; {viewFormat === 'table' ? 'Table Format' : 'Card Format'} ({totalItems} Companies)
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-medium">Format:</span>
            <button
              type="button"
              onClick={() => setViewFormat('table')}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                viewFormat === 'table'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              = Table
            </button>
            <button
              type="button"
              onClick={() => setViewFormat('card')}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                viewFormat === 'card'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Cards
            </button>
          </div>
        </div>

        {/* TABLE VIEW */}
        {viewFormat === 'table' ? (
          <div className="overflow-x-auto">
            <Table columns={columns} data={paginatedCompanies} />
          </div>
        ) : (
          /* CARD VIEW - Using modular CompanyCard component */
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginatedCompanies.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                No companies found matching the selected filter.
              </div>
            ) : (
              paginatedCompanies.map((comp) => (
                <CompanyCard
                  key={comp.id}
                  company={comp}
                  onView={() => setSelectedCompanyId(comp.id)}
                  onEdit={() => {
                    setEditingCompany(comp)
                    setShowEditCompanyModal(true)
                  }}
                  onToggleStatus={() => handleToggleStatus(comp.id)}
                  onDelete={() => setDeleteConfirmCompany(comp)}
                />
              ))
            )}
          </div>
        )}

        {/* Pagination Controls (Applies to BOTH Table & Card views) */}
        <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-600 bg-white">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="px-2 py-1 rounded border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={20}>20</option>
            </select>
            <span className="text-slate-500 ml-2">
              Showing {totalItems > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems} items
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(1)}
              className="px-2 py-1 rounded border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              &laquo; First
            </button>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 rounded border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              &lsaquo; Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#0F0E2B] text-white shadow-xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2 py-1 rounded border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next &rsaquo;
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="px-2 py-1 rounded border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Last &raquo;
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: ADD COMPANY */}
      {showAddCompanyModal && (
        <AddCompanyModal
          onClose={() => setShowAddCompanyModal(false)}
          onSave={(data) => {
            companiesService.createCompany(data)
            setShowAddCompanyModal(false)
            refreshCompanies()
          }}
        />
      )}

      {/* MODAL: EDIT COMPANY */}
      {showEditCompanyModal && editingCompany && (
        <EditCompanyModal
          company={editingCompany}
          onClose={() => {
            setEditingCompany(null)
            setShowEditCompanyModal(false)
          }}
          onSave={(updated) => {
            companiesService.updateCompany(editingCompany.id, updated)
            setEditingCompany(null)
            setShowEditCompanyModal(false)
            refreshCompanies()
          }}
        />
      )}

      {/* MODAL: CONFIRM DELETE COMPANY */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmCompany)}
        onClose={() => setDeleteConfirmCompany(null)}
        onConfirm={handleDeleteCompany}
        title="Delete Company Account"
        message={`Are you sure you want to delete ${deleteConfirmCompany?.name} (${deleteConfirmCompany?.id})? This will remove all associated traveler portfolios and corporate records.`}
        confirmText="Yes, Delete Account"
        cancelText="Cancel"
      />
    </div>
  )
}

// Sub-modals
const AddCompanyModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    country: 'India',
    creditLimit: '₹25,00,000',
    gstNumber: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name) return
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Add New Corporate Client / Company</h3>
            <p className="text-xs text-slate-500">Register a new business account for corporate travel and visa processing</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Global Tech"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Contact Person *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sunil Mehta"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="info@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 22 0000 0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Address / City</label>
              <input
                type="text"
                placeholder="e.g. 45 BKC Complex, Mumbai"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Country</label>
              <input
                type="text"
                placeholder="e.g. India"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Credit Facility Limit</label>
              <input
                type="text"
                placeholder="e.g. ₹25,00,000"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">GSTIN / Tax ID</label>
              <input
                type="text"
                placeholder="e.g. 27AAACA1234F1Z8"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save & Register Company
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EditCompanyModal = ({ company, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: company.name || '',
    contactPerson: company.contactPerson || '',
    email: company.email || '',
    phone: company.phone || '',
    address: company.address || '',
    country: company.country || 'India',
    status: company.status || 'ACTIVE',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Edit Company Details</h3>
            <p className="text-xs text-slate-500">Update account particulars for {company.id}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Company Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Contact Person</label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800 bg-white"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

const AddEmployeeModal = ({ company, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Sales',
    designation: 'Senior Manager',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name) return
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Add Company Employee</h3>
            <p className="text-xs text-slate-500">Associate an employee profile with {company.name}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rohan Joshi"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Work Email *</label>
            <input
              type="email"
              required
              placeholder="rohan.j@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="+91 98200 11111"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800 bg-white"
              >
                <option value="Executive">Executive</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Designation</label>
              <input
                type="text"
                placeholder="Senior Manager"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Add Employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EditEmployeeModal = ({ employee, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: employee.name || '',
    email: employee.email || '',
    phone: employee.phone || '',
    department: employee.department || 'Sales',
    designation: employee.designation || 'Staff',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Edit Employee: {employee.id}</h3>
            <p className="text-xs text-slate-500">Update staff details</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Work Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

const AddApplicationModal = ({ company, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    applicantName: '',
    applicationType: 'VISA',
    country: 'United States',
    serviceRequired: 'Business Visa (B1)',
    assignedOfficer: 'Amit Verma (CO-101)',
    status: 'UNDER REVIEW',
    notes: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.applicantName) return
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Create Corporate Application</h3>
            <p className="text-xs text-slate-500">File a visa or tour booking for {company.name}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Applicant Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={formData.applicantName}
              onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
              className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Application Type</label>
              <select
                value={formData.applicationType}
                onChange={(e) => setFormData({ ...formData, applicationType: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800 bg-white"
              >
                <option value="VISA">Visa</option>
                <option value="HOLIDAY">Holiday</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Country</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Service Required</label>
            <input
              type="text"
              required
              placeholder="e.g. Business Visa (B1)"
              value={formData.serviceRequired}
              onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
              className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Assigned Officer</label>
              <select
                value={formData.assignedOfficer}
                onChange={(e) => setFormData({ ...formData, assignedOfficer: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800 bg-white"
              >
                <option value="Amit Verma (CO-101)">Amit Verma (CO-101)</option>
                <option value="Priya Singh (CO-102)">Priya Singh (CO-102)</option>
                <option value="sipu Sharma (CO-103)">sipu Sharma (CO-103)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800 bg-white"
              >
                <option value="UNDER REVIEW">Under Review</option>
                <option value="IN PROGRESS">In Progress</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING ACTION">Pending Action</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Companies
