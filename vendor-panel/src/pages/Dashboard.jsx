import React, { useState } from 'react'
import {
  ShoppingBag, Clock, IndianRupee, TrendingUp,
  CheckCircle, XCircle, Store
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { MOCK_ORDERS, MOCK_EARNINGS } from '../utils/mockData'
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

function formatStatus(status) {
  return status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function Dashboard() {
  const { isOnline, toggleOnline } = useAuth()
  const [orders, setOrders] = useState(MOCK_ORDERS)

  const pendingOrders = orders.filter(o => o.status === 'pending')
  const todayRevenue = 8420
  const totalRevenue = 234560
  const todayOrders = 23

  const chartData = MOCK_EARNINGS.daily.slice(-7).map(d => ({
    date: d.date,
    revenue: d.earnings,
  }))

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const handleAccept = (orderId) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: 'confirmed' } : o)
    )
    toast.success('Order accepted!')
  }

  const handleReject = (orderId) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o)
    )
    toast.error('Order rejected')
  }

  const statsCards = [
    {
      label: "Today's Orders",
      value: todayOrders,
      icon: ShoppingBag,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders.length,
      icon: Clock,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-700',
      pulse: true,
    },
    {
      label: "Today's Revenue",
      value: `₹${todayRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-700',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-700',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={22} className={card.iconColor} />
                {card.pulse && (
                  <span className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse ml-7 -mt-7" />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                <p className={`text-2xl font-bold mt-1 ${card.textColor}`}>{card.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: 2 cols */}
        <div className="xl:col-span-2 space-y-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
              <a href="/orders" className="text-xs text-[#0c831f] font-medium hover:underline">View all</a>
            </div>
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div
                  key={order.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    order.status === 'pending'
                      ? 'border-yellow-200 bg-yellow-50 animate-pulse'
                      : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{order.orderId}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadgeClass(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {order.customer?.name || order.customerName} &mdash; ₹{order.total}
                    </p>
                  </div>
                  {order.status === 'pending' && (
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => handleAccept(order.id)}
                        className="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
                        title="Accept"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                        title="Reject"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Revenue (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c831f" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0c831f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0c831f"
                  strokeWidth={2.5}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: 1 col */}
        <div className="space-y-6">
          {/* Store Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Store Status</h2>
            <div className="flex flex-col items-center gap-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isOnline ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Store size={36} className={isOnline ? 'text-green-600' : 'text-gray-400'} />
              </div>
              <div className="text-center">
                <p className={`text-xl font-bold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {isOnline ? 'Accepting orders' : 'Not accepting orders'}
                </p>
              </div>
              <button
                onClick={toggleOnline}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isOnline
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isOnline ? 'Go Offline' : 'Go Online'}
              </button>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Top Products</h2>
            <div className="space-y-3">
              {MOCK_EARNINGS.productEarnings.slice(0, 5).map((item, index) => (
                <div key={item.product} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{item.product}</p>
                    <p className="text-xs text-gray-400">{item.orders} orders</p>
                  </div>
                  <span className="text-xs font-semibold text-green-700">
                    ₹{item.revenue.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
