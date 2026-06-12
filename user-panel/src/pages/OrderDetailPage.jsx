import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PRODUCTS } from '../utils/mockData'
import { CheckCircle, Clock, Package, Truck, MapPin, ArrowLeft, Phone } from 'lucide-react'

const MOCK_ORDERS = [
  {
    id: 'ord_001',
    status: 'out_for_delivery',
    date: new Date(Date.now() - 30 * 60000).toISOString(),
    items: [
      { ...PRODUCTS[0], quantity: 2 },
      { ...PRODUCTS[6], quantity: 1 },
    ],
    address: { label: 'Home', street: '42, Sector 15, Dwarka', city: 'New Delhi', pincode: '110078' },
    subtotal: 113,
    deliveryFee: 20,
    discount: 10,
    total: 123,
    paymentMethod: 'cod',
    driver: { name: 'Rajesh Kumar', phone: '+91 98765 43210', vehicle: 'Bike - DL 5S AB 1234' },
    estimatedDelivery: new Date(Date.now() + 10 * 60000).toISOString(),
  },
  {
    id: 'ord_002',
    status: 'delivered',
    date: new Date(Date.now() - 2 * 3600000).toISOString(),
    items: [
      { ...PRODUCTS[4], quantity: 1 },
      { ...PRODUCTS[9], quantity: 3 },
    ],
    address: { label: 'Home', street: '42, Sector 15, Dwarka', city: 'New Delhi', pincode: '110078' },
    subtotal: 296,
    deliveryFee: 20,
    discount: 0,
    total: 316,
    paymentMethod: 'online',
    driver: { name: 'Suresh Yadav', phone: '+91 87654 32109', vehicle: 'Scooter - DL 4C XY 5678' },
    deliveredAt: new Date(Date.now() - 1.5 * 3600000).toISOString(),
  },
]

const TIMELINE_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Package, desc: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, desc: 'Store confirmed your order' },
  { key: 'preparing', label: 'Preparing', icon: Clock, desc: 'Store is packing your items' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, desc: 'Driver is on the way' },
  { key: 'delivered', label: 'Delivered', icon: MapPin, desc: 'Order delivered successfully' },
]

const STATUS_ORDER = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']

function getStepIndex(status) {
  const idx = STATUS_ORDER.indexOf(status)
  return idx >= 0 ? idx : 0
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const order = MOCK_ORDERS.find(o => o.id === id) || MOCK_ORDERS[0]
  const currentStep = getStepIndex(order.status)

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

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Order #{order.id.split('_')[1]}</h1>
          <p className="text-gray-500 text-sm">
            {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span className={`ml-auto text-xs font-medium px-3 py-1 rounded-full ${statusColor[order.status]}`}>
          {statusLabel[order.status]}
        </span>
      </div>

      {/* ETA / Delivered */}
      {order.status === 'out_for_delivery' && order.estimatedDelivery && (
        <div className="bg-primary rounded-2xl p-4 text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
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
            <p className="font-bold text-green-700">Delivered!</p>
            <p className="text-green-600 text-sm">
              {new Date(order.deliveredAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Order Timeline</h3>
          <div className="space-y-1">
            {TIMELINE_STEPS.map((step, i) => {
              const Icon = step.icon
              const done = i <= currentStep
              const active = i === currentStep
              return (
                <div key={step.key} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-primary' : 'bg-gray-100'}`}>
                      <Icon size={14} className={done ? 'text-white' : 'text-gray-400'} />
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div className={`w-0.5 h-8 ${done && i < currentStep ? 'bg-primary' : 'bg-gray-100'}`} />
                    )}
                  </div>
                  <div className="pt-1 pb-2">
                    <p className={`text-sm font-medium ${done ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</p>
                    {active && <p className="text-xs text-primary mt-0.5">{step.desc}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Driver Info */}
      {['out_for_delivery', 'delivered'].includes(order.status) && order.driver && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">Delivery Partner</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">
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
          {order.items.map(item => (
            <div key={item._id} className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">{item.unit} × {item.quantity}</p>
              </div>
              <p className="font-bold text-gray-800">₹{(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-2">Delivery Address</h3>
        <div className="flex items-start gap-2">
          <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">{order.address.label}</p>
            <p className="text-sm text-gray-600">{order.address.street}, {order.address.city} - {order.address.pincode}</p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">Bill Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Item Total</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery Fee</span>
            <span>₹{order.deliveryFee}</span>
          </div>
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
          <p className="text-xs text-gray-400 mt-1">
            Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
          </p>
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
