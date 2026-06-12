import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ icon: Icon, value, label, trend, trendValue, iconBg = 'bg-green-100', iconColor = 'text-primary' }) {
  const isPositive = trend === 'up'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${iconBg}`}>
        <Icon className={`${iconColor}`} size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        {trendValue !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{trendValue}% vs last week</span>
          </div>
        )}
      </div>
    </div>
  )
}
