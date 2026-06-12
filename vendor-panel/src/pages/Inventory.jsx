import React, { useState } from 'react'
import { MOCK_PRODUCTS } from '../utils/mockData'
import { AlertTriangle, CheckCircle, XCircle, Edit2, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Inventory() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editStock, setEditStock] = useState('')

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ? true :
      filter === 'out' ? p.stock === 0 :
      filter === 'low' ? p.stock > 0 && p.stock < 10 :
      p.stock >= 10
    return matchSearch && matchFilter
  })

  const outOfStock = products.filter(p => p.stock === 0).length
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length
  const inStock = products.filter(p => p.stock >= 10).length

  const startEdit = (id, currentStock) => {
    setEditingId(id)
    setEditStock(String(currentStock))
  }

  const saveEdit = (id) => {
    const newStock = Math.max(0, parseInt(editStock) || 0)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p))
    setEditingId(null)
    toast.success('Stock updated!')
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-100', icon: XCircle, iconColor: 'text-red-500' }
    if (stock < 10) return { label: 'Low Stock', color: 'text-yellow-700 bg-yellow-100', icon: AlertTriangle, iconColor: 'text-yellow-500' }
    return { label: 'In Stock', color: 'text-green-700 bg-green-100', icon: CheckCircle, iconColor: 'text-green-500' }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage stock levels for your products</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-red-500">
          <XCircle size={20} className="text-red-500 mb-1" />
          <p className="text-2xl font-bold text-gray-800">{outOfStock}</p>
          <p className="text-xs text-gray-500">Out of Stock</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-yellow-500">
          <AlertTriangle size={20} className="text-yellow-500 mb-1" />
          <p className="text-2xl font-bold text-gray-800">{lowStock}</p>
          <p className="text-xs text-gray-500">Low Stock</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-green-500">
          <CheckCircle size={20} className="text-green-500 mb-1" />
          <p className="text-2xl font-bold text-gray-800">{inStock}</p>
          <p className="text-xs text-gray-500">In Stock</p>
        </div>
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
        <div className="flex gap-2">
          {[['all', 'All'], ['out', 'Out of Stock'], ['low', 'Low Stock'], ['ok', 'In Stock']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap ${filter === val ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(product => {
              const status = getStockStatus(product.stock)
              const StatusIcon = status.icon
              return (
                <tr key={product.id} className={`hover:bg-gray-50 ${product.stock === 0 ? 'bg-red-50/30' : product.stock < 10 ? 'bg-yellow-50/30' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.unit}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold text-gray-800">₹{product.discountPrice || product.price}</p>
                    {product.discountPrice && (
                      <p className="text-xs text-gray-400 line-through">₹{product.price}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {editingId === product.id ? (
                      <div className="flex items-center gap-2 justify-center">
                        <input
                          type="number"
                          value={editStock}
                          onChange={e => setEditStock(e.target.value)}
                          className="w-16 text-center px-2 py-1 border border-green-400 rounded-lg text-sm font-bold focus:outline-none"
                          autoFocus
                          onKeyDown={e => e.key === 'Enter' && saveEdit(product.id)}
                        />
                        <button onClick={() => saveEdit(product.id)} className="px-2 py-1 bg-green-500 text-white text-xs rounded-lg">✓</button>
                        <button onClick={() => setEditingId(null)} className="px-2 py-1 bg-gray-200 text-xs rounded-lg">✕</button>
                      </div>
                    ) : (
                      <span className={`text-sm font-bold ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-gray-800'}`}>
                        {product.stock}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      <StatusIcon size={12} className={status.iconColor} />
                      {status.label}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => startEdit(product.id, product.stock)}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}
