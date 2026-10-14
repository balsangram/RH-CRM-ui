const STORAGE_KEY = 'rh_crm_companies_data'

const DEFAULT_COMPANIES = [
  {
    id: 'CMP-02',
    regNo: 'REG-2019-44120',
    name: 'Apex Tours & Tech',
    avatar: 'AT',
    contactPerson: 'Sunil Mehta',
    email: 'info@apextours.com',
    phone: '+91 22 2800 1122',
    address: '45 BKC Complex, Mumbai',
    country: 'India',
    totalTravelers: 18,
    totalApplications: 29,
    status: 'ACTIVE',
    financialInfo: {
      creditLimit: '₹25,00,000',
      creditUtilized: '₹8,45,000',
      creditAvailable: '₹16,55,000',
      paymentTerms: 'Net 30 Days',
      gstNumber: '27AAACA1234F1Z8',
      panNumber: 'AAACA1234F',
      billingEmail: 'accounts@apextours.com',
      bankName: 'HDFC Bank, BKC Branch',
      accountNo: '50200041289123',
      ifscCode: 'HDFC0000060',
      invoices: [
        { invoiceNo: 'INV-2026-108', date: '2026-10-02', particulars: 'US B1 Visa Processing (12 Travelers)', amount: '₹3,24,000', status: 'PAID', dueDate: '2026-11-01' },
        { invoiceNo: 'INV-2026-095', date: '2026-09-18', particulars: 'Schengen Corporate Package (6 Travelers)', amount: '₹5,21,000', status: 'PENDING', dueDate: '2026-10-18' },
        { invoiceNo: 'INV-2026-072', date: '2026-08-20', particulars: 'UK Fast-Track Visa Services', amount: '₹1,80,000', status: 'PAID', dueDate: '2026-09-20' },
      ],
    },
    applications: [
      {
        id: 'APP-5001',
        applicantName: 'Rohan Joshi',
        applicationType: 'VISA',
        country: 'United States',
        serviceRequired: 'Business Visa (B1)',
        assignedOfficer: 'Amit Verma (CO-101)',
        status: 'IN PROGRESS',
        applicationDate: '2026-10-01',
        notes: 'Dossier active in processing. Client appointment scheduled for biometric submission.',
      },
      {
        id: 'APP-5002',
        applicantName: 'Deepak Chopra',
        applicationType: 'HOLIDAY',
        country: 'France & Switzerland',
        serviceRequired: 'Grand Europe 10D',
        assignedOfficer: 'Priya Singh (CO-102)',
        status: 'APPROVED',
        applicationDate: '2026-09-25',
        notes: 'Visa/Booking confirmed. Vouchers issued and verified.',
      },
      {
        id: 'APP-5003',
        applicantName: 'Kavita Sundaram',
        applicationType: 'VISA',
        country: 'Canada',
        serviceRequired: 'Visitor Visa',
        assignedOfficer: 'Amit Verma (CO-101)',
        status: 'UNDER REVIEW',
        applicationDate: '2026-10-04',
        notes: 'Initial review & docs verification underway. Awaiting passport scan.',
      },
    ],
    employees: [
      {
        id: 'EMP-101',
        name: 'Rohan Joshi',
        email: 'rohan.j@rhglobal.com',
        phone: '+91 98200 11111',
        department: 'Executive',
        designation: 'Senior Manager',
        status: 'ACTIVE',
      },
      {
        id: 'EMP-102',
        name: 'Deepak Chopra',
        email: 'deepak.c@rhglobal.com',
        phone: '+91 98200 22222',
        department: 'Sales',
        designation: 'Sales Director',
        status: 'ACTIVE',
      },
      {
        id: 'EMP-103',
        name: 'Kavita Sundaram',
        email: 'kavita.s@rhglobal.com',
        phone: '+91 98200 33333',
        department: 'HR',
        designation: 'HR Lead',
        status: 'ACTIVE',
      },
    ],
  },
  {
    id: 'CMP-07',
    regNo: 'REG-2020-55412',
    name: 'BlueStar Overseas Education',
    avatar: 'BO',
    contactPerson: 'Senthil Nathan',
    email: 'admissions@bluestaroverseas.com',
    phone: '+91 44 2822 3344',
    address: 'Mount Road, Anna Salai, Chennai',
    country: 'India',
    totalTravelers: 29,
    totalApplications: 53,
    status: 'ACTIVE',
    financialInfo: {
      creditLimit: '₹40,00,000',
      creditUtilized: '₹14,20,000',
      creditAvailable: '₹25,80,000',
      paymentTerms: 'Net 15 Days',
      gstNumber: '33AABCB5678G1Z2',
      panNumber: 'AABCB5678G',
      billingEmail: 'billing@bluestaroverseas.com',
      bankName: 'ICICI Bank, Anna Salai',
      accountNo: '001105018921',
      ifscCode: 'ICIC0000011',
      invoices: [
        { invoiceNo: 'INV-2026-104', date: '2026-09-30', particulars: 'UK Student Cohort Batch (18 Students)', amount: '₹7,50,000', status: 'PAID', dueDate: '2026-10-15' },
        { invoiceNo: 'INV-2026-089', date: '2026-09-12', particulars: 'Canada Study Permits & Processing', amount: '₹6,70,000', status: 'PAID', dueDate: '2026-09-27' },
      ],
    },
    applications: [
      {
        id: 'APP-5011',
        applicantName: 'Vikramaditya Rao',
        applicationType: 'VISA',
        country: 'United Kingdom',
        serviceRequired: 'Tier 4 Student Visa',
        assignedOfficer: 'Priya Singh (CO-102)',
        status: 'IN PROGRESS',
        applicationDate: '2026-10-03',
        notes: 'CAS letter verified with University of Manchester.',
      },
      {
        id: 'APP-5012',
        applicantName: 'Ananya Deshmukh',
        applicationType: 'VISA',
        country: 'Canada',
        serviceRequired: 'SDS Study Permit',
        assignedOfficer: 'Amit Verma (CO-101)',
        status: 'APPROVED',
        applicationDate: '2026-09-28',
        notes: 'GIC and tuition receipts validated.',
      },
      {
        id: 'APP-5013',
        applicantName: 'Karthik Raja',
        applicationType: 'HOLIDAY',
        country: 'Australia',
        serviceRequired: 'Sydney & Gold Coast 8D',
        assignedOfficer: 'Priya Singh (CO-102)',
        status: 'UNDER REVIEW',
        applicationDate: '2026-10-06',
        notes: 'Orientation tour booking.',
      },
    ],
    employees: [
      {
        id: 'EMP-201',
        name: 'Senthil Nathan',
        email: 'senthil.n@bluestar.com',
        phone: '+91 94440 12345',
        department: 'Operations',
        designation: 'Managing Director',
        status: 'ACTIVE',
      },
      {
        id: 'EMP-202',
        name: 'Meenakshi Iyer',
        email: 'm.iyer@bluestar.com',
        phone: '+91 94440 23456',
        department: 'Admissions',
        designation: 'Lead Counselor',
        status: 'ACTIVE',
      },
    ],
  },
  {
    id: 'CMP-04',
    regNo: 'REG-2022-77341',
    name: 'Nexus Global Logistics',
    avatar: 'NG',
    contactPerson: 'Pooja Reddy',
    email: 'corporate@nexuslogistics.com',
    phone: '+91 40 4455 6677',
    address: 'Plot 48, Hitec City, Hyderabad',
    country: 'India',
    totalTravelers: 22,
    totalApplications: 41,
    status: 'ACTIVE',
    financialInfo: {
      creditLimit: '₹30,00,000',
      creditUtilized: '₹9,10,000',
      creditAvailable: '₹20,90,000',
      paymentTerms: 'Net 30 Days',
      gstNumber: '36AABCN9911K1Z5',
      panNumber: 'AABCN9911K',
      billingEmail: 'fin@nexuslogistics.com',
      bankName: 'Axis Bank, Hitec City',
      accountNo: '9180200388123',
      ifscCode: 'UTIB0000842',
      invoices: [
        { invoiceNo: 'INV-2026-101', date: '2026-09-25', particulars: 'Schengen Business Multiple Entry', amount: '₹4,80,000', status: 'PAID', dueDate: '2026-10-25' },
      ],
    },
    applications: [
      {
        id: 'APP-5021',
        applicantName: 'Pooja Reddy',
        applicationType: 'VISA',
        country: 'Germany',
        serviceRequired: 'Business Schengen',
        assignedOfficer: 'Amit Verma (CO-101)',
        status: 'APPROVED',
        applicationDate: '2026-09-22',
        notes: 'Annual logistics expo delegation.',
      },
    ],
    employees: [
      {
        id: 'EMP-301',
        name: 'Pooja Reddy',
        email: 'p.reddy@nexus.com',
        phone: '+91 98480 11223',
        department: 'Executive',
        designation: 'VP Operations',
        status: 'ACTIVE',
      },
      {
        id: 'EMP-302',
        name: 'Srinivas Varma',
        email: 's.varma@nexus.com',
        phone: '+91 98480 33445',
        department: 'Supply Chain',
        designation: 'Operations Head',
        status: 'ACTIVE',
      },
    ],
  },
  {
    id: 'CMP-10',
    regNo: 'REG-2019-99124',
    name: 'Paramount Consulting Group',
    avatar: 'PC',
    contactPerson: 'Harpreet Singh',
    email: 'admin@paramountgroup.org',
    phone: '+91 172 2600 445',
    address: 'IT Park, Phase 8, Mohali, Chandigarh',
    country: 'India',
    totalTravelers: 31,
    totalApplications: 47,
    status: 'ACTIVE',
    financialInfo: {
      creditLimit: '₹35,00,000',
      creditUtilized: '₹12,40,000',
      creditAvailable: '₹22,60,000',
      paymentTerms: 'Net 30 Days',
      gstNumber: '04AABCP4488L1Z9',
      panNumber: 'AABCP4488L',
      billingEmail: 'accounts@paramountgroup.org',
      bankName: 'Punjab National Bank, Mohali',
      accountNo: '19820021000456',
      ifscCode: 'PUNB0198200',
      invoices: [
        { invoiceNo: 'INV-2026-098', date: '2026-09-20', particulars: 'US & UK Executive Visas (8 Pax)', amount: '₹5,10,000', status: 'PAID', dueDate: '2026-10-20' },
      ],
    },
    applications: [
      {
        id: 'APP-5031',
        applicantName: 'Harpreet Singh',
        applicationType: 'VISA',
        country: 'United States',
        serviceRequired: 'L1 Intracompany Transfer',
        assignedOfficer: 'Amit Verma (CO-101)',
        status: 'IN PROGRESS',
        applicationDate: '2026-09-29',
        notes: 'Petition approved, interview scheduled.',
      },
    ],
    employees: [
      {
        id: 'EMP-401',
        name: 'Harpreet Singh',
        email: 'harpreet@paramount.org',
        phone: '+91 98150 12345',
        department: 'Management',
        designation: 'Principal Partner',
        status: 'ACTIVE',
      },
    ],
  },
  {
    id: 'CMP-08',
    regNo: 'REG-2021-66230',
    name: 'Pinnacle Infotech Systems',
    avatar: 'PI',
    contactPerson: 'Anirban Mukherjee',
    email: 'hr.travel@pinnacleinfo.in',
    phone: '+91 33 2288 9911',
    address: 'Sector V, Salt Lake, Kolkata',
    country: 'India',
    totalTravelers: 8,
    totalApplications: 14,
    status: 'INACTIVE',
    financialInfo: {
      creditLimit: '₹15,00,000',
      creditUtilized: '₹2,30,000',
      creditAvailable: '₹12,70,000',
      paymentTerms: 'Net 15 Days',
      gstNumber: '19AABCP1122J1Z3',
      panNumber: 'AABCP1122J',
      billingEmail: 'accounts@pinnacleinfo.in',
      bankName: 'State Bank of India, Salt Lake',
      accountNo: '30992144589',
      ifscCode: 'SBIN0001234',
      invoices: [],
    },
    applications: [
      {
        id: 'APP-5041',
        applicantName: 'Anirban Mukherjee',
        applicationType: 'VISA',
        country: 'Singapore',
        serviceRequired: 'Business Entry',
        assignedOfficer: 'Priya Singh (CO-102)',
        status: 'UNDER REVIEW',
        applicationDate: '2026-09-15',
        notes: 'Corporate account currently paused.',
      },
    ],
    employees: [
      {
        id: 'EMP-501',
        name: 'Anirban Mukherjee',
        email: 'anirban@pinnacleinfo.in',
        phone: '+91 98300 98765',
        department: 'HR & Admin',
        designation: 'HR Generalist',
        status: 'INACTIVE',
      },
    ],
  },
  {
    id: 'CMP-01',
    regNo: 'REG-2018-12345',
    name: 'Zenith Software Solutions',
    avatar: 'ZS',
    contactPerson: 'Rajiv Malhotra',
    email: 'contact@zenithsoft.com',
    phone: '+91 80 4123 4567',
    address: 'Electronic City, Phase 1, Bangalore',
    country: 'India',
    totalTravelers: 25,
    totalApplications: 38,
    status: 'ACTIVE',
    financialInfo: {
      creditLimit: '₹50,00,000',
      creditUtilized: '₹18,50,000',
      creditAvailable: '₹31,50,000',
      paymentTerms: 'Net 30 Days',
      gstNumber: '29AABCZ9876M1Z4',
      panNumber: 'AABCZ9876M',
      billingEmail: 'finance@zenithsoft.com',
      bankName: 'Standard Chartered, Bangalore',
      accountNo: '448102948123',
      ifscCode: 'SCBL0036001',
      invoices: [
        { invoiceNo: 'INV-2026-105', date: '2026-10-01', particulars: 'On-site Deputation Visas (US & Ireland)', amount: '₹8,90,000', status: 'PAID', dueDate: '2026-10-31' },
      ],
    },
    applications: [
      {
        id: 'APP-5051',
        applicantName: 'Gaurav Sen',
        applicationType: 'VISA',
        country: 'Ireland',
        serviceRequired: 'Critical Skills Employment Permit',
        assignedOfficer: 'Amit Verma (CO-101)',
        status: 'IN PROGRESS',
        applicationDate: '2026-10-02',
        notes: 'Work authorization granted by DETE.',
      },
    ],
    employees: [
      {
        id: 'EMP-601',
        name: 'Rajiv Malhotra',
        email: 'rajiv.m@zenithsoft.com',
        phone: '+91 98450 11223',
        department: 'Engineering',
        designation: 'CTO & Co-Founder',
        status: 'ACTIVE',
      },
    ],
  },
  {
    id: 'CMP-03',
    regNo: 'REG-2020-88210',
    name: 'Horizon Financial Services',
    avatar: 'HF',
    contactPerson: 'Kavita Rao',
    email: 'corporate@horizonfin.com',
    phone: '+91 22 6123 7890',
    address: 'Nariman Point, Mumbai',
    country: 'India',
    totalTravelers: 14,
    totalApplications: 22,
    status: 'ACTIVE',
    financialInfo: {
      creditLimit: '₹20,00,000',
      creditUtilized: '₹5,40,000',
      creditAvailable: '₹14,60,000',
      paymentTerms: 'Net 30 Days',
      gstNumber: '27AABCH4455P1Z1',
      panNumber: 'AABCH4455P',
      billingEmail: 'accounts@horizonfin.com',
      bankName: 'Kotak Mahindra, Nariman Point',
      accountNo: '99210044567',
      ifscCode: 'KKBK0000123',
      invoices: [],
    },
    applications: [],
    employees: [],
  },
  {
    id: 'CMP-05',
    regNo: 'REG-2021-33412',
    name: 'Quantum BioTech Labs',
    avatar: 'QB',
    contactPerson: 'Dr. Aris Thorne',
    email: 'operations@quantumbio.com',
    phone: '+44 20 7946 0192',
    address: 'Cambridge Science Park, Milton Road',
    country: 'United Kingdom',
    totalTravelers: 12,
    totalApplications: 19,
    status: 'ACTIVE',
    financialInfo: {
      creditLimit: '₹30,00,000',
      creditUtilized: '₹7,80,000',
      creditAvailable: '₹22,20,000',
      paymentTerms: 'Net 30 Days',
      gstNumber: 'GB992144589',
      panNumber: 'AACFQ8899R',
      billingEmail: 'finance@quantumbio.com',
      bankName: 'Barclays Bank, Cambridge',
      accountNo: '20491823',
      ifscCode: 'BARC204918',
      invoices: [],
    },
    applications: [],
    employees: [],
  },
  {
    id: 'CMP-06',
    regNo: 'REG-2019-55678',
    name: 'Solstice Renewable Energy',
    avatar: 'SR',
    contactPerson: 'Priya Nair',
    email: 'traveldesk@solsticerenew.in',
    phone: '+91 11 2678 9012',
    address: 'Okhla Industrial Area, New Delhi',
    country: 'India',
    totalTravelers: 16,
    totalApplications: 26,
    status: 'ACTIVE',
    financialInfo: {
      creditLimit: '₹25,00,000',
      creditUtilized: '₹6,10,000',
      creditAvailable: '₹18,90,000',
      paymentTerms: 'Net 30 Days',
      gstNumber: '07AABCS3322N1Z6',
      panNumber: 'AABCS3322N',
      billingEmail: 'accounts@solsticerenew.in',
      bankName: 'Yes Bank, Connaught Place',
      accountNo: '002391823901',
      ifscCode: 'YESB0000023',
      invoices: [],
    },
    applications: [],
    employees: [],
  },
  {
    id: 'CMP-09',
    regNo: 'REG-2017-90123',
    name: 'Atlas Shipping & Freight',
    avatar: 'AS',
    contactPerson: 'Tariq Mansoor',
    email: 'corporate@atlasshipping.ae',
    phone: '+971 4 345 6789',
    address: 'Business Bay, Tower 2, Dubai',
    country: 'UAE',
    totalTravelers: 20,
    totalApplications: 34,
    status: 'ACTIVE',
    financialInfo: {
      creditLimit: '₹45,00,000',
      creditUtilized: '₹15,80,000',
      creditAvailable: '₹29,20,000',
      paymentTerms: 'Net 30 Days',
      gstNumber: 'TRN-1002938491000',
      panNumber: 'AABCA9012T',
      billingEmail: 'billing@atlasshipping.ae',
      bankName: 'Emirates NBD, Dubai',
      accountNo: '10192837465',
      ifscCode: 'EBILAEAD',
      invoices: [],
    },
    applications: [],
    employees: [],
  },
]

function getStoredCompanies() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COMPANIES))
      return DEFAULT_COMPANIES
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error reading stored companies:', err)
    return DEFAULT_COMPANIES
  }
}

function saveStoredCompanies(companies) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies))
  } catch (err) {
    console.error('Error saving stored companies:', err)
  }
}

export const companiesService = {
  getCompanies() {
    return getStoredCompanies()
  },

  getCompanyById(id) {
    const list = getStoredCompanies()
    return list.find((c) => c.id.toLowerCase() === id.toLowerCase() || c.name.toLowerCase() === id.toLowerCase()) || null
  },

  createCompany(companyData) {
    const list = getStoredCompanies()
    const nextNum = list.length + 1
    const id = `CMP-${String(nextNum).padStart(2, '0')}`
    const initials = companyData.name
      ? companyData.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'CO'

    const newCompany = {
      id,
      regNo: companyData.regNo || `REG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      name: companyData.name,
      avatar: initials,
      contactPerson: companyData.contactPerson || 'Account Lead',
      email: companyData.email || 'corporate@example.com',
      phone: companyData.phone || '+91 22 0000 0000',
      address: companyData.address || 'Corporate Headquarters',
      country: companyData.country || 'India',
      totalTravelers: Number(companyData.totalTravelers) || 0,
      totalApplications: Number(companyData.totalApplications) || 0,
      status: companyData.status || 'ACTIVE',
      financialInfo: {
        creditLimit: companyData.creditLimit || '₹20,00,000',
        creditUtilized: '₹0',
        creditAvailable: companyData.creditLimit || '₹20,00,000',
        paymentTerms: companyData.paymentTerms || 'Net 30 Days',
        gstNumber: companyData.gstNumber || '27AAACA0000A1Z0',
        panNumber: companyData.panNumber || 'AAACA0000A',
        billingEmail: companyData.email,
        bankName: companyData.bankName || 'HDFC Bank',
        accountNo: '50200000000000',
        ifscCode: 'HDFC0000001',
        invoices: [],
      },
      applications: [],
      employees: [],
    }

    const updated = [newCompany, ...list]
    saveStoredCompanies(updated)
    return newCompany
  },

  updateCompany(id, updates) {
    const list = getStoredCompanies()
    const updated = list.map((c) => {
      if (c.id.toLowerCase() === id.toLowerCase()) {
        return { ...c, ...updates }
      }
      return c
    })
    saveStoredCompanies(updated)
    return updated.find((c) => c.id.toLowerCase() === id.toLowerCase())
  },

  toggleStatus(id) {
    const list = getStoredCompanies()
    const updated = list.map((c) => {
      if (c.id.toLowerCase() === id.toLowerCase()) {
        const nextStatus = c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        return { ...c, status: nextStatus }
      }
      return c
    })
    saveStoredCompanies(updated)
    return updated.find((c) => c.id.toLowerCase() === id.toLowerCase())
  },

  deleteCompany(id) {
    const list = getStoredCompanies()
    const updated = list.filter((c) => c.id.toLowerCase() !== id.toLowerCase())
    saveStoredCompanies(updated)
    return true
  },

  addEmployee(companyId, empData) {
    const list = getStoredCompanies()
    let newEmp = null
    const updated = list.map((c) => {
      if (c.id.toLowerCase() === companyId.toLowerCase()) {
        const nextEmpId = `EMP-${(c.employees?.length || 0) + 101}`
        newEmp = {
          id: nextEmpId,
          name: empData.name,
          email: empData.email,
          phone: empData.phone || '+91 98000 00000',
          department: empData.department || 'General',
          designation: empData.designation || 'Staff',
          status: 'ACTIVE',
        }
        const emps = [...(c.employees || []), newEmp]
        return { ...c, employees: emps, totalTravelers: emps.length }
      }
      return c
    })
    saveStoredCompanies(updated)
    return newEmp
  },

  toggleEmployeeStatus(companyId, empId) {
    const list = getStoredCompanies()
    const updated = list.map((c) => {
      if (c.id.toLowerCase() === companyId.toLowerCase()) {
        const emps = (c.employees || []).map((e) => {
          if (e.id === empId) {
            return { ...e, status: e.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          }
          return e
        })
        return { ...c, employees: emps }
      }
      return c
    })
    saveStoredCompanies(updated)
    return true
  },

  addApplication(companyId, appData) {
    const list = getStoredCompanies()
    let newApp = null
    const updated = list.map((c) => {
      if (c.id.toLowerCase() === companyId.toLowerCase()) {
        const nextAppId = `APP-${Math.floor(5000 + Math.random() * 9000)}`
        newApp = {
          id: nextAppId,
          applicantName: appData.applicantName,
          applicationType: appData.applicationType || 'VISA',
          country: appData.country || 'United States',
          serviceRequired: appData.serviceRequired || 'Visitor Visa',
          assignedOfficer: appData.assignedOfficer || 'Amit Verma (CO-101)',
          status: appData.status || 'UNDER REVIEW',
          applicationDate: new Date().toISOString().split('T')[0],
          notes: appData.notes || 'Created via company portal',
        }
        const apps = [newApp, ...(c.applications || [])]
        return { ...c, applications: apps, totalApplications: apps.length }
      }
      return c
    })
    saveStoredCompanies(updated)
    return newApp
  },
}

export default companiesService
