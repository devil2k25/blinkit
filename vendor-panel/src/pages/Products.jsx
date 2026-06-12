import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_PRODUCTS } from '../utils/mockData'
import { Plus, Search, Edit2, Trash2, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'Fruits & Vegetables', 'Dairy & Eggs', 'Bakery', 'Beverages', 'Snacks', 'Personal Care', 'Staples', 'Cleaning', 'Health & Wellness', 'Breakfast']

const ProductEmoji = ({ cat }) => {
  const map = { 'Fruits & Vegetables': '🥦', 'Dairy & Eggs': '🥛', 'Bakery': '🍞', 'Beverages': '🥤', 'Snacks': '🍿', 'Personal Care': '🧴', 'Staples': '🌾', 'Cleaning': '🧹', 'Health & Wellness': '💊', 'Breakfast': '🥣' }
  return <span className="text-2xl">{map[cat] || '📦'}</span>
}

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [deleting, setDeleting] = useState(null)

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || p.category === category
    return matchSearch && matchCat
  })

  const toggleActive = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p))
    const p = products.find(p => p.id === id)
    toast.success(`${p?.name} ${p?.active ? 'deactivated' : 'activated'}`)
  }

  const handleDelete = (id) => {
    if (deleting === id) {
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success('Product deleted')
      setDeleting(null)
    } else {
      setDeleting(id)
      setTimeout(() => setDeleting(null), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} products in your store</p>
        </div>
        <button
          onClick={() => navigate('/products/add')}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(product => (
          <div key={product.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${!product.active ? 'opacity-60' : ''}`}>
            {/* Product Image */}
            <div className="h-28 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <ProductEmoji cat={product.category} />
            </div>

            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.unit} · {product.category}</p>
                </div>
                <button
                  onClick={() => toggleActive(product.id)}
                  className={product.active ? 'text-green-500' : 'text-gray-300'}
                >
                  {product.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold text-gray-800">₹{product.discountPrice || product.price}</span>
                {product.discountPrice && (
                  <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                )}
              </div>

              {/* Stock */}
              <div className="mt-2 flex items-center gap-1.5">
                {product.stock === 0 ? (
                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">Out of Stock</span>
                ) : product.stock < 10 ? (
                  <div className="flex items-center gap-1">
                    <AlertTriangle size={12} className="text-yellow-500" />
                    <span className="text-xs text-yellow-600">Low: {product.stock} left</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(`/products/edit/${product.id}`)}
                  className="flex-1 py-1.5 flex items-center justify-center gap-1 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-lg text-xs ${deleting === product.id ? 'bg-red-500 text-white' : 'border border-red-200 text-red-500 hover:bg-red-50'}`}
                >
                  <Trash2 size={12} />
                  {deleting === product.id ? 'Confirm?' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-3">📦</p>
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  )
}
