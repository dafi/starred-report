import React from 'react'

export function cn(...values) {
  return values.filter(Boolean).join(' ')
}

export function Button({ className = '', variant = 'default', ...props }) {
  return <button className={cn('ui-button', `ui-button-${variant}`, className)} {...props} />
}

export function Input({ className = '', ...props }) {
  return <input className={cn('ui-input', className)} {...props} />
}

export function Card({ className = '', ...props }) {
  return <section className={cn('ui-card', className)} {...props} />
}

export function CardHeader({ className = '', ...props }) {
  return <div className={cn('ui-card-header', className)} {...props} />
}

export function CardTitle({ className = '', ...props }) {
  return <h2 className={cn('ui-card-title', className)} {...props} />
}

export function CardDescription({ className = '', ...props }) {
  return <p className={cn('ui-card-description', className)} {...props} />
}

export function CardContent({ className = '', ...props }) {
  return <div className={cn('ui-card-content', className)} {...props} />
}

export function Label({ className = '', ...props }) {
  return <label className={cn('ui-label', className)} {...props} />
}

export function Progress({ value = 0 }) {
  return (
    <div className="ui-progress" aria-hidden="true">
      <div className="ui-progress-bar" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

export function Table({ className = '', ...props }) {
  return <table className={cn('ui-table', className)} {...props} />
}

export function Badge({ className = '', tone = 'default', ...props }) {
  return <span className={cn('ui-badge', `ui-badge-${tone}`, className)} {...props} />
}
