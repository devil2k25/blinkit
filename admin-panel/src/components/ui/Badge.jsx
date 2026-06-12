import React from 'react'

const variants = {
  success: 'bg-green-100 text-green-700',
  danger: 'bg-red-100 text-red-700',
  warning: 'bg-yellow-100 text-yellow-700',
  info: 'bg-blue-100 text-blue-700',
  gray: 'bg-gray-100 text-gray-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
}

const statusMap = {
  active: 'success',
  inactive: 'danger',
  approved: 'success',
  pending: 'warning',
  rejected: 'danger',
  available: 'success',
  unavailable: 'gray',
  delivered: 'success',
  cancelled: 'danger',
  confirmed: 'info',
  preparing: 'orange',
  'out for delivery': 'purple',
  admin: 'purple',
  user: 'info',
  vendor: 'orange',
  driver: 'info',
}

export default function Badge({ label, variant, status }) {
  const resolvedVariant = variant || statusMap[status?.toLowerCase()] || 'gray'
  const classes = variants[resolvedVariant] || variants.gray

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {label || status}
    </span>
  )
}
