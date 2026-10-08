import React from 'react'
import { useNavigate } from 'react-router-dom'
import notFoundSvg from '../../assets/svg/404 Error page not found.svg'
import ROUTES from '../../config/routes'

export const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="relative w-screen h-screen min-h-screen overflow-hidden bg-[#050722] text-white select-none">
      {/* Full-Screen SVG Graphic matching Image 1 */}
      <img
        src={notFoundSvg}
        alt="404 Page Not Found"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Interactive GO HOME Button overlay positioned exactly at the center of the text column (X: 28.51%, Y: 75%) */}
      <div className="absolute left-[28.51%] top-[75%] -translate-x-1/2 -translate-y-1/2 z-30">
        <button
          type="button"
          onClick={handleGoHome}
          className="px-8 py-3 rounded-full bg-[#1d1f56] hover:bg-[#2a2c7a] text-white font-extrabold text-xs sm:text-sm tracking-widest uppercase border border-blue-400/40 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>GO HOME</span>
        </button>
      </div>
    </div>
  )
}

export default NotFound
