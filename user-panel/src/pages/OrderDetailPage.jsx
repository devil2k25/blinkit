import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MOCK_ORDERS } from '../utils/mockData'
import { CheckCircle, Clock, Package, Truck, MapPin, ArrowLeft, Phone, XCircle } from 'lucide-react'

const STATUS_TIMELINE = [
  { key: 'placed', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'preparing', label: 'Preparing', icon: Clock },
  { key: 'picked', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: MapPin },
]

const statusLabel = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const order = MOCK_ORDERS.find(o => o._id === id) || MOCK_ORDERS[0]
  const doneCount = (order.timeline || []).filter(t => t.done).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Order #{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm">
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span className={`ml-auto text-xs font-medium px-3 py-1 rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
          {statusLabel[order.status] || order.status}
        </span>
      </div>

      {/* ETA Banner */}
      {order.status === 'out_for_delivery' && (
        <div className="bg-primary rounded-2xl p-4 text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Truck size={20} />
          </div>
          <div>
            <p className="font-bold">Arriving in ~10 minutes</p>
            <p className="text-green-100 text-sm">Driver is on the way to you</p>
          </div>
        </div>
      )}

      {order.status === 'delivered' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-700">Order Delivered!</p>
            <p className="text-green-600 text-sm">Thank you for shopping with Blinkit</p>
          </div>
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <XCircle size={24} className="text-red-500 flex-shrink-0" />
          <p className="font-bold text-red-600">Order Cancelled</p>
        </div>
      )}

      {/* Timeline */}
      {order.status !== 'cancelled' && order.timeline && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Order Timeline</h3>
          <div className="space-y-1">
            {STATUS_TIMELINE.map((step, i) => {
              const timelineEntry = order.timeline[i]
              const done = timelineEntry?.done ?? false
              const active = i === doneCount - 1
              const Icon = step.icon
              return (
                <div key={step.key} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-primary' : 'bg-gray-100'}`}>
                      <Icon size={14} className={done ? 'text-white' : 'text-gray-400'} />
                    </div>
                    {i < STATUS_TIMELINE.length - 1 && (
                      <div className={`w-0.5 h-8 ${done && i < doneCount - 1 ? 'bg-primary' : 'bg-gray-100'}`} />
                    )}
                  </div>
                  <div className="pt-1 pb-2">
                    <p className={`text-sm font-medium ${done ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</p>
                    {timelineEntry?.time && (
                      <p className={`text-xs mt-0.5 ${active ? 'text-primary font-medium' : 'text-gray-400'}`}>
                        {timelineEntry.time}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Driver Info */}
      {order.status === 'out_for_delivery' && order.driver && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">Delivery Partner</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700 text-lg">
              {order.driver.name[0]}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{order.driver.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{order.driver.vehicle}</p>
            </div>
            <a
              href={`tel:${order.driver.phone}`}
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center"
            >
              <Phone size={18} className="text-white" />
            </a>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">Items ({order.items.length})</h3>
        <div className="space-y-3">
          {order.items.map((item, idx) => {
            const product = item.product || item
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient || 'from-gray-100 to-gray-200'} flex items-center justify-center text-xl flex-shrink-0`}>
                  {product.emoji || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.unit} × {item.quantity}</p>
                </div>
                <p className="font-bold text-gray-800">₹{(product.price * item.quantity)}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-2">Delivery Address</h3>
        <div className="flex items-start gap-2">
          <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">{order.address.label}</p>
            <p className="text-sm text-gray-600">
              {order.address.line1 || order.address.street}, {order.address.city} - {order.address.pincode}
            </p>
          </div>
        </div>
      </div>

      {/* Bill Details */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">Bill Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Item Total</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery Fee</span>
            <span>{order.deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `₹${order.deliveryFee}`}</span>
          </div>
          {order.handlingFee > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Handling Fee</span>
              <span>₹{order.handlingFee}</span>
            </div>
          )}
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-₹{order.discount}</span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-800">
            <span>Total Paid</span>
            <span>₹{order.total}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Payment: {order.paymentMethod}</p>
        </div>
      </div>

      <Link
        to="/orders"
        className="block text-center py-3 border border-gray-200 text-gray-700 font-medium rounded-2xl hover:bg-gray-50 transition-colors"
      >
        View All Orders
      </Link>
    </div>
  )
}
