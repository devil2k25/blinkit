import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_DELIVERIES } from '../utils/mockData'
import { Package, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react'

const STATUS_TABS = ['Available', 'Active', 'Completed', 'Cancelled']

const statusColors = {
  available: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
}

function DeliveryCard({ delivery, onAccept, onView, accepting }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-gray-800">{delivery.orderId}</p>
          <p className="text-xs text-gray-400 mt-0.5">{delivery.estimatedTime} · {delivery.distance}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-green-600">₹{delivery.earnings}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[delivery.status]}`}>
            {delivery.status}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Package size={10} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700">{delivery.pickup.storeName}</p>
            <p className="text-xs text-gray-400">{delivery.pickup.address}</p>
          </div>
        </div>
        <div className="ml-2.5 w-px h-3 bg-gray-200" />
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin size={10} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700">{delivery.delivery.customerName}</p>
            <p className="text-xs text-gray-400">{delivery.delivery.address}</p>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-3">
        Items: {delivery.items.join(', ')}
      </div>

      {delivery.status === 'available' && (
        <button
          onClick={() => onAccept(delivery)}
          disabled={accepting === delivery.id}
          className="w-full py-2.5 bg-green-600 text-white font-bold text-sm rounded-xl disabled:opacity-60"
        >
          {accepting === delivery.id ? 'Accepting...' : 'Accept Order'}
        </button>
      )}
      {delivery.status === 'active' && (
        <button
          onClick={() => onView(delivery)}
          className="w-full py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl"
        >
          View Active Delivery
        </button>
      )}
      {delivery.status === 'completed' && (
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <CheckCircle size={14} className="text-green-500" />
          <span>Delivered successfully</span>
        </div>
      )}
      {delivery.status === 'cancelled' && (
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <XCircle size={14} className="text-red-400" />
          <span>Delivery cancelled</span>
        </div>
      )}
    </div>
  )
}

export default function Deliveries() {
  const navigate = useNavigate()
  const { isOnline, setActiveDelivery } = useAuth()
  const [activeTab, setActiveTab] = useState('Available')
  const [accepting, setAccepting] = useState(null)

  const filtered = MOCK_DELIVERIES.filter(d => {
    const tab = activeTab.toLowerCase()
    if (tab === 'available') return d.status === 'available'
    if (tab === 'active') return d.status === 'active'
    if (tab === 'completed') return d.status === 'completed'
    if (tab === 'cancelled') return d.status === 'cancelled'
    return true
  })

  const handleAccept = (delivery) => {
    setAccepting(delivery.id)
    setTimeout(() => {
      setActiveDelivery(delivery)
      setAccepting(null)
      navigate(`/deliveries/${delivery.id}`)
    }, 800)
  }

  const handleView = (delivery) => {
    navigate(`/deliveries/${delivery.id}`)
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Deliveries</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {tab} ({MOCK_DELIVERIES.filter(d => d.status === tab.toLowerCase()).length})
          </button>
        ))}
      </div>

      {!isOnline && activeTab === 'Available' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-center">
          <p className="text-yellow-700 text-sm font-medium">You're offline — go online to see available orders</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-gray-500">No {activeTab.toLowerCase()} deliveries</p>
          </div>
        ) : (
          filtered.map(delivery => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onAccept={handleAccept}
              onView={handleView}
              accepting={accepting}
            />
          ))
        )}
      </div>
    </div>
  )
}
