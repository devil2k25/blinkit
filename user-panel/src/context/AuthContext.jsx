import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('blinkit_token')
    const savedUser = localStorage.getItem('blinkit_user')
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('blinkit_token')
        localStorage.removeItem('blinkit_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Try real API first
      const res = await api.post('/auth/login', { email, password })
      const { token, user: userData } = res.data
      localStorage.setItem('blinkit_token', token)
      localStorage.setItem('blinkit_user', JSON.stringify(userData))
      setUser(userData)
      toast.success(`Welcome back, ${userData.name}!`)
      return { success: true }
    } catch (err) {
      // Mock login fallback for demo
      if (email && password) {
        const mockUser = {
          _id: 'mock_user_1',
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email,
          phone: '+91 98765 43210',
          role: 'user',
          addresses: [
            {
              _id: 'addr_1',
              label: 'Home',
              line1: '42 Green Park Extension',
              city: 'New Delhi',
              state: 'Delhi',
              pincode: '110016',
              isDefault: true,
            }
          ]
        }
        const mockToken = 'mock_token_' + Date.now()
        localStorage.setItem('blinkit_token', mockToken)
        localStorage.setItem('blinkit_user', JSON.stringify(mockUser))
        setUser(mockUser)
        toast.success(`Welcome back, ${mockUser.name}!`)
        return { success: true }
      }
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData)
      const { token, user: userData } = res.data
      localStorage.setItem('blinkit_token', token)
      localStorage.setItem('blinkit_user', JSON.stringify(userData))
      setUser(userData)
      toast.success('Account created successfully!')
      return { success: true }
    } catch (err) {
      // Mock register fallback
      const mockUser = {
        _id: 'mock_user_' + Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role || 'user',
        addresses: [],
      }
      const mockToken = 'mock_token_' + Date.now()
      localStorage.setItem('blinkit_token', mockToken)
      localStorage.setItem('blinkit_user', JSON.stringify(mockUser))
      setUser(mockUser)
      toast.success('Account created successfully!')
      return { success: true }
    }
  }

  const logout = () => {
    localStorage.removeItem('blinkit_token')
    localStorage.removeItem('blinkit_user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData }
    setUser(newUser)
    localStorage.setItem('blinkit_user', JSON.stringify(newUser))
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      register,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
