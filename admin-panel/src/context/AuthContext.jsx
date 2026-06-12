import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('adminUser')
    const token = localStorage.getItem('adminToken')
    if (stored && token) {
      setAdmin(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Mock login - accept admin@blinkit.com / admin123
    if (email === 'admin@blinkit.com' && password === 'admin123') {
      const adminUser = {
        id: 1,
        name: 'Rahul Sharma',
        email: 'admin@blinkit.com',
        role: 'admin',
        avatar: 'RS',
      }
      const token = 'mock-admin-jwt-token-xyz'
      localStorage.setItem('adminToken', token)
      localStorage.setItem('adminUser', JSON.stringify(adminUser))
      setAdmin(adminUser)
      return { success: true }
    }
    return { success: false, message: 'Invalid credentials' }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
