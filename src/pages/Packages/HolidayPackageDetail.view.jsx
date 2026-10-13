import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ROUTES from '../../config/routes'
import Modal from '../../components/Modal/Modal.component'
import ImageUpload from '../../components/ImageUpload/ImageUpload.component'
import usePermission from '../../hooks/usePermission'
import packagesService from '../../services/packages'

export const HolidayPackageDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = usePermission()

  const [pkg, setPkg] = useState(() => (id ? packagesService.getHolidayPackageById(id) : null))
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [lightboxImage, setLightboxImage] = useState(null)

  // Modals
  const [isEditPackageModalOpen, setIsEditPackageModalOpen] = useState(false)
  const [packageForm, setPackageForm] = useState({
    name: '',
    country: '',
    destination: '',
    duration: '',
    price: 0,
    priceUnit: 'per person',
    image: '',
    images: [],
    overview: '',
    inclusions: '',
    exclusions: '',
    status: 'ACTIVE',
  })

  // Itinerary Day Modal
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)
  const [editingDay, setEditingDay] = useState(null)
  const [dayForm, setDayForm] = useState({
    day: 1,
    title: '',
    description: '',
  })

  const loadPackage = () => {
    if (!id) return
    const data = packagesService.getHolidayPackageById(id)
    if (data) {
      setPkg(data)
    }
  }

  useEffect(() => {
    if (id) {
      const data = packagesService.getHolidayPackageById(id)
      if (data) setPkg(data)
    }
  }, [id])

  if (!pkg) {
    return (
      <div className="p-10 text-center space-y-3 font-sans bg-white rounded-xl border border-border shadow-2xs max-w-md mx-auto my-12">
        <span className="text-3xl block">🏖️</span>
        <h2 className="text-sm font-bold text-main">Holiday Tour Package Not Found</h2>
        <p className="text-muted text-xs">The requested package ID could not be located in our inventory.</p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.PACKAGES)}
          className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#0F0E2B] text-white hover:bg-[#181445] transition-all cursor-pointer"
        >
          &larr; Back to Packages Catalog
        </button>
      </div>
    )
  }

  // Normalized array of images
  const allImages =
    pkg.images && pkg.images.length > 0
      ? pkg.images
      : pkg.image
      ? [pkg.image]
      : []

  const activeImage = allImages[selectedImageIndex] || allImages[0] || ''

  // Handlers
  const handleOpenEditPackage = () => {
    const pkgImages =
      pkg.images && pkg.images.length > 0
        ? pkg.images
        : pkg.image
        ? [pkg.image]
        : []

    setPackageForm({
      name: pkg.name,
      country: pkg.country,
      destination: pkg.destination,
      duration: pkg.duration,
      price: pkg.price,
      priceUnit: pkg.priceUnit || 'per person',
      image: pkgImages[0] || pkg.image || '',
      images: pkgImages,
      overview: pkg.overview || '',
      inclusions: pkg.inclusions || '',
      exclusions: pkg.exclusions || '',
      status: pkg.status,
    })
    setIsEditPackageModalOpen(true)
  }

  const handleSavePackage = (e) => {
    e.preventDefault()
    const finalImages = packageForm.images || []
    packagesService.updateHolidayPackage(pkg.id, {
      ...packageForm,
      images: finalImages,
      image: finalImages[0] || packageForm.image || '',
      price: Number(packageForm.price) || 0,
    })
    setIsEditPackageModalOpen(false)
    loadPackage()
  }

  const handleOpenAddDay = () => {
    const nextDayNum = (pkg.itinerary?.length || 0) + 1
    setEditingDay(null)
    setDayForm({
      day: nextDayNum,
      title: '',
      description: '',
    })
    setIsDayModalOpen(true)
  }

  const handleOpenEditDay = (dayItem) => {
    setEditingDay(dayItem)
    setDayForm({
      day: dayItem.day,
      title: dayItem.title,
      description: dayItem.description,
    })
    setIsDayModalOpen(true)
  }

  const handleSaveDay = (e) => {
    e.preventDefault()
    if (!dayForm.title) return

    if (editingDay) {
      packagesService.updateItineraryDay(pkg.id, editingDay.day, {
        title: dayForm.title,
        description: dayForm.description,
      })
    } else {
      packagesService.addItineraryDay(pkg.id, dayForm)
    }

    setIsDayModalOpen(false)
    loadPackage()
  }

  const handleDeleteDay = (dayNum) => {
    if (window.confirm(`Delete Day ${dayNum} itinerary plan?`)) {
      packagesService.deleteItineraryDay(pkg.id, dayNum)
      loadPackage()
    }
  }

  // Split comma or dot separated inclusions / exclusions into clean lists
  const inclusionsList = (pkg.inclusions || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const exclusionsList = (pkg.exclusions || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div className="space-y-4 pb-16 font-sans">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP NAVIGATION BREADCRUMB & BACK BUTTON                    */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(ROUTES.PACKAGES)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-slate-50 text-xs font-semibold text-main shadow-2xs transition-all cursor-pointer group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">&larr;</span>
          <span>Back to Packages Catalog</span>
        </button>

        <span className="text-xs font-semibold text-muted hidden sm:block">
          Tour Package • {pkg.name} ({pkg.id})
        </span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO HOLIDAY SPECIFICATION CARD WITH PHOTO SHOWCASE        */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {pkg.id}
              </span>
              <h1 className="text-base sm:text-lg font-black text-main tracking-tight">
                Holiday Package: {pkg.name}
              </h1>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Curated leisure tour itinerary, deluxe accommodations, sightseeing schedules, and complete traveler inclusions.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border flex items-center gap-1.5 shadow-2xs ${
                pkg.status === 'ACTIVE'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-rose-50 text-rose-700 border-rose-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${pkg.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {pkg.status}
            </span>

            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenEditPackage}
                className="px-3 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-main shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>✏️</span>
                <span>Edit Package & Photos</span>
              </button>
            )}
          </div>
        </div>

        {/* Media Showcase & 6-Field Metadata Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left: Interactive Tour Media Showcase */}
          <div className="lg:col-span-5 space-y-2">
            {/* Active Large Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-border shadow-xs group">
              <img
                src={activeImage}
                alt={pkg.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 cursor-pointer"
                onClick={() => setLightboxImage(activeImage)}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badges */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                {selectedImageIndex === 0 ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E11D2E] text-white shadow-xs">
                    ★ Cover Photo
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 backdrop-blur-xs text-white shadow-xs">
                    Photo {selectedImageIndex + 1} of {allImages.length}
                  </span>
                )}
              </div>

              {/* Lightbox Trigger Icon */}
              <button
                type="button"
                onClick={() => setLightboxImage(activeImage)}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/50 hover:bg-black/75 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                title="View Fullscreen"
              >
                🔍
              </button>

              {/* Prev / Next Controls if multiple photos */}
              {allImages.length > 1 && (
                <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))
                    }}
                    className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-xs font-bold pointer-events-auto shadow-xs transition-transform hover:scale-105 cursor-pointer"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))
                    }}
                    className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-xs font-bold pointer-events-auto shadow-xs transition-transform hover:scale-105 cursor-pointer"
                  >
                    ›
                  </button>
                </div>
              )}

              {/* Bottom Caption */}
              <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-semibold drop-shadow flex items-center justify-between">
                <span>📍 {pkg.destination}</span>
                <span className="text-[10px] text-white/80">
                  {allImages.length} {allImages.length === 1 ? 'Photo' : 'Photos'}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'ring-2 ring-[#2E2B6E] border-transparent scale-102'
                        : 'border-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-[#E11D2E] text-white text-[7px] font-black uppercase text-center leading-tight">
                        Cover
                      </span>
                    )}
                  </button>
                ))}

                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleOpenEditPackage}
                    className="w-14 h-10 rounded-lg border-2 border-dashed border-slate-300 hover:border-primary/60 bg-slate-50 hover:bg-slate-100 text-muted hover:text-primary flex flex-col items-center justify-center shrink-0 text-[9px] font-bold transition-all cursor-pointer"
                    title="Upload more photos"
                  >
                    <span>+</span>
                    <span>Upload</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: 6-Field Metadata Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-border/80 space-y-0.5">
              <span className="text-muted text-[10px] uppercase font-bold tracking-wider block">Package ID</span>
              <span className="font-mono font-black text-main text-xs sm:text-sm block">{pkg.id}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-border/80 space-y-0.5">
              <span className="text-muted text-[10px] uppercase font-bold tracking-wider block">Package Name</span>
              <span className="font-extrabold text-main text-xs sm:text-sm block truncate" title={pkg.name}>
                {pkg.name}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-border/80 space-y-0.5">
              <span className="text-muted text-[10px] uppercase font-bold tracking-wider block">Country / Region</span>
              <span className="font-extrabold text-main text-xs sm:text-sm block">{pkg.country}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-border/80 space-y-0.5">
              <span className="text-muted text-[10px] uppercase font-bold tracking-wider block">Destination</span>
              <span className="font-extrabold text-main text-xs sm:text-sm block flex items-center gap-1">
                <span>📍</span>
                <span className="truncate">{pkg.destination}</span>
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-border/80 space-y-0.5">
              <span className="text-muted text-[10px] uppercase font-bold tracking-wider block">Duration</span>
              <span className="font-extrabold text-main text-xs sm:text-sm block flex items-center gap-1">
                <span>⏱</span>
                <span>{pkg.duration}</span>
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-border/80 space-y-0.5">
              <span className="text-muted text-[10px] uppercase font-bold tracking-wider block">Package Price</span>
              <span className="font-black text-main text-sm sm:text-base block">
                ₹{Number(pkg.price).toLocaleString('en-IN')}{' '}
                <span className="text-[10px] font-normal text-muted">{pkg.priceUnit || 'per person'}</span>
              </span>
            </div>

            {/* Quick summary banner spanning all 3 cols */}
            <div className="col-span-2 sm:col-span-3 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/60 border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">📸</span>
                <div>
                  <span className="font-bold text-main block text-xs">
                    Package Photo Gallery ({allImages.length} {allImages.length === 1 ? 'image' : 'images'})
                  </span>
                  <span className="text-[11px] text-muted">
                    High-resolution destination & resort media for traveler preview
                  </span>
                </div>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={handleOpenEditPackage}
                  className="px-2.5 py-1 rounded bg-[#0F0E2B] text-white hover:bg-[#181445] text-[11px] font-bold shadow-2xs cursor-pointer shrink-0"
                >
                  Manage Photos
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. SECTION: TOUR OVERVIEW & DESCRIPTION                       */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5 shadow-2xs space-y-2">
        <h2 className="text-xs sm:text-sm font-extrabold text-main border-b border-border/80 pb-2 flex items-center gap-2">
          <span>📋</span>
          <span>Tour Overview & Description</span>
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed font-normal pt-1">
          {pkg.overview || 'No overview provided.'}
        </p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. SECTION: INCLUSIONS & EXCLUSIONS 2-COLUMN SPLIT            */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Left: Package Inclusions */}
        <div className="bg-white rounded-xl border border-border p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-border/80 pb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h2 className="text-xs sm:text-sm font-extrabold text-main">Package Inclusions</h2>
          </div>

          <div className="space-y-2 pt-0.5">
            {inclusionsList.length > 0 ? (
              inclusionsList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed font-medium">{item}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted">No inclusions specified.</p>
            )}
          </div>
        </div>

        {/* Right: Package Exclusions */}
        <div className="bg-white rounded-xl border border-border p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-border/80 pb-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <h2 className="text-xs sm:text-sm font-extrabold text-main">Package Exclusions</h2>
          </div>

          <div className="space-y-2 pt-0.5">
            {exclusionsList.length > 0 ? (
              exclusionsList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span className="leading-relaxed font-medium">{item}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted">No exclusions specified.</p>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. SECTION: COMPLETE TOUR PHOTO GALLERY GRID                  */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm">🖼️</span>
            <div>
              <h2 className="text-xs sm:text-sm font-extrabold text-main">
                Tour Photo Gallery ({allImages.length} {allImages.length === 1 ? 'Photo' : 'Photos'})
              </h2>
              <p className="text-[11px] text-muted">Click any photo to view in high-resolution lightbox</p>
            </div>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={handleOpenEditPackage}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs text-white bg-[#0F0E2B] hover:bg-[#181445] shadow-2xs cursor-pointer"
            >
              <span>+ Add / Upload Photos</span>
            </button>
          )}
        </div>

        {allImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
            {allImages.map((imgSrc, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedImageIndex(idx)
                  setLightboxImage(imgSrc)
                }}
                className={`relative rounded-xl overflow-hidden border bg-slate-100 aspect-video group shadow-2xs cursor-pointer ${
                  selectedImageIndex === idx ? 'border-[#2E2B6E] ring-2 ring-[#2E2B6E]/30' : 'border-border'
                }`}
              >
                <img
                  src={imgSrc}
                  alt={`Tour Gallery ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="w-7 h-7 rounded-full bg-white/90 text-main flex items-center justify-center text-xs shadow-xs font-bold">
                    🔍
                  </span>
                </div>

                {/* Cover badge */}
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#E11D2E] text-white shadow-xs">
                    ★ Cover
                  </span>
                )}

                <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-white drop-shadow">
                  #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-muted">
            No photos uploaded for this package yet.
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. SECTION: DAY-BY-DAY TOUR ITINERARY TIMELINE                */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold text-main flex items-center gap-2">
              <span>🗺️</span>
              <span>Day-by-Day Tour Itinerary</span>
            </h2>
            <p className="text-[11px] text-muted mt-0.5">Daily activity schedule and transport itinerary</p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={handleOpenAddDay}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs text-white bg-gradient-to-r from-[#0F0E2B] to-[#2E2B6E] hover:from-[#181445] hover:to-[#221F56] shadow-2xs cursor-pointer"
            >
              <span>+ Add Itinerary Day</span>
            </button>
          )}
        </div>

        {/* Vertical Timeline Nodes */}
        <div className="space-y-3 pt-0.5">
          {pkg.itinerary && pkg.itinerary.length > 0 ? (
            pkg.itinerary.map((dayItem) => (
              <div
                key={dayItem.day}
                className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-slate-50/70 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="h-5 px-2 rounded-full text-[10px] font-black bg-gradient-to-r from-[#0F0E2B] to-[#2E2B6E] text-white flex items-center justify-center shadow-2xs">
                      Day {dayItem.day}
                    </span>
                    <h3 className="text-xs sm:text-sm font-extrabold text-main">{dayItem.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal pt-0.5 pl-1">
                    {dayItem.description}
                  </p>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1.5 shrink-0 pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditDay(dayItem)}
                      className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 text-main text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDay(dayItem.day)}
                      className="px-2.5 py-1 rounded border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-muted">
              No itinerary days added yet.
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: Edit Package Details & Photos (Admin Only)              */}
      {/* ------------------------------------------------------------- */}
      {isEditPackageModalOpen && (
        <Modal
          isOpen={isEditPackageModalOpen}
          onClose={() => setIsEditPackageModalOpen(false)}
          title={`Edit Tour Package: ${pkg.name}`}
          size="lg"
        >
          <form onSubmit={handleSavePackage} className="space-y-3.5 font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-main mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  value={packageForm.name}
                  onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-main mb-1">Country / Region *</label>
                <input
                  type="text"
                  required
                  value={packageForm.country}
                  onChange={(e) => setPackageForm({ ...packageForm, country: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-main mb-1">Destination *</label>
                <input
                  type="text"
                  required
                  value={packageForm.destination}
                  onChange={(e) => setPackageForm({ ...packageForm, destination: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-main mb-1">Duration *</label>
                <input
                  type="text"
                  required
                  value={packageForm.duration}
                  onChange={(e) => setPackageForm({ ...packageForm, duration: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-main mb-1">Package Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={packageForm.price}
                  onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>
            </div>

            {/* MULTIPLE IMAGE SELECT, UPLOAD, UPDATE & REMOVE SECTION */}
            <div className="pt-1 border-t border-border/80">
              <ImageUpload
                images={packageForm.images || []}
                onChange={(imgs) =>
                  setPackageForm({
                    ...packageForm,
                    images: imgs,
                    image: imgs[0] || '',
                  })
                }
                label="Package Photos (Select, Update & Upload Multiple)"
                hint="Upload photos directly from your computer. You can set the primary cover, replace an existing photo, or remove photos."
              />
            </div>

            <div className="pt-1">
              <label className="block text-xs font-bold text-main mb-1">Tour Overview & Description</label>
              <textarea
                rows={2}
                value={packageForm.overview}
                onChange={(e) => setPackageForm({ ...packageForm, overview: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-main mb-1">Inclusions</label>
                <textarea
                  rows={2}
                  value={packageForm.inclusions}
                  onChange={(e) => setPackageForm({ ...packageForm, inclusions: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-main mb-1">Exclusions</label>
                <textarea
                  rows={2}
                  value={packageForm.exclusions}
                  onChange={(e) => setPackageForm({ ...packageForm, exclusions: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsEditPackageModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#0F0E2B] text-white hover:bg-[#181445] cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: Add / Edit Itinerary Day (Admin Only)                   */}
      {/* ------------------------------------------------------------- */}
      {isDayModalOpen && (
        <Modal
          isOpen={isDayModalOpen}
          onClose={() => setIsDayModalOpen(false)}
          title={editingDay ? `Edit Day ${editingDay.day} Itinerary` : 'Add Itinerary Day'}
          size="md"
        >
          <form onSubmit={handleSaveDay} className="space-y-3 font-sans text-xs">
            <div>
              <label className="block text-xs font-bold text-main mb-1">Day Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Arrival in Bali & Villa Check-in"
                value={dayForm.title}
                onChange={(e) => setDayForm({ ...dayForm, title: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-main mb-1">Day Schedule & Activities *</label>
              <textarea
                rows={4}
                required
                placeholder="e.g. Welcome at Denpasar Airport, transfer to Seminyak luxury beach villa..."
                value={dayForm.description}
                onChange={(e) => setDayForm({ ...dayForm, description: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-slate-50 leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsDayModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#0F0E2B] text-white hover:bg-[#181445] cursor-pointer"
              >
                {editingDay ? 'Save Changes' : 'Add Day'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: Lightbox Photo Viewer                                   */}
      {/* ------------------------------------------------------------- */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white text-lg font-bold cursor-pointer"
            >
              ✕ Close
            </button>

            <img
              src={lightboxImage}
              alt="Enlarged preview"
              className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-white/10"
            />

            <div className="mt-3 text-center text-xs text-white/80 font-medium">
              {pkg.name} • {pkg.destination}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HolidayPackageDetail
