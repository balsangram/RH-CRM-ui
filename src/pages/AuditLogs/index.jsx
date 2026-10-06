import React from 'react'
import Table from '../../components/Table'

export const AuditLogs = () => {
  const logs = [
    { id: 'LOG-551', timestamp: '2026-10-06 10:14:22', user: 'Sarah Connor', action: 'ROLE_MODIFIED', target: 'Immigration Agent', ip: '192.168.1.42', status: 'SUCCESS' },
    { id: 'LOG-550', timestamp: '2026-10-06 09:45:10', user: 'Alex Morgan', action: 'APPLICATION_STATUS_UPDATED', target: 'APP-1023', ip: '192.168.1.18', status: 'SUCCESS' },
    { id: 'LOG-549', timestamp: '2026-10-06 08:32:00', user: 'System Worker', action: 'BACKUP_COMPLETED', target: 'Database_RH_Global', ip: '127.0.0.1', status: 'SUCCESS' },
    { id: 'LOG-548', timestamp: '2026-10-05 18:20:11', user: 'Dev Patel', action: 'LEAD_CONVERTED', target: 'Lead #412', ip: '192.168.1.88', status: 'SUCCESS' },
    { id: 'LOG-547', timestamp: '2026-10-05 16:11:05', user: 'Unknown IP', action: 'FAILED_LOGIN_ATTEMPT', target: 'admin@rhglobal.com', ip: '203.0.113.195', status: 'FAILED' },
  ]

  const columns = [
    { key: 'id', header: 'Log ID', render: (val) => <span className="font-mono text-xs">{val}</span> },
    { key: 'timestamp', header: 'Timestamp' },
    { key: 'user', header: 'Actor / User' },
    { key: 'action', header: 'Action', render: (val) => <span className="font-mono text-xs font-semibold text-slate-800">{val}</span> },
    { key: 'target', header: 'Target Entity' },
    { key: 'ip', header: 'IP Address', render: (val) => <span className="font-mono text-xs">{val}</span> },
    {
      key: 'status',
      header: 'Result',
      render: (val) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
            val === 'SUCCESS'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {val}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Immutable security activity logs for compliance, data changes, and staff access</p>
      </div>

      <Table columns={columns} data={logs} />
    </div>
  )
}

export default AuditLogs
