import React from 'react'

interface GlassCardProps {
  className?: string
  children: React.ReactNode
}

const GlassCard: React.FC<GlassCardProps> = ({ className = '', children }) => {
  return (
    <div className={`glass rounded-2xl ${className}`}>
      {children}
    </div>
  )
}

export default GlassCard


