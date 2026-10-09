import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ROUTES from '../../config/routes'
import Button from '../../components/Button/Button.component'
import IMAGES from '../../config/images.config'

export const Login = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState('EMAIL') // 'EMAIL' | 'OTP'
  const [email, setEmail] = useState('admin@rhglobal.com')
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6'])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [resendTimer, setResendTimer] = useState(30)
  const otpRefs = useRef([])

  // Resend countdown timer
  useEffect(() => {
    let timerId
    if (step === 'OTP' && resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timerId)
  }, [step, resendTimer])

  // Step 1: Send OTP
  const handleSendOtp = (e) => {
    e?.preventDefault()
    if (!email) {
      setError('Please enter a valid work email')
      return
    }
    setError('')
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setStep('OTP')
      setInfoMessage(`Verification code sent to ${email}`)
      setResendTimer(30)
    }, 500)
  }

  // Handle individual OTP digit input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Move to next input box automatically
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace in OTP boxes
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste in OTP
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''))
      otpRefs.current[5]?.focus()
    }
  }

  // Step 2: Verify OTP & Submit
  const handleVerifyOtp = async (e) => {
    e?.preventDefault()
    const enteredOtp = otp.join('')
    if (enteredOtp.length < 6) {
      setError('Please enter the full 6-digit OTP')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      localStorage.setItem('auth_token', 'mock_jwt_token_sample')
      const isAgent = email.toLowerCase().includes('agent') || email.toLowerCase().includes('staff')
      
      const userData = isAgent
        ? {
            id: 'usr_staff_01',
            name: 'sipu Sharma',
            email,
            role: 'AGENT',
            permissions: ['applications:view', 'applications:manage', 'leads:view'],
          }
        : {
            id: 'usr_admin_01',
            name: 'Super Admin',
            email,
            role: 'ADMIN',
            permissions: ['leads:view', 'customers:view', 'visa:view', 'holidays:view', 'reports:view', 'employees:manage', 'roles:manage', 'audit_logs:view', 'settings:manage'],
          }

      localStorage.setItem('user', JSON.stringify(userData))
      
      if (isAgent) {
        navigate(ROUTES.STAFF_DASHBOARD)
      } else {
        navigate(ROUTES.DASHBOARD)
      }
    } catch (err) {
      setError(err?.message || 'Verification failed. Invalid OTP code.')
    } finally {
      setIsLoading(false)
    }
  }

  // Quick Demo fill
  const fillDemoRole = (role) => {
    let demoEmail = 'admin@rhglobal.com'
    if (role === 'AGENT') demoEmail = 'agent@rhglobal.com'
    setEmail(demoEmail)
    setOtp(['1', '2', '3', '4', '5', '6'])
    setStep('OTP')
    setInfoMessage(`Demo OTP code auto-filled for ${demoEmail} (${role === 'AGENT' ? 'Staff Agent' : 'Super Admin'})`)
    setError('')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center lg:justify-end bg-[#0F0E2B] relative p-4 sm:p-6 lg:p-12 overflow-hidden">
      {/* Background Image Element - Crisp & Un-stretched */}
      <img
        src={IMAGES.ADMIN_LOGIN_BG}
        // src={IMAGES.ADMIN_LOGIN_BG1}
        alt="Background Pattern"
        className="absolute inset-0 w-full h-full object-cover object-left-top z-0"
      />

      {/* Right Side Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0F0E2B]/20 to-[#0F0E2B]/80 z-0 pointer-events-none" />

      {/* Hero Welcome Text on Left (Large Screens) */}
      <div className="hidden lg:flex flex-col justify-between absolute left-16 top-12 bottom-12 max-w-xl z-10 text-white">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#E11D2E] to-[#2E2B6E] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#E11D2E]/30">
            RH
          </div>
          <span className="font-bold text-xl tracking-tight text-white">RH Global CRM</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Streamline Travel, Visas & Operations
          </h1>
          <p className="text-base text-[#EEEEFB]/80 leading-relaxed">
            Manage leads, visa applications, customer files, and team workflows in one unified, real-time portal.
          </p>
        </div>

        <div className="text-xs text-[#EEEEFB]/60 border-t border-white/10 pt-4">
          &copy; {new Date().getFullYear()} RH Global Services. All rights reserved.
        </div>
      </div>

      {/* Side-aligned OTP Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0F0E2B]/85 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-[#0F0E2B]/80 my-auto">
        <div className="text-center lg:text-left mb-8">
          <div className="inline-flex lg:hidden h-12 w-12 rounded-2xl bg-gradient-to-br from-[#E11D2E] to-[#2E2B6E] items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-[#E11D2E]/30">
            RH
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {step === 'EMAIL' ? 'Sign In with OTP' : 'Verify OTP Code'}
          </h2>
          <p className="text-xs sm:text-sm text-[#EEEEFB]/75 mt-1">
            {step === 'EMAIL'
              ? 'Enter your work email to receive a 6-digit verification code'
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-[#E11D2E]/20 border border-[#E11D2E]/40 text-[#E11D2E] text-xs font-medium">
            {error}
          </div>
        )}

        {infoMessage && !error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-[#4ADE80]/15 border border-[#4ADE80]/30 text-[#4ADE80] text-xs font-medium flex items-center justify-between">
            <span>{infoMessage}</span>
          </div>
        )}

        {step === 'EMAIL' ? (
          /* STEP 1: EMAIL FORM */
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#EEEEFB]/90 mb-2">
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#E11D2E] focus:ring-2 focus:ring-[#E11D2E]/30 backdrop-blur-md transition-all"
                placeholder="you@rhglobal.com"
              />
            </div>

            <Button type="submit" variant="secondary" fullWidth isLoading={isLoading} size="lg" className="mt-2 py-3">
              Send OTP Code
            </Button>
          </form>
        ) : (
          /* STEP 2: OTP INPUT FORM */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#EEEEFB]/90">
                  6-Digit Verification Code
                </label>
              </div>

              {/* 6 Digit OTP Inputs */}
              <div className="flex items-center justify-between gap-1.5 sm:gap-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl bg-white/10 border border-white/25 text-white focus:outline-none focus:border-[#E11D2E] focus:ring-2 focus:ring-[#E11D2E]/40 transition-all shadow-inner"
                  />
                ))}
              </div>
            </div>

            <Button type="submit" variant="secondary" fullWidth isLoading={isLoading} size="lg" className="py-3">
              Verify & Sign In
            </Button>

            <div className="text-center pt-1">
              {resendTimer > 0 ? (
                <p className="text-xs text-[#EEEEFB]/60">
                  Resend code in <strong className="text-white">{resendTimer}s</strong>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-xs text-[#E11D2E] hover:underline font-semibold cursor-pointer"
                >
                  Resend OTP Code
                </button>
              )}
            </div>
          </form>
        )}

        {/* Demo Fast Logins */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center lg:text-left">
          <p className="text-xs text-[#EEEEFB]/60 mb-3">Quick demo fill:</p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            <button
              type="button"
              onClick={() => fillDemoRole('ADMIN')}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoRole('AGENT')}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
            >
              Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
