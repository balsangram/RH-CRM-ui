import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Smooth Count-Up Animation Component
const CountUp = ({ value, duration = 1200 }) => {
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    if (value === undefined || value === null) {
      setDisplayValue('0')
      return
    }

    const strValue = String(value)
    // Extract numeric portion (handles strings like "3,842", "+12%", etc.)
    const numericMatch = strValue.match(/[\d,.]+/)
    if (!numericMatch) {
      setDisplayValue(strValue)
      return
    }

    const rawNumStr = numericMatch[0].replace(/,/g, '')
    const targetNum = parseFloat(rawNumStr)
    if (isNaN(targetNum)) {
      setDisplayValue(strValue)
      return
    }

    const hasCommas = strValue.includes(',') || targetNum >= 1000
    const prefix = strValue.slice(0, numericMatch.index)
    const suffix = strValue.slice(numericMatch.index + numericMatch[0].length)

    let startTime = null
    let animationFrameId = null

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // Smooth ease-out cubic curve
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const currentNum = Math.floor(easedProgress * targetNum)

      const formattedNum = hasCommas ? currentNum.toLocaleString('en-US') : String(currentNum)
      setDisplayValue(`${prefix}${formattedNum}${suffix}`)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        const finalFormatted = hasCommas ? targetNum.toLocaleString('en-US') : String(targetNum)
        setDisplayValue(`${prefix}${finalFormatted}${suffix}`)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [value, duration])

  return <span>{displayValue}</span>
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  change,
  isUp = true,
  viewAllLink,
  to,
  onViewAll,
  onClick,
  color = 'primary',
  className = '',
}) => {
  const destination = viewAllLink || to
  const handleClick = onClick || onViewAll

  const colorMap = {
    primary: {
      iconBg: 'bg-[#2E2B6E]/10 text-[#2E2B6E]',
      borderHover: 'hover:border-[#2E2B6E]/40 hover:shadow-md hover:-translate-y-0.5',
      arrowColor: 'group-hover:text-[#2E2B6E]',
    },
    red: {
      iconBg: 'bg-[#E11D2E]/10 text-[#E11D2E]',
      borderHover: 'hover:border-[#E11D2E]/40 hover:shadow-md hover:-translate-y-0.5',
      arrowColor: 'group-hover:text-[#E11D2E]',
    },
    emerald: {
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      borderHover: 'hover:border-emerald-500/40 hover:shadow-md hover:-translate-y-0.5',
      arrowColor: 'group-hover:text-emerald-600',
    },
    indigo: {
      iconBg: 'bg-indigo-500/10 text-indigo-600',
      borderHover: 'hover:border-indigo-500/40 hover:shadow-md hover:-translate-y-0.5',
      arrowColor: 'group-hover:text-indigo-600',
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-600',
      borderHover: 'hover:border-amber-500/40 hover:shadow-md hover:-translate-y-0.5',
      arrowColor: 'group-hover:text-amber-600',
    },
  }

  const activeTheme = colorMap[color] || colorMap.primary

  const cardContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={`p-1 rounded-md flex items-center justify-center shrink-0 ${activeTheme.iconBg}`}>
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider leading-tight truncate">{title}</p>
              {subtitle && <p className="text-[9px] text-muted/70 leading-tight truncate">{subtitle}</p>}
            </div>
          </div>

          {/* Navigation arrow indicator on hover */}
          {(destination || handleClick) && (
            <div className={`text-slate-400 ${activeTheme.arrowColor} transition-all duration-200 transform group-hover:translate-x-0.5 shrink-0`}>
              <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Clean Compact Aligned Metric Counter Number */}
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-base sm:text-lg font-bold text-main tracking-tight leading-none">
            <CountUp value={value} />
          </span>
        </div>
      </div>
    </div>
  )

  const baseCardStyles = `group relative bg-surface rounded-lg p-2 sm:p-2.5 border border-border shadow-2xs transition-all duration-200 ${
    destination || handleClick ? 'cursor-pointer select-none block' : ''
  } ${activeTheme.borderHover} ${className}`

  if (destination) {
    return (
      <Link to={destination} className={baseCardStyles} title={`Go to ${title}`}>
        {cardContent}
      </Link>
    )
  }

  if (handleClick) {
    return (
      <button type="button" onClick={handleClick} className={`text-left w-full ${baseCardStyles}`} title={`Go to ${title}`}>
        {cardContent}
      </button>
    )
  }

  return <div className={baseCardStyles}>{cardContent}</div>
}

export default StatCard
