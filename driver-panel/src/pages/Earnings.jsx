import React, { useState } from 'react'
import { MOCK_DELIVERIES, WEEKLY_EARNINGS } from '../utils/mockData'
import { IndianRupee, TrendingUp, Package, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import toast from 'react-hot-toast'

const TABS = ['Today', 'This Week', 'This Month']

const completedDeliveries = MOCK_DELIVERIES.filter(d => d.status === 'completed')

export default function Earnings() {
  const [tab, setTab] = useState('Today')
  const [withdrawing, setWithdrawing] = useState(false)

  const todayEarnings = 650
  const weekEarnings = WEEKLY_EARNINGS.reduce((s, d) => s + d.amount, 0)
  const monthEarnings = 18240

  const displayEarnings = tab === 'Today' ? todayEarnings : tab === 'This Week' ? weekEarnings : monthEarnings
  const displayDeliveries = tab === 'Today' ? 8 : tab === 'This Week' ? WEEKLY_EARNINGS.reduce((s, d) => s + d.deliveries, 0) : 245

  const handleWithdraw = () => {
    setWithdrawing(true)
    setTimeout(() => {
      setWithdrawing(false)
      toast.success('Withdrawal request submitted!')
    }, 1500)
  }

  return (
    <div className="p-4 pb-20 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Earnings</h2>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-5 text-white shadow-lg">
        <p className="text-green-200 text-sm">Total Balance</p>
        <p className="text-4xl font-bold mt-1">₹2,450</p>
        <p className="text-green-200 text-xs mt-1">Available for withdrawal</p>
        <button
          onClick={handleWithdraw}
          disabled={withdrawing}
          className="mt-4 px-6 py-2.5 bg-white text-green-700 font-bold rounded-xl text-sm disabled:opacity-60"
        >
          {withdrawing ? 'Processing...' : 'Withdraw to Bank'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Period Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Earnings', value: `₹${displayEarnings.toLocaleString()}`, icon: IndianRupee, color: 'text-green-600' },
          { label: 'Deliveries', value: displayDeliveries, icon: Package, color: 'text-blue-600' },
          { label: 'Avg/Delivery', value: `₹${Math.round(displayEarnings / displayDeliveries)}`, icon: TrendingUp, color: 'text-purple-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-3 shadow-sm text-center">
            <Icon size={20} className={`${color} mx-auto mb-1`} />
            <p className="font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Weekly Earnings</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={WEEKLY_EARNINGS} barSize={22}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
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

      {/* Recent Deliveries Earnings */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">Recent Deliveries</h3>
        <div className="space-y-3">
          {completedDeliveries.map(d => (
            <div key={d.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                  <Package size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{d.orderId}</p>
                  <p className="text-xs text-gray-400">{d.delivery.customerName} · {d.distance}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">+₹{d.earnings}</p>
                <p className="text-xs text-gray-400">{d.estimatedTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
