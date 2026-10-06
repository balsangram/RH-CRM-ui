import React, { useState } from 'react'
import Button from '../../components/Button'

export const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Visa Approved', message: 'Application APP-1023 for Carlos Mendoza has been approved by the Canadian Embassy.', time: '10 minutes ago', unread: true },
    { id: 2, title: 'Document Uploaded', message: 'Emma Watson uploaded a new copy of Bank_Statement_6M.pdf for review.', time: '1 hour ago', unread: true },
    { id: 3, title: 'New Lead Registered', message: 'Alice Walker submitted an inquiry regarding Canada Express Entry.', time: '3 hours ago', unread: false },
    { id: 4, title: 'Task Deadline Alert', message: 'Biometric appointment task for Carlos Mendoza is due today.', time: 'Yesterday', unread: false },
  ])

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications Center</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time alerts for application milestones, document updates, and tasks</p>
        </div>
        <Button onClick={markAllRead} variant="outline" size="sm">
          Mark All as Read
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`p-4 flex items-start justify-between transition-colors ${
              item.unread ? 'bg-indigo-50/40' : 'hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                  item.unread ? 'bg-indigo-600' : 'bg-transparent'
                }`}
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-600 mt-0.5">{item.message}</p>
                <p className="text-[11px] text-slate-400 mt-1">{item.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notifications
