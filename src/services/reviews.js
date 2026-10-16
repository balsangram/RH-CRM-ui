/**
 * Reviews & Ratings Management Service
 * Manages customer testimonials, star ratings, attached trip photos & videos, and website publishing state.
 */

const STORAGE_KEY_REVIEWS = 'rh_crm_reviews_v1'

const DEFAULT_REVIEWS = [
  {
    id: 'REV-101',
    customerName: 'Vikramaditya Roy',
    bookingId: 'PKG-701',
    packageName: 'Bali Island Beach Getaway',
    destination: 'Bali, Indonesia',
    rating: 5,
    reviewText: 'Exceptional visa processing speed and hotel bookings were seamless! The private pool villa in Seminyak exceeded our expectations.',
    date: '2026-10-04',
    crmStatus: 'PUBLISHED',
    websiteSync: 'VISIBLE',
    staffMentioned: 'Priya Singh',
    serviceType: 'Holiday',
    photos: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    ],
    verifiedBooking: true,
  },
  {
    id: 'REV-102',
    customerName: 'Sanya Malhotra',
    bookingId: 'VISA-302',
    packageName: 'UK Tourist Visa',
    destination: 'United Kingdom',
    rating: 4,
    reviewText: 'Staff Priya helped step-by-step with document uploads. VFS appointment was booked on my preferred date and got passport back in 9 days.',
    date: '2026-10-06',
    crmStatus: 'PENDING_REVIEW',
    websiteSync: 'HIDDEN',
    staffMentioned: 'Priya Singh',
    serviceType: 'Visa',
    photos: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [],
    verifiedBooking: true,
  },
  {
    id: 'REV-103',
    customerName: 'Deepak Chopra',
    bookingId: 'PKG-702',
    packageName: 'Dubai Luxury Marina & Desert Safari',
    destination: 'Dubai, UAE',
    rating: 5,
    reviewText: 'The private 4x4 dune bashing and VIP luxury yacht dinner at Marina was unforgettable! Smooth coordination by the RH Global team.',
    date: '2026-10-02',
    crmStatus: 'PUBLISHED',
    websiteSync: 'VISIBLE',
    staffMentioned: 'Priya Singh',
    serviceType: 'Holiday',
    photos: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    ],
    verifiedBooking: true,
  },
  {
    id: 'REV-104',
    customerName: 'Ananya Iyer',
    bookingId: 'VISA-303',
    packageName: 'US B1/B2 Visitor Visa',
    destination: 'United States',
    rating: 5,
    reviewText: 'Amit Verma prepared us thoroughly with mock interview questions and financial file structure. Both me and my husband got approved!',
    date: '2026-09-28',
    crmStatus: 'PUBLISHED',
    websiteSync: 'VISIBLE',
    staffMentioned: 'Amit Verma',
    serviceType: 'Visa',
    photos: [
      'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [],
    verifiedBooking: true,
  },
  {
    id: 'REV-105',
    customerName: 'Rohit Sharma',
    bookingId: 'PKG-704',
    packageName: 'Maldives Overwater Villa Honeymoon',
    destination: 'Male, Maldives',
    rating: 5,
    reviewText: 'Magical sunset water villa experience with sea plane transfer included. Everything handled end-to-end without any hitch.',
    date: '2026-09-25',
    crmStatus: 'PUBLISHED',
    websiteSync: 'VISIBLE',
    staffMentioned: 'Priya Singh',
    serviceType: 'Holiday',
    photos: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    ],
    verifiedBooking: true,
  },
  {
    id: 'REV-106',
    customerName: 'Meera Patel',
    bookingId: 'PKG-705',
    packageName: 'Phuket & Krabi Island Explorer',
    destination: 'Thailand',
    rating: 4,
    reviewText: 'Island hopping tour was super well organized. Speedboat guide was polite and hotel was centrally located near Patong beach.',
    date: '2026-09-20',
    crmStatus: 'PENDING_REVIEW',
    websiteSync: 'HIDDEN',
    staffMentioned: 'Deepak Nair',
    serviceType: 'Holiday',
    photos: [
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [],
    verifiedBooking: true,
  },
  {
    id: 'REV-107',
    customerName: 'Arjun Mehta',
    bookingId: 'VISA-305',
    packageName: 'Australia Subclass 600 Tourist',
    destination: 'Australia',
    rating: 5,
    reviewText: 'Received grant notice in just 14 calendar days. Thank you RH Global for the hassle-free documentation checklist.',
    date: '2026-09-15',
    crmStatus: 'PUBLISHED',
    websiteSync: 'VISIBLE',
    staffMentioned: 'Amit Verma',
    serviceType: 'Visa',
    photos: [
      'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [],
    verifiedBooking: true,
  },
]

class ReviewsService {
  constructor() {
    this.reviews = this.loadReviews()
  }

  loadReviews() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_REVIEWS)
      if (data) return JSON.parse(data)
    } catch (e) {
      console.warn('Failed to load reviews from localStorage:', e)
    }
    return [...DEFAULT_REVIEWS]
  }

  saveReviews() {
    try {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(this.reviews))
    } catch (e) {
      console.warn('Failed to save reviews to localStorage:', e)
    }
  }

  getReviews() {
    return [...this.reviews]
  }

  getReviewById(id) {
    return this.reviews.find((r) => r.id === id) || null
  }

  publishToWebsite(id) {
    const rev = this.reviews.find((r) => r.id === id)
    if (rev) {
      rev.crmStatus = 'PUBLISHED'
      rev.websiteSync = 'VISIBLE'
      this.saveReviews()
      return rev
    }
    return null
  }

  hideFromWebsite(id) {
    const rev = this.reviews.find((r) => r.id === id)
    if (rev) {
      rev.crmStatus = 'HIDDEN'
      rev.websiteSync = 'HIDDEN'
      this.saveReviews()
      return rev
    }
    return null
  }

  updateReview(id, updates) {
    const idx = this.reviews.findIndex((r) => r.id === id)
    if (idx !== -1) {
      this.reviews[idx] = { ...this.reviews[idx], ...updates }
      this.saveReviews()
      return this.reviews[idx]
    }
    return null
  }

  addReview(payload) {
    const nextNum = 100 + this.reviews.length + 1
    const newReview = {
      id: payload.id || `REV-${nextNum}`,
      customerName: payload.customerName || 'Anonymous Traveler',
      bookingId: payload.bookingId || 'APP-001',
      packageName: payload.packageName || 'Custom Package',
      destination: payload.destination || 'Global',
      rating: Number(payload.rating) || 5,
      reviewText: payload.reviewText || '',
      date: payload.date || new Date().toISOString().split('T')[0],
      crmStatus: payload.crmStatus || 'PENDING_REVIEW',
      websiteSync: payload.websiteSync || 'HIDDEN',
      staffMentioned: payload.staffMentioned || 'Staff Officer',
      serviceType: payload.serviceType || 'Visa',
      photos: payload.photos || [],
      videos: payload.videos || [],
      verifiedBooking: true,
    }
    this.reviews.unshift(newReview)
    this.saveReviews()
    return newReview
  }

  deleteReview(id) {
    this.reviews = this.reviews.filter((r) => r.id !== id)
    this.saveReviews()
    return true
  }

  getSummary() {
    const total = this.reviews.length
    const visibleCount = this.reviews.filter((r) => r.websiteSync === 'VISIBLE').length
    const pendingCount = this.reviews.filter((r) => r.crmStatus === 'PENDING_REVIEW').length
    const avgRating = total > 0
      ? (this.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / total).toFixed(1)
      : '5.0'

    return {
      total,
      visibleCount,
      pendingCount,
      avgRating,
    }
  }
}

const reviewsService = new ReviewsService()
export default reviewsService
