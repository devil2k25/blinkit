import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Phone, Mail, MapPin, CheckCircle, Circle
} from 'lucide-react'
import { MOCK_ORDERS } from '../utils/mockData'
import toast from 'react-hot-toast'

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

function formatStatus(s) {
  return s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const STATUS_TIMELINE = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered']

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [orders, setOrders] = useState(MOCK_ORDERS)

  const order = orders.find(o => o.id === id || o.orderId === id)

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-xl font-semibold">Order not found</p>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 text-sm text-[#0c831f] hover:underline"
        >
          ← Back to Orders
        </button>
      </div>
    )
  }

  const customerName = order.customer?.name || order.customerName || 'Unknown'
  const customerPhone = order.customer?.phone || order.customerPhone || ''
  const customerEmail = order.customer?.email || order.customerEmail || ''

  const updateStatus = (newStatus, msg) => {
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o))
    toast.success(msg)
  }

  const timelineIndex = order.status === 'cancelled'
    ? -1
    : STATUS_TIMELINE.indexOf(order.status)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="flex-1 flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">{order.orderId}</h1>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusBadgeClass(order.status)}`}>
            {formatStatus(order.status)}
          </span>
        </div>
        <span className="text-sm text-gray-400">
          {new Date(order.createdAt).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
          })}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Customer Info</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0c831f] flex items-center justify-center text-white font-bold text-sm">
                  {customerName[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{customerName}</p>
                  <p className="text-xs text-gray-400">Customer</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={15} className="text-gray-400 flex-shrink-0" />
                <span>{customerPhone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={15} className="text-gray-400 flex-shrink-0" />
                <span>{customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Delivery Address</h2>
            <div className="flex gap-3">
              <MapPin size={18} className="text-[#0c831f] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 leading-relaxed">{order.address}</p>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Items ({order.items.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs text-gray-500 font-medium pb-2">Item</th>
                    <th className="text-center text-xs text-gray-500 font-medium pb-2">Qty</th>
                    <th className="text-right text-xs text-gray-500 font-medium pb-2">Unit Price</th>
                    <th className="text-right text-xs text-gray-500 font-medium pb-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => {
                    const qty = item.qty || item.quantity || 1
                    const total = qty * item.price
                    return (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="py-2.5">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          {item.unit && <p className="text-xs text-gray-400">{item.unit}</p>}
                        </td>
                        <td className="py-2.5 text-center text-gray-600">{qty}</td>
                        <td className="py-2.5 text-right text-gray-600">₹{item.price}</td>
                        <td className="py-2.5 text-right font-semibold text-gray-900">₹{total}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2 text-base">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Payment Method</p>
              <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                {order.paymentMethod || 'Online'}
              </span>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Order Timeline</h2>
            {order.status === 'cancelled' ? (
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center">
                  <span className="text-red-600 text-xs font-bold">✕</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
                  <p className="text-xs text-red-400">This order was cancelled</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {STATUS_TIMELINE.map((s, i) => {
                  const isCompleted = i <= timelineIndex
                  const isCurrent = i === timelineIndex
                  return (
                    <div key={s} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? 'bg-[#0c831f] text-white'
                            : 'bg-gray-100 text-gray-300'
                        } ${isCurrent ? 'ring-2 ring-[#0c831f] ring-offset-2' : ''}`}>
                          {isCompleted
                            ? <CheckCircle size={14} />
                            : <Circle size={14} />}
                        </div>
                        {i < STATUS_TIMELINE.length - 1 && (
                          <div className={`w-0.5 h-6 mt-1 ${isCompleted ? 'bg-[#0c831f]' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className={`pt-0.5 ${isCurrent ? 'font-semibold text-gray-900' : isCompleted ? 'text-gray-600' : 'text-gray-300'}`}>
                        <p className="text-sm">{formatStatus(s)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {['pending', 'confirmed', 'preparing'].includes(order.status) && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-2">
                {order.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus('confirmed', 'Order accepted!')}
                      className="w-full py-2.5 bg-[#0c831f] text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() => updateStatus('cancelled', 'Order rejected')}
                      className="w-full py-2.5 border border-red-300 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-50 transition-colors"
                    >
                      Reject Order
                    </button>
                  </>
                )}
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => updateStatus('preparing', 'Order preparation started!')}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateStatus('ready', 'Order marked as ready for pickup!')}
                    className="w-full py-2.5 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition-colors"
                  >
                    Mark as Ready
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
