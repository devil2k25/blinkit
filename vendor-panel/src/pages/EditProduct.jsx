import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MOCK_PRODUCTS } from '../utils/mockData'
import { ArrowLeft, Plus, Minus } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['Fruits & Vegetables', 'Dairy & Eggs', 'Bakery', 'Beverages', 'Snacks', 'Meat & Fish', 'Personal Care', 'Baby Care', 'Breakfast', 'Frozen Foods', 'Staples', 'Cleaning', 'Health & Wellness']
const UNITS = ['100g', '200g', '250g', '500g', '1kg', '2kg', '5kg', '100ml', '250ml', '500ml', '1L', '2L', '1 piece', '6 pieces', '12 pieces', '1 dozen', '1 pack']

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const original = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0]
  const [form, setForm] = useState({ ...original })
  const [saving, setSaving] = useState(false)

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success('Product updated!')
      navigate('/products')
    }, 1000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-gray-500 text-sm">{form.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-700">Basic Information</h3>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Product Name *</label>
            <input
              value={form.name}
              onChange={e => update('name', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => update('category', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Unit</label>
              <select
                value={form.unit}
                onChange={e => update('unit', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-700">Pricing</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">MRP (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={e => update('price', Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Selling Price (₹)</label>
              <input
                type="number"
                value={form.discountPrice || ''}
                onChange={e => update('discountPrice', e.target.value ? Number(e.target.value) : null)}
                placeholder="No discount"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Stock</h3>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => update('stock', Math.max(0, form.stock - 1))}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <Minus size={16} />
            </button>
            <input
              type="number"
              value={form.stock}
              onChange={e => update('stock', Math.max(0, parseInt(e.target.value) || 0))}
              className="w-24 text-center px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button type="button" onClick={() => update('stock', form.stock + 1)}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-700">Active</h3>
              <p className="text-xs text-gray-400 mt-0.5">Visible to customers</p>
            </div>
            <button type="button" onClick={() => update('active', !form.active)}
              className={`w-12 h-6 rounded-full transition-colors ${form.active ? 'bg-green-500' : 'bg-gray-300'} relative`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${form.active ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 pb-4">
          <button type="button" onClick={() => navigate(-1)}
            className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
