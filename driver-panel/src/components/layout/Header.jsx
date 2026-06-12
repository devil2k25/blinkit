import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Switch from '@mui/material/Switch'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { user, isOnline, toggleOnline, todayEarnings } = useAuth()

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: '#1a1a2e', flexShrink: 0, height: 70, justifyContent: 'center' }}
    >
      <Toolbar sx={{ minHeight: '70px !important', px: 2, gap: 1 }}>
        {/* Left: Logo + Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: '#0c831f',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            B
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
            {user?.name || 'Driver'}
          </Typography>
        </Box>

        {/* Center: Online/Offline toggle */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: isOnline ? '#0c831f' : '#555',
            borderRadius: 20,
            px: 1.5,
            py: 0.5,
            cursor: 'pointer',
          }}
          onClick={toggleOnline}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#fff',
              opacity: isOnline ? 1 : 0.6,
            }}
          />
          <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: 12 }}>
            {isOnline ? 'Online' : 'Offline'}
          </Typography>
        </Box>

        {/* Right: Earnings */}
        <Box sx={{ textAlign: 'right', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Typography sx={{ color: '#f8c200', fontWeight: 700, fontSize: 15, lineHeight: 1 }}>
            ₹{todayEarnings}
          </Typography>
          <Typography sx={{ color: '#9ca3af', fontSize: 11, mt: 0.25 }}>Today</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
