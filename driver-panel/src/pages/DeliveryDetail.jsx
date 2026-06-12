import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_DELIVERIES, ACTIVE_DELIVERY } from '../utils/mockData'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import PhoneIcon from '@mui/icons-material/Phone'
import NavigationIcon from '@mui/icons-material/Navigation'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import toast from 'react-hot-toast'

const STEPS = [
  { id: 0, label: 'Order Assigned', description: 'Head to pickup location' },
  { id: 1, label: 'Reached Store', description: 'Pick up the order' },
  { id: 2, label: 'Order Picked Up', description: 'Start delivery' },
  { id: 3, label: 'Out for Delivery', description: 'Deliver to customer' },
  { id: 4, label: 'Delivered', description: 'Order complete!' },
]

export default function DeliveryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { activeDelivery, clearActiveDelivery } = useAuth()

  const delivery = activeDelivery?.id === id
    ? activeDelivery
    : MOCK_DELIVERIES.find(d => d.id === id) || ACTIVE_DELIVERY

  const [step, setStep] = useState(delivery?.currentStep ?? 0)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const correctOtp = delivery?.otp || '4521'

  if (!delivery) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', py: 10 }}>
        <Typography sx={{ color: '#6b7280' }}>Delivery not found</Typography>
        <Button onClick={() => navigate('/deliveries')} sx={{ mt: 2, color: '#0c831f' }}>
          Go Back
        </Button>
      </Box>
    )
  }

  const handleNext = () => {
    if (step === 3) {
      setShowOtp(true)
      return
    }
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
      toast.success(STEPS[step + 1].label)
    }
  }

  const handleVerifyOtp = () => {
    if (otp === correctOtp) {
      setStep(4)
      setShowOtp(false)
      toast.success('Delivery completed! 🎉')
      setTimeout(() => {
        clearActiveDelivery?.()
        navigate('/dashboard')
      }, 2000)
    } else {
      setOtpError('Incorrect OTP. Try: ' + correctOtp)
    }
  }

  const handleOtpChange = (index, value) => {
    const val = value.replace(/\D/g, '')
    const chars = otp.split('')
    chars[index] = val
    const newOtp = chars.join('').slice(0, 4)
    setOtp(newOtp)
    setOtpError('')
  }

  const buttonLabels = ['Reached Store', 'Order Picked Up', 'Out for Delivery', 'Mark Delivered']

  return (
    <Box sx={{ p: 2, pb: '80px', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#6b7280' }}>Active Delivery</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>{delivery.orderId}</Typography>
        </Box>
        <Chip
          label={`₹${delivery.earnings}`}
          sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700 }}
        />
      </Box>

      {/* Progress Stepper */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1f2937', mb: 2 }}>Delivery Progress</Typography>
          <Stepper activeStep={step} orientation="vertical" sx={{
            '& .MuiStepConnector-line': { minHeight: 24 },
            '& .MuiStepLabel-label': { fontWeight: 600 },
          }}>
            {STEPS.map((s, i) => (
              <Step key={s.id} completed={i < step}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: i <= step ? '#1f2937' : '#9ca3af',
                      fontWeight: i === step ? 700 : 500,
                    },
                    '& .MuiStepIcon-root': {
                      color: i < step ? '#0c831f' : i === step ? '#0c831f' : '#e5e7eb',
                    },
                    '& .MuiStepIcon-text': { fill: '#fff' },
                  }}
                >
                  {s.label}
                  {i === step && (
                    <Typography variant="caption" sx={{ color: '#0c831f', display: 'block' }}>{s.description}</Typography>
                  )}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Pickup Info */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <InventoryIcon sx={{ fontSize: 16, color: '#0c831f' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1f2937' }}>Pickup</Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>{delivery.pickup.storeName}</Typography>
          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mt: 0.5 }}>{delivery.pickup.address}</Typography>
          <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mt: 0.5 }}>{delivery.pickup.distance} away</Typography>
          <Button
            startIcon={<NavigationIcon />}
            size="small"
            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(delivery.pickup.address)}`)}
            sx={{ mt: 1.5, color: '#2563eb', bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' }, borderRadius: 2, px: 2 }}
          >
            Navigate to Store
          </Button>
        </CardContent>
      </Card>

      {/* Delivery Info */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <LocationOnIcon sx={{ fontSize: 16, color: '#ef4444' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1f2937' }}>Delivery</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>{delivery.delivery.customerName}</Typography>
              <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mt: 0.5 }}>{delivery.delivery.address}</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mt: 0.5 }}>{delivery.delivery.distance} away</Typography>
            </Box>
            <IconButton
              component="a"
              href={`tel:${delivery.delivery.phone}`}
              sx={{ width: 40, height: 40, bgcolor: '#dcfce7' }}
            >
              <PhoneIcon sx={{ fontSize: 18, color: '#0c831f' }} />
            </IconButton>
          </Box>
          <Button
            startIcon={<NavigationIcon />}
            size="small"
            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(delivery.delivery.address)}`)}
            sx={{ mt: 1.5, color: '#2563eb', bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' }, borderRadius: 2, px: 2 }}
          >
            Navigate to Customer
          </Button>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>Order Items</Typography>
          <Box component="ul" sx={{ pl: 0, m: 0, listStyle: 'none' }}>
            {delivery.items.map((item, i) => (
              <Box component="li" key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4ade80', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: '#4b5563' }}>{item}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* OTP Dialog */}
      <Dialog
        open={showOtp}
        onClose={() => { setShowOtp(false); setOtp(''); setOtpError('') }}
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: 0,
            m: 0,
            width: '100%',
            maxWidth: 430,
            borderRadius: '24px 24px 0 0',
            p: 1,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18, pb: 0.5 }}>Enter Delivery OTP</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
            Ask the customer for their 4-digit OTP to confirm delivery
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
            {[0, 1, 2, 3].map(i => (
              <TextField
                key={i}
                type="tel"
                value={otp[i] || ''}
                onChange={e => {
                  handleOtpChange(i, e.target.value)
                  if (e.target.value && e.target.nextSibling) {
                    const next = e.target.closest('.MuiInputBase-root')?.parentElement?.nextSibling?.querySelector('input')
                    if (next) next.focus()
                  }
                }}
                size="small"
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: 'center', fontSize: 24, fontWeight: 700, padding: '10px 0' },
                }}
                sx={{
                  width: 56,
                  '& .MuiOutlinedInput-root': {
                    height: 56,
                    borderRadius: 2,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0c831f' },
                  },
                }}
              />
            ))}
          </Box>
          {otpError && (
            <Typography variant="caption" sx={{ color: '#ef4444', display: 'block', mb: 1 }}>{otpError}</Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => { setShowOtp(false); setOtp(''); setOtpError('') }}
              sx={{ borderColor: '#d1d5db', color: '#4b5563' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleVerifyOtp}
              disabled={otp.length < 4}
            >
              Verify & Complete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Action Button */}
      {step < 4 && (
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleNext}
          sx={{ py: 1.75, fontSize: 16, fontWeight: 700, borderRadius: 3, boxShadow: '0 4px 16px rgba(12,131,31,0.3)' }}
        >
          {buttonLabels[step]}
        </Button>
      )}

      {step === 4 && (
        <Box sx={{ bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 3, p: 3, textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 40, color: '#22c55e', mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#15803d' }}>Delivery Complete!</Typography>
          <Typography variant="body2" sx={{ color: '#0c831f', mt: 0.5 }}>You earned ₹{delivery.earnings}</Typography>
        </Box>
      )}
    </Box>
  )
}
