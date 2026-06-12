import React, { useState } from 'react'
import { Search, Clock } from 'lucide-react'
import { MOCK_ORDERS } from '../utils/mockData'
import toast from 'react-hot-toast'

const ALL_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'picked_up', label: 'Picked Up' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
]

function statusBadgeClass(status) {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'confirmed': return 'bg-blue-100 text-blue-800'
    case 'preparing': return 'bg-purple-100 text-purple-800'
    case 'ready': return 'bg-teal-100 text-teal-800'
    case 'picked_up': return 'bg-orange-100 text-orange-800'
    case 'delivered': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function formatStatus(status) {
  return status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Orders() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [orders, setOrders] = useState(MOCK_ORDERS)

  const updateStatus = (orderId, newStatus, message) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    if (message) toast.success(message)
  }

  const getTabCount = (tabKey) => {
    if (tabKey === 'all') return orders.length
    return orders.filter(o => o.status === tabKey).length
  }

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab
    const name = order.customer?.name || order.customerName || ''
    const phone = order.customer?.phone || order.customerPhone || ''
    const matchesSearch =
      !searchQuery ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery)
    return matchesTab && matchesSearch
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.filter(o => o.status === 'pending').length} orders need attention</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by order ID, customer name or phone…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c831f] bg-white"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {ALL_TABS.map(tab => {
          const count = getTabCount(tab.key)
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#0c831f] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Order Cards */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ShoppingBagEmpty />
          <p className="mt-3 font-medium">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => {
            const customerName = order.customer?.name || order.customerName || 'Unknown'
            const customerPhone = order.customer?.phone || order.customerPhone || ''
            const itemsSummary = order.items
              .map(i => i.name)
              .join(', ')
              .slice(0, 60) + (order.items.map(i => i.name).join(', ').length > 60 ? '…' : '')

            return (
              <div
                key={order.id}
                className={`bg-white rounded-xl shadow-sm p-4 border ${
                  order.status === 'pending'
                    ? 'border-yellow-300 animate-pulse'
                    : 'border-gray-100'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{order.orderId}</span>
                    {order.status === 'pending' && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-yellow-500" />
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadgeClass(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{timeAgo(order.createdAt)}</span>
                </div>

                {/* Customer */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">{customerName}</span>
                  <span className="text-xs text-gray-500">{customerPhone}</span>
                </div>

                {/* Items */}
                <p className="text-xs text-gray-400 mb-2 truncate">{itemsSummary}</p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">₹{order.total}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {order.paymentMethod || 'Online'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(order.id, 'confirmed', 'Order accepted!')}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0c831f] text-white hover:bg-green-700 transition-colors"
                        >
                          Accept Order
                        </button>
                        <button
                          onClick={() => updateStatus(order.id, 'cancelled', 'Order rejected')}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus(order.id, 'preparing', 'Order is now being prepared')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateStatus(order.id, 'ready', 'Order marked as ready!')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <span className="text-xs text-teal-600 font-medium italic">Waiting for pickup…</span>
                    )}
                    {(order.status === 'delivered' || order.status === 'cancelled' || order.status === 'picked_up') && (
                      <a
                        href={`/orders/${order.id}`}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ShoppingBagEmpty() {
  return (
    <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )
}
