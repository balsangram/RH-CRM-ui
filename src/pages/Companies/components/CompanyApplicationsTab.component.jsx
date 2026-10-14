import React, { useState, useMemo } from 'react'
import KanbanBoard from '../../../components/Kanban/KanbanBoard.component'
import KanbanCard from '../../../components/Kanban/KanbanCard.component'

const KANBAN_COLUMNS = [
  {
    id: 'UNDER REVIEW',
    title: 'Under Review',
    subtitle: 'Initial review & docs verification',
    color: 'border-t-2 border-blue-500',
    emptyText: 'No applications in Under Review',
  },
  {
    id: 'IN PROGRESS',
    title: 'In Progress',
    subtitle: 'Dossier active in processing',
    color: 'border-t-2 border-indigo-500',
    emptyText: 'No applications in In Progress',
  },
  {
    id: 'APPROVED',
    title: 'Approved',
    subtitle: 'Visa/Booking confirmed',
    color: 'border-t-2 border-emerald-500',
    emptyText: 'No applications in Approved',
  },
  {
    id: 'PENDING ACTION',
    title: 'Pending Action',
    subtitle: 'Awaiting client documents',
    color: 'border-t-2 border-purple-500',
    emptyText: 'No applications in Pending Action',
  },
  {
    id: 'COMPLETED',
    title: 'Completed',
    subtitle: 'Travel successfully completed',
    color: 'border-t-2 border-teal-500',
    emptyText: 'No applications in Completed',
  },
  {
    id: 'REJECTED',
    title: 'Rejected',
    subtitle: 'Declined by embassy / cancelled',
    color: 'border-t-2 border-rose-500',
    emptyText: 'No applications in Rejected',
  },
]

/**
 * CompanyApplicationsTab Component
 * Houses the Kanban Pipeline view and Table view for company applications
 * (Screenshots 3 & 4)
 */
export const CompanyApplicationsTab = ({
  applications = [],
  onNewApplication,
  onViewApplication,
}) => {
  const [format, setFormat] = useState('kanban') // 'kanban' | 'table'
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Filter applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      if (typeFilter !== 'all' && app.applicationType !== typeFilter) return false
      if (statusFilter !== 'all' && app.status !== statusFilter) return false
      if (!search.trim()) return true
      const q = search.toLowerCase().trim()
      return (
        app.id.toLowerCase().includes(q) ||
        app.applicantName.toLowerCase().includes(q) ||
        app.country.toLowerCase().includes(q) ||
        app.serviceRequired.toLowerCase().includes(q) ||
        app.assignedOfficer.toLowerCase().includes(q)
      )
    })
  }, [applications, typeFilter, statusFilter, search])

  return (
    <div className="space-y-4">
      {/* Top Header Row with Format Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-slate-900">
          Company Applications — {format === 'kanban' ? 'Kanban Pipeline' : 'Table Format'} (
          {filteredApps.length})
        </h2>

        <div className="flex items-center gap-2">
          {onNewApplication && (
            <button
              type="button"
              onClick={onNewApplication}
              className="px-3 py-1.5 text-xs font-bold rounded bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
            >
              + New Application
            </button>
          )}

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="font-medium mr-1">Format:</span>
            <button
              type="button"
              onClick={() => setFormat('table')}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                format === 'table'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              = Table
            </button>
            <button
              type="button"
              onClick={() => setFormat('kanban')}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                format === 'kanban'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Kanban
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <label className="text-slate-600 font-medium whitespace-nowrap">Search Applicant / ID:</label>
          <input
            type="text"
            placeholder="Type to filter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-600 font-medium whitespace-nowrap">Application Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800 bg-white"
          >
            <option value="all">All Types</option>
            <option value="VISA">Visa</option>
            <option value="HOLIDAY">Holiday</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-600 font-medium whitespace-nowrap">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-800 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="UNDER REVIEW">Under Review</option>
            <option value="IN PROGRESS">In Progress</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING ACTION">Pending Action</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* KANBAN FORMAT - Utilizing reusable KanbanBoard & KanbanCard */}
      {format === 'kanban' ? (
        <KanbanBoard
          columns={KANBAN_COLUMNS}
          items={filteredApps}
          getItemColumnId={(app) => app.status}
          renderCard={(app) => (
            <KanbanCard
              id={app.id}
              badge={app.applicationType}
              title={app.applicantName}
              subtitle={app.serviceRequired}
              meta={[
                { icon: '📍', label: app.country },
                { icon: '👤', label: app.assignedOfficer },
                { icon: '📅', label: app.applicationDate },
              ]}
              actionText="View Details &rarr;"
              onAction={() => onViewApplication?.(app)}
              onClick={() => onViewApplication?.(app)}
            />
          )}
        />
      ) : (
        /* TABLE FORMAT (Screenshot 4) */
        <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-900 uppercase border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-4 py-3">APPLICATION ID</th>
                <th className="px-4 py-3">APPLICANT NAME</th>
                <th className="px-4 py-3">APPLICATION TYPE</th>
                <th className="px-4 py-3">COUNTRY</th>
                <th className="px-4 py-3">SERVICE REQUIRED</th>
                <th className="px-4 py-3">ASSIGNED EMPLOYEE / CASE OFFICER</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">APPLICATION DATE</th>
                <th className="px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    No company applications found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{app.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{app.applicantName}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300 text-slate-700 uppercase">
                        {app.applicationType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{app.country}</td>
                    <td className="px-4 py-3 text-slate-700">{app.serviceRequired}</td>
                    <td className="px-4 py-3 text-slate-700">{app.assignedOfficer}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border border-slate-300 text-slate-700 bg-white">
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{app.applicationDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewApplication?.(app)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewApplication?.(app)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CompanyApplicationsTab
