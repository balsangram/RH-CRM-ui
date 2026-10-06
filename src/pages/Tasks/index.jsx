import React, { useState } from 'react'
import Button from '../../components/Button'

export const Tasks = () => {
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
          <h1 className="text-2xl font-bold text-slate-900">Tasks & Follow-ups</h1>
          <p className="text-sm text-slate-500 mt-1">Track case deadlines, client calls, and visa milestone actions</p>
        </div>
        <Button variant="primary" size="md">+ Create Task</Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div>
                <p className={`text-sm font-medium ${task.done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {task.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Assigned to: {task.assignee} &bull; Due: {task.dueDate}</p>
              </div>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                task.priority === 'High'
                  ? 'bg-rose-50 text-rose-700'
                  : task.priority === 'Medium'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {task.priority} Priority
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tasks
