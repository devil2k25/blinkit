import React, { useState, useRef, useEffect } from 'react'
import { Search, X, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PRODUCTS, CATEGORIES } from '../../utils/mockData'

const TRENDING = ['Bananas', 'Milk', 'Eggs', 'Bread', 'Chicken', 'Coca-Cola']

export default function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false)
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (val.trim().length > 1) {
      const filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(val.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 8)
      setResults(filtered)
      setShowDropdown(true)
    } else {
      setResults([])
      setShowDropdown(focused)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  const selectProduct = (product) => {
    setShowDropdown(false)
    setQuery('')
    navigate(`/product/${product._id}`)
  }

  const selectTrending = (term) => {
    setQuery(term)
    const filtered = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 8)
    setResults(filtered)
    setShowDropdown(true)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className={`flex items-center gap-2 bg-white rounded-xl border-2 transition-all px-4 py-3 ${
        focused ? 'border-yellow shadow-md' : 'border-gray-200'
      }`}>
        <Search className={`w-5 h-5 flex-shrink-0 ${focused ? 'text-primary' : 'text-gray-400'}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => { setFocused(true); setShowDropdown(true) }}
          placeholder='Search for "eggs", "bread", "fruits"...'
          className="flex-1 outline-none text-sm text-dark placeholder-gray-400 bg-transparent"
        />
        {query && (
          <button onClick={clearSearch} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <>
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                Products
              </div>
              {results.map((product) => (
                <button
                  key={product._id}
                  onClick={() => selectProduct(product)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${product.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                    {product.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.unit} · {product.categoryName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-dark">₹{product.price}</p>
                    {product.discount > 0 && (
                      <p className="text-xs text-primary font-medium">{product.discount}% off</p>
                    )}
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                <TrendingUp className="w-3.5 h-3.5" />
                Trending Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map((term) => (
                  <button
                    key={term}
                    onClick={() => selectTrending(term)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 text-sm rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
