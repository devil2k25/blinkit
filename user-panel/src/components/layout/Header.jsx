import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Search, ShoppingCart, User, ChevronDown,
  LogOut, Package, UserCircle, Menu, X, Zap
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { PRODUCTS } from '../../utils/mockData'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { cartCount, setIsCartOpen } = useCart()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const userMenuRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim().length > 1) {
      const filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
      setSearchResults(filtered)
      setShowSearch(true)
    } else {
      setSearchResults([])
      setShowSearch(false)
    }
  }

  const handleSelectProduct = (product) => {
    setShowSearch(false)
    setSearchQuery('')
    navigate(`/product/${product._id}`)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-extrabold text-primary tracking-tight hidden sm:block">
              blinkit
            </span>
          </Link>

          {/* Location */}
          <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0">
            <MapPin className="w-4 h-4 text-primary" />
            <div className="text-left">
              <div className="text-xs text-gray-500 leading-none">Delivering to</div>
              <div className="text-sm font-semibold text-dark flex items-center gap-1">
                Connaught Place, Delhi
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder='Search "milk eggs bread..."'
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setShowSearch(true)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm border-2 border-transparent focus:border-yellow focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Search Dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                {searchResults.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleSelectProduct(product)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${product.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                      {product.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-dark truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.unit}</p>
                    </div>
                    <div className="text-sm font-bold text-primary">₹{product.price}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors flex-shrink-0"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:block text-sm font-semibold">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow text-dark text-xs font-black rounded-full flex items-center justify-center animate-bounce-in">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-semibold text-dark max-w-24 truncate">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-dark truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                    >
                      <UserCircle className="w-4 h-4 text-gray-400" />
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                    >
                      <Package className="w-4 h-4 text-gray-400" />
                      My Orders
                    </Link>
                    <button
                      onClick={() => { logout(); setShowUserMenu(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary font-semibold text-sm rounded-lg hover:bg-primary hover:text-white transition-all flex-shrink-0"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block">Login</span>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 animate-fade-in">
            <div className="flex items-center gap-2 px-2 py-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Delivering to: <strong>Connaught Place, Delhi</strong></span>
            </div>
            {isAuthenticated && (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:text-primary">
                  <UserCircle className="w-4 h-4" /> My Profile
                </Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:text-primary">
                  <Package className="w-4 h-4" /> My Orders
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
