import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { User, Phone, Bike, Star, Package, Edit2, LogOut, Shield, Bell } from 'lucide-react'
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

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white relative">
        <button
          onClick={() => setEditing(e => !e)}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
        >
          <Edit2 size={14} />
        </button>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
            {(user?.name || 'R')[0]}
          </div>
          <div>
            <h2 className="text-lg font-bold">{user?.name || 'Rajesh Kumar'}</h2>
            <p className="text-gray-300 text-sm">{user?.phone || '+91 98765 43210'}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">{user?.rating || 4.8}</span>
              <span className="text-gray-400 text-xs">rating</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-2.5 text-center">
              <p className="font-bold text-base">{s.value}</p>
              <p className="text-gray-300 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Edit Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Phone</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button onClick={handleSave} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Vehicle Details */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">Vehicle Details</h3>
        <div className="space-y-3">
          {[
            { icon: Bike, label: 'Vehicle Type', value: user?.vehicle || 'Bike' },
            { icon: Shield, label: 'Vehicle Number', value: user?.vehicleNumber || 'DL 5S AB 1234' },
            { icon: Shield, label: 'License Number', value: user?.licenseNumber || 'DL-1420110012345' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Icon size={18} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-800">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {[
          { icon: Bell, label: 'Notifications', action: () => toast('Settings coming soon') },
          { icon: Shield, label: 'Privacy & Security', action: () => toast('Coming soon') },
          { icon: Phone, label: 'Support', action: () => toast('Call: 1800-XXX-XXXX') },
        ].map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            className="w-full flex items-center gap-3 px-4 py-4 border-b border-gray-50 last:border-0 text-left hover:bg-gray-50"
          >
            <Icon size={18} className="text-gray-500" />
            <span className="text-sm text-gray-700">{label}</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full py-3.5 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold rounded-2xl"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  )
}
