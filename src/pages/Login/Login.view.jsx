import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ROUTES from '../../config/routes'
import Button from '../../components/Button/Button.component'

export const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@rhglobal.com')
  const [password, setPassword] = useState('password123')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Simulate or execute auth login
      localStorage.setItem('auth_token', 'mock_jwt_token_sample')
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 'usr_01',
          name: 'Sarah Connor',
          email,
          role: 'ADMIN',
          permissions: ['*'],
        })
      )
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      setError(err?.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoRole = (role) => {
    if (role === 'ADMIN') {
      setEmail('admin@rhglobal.com')
      setPassword('admin123')
    } else if (role === 'AGENT') {
      setEmail('agent@rhglobal.com')
      setPassword('agent123')
    } else {
      setEmail('customer@rhglobal.com')
      setPassword('customer123')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-primary items-center justify-center text-white font-bold text-xl mb-3 shadow-lg shadow-primary/30">
            RH
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">RH Global CRM</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to your enterprise workspace</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Work Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@rhglobal.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <a href="#forgot" className="text-xs text-primary hover:text-primary-hover">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={isLoading} size="lg">
            Sign In
          </Button>
        </form>

        {/* Demo Fast Logins */}
        <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-400 mb-3">Quick demo fill:</p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => fillDemoRole('ADMIN')}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-700/70 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoRole('AGENT')}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-700/70 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Agent
            </button>
            <button
              type="button"
              onClick={() => fillDemoRole('CUSTOMER')}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-700/70 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
