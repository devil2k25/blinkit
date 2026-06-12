import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Plus, CheckCircle, Zap, CreditCard, Banknote,
  Smartphone, ChevronDown, ChevronUp, Edit2
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const MOCK_ADDRESSES = [
  {
    _id: 'addr_1',
    label: 'Home',
    icon: '🏠',
    line1: '42 Green Park Extension',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
    isDefault: true,
  },
  {
    _id: 'addr_2',
    label: 'Work',
    icon: '🏢',
    line1: 'Plot 5B, Sector 18, Noida',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    isDefault: false,
  },
]

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: <Banknote className="w-5 h-5 text-green-600" />, desc: 'Pay when you receive your order' },
  { id: 'online', label: 'Online Payment', icon: <CreditCard className="w-5 h-5 text-blue-600" />, desc: 'UPI, Cards, Net Banking' },
  { id: 'upi', label: 'UPI / GPay', icon: <Smartphone className="w-5 h-5 text-purple-600" />, desc: 'Pay instantly via UPI' },
]

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, deliveryFee, handlingFee, orderTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [selectedAddress, setSelectedAddress] = useState(MOCK_ADDRESSES[0]._id)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [showItems, setShowItems] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: 'Home', line1: '', city: '', pincode: '' })

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address')
      return
    }
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1800))
    clearCart()
    setLoading(false)
    toast.success('Order placed successfully! 🎉')
    navigate('/orders')
  }

  if (cartItems.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black text-dark mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — Address + Payment */}
        <div className="lg:col-span-2 space-y-5">
          {/* Delivery Address */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-dark">Delivery Address</h2>
            </div>

            <div className="space-y-3">
              {MOCK_ADDRESSES.map(addr => (
                <label
                  key={addr._id}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAddress === addr._id
                      ? 'border-primary bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr._id}
                    checked={selectedAddress === addr._id}
                    onChange={() => setSelectedAddress(addr._id)}
                    className="mt-1 accent-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{addr.icon}</span>
                      <span className="font-bold text-dark text-sm">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-xs bg-primary/10 text-primary font-semibold px-1.5 py-0.5 rounded">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{addr.line1}</p>
                    <p className="text-xs text-gray-400">{addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                  <button className="text-gray-400 hover:text-primary transition-colors mt-1">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </label>
              ))}

              {/* Add new address */}
              {!showAddAddress ? (
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary hover:text-primary transition-all text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add New Address
                </button>
              ) : (
                <div className="p-3 rounded-xl border-2 border-gray-200 space-y-3">
                  <h4 className="font-bold text-sm text-dark">New Address</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Label (Home/Work)"
                      value={newAddress.label}
                      onChange={e => setNewAddress({...newAddress, label: e.target.value})}
                      className="input-field text-sm py-2"
                    />
                    <input
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={e => setNewAddress({...newAddress, pincode: e.target.value})}
                      className="input-field text-sm py-2"
                    />
                  </div>
                  <input
                    placeholder="Street address, apartment, etc."
                    value={newAddress.line1}
                    onChange={e => setNewAddress({...newAddress, line1: e.target.value})}
                    className="input-field text-sm py-2"
                  />
                  <input
                    placeholder="City"
                    value={newAddress.city}
                    onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                    className="input-field text-sm py-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAddAddress(false)}
                      className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { toast.success('Address saved!'); setShowAddAddress(false) }}
                      className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Slot */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-primary fill-primary" />
              <h2 className="font-bold text-dark">Delivery Time</h2>
            </div>
            <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <p className="font-bold text-dark text-sm">Express Delivery — 10 Minutes</p>
                <p className="text-xs text-gray-500">Your order will arrive between 8 AM – 11 PM</p>
              </div>
              <CheckCircle className="w-5 h-5 text-primary ml-auto" />
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-dark">Payment Method</h2>
            </div>
            <div className="space-y-2.5">
              {PAYMENT_METHODS.map(method => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? 'border-primary bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="accent-primary"
                  />
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                    {method.icon}
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">{method.label}</p>
                    <p className="text-xs text-gray-500">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="space-y-4">
          {/* Items Collapsible */}
          <div className="card overflow-hidden">
            <button
              onClick={() => setShowItems(!showItems)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-bold text-dark text-sm">{cartCount} items in cart</span>
              {showItems ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {showItems && (
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {cartItems.map(item => (
                  <div key={item._id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-dark truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.unit} × {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-dark">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bill */}
          <div className="card p-4">
            <h3 className="font-bold text-dark mb-3">Bill Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className={deliveryFee === 0 ? 'text-primary font-medium' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Fee</span>
                <span>₹{handlingFee}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-black text-dark">
                <span>Total</span>
                <span>₹{orderTotal}</span>
              </div>
            </div>
          </div>

          {/* Place Order */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full btn-primary py-4 text-base rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Placing Order...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Place Order — ₹{orderTotal}
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            By placing order you agree to our Terms & Conditions
          </p>
        </div>
      </div>
    </div>
  )
}
