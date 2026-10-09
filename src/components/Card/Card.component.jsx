import React from 'react'
import StatCard from './StatCard.component'

export const Card = ({ children, className = '' }) => (
  <div className={`relative bg-surface rounded-xl p-3 sm:p-4 border border-border shadow-xs ${className}`}>
    {children}
  </div>
)

export { StatCard }
export default Card