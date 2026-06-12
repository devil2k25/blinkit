import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PhoneIcon from '@mui/icons-material/Phone'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [phone, setPhone] = useState('9876543210')
  const [password, setPassword] = useState('driver123')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(phone, password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a2e',
        px: 3,
        py: 6,
      }}
    >
      {/* Logo */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#0c831f',
            mb: 2,
          }}
        >
          <LocalShippingIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
          Blinkit Driver
        </Typography>
        <Typography variant="body2" sx={{ color: '#9ca3af', mt: 0.5 }}>
          Deliver fast, earn more
        </Typography>
      </Box>

      {/* Form Card */}
      <Card sx={{ width: '100%', borderRadius: 3, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', mb: 3 }}>
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon fontSize="small" sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPass(v => !v)} edge="end">
                      {showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, fontSize: 16, fontWeight: 700, mt: 1 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f9fafb', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', textAlign: 'center' }}>
              Demo: any phone + password
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
