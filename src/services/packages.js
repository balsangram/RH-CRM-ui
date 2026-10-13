/**
 * RH GLOBAL CRM - Packages Service
 * Handles data persistence (localStorage with wireframe initial seeds)
 * for Visa Packages/Countries and Holiday/Tour Packages.
 */

const STORAGE_KEY_VISA = 'rh_crm_visa_packages_v1'
const STORAGE_KEY_HOLIDAYS = 'rh_crm_holiday_packages_v2'

const INITIAL_VISA_PACKAGES = [
  {
    id: 'US',
    countryName: 'United States',
    flag: '🇺🇸',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&auto=format&fit=crop&q=80',
    code: 'US',
    processingTime: '15-20 Days',
    startingFee: 21000,
    status: 'ACTIVE',
    embassyStatus: 'Active Visa Issuance',
    visaTypes: [
      {
        id: 'VT-101',
        name: 'B1/B2 Tourist & Business Visa',
        validity: '10 Years Multiple Entry',
        stayDuration: 'up to 180 Days',
        fee: 21000,
      },
      {
        id: 'VT-102',
        name: 'F1 Student Visa',
        validity: 'Duration of Study Course',
        stayDuration: 'Course Duration + OPT',
        fee: 28000,
      },
      {
        id: 'VT-103',
        name: 'H1B / L1 Work Permit',
        validity: '3 Years Extendable',
        stayDuration: 'Authorized Stay Period',
        fee: 65000,
      },
    ],
    documentRequirements: [
      {
        id: 'DOC-101',
        name: 'DS-160 Confirmation Page',
        requirementType: 'MANDATORY',
        instructions: 'Must have barcoded confirmation printed in high resolution.',
      },
      {
        id: 'DOC-102',
        name: 'Passport (Valid 6+ Months)',
        requirementType: 'MANDATORY',
        instructions: 'Passport must have at least 2 blank pages remaining.',
      },
      {
        id: 'DOC-103',
        name: 'Bank Statement (6 Months)',
        requirementType: 'MANDATORY',
        instructions: 'Minimum closing balance ₹500,000 required with bank seal.',
      },
    ],
    embassyGuidance:
      'Ensure DS-160 application details match passport exactly. Book interview slot at US Embassy/VAC after fee payment. Bring original financial proofs to interview.',
  },
  {
    id: 'GB',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80',
    code: 'GB',
    processingTime: '10-15 Days',
    startingFee: 24000,
    status: 'ACTIVE',
    embassyStatus: 'Active Visa Issuance',
    visaTypes: [
      {
        id: 'VT-201',
        name: 'Standard Visitor Visa (6 Months)',
        validity: '6 Months Multiple Entry',
        stayDuration: 'up to 180 Days',
        fee: 24000,
      },
      {
        id: 'VT-202',
        name: 'Skilled Worker Visa (Tier 2)',
        validity: 'Up to 5 Years',
        stayDuration: 'Full Employment Term',
        fee: 72000,
      },
    ],
    documentRequirements: [
      {
        id: 'DOC-201',
        name: 'Current Valid Passport',
        requirementType: 'MANDATORY',
        instructions: 'Must be valid for the duration of stay in the UK with empty pages.',
      },
      {
        id: 'DOC-202',
        name: 'Financial Proof & Salary Slips',
        requirementType: 'MANDATORY',
        instructions: 'Last 6 months verified bank statements and employer NOC.',
      },
    ],
    embassyGuidance:
      'Submit biometrics at nearest VFS Global centre. Keep electronic copy of UKVI confirmation email. Priority processing available for additional consulate fee.',
  },
  {
    id: 'EU',
    countryName: 'Schengen (France / Europe)',
    flag: '🇪🇺',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    code: 'EU',
    processingTime: '7-10 Days',
    startingFee: 18500,
    status: 'ACTIVE',
    embassyStatus: 'Active Visa Issuance',
    visaTypes: [
      {
        id: 'VT-301',
        name: 'Short Stay Tourist Visa (Type C)',
        validity: 'Up to 90 Days',
        stayDuration: '90 Days within 180 Days',
        fee: 18500,
      },
      {
        id: 'VT-302',
        name: 'Business Visitor Visa',
        validity: '1 Year Multi-Entry',
        stayDuration: '90 Days per visit',
        fee: 22000,
      },
    ],
    documentRequirements: [
      {
        id: 'DOC-301',
        name: 'Travel Medical Insurance (€30,000 cover)',
        requirementType: 'MANDATORY',
        instructions: 'Must cover entire Schengen zone with minimum €30k emergency repatriation.',
      },
      {
        id: 'DOC-302',
        name: 'Confirmed Round-Trip Flight Itinerary',
        requirementType: 'MANDATORY',
        instructions: 'Flight reservation showing entry and exit points across Europe.',
      },
    ],
    embassyGuidance:
      'Apply at the consulate of primary destination or longest stay country. Bring 2 recent biometric photos meeting ICAO Schengen standards.',
  },
  {
    id: 'JP',
    countryName: 'Japan',
    flag: '🇯🇵',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
    code: 'JP',
    processingTime: '5-7 Days',
    startingFee: 12500,
    status: 'ACTIVE',
    embassyStatus: 'Active Visa Issuance',
    visaTypes: [
      {
        id: 'VT-401',
        name: 'Single-Entry Tourist eVisa',
        validity: '90 Days from issuance',
        stayDuration: 'Up to 30 Days',
        fee: 12500,
      },
    ],
    documentRequirements: [
      {
        id: 'DOC-401',
        name: 'Daily Schedule of Stay (Form 3)',
        requirementType: 'MANDATORY',
        instructions: 'Day-by-day activity itinerary with booked hotel accommodation names.',
      },
      {
        id: 'DOC-402',
        name: 'Income Tax Return (ITR-V)',
        requirementType: 'MANDATORY',
        instructions: 'Last 1-2 assessment years ITR with filing acknowledgement.',
      },
    ],
    embassyGuidance:
      'Electronic visa issuance available for eligible passports. Print the digital visa issuance notice before boarding flight.',
  },
]

const INITIAL_HOLIDAY_PACKAGES = [
  {
    id: 'PKG-701',
    name: 'Bali Island Beach Getaway',
    country: 'Indonesia',
    destination: 'Bali, Indonesia',
    duration: '6 Days / 5 Nights',
    price: 85000,
    priceUnit: 'per person',
    status: 'ACTIVE',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&auto=format&fit=crop&q=80',
    ],
    overview:
      'Experience pristine tropical beaches, luxury private pool villa stay, Kintamani volcano tour, and Nusa Penida island cruise.',
    inclusions:
      '5-Star Beach Resort, Daily Breakfast, Private Airport Transfers, Water Sports, Kintamani Sightseeing Tour, English Tour Guide',
    exclusions:
      'International Flights, Personal Expenses, Lunch/Dinner, Visa on Arrival Fee ($35)',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bali & Villa Check-in',
        description: 'Welcome at Denpasar Airport, transfer to Seminyak luxury beach villa. Leisure evening.',
      },
      {
        day: 2,
        title: 'Kintamani Volcano & Ubud Cultural Tour',
        description: 'Visit Tegenungan Waterfall, Sacred Monkey Forest, and scenic Mount Batur volcano view.',
      },
      {
        day: 3,
        title: 'Nusa Penida Island Speedboat Day Trip',
        description: 'Explore Kelingking T-Rex Beach, Broken Beach, and Angel Billabong with snorkeling.',
      },
      {
        day: 4,
        title: 'Water Sports at Tanjung Benoa & Uluwatu Sunset',
        description: 'Banana boat, Parasailing + Sunset kecak dance performance at Uluwatu Cliff Temple.',
      },
      {
        day: 5,
        title: 'Tanah Lot Temple & Balinese Spa Session',
        description: 'Relaxing 2-hour traditional Balinese massage and Tanah Lot ocean temple sunset.',
      },
      {
        day: 6,
        title: 'Souvenir Shopping & Departure Transfer',
        description: 'Breakfast, Krisna Balinese souvenir market visit, airport drop-off for flight home.',
      },
    ],
  },
  {
    id: 'PKG-702',
    name: 'Swiss Alps & Paris Highlights',
    country: 'France & Switzerland',
    destination: 'Paris & Zurich',
    duration: '8 Days / 7 Nights',
    price: 210000,
    priceUnit: 'per person',
    status: 'ACTIVE',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80',
    ],
    overview:
      'Marvel at iconic Paris landmarks, journey through the French countryside via high-speed TGV, and experience breathtaking Swiss mountain panoramas.',
    inclusions:
      '4-Star Central Hotels, Swiss Pass 4 Days, TGV High-Speed Rail, Eiffel Tower 2nd Floor Ticket, Mount Titlis Excursion, Daily Breakfast',
    exclusions:
      'International Airfare, Schengen Visa Fees, Lunch and Dinners, Personal Shopping and Tips',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Paris & Seine River Cruise',
        description: 'Arrive at Paris CDG Airport, private hotel transfer, evening romantic illuminations cruise on River Seine.',
      },
      {
        day: 2,
        title: 'Eiffel Tower & Louvre Museum Highlights',
        description: 'Skip-the-line access to Eiffel Tower 2nd floor, guided walking tour through Louvre Museum and Champs-Élysées.',
      },
      {
        day: 3,
        title: 'TGV High-Speed Train to Zurich',
        description: 'Scenic high-speed train journey through Alsace into Zurich, Switzerland. Check-in and Lake Zurich promenade.',
      },
      {
        day: 4,
        title: 'Lucerne & Mount Titlis Rotair Cable Car',
        description: 'Revolving cable car ascent to Mount Titlis glacier, cliff walk suspension bridge, and Lucerne Chapel Bridge.',
      },
      {
        day: 5,
        title: 'Interlaken & Jungfraujoch Top of Europe',
        description: 'Full-day excursion to Europe highest railway station Jungfraujoch, ice palace, and alpine views.',
      },
      {
        day: 6,
        title: 'Bernese Oberland Villages Exploration',
        description: 'Explore Lauterbrunnen 72 waterfalls valley and picturesque Grindelwald mountain village.',
      },
      {
        day: 7,
        title: 'Zurich Old Town & Shopping Spree',
        description: 'Bahnhofstrasse luxury shopping, Swiss chocolate tasting, and farewell dinner overlooking Lake Zurich.',
      },
      {
        day: 8,
        title: 'Departure Transfer',
        description: 'Breakfast at hotel, private transfer to Zurich International Airport for return flight.',
      },
    ],
  },
  {
    id: 'PKG-703',
    name: 'Dubai Luxury Desert & Skyscraper Safari',
    country: 'UAE (Dubai)',
    destination: 'Dubai & Abu Dhabi',
    duration: '5 Days / 4 Nights',
    price: 65000,
    priceUnit: 'per person',
    status: 'ACTIVE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&auto=format&fit=crop&q=80',
    ],
    overview:
      'Indulge in futuristic architectural wonders, thrilling 4x4 desert dune bashing, opulent Marina dhow dinners, and Abu Dhabi cultural landmarks.',
    inclusions:
      '4-Star Dubai Marina Hotel, 4x4 Desert Safari, Burj Khalifa At The Top Ticket, Abu Dhabi Day Tour, Dhow Cruise Dinner, Airport Transfers',
    exclusions:
      'International Flights, UAE Tourism Dirham Fee, Alcoholic Beverages, Quad Biking Extras',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Dubai & Marina Dhow Cruise Dinner',
        description: 'Warm reception at Dubai International Airport, private transfer to hotel. Evening 5-star Marina cruise with buffet dinner.',
      },
      {
        day: 2,
        title: 'Dubai City Tour & Burj Khalifa 124th Floor',
        description: 'Guided city tour covering Dubai Frame, Palm Jumeirah, and sunset view from Burj Khalifa At The Top.',
      },
      {
        day: 3,
        title: 'Thrilling Red Dunes Desert Safari with BBQ',
        description: 'Dune bashing in 4x4 Land Cruiser, sandboarding, camel rides, belly dance show, and Arabic BBQ dinner under the stars.',
      },
      {
        day: 4,
        title: 'Abu Dhabi Grand Mosque & Louvre Day Tour',
        description: 'Day trip to Sheikh Zayed Grand Mosque, Emirates Palace photo stop, and Yas Island Ferrari World viewing.',
      },
      {
        day: 5,
        title: 'Gold Souk Shopping & Airport Drop-off',
        description: 'Traditional Deira Gold & Spice souks tour, final tax-free shopping, and transfer to Dubai Airport.',
      },
    ],
  },
]

// Helpers to load / save
const loadVisaPackages = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VISA)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_VISA, JSON.stringify(INITIAL_VISA_PACKAGES))
      return INITIAL_VISA_PACKAGES
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_VISA_PACKAGES
  }
}

const saveVisaPackages = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY_VISA, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save visa packages', e)
  }
}

const loadHolidayPackages = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HOLIDAYS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_HOLIDAYS, JSON.stringify(INITIAL_HOLIDAY_PACKAGES))
      return INITIAL_HOLIDAY_PACKAGES
    }
    const parsed = JSON.parse(raw)
    return parsed.map((item) => ({
      ...item,
      images:
        item.images && item.images.length > 0
          ? item.images
          : item.image
          ? [item.image]
          : [],
    }))
  } catch {
    return INITIAL_HOLIDAY_PACKAGES
  }
}

const saveHolidayPackages = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY_HOLIDAYS, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save holiday packages', e)
  }
}

export const packagesService = {
  // ==========================================
  // VISA PACKAGES / COUNTRIES
  // ==========================================
  getVisaPackages() {
    return loadVisaPackages()
  },

  getVisaPackageById(id) {
    const list = loadVisaPackages()
    return list.find((item) => item.id.toLowerCase() === id.toLowerCase()) || null
  },

  createVisaPackage(payload) {
    const list = loadVisaPackages()
    const newPackage = {
      ...payload,
      id: payload.code.toUpperCase(),
      status: payload.status || 'ACTIVE',
      visaTypes: payload.visaTypes || [],
      documentRequirements: payload.documentRequirements || [],
      embassyGuidance: payload.embassyGuidance || 'Follow official consulate instructions.',
    }
    const updated = [newPackage, ...list]
    saveVisaPackages(updated)
    return newPackage
  },

  updateVisaPackage(id, updates) {
    const list = loadVisaPackages()
    const updated = list.map((item) => {
      if (item.id.toLowerCase() === id.toLowerCase()) {
        return { ...item, ...updates }
      }
      return item
    })
    saveVisaPackages(updated)
    return updated.find((item) => item.id.toLowerCase() === id.toLowerCase())
  },

  toggleVisaPackageStatus(id) {
    const list = loadVisaPackages()
    const updated = list.map((item) => {
      if (item.id.toLowerCase() === id.toLowerCase()) {
        return { ...item, status: item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
      }
      return item
    })
    saveVisaPackages(updated)
    return updated
  },

  deleteVisaPackage(id) {
    const list = loadVisaPackages()
    const updated = list.filter((item) => item.id.toLowerCase() !== id.toLowerCase())
    saveVisaPackages(updated)
    return updated
  },

  // Sub-items: Visa Types
  addVisaType(countryId, visaTypePayload) {
    const list = loadVisaPackages()
    const newType = {
      id: `VT-${Date.now().toString().slice(-4)}`,
      ...visaTypePayload,
      fee: Number(visaTypePayload.fee) || 0,
    }
    const updated = list.map((c) => {
      if (c.id.toLowerCase() === countryId.toLowerCase()) {
        const types = [...(c.visaTypes || []), newType]
        return { ...c, visaTypes: types }
      }
      return c
    })
    saveVisaPackages(updated)
    return newType
  },

  updateVisaType(countryId, typeId, updates) {
    const list = loadVisaPackages()
    const updated = list.map((c) => {
      if (c.id.toLowerCase() === countryId.toLowerCase()) {
        const types = (c.visaTypes || []).map((vt) => (vt.id === typeId ? { ...vt, ...updates } : vt))
        return { ...c, visaTypes: types }
      }
      return c
    })
    saveVisaPackages(updated)
  },

  deleteVisaType(countryId, typeId) {
    const list = loadVisaPackages()
    const updated = list.map((c) => {
      if (c.id.toLowerCase() === countryId.toLowerCase()) {
        const types = (c.visaTypes || []).filter((vt) => vt.id !== typeId)
        return { ...c, visaTypes: types }
      }
      return c
    })
    saveVisaPackages(updated)
  },

  // Sub-items: Document Requirements
  addDocumentRequirement(countryId, docPayload) {
    const list = loadVisaPackages()
    const newDoc = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      ...docPayload,
    }
    const updated = list.map((c) => {
      if (c.id.toLowerCase() === countryId.toLowerCase()) {
        const docs = [...(c.documentRequirements || []), newDoc]
        return { ...c, documentRequirements: docs }
      }
      return c
    })
    saveVisaPackages(updated)
    return newDoc
  },

  updateDocumentRequirement(countryId, docId, updates) {
    const list = loadVisaPackages()
    const updated = list.map((c) => {
      if (c.id.toLowerCase() === countryId.toLowerCase()) {
        const docs = (c.documentRequirements || []).map((d) => (d.id === docId ? { ...d, ...updates } : d))
        return { ...c, documentRequirements: docs }
      }
      return c
    })
    saveVisaPackages(updated)
  },

  deleteDocumentRequirement(countryId, docId) {
    const list = loadVisaPackages()
    const updated = list.map((c) => {
      if (c.id.toLowerCase() === countryId.toLowerCase()) {
        const docs = (c.documentRequirements || []).filter((d) => d.id !== docId)
        return { ...c, documentRequirements: docs }
      }
      return c
    })
    saveVisaPackages(updated)
  },

  // Sub-items: Official Embassy Guidance
  updateEmbassyGuidance(countryId, guidanceText) {
    return this.updateVisaPackage(countryId, { embassyGuidance: guidanceText })
  },

  // ==========================================
  // HOLIDAY / TOUR PACKAGES
  // ==========================================
  getHolidayPackages() {
    return loadHolidayPackages()
  },

  getHolidayPackageById(id) {
    const list = loadHolidayPackages()
    return list.find((item) => item.id.toLowerCase() === id.toLowerCase()) || null
  },

  createHolidayPackage(payload) {
    const list = loadHolidayPackages()
    const newId = payload.id || `PKG-${700 + list.length + 1}`
    const images = payload.images && payload.images.length > 0 ? payload.images : (payload.image ? [payload.image] : [])
    const primaryImage = images[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
    const newPackage = {
      ...payload,
      id: newId,
      image: primaryImage,
      images,
      status: payload.status || 'ACTIVE',
      price: Number(payload.price) || 0,
      priceUnit: payload.priceUnit || 'per person',
      itinerary: payload.itinerary || [],
    }
    const updated = [newPackage, ...list]
    saveHolidayPackages(updated)
    return newPackage
  },

  updateHolidayPackage(id, updates) {
    const list = loadHolidayPackages()
    const updated = list.map((item) => {
      if (item.id.toLowerCase() === id.toLowerCase()) {
        const images = updates.images !== undefined ? updates.images : (item.images || [item.image])
        const image = images[0] || updates.image || item.image
        return { ...item, ...updates, images, image }
      }
      return item
    })
    saveHolidayPackages(updated)
    return updated.find((item) => item.id.toLowerCase() === id.toLowerCase())
  },

  toggleHolidayPackageStatus(id) {
    const list = loadHolidayPackages()
    const updated = list.map((item) => {
      if (item.id.toLowerCase() === id.toLowerCase()) {
        return { ...item, status: item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
      }
      return item
    })
    saveHolidayPackages(updated)
    return updated
  },

  deleteHolidayPackage(id) {
    const list = loadHolidayPackages()
    const updated = list.filter((item) => item.id.toLowerCase() !== id.toLowerCase())
    saveHolidayPackages(updated)
    return updated
  },

  // Sub-items: Itinerary Days
  addItineraryDay(packageId, dayPayload) {
    const list = loadHolidayPackages()
    const updated = list.map((pkg) => {
      if (pkg.id.toLowerCase() === packageId.toLowerCase()) {
        const existing = pkg.itinerary || []
        const dayNumber = dayPayload.day || existing.length + 1
        const newDay = {
          day: dayNumber,
          title: dayPayload.title,
          description: dayPayload.description,
        }
        return { ...pkg, itinerary: [...existing, newDay] }
      }
      return pkg
    })
    saveHolidayPackages(updated)
  },

  updateItineraryDay(packageId, dayNumber, updates) {
    const list = loadHolidayPackages()
    const updated = list.map((pkg) => {
      if (pkg.id.toLowerCase() === packageId.toLowerCase()) {
        const itinerary = (pkg.itinerary || []).map((d) => (d.day === dayNumber ? { ...d, ...updates } : d))
        return { ...pkg, itinerary }
      }
      return pkg
    })
    saveHolidayPackages(updated)
  },

  deleteItineraryDay(packageId, dayNumber) {
    const list = loadHolidayPackages()
    const updated = list.map((pkg) => {
      if (pkg.id.toLowerCase() === packageId.toLowerCase()) {
        const filtered = (pkg.itinerary || []).filter((d) => d.day !== dayNumber)
        // re-index days
        const reindexed = filtered.map((item, idx) => ({ ...item, day: idx + 1 }))
        return { ...pkg, itinerary: reindexed }
      }
      return pkg
    })
    saveHolidayPackages(updated)
  },
}

export default packagesService
