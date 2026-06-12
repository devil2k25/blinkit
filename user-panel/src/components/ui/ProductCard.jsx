import React from 'react'
import { Plus, Minus, Zap, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart, updateQuantity, getQuantity, isInCart } = useCart()
  const navigate = useNavigate()
  const quantity = getQuantity(product._id)
  const inCart = isInCart(product._id)

  const handleAdd = (e) => {
    e.stopPropagation()
    addToCart(product)
  }

  const handleIncrease = (e) => {
    e.stopPropagation()
    updateQuantity(product._id, quantity + 1)
  }

  const handleDecrease = (e) => {
    e.stopPropagation()
    updateQuantity(product._id, quantity - 1)
  }

  return (
    <div
      className="product-card card p-3 flex flex-col cursor-pointer group"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Product Image */}
      <div className={`relative w-full aspect-square rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center mb-3 overflow-hidden`}>
        <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
          {product.emoji}
        </span>
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 badge-discount">
            {product.discount}% OFF
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-orange-100 text-orange-600 text-xs font-bold px-1.5 py-0.5 rounded">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
            <span className="text-sm font-bold text-gray-500">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Delivery Badge */}
      <div className="badge-delivery mb-2 w-fit">
        <Zap className="w-3 h-3 fill-primary" />
        <span>{product.deliveryTime}</span>
      </div>

      {/* Product Info */}
      <h3 className="font-bold text-dark text-sm leading-tight mb-0.5 line-clamp-2">
        {product.name}
      </h3>
      <p className="text-xs text-gray-500 mb-2">{product.unit}</p>

      {/* Price + Add Button */}
      <div className="mt-auto flex items-center justify-between">
        <div>
          <span className="font-bold text-dark text-base">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through ml-1">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {product.stock === 0 ? (
          <button
            disabled
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-xs font-semibold cursor-not-allowed"
          >
            <ShoppingCart className="w-3 h-3" />
            Notify
          </button>
        ) : inCart ? (
          <div
            className="flex items-center gap-1 bg-primary rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleDecrease}
              className="w-8 h-8 flex items-center justify-center text-white hover:bg-primary-dark transition-colors font-bold text-lg"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-white font-bold text-sm min-w-5 text-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="w-8 h-8 flex items-center justify-center text-white hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 px-3 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-bold transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        )}
      </div>
    </div>
  )
}
