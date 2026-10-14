import React from 'react'

/**
 * CompanyDetailsHeader Component
 * Shows company summary, registration details, and contact metrics (Screenshot 3 header)
 */
export const CompanyDetailsHeader = ({ company }) => {
  if (!company) return null

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Company Details: {company.name}
        </h1>
        <span
          className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
            company.status === 'ACTIVE'
              ? 'border-slate-300 text-slate-700 bg-white'
              : 'border-slate-300 text-slate-400 bg-slate-50'
          }`}
        >
          {company.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 pt-4 text-xs">
        <div>
          <span className="font-bold text-slate-900">Registration Details: </span>
          <span className="text-slate-600">{company.regNo}</span>
        </div>
        <div>
          <span className="font-bold text-slate-900">Contact Person: </span>
          <span className="text-slate-600">{company.contactPerson}</span>
        </div>
        <div>
          <span className="font-bold text-slate-900">Email ID: </span>
          <a href={`mailto:${company.email}`} className="text-slate-600 hover:underline">
            {company.email}
          </a>
        </div>
        <div>
          <span className="font-bold text-slate-900">Phone Number: </span>
          <span className="text-slate-600">{company.phone}</span>
        </div>
        <div>
          <span className="font-bold text-slate-900">Address: </span>
          <span className="text-slate-600">{company.address}</span>
        </div>
        <div>
          <span className="font-bold text-slate-900">Country: </span>
          <span className="text-slate-600">{company.country}</span>
        </div>
        <div>
          <span className="font-bold text-slate-900">Total Registered Travelers: </span>
          <span className="text-slate-600 font-semibold">{company.totalTravelers}</span>
        </div>
        <div>
          <span className="font-bold text-slate-900">Total Applications Submitted: </span>
          <span className="text-slate-600 font-semibold">{company.totalApplications}</span>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailsHeader
