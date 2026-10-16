import React, { useState, useMemo, useEffect } from 'react'
import reviewsService from '../../services/reviews'
import usePermission from '../../hooks/usePermission'
import Pagination from '../../components/Pagination/Pagination.component'

// MUI Icons
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import VideocamIcon from '@mui/icons-material/Videocam'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import LockIcon from '@mui/icons-material/Lock'
import RateReviewIcon from '@mui/icons-material/RateReview'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

export const Reviews = () => {
  const { isAdmin } = usePermission()

  // Reviews Data
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState({ total: 0, visibleCount: 0, pendingCount: 0, avgRating: '5.0' })

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [serviceFilter, setServiceFilter] = useState('ALL') // ALL | Visa | Holiday
  const [syncFilter, setSyncFilter] = useState('ALL') // ALL | VISIBLE | HIDDEN | PENDING
  const [ratingFilter, setRatingFilter] = useState('ALL') // ALL | 5 | 4 | 3

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Details Modal
  const [selectedReview, setSelectedReview] = useState(null)
  const [activeMediaTab, setActiveMediaTab] = useState('ALL') // ALL | PHOTOS | VIDEOS
  const [expandedPhoto, setExpandedPhoto] = useState(null)

  // Add Review Modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [newReviewForm, setNewReviewForm] = useState({
    customerName: '',
    bookingId: '',
    packageName: '',
    destination: '',
    rating: 5,
    reviewText: '',
    serviceType: 'Holiday',
    staffMentioned: '',
    photos: '',
    videos: '',
    crmStatus: 'PUBLISHED',
    websiteSync: 'VISIBLE',
  })

  // Toast notification feedback
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  // Load reviews from service
  const loadReviewsData = () => {
    const data = reviewsService.getReviews()
    setReviews(data)
    setSummary(reviewsService.getSummary())
  }

  useEffect(() => {
    loadReviewsData()
  }, [])

  // Action handlers
  const handlePublish = (id, e) => {
    e?.stopPropagation()
    const updated = reviewsService.publishToWebsite(id)
    if (updated) {
      loadReviewsData()
      if (selectedReview?.id === id) setSelectedReview(updated)
      showToast(`Published to website!`)
    }
  }

  const handleHide = (id, e) => {
    e?.stopPropagation()
    const updated = reviewsService.hideFromWebsite(id)
    if (updated) {
      loadReviewsData()
      if (selectedReview?.id === id) setSelectedReview(updated)
      showToast(`Hidden from website.`)
    }
  }

  const handleDelete = (id, e) => {
    e?.stopPropagation()
    if (window.confirm('Delete this review permanently?')) {
      reviewsService.deleteReview(id)
      loadReviewsData()
      if (selectedReview?.id === id) setSelectedReview(null)
      showToast('Review removed.')
    }
  }

  const handleCreateReview = (e) => {
    e.preventDefault()
    if (!newReviewForm.customerName || !newReviewForm.reviewText) {
      alert('Please enter customer name and review text')
      return
    }

    const photosList = newReviewForm.photos
      ? newReviewForm.photos.split(',').map((u) => u.trim()).filter(Boolean)
      : []
    const videosList = newReviewForm.videos
      ? newReviewForm.videos.split(',').map((u) => u.trim()).filter(Boolean)
      : []

    reviewsService.addReview({
      ...newReviewForm,
      photos: photosList,
      videos: videosList,
    })

    loadReviewsData()
    setShowAddModal(false)
    setNewReviewForm({
      customerName: '',
      bookingId: '',
      packageName: '',
      destination: '',
      rating: 5,
      reviewText: '',
      serviceType: 'Holiday',
      staffMentioned: '',
      photos: '',
      videos: '',
      crmStatus: 'PUBLISHED',
      websiteSync: 'VISIBLE',
    })
    showToast('New review added!')
  }

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((item) => {
      if (serviceFilter !== 'ALL' && item.serviceType !== serviceFilter) return false
      if (syncFilter === 'VISIBLE' && item.websiteSync !== 'VISIBLE') return false
      if (syncFilter === 'HIDDEN' && item.websiteSync !== 'HIDDEN') return false
      if (syncFilter === 'PENDING' && item.crmStatus !== 'PENDING_REVIEW') return false
      if (ratingFilter !== 'ALL' && Math.floor(Number(item.rating)) !== Number(ratingFilter)) return false

      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase().trim()
      return (
        item.customerName?.toLowerCase().includes(q) ||
        item.bookingId?.toLowerCase().includes(q) ||
        item.packageName?.toLowerCase().includes(q) ||
        item.destination?.toLowerCase().includes(q) ||
        item.reviewText?.toLowerCase().includes(q) ||
        item.staffMentioned?.toLowerCase().includes(q)
      )
    })
  }, [reviews, serviceFilter, syncFilter, ratingFilter, searchQuery])

  // Pagination calculation
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredReviews.slice(start, start + itemsPerPage)
  }, [filteredReviews, currentPage, itemsPerPage])

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [serviceFilter, syncFilter, ratingFilter, searchQuery, itemsPerPage])

  // Admin access guard
  if (!isAdmin) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-red-100 p-6 max-w-sm text-center">
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <LockIcon sx={{ fontSize: 22 }} />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-1">Access Restricted</h2>
          <p className="text-xs text-slate-500 mb-4">
            The <strong>Reviews & Ratings</strong> section is restricted to Admin role.
          </p>
        </div>
      </div>
    )
  }

  // Compact Star Renderer
  const renderStars = (rating) => {
    const num = Number(rating) || 0
    return (
      <div className="flex items-center text-amber-400 gap-0.5 whitespace-nowrap">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= num ? (
            <StarIcon key={star} sx={{ fontSize: 13 }} className="text-amber-400 fill-current" />
          ) : (
            <StarBorderIcon key={star} sx={{ fontSize: 13 }} className="text-slate-300" />
          )
        ))}
        <span className="text-[10px] font-bold text-slate-700 ml-1">({num}/5)</span>
      </div>
    )
  }

  return (
    <div className="space-y-3.5 pb-8 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-3.5 py-2 rounded-lg shadow-xl flex items-center gap-2 border border-white/20 text-xs font-medium animate-fade-in">
          <CheckCircleIcon sx={{ fontSize: 16 }} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header - Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Reviews & Ratings Management
            </h1>
            <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-red-50 text-[#E11D2E] border border-red-200">
              Admin Only
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            RH Global CRM • Client ratings, trip media & live website synchronization
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#E11D2E] hover:bg-[#c81525] text-white text-[11px] font-bold rounded-md shadow-2xs transition-all cursor-pointer"
          >
            <AddIcon sx={{ fontSize: 15 }} />
            <span>Add Review</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards - Compact (Height reduced ~45%) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Total Reviews */}
        <div className="bg-white rounded-lg p-2.5 sm:p-3 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Reviews</p>
            <p className="text-lg font-black text-slate-900 leading-tight mt-0.5">{summary.total}</p>
            <p className="text-[10px] text-slate-400">Visa & Holidays</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <RateReviewIcon sx={{ fontSize: 17 }} />
          </div>
        </div>

        {/* Avg Rating */}
        <div className="bg-white rounded-lg p-2.5 sm:p-3 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Average Rating</p>
            <div className="flex items-center gap-1 leading-tight mt-0.5">
              <span className="text-lg font-black text-slate-900">{summary.avgRating}</span>
              <StarIcon sx={{ fontSize: 16 }} className="text-amber-400" />
            </div>
            <p className="text-[10px] text-emerald-600 font-medium">Customer score</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
            <StarIcon sx={{ fontSize: 18 }} />
          </div>
        </div>

        {/* Live on Website */}
        <div className="bg-white rounded-lg p-2.5 sm:p-3 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Published Online</p>
            <p className="text-lg font-black text-emerald-600 leading-tight mt-0.5">{summary.visibleCount}</p>
            <p className="text-[10px] text-slate-400">Website visible</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <VisibilityIcon sx={{ fontSize: 17 }} />
          </div>
        </div>

        {/* Pending Moderation */}
        <div className="bg-white rounded-lg p-2.5 sm:p-3 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending Review</p>
            <p className="text-lg font-black text-amber-500 leading-tight mt-0.5">{summary.pendingCount}</p>
            <p className="text-[10px] text-slate-400">Needs moderation</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <VisibilityOffIcon sx={{ fontSize: 17 }} />
          </div>
        </div>
      </div>

      {/* Main Table Card - Compact Box */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        {/* Card Header & Compact Filter Bar */}
        <div className="px-3.5 py-2.5 border-b border-slate-200 space-y-2 bg-slate-50/50">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-bold text-slate-900 tracking-tight">
              Feedback & Testimonials List
            </h2>
            <div className="text-[10px] text-slate-500">
              <span className="font-bold text-slate-700">{filteredReviews.length}</span> records
            </div>
          </div>

          {/* Compact Search & Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {/* Search Input */}
            <div className="relative">
              <SearchIcon
                sx={{ fontSize: 15 }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, booking ID, destination..."
                className="w-full pl-8 pr-2.5 py-1 text-[11px] rounded-md border border-slate-200 focus:border-[#E11D2E] focus:outline-hidden bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <CloseIcon sx={{ fontSize: 12 }} />
                </button>
              )}
            </div>

            {/* Service Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 shrink-0">Service:</span>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full py-1 px-2 text-[11px] rounded-md border border-slate-200 bg-white focus:border-[#E11D2E] focus:outline-hidden text-slate-700 font-medium"
              >
                <option value="ALL">All Services</option>
                <option value="Holiday">Holiday Cases</option>
                <option value="Visa">Visa Cases</option>
              </select>
            </div>

            {/* Website Sync Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 shrink-0">Sync:</span>
              <select
                value={syncFilter}
                onChange={(e) => setSyncFilter(e.target.value)}
                className="w-full py-1 px-2 text-[11px] rounded-md border border-slate-200 bg-white focus:border-[#E11D2E] focus:outline-hidden text-slate-700 font-medium"
              >
                <option value="ALL">All Status</option>
                <option value="VISIBLE">Visible (Published)</option>
                <option value="HIDDEN">Hidden</option>
                <option value="PENDING">Pending Moderation</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 shrink-0">Rating:</span>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full py-1 px-2 text-[11px] rounded-md border border-slate-200 bg-white focus:border-[#E11D2E] focus:outline-hidden text-slate-700 font-medium"
              >
                <option value="ALL">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Compact Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-2 px-3">Customer & Booking</th>
                <th className="py-2 px-3">Package / Destination</th>
                <th className="py-2 px-2.5">Rating</th>
                <th className="py-2 px-3 max-w-[240px]">Review Text</th>
                <th className="py-2 px-2 text-center">Media</th>
                <th className="py-2 px-2.5">Date</th>
                <th className="py-2 px-2 text-center">CRM Status</th>
                <th className="py-2 px-2 text-center">Website</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedReviews.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    <RateReviewIcon sx={{ fontSize: 30 }} className="text-slate-300 mb-1" />
                    <p className="font-semibold text-xs text-slate-600">No matching reviews</p>
                  </td>
                </tr>
              ) : (
                paginatedReviews.map((rev) => {
                  const hasPhotos = rev.photos && rev.photos.length > 0
                  const hasVideos = rev.videos && rev.videos.length > 0

                  return (
                    <tr
                      key={rev.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedReview(rev)}
                    >
                      {/* Customer Name & Booking ID (combined for neat space) */}
                      <td className="py-2 px-3 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-[9px] shrink-0">
                            {rev.customerName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">{rev.customerName}</span>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="font-mono text-[9px] font-semibold text-slate-600 bg-slate-100 px-1 py-0.2 rounded border border-slate-200">
                                {rev.bookingId}
                              </span>
                              <span className="text-[9px] text-slate-400 font-normal">
                                • {rev.serviceType}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Package Name & Destination */}
                      <td className="py-2 px-3 max-w-[160px]">
                        <span className="font-medium text-slate-800 block truncate leading-tight" title={rev.packageName}>
                          {rev.packageName}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {rev.destination}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="py-2 px-2.5">
                        {renderStars(rev.rating)}
                      </td>

                      {/* Review Text */}
                      <td className="py-2 px-3 text-slate-600 italic max-w-[220px]">
                        <span className="line-clamp-1 block leading-snug" title={rev.reviewText}>
                          &ldquo;{rev.reviewText}&rdquo;
                        </span>
                      </td>

                      {/* Attached Media Indicators */}
                      <td className="py-2 px-2 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 justify-center">
                          {hasPhotos ? (
                            <span
                              className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200"
                              title={`${rev.photos.length} photos`}
                            >
                              <PhotoCameraIcon sx={{ fontSize: 11 }} />
                              <span>{rev.photos.length}</span>
                            </span>
                          ) : null}

                          {hasVideos ? (
                            <span
                              className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200"
                              title={`${rev.videos.length} video`}
                            >
                              <VideocamIcon sx={{ fontSize: 12 }} />
                              <span>{rev.videos.length}</span>
                            </span>
                          ) : null}

                          {!hasPhotos && !hasVideos && (
                            <span className="text-[9px] text-slate-300">—</span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-2 px-2.5 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                        {rev.date}
                      </td>

                      {/* CRM Status Box Badge */}
                      <td className="py-2 px-2 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded border ${
                            rev.crmStatus === 'PUBLISHED'
                              ? 'bg-slate-50 text-slate-700 border-slate-300'
                              : rev.crmStatus === 'PENDING_REVIEW'
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {rev.crmStatus === 'PENDING_REVIEW' ? 'PENDING' : rev.crmStatus}
                        </span>
                      </td>

                      {/* Website Sync Box Badge */}
                      <td className="py-2 px-2 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded border ${
                            rev.websiteSync === 'VISIBLE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-slate-100 text-slate-500 border-slate-300'
                          }`}
                        >
                          {rev.websiteSync}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="py-2 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          {/* View Full Details Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedReview(rev)}
                            className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                            title="View Full Testimonial, Photos & Video"
                          >
                            <VisibilityIcon sx={{ fontSize: 11 }} />
                            <span>View</span>
                          </button>

                          {/* Publish to Website */}
                          <button
                            type="button"
                            onClick={(e) => handlePublish(rev.id, e)}
                            disabled={rev.websiteSync === 'VISIBLE'}
                            className={`px-1.5 py-0.5 text-[9px] font-bold rounded border transition-all cursor-pointer ${
                              rev.websiteSync === 'VISIBLE'
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                                : 'bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border-slate-300 hover:border-emerald-300 shadow-2xs'
                            }`}
                          >
                            Publish
                          </button>

                          {/* Hide from Website */}
                          <button
                            type="button"
                            onClick={(e) => handleHide(rev.id, e)}
                            disabled={rev.websiteSync === 'HIDDEN'}
                            className={`px-1.5 py-0.5 text-[9px] font-bold rounded border transition-all cursor-pointer ${
                              rev.websiteSync === 'HIDDEN'
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                                : 'bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 border-slate-300 hover:border-red-300 shadow-2xs'
                            }`}
                          >
                            Hide
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

        {/* Reusable Pagination Component */}
        <div className="px-3 py-2 border-t border-slate-200 bg-slate-50/40">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredReviews.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </div>

      {/* DETAIL MODAL: Compact Dossier with Photos & Video Player */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E11D2E] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {selectedReview.customerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900">
                      {selectedReview.customerName}
                    </h3>
                    {selectedReview.verifiedBooking && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircleIcon sx={{ fontSize: 10 }} />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    ID: <span className="font-mono font-semibold text-slate-700">{selectedReview.bookingId}</span> • {selectedReview.packageName} ({selectedReview.destination})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Rating & Sync Status Banner */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="text-2xl font-black text-slate-900 leading-none">
                    {selectedReview.rating}.0
                  </div>
                  <div>
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        s <= selectedReview.rating ? (
                          <StarIcon key={s} sx={{ fontSize: 16 }} className="text-amber-400 fill-current" />
                        ) : (
                          <StarBorderIcon key={s} sx={{ fontSize: 16 }} className="text-slate-300" />
                        )
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {selectedReview.date} • Officer: {selectedReview.staffMentioned || 'RH Staff'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Website Visibility</span>
                  <span
                    className={`inline-block px-2 py-0.2 text-[10px] font-mono font-bold uppercase rounded border mt-0.5 ${
                      selectedReview.websiteSync === 'VISIBLE'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {selectedReview.websiteSync}
                  </span>
                </div>
              </div>

              {/* Review Testimonial Text */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Customer Testimonial
                </h4>
                <div className="p-3 rounded-lg bg-amber-50/40 border border-amber-200/60 text-slate-800 italic relative">
                  <span className="text-2xl text-amber-400 font-serif leading-none absolute -top-1 left-1.5 select-none">&ldquo;</span>
                  <p className="pl-4 text-xs font-serif leading-relaxed text-slate-800">
                    {selectedReview.reviewText}
                  </p>
                </div>
              </div>

              {/* Attached Trip Media Tabs */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Attached Media
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('ALL')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        activeMediaTab === 'ALL'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      All ({(selectedReview.photos?.length || 0) + (selectedReview.videos?.length || 0)})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('PHOTOS')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer flex items-center gap-1 ${
                        activeMediaTab === 'PHOTOS'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <PhotoCameraIcon sx={{ fontSize: 12 }} />
                      Photos ({selectedReview.photos?.length || 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('VIDEOS')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer flex items-center gap-1 ${
                        activeMediaTab === 'VIDEOS'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <VideocamIcon sx={{ fontSize: 13 }} />
                      Videos ({selectedReview.videos?.length || 0})
                    </button>
                  </div>
                </div>

                {/* Photos Gallery */}
                {(activeMediaTab === 'ALL' || activeMediaTab === 'PHOTOS') && (
                  <div className="mb-4">
                    <p className="text-[11px] font-bold text-slate-700 mb-2 flex items-center gap-1">
                      <PhotoCameraIcon sx={{ fontSize: 13 }} className="text-blue-600" />
                      Trip Photos ({selectedReview.photos?.length || 0})
                    </p>
                    {selectedReview.photos && selectedReview.photos.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {selectedReview.photos.map((imgUrl, i) => (
                          <div
                            key={i}
                            className="group relative rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100 cursor-pointer shadow-2xs hover:shadow-sm"
                            onClick={() => setExpandedPhoto(imgUrl)}
                          >
                            <img
                              src={imgUrl}
                              alt={`Trip photo ${i + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                              <OpenInNewIcon sx={{ fontSize: 13 }} />
                              <span>View</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center text-[10px] text-slate-400">
                        No photos attached
                      </div>
                    )}
                  </div>
                )}

                {/* Videos Player */}
                {(activeMediaTab === 'ALL' || activeMediaTab === 'VIDEOS') && (
                  <div>
                    <p className="text-[11px] font-bold text-slate-700 mb-2 flex items-center gap-1">
                      <VideocamIcon sx={{ fontSize: 14 }} className="text-purple-600" />
                      Video Testimonial ({selectedReview.videos?.length || 0})
                    </p>
                    {selectedReview.videos && selectedReview.videos.length > 0 ? (
                      <div className="space-y-2">
                        {selectedReview.videos.map((vidUrl, i) => (
                          <div
                            key={i}
                            className="rounded-lg overflow-hidden border border-slate-300 shadow-sm bg-black max-w-md mx-auto"
                          >
                            <video
                              controls
                              preload="metadata"
                              className="w-full max-h-56 object-contain bg-black"
                            >
                              <source src={vidUrl} type="video/mp4" />
                              Browser does not support video.
                            </video>
                            <div className="p-2 bg-slate-900 text-white text-[10px] flex items-center justify-between">
                              <span className="font-semibold truncate">Testimonial Reel #{i + 1}</span>
                              <span className="text-slate-400 font-mono">MP4</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center text-[10px] text-slate-400">
                        No video testimonial recorded
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={(e) => handleDelete(selectedReview.id, e)}
                className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <DeleteIcon sx={{ fontSize: 14 }} />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="px-3 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded shadow-2xs hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>

                {selectedReview.websiteSync === 'VISIBLE' ? (
                  <button
                    type="button"
                    onClick={(e) => handleHide(selectedReview.id, e)}
                    className="px-3 py-1 text-[11px] font-bold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded shadow-2xs cursor-pointer flex items-center gap-1"
                  >
                    <VisibilityOffIcon sx={{ fontSize: 13 }} />
                    <span>Hide from Website</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handlePublish(selectedReview.id, e)}
                    className="px-3 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-2xs cursor-pointer flex items-center gap-1"
                  >
                    <VisibilityIcon sx={{ fontSize: 13 }} />
                    <span>Publish to Website</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO LIGHTBOX PREVIEW */}
      {expandedPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3"
          onClick={() => setExpandedPhoto(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh]">
            <img
              src={expandedPhoto}
              alt="Expanded preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setExpandedPhoto(null)}
              className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-white text-slate-900 shadow-lg flex items-center justify-center font-bold cursor-pointer hover:bg-slate-200"
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      )}

      {/* ADD NEW TESTIMONIAL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden text-xs">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">
                Add Customer Review / Testimonial
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewForm.customerName}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, customerName: e.target.value })}
                    placeholder="e.g. Vikramaditya Roy"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:border-[#E11D2E] focus:outline-hidden text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                    Booking / Case ID
                  </label>
                  <input
                    type="text"
                    value={newReviewForm.bookingId}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, bookingId: e.target.value })}
                    placeholder="e.g. PKG-701 or VISA-302"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:border-[#E11D2E] focus:outline-hidden font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                    Service Type
                  </label>
                  <select
                    value={newReviewForm.serviceType}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, serviceType: e.target.value })}
                    className="w-full px-2 py-1.5 rounded border border-slate-300 focus:border-[#E11D2E] focus:outline-hidden text-xs"
                  >
                    <option value="Holiday">Holiday</option>
                    <option value="Visa">Visa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                    Package Name
                  </label>
                  <input
                    type="text"
                    value={newReviewForm.packageName}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, packageName: e.target.value })}
                    placeholder="e.g. Bali Island Getaway"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:border-[#E11D2E] focus:outline-hidden text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={newReviewForm.destination}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, destination: e.target.value })}
                    placeholder="e.g. Bali, Indonesia"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:border-[#E11D2E] focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                    Rating (1 to 5 Stars)
                  </label>
                  <select
                    value={newReviewForm.rating}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded border border-slate-300 focus:border-[#E11D2E] focus:outline-hidden text-xs"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                    Staff Mentioned
                  </label>
                  <input
                    type="text"
                    value={newReviewForm.staffMentioned}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, staffMentioned: e.target.value })}
                    placeholder="e.g. Priya Singh"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:border-[#E11D2E] focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                  Customer Review Feedback *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newReviewForm.reviewText}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, reviewText: e.target.value })}
                  placeholder="Paste customer's verified review..."
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:border-[#E11D2E] focus:outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                  Photo URLs (comma separated)
                </label>
                <input
                  type="text"
                  value={newReviewForm.photos}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, photos: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:border-[#E11D2E] focus:outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                  Video URLs (comma separated MP4)
                </label>
                <input
                  type="text"
                  value={newReviewForm.videos}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, videos: e.target.value })}
                  placeholder="https://.../video.mp4"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:border-[#E11D2E] focus:outline-hidden text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pubNow"
                  checked={newReviewForm.websiteSync === 'VISIBLE'}
                  onChange={(e) =>
                    setNewReviewForm({
                      ...newReviewForm,
                      websiteSync: e.target.checked ? 'VISIBLE' : 'HIDDEN',
                      crmStatus: e.target.checked ? 'PUBLISHED' : 'PENDING_REVIEW',
                    })
                  }
                  className="rounded text-[#E11D2E] focus:ring-[#E11D2E]"
                />
                <label htmlFor="pubNow" className="font-semibold text-slate-700 cursor-pointer text-[11px]">
                  Publish to Website immediately
                </label>
              </div>

              <div className="pt-2.5 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 font-bold text-white bg-[#E11D2E] hover:bg-[#c81525] rounded shadow-2xs cursor-pointer text-xs"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reviews
