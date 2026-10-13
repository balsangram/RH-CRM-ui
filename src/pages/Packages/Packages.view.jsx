import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ROUTES from '../../config/routes'
import Modal from '../../components/Modal/Modal.component'
import Pagination from '../../components/Pagination/Pagination.component'
import ImageUpload from '../../components/ImageUpload/ImageUpload.component'
import usePermission from '../../hooks/usePermission'
import packagesService from '../../services/packages'

export const Packages = () => {
  const navigate = useNavigate()
  const { isAdmin, role } = usePermission()

  // Active Tab: 'VISA' (11.1) or 'HOLIDAYS' (11.2)
  const [activeTab, setActiveTab] = useState('VISA')

  // Data states
  const [visaPackages, setVisaPackages] = useState(() => packagesService.getVisaPackages())
  const [holidayPackages, setHolidayPackages] = useState(() => packagesService.getHolidayPackages())
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'ACTIVE' | 'INACTIVE'

  // Pagination states
  const [visaPage, setVisaPage] = useState(1)
  const [visaItemsPerPage, setVisaItemsPerPage] = useState(5)

  const [holidayPage, setHolidayPage] = useState(1)
  const [holidayItemsPerPage, setHolidayItemsPerPage] = useState(6)

  // Modals
  const [isAddVisaModalOpen, setIsAddVisaModalOpen] = useState(false)
  const [editingVisaCountry, setEditingVisaCountry] = useState(null)

  const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false)
  const [editingHolidayPackage, setEditingHolidayPackage] = useState(null)

  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null)

  // Visa Country Form State
  const [visaForm, setVisaForm] = useState({
    countryName: '',
    code: '',
    flag: '🌍',
    image: '',
    processingTime: '10-15 Days',
    startingFee: 20000,
    status: 'ACTIVE',
    embassyStatus: 'Active Visa Issuance',
  })

  // Holiday Package Form State
  const [holidayForm, setHolidayForm] = useState({
    name: '',
    country: '',
    destination: '',
    duration: '6 Days / 5 Nights',
    price: 75000,
    image: '',
    images: [],
    overview: '',
    inclusions: '',
    exclusions: '',
    status: 'ACTIVE',
  })

  const loadData = () => {
    setVisaPackages(packagesService.getVisaPackages())
    setHolidayPackages(packagesService.getHolidayPackages())
  }

  // Filtered lists
  const filteredVisaPackages = useMemo(() => {
    return visaPackages.filter((v) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        v.countryName.toLowerCase().includes(q) ||
        v.code.toLowerCase().includes(q) ||
        v.processingTime.toLowerCase().includes(q)

      const matchesStatus =
        statusFilter === 'ALL' || v.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [visaPackages, searchQuery, statusFilter])

  const filteredHolidayPackages = useMemo(() => {
    return holidayPackages.filter((h) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q) ||
        h.destination.toLowerCase().includes(q) ||
        h.id.toLowerCase().includes(q)

      const matchesStatus =
        statusFilter === 'ALL' || h.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [holidayPackages, searchQuery, statusFilter])

  // Paginated Visa Packages
  const totalVisaItems = filteredVisaPackages.length
  const totalVisaPages = Math.ceil(totalVisaItems / visaItemsPerPage) || 1
  const paginatedVisaPackages = useMemo(() => {
    const start = (visaPage - 1) * visaItemsPerPage
    return filteredVisaPackages.slice(start, start + visaItemsPerPage)
  }, [filteredVisaPackages, visaPage, visaItemsPerPage])

  // Paginated Holiday Packages
  const totalHolidayItems = filteredHolidayPackages.length
  const totalHolidayPages = Math.ceil(totalHolidayItems / holidayItemsPerPage) || 1
  const paginatedHolidayPackages = useMemo(() => {
    const start = (holidayPage - 1) * holidayItemsPerPage
    return filteredHolidayPackages.slice(start, start + holidayItemsPerPage)
  }, [filteredHolidayPackages, holidayPage, holidayItemsPerPage])

  // Handlers
  const handleOpenAddVisa = () => {
    setEditingVisaCountry(null)
    setVisaForm({
      countryName: '',
      code: '',
      flag: '🌍',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80',
      processingTime: '10-15 Days',
      startingFee: 20000,
      status: 'ACTIVE',
      embassyStatus: 'Active Visa Issuance',
    })
    setIsAddVisaModalOpen(true)
  }

  const handleOpenEditVisa = (country) => {
    setEditingVisaCountry(country)
    setVisaForm({
      countryName: country.countryName,
      code: country.code,
      flag: country.flag || '🌍',
      image: country.image || '',
      processingTime: country.processingTime,
      startingFee: country.startingFee,
      status: country.status,
      embassyStatus: country.embassyStatus || 'Active Visa Issuance',
    })
    setIsAddVisaModalOpen(true)
  }

  const handleSaveVisaCountry = (e) => {
    e.preventDefault()
    if (!visaForm.countryName || !visaForm.code) return

    if (editingVisaCountry) {
      packagesService.updateVisaPackage(editingVisaCountry.id, {
        ...visaForm,
        startingFee: Number(visaForm.startingFee) || 0,
      })
    } else {
      packagesService.createVisaPackage({
        ...visaForm,
        startingFee: Number(visaForm.startingFee) || 0,
        visaTypes: [
          {
            id: `VT-${Date.now().toString().slice(-4)}`,
            name: 'Standard Tourist / Visitor Visa',
            validity: 'Up to 6 Months',
            stayDuration: 'Up to 90 Days',
            fee: Number(visaForm.startingFee) || 0,
          },
        ],
        documentRequirements: [
          {
            id: `DOC-1`,
            name: 'Valid Passport (6+ Months)',
            requirementType: 'MANDATORY',
            instructions: 'Original passport with at least 2 empty visa pages.',
          },
          {
            id: `DOC-2`,
            name: 'Bank Financial Statements (6 Months)',
            requirementType: 'MANDATORY',
            instructions: 'Official bank attested statements with seal.',
          },
        ],
        embassyGuidance: 'Submit verified application via authorized VAC. Keep original documents ready for biometric verification.',
      })
    }

    setIsAddVisaModalOpen(false)
    loadData()
  }

  const handleOpenAddHoliday = () => {
    setEditingHolidayPackage(null)
    setHolidayForm({
      name: '',
      country: '',
      destination: '',
      duration: '6 Days / 5 Nights',
      price: 85000,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'],
      overview: 'Exciting comprehensive travel experience with premium stays, guided visits, and all primary inclusions.',
      inclusions: '4-Star Central Accommodation, Daily Breakfast, Private Transfers, English Speaking Guide',
      exclusions: 'International Airfare, Personal Purchases, Meals not specified, Travel Insurance',
      status: 'ACTIVE',
    })
    setIsAddHolidayModalOpen(true)
  }

  const handleOpenEditHoliday = (pkg) => {
    setEditingHolidayPackage(pkg)
    const pkgImages = pkg.images && pkg.images.length > 0 ? pkg.images : (pkg.image ? [pkg.image] : [])
    setHolidayForm({
      name: pkg.name,
      country: pkg.country,
      destination: pkg.destination,
      duration: pkg.duration,
      price: pkg.price,
      image: pkgImages[0] || pkg.image || '',
      images: pkgImages,
      overview: pkg.overview || '',
      inclusions: pkg.inclusions || '',
      exclusions: pkg.exclusions || '',
      status: pkg.status,
    })
    setIsAddHolidayModalOpen(true)
  }

  const handleSaveHolidayPackage = (e) => {
    e.preventDefault()
    if (!holidayForm.name || !holidayForm.destination) return

    if (editingHolidayPackage) {
      packagesService.updateHolidayPackage(editingHolidayPackage.id, {
        ...holidayForm,
        price: Number(holidayForm.price) || 0,
      })
    } else {
      packagesService.createHolidayPackage({
        ...holidayForm,
        price: Number(holidayForm.price) || 0,
        itinerary: [
          {
            day: 1,
            title: 'Arrival & Welcome Reception',
            description: 'Arrival at destination airport, private transfer to luxury hotel, leisure evening.',
          },
          {
            day: 2,
            title: 'Iconic City Highlights Tour',
            description: 'Guided tour exploring historic architectural landmarks and cultural points of interest.',
          },
          {
            day: 3,
            title: 'Scenic Nature & Day Excursion',
            description: 'Full day excursion to picturesque natural locations with included lunch and photo stops.',
          },
          {
            day: 4,
            title: 'Free Day for Shopping & Leisure',
            description: 'Enjoy free time at traditional markets, local shopping districts, and relaxing evening dinners.',
          },
          {
            day: 5,
            title: 'Departure Transfer',
            description: 'Breakfast at hotel, check-out, and private airport drop-off for flight home.',
          },
        ],
      })
    }

    setIsAddHolidayModalOpen(false)
    loadData()
  }

  const handleToggleVisaStatus = (country) => {
    packagesService.toggleVisaPackageStatus(country.id)
    loadData()
  }

  const handleToggleHolidayStatus = (pkg) => {
    packagesService.toggleHolidayPackageStatus(pkg.id)
    loadData()
  }

  const handleConfirmDelete = () => {
    if (!deleteConfirmTarget) return
    if (deleteConfirmTarget.type === 'VISA') {
      packagesService.deleteVisaPackage(deleteConfirmTarget.item.id)
    } else {
      packagesService.deleteHolidayPackage(deleteConfirmTarget.item.id)
    }
    setDeleteConfirmTarget(null)
    loadData()
  }

  return (
    <div className="space-y-3.5 pb-10 font-sans">
      {/* ------------------------------------------------------------- */}
      {/* 1. COMPACT PAGE HEADER                                        */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/80 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-5 px-1.5 text-[10px] font-black rounded bg-primary text-white flex items-center justify-center">
              11
            </span>
            <h1 className="text-base sm:text-lg font-bold text-main tracking-tight">
              Packages Catalog & Inventory
            </h1>
            <span className="text-[11px] text-muted hidden sm:inline">
              • Visa Programs & Holiday Tours
            </span>
          </div>
        </div>

        {/* Role Privileges Indicator */}
        {/* <div className="flex items-center gap-2">
          {isAdmin ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E11D2E]/10 text-[#E11D2E] border border-[#E11D2E]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2E]" />
              Admin (Full CRUD)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Staff ({role || 'AGENT'}) • View-Only
            </span>
          )}
        </div> */}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. COMPACT TABS & ACTIONS ROW                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Segmented Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('VISA')
              setVisaPage(1)
            }}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer text-xs ${
              activeTab === 'VISA'
                ? 'bg-[#181445] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>11.1 Visa Packages / Countries</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'VISA' ? 'bg-[#E11D2E] text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {visaPackages.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('HOLIDAYS')
              setHolidayPage(1)
            }}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer text-xs ${
              activeTab === 'HOLIDAYS'
                ? 'bg-[#181445] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>11.2 Holiday / Tour Packages</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'HOLIDAYS' ? 'bg-[#E11D2E] text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {holidayPackages.length}
            </span>
          </button>
        </div>

        {/* Admin Add Buttons */}
        <div>
          {isAdmin && activeTab === 'VISA' && (
            <button
              type="button"
              onClick={handleOpenAddVisa}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs text-white bg-[#0F0E2B] hover:bg-[#181445] shadow-xs active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>+ Add Visa Country</span>
            </button>
          )}

          {isAdmin && activeTab === 'HOLIDAYS' && (
            <button
              type="button"
              onClick={handleOpenAddHoliday}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs text-white bg-[#0F0E2B] hover:bg-[#181445] shadow-xs active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>+ Add Holiday Package</span>
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. SEARCH & FILTER CONTROLS BAR (COMPACT)                     */}
      {/* ------------------------------------------------------------- */}
      <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <h2 className="text-xs sm:text-sm font-bold text-main">
            {activeTab === 'VISA' ? 'Visa Packages & Countries Offered' : 'Holiday / Tour Packages'}
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
            {activeTab === 'VISA' ? `${filteredVisaPackages.length} Countries` : `${filteredHolidayPackages.length} Packages`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setVisaPage(1)
              setHolidayPage(1)
            }}
            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border bg-slate-50 text-main focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setVisaPage(1)
                setHolidayPage(1)
              }}
              placeholder={activeTab === 'VISA' ? 'Search country, code...' : 'Search package, destination...'}
              className="w-full pl-7 pr-3 py-1 text-xs rounded-lg bg-slate-50 border border-border text-main placeholder-muted focus:outline-none focus:border-primary"
            />
            <svg
              className="w-3.5 h-3.5 text-muted absolute left-2 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setVisaPage(1)
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-main text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. TAB 1: VISA PACKAGES & COUNTRIES TABLE (COMPACT + PAGINATED)*/}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'VISA' && (
        <div className="bg-white rounded-xl border border-border shadow-2xs p-3 space-y-3">
          <div className="overflow-x-auto rounded-lg border border-border/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-border text-[10px] font-bold text-muted uppercase tracking-wider">
                <tr>
                  <th className="px-3.5 py-2">Country / Image</th>
                  <th className="px-3.5 py-2">Country Name</th>
                  <th className="px-3.5 py-2">Code</th>
                  <th className="px-3.5 py-2">Visa Types Offered</th>
                  <th className="px-3.5 py-2">Processing Time</th>
                  <th className="px-3.5 py-2">Starting Fee (₹)</th>
                  <th className="px-3.5 py-2">Status</th>
                  <th className="px-3.5 py-2 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {paginatedVisaPackages.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted text-xs">
                      No matching visa countries found.
                    </td>
                  </tr>
                ) : (
                  paginatedVisaPackages.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Country Photo & Flag */}
                      <td className="px-3.5 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="relative w-10 h-6.5 rounded overflow-hidden bg-slate-200 border border-border shrink-0 shadow-2xs">
                            <img
                              src={row.image}
                              alt={row.countryName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80'
                              }}
                            />
                          </div>
                          <span className="text-base shrink-0" title={row.countryName}>
                            {row.flag || '🌍'}
                          </span>
                        </div>
                      </td>

                      {/* Country Name */}
                      <td className="px-3.5 py-2 whitespace-nowrap">
                        <div>
                          <span className="font-bold text-main block text-xs">
                            {row.countryName}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {row.embassyStatus || 'Active Visa Issuance'}
                          </span>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="px-3.5 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {row.code}
                        </span>
                      </td>

                      {/* Visa Types Offered */}
                      <td className="px-3.5 py-2 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border border-slate-300 bg-white text-main shadow-2xs">
                          {row.visaTypes?.length || 0} TYPES
                        </span>
                      </td>

                      {/* Processing Time */}
                      <td className="px-3.5 py-2 whitespace-nowrap">
                        <span className="text-xs text-muted font-medium">
                          {row.processingTime}
                        </span>
                      </td>

                      {/* Starting Fee */}
                      <td className="px-3.5 py-2 whitespace-nowrap">
                        <span className="font-bold text-main text-xs">
                          ₹{Number(row.startingFee).toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3.5 py-2 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${
                            row.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-rose-50 text-rose-700 border-rose-300'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-3.5 py-2 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(ROUTES.PACKAGES_VISA_DETAIL.replace(':id', row.id))
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded bg-[#0F0E2B] hover:bg-[#181445] text-white shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>View Details</span>
                            <span>&rarr;</span>
                          </button>

                          {isAdmin && (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOpenEditVisa(row)
                                }}
                                className="px-2 py-1 text-[11px] font-medium rounded border border-slate-300 bg-white hover:bg-slate-50 text-main transition-colors cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleToggleVisaStatus(row)
                                }}
                                className="px-2 py-1 text-[11px] font-medium rounded border border-slate-300 bg-white hover:bg-rose-50 hover:text-rose-700 text-muted transition-colors cursor-pointer"
                              >
                                {row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Global Pagination Component */}
          <Pagination
            currentPage={visaPage}
            totalPages={totalVisaPages}
            totalItems={totalVisaItems}
            itemsPerPage={visaItemsPerPage}
            onPageChange={setVisaPage}
            onItemsPerPageChange={(newSize) => {
              setVisaItemsPerPage(newSize)
              setVisaPage(1)
            }}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. TAB 2: HOLIDAY PACKAGES GRID (COMPACT + PAGINATED)          */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'HOLIDAYS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {paginatedHolidayPackages.length === 0 ? (
              <div className="col-span-full py-10 text-center text-muted text-xs bg-white rounded-xl border border-border">
                No matching holiday packages found.
              </div>
            ) : (
              paginatedHolidayPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-xl border border-border overflow-hidden shadow-2xs hover:shadow-sm transition-all flex flex-col group"
                >
                  {/* Image Cover */}
                  <div className="relative h-32 w-full bg-slate-200 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Floating Badges */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/90 text-main shadow-2xs">
                        {pkg.id} • {pkg.country}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase shadow-2xs ${
                          pkg.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                        }`}
                      >
                        {pkg.status}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[11px] font-semibold drop-shadow">
                      <span className="truncate pr-2">📍 {pkg.destination}</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-medium shrink-0 flex items-center gap-1">
                        📷 {(pkg.images && pkg.images.length > 0 ? pkg.images.length : (pkg.image ? 1 : 0))}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-main group-hover:text-primary transition-colors leading-snug">
                        {pkg.name}
                      </h3>

                      <div className="flex items-center gap-2 text-[11px] text-muted mt-1 font-medium">
                        <span>⏱ {pkg.duration}</span>
                      </div>

                      {/* Price */}
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-base font-black text-main">
                          ₹{Number(pkg.price).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-muted">{pkg.priceUnit || 'per person'}</span>
                      </div>

                      {/* Inclusions summary */}
                      <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] text-muted">
                        <span className="font-bold text-main uppercase tracking-wider block mb-0.5">
                          Inclusions:
                        </span>
                        <p className="line-clamp-2 leading-relaxed">
                          {pkg.inclusions || 'Hotel accommodation, daily breakfast, airport transfers, sightseeing tours.'}
                        </p>
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-2 border-t border-border flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => navigate(ROUTES.PACKAGES_HOLIDAY_DETAIL.replace(':id', pkg.id))}
                        className="flex-1 py-1.5 px-2.5 text-xs font-semibold rounded bg-[#0F0E2B] hover:bg-[#181445] text-white shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>View Details</span>
                        <span>&rarr;</span>
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEditHoliday(pkg)}
                            className="py-1.5 px-2.5 text-xs font-medium rounded border border-slate-300 bg-white hover:bg-slate-50 text-main transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleHolidayStatus(pkg)}
                            className="py-1.5 px-2 text-xs font-medium rounded border border-slate-300 bg-white hover:bg-rose-50 hover:text-rose-700 text-muted transition-colors cursor-pointer"
                          >
                            {pkg.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Holiday Packages Pagination */}
          <div className="bg-white rounded-xl border border-border p-3 shadow-2xs">
            <Pagination
              currentPage={holidayPage}
              totalPages={totalHolidayPages}
              totalItems={totalHolidayItems}
              itemsPerPage={holidayItemsPerPage}
              onPageChange={setHolidayPage}
              onItemsPerPageChange={(newSize) => {
                setHolidayItemsPerPage(newSize)
                setHolidayPage(1)
              }}
              pageSizeOptions={[3, 6, 9]}
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT VISA COUNTRY                                */}
      {/* ------------------------------------------------------------- */}
      {isAddVisaModalOpen && (
        <Modal
          isOpen={isAddVisaModalOpen}
          onClose={() => setIsAddVisaModalOpen(false)}
          title={editingVisaCountry ? `Edit Visa Country: ${editingVisaCountry.countryName}` : 'Add New Visa Country'}
          size="md"
        >
          <form onSubmit={handleSaveVisaCountry} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-main mb-1">Country Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United States"
                  value={visaForm.countryName}
                  onChange={(e) => setVisaForm({ ...visaForm, countryName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-main mb-1">Country Code *</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="e.g. US"
                  value={visaForm.code}
                  onChange={(e) => setVisaForm({ ...visaForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-2.5 py-1.5 text-xs uppercase font-mono rounded-lg border border-border bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-main mb-1">Flag Emoji</label>
                <input
                  type="text"
                  placeholder="e.g. 🇺🇸"
                  value={visaForm.flag}
                  onChange={(e) => setVisaForm({ ...visaForm, flag: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-main mb-1">Starting Fee (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 21000"
                  value={visaForm.startingFee}
                  onChange={(e) => setVisaForm({ ...visaForm, startingFee: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-main mb-1">Processing Time</label>
                <input
                  type="text"
                  placeholder="e.g. 10-15 Days"
                  value={visaForm.processingTime}
                  onChange={(e) => setVisaForm({ ...visaForm, processingTime: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-main mb-1">Embassy Status</label>
                <input
                  type="text"
                  placeholder="e.g. Active Visa Issuance"
                  value={visaForm.embassyStatus}
                  onChange={(e) => setVisaForm({ ...visaForm, embassyStatus: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-main mb-1">Thumbnail Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={visaForm.image}
                onChange={(e) => setVisaForm({ ...visaForm, image: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsAddVisaModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#0F0E2B] text-white hover:bg-[#181445] cursor-pointer"
              >
                {editingVisaCountry ? 'Save Changes' : 'Create Visa Country'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT HOLIDAY PACKAGE                             */}
      {/* ------------------------------------------------------------- */}
      {isAddHolidayModalOpen && (
        <Modal
          isOpen={isAddHolidayModalOpen}
          onClose={() => setIsAddHolidayModalOpen(false)}
          title={editingHolidayPackage ? `Edit Holiday Package: ${editingHolidayPackage.name}` : 'Add New Holiday Package'}
          size="md"
        >
          <form onSubmit={handleSaveHolidayPackage} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-main mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bali Island Beach Getaway"
                  value={holidayForm.name}
                  onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-main mb-1">Country / Region *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indonesia"
                  value={holidayForm.country}
                  onChange={(e) => setHolidayForm({ ...holidayForm, country: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-main mb-1">Destination *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bali, Indonesia"
                  value={holidayForm.destination}
                  onChange={(e) => setHolidayForm({ ...holidayForm, destination: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-main mb-1">Duration *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6 Days / 5 Nights"
                  value={holidayForm.duration}
                  onChange={(e) => setHolidayForm({ ...holidayForm, duration: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-main mb-1">Starting Price (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 85000"
                  value={holidayForm.price}
                  onChange={(e) => setHolidayForm({ ...holidayForm, price: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>

            </div>

            {/* Multiple Image Select, Upload & Management Section */}
            <div className="pt-1">
              <ImageUpload
                images={holidayForm.images || []}
                onChange={(imgs) =>
                  setHolidayForm({
                    ...holidayForm,
                    images: imgs,
                    image: imgs[0] || '',
                  })
                }
                label="Package Photos (Select & Upload Multiple)"
                hint="Click to select multiple images from your computer. You can set the cover photo or remove/replace photos."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-main mb-1">Tour Overview</label>
              <textarea
                rows={2}
                placeholder="Short attractive description of the holiday package..."
                value={holidayForm.overview}
                onChange={(e) => setHolidayForm({ ...holidayForm, overview: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-main mb-1">Inclusions</label>
                <textarea
                  rows={2}
                  placeholder="Resort, Breakfast, Transfers..."
                  value={holidayForm.inclusions}
                  onChange={(e) => setHolidayForm({ ...holidayForm, inclusions: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-main mb-1">Exclusions</label>
                <textarea
                  rows={2}
                  placeholder="Flights, personal expenses..."
                  value={holidayForm.exclusions}
                  onChange={(e) => setHolidayForm({ ...holidayForm, exclusions: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsAddHolidayModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#0F0E2B] text-white hover:bg-[#181445] cursor-pointer"
              >
                {editingHolidayPackage ? 'Save Changes' : 'Create Package'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DELETE CONFIRMATION                                    */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirmTarget && (
        <Modal
          isOpen={Boolean(deleteConfirmTarget)}
          onClose={() => setDeleteConfirmTarget(null)}
          title="Confirm Removal"
          size="sm"
        >
          <div className="space-y-3 text-xs">
            <p className="text-muted leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-main">
                {deleteConfirmTarget.type === 'VISA'
                  ? deleteConfirmTarget.item.countryName
                  : deleteConfirmTarget.item.name}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Packages
