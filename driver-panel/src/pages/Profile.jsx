import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import EditIcon from '@mui/icons-material/Edit'
import LogoutIcon from '@mui/icons-material/Logout'
import StarIcon from '@mui/icons-material/Star'
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PhoneIcon from '@mui/icons-material/Phone'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || 'Rajesh Kumar')
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210')

  const handleSave = () => {
    setEditing(false)
    toast.success('Profile updated!')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const stats = [
    { label: 'Total Deliveries', value: user?.totalDeliveries || 1247 },
    { label: 'Rating', value: `${user?.rating || 4.8}★` },
    { label: 'This Month', value: '₹18,240' },
  ]

  const vehicleDetails = [
    { icon: <TwoWheelerIcon sx={{ fontSize: 18, color: '#6b7280' }} />, label: 'Vehicle Type', value: user?.vehicle || 'Bike' },
    { icon: <VerifiedUserIcon sx={{ fontSize: 18, color: '#6b7280' }} />, label: 'Vehicle Number', value: user?.vehicleNumber || 'DL 5S AB 1234' },
    { icon: <VerifiedUserIcon sx={{ fontSize: 18, color: '#6b7280' }} />, label: 'License Number', value: user?.licenseNumber || 'DL-1420110012345' },
  ]

  const settingsItems = [
    { icon: <NotificationsIcon sx={{ fontSize: 18, color: '#6b7280' }} />, label: 'Notifications', action: () => toast('Settings coming soon') },
    { icon: <VerifiedUserIcon sx={{ fontSize: 18, color: '#6b7280' }} />, label: 'Privacy & Security', action: () => toast('Coming soon') },
    { icon: <PhoneIcon sx={{ fontSize: 18, color: '#6b7280' }} />, label: 'Support', action: () => toast('Call: 1800-XXX-XXXX') },
  ]

  return (
    <Box sx={{ p: 2, pb: '80px', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Profile Hero Card */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1f2937, #111827)',
          borderRadius: 3,
          p: 2.5,
          color: '#fff',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={() => setEditing(e => !e)}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(255,255,255,0.15)',
            color: '#fff',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
          }}
        >
          <EditIcon sx={{ fontSize: 14 }} />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: '#0c831f',
              fontSize: 28,
              fontWeight: 700,
              borderRadius: 3,
            }}
          >
            {(user?.name || 'R')[0]}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
              {user?.name || 'Rajesh Kumar'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#d1d5db' }}>
              {user?.phone || '+91 98765 43210'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <StarIcon sx={{ fontSize: 14, color: '#f8c200' }} />
              <Typography variant="body2" sx={{ color: '#f8c200', fontWeight: 600 }}>
                {user?.rating || 4.8}
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>rating</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
          {stats.map(s => (
            <Box key={s.label} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1.25, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#fff' }}>{s.value}</Typography>
              <Typography variant="caption" sx={{ color: '#d1d5db' }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Edit Form */}
      {editing && (
        <Card>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1f2937', mb: 2 }}>Edit Profile</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                label="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                label="Phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                fullWidth
                size="small"
              />
              <Button variant="contained" fullWidth onClick={handleSave} sx={{ py: 1.25 }}>
                Save Changes
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Vehicle Details */}
      <Card>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1f2937', mb: 1.5 }}>Vehicle Details</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {vehicleDetails.map(({ icon, label, value }) => (
              <Box
                key={label}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.25, bgcolor: '#f9fafb', borderRadius: 2 }}
              >
                {icon}
                <Box>
                  <Typography variant="caption" sx={{ color: '#6b7280' }}>{label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>{value}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card sx={{ overflow: 'hidden' }}>
        {settingsItems.map(({ icon, label, action }, index) => (
          <Box key={label}>
            <Box
              component="button"
              onClick={action}
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.75,
                border: 'none',
                bgcolor: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                '&:hover': { bgcolor: '#f9fafb' },
              }}
            >
              {icon}
              <Typography variant="body2" sx={{ color: '#374151' }}>{label}</Typography>
            </Box>
            {index < settingsItems.length - 1 && <Divider />}
          </Box>
        ))}
      </Card>

      {/* Logout */}
      <Button
        variant="contained"
        fullWidth
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{
          py: 1.5,
          bgcolor: '#fef2f2',
          color: '#dc2626',
          fontWeight: 700,
          boxShadow: 'none',
          '&:hover': { bgcolor: '#fee2e2', boxShadow: 'none' },
        }}
      >
        Sign Out
      </Button>
    </Box>
  )
}
