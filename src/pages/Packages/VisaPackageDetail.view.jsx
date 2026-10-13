import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ROUTES from '../../config/routes'
import Modal from '../../components/Modal/Modal.component'
import usePermission from '../../hooks/usePermission'
import packagesService from '../../services/packages'

export const VisaPackageDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = usePermission()

  const [country, setCountry] = useState(() => (id ? packagesService.getVisaPackageById(id) : null))

  // Modals
  const [isEditCountryModalOpen, setIsEditCountryModalOpen] = useState(false)
  const [countryForm, setCountryForm] = useState({
    countryName: '',
    flag: '',
    code: '',
    image: '',
    processingTime: '',
    startingFee: 0,
    embassyStatus: '',
    status: 'ACTIVE',
  })

  // Visa Type Modal
  const [isVisaTypeModalOpen, setIsVisaTypeModalOpen] = useState(false)
  const [editingVisaType, setEditingVisaType] = useState(null)
  const [visaTypeForm, setVisaTypeForm] = useState({
    name: '',
    validity: '',
    stayDuration: '',
    fee: 20000,
  })

  // Document Requirement Modal
  const [isDocModalOpen, setIsDocModalOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState(null)
  const [docForm, setDocForm] = useState({
    name: '',
    requirementType: 'MANDATORY',
    instructions: '',
  })

  // Embassy Guidance Modal
  const [isGuidanceModalOpen, setIsGuidanceModalOpen] = useState(false)
  const [guidanceText, setGuidanceText] = useState('')

  const loadCountry = () => {
    if (!id) return
    const data = packagesService.getVisaPackageById(id)
    if (data) {
      setCountry(data)
    }
  }

  useEffect(() => {
    if (id) {
      const data = packagesService.getVisaPackageById(id)
      if (data) setCountry(data)
    }
  }, [id])

  if (!country) {
    return (
      <div className="p-12 text-center space-y-4 font-sans bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto my-12">
        <span className="text-4xl block">🔍</span>
        <h2 className="text-base font-bold text-slate-800">Visa Country Program Not Found</h2>
        <p className="text-slate-500 text-xs">The requested country code could not be located in our catalog.</p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.PACKAGES)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          &larr; Back to Packages Catalog
        </button>
      </div>
    )
  }

  // Handlers
  const handleOpenEditCountry = () => {
    setCountryForm({
      countryName: country.countryName,
      flag: country.flag || '🌍',
      code: country.code,
      image: country.image || '',
      processingTime: country.processingTime,
      startingFee: country.startingFee,
      embassyStatus: country.embassyStatus,
      status: country.status,
    })
    setIsEditCountryModalOpen(true)
  }

  const handleSaveCountry = (e) => {
    e.preventDefault()
    packagesService.updateVisaPackage(country.id, {
      ...countryForm,
      startingFee: Number(countryForm.startingFee) || 0,
    })
    setIsEditCountryModalOpen(false)
    loadCountry()
  }

  const handleOpenAddVisaType = () => {
    setEditingVisaType(null)
    setVisaTypeForm({
      name: '',
      validity: '10 Years Multiple Entry',
      stayDuration: 'Up to 180 Days',
      fee: 21000,
    })
    setIsVisaTypeModalOpen(true)
  }

  const handleOpenEditVisaType = (vt) => {
    setEditingVisaType(vt)
    setVisaTypeForm({
      name: vt.name,
      validity: vt.validity,
      stayDuration: vt.stayDuration,
      fee: vt.fee,
    })
    setIsVisaTypeModalOpen(true)
  }

  const handleSaveVisaType = (e) => {
    e.preventDefault()
    if (!visaTypeForm.name) return

    if (editingVisaType) {
      packagesService.updateVisaType(country.id, editingVisaType.id, {
        ...visaTypeForm,
        fee: Number(visaTypeForm.fee) || 0,
      })
    } else {
      packagesService.addVisaType(country.id, visaTypeForm)
    }

    setIsVisaTypeModalOpen(false)
    loadCountry()
  }

  const handleDeleteVisaType = (typeId) => {
    if (window.confirm('Delete this visa type entry?')) {
      packagesService.deleteVisaType(country.id, typeId)
      loadCountry()
    }
  }

  const handleOpenAddDoc = () => {
    setEditingDoc(null)
    setDocForm({
      name: '',
      requirementType: 'MANDATORY',
      instructions: '',
    })
    setIsDocModalOpen(true)
  }

  const handleOpenEditDoc = (doc) => {
    setEditingDoc(doc)
    setDocForm({
      name: doc.name,
      requirementType: doc.requirementType || 'MANDATORY',
      instructions: doc.instructions,
    })
    setIsDocModalOpen(true)
  }

  const handleSaveDoc = (e) => {
    e.preventDefault()
    if (!docForm.name) return

    if (editingDoc) {
      packagesService.updateDocumentRequirement(country.id, editingDoc.id, docForm)
    } else {
      packagesService.addDocumentRequirement(country.id, docForm)
    }

    setIsDocModalOpen(false)
    loadCountry()
  }

  const handleDeleteDoc = (docId) => {
    if (window.confirm('Delete this document requirement?')) {
      packagesService.deleteDocumentRequirement(country.id, docId)
      loadCountry()
    }
  }

  const handleOpenEditGuidance = () => {
    setGuidanceText(country.embassyGuidance || '')
    setIsGuidanceModalOpen(true)
  }

  const handleSaveGuidance = (e) => {
    e.preventDefault()
    packagesService.updateEmbassyGuidance(country.id, guidanceText)
    setIsGuidanceModalOpen(false)
    loadCountry()
  }

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP NAVIGATION BREADCRUMB & BACK BUTTON                    */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(ROUTES.PACKAGES)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 shadow-2xs transition-all cursor-pointer group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">&larr;</span>
          <span>Back to Packages & Catalog</span>
        </button>

        <span className="text-xs font-semibold text-slate-400 hidden sm:block">
          Country Program • {country.countryName} ({country.code})
        </span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO COUNTRY SPECIFICATION CARD                            */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-6">
        {/* Card Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl shrink-0 p-1.5 rounded-xl bg-slate-100/80 border border-slate-200/80 shadow-2xs">
              {country.flag || '🌍'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Visa Details: {country.countryName} ({country.code})
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Official diplomatic visa categories, mandatory document rules, and consulate interview procedures.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border flex items-center gap-1.5 shadow-2xs ${
                country.status === 'ACTIVE'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${country.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {country.status}
            </span>

            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenEditCountry}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
              >
                Edit Details
              </button>
            )}
          </div>
        </div>

        {/* Thumbnail & 6-Field Metadata Grid */}
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Country Cover Thumbnail */}
          <div className="w-full lg:w-56 h-32 rounded-xl overflow-hidden bg-slate-200 border border-slate-200/80 shadow-xs shrink-0">
            <img
              src={country.image}
              alt={country.countryName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&auto=format&fit=crop&q=80'
              }}
            />
          </div>

          {/* 6-Field Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3.5 w-full text-xs">
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Country Name</span>
              <span className="font-extrabold text-slate-900 text-sm block">{country.countryName}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Country Code</span>
              <span className="font-mono font-black text-slate-900 text-sm block">{country.code}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Visa Types Provided</span>
              <span className="font-extrabold text-slate-900 text-sm block">{country.visaTypes?.length || 0} Visa Types</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Processing Time</span>
              <span className="font-extrabold text-slate-900 text-sm block flex items-center gap-1">
                <span>⏱</span>
                <span>{country.processingTime}</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Starting Visa Fee</span>
              <span className="font-black text-slate-900 text-base block">
                ₹{Number(country.startingFee).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Consulate Status</span>
              <span className="font-extrabold text-emerald-700 text-xs block flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {country.embassyStatus || 'Active Visa Issuance'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. SECTION 1: VISA TYPES PROVIDED FOR [COUNTRY]               */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              1. Visa Types Provided for {country.countryName}
            </h2>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={handleOpenAddVisaType}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#0F0E2B] to-[#2E2B6E] hover:from-[#181445] hover:to-[#221F56] shadow-xs cursor-pointer"
            >
              <span>+ Add Visa Type</span>
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Visa Type Name</th>
                <th className="px-5 py-3">Validity Period</th>
                <th className="px-5 py-3">Permitted Stay Duration</th>
                <th className="px-5 py-3">Processing Fee (₹)</th>
                {isAdmin && <th className="px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {country.visaTypes && country.visaTypes.length > 0 ? (
                country.visaTypes.map((vt) => (
                  <tr key={vt.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="px-5 py-3 font-extrabold text-slate-900 text-xs">
                      {vt.name}
                    </td>
                    <td className="px-5 py-3 text-slate-600 font-medium">
                      {vt.validity}
                    </td>
                    <td className="px-5 py-3 text-slate-600 font-medium">
                      {vt.stayDuration}
                    </td>
                    <td className="px-5 py-3 font-black text-slate-900 text-xs">
                      ₹{Number(vt.fee).toLocaleString('en-IN')}
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditVisaType(vt)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVisaType(vt.id)}
                            className="px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No visa types defined yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. SECTION 2: DOCUMENT REQUIREMENTS & MATRIX                  */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D2E]" />
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              2. Document Requirements & Matrix
            </h2>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={handleOpenAddDoc}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#0F0E2B] to-[#2E2B6E] hover:from-[#181445] hover:to-[#221F56] shadow-xs cursor-pointer"
            >
              <span>+ Add Document Requirement</span>
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Document Name</th>
                <th className="px-5 py-3">Requirement Type</th>
                <th className="px-5 py-3">Guidelines & Format Instructions</th>
                {isAdmin && <th className="px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {country.documentRequirements && country.documentRequirements.length > 0 ? (
                country.documentRequirements.map((doc) => (
                  <tr key={doc.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="px-5 py-3 font-extrabold text-slate-900 text-xs">
                      {doc.name}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border ${
                          doc.requirementType === 'MANDATORY'
                            ? 'bg-slate-100 text-slate-800 border-slate-300'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        }`}
                      >
                        {doc.requirementType}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600 leading-relaxed max-w-xl">
                      {doc.instructions}
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditDoc(doc)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No document requirements defined yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. SECTION 3: OFFICIAL EMBASSY GUIDANCE CALLOUT               */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              3. Official Embassy Guidance & Application Instructions
            </h2>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={handleOpenEditGuidance}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
            >
              Edit Guidance
            </button>
          )}
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/20 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <span>🏛️</span>
            <span>Step-by-Step Consulate Guidance:</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-normal">
            {country.embassyGuidance || 'No specific consulate guidance instructions added yet.'}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: Edit Country Overview                                  */}
      {/* ------------------------------------------------------------- */}
      {isEditCountryModalOpen && (
        <Modal
          isOpen={isEditCountryModalOpen}
          onClose={() => setIsEditCountryModalOpen(false)}
          title={`Edit Details: ${country.countryName}`}
          size="md"
        >
          <form onSubmit={handleSaveCountry} className="space-y-4 font-sans">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Country Name</label>
              <input
                type="text"
                required
                value={countryForm.countryName}
                onChange={(e) => setCountryForm({ ...countryForm, countryName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Standard Processing Time</label>
                <input
                  type="text"
                  value={countryForm.processingTime}
                  onChange={(e) => setCountryForm({ ...countryForm, processingTime: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Starting Fee (₹)</label>
                <input
                  type="number"
                  value={countryForm.startingFee}
                  onChange={(e) => setCountryForm({ ...countryForm, startingFee: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Embassy Status</label>
              <input
                type="text"
                value={countryForm.embassyStatus}
                onChange={(e) => setCountryForm({ ...countryForm, embassyStatus: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsEditCountryModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: Add / Edit Visa Type                                   */}
      {/* ------------------------------------------------------------- */}
      {isVisaTypeModalOpen && (
        <Modal
          isOpen={isVisaTypeModalOpen}
          onClose={() => setIsVisaTypeModalOpen(false)}
          title={editingVisaType ? 'Edit Visa Type' : 'Add Visa Type'}
          size="md"
        >
          <form onSubmit={handleSaveVisaType} className="space-y-4 font-sans">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Visa Type Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. B1/B2 Tourist & Business Visa"
                value={visaTypeForm.name}
                onChange={(e) => setVisaTypeForm({ ...visaTypeForm, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Validity Period</label>
                <input
                  type="text"
                  placeholder="e.g. 10 Years Multiple Entry"
                  value={visaTypeForm.validity}
                  onChange={(e) => setVisaTypeForm({ ...visaTypeForm, validity: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Permitted Stay Duration</label>
                <input
                  type="text"
                  placeholder="e.g. up to 180 Days"
                  value={visaTypeForm.stayDuration}
                  onChange={(e) => setVisaTypeForm({ ...visaTypeForm, stayDuration: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Processing Fee (₹) *</label>
              <input
                type="number"
                required
                value={visaTypeForm.fee}
                onChange={(e) => setVisaTypeForm({ ...visaTypeForm, fee: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsVisaTypeModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                {editingVisaType ? 'Save Changes' : 'Add Visa Type'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: Add / Edit Document Requirement                        */}
      {/* ------------------------------------------------------------- */}
      {isDocModalOpen && (
        <Modal
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
          title={editingDoc ? 'Edit Document Requirement' : 'Add Document Requirement'}
          size="md"
        >
          <form onSubmit={handleSaveDoc} className="space-y-4 font-sans">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Document Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. DS-160 Confirmation Page"
                value={docForm.name}
                onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Requirement Type</label>
              <select
                value={docForm.requirementType}
                onChange={(e) => setDocForm({ ...docForm, requirementType: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
              >
                <option value="MANDATORY">MANDATORY</option>
                <option value="OPTIONAL">OPTIONAL</option>
                <option value="CONDITIONAL">CONDITIONAL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Guidelines & Instructions</label>
              <textarea
                rows={3}
                placeholder="Must have barcoded confirmation printed in high resolution..."
                value={docForm.instructions}
                onChange={(e) => setDocForm({ ...docForm, instructions: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsDocModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                {editingDoc ? 'Save Changes' : 'Add Document'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: Edit Embassy Guidance                                  */}
      {/* ------------------------------------------------------------- */}
      {isGuidanceModalOpen && (
        <Modal
          isOpen={isGuidanceModalOpen}
          onClose={() => setIsGuidanceModalOpen(false)}
          title="Edit Official Embassy Guidance & Instructions"
          size="lg"
        >
          <form onSubmit={handleSaveGuidance} className="space-y-4 font-sans">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Step-by-Step Guidance Content</label>
              <textarea
                rows={5}
                required
                value={guidanceText}
                onChange={(e) => setGuidanceText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 leading-relaxed"
                placeholder="Enter step-by-step guidance, consulate instructions, interview booking steps..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsGuidanceModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                Update Guidance
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default VisaPackageDetail
