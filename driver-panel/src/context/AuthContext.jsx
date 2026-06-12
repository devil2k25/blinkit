import React, { createContext, useContext, useState } from 'react'

const MOCK_USER = {
  id: 'd1',
  name: 'Rajesh Kumar',
  phone: '+91 98765 43210',
  vehicle: 'Bike',
  vehicleNumber: 'DL 5S AB 1234',
  licenseNumber: 'DL-1420110012345',
  rating: 4.8,
  totalDeliveries: 1247,
  role: 'driver'
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [todayEarnings] = useState(650)
  const [activeDelivery, setActiveDeliveryState] = useState(null)

  const login = (phone, password) => {
    setUser(MOCK_USER)
    setIsAuthenticated(true)
    return Promise.resolve()
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setIsOnline(false)
    setActiveDeliveryState(null)
  }

  const toggleOnline = () => {
    setIsOnline(prev => !prev)
  }

  const setActiveDelivery = (delivery) => {
    setActiveDeliveryState(delivery)
  }

  const clearActiveDelivery = () => {
    setActiveDeliveryState(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isOnline,
      todayEarnings,
      activeDelivery,
      login,
      logout,
      toggleOnline,
      setActiveDelivery,
      clearActiveDelivery
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
