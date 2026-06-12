import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Box from '@mui/material/Box'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Deliveries from './pages/Deliveries'
import DeliveryDetail from './pages/DeliveryDetail'
import Earnings from './pages/Earnings'
import Profile from './pages/Profile'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header />
      <Box component="main" sx={{ flex: 1, overflowY: 'auto', pb: '64px' }}>
        {children}
      </Box>
      <BottomNav />
    </Box>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/deliveries"
        element={
          <ProtectedRoute>
            <Layout><Deliveries /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/deliveries/:id"
        element={
          <ProtectedRoute>
            <Layout><DeliveryDetail /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/earnings"
        element={
          <ProtectedRoute>
            <Layout><Earnings /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: '#f5f6fa',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 430,
              backgroundColor: '#fff',
              minHeight: '100vh',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <AppRoutes />
            <Toaster
              position="top-center"
              toastOptions={{ style: { maxWidth: '380px' } }}
            />
          </Box>
        </Box>
      </BrowserRouter>
    </AuthProvider>
  )
}
