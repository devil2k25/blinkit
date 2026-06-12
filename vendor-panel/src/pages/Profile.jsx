import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Store, MapPin, Clock, Star, Edit2, LogOut, Camera, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    storeName: user?.storeName || 'Fresh Farms',
    description: 'Your one-stop shop for fresh groceries, dairy, and more. Delivering quality products at your doorstep.',
    ownerName: user?.name || 'Ramesh Verma',
    phone: '+91 99887 76655',
    email: user?.email || 'vendor@freshfarms.com',
    address: '14, Connaught Place, New Delhi - 110001',
    openTime: '09:00',
    closeTime: '23:00',
    bank: 'HDFC Bank - XXXX1234',
    upi: 'freshfarms@okicici',
  })

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    setEditing(false)
    toast.success('Profile updated!')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Store Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your store information</p>
        </div>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm ${editing ? 'bg-green-600 text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
        >
          {editing ? <><Save size={16} /> Save</> : <><Edit2 size={16} /> Edit</>}
        </button>
      </div>

      {/* Store Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-3xl">
              🏪
            </div>
            {editing && (
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                <Camera size={13} className="text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex-1">
            {editing ? (
              <input
                value={form.storeName}
                onChange={e => update('storeName', e.target.value)}
                className="text-xl font-bold text-gray-800 border-b-2 border-green-500 bg-transparent w-full focus:outline-none mb-1"
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-800">{form.storeName}</h2>
            )}
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-yellow-500 text-sm">
                <Star size={14} className="fill-yellow-400" />
                <span className="font-medium">4.7</span>
              </span>
              <span className="text-gray-400 text-sm">·</span>
              <span className="text-gray-500 text-sm">1,284 orders</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-gray-500 mb-1 block">Store Description</label>
          {editing ? (
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          ) : (
            <p className="text-sm text-gray-600">{form.description}</p>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800">Contact Information</h3>
        {[
          { label: 'Owner Name', key: 'ownerName' },
          { label: 'Phone', key: 'phone' },
          { label: 'Email', key: 'email' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="text-xs text-gray-500 mb-1 block">{label}</label>
            {editing ? (
              <input
                value={form[key]}
                onChange={e => update(key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <p className="text-sm text-gray-800">{form[key]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Location & Hours */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800">Location & Hours</h3>
        <div>
          <label className="text-xs text-gray-500 mb-1 flex items-center gap-1 block">
            <MapPin size={12} /> Address
          </label>
          {editing ? (
            <textarea
              value={form.address}
              onChange={e => update('address', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          ) : (
            <p className="text-sm text-gray-800">{form.address}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[['openTime', 'Opens At'], ['closeTime', 'Closes At']].map(([key, label]) => (
            <div key={key}>
              <label className="text-xs text-gray-500 mb-1 flex items-center gap-1 block">
                <Clock size={12} /> {label}
              </label>
              {editing ? (
                <input
                  type="time"
                  value={form[key]}
                  onChange={e => update(key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800">{form[key]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800">Payout Details</h3>
        {[['bank', 'Bank Account'], ['upi', 'UPI ID']].map(([key, label]) => (
          <div key={key}>
            <label className="text-xs text-gray-500 mb-1 block">{label}</label>
            {editing ? (
              <input
                value={form[key]}
                onChange={e => update(key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <p className="text-sm text-gray-800">{form[key]}</p>
            )}
          </div>
        ))}
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
