import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Truck, IndianRupee, User } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home', icon: Home, path: '/dashboard' },
  { label: 'Deliveries', icon: Truck, path: '/deliveries' },
  { label: 'Earnings', icon: IndianRupee, path: '/earnings' },
  { label: 'Profile', icon: User, path: '/profile' }
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 shadow-lg h-16 z-50 flex">
      {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center transition-colors ${
              isActive ? 'text-green-700' : 'text-gray-400'
            }`
          }
        >
          <Icon size={20} />
          <span className="text-xs mt-1">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
