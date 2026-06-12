import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import HomeIcon from '@mui/icons-material/Home'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee'
import PersonIcon from '@mui/icons-material/Person'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
  { label: 'Deliveries', icon: <LocalShippingIcon />, path: '/deliveries' },
  { label: 'Earnings', icon: <CurrencyRupeeIcon />, path: '/earnings' },
  { label: 'Profile', icon: <PersonIcon />, path: '/profile' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const currentIndex = NAV_ITEMS.findIndex(item => location.pathname.startsWith(item.path))
  const value = currentIndex >= 0 ? currentIndex : 0

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        zIndex: 50,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(_, newValue) => navigate(NAV_ITEMS[newValue].path)}
        showLabels
        sx={{
          '& .Mui-selected': { color: '#0c831f' },
          '& .MuiBottomNavigationAction-root': { minWidth: 0 },
        }}
      >
        {NAV_ITEMS.map(item => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}
