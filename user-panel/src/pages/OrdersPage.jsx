import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, RotateCcw } from 'lucide-react'
import { MOCK_ORDERS } from '../utils/mockData'

const STATUS_CONFIG = {
  placed: { label: 'Order Placed', color: 'bg-blue-100 text-blue-700', icon: <Package className="w-3.5 h-3.5" /> },
  confirmed: { label: 'Confirmed', color: 'bg-purple-100 text-purple-700', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  preparing: { label: 'Preparing', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3.5 h-3.5" /> },
  picked: { label: 'On the way', color: 'bg-orange-100 text-orange-700', icon: <Truck className="w-3.5 h-3.5" /> },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3.5 h-3.5" /> },
}

const TABS = ['All', 'Active', 'Delivered', 'Cancelled']

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All')

  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (activeTab === 'All') return true
    if (activeTab === 'Active') return ['placed', 'confirmed', 'preparing', 'picked'].includes(order.status)
    if (activeTab === 'Delivered') return order.status === 'delivered'
    if (activeTab === 'Cancelled') return order.status === 'cancelled'
    return true
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black text-dark mb-6">My Orders</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0 transition-all ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-dark mb-2">No orders found</h3>
          <p className="text-gray-500 text-sm mb-6">You haven't placed any orders yet</p>
          <Link to="/" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed
            const isActive = ['placed', 'confirmed', 'preparing', 'picked'].includes(order.status)

            return (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="card p-4 flex gap-4 hover:shadow-md transition-shadow group"
              >
                {/* Order Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  order.status === 'delivered' ? 'bg-green-100' :
                  isActive ? 'bg-orange-100 animate-pulse' : 'bg-gray-100'
                }`}>
                  <Package className={`w-6 h-6 ${
                    order.status === 'delivered' ? 'text-green-600' :
                    isActive ? 'text-orange-500' : 'text-gray-400'
                  }`} />
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-dark text-sm">Order #{order.orderNumber}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${statusConf.color}`}>
                      {statusConf.icon}
                      {statusConf.label}
                    </span>
                  </div>

                  {/* Items preview */}
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex -space-x-1">
                      {order.items.slice(0, 3).map((item, i) => (
                        <span
                          key={i}
                          className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm"
                        >
                          {item.product.emoji}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-dark">₹{order.total}</span>
                    {isActive ? (
                      <span className="text-xs text-orange-500 font-semibold flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                        Live tracking available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-primary font-semibold">
                        <RotateCcw className="w-3 h-3" />
                        Reorder
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0 self-center" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
