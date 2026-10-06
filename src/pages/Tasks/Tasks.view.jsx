import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.component'

export const Tasks = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Follow up with Alice Walker regarding financial proof', priority: 'High', assignee: 'Alex Morgan', dueDate: 'Today', done: false },
    { id: 2, title: 'Verify passport translation for Jean-Luc Picard', priority: 'Medium', assignee: 'Sarah Connor', dueDate: 'Tomorrow', done: false },
    { id: 3, title: 'Submit biometric appointment request for Carlos Mendoza', priority: 'High', assignee: 'Alex Morgan', dueDate: 'Oct 08, 2026', done: true },
    { id: 4, title: 'Review Schengen embassy interview checklist with Amina', priority: 'Low', assignee: 'Dev Patel', dueDate: 'Oct 10, 2026', done: false },
  ])

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main">Tasks & Follow-ups</h1>
          <p className="text-sm text-muted mt-1">Operational checklist and client task management</p>
        </div>
        <Button onClick={() => navigate('/tasks/add')} variant="primary" size="md">+ Add New Task</Button>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-6 divide-y divide-border">
        {tasks.map((task) => (
          <div key={task.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <p className={`text-sm font-medium ${task.done ? 'line-through text-muted' : 'text-main'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                  <span>Assigned to: <strong>{task.assignee}</strong></span>
                  <span>&bull;</span>
                  <span>Due: {task.dueDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  task.priority === 'High'
                    ? 'bg-rose-100 text-rose-800'
                    : task.priority === 'Medium'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {task.priority}
              </span>
              <button
                onClick={() => navigate(`/tasks/edit/${task.id}`)}
                className="text-xs font-semibold text-primary hover:text-primary-hover underline"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tasks
