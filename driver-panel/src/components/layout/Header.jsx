import React from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { user, isOnline, toggleOnline, todayEarnings } = useAuth()

  return (
    <header
      className="h-[70px] flex items-center justify-between px-4 flex-shrink-0"
      style={{ backgroundColor: '#1a1a2e' }}
    >
      {/* Left: Logo + Name */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          B
        </div>
        <span className="text-sm font-semibold text-white leading-tight">
          {user?.name || 'Driver'}
        </span>
      </div>

      {/* Center: Online/Offline toggle */}
      <button
        onClick={toggleOnline}
        className={`rounded-full px-4 py-1 text-sm font-medium transition-all cursor-pointer select-none ${
          isOnline
            ? 'bg-green-500 text-white'
            : 'bg-gray-600 text-white'
        }`}
      >
        {isOnline ? '● Online' : '● Offline'}
      </button>

      {/* Right: Earnings */}
      <div className="text-right">
        <p className="text-yellow-400 font-bold text-base leading-none">₹{todayEarnings}</p>
        <p className="text-gray-400 text-xs mt-0.5">Today</p>
      </div>
    </header>
  )
}
