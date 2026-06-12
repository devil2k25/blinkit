import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Zap, Mail, Lock, User, Phone, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ROLES = [
  { value: 'user', label: '🛒 Customer', desc: 'Buy groceries' },
  { value: 'vendor', label: '🏪 Vendor', desc: 'Sell products' },
  { value: 'driver', label: '🛵 Driver', desc: 'Deliver orders' },
]

export default function Register() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  if (isAuthenticated) {
    navigate('/', { replace: true })
    return null
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters'
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.phone) errs.phone = 'Phone number is required'
    else if (!/^\+?[0-9]{10,13}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid phone number'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    const result = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: form.role,
    })
    setLoading(false)
    if (result.success) navigate('/', { replace: true })
  }

  const Field = ({ label, name, type = 'text', icon: Icon, placeholder, extra }) => (
    <div>
      <label className="block text-sm font-semibold text-dark mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type={type}
          value={form[name]}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          placeholder={placeholder}
          className={`input-field pl-10 ${extra || ''} ${errors[name] ? 'border-red-400 focus:ring-red-400' : ''}`}
        />
      </div>
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-2/5 gradient-green items-center justify-center p-12">
        <div className="text-white max-w-sm text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black mb-4">Join Blinkit Today</h1>
          <p className="text-green-100 leading-relaxed mb-8">
            Create your account and get groceries delivered in 10 minutes.
          </p>
          <div className="space-y-3">
            {['Free delivery on first 3 orders', 'Exclusive deals & offers', 'Track orders in real-time', '24/7 customer support'].map(b => (
              <div key={b} className="flex items-center gap-2 text-sm text-green-100">
                <CheckCircle className="w-4 h-4 text-yellow flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center p-6 sm:p-10">
        <div className="w-full max-w-lg py-4">
          {/* Logo (mobile) */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-extrabold text-primary">blinkit</span>
          </div>

          <h2 className="text-3xl font-black text-dark mb-1">Create Account</h2>
          <p className="text-gray-500 mb-6">Sign up and get groceries in 10 mins</p>

          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-dark mb-2">I want to join as</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(role => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: role.value })}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    form.role === role.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{role.label.split(' ')[0]}</div>
                  <div className="text-xs font-bold text-dark">{role.label.split(' ').slice(1).join(' ')}</div>
                  <div className="text-xs text-gray-500">{role.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name" name="name" icon={User} placeholder="Rahul Sharma" />
            <Field label="Email Address" name="email" type="email" icon={Mail} placeholder="you@example.com" />
            <Field label="Phone Number" name="phone" type="tel" icon={Phone} placeholder="+91 98765 43210" />

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <p className="text-xs text-gray-500">
              By registering, you agree to our{' '}
              <a href="#" className="text-primary font-semibold">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary font-semibold">Privacy Policy</a>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
