import React from 'react'
import StatCard from './StatCard.component'

export const Card = ({ children, className = '' }) => (
  <div className={`relative bg-surface rounded-2xl p-6 border border-border shadow-xs ${className}`}>
    {children}
  </div>
)

export { StatCard }
export default Card