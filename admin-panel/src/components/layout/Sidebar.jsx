import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import StoreIcon from '@mui/icons-material/Store'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import InventoryIcon from '@mui/icons-material/Inventory'
import GridViewIcon from '@mui/icons-material/GridView'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import BoltIcon from '@mui/icons-material/Bolt'
import { useAuth } from '../../context/AuthContext'

const DRAWER_WIDTH = 240

const navItems = [
  { to: '/dashboard', icon: DashboardIcon, label: 'Dashboard' },
  { to: '/users', icon: PeopleIcon, label: 'Users' },
  { to: '/vendors', icon: StoreIcon, label: 'Vendors' },
  { to: '/drivers', icon: LocalShippingIcon, label: 'Drivers' },
  { to: '/products', icon: InventoryIcon, label: 'Products' },
  { to: '/categories', icon: GridViewIcon, label: 'Categories' },
  { to: '/orders', icon: ShoppingBagIcon, label: 'Orders' },
  { to: '/settings', icon: SettingsIcon, label: 'Settings' },
]

function SidebarContent({ setMobileOpen }) {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNav = (to) => {
    navigate(to)
    if (setMobileOpen) setMobileOpen(false)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#1a2035', color: 'white' }}>
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ width: 36, height: 36, bgcolor: '#f8c200', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BoltIcon sx={{ color: '#1a2035', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="body1" fontWeight={700} color="white" lineHeight={1.2}>blinkit</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Admin Panel</Typography>
        </Box>
      </Box>

      {/* Nav */}
      <List sx={{ flex: 1, px: 1, py: 1.5, overflowY: 'auto' }}>
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
          return (
            <ListItem key={to} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNav(to)}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'rgba(255,255,255,0.08)',
                    color: 'white',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      {/* User + Logout */}
      <Box sx={{ px: 1, py: 1.5, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', mb: 0.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13, fontWeight: 700 }}>
            {(admin?.avatar || admin?.name?.[0] || 'A').toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={500} color="white" noWrap>{admin?.name || 'Admin'}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }} noWrap>{admin?.email || ''}</Typography>
          </Box>
        </Box>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            px: 2,
            py: 1,
            color: 'rgba(255,255,255,0.55)',
            '&:hover': { bgcolor: 'rgba(239,68,68,0.15)', color: '#f87171' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14 }} />
        </ListItemButton>
      </Box>
    </Box>
  )
}

export default function Sidebar({ mobileOpen, setMobileOpen, drawerWidth = DRAWER_WIDTH }) {
  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: '#1a2035' },
        }}
      >
        <SidebarContent setMobileOpen={setMobileOpen} />
      </Drawer>

      {/* Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: '#1a2035', position: 'relative', height: '100%' },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </>
  )
}
