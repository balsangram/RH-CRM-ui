/**
 * Travellers / Passport Profiles Service
 * Manages individual traveler profiles, passport details, visa application history, and holiday booking history.
 * Supports localStorage persistence and real-time state synchronization.
 */

const STORAGE_KEY_TRAVELLERS = 'rh_crm_travellers_data_v2'

export const DEFAULT_TRAVELLERS = [
  {
    id: 'TRV-8801',
    name: 'Vikramaditya Roy',
    avatar: 'VR',
    email: 'vikram.roy@gmail.com',
    phone: '+91 99112 23344',
    country: 'India',
    passport: 'Z9847291',
    expiry: '2031-05-12',
    status: 'ACTIVE',
    regDate: '2026-08-14',
    associatedCustomer: 'Vikramaditya Roy',
    company: 'Apex Tours & Tech',
    totalVisaApps: 4,
    totalBookings: 2,
    visaApplications: [
      {
        id: 'VISA-301',
        country: 'Schengen (France)',
        visaType: 'Tourist C',
        applicationDate: '2026-10-02',
        officer: 'Amit Verma (CO-101)',
        paymentType: 'PREPAID',
        status: 'DOCS_VERIFIED',
        statusColor: 'border-blue-300 text-blue-700 bg-blue-50',
      },
      {
        id: 'VISA-289',
        country: 'United Kingdom',
        visaType: 'Standard Visitor',
        applicationDate: '2026-06-12',
        officer: 'Priya Singh (CO-102)',
        paymentType: 'PREPAID',
        status: 'APPROVED',
        statusColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      },
      {
        id: 'VISA-240',
        country: 'United States',
        visaType: 'B1/B2 Business',
        applicationDate: '2025-11-20',
        officer: 'Amit Verma (CO-101)',
        paymentType: 'PREPAID',
        status: 'APPROVED',
        statusColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      },
      {
        id: 'VISA-190',
        country: 'Canada',
        visaType: 'Visitor Visa',
        applicationDate: '2025-04-10',
        officer: 'Priya Singh (CO-102)',
        paymentType: 'POSTPAID',
        status: 'APPROVED',
        statusColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      },
    ],
    holidayBookings: [
      {
        id: 'PKG-702',
        packageName: 'Swiss Alps & Paris Highlights',
        destination: 'France & Switzerland',
        duration: '8 Days / 7 Nights',
        bookingDate: '2026-09-28',
        departureDate: '2026-12-01',
        price: 210000,
        stage: 'BOOKING_CREATED',
        status: 'BOOKING CREATED',
        statusColor: 'border-amber-300 text-amber-700 bg-amber-50',
      },
      {
        id: 'PKG-688',
        packageName: 'Dubai Luxury Marina & Desert Safari',
        destination: 'Dubai, UAE',
        duration: '5 Days / 4 Nights',
        bookingDate: '2026-02-14',
        departureDate: '2026-03-20',
        price: 95000,
        stage: 'COMPLETED',
        status: 'COMPLETED',
        statusColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      },
    ],
  },
  {
    id: 'TRV-8802',
    name: 'Sanya Malhotra',
    avatar: 'SM',
    email: 'sanya.m@gmail.com',
    phone: '+91 98111 55443',
    country: 'India',
    passport: 'L4438102',
    expiry: '2029-11-20',
    status: 'ACTIVE',
    regDate: '2026-08-18',
    associatedCustomer: 'Sanya Malhotra',
    company: 'Individual',
    totalVisaApps: 2,
    totalBookings: 1,
    visaApplications: [
      {
        id: 'VISA-302',
        country: 'United Kingdom',
        visaType: 'Standard Visitor',
        applicationDate: '2026-10-05',
        officer: 'Priya Singh (CO-102)',
        paymentType: 'PARTIALLY_PAID',
        status: 'UNDER_REVIEW',
        statusColor: 'border-amber-300 text-amber-700 bg-amber-50',
      },
      {
        id: 'VISA-212',
        country: 'Singapore',
        visaType: 'eVisa Tourist',
        applicationDate: '2025-08-15',
        officer: 'Amit Verma (CO-101)',
        paymentType: 'PREPAID',
        status: 'APPROVED',
        statusColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      },
    ],
    holidayBookings: [
      {
        id: 'PKG-701',
        packageName: 'Bali Island Beach Getaway',
        destination: 'Bali, Indonesia',
        duration: '6 Days / 5 Nights',
        bookingDate: '2026-09-18',
        departureDate: '2026-11-15',
        price: 85000,
        stage: 'VOUCHERS_CONFIRM',
        status: 'VOUCHERS & CONFIRM',
        statusColor: 'border-purple-300 text-purple-700 bg-purple-50',
      },
    ],
  },
  {
    id: 'TRV-8803',
    name: 'Tariq Ahmed',
    avatar: 'TA',
    email: 'tariq.ahmed@yahoo.com',
    phone: '+91 97110 00112',
    country: 'India',
    passport: 'K1029384',
    expiry: '2028-02-14',
    status: 'BLOCKED',
    regDate: '2026-08-22',
    associatedCustomer: 'Atlas Shipping',
    company: 'Atlas Shipping LLC',
    totalVisaApps: 1,
    totalBookings: 0,
    visaApplications: [
      {
        id: 'VISA-305',
        country: 'United States',
        visaType: 'B1 Business',
        applicationDate: '2026-10-06',
        officer: 'Amit Verma (CO-101)',
        paymentType: 'PREPAID',
        status: 'REJECTED',
        statusColor: 'border-rose-300 text-rose-700 bg-rose-50',
      },
    ],
    holidayBookings: [],
  },
  {
    id: 'TRV-8804',
    name: 'Robert Downey Jr.',
    avatar: 'RD',
    email: 'robert.downey@marvel.com',
    phone: '+1 310 555 0192',
    country: 'United States',
    passport: 'Z9821345',
    expiry: '2029-08-14',
    status: 'ACTIVE',
    regDate: '2026-08-25',
    associatedCustomer: 'Robert Downey',
    company: 'Stark Enterprises',
    totalVisaApps: 3,
    totalBookings: 2,
    visaApplications: [
      {
        id: 'VISA-298',
        country: 'India',
        visaType: 'e-Business Visa',
        applicationDate: '2026-09-15',
        officer: 'Amit Verma (CO-101)',
        paymentType: 'PREPAID',
        status: 'APPROVED',
        statusColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      },
      {
        id: 'VISA-260',
        country: 'Japan',
        visaType: 'Temporary Visitor',
        applicationDate: '2026-03-10',
        officer: 'Priya Singh (CO-102)',
        paymentType: 'PREPAID',
        status: 'APPROVED',
        statusColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      },
      {
        id: 'VISA-210',
        country: 'United Kingdom',
        visaType: 'Standard Visitor',
        applicationDate: '2025-10-01',
        officer: 'Amit Verma (CO-101)',
        paymentType: 'PREPAID',
        status: 'APPROVED',
        statusColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      },
    ],
    holidayBookings: [
      {
        id: 'PKG-706',
        packageName: 'Tokyo & Kyoto Autumn Tour',
        destination: 'Japan',
        duration: '9 Days / 8 Nights',
        bookingDate: '2026-10-06',
        departureDate: '2026-12-10',
        price: 245000,
        stage: 'DOCS_ITINERARY',
        status: 'DOCS & ITINERARY',
        statusColor: 'border-blue-300 text-blue-700 bg-blue-50',
      },
      {
        id: 'PKG-680',
        packageName: 'Swiss Alps & Paris Highlights',
        destination: 'France & Switzerland',
        duration: '8 Days / 7 Nights',
        bookingDate: '2026-01-10',
        departureDate: '2026-04-15',
        price: 210000,
        stage: 'COMPLETED',
        status: 'COMPLETED',
        statusColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      },
    ],
  },
  {
    id: 'TRV-8805',
    name: 'Susan Downey',
    avatar: 'SD',
    email: 'susan.downey@marvel.com',
    phone: '+1 310 555 0193',
    country: 'United States',
    passport: 'Z9821346',
    expiry: '2030-03-22',
    status: 'ACTIVE',
    regDate: '2026-08-25',
    associatedCustomer: 'Robert Downey',
    company: 'Team Downey',
    totalVisaApps: 1,
    totalBookings: 2,
    visaApplications: [
      {
        id: 'VISA-299',
        country: 'India',
        visaType: 'e-Tourist Visa',
        applicationDate: '2026-09-15',
        officer: 'Amit Verma (CO-101)',
        paymentType: 'PREPAID',
        status: 'APPROVED',
        statusColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      },
    ],
    holidayBookings: [
      {
        id: 'PKG-706',
        packageName: 'Tokyo & Kyoto Autumn Tour',
        destination: 'Japan',
        duration: '9 Days / 8 Nights',
        bookingDate: '2026-10-06',
        departureDate: '2026-12-10',
        price: 245000,
        stage: 'DOCS_ITINERARY',
        status: 'DOCS & ITINERARY',
        statusColor: 'border-blue-300 text-blue-700 bg-blue-50',
      },
    ],
  },
  {
    id: 'TRV-8806',
    name: 'Deepak Chopra',
    avatar: 'DC',
    email: 'deepak.c@rhglobal.com',
    phone: '+91 98200 22222',
    country: 'India',
    passport: 'P9012384',
    expiry: '2032-01-10',
    status: 'ACTIVE',
    regDate: '2026-09-01',
    associatedCustomer: 'Apex Tours & Tech',
    company: 'Apex Tours & Tech',
    totalVisaApps: 2,
    totalBookings: 3,
    visaApplications: [
      {
        id: 'VISA-288',
        country: 'Schengen (Switzerland)',
        visaType: 'Business C',
        applicationDate: '2026-08-01',
        officer: 'Amit Verma (CO-101)',
        paymentType: 'PREPAID',
        status: 'APPROVED',
        statusColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      },
      {
        id: 'VISA-235',
        country: 'Singapore',
        visaType: 'Business Visa',
        applicationDate: '2025-11-12',
        officer: 'Priya Singh (CO-102)',
        paymentType: 'PREPAID',
        status: 'APPROVED',
        statusColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      },
    ],
    holidayBookings: [
      {
        id: 'PKG-702',
        packageName: 'Swiss Alps & Paris Highlights',
        destination: 'France & Switzerland',
        duration: '8 Days / 7 Nights',
        bookingDate: '2026-09-28',
        departureDate: '2026-12-01',
        price: 210000,
        stage: 'BOOKING_CREATED',
        status: 'BOOKING CREATED',
        statusColor: 'border-amber-300 text-amber-700 bg-amber-50',
      },
    ],
  },
  {
    id: 'TRV-8807',
    name: 'Rohan Joshi',
    avatar: 'RJ',
    email: 'rohan.j@rhglobal.com',
    phone: '+91 98200 11122',
    country: 'India',
    passport: 'J8837190',
    expiry: '2030-10-15',
    status: 'ACTIVE',
    regDate: '2026-09-05',
    associatedCustomer: 'Apex Tours & Tech',
    company: 'Apex Tours & Tech',
    totalVisaApps: 2,
    totalBookings: 1,
    visaApplications: [
      {
        id: 'VISA-303',
        country: 'United States',
        visaType: 'B1/B2 Business',
        applicationDate: '2026-09-25',
        officer: 'Amit Verma (CO-101)',
        paymentType: 'PREPAID',
        status: 'APPROVED',
        statusColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      },
    ],
    holidayBookings: [
      {
        id: 'PKG-703',
        packageName: 'Dubai Luxury Marina & Desert Safari',
        destination: 'Dubai, UAE',
        duration: '5 Days / 4 Nights',
        bookingDate: '2026-10-04',
        departureDate: '2026-11-20',
        price: 95000,
        stage: 'DOCS_ITINERARY',
        status: 'DOCS & ITINERARY',
        statusColor: 'border-blue-300 text-blue-700 bg-blue-50',
      },
    ],
  },
  {
    id: 'TRV-8808',
    name: 'Priya Patel',
    avatar: 'PP',
    email: 'priya.patel@outlook.com',
    phone: '+91 99881 44332',
    country: 'India',
    passport: 'N6629104',
    expiry: '2029-07-08',
    status: 'ACTIVE',
    regDate: '2026-09-10',
    associatedCustomer: 'Priya Patel',
    company: 'Nexus Global Logistics',
    totalVisaApps: 1,
    totalBookings: 1,
    visaApplications: [
      {
        id: 'VISA-304',
        country: 'United States',
        visaType: 'B1/B2 Business',
        applicationDate: '2026-09-30',
        officer: 'Priya Singh (CO-102)',
        paymentType: 'PREPAID',
        status: 'SUBMITTED',
        statusColor: 'border-purple-300 text-purple-700 bg-purple-50',
      },
    ],
    holidayBookings: [
      {
        id: 'PKG-707',
        packageName: 'Singapore Sentosa & Universal Studios',
        destination: 'Singapore',
        duration: '4 Days / 3 Nights',
        bookingDate: '2026-09-15',
        departureDate: '2026-10-05',
        price: 68000,
        stage: 'CANCELLED',
        status: 'CANCELLED',
        statusColor: 'border-rose-300 text-rose-700 bg-rose-50',
      },
    ],
  },
  {
    id: 'TRV-8809',
    name: 'Jean-Luc Picard',
    avatar: 'JP',
    email: 'jeanluc.picard@starfleet.fr',
    phone: '+33 1 42 68 55 00',
    country: 'France',
    passport: 'F8849201',
    expiry: '2031-01-19',
    status: 'ACTIVE',
    regDate: '2026-09-12',
    associatedCustomer: 'Jean-Luc Picard',
    company: 'Château Picard',
    totalVisaApps: 2,
    totalBookings: 1,
    visaApplications: [
      {
        id: 'VISA-275',
        country: 'India',
        visaType: 'e-Tourist 30 Days',
        applicationDate: '2026-07-10',
        officer: 'Amit Verma (CO-101)',
        paymentType: 'PREPAID',
        status: 'APPROVED',
        statusColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      },
    ],
    holidayBookings: [
      {
        id: 'PKG-704',
        packageName: 'Maldives Overwater Villa Honeymoon',
        destination: 'Male, Maldives',
        duration: '5 Days / 4 Nights',
        bookingDate: '2026-09-20',
        departureDate: '2026-10-12',
        price: 175000,
        stage: 'TOUR_IN_PROGRESS',
        status: 'TOUR IN-PROGRESS',
        statusColor: 'border-amber-300 text-amber-700 bg-amber-50',
      },
    ],
  },
  {
    id: 'TRV-8810',
    name: 'Aarav Patel',
    avatar: 'AP',
    email: 'aarav.patel@outlook.com',
    phone: '+91 99881 44335',
    country: 'India',
    passport: 'K1092384',
    expiry: '2028-11-05',
    status: 'ACTIVE',
    regDate: '2026-09-15',
    associatedCustomer: 'Priya Patel',
    company: 'Nexus Global Logistics',
    totalVisaApps: 1,
    totalBookings: 0,
    visaApplications: [
      {
        id: 'VISA-306',
        country: 'United Kingdom',
        visaType: 'Child Visitor',
        applicationDate: '2026-10-06',
        officer: 'Priya Singh (CO-102)',
        paymentType: 'PREPAID',
        status: 'DOCS_VERIFIED',
        statusColor: 'border-blue-300 text-blue-700 bg-blue-50',
      },
    ],
    holidayBookings: [],
  },
]

export const travellersService = {
  getTravellers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TRAVELLERS)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEY_TRAVELLERS, JSON.stringify(DEFAULT_TRAVELLERS))
    return DEFAULT_TRAVELLERS
  },

  getTravellerById(id) {
    const list = this.getTravellers()
    return list.find((t) => t.id === id) || null
  },

  createTraveller(data) {
    const list = this.getTravellers()
    const nextNum = list.length + 8801
    const newTraveller = {
      id: `TRV-${nextNum}`,
      name: data.name,
      avatar: (data.name || 'TR')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      email: data.email || 'traveler@example.com',
      phone: data.phone || '+91 98000 00000',
      country: data.country || 'India',
      passport: data.passport || 'P0000000',
      expiry: data.expiry || '2030-01-01',
      status: data.status || 'ACTIVE',
      regDate: new Date().toISOString().split('T')[0],
      associatedCustomer: data.customer || data.name,
      company: data.company || 'Individual',
      totalVisaApps: 0,
      totalBookings: 0,
      visaApplications: [],
      holidayBookings: [],
    }
    const updated = [newTraveller, ...list]
    localStorage.setItem(STORAGE_KEY_TRAVELLERS, JSON.stringify(updated))
    return newTraveller
  },

  updateTraveller(id, updates) {
    const list = this.getTravellers()
    const updated = list.map((t) => (t.id === id ? { ...t, ...updates } : t))
    localStorage.setItem(STORAGE_KEY_TRAVELLERS, JSON.stringify(updated))
    return updated.find((t) => t.id === id)
  },

  toggleStatus(id) {
    const list = this.getTravellers()
    const updated = list.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE',
        }
      }
      return t
    })
    localStorage.setItem(STORAGE_KEY_TRAVELLERS, JSON.stringify(updated))
    return updated.find((t) => t.id === id)
  },

  deleteTraveller(id) {
    const list = this.getTravellers()
    const updated = list.filter((t) => t.id !== id)
    localStorage.setItem(STORAGE_KEY_TRAVELLERS, JSON.stringify(updated))
    return true
  },
}

export default travellersService
