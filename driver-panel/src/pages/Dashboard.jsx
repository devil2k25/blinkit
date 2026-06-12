import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_DELIVERIES, WEEKLY_EARNINGS } from '../utils/mockData'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Avatar from '@mui/material/Avatar'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import InventoryIcon from '@mui/icons-material/Inventory'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import StarIcon from '@mui/icons-material/Star'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import NavigationIcon from '@mui/icons-material/Navigation'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

export default function Dashboard() {
  const { user, isOnline, toggleOnline, activeDelivery, setActiveDelivery } = useAuth()
  const navigate = useNavigate()
  const [accepting, setAccepting] = useState(null)

  const available = MOCK_DELIVERIES.filter(d => d.status === 'available')
  const completed = MOCK_DELIVERIES.filter(d => d.status === 'completed')

  const handleAccept = (delivery) => {
    setAccepting(delivery.id)
    setTimeout(() => {
      setActiveDelivery(delivery)
      setAccepting(null)
      navigate(`/deliveries/${delivery.id}`)
    }, 800)
  }

  const STATS = [
    { label: "Today's Deliveries", value: completed.length, icon: <InventoryIcon sx={{ fontSize: 18, color: '#2563eb' }} />, bg: '#eff6ff' },
    { label: "Today's Earnings", value: '₹650', icon: <CurrencyRupeeIcon sx={{ fontSize: 18, color: '#0c831f' }} />, bg: '#f0fdf4' },
    { label: 'Avg Time', value: '13 min', icon: <AccessTimeIcon sx={{ fontSize: 18, color: '#d97706' }} />, bg: '#fefce8' },
    { label: 'Your Rating', value: `${user?.rating || 4.8}★`, icon: <StarIcon sx={{ fontSize: 18, color: '#7c3aed' }} />, bg: '#faf5ff' },
  ]

  return (
    <Box sx={{ p: 2, pb: '80px', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Online Toggle Card */}
      <Card>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>Your status</Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: isOnline ? '#0c831f' : '#6b7280' }}
            >
              {isOnline ? 'You are Online' : 'You are Offline'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af' }}>
              {isOnline ? 'Ready to receive orders' : 'Go online to accept deliveries'}
            </Typography>
          </Box>
          <Switch
            checked={isOnline}
            onChange={toggleOnline}
            color="primary"
            sx={{ flexShrink: 0 }}
          />
        </CardContent>
      </Card>

      {/* Active Delivery Banner */}
      {activeDelivery && (
        <Box
          onClick={() => navigate(`/deliveries/${activeDelivery.id}`)}
          sx={{
            bgcolor: '#0c831f',
            borderRadius: 3,
            p: 2,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(12,131,31,0.3)',
            '&:active': { transform: 'scale(0.98)' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <InventoryIcon sx={{ fontSize: 16, color: '#fff' }} />
              </Avatar>
              <Typography sx={{ color: '#fff', fontWeight: 700 }}>Active Delivery</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{activeDelivery.orderId}</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>{activeDelivery.delivery.customerName}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{activeDelivery.delivery.address}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
            <Typography sx={{ color: '#f8c200', fontWeight: 700 }}>₹{activeDelivery.earnings}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <NavigationIcon sx={{ fontSize: 14, color: '#fff' }} />
              <Typography variant="body2" sx={{ color: '#fff' }}>Continue</Typography>
              <ChevronRightIcon sx={{ fontSize: 16, color: '#fff' }} />
            </Box>
          </Box>
        </Box>
      )}

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        {STATS.map(({ label, value, icon, bg }) => (
          <Card key={label}>
            <CardContent sx={{ p: '12px !important' }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                {icon}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', lineHeight: 1 }}>{value}</Typography>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>{label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Weekly Chart */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1f2937', mb: 2 }}>This Week</Typography>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={WEEKLY_EARNINGS} barSize={20}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v) => [`₹${v}`, 'Earnings']}
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="amount" fill="#0c831f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Available Orders */}
      {isOnline && (
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1f2937', mb: 1.5 }}>
            Available Orders ({available.length})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {available.slice(0, 3).map((delivery) => (
              <Card key={delivery.id}>
                <CardContent sx={{ p: '12px !important' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1f2937' }}>{delivery.orderId}</Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>{delivery.estimatedTime} · {delivery.distance}</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: '#0c831f' }}>₹{delivery.earnings}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#0c831f' }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#4b5563' }}>{delivery.pickup.storeName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444' }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#4b5563' }}>{delivery.delivery.address}</Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    onClick={() => handleAccept(delivery)}
                    disabled={accepting === delivery.id}
                  >
                    {accepting === delivery.id ? 'Accepting...' : 'Accept Order'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {!isOnline && (
        <Card>
          <CardContent sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 40, mb: 1.5 }}>😴</Typography>
            <Typography variant="body1" sx={{ color: '#4b5563', fontWeight: 600 }}>You're offline</Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af' }}>Go online to start accepting delivery orders</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
