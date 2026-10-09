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
    <div className="relative w-screen h-screen min-h-screen overflow-hidden bg-gradient-to-br from-[#eaf2f9] via-[#f2f7fc] to-[#d8e6f3] select-none font-sans">
      {/* -------------------------------------------------------------------- */}
      {/* 1. SOFT AMBIENT LIGHT GLOWS (Matching Light Theme)                  */}
      {/* -------------------------------------------------------------------- */}
      {/* Subtle brand red accent glow in top-left */}
      <div className="absolute top-[10%] left-[-5%] w-[35vw] h-[35vw] rounded-full bg-[#E11D2E]/8 blur-[120px] pointer-events-none" />

      {/* Soft royal indigo glow in bottom-left */}
      <div className="absolute bottom-[-10%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-[#2E2B6E]/10 blur-[130px] pointer-events-none" />

      {/* -------------------------------------------------------------------- */}
      {/* 2. MAIN SVG GRAPHIC (Full Screen Artwork)                             */}
      {/* -------------------------------------------------------------------- */}
      <img
        src={notFoundSvg}
        alt="404 Page Not Found"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10 filter drop-shadow-sm"
      />

      {/* -------------------------------------------------------------------- */}
      {/* 3. CLEAN FLOATING BRAND BADGES & HEADER                              */}
      {/* -------------------------------------------------------------------- */}
      {/* Top Left: RH CRM Logo Badge */}
      <div className="absolute top-6 left-6 sm:left-10 z-40 pointer-events-auto">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/85 border border-slate-200/80 backdrop-blur-md shadow-md shadow-slate-900/5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E11D2E] to-[#2E2B6E] p-[1px] shadow-sm">
            <div className="w-full h-full rounded-[7px] bg-[#0F0E2B] flex items-center justify-center font-black text-[10px] text-white tracking-tighter">
              RH
            </div>
          </div>
          <span className="font-bold text-xs tracking-wider text-[#0F0E2B]">
            RH GLOBAL <span className="text-[#E11D2E]">CRM</span>
          </span>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 4. INTERACTIVE GO HOME BUTTON (Aligned X: 28.51%, Y: 75%)             */}
      {/* -------------------------------------------------------------------- */}
      <div className="absolute left-[28.51%] top-[75%] -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="relative group">
          {/* Ambient Red Glow under Button */}
          <div className="absolute -inset-1 rounded-full bg-[#E11D2E] opacity-35 blur-md group-hover:opacity-75 group-hover:blur-lg transition-all duration-300" />

          <button
            type="button"
            onClick={handleGoHome}
            className="relative px-9 py-3.5 rounded-full bg-gradient-to-r from-[#181445] via-[#2E2B6E] to-[#E11D2E] hover:from-[#E11D2E] hover:via-[#C51323] hover:to-[#181445] text-white font-extrabold text-xs sm:text-sm tracking-widest uppercase border border-white/40 shadow-[0_4px_22px_rgba(225,29,46,0.4)] hover:shadow-[0_6px_30px_rgba(225,29,46,0.7)] hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95 flex items-center gap-2.5 overflow-hidden"
          >
            {/* Shimmer Light Reflection Sweep on Hover */}
            <span className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />

            {/* Home Icon */}
            <svg 
              className="w-4 h-4 text-white group-hover:-translate-y-0.5 group-hover:scale-110 transition-transform duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>

            {/* Button Label */}
            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">GO HOME</span>

            {/* Arrow Right Indicator on Hover */}
            <svg 
              className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
