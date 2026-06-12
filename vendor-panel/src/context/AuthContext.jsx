import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const MOCK_VENDOR = {
  id: 'v1',
  name: 'Fresh Farms Store',
  email: 'vendor@freshfarms.com',
  storeName: 'Fresh Farms',
  role: 'vendor'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isOnline, setIsOnline] = useState(true)

  const login = (email, password) => {
    // Accept any credentials for demo
    setUser(MOCK_VENDOR)
    return true
  }

  const logout = () => {
    setUser(null)
  }

  const toggleOnline = () => {
    setIsOnline(prev => !prev)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isOnline, toggleOnline }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
