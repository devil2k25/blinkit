import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, MapPin, Phone, Mail, Edit2, Plus, Trash2, LogOut, ShoppingBag, Heart, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

const MOCK_ADDRESSES = [
  { id: 'a1', type: 'home', label: 'Home', street: '42, Sector 15, Dwarka', city: 'New Delhi', pincode: '110078', isDefault: true },
  { id: 'a2', type: 'work', label: 'Work', street: '7th Floor, DLF Cyber City', city: 'Gurugram', pincode: '122002', isDefault: false },
]

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES)
  const [editingProfile, setEditingProfile] = useState(false)
  const [name, setName] = useState(user?.name || 'Aditya Kumar')
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210')
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '', pincode: '' })

  const handleSaveProfile = () => {
    setEditingProfile(false)
    toast.success('Profile updated!')
  }

  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id))
    toast.success('Address removed')
  }

  const handleAddAddress = () => {
    if (!newAddress.street || !newAddress.city) return toast.error('Please fill required fields')
    setAddresses(prev => [...prev, { ...newAddress, id: `a${Date.now()}`, type: 'other', isDefault: false }])
    setNewAddress({ label: '', street: '', city: '', pincode: '' })
    setShowAddAddress(false)
    toast.success('Address added!')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Logged out')
  }

  const quickLinks = [
    { icon: ShoppingBag, label: 'My Orders', action: () => navigate('/orders') },
    { icon: Heart, label: 'Wishlist', action: () => toast('Coming soon') },
    { icon: CreditCard, label: 'Payments', action: () => toast('Coming soon') },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {(user?.name || name || 'U')[0]}
          </div>
          <div className="flex-1">
            {editingProfile ? (
              <div className="space-y-2">
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Phone number"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 py-2 bg-primary text-white font-medium rounded-xl text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingProfile(false)}
                    className="flex-1 py-2 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">{user?.name || name}</h2>
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
                <div className="space-y-1 mt-1">
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <Mail size={13} />
                    {user?.email || 'user@example.com'}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <Phone size={13} />
                    {user?.phone || phone}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-3">
        {quickLinks.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Icon size={18} className="text-primary" />
            </div>
            <span className="text-xs font-medium text-gray-700">{label}</span>
          </button>
        ))}
      </div>

      {/* Addresses */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Saved Addresses</h3>
          <button
            onClick={() => setShowAddAddress(v => !v)}
            className="flex items-center gap-1 text-primary text-sm font-medium"
          >
            <Plus size={16} />
            Add New
          </button>
        </div>

        {showAddAddress && (
          <div className="mb-4 p-4 bg-gray-50 rounded-xl space-y-2">
            <input
              placeholder="Label (e.g. Office, Home)"
              value={newAddress.label}
              onChange={e => setNewAddress(a => ({ ...a, label: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
            />
            <input
              placeholder="Street address *"
              value={newAddress.street}
              onChange={e => setNewAddress(a => ({ ...a, street: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="City *"
                value={newAddress.city}
                onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
              />
              <input
                placeholder="Pincode"
                value={newAddress.pincode}
                onChange={e => setNewAddress(a => ({ ...a, pincode: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddAddress} className="flex-1 py-2 bg-primary text-white font-medium rounded-xl text-sm">
                Add Address
              </button>
              <button onClick={() => setShowAddAddress(false)} className="flex-1 py-2 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={15} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-800">{addr.label}</p>
                  {addr.isDefault && (
                    <span className="text-xs px-2 py-0.5 bg-primary text-white rounded-full">Default</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{addr.street}, {addr.city} - {addr.pincode}</p>
              </div>
              {!addr.isDefault && (
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full py-3.5 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  )
}
