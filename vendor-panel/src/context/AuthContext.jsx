import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const MOCK_VENDOR = {
  id: 'v1',
  name: 'Fresh Farms Store',
  email: 'vendor@freshfarms.com',
  storeName: 'Fresh Farms',
  role: 'vendor',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  const login = (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser(MOCK_VENDOR)
        setIsAuthenticated(true)
        resolve({ success: true, user: MOCK_VENDOR })
      }, 600)
    })
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  const toggleOnline = () => setIsOnline((prev) => !prev)

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isOnline, login, logout, toggleOnline }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
