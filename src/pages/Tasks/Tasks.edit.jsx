import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button/Button.component'
import ROUTES from '../../config/routes'

export const TasksEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: 'Follow up with Alice Walker regarding financial proof',
    priority: 'High',
    assignee: 'Alex Morgan',
    dueDate: 'Today',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(ROUTES.TASKS)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">Edit Task #{id || '1'}</h1>
          <p className="text-sm text-muted mt-1">Update task assignment and priority details</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.TASKS)}>
          &larr; Back to Tasks
        </Button>
      </div>

      <div className="crm-card bg-surface p-6 rounded-2xl border border-border shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-main mb-1">
              Task Description *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="crm-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="crm-input"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Assignee
              </label>
              <input
                type="text"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="crm-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-main mb-1">
                Due Date
              </label>
              <input
                type="text"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="crm-input"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate(ROUTES.TASKS)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Task Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TasksEdit
