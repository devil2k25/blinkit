import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Plus, Minus } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['Fruits & Vegetables', 'Dairy & Eggs', 'Bakery', 'Beverages', 'Snacks', 'Meat & Fish', 'Personal Care', 'Baby Care', 'Breakfast', 'Frozen Foods', 'Staples', 'Cleaning', 'Health & Wellness']
const UNITS = ['100g', '200g', '250g', '500g', '1kg', '2kg', '5kg', '100ml', '250ml', '500ml', '1L', '2L', '1 piece', '6 pieces', '12 pieces', '1 dozen', '1 pack']

export default function AddProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Fruits & Vegetables',
    price: '',
    discountPrice: '',
    unit: '500g',
    stock: 0,
    active: true,
  })
  const [saving, setSaving] = useState(false)

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.price) return toast.error('Name and price are required')
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success('Product added successfully!')
      navigate('/products')
    }, 1000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>
          <p className="text-gray-500 text-sm">Add a new product to your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-3">Product Image</h3>
          <div className="border-2 border-dashed border-gray-200 rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors bg-gray-50">
            <Upload size={28} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">Click to upload image</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-700">Basic Information</h3>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Product Name *</label>
            <input
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="e.g. Amul Full Cream Milk"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Describe your product..."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Category *</label>
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

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-700">Pricing</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">MRP (₹) *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => update('price', e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Selling Price (₹)</label>
              <input
                type="number"
                value={form.discountPrice}
                onChange={e => update('discountPrice', e.target.value)}
                placeholder="Leave blank if no discount"
                min="0"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          {form.price && form.discountPrice && Number(form.discountPrice) < Number(form.price) && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
              <span className="text-green-600 text-sm">
                Discount: {Math.round((1 - form.discountPrice / form.price) * 100)}% off
              </span>
            </div>
          )}
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Inventory</h3>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Initial Stock</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => update('stock', Math.max(0, form.stock - 1))}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={form.stock}
                onChange={e => update('stock', Math.max(0, parseInt(e.target.value) || 0))}
                className="w-24 text-center px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
              />
              <button
                type="button"
                onClick={() => update('stock', form.stock + 1)}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-700">Product Status</h3>
              <p className="text-xs text-gray-400 mt-0.5">Active products are visible to customers</p>
            </div>
            <button
              type="button"
              onClick={() => update('active', !form.active)}
              className={`w-12 h-6 rounded-full transition-colors ${form.active ? 'bg-green-500' : 'bg-gray-300'} relative`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${form.active ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 pb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
