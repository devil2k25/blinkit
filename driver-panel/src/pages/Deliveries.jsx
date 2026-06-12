import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_DELIVERIES } from '../utils/mockData'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Alert from '@mui/material/Alert'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

const STATUS_TABS = ['Available', 'Active', 'Completed', 'Cancelled']

const statusChipColor = {
  available: { bgcolor: '#dbeafe', color: '#1d4ed8' },
  active: { bgcolor: '#dcfce7', color: '#15803d' },
  completed: { bgcolor: '#f3f4f6', color: '#4b5563' },
  cancelled: { bgcolor: '#fee2e2', color: '#dc2626' },
}

function DeliveryCard({ delivery, onAccept, onView, accepting }) {
  const chipStyle = statusChipColor[delivery.status] || {}
  return (
    <Card>
      <CardContent sx={{ p: '12px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1f2937' }}>{delivery.orderId}</Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af' }}>{delivery.estimatedTime} · {delivery.distance}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontWeight: 700, color: '#0c831f' }}>₹{delivery.earnings}</Typography>
            <Chip
              label={delivery.status}
              size="small"
              sx={{
                height: 20,
                fontSize: 11,
                fontWeight: 600,
                bgcolor: chipStyle.bgcolor,
                color: chipStyle.color,
                mt: 0.25,
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25 }}>
              <InventoryIcon sx={{ fontSize: 10, color: '#0c831f' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', display: 'block' }}>{delivery.pickup.storeName}</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>{delivery.pickup.address}</Typography>
            </Box>
          </Box>
          <Box sx={{ ml: '9px', width: 1, height: 12, bgcolor: '#e5e7eb' }} />
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25 }}>
              <LocationOnIcon sx={{ fontSize: 10, color: '#ef4444' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', display: 'block' }}>{delivery.delivery.customerName}</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>{delivery.delivery.address}</Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 1.5 }}>
          Items: {delivery.items.join(', ')}
        </Typography>

        {delivery.status === 'available' && (
          <Button
            variant="contained"
            fullWidth
            size="small"
            onClick={() => onAccept(delivery)}
            disabled={accepting === delivery.id}
          >
            {accepting === delivery.id ? 'Accepting...' : 'Accept Order'}
          </Button>
        )}
        {delivery.status === 'active' && (
          <Button
            variant="contained"
            fullWidth
            size="small"
            onClick={() => onView(delivery)}
            sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}
          >
            View Active Delivery
          </Button>
        )}
        {delivery.status === 'completed' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <CheckCircleIcon sx={{ fontSize: 14, color: '#22c55e' }} />
            <Typography variant="caption" sx={{ color: '#6b7280' }}>Delivered successfully</Typography>
          </Box>
        )}
        {delivery.status === 'cancelled' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <CancelIcon sx={{ fontSize: 14, color: '#f87171' }} />
            <Typography variant="caption" sx={{ color: '#6b7280' }}>Delivery cancelled</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default function Deliveries() {
  const navigate = useNavigate()
  const { isOnline, setActiveDelivery } = useAuth()
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [accepting, setAccepting] = useState(null)

  const activeTab = STATUS_TABS[activeTabIndex]

  const filtered = MOCK_DELIVERIES.filter(d => {
    const tab = activeTab.toLowerCase()
    if (tab === 'available') return d.status === 'available'
    if (tab === 'active') return d.status === 'active'
    if (tab === 'completed') return d.status === 'completed'
    if (tab === 'cancelled') return d.status === 'cancelled'
    return true
  })

  const handleAccept = (delivery) => {
    setAccepting(delivery.id)
    setTimeout(() => {
      setActiveDelivery(delivery)
      setAccepting(null)
      navigate(`/deliveries/${delivery.id}`)
    }, 800)
  }

  const handleView = (delivery) => {
    navigate(`/deliveries/${delivery.id}`)
  }

  return (
    <Box sx={{ p: 2, pb: '80px' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', mb: 2 }}>Deliveries</Typography>

      {/* Tabs */}
      <Tabs
        value={activeTabIndex}
        onChange={(_, v) => setActiveTabIndex(v)}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          mb: 2,
          minHeight: 36,
          '& .MuiTabs-indicator': { display: 'none' },
          '& .MuiTab-root': {
            minHeight: 36,
            py: 0.5,
            px: 2,
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            color: '#6b7280',
            textTransform: 'none',
            minWidth: 'unset',
            mr: 0.5,
          },
          '& .Mui-selected': {
            color: '#fff !important',
            bgcolor: '#0c831f',
            borderRadius: 20,
          },
        }}
      >
        {STATUS_TABS.map((tab, i) => (
          <Tab
            key={tab}
            label={`${tab} (${MOCK_DELIVERIES.filter(d => d.status === tab.toLowerCase()).length})`}
          />
        ))}
      </Tabs>

      {!isOnline && activeTab === 'Available' && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
          You're offline — go online to see available orders
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ fontSize: 40, mb: 1.5 }}>📦</Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>No {activeTab.toLowerCase()} deliveries</Typography>
          </Box>
        ) : (
          filtered.map(delivery => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onAccept={handleAccept}
              onView={handleView}
              accepting={accepting}
            />
          ))
        )}
      </Box>
    </Box>
  )
}
