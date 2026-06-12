import React from 'react'
import Chip from '@mui/material/Chip'

const statusMap = {
  active: 'success',
  inactive: 'error',
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
  available: 'success',
  unavailable: 'default',
  delivered: 'success',
  cancelled: 'error',
  confirmed: 'info',
  preparing: 'warning',
  'out for delivery': 'info',
  'out_for_delivery': 'info',
  admin: 'secondary',
  user: 'info',
  vendor: 'warning',
  driver: 'info',
}

export default function Badge({ label, variant, status }) {
  const resolvedColor = variant || statusMap[status?.toLowerCase()] || 'default'

  return (
    <Chip
      label={label || status}
      color={resolvedColor}
      size="small"
      sx={{ fontWeight: 600, fontSize: 11, textTransform: 'capitalize' }}
    />
  )
}
