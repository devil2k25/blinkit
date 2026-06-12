import React, { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import { PRODUCTS, CATEGORIES } from '../utils/mockData'

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Biggest Discount' },
  { value: 'rating', label: 'Top Rated' },
]

export default function CategoryPage() {
  const { id } = useParams()
  const category = CATEGORIES.find(c => c._id === id) || CATEGORIES[0]

  const [sortBy, setSortBy] = useState('relevance')
  const [filterDiscount, setFilterDiscount] = useState(false)
  const [filterInStock, setFilterInStock] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)

  const baseProducts = id === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === id)

  const filteredProducts = useMemo(() => {
    let list = [...baseProducts]
    if (filterDiscount) list = list.filter(p => p.discount > 0)
    if (filterInStock) list = list.filter(p => p.stock > 0)
    switch (sortBy) {
      case 'price_asc': list.sort((a, b) => a.price - b.price); break
      case 'price_desc': list.sort((a, b) => b.price - a.price); break
      case 'discount': list.sort((a, b) => b.discount - a.discount); break
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
      default: break
    }
    return list
  }, [id, sortBy, filterDiscount, filterInStock, baseProducts])

  const activeFilters = [
    filterDiscount && { key: 'discount', label: 'On Sale', clear: () => setFilterDiscount(false) },
    filterInStock && { key: 'stock', label: 'In Stock', clear: () => setFilterInStock(false) },
  ].filter(Boolean)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-dark font-semibold">{category.name}</span>
      </div>

      {/* Category Header */}
      <div
        className="rounded-2xl p-6 mb-6 flex items-center gap-4"
        style={{ backgroundColor: category.color }}
      >
        <span className="text-5xl">{category.emoji}</span>
        <div>
          <h1 className="text-2xl font-black" style={{ color: category.textColor }}>
            {category.name}
          </h1>
          <p className="text-sm opacity-70 font-medium" style={{ color: category.textColor }}>
            {filteredProducts.length} products available
          </p>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterDiscount(!filterDiscount)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
              filterDiscount
                ? 'border-primary bg-primary text-white'
                : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            {filterDiscount && <X className="w-3 h-3" />}
            On Sale
          </button>
          <button
            onClick={() => setFilterInStock(!filterInStock)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
              filterInStock
                ? 'border-primary bg-primary text-white'
                : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            {filterInStock && <X className="w-3 h-3" />}
            In Stock
          </button>

          {/* Active filter chips */}
          {activeFilters.map(f => f && (
            <div key={f.key} className="hidden" />
          ))}
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:border-primary hover:text-primary transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Sort: {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
            <ChevronDown className="w-3 h-3" />
          </button>
          {showSortMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden min-w-48">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setShowSortMenu(false) }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    sortBy === opt.value
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">{category.emoji}</div>
          <h3 className="text-xl font-bold text-dark mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Try removing some filters</p>
          <button
            onClick={() => { setFilterDiscount(false); setFilterInStock(false) }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Other Categories */}
      <div className="mt-12">
        <h2 className="section-title">Browse Other Categories</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-3">
          {CATEGORIES.filter(c => c._id !== id).map(cat => (
            <Link
              key={cat._id}
              to={`/category/${cat._id}`}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:shadow-md transition-all text-center"
              style={{ backgroundColor: cat.color }}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs font-bold" style={{ color: cat.textColor }}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
