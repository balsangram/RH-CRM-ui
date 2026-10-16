import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import travellersService from '../../services/travellers'
import TravellerCard from './components/TravellerCard.component'
import TravellerProfileView from './components/TravellerProfileView.component'

export const Travellers = () => {
  const navigate = useNavigate()

  // Main data state
  const [travellers, setTravellers] = useState([])

  // View format: 'cards' | 'table' (Matching wireframe Screenshot 2)
  const [viewFormat, setViewFormat] = useState('cards')

  // Selected traveler for drilldown full profile view (Screenshot 3 & 4)
  const [selectedTravellerId, setSelectedTravellerId] = useState(null)

  // Filters state
  const [searchField, setSearchField] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('name-asc')

  // Pagination state (for BOTH table and cards)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(8)

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTraveller, setEditingTraveller] = useState(null)
  const [deleteConfirmTraveller, setDeleteConfirmTraveller] = useState(null)

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    passport: '',
    nationality: '',
    expiry: '',
    email: '',
    phone: '',
    customer: '',
    company: '',
    status: 'ACTIVE',
  })

  // Load data from service
  const refreshTravellers = () => {
    const list = travellersService.getTravellers()
    setTravellers(list)
  }

  useEffect(() => {
    refreshTravellers()
  }, [])

  // Filtered & Sorted Travellers
  const filteredTravellers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()

    return travellers
      .filter((t) => {
        // Status filter
        if (statusFilter !== 'ALL' && t.status !== statusFilter) {
          return false
        }

        // Search query filter
        if (!q) return true

        if (searchField === 'name') return t.name.toLowerCase().includes(q)
        if (searchField === 'id') return t.id.toLowerCase().includes(q)
        if (searchField === 'passport') return t.passport.toLowerCase().includes(q)
        if (searchField === 'country') return t.country.toLowerCase().includes(q)
        if (searchField === 'email') return t.email.toLowerCase().includes(q)
        if (searchField === 'phone') return t.phone.toLowerCase().includes(q)

        // ALL fields
        return (
          t.name.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.passport.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.phone.toLowerCase().includes(q) ||
          (t.associatedCustomer && t.associatedCustomer.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
        if (sortBy === 'id-asc') return a.id.localeCompare(b.id)
        if (sortBy === 'apps-desc') {
          const aApps = a.totalVisaApps ?? (a.visaApplications ? a.visaApplications.length : 0)
          const bApps = b.totalVisaApps ?? (b.visaApplications ? b.visaApplications.length : 0)
          return bApps - aApps
        }
        if (sortBy === 'bookings-desc') {
          const aBk = a.totalBookings ?? (a.holidayBookings ? a.holidayBookings.length : 0)
          const bBk = b.totalBookings ?? (b.holidayBookings ? b.holidayBookings.length : 0)
          return bBk - aBk
        }
        return 0
      })
  }, [travellers, searchQuery, searchField, statusFilter, sortBy])

  // Pagination calculations
  const totalItems = filteredTravellers.length
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1
  const paginatedTravellers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredTravellers.slice(start, start + rowsPerPage)
  }, [filteredTravellers, currentPage, rowsPerPage])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, searchField, statusFilter, sortBy, rowsPerPage])

  // Handlers
  const handleToggleStatus = (id) => {
    travellersService.toggleStatus(id)
    refreshTravellers()
  }

  const handleDelete = () => {
    if (!deleteConfirmTraveller) return
    travellersService.deleteTraveller(deleteConfirmTraveller.id)
    if (selectedTravellerId === deleteConfirmTraveller.id) {
      setSelectedTravellerId(null)
    }
    setDeleteConfirmTraveller(null)
    refreshTravellers()
  }

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      passport: '',
      nationality: 'India',
      expiry: '2030-01-01',
      email: '',
      phone: '',
      customer: '',
      company: 'Individual',
      status: 'ACTIVE',
    })
    setShowAddModal(true)
  }

  const handleOpenEdit = (t) => {
    setEditingTraveller(t)
    setFormData({
      name: t.name,
      passport: t.passport,
      nationality: t.country,
      expiry: t.expiry,
      email: t.email,
      phone: t.phone,
      customer: t.associatedCustomer || '',
      company: t.company || 'Individual',
      status: t.status,
    })
  }

  const handleSaveAdd = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.passport) return
    travellersService.createTraveller({
      ...formData,
      country: formData.nationality,
    })
    setShowAddModal(false)
    refreshTravellers()
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editingTraveller || !formData.name || !formData.passport) return
    travellersService.updateTraveller(editingTraveller.id, {
      ...formData,
      country: formData.nationality,
    })
    setEditingTraveller(null)
    refreshTravellers()
  }

  // Active traveler object for detail view
  const selectedTraveller = travellers.find((t) => t.id === selectedTravellerId)

  // Status counts for badge
  const activeCount = travellers.filter((t) => t.status === 'ACTIVE').length
  const blockedCount = travellers.filter((t) => t.status === 'BLOCKED').length

  // If a traveler is selected, show the full profile drilldown view (Screenshot 3 & 4)
  if (selectedTravellerId && selectedTraveller) {
    return (
      <TravellerProfileView
        traveller={selectedTraveller}
        onBack={() => setSelectedTravellerId(null)}
        onEdit={() => handleOpenEdit(selectedTraveller)}
      />
    )
  }

  return (
    <div className="space-y-4 pb-12 font-sans text-xs">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER CARD                                             */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Travelers / Customers Listing
              </h1>
              {/* <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md border border-slate-300 bg-slate-50 text-slate-700 shadow-2xs">
                {filteredTravellers.length} of {travellers.length} Travelers
              </span> */}
            </div>
            <p className="text-xs font-medium text-slate-500 tracking-tight">
              Manage corporate client accounts, individual travelers, passport validity, and corporate visa/tour processing
            </p>
          </div>

          {/* Action Buttons: Kanban/Table Switcher + Add Traveler */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            {/* View Switcher Toggle (Matching Screenshot 2) */}
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/90 p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewFormat('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewFormat === 'table'
                    ? 'bg-[#0F0E2B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>=</span>
                <span>Table View</span>
              </button>

              <button
                type="button"
                onClick={() => setViewFormat('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewFormat === 'cards'
                    ? 'bg-[#0F0E2B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>◼</span>
                <span>Card View</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 rounded-xl bg-[#0F0E2B] hover:bg-[#181445] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>+ Add Traveler</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. ADVANCED FILTERS BAR (Matching Wireframe Reference)        */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
          {/* Search By */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Search By:</span>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Fields</option>
              <option value="name">Traveler Name</option>
              <option value="id">Traveler ID</option>
              <option value="passport">Passport No.</option>
              <option value="country">Nationality / Country</option>
              <option value="email">Email Address</option>
              <option value="phone">Phone Number</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="flex-1 min-w-[220px] flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Search:</span>
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search travelers, passport, emails..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Statuses ({travellers.length})</option>
              <option value="ACTIVE">Active ({activeCount})</option>
              <option value="BLOCKED">Blocked ({blockedCount})</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="name-asc">Name (A &rarr; Z)</option>
              <option value="name-desc">Name (Z &rarr; A)</option>
              <option value="id-asc">Traveler ID (Asc)</option>
              <option value="apps-desc">Most Visa Apps</option>
              <option value="bookings-desc">Most Bookings</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. MAIN LISTING CONTAINER: TABLE OR CARDS                      */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Subheader bar */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 bg-slate-50/50">
          <span className="font-bold text-slate-800">
            Traveler Listing &mdash; {viewFormat === 'cards' ? 'Card Format' : 'Table Format'} ({filteredTravellers.length} {filteredTravellers.length === 1 ? 'Traveler' : 'Travelers'})
          </span>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold hidden sm:inline">Format:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setViewFormat('table')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                  viewFormat === 'table' ? 'bg-[#0F0E2B] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                = Table
              </button>
              <button
                type="button"
                onClick={() => setViewFormat('cards')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                  viewFormat === 'cards' ? 'bg-[#0F0E2B] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ◼ Cards
              </button>
            </div>
          </div>
        </div>

        {/* View rendering */}
        {viewFormat === 'table' ? (
          /* TABLE VIEW */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-700 uppercase tracking-wider">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">TRAVELLER NAME</th>
                  <th className="py-3 px-4">PASSPORT NO.</th>
                  <th className="py-3 px-4">NATIONALITY</th>
                  <th className="py-3 px-4">PASSPORT EXPIRY</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-center">VISA APPS</th>
                  <th className="py-3 px-4 text-center">BOOKINGS</th>
                  <th className="py-3 px-4 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedTravellers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                      No travelers found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedTravellers.map((traveller) => {
                    const visaCount = traveller.totalVisaApps ?? (traveller.visaApplications ? traveller.visaApplications.length : 0)
                    const bookingCount = traveller.totalBookings ?? (traveller.holidayBookings ? traveller.holidayBookings.length : 0)

                    return (
                      <tr key={traveller.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {traveller.id}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded bg-[#0F0E2B] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                              {traveller.avatar || (traveller.name ? traveller.name.slice(0, 2).toUpperCase() : 'TR')}
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => setSelectedTravellerId(traveller.id)}
                                className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left block cursor-pointer"
                              >
                                {traveller.name}
                              </button>
                              <span className="text-[10px] text-slate-400 block">{traveller.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">
                          {traveller.passport}
                        </td>
                        <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                          {traveller.country}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                          {traveller.expiry}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase border ${
                              traveller.status === 'ACTIVE'
                                ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50'
                                : 'border-rose-200 text-rose-700 bg-rose-50/50'
                            }`}
                          >
                            {traveller.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800 whitespace-nowrap">
                          {visaCount}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800 whitespace-nowrap">
                          {bookingCount}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedTravellerId(traveller.id)}
                              className="px-2 py-1 rounded bg-[#0F0E2B] text-white hover:bg-[#181445] text-[9px] font-bold transition-colors cursor-pointer"
                            >
                              View Profile &rarr;
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(traveller)}
                              className="px-2 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-50 text-[9px] font-medium transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(traveller.id)}
                              className="px-1.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 text-[9px] font-medium transition-colors cursor-pointer"
                              title={traveller.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                            >
                              {traveller.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmTraveller(traveller)}
                              className="p-1 rounded border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 text-[9px] transition-colors cursor-pointer"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* CARD VIEW (Matching Screenshot 2 Wireframe) */
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {paginatedTravellers.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                No travelers found matching your criteria.
              </div>
            ) : (
              paginatedTravellers.map((traveller) => (
                <TravellerCard
                  key={traveller.id}
                  traveller={traveller}
                  onView={() => setSelectedTravellerId(traveller.id)}
                  onEdit={() => handleOpenEdit(traveller)}
                  onToggleStatus={() => handleToggleStatus(traveller.id)}
                  onDelete={() => setDeleteConfirmTraveller(traveller)}
                />
              ))
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 4. PAGINATION CONTROLS (Applies to BOTH Table & Cards)         */}
        {/* ------------------------------------------------------------- */}
        <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-600 bg-white">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="px-2 py-1 rounded border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={20}>20</option>
            </select>
            <span className="text-slate-500 ml-2">
              Showing {totalItems > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems} travelers
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

      {/* ------------------------------------------------------------- */}
      {/* 5. MODAL: ADD TRAVELER                                         */}
      {/* ------------------------------------------------------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Add New Traveler Profile</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Traveler Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vikramaditya Roy"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Passport Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.passport}
                    onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
                    placeholder="e.g. Z9847291"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Nationality / Country
                  </label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    placeholder="e.g. India"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Passport Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 99112 23344"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="traveler@example.com"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Associated Client / Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Apex Tours & Tech"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0F0E2B] hover:bg-[#181445] text-white text-xs font-bold cursor-pointer"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. MODAL: EDIT TRAVELER                                        */}
      {/* ------------------------------------------------------------- */}
      {editingTraveller && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                Edit Traveler #{editingTraveller.id}
              </h3>
              <button
                type="button"
                onClick={() => setEditingTraveller(null)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Traveler Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Passport Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.passport}
                    onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Nationality / Country
                  </label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Passport Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Associated Client / Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTraveller(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0F0E2B] hover:bg-[#181445] text-white text-xs font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. MODAL: DELETE CONFIRMATION                                 */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirmTraveller && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-lg shrink-0">
                ⚠️
              </span>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Delete Traveler Profile?</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to delete profile for <strong>{deleteConfirmTraveller.name}</strong> ({deleteConfirmTraveller.id})?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmTraveller(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Travellers
