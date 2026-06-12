import React, { useState, useEffect } from 'react'
import { Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function TopBar() {
  const { user, isOnline } = useAuth()
  const [time, setTime] = useState(new Date())
  const [notifCount] = useState(3)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatted = time.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true
  })
  const dateStr = time.toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short'
  })

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 shadow-sm">
      <div className="flex-1">
        <h1 className="text-base font-semibold text-gray-800">{user?.storeName}</h1>
        <p className="text-xs text-gray-400">{dateStr}</p>
      </div>

      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        <span className={`text-xs font-semibold ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-gray-700">{formatted}</p>
      </div>

      <button className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">
        <Bell size={20} />
        {notifCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {notifCount}
          </span>
        )}
      </button>

      <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
        <div className="w-8 h-8 rounded-xl bg-[#0c831f] flex items-center justify-center text-white text-sm font-bold">
          {user?.name?.[0] || 'V'}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-700">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
        </div>
      </div>
    </header>
  )
}
