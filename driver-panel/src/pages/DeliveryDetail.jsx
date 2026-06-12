import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_DELIVERIES, ACTIVE_DELIVERY } from '../utils/mockData'
import { Phone, Navigation, CheckCircle, Package, MapPin, User } from 'lucide-react'
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
      <div className="p-4 text-center py-20">
        <p className="text-gray-500">Delivery not found</p>
        <button onClick={() => navigate('/deliveries')} className="mt-4 text-green-600 font-medium">
          Go Back
        </button>
      </div>
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

  const buttonLabels = ['Reached Store', 'Order Picked Up', 'Out for Delivery', 'Mark Delivered']

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Active Delivery</p>
          <h2 className="text-xl font-bold text-gray-800">{delivery.orderId}</h2>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          ₹{delivery.earnings}
        </span>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Delivery Progress</h3>
        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  i < step ? 'bg-green-500' : i === step ? 'bg-green-600 ring-4 ring-green-100' : 'bg-gray-200'
                }`}>
                  {i < step ? (
                    <CheckCircle size={16} className="text-white" />
                  ) : (
                    <span className={`text-sm font-bold ${i === step ? 'text-white' : 'text-gray-400'}`}>{i + 1}</span>
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-0.5 h-6 mt-1 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className="pt-1">
                <p className={`text-sm font-medium ${i <= step ? 'text-gray-800' : 'text-gray-400'}`}>{s.label}</p>
                {i === step && <p className="text-xs text-green-600 mt-0.5">{s.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pickup Info */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Package size={16} className="text-green-600" />
          <h3 className="font-bold text-gray-800">Pickup</h3>
        </div>
        <p className="text-sm font-medium text-gray-800">{delivery.pickup.storeName}</p>
        <p className="text-xs text-gray-500 mt-1">{delivery.pickup.address}</p>
        <p className="text-xs text-gray-400 mt-1">{delivery.pickup.distance} away</p>
        <button
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium"
          onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(delivery.pickup.address)}`)}
        >
          <Navigation size={14} />
          Navigate to Store
        </button>
      </div>

      {/* Delivery Info */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-red-500" />
          <h3 className="font-bold text-gray-800">Delivery</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">{delivery.delivery.customerName}</p>
            <p className="text-xs text-gray-500 mt-1">{delivery.delivery.address}</p>
            <p className="text-xs text-gray-400 mt-1">{delivery.delivery.distance} away</p>
          </div>
          <a
            href={`tel:${delivery.delivery.phone}`}
            className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
          >
            <Phone size={18} className="text-green-600" />
          </a>
        </div>
        <button
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium"
          onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(delivery.delivery.address)}`)}
        >
          <Navigation size={14} />
          Navigate to Customer
        </button>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-2">Order Items</h3>
        <ul className="space-y-1">
          {delivery.items.map((item, i) => (
            <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* OTP Modal */}
      {showOtp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Enter Delivery OTP</h3>
            <p className="text-gray-500 text-sm mb-6">Ask the customer for their 4-digit OTP to confirm delivery</p>
            <div className="flex gap-3 mb-2">
              {[0, 1, 2, 3].map(i => (
                <input
                  key={i}
                  type="tel"
                  maxLength={1}
                  value={otp[i] || ''}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '')
                    const newOtp = otp.split('')
                    newOtp[i] = val
                    setOtp(newOtp.join('').slice(0, 4))
                    setOtpError('')
                    if (val && e.target.nextSibling) e.target.nextSibling.focus()
                  }}
                  className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                />
              ))}
            </div>
            {otpError && <p className="text-red-500 text-sm mb-3">{otpError}</p>}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowOtp(false); setOtp(''); setOtpError('') }}
                className="flex-1 py-3 border border-gray-300 text-gray-600 font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={otp.length < 4}
                className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl disabled:opacity-50"
              >
                Verify & Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {step < 4 && (
        <button
          onClick={handleNext}
          className="w-full py-4 bg-green-600 text-white font-bold text-base rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          {buttonLabels[step]}
        </button>
      )}

      {step === 4 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <CheckCircle size={40} className="text-green-500 mx-auto mb-2" />
          <p className="font-bold text-green-700 text-lg">Delivery Complete!</p>
          <p className="text-green-600 text-sm mt-1">You earned ₹{delivery.earnings}</p>
        </div>
      )}
    </div>
  )
}
