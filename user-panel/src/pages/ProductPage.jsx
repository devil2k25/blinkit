import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Plus, Minus, ShoppingCart, Zap, Star, ArrowLeft, Share2, Heart } from 'lucide-react'
import { PRODUCTS, CATEGORIES } from '../utils/mockData'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ui/ProductCard'
import toast from 'react-hot-toast'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, updateQuantity, getQuantity, isInCart, setIsCartOpen } = useCart()

  const product = PRODUCTS.find(p => p._id === id)
  const [wishlist, setWishlist] = useState(false)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-dark mb-2">Product not found</h2>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    )
  }

  const quantity = getQuantity(product._id)
  const inCart = isInCart(product._id)
  const related = PRODUCTS.filter(p => p.category === product.category && p._id !== product._id).slice(0, 5)
  const category = CATEGORIES.find(c => c._id === product.category)

  const handleAdd = () => addToCart(product)
  const handleIncrease = () => updateQuantity(product._id, quantity + 1)
  const handleDecrease = () => updateQuantity(product._id, quantity - 1)

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const savings = product.originalPrice - product.price

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        {category && (
          <>
            <Link to={`/category/${category._id}`} className="hover:text-primary">{category.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-dark font-medium truncate">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-3">
          <div className={`aspect-square rounded-3xl bg-gradient-to-br ${product.gradient} flex items-center justify-center relative`}>
            <span className="text-8xl sm:text-9xl">{product.emoji}</span>
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-black px-3 py-1 rounded-full shadow-lg">
                {product.discount}% OFF
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-3xl">
                <span className="text-2xl font-black text-gray-500">Out of Stock</span>
              </div>
            )}
          </div>
          {/* Thumbnail placeholders */}
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-2xl cursor-pointer border-2 ${i === 1 ? 'border-primary' : 'border-transparent hover:border-gray-200'}`}
              >
                {product.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                {category && (
                  <Link
                    to={`/category/${category._id}`}
                    className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full"
                  >
                    {category.emoji} {category.name}
                  </Link>
                )}
                <h1 className="text-2xl sm:text-3xl font-black text-dark mt-2">{product.name}</h1>
                <p className="text-gray-500 text-sm mt-1">{product.unit}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setWishlist(!wishlist); toast.success(wishlist ? 'Removed from wishlist' : 'Added to wishlist') }}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-red-300 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${wishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-primary transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 text-yellow fill-yellow" />
                <span className="text-sm font-bold text-dark">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-500">{product.reviews} reviews</span>
            </div>
          </div>

          {/* Delivery */}
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary fill-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-dark">Delivery in {product.deliveryTime}</p>
              <p className="text-xs text-gray-500">Express dark store delivery</p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-dark">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xl text-gray-400 line-through mb-1">₹{product.originalPrice}</span>
                <span className="text-green-600 font-bold text-sm mb-1">Save ₹{savings}</span>
              </>
            )}
          </div>

          {/* Stock */}
          {product.stock > 0 && product.stock <= 10 && (
            <div className="text-sm font-semibold text-orange-500 bg-orange-50 px-3 py-2 rounded-lg">
              ⚠️ Only {product.stock} left in stock
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex items-center gap-3">
            {product.stock === 0 ? (
              <button disabled className="flex-1 bg-gray-100 text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed">
                Out of Stock
              </button>
            ) : inCart ? (
              <>
                <div className="flex items-center gap-3 bg-primary rounded-xl p-1">
                  <button
                    onClick={handleDecrease}
                    className="w-10 h-10 flex items-center justify-center text-white hover:bg-primary-dark rounded-lg transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-white font-black text-lg w-8 text-center">{quantity}</span>
                  <button
                    onClick={handleIncrease}
                    className="w-10 h-10 flex items-center justify-center text-white hover:bg-primary-dark rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="flex-1 bg-primary/10 text-primary font-bold py-3 rounded-xl hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  View Cart
                </button>
              </>
            ) : (
              <button
                onClick={handleAdd}
                className="flex-1 btn-primary py-3 text-base flex items-center justify-center gap-2 rounded-xl"
              >
                <Plus className="w-5 h-5" />
                Add to Cart
              </button>
            )}
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-bold text-dark mb-2">About this product</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">Related Products</h2>
            {category && (
              <Link to={`/category/${category._id}`} className="text-primary text-sm font-semibold hover:underline">
                View all
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {related.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
