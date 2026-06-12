import React, { useState } from 'react'
import { MOCK_EARNINGS } from '../utils/mockData'
import { IndianRupee, TrendingUp, Package, ArrowUpRight, CheckCircle, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import toast from 'react-hot-toast'

const TABS = ['Last 7 Days', 'Last 30 Days']

export default function Earnings() {
  const [tab, setTab] = useState('Last 7 Days')
  const [requesting, setRequesting] = useState(false)

  const chartData = tab === 'Last 7 Days'
    ? MOCK_EARNINGS.daily.slice(-7)
    : MOCK_EARNINGS.daily

  const totalRevenue = MOCK_EARNINGS.daily.reduce((s, d) => s + d.earnings, 0)
  const thisMonth = MOCK_EARNINGS.daily.slice(-30).reduce((s, d) => s + d.earnings, 0)
  const today = MOCK_EARNINGS.daily[MOCK_EARNINGS.daily.length - 1].earnings

  const handlePayoutRequest = () => {
    setRequesting(true)
    setTimeout(() => {
      setRequesting(false)
      toast.success('Payout request submitted! ₹32,450 will be credited in 2-3 business days')
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Earnings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Track your store revenue and payouts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Today's Revenue", value: `₹${today.toLocaleString()}`, icon: IndianRupee, color: 'bg-green-500', trend: '+12%' },
          { label: "This Month", value: `₹${thisMonth.toLocaleString()}`, icon: TrendingUp, color: 'bg-blue-500', trend: '+8%' },
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: Package, color: 'bg-purple-500', trend: '+23%' },
        ].map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                <Icon size={18} className="text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <ArrowUpRight size={14} />
                {trend}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Payout Card */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-200 text-sm">Pending Payout</p>
            <p className="text-3xl font-bold mt-1">₹32,450</p>
            <p className="text-green-200 text-xs mt-1">Next settlement: 16 Jun 2024</p>
          </div>
          <button
            onClick={handlePayoutRequest}
            disabled={requesting}
            className="px-5 py-2.5 bg-white text-green-700 font-bold rounded-xl text-sm disabled:opacity-60"
          >
            {requesting ? 'Processing...' : 'Request Payout'}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Revenue Chart</h3>
          <div className="flex gap-2">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${tab === t ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={tab === 'Last 7 Days' ? 28 : 8}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              interval={tab === 'Last 7 Days' ? 0 : 4}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']}
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="earnings" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Top Earning Products</h3>
        <div className="space-y-3">
          {MOCK_EARNINGS.productEarnings.slice(0, 6).map((item, i) => (
            <div key={item.product} className="flex items-center gap-3">
              <span className="w-6 text-sm font-bold text-gray-400">#{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-800">{item.product}</p>
                  <p className="text-sm font-bold text-green-600">₹{item.revenue.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-1.5 flex-1 bg-gray-100 rounded-full mr-3 overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(item.revenue / MOCK_EARNINGS.productEarnings[0].revenue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{item.orders} orders</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Payout History</h3>
        <div className="space-y-3">
          {MOCK_EARNINGS.payouts.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${p.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                {p.status === 'paid'
                  ? <CheckCircle size={18} className="text-green-500" />
                  : <Clock size={18} className="text-yellow-500" />
                }
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">₹{p.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{p.date} · {p.txId}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-700'}`}>
                {p.status === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
