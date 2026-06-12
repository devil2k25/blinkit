import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_DELIVERIES, WEEKLY_EARNINGS } from '../utils/mockData'
import { Package, IndianRupee, Clock, Star, ChevronRight, MapPin, Navigation } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

export default function Dashboard() {
  const { user, isOnline, toggleOnline, activeDelivery, setActiveDelivery } = useAuth()
  const navigate = useNavigate()
  const [accepting, setAccepting] = useState(null)

  const available = MOCK_DELIVERIES.filter(d => d.status === 'available')
  const completed = MOCK_DELIVERIES.filter(d => d.status === 'completed')

  const handleAccept = (delivery) => {
    setAccepting(delivery.id)
    setTimeout(() => {
      setActiveDelivery(delivery)
      setAccepting(null)
      navigate(`/deliveries/${delivery.id}`)
    }, 800)
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Online Toggle */}
      <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">Your status</p>
          <p className={`text-lg font-bold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
            {isOnline ? 'You are Online' : 'You are Offline'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {isOnline ? 'Ready to receive orders' : 'Go online to accept deliveries'}
          </p>
        </div>
        <button
          onClick={toggleOnline}
          className={`w-16 h-9 rounded-full transition-all duration-300 relative flex-shrink-0 ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <div className={`w-7 h-7 bg-white rounded-full shadow-md absolute top-1 transition-all duration-300 ${isOnline ? 'left-8' : 'left-1'}`} />
        </button>
      </div>

      {/* Active Delivery */}
      {activeDelivery && (
        <div
          className="bg-green-600 rounded-2xl p-4 shadow-lg cursor-pointer active:scale-95 transition-transform"
          onClick={() => navigate(`/deliveries/${activeDelivery.id}`)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Package size={16} className="text-white" />
              </div>
              <span className="text-white font-bold">Active Delivery</span>
            </div>
            <span className="text-green-200 text-sm">{activeDelivery.orderId}</span>
          </div>
          <p className="text-white text-sm font-medium">{activeDelivery.delivery.customerName}</p>
          <p className="text-green-200 text-xs mt-1 flex items-center gap-1">
            <MapPin size={12} /> {activeDelivery.delivery.address}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-yellow-300 font-bold">₹{activeDelivery.earnings}</span>
            <div className="flex items-center gap-1 text-white text-sm">
              <Navigation size={14} />
              <span>Continue</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Today's Deliveries", value: completed.length, icon: Package, color: 'bg-blue-50 text-blue-600' },
          { label: "Today's Earnings", value: '₹650', icon: IndianRupee, color: 'bg-green-50 text-green-600' },
          { label: 'Avg Time', value: '13 min', icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Your Rating', value: `${user?.rating || 4.8}★`, icon: Star, color: 'bg-purple-50 text-purple-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${color.split(' ')[0]}`}>
              <Icon size={18} className={color.split(' ')[1]} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">This Week</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={WEEKLY_EARNINGS} barSize={20}>
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              formatter={(v) => [`₹${v}`, 'Earnings']}
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="amount" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Available Orders */}
      {isOnline && (
        <div>
          <h3 className="font-bold text-gray-800 mb-3">Available Orders ({available.length})</h3>
          <div className="space-y-3">
            {available.slice(0, 3).map((delivery) => (
              <div key={delivery.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-sm text-gray-800">{delivery.orderId}</p>
                    <p className="text-xs text-gray-500">{delivery.estimatedTime} · {delivery.distance}</p>
                  </div>
                  <span className="text-green-600 font-bold">₹{delivery.earnings}</span>
                </div>
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <p className="text-xs text-gray-600">{delivery.pickup.storeName}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                    <p className="text-xs text-gray-600">{delivery.delivery.address}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAccept(delivery)}
                  disabled={accepting === delivery.id}
                  className="w-full py-2.5 bg-green-600 text-white font-bold text-sm rounded-xl disabled:opacity-60"
                >
                  {accepting === delivery.id ? 'Accepting...' : 'Accept Order'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isOnline && (
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-3">😴</p>
          <p className="text-gray-600 font-medium">You're offline</p>
          <p className="text-gray-400 text-sm mt-1">Go online to start accepting delivery orders</p>
        </div>
      )}
    </div>
  )
}
