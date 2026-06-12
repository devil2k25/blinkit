import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Minus, Trash2, ShoppingCart, Zap, ArrowRight, Tag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const {
    cartItems, cartTotal, cartCount, deliveryFee, handlingFee, orderTotal,
    updateQuantity, removeFromCart, clearCart,
  } = useCart()
  const navigate = useNavigate()

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-14 h-14 text-gray-300" />
        </div>
        <h2 className="text-2xl font-black text-dark mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/" className="btn-primary px-8 py-3 text-base rounded-xl">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-dark">My Cart</h1>
          <div className="flex items-center gap-1 text-primary text-sm font-semibold mt-0.5">
            <Zap className="w-4 h-4 fill-primary" />
            Delivery in 10 minutes
          </div>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 font-semibold hover:text-red-700 hover:underline transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* Free Delivery Progress */}
      {cartTotal < 199 && (
        <div className="card p-4 mb-6 bg-green-50 border-green-100">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-primary font-semibold">
              Add ₹{199 - cartTotal} more for FREE delivery
            </span>
            <span className="text-gray-500">{Math.round((cartTotal / 199) * 100)}%</span>
          </div>
          <div className="h-2 bg-green-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min((cartTotal / 199) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <div key={item._id} className="card p-4 flex items-center gap-4">
              {/* Image */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl flex-shrink-0`}>
                {item.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-dark text-sm truncate">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.unit}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-dark">₹{item.price}</span>
                  {item.originalPrice > item.price && (
                    <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                  )}
                  {item.discount > 0 && (
                    <span className="badge-discount">{item.discount}% off</span>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-dark w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-sm font-bold text-dark">₹{item.price * item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-dark text-sm">Apply Coupon</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="input-field text-sm py-2 flex-1"
              />
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors">
                Apply
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Try: FIRST50, SAVE20</p>
          </div>

          {/* Bill Summary */}
          <div className="card p-4">
            <h3 className="font-bold text-dark mb-3">Bill Details</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items ({cartCount})</span>
                <span className="font-medium">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className={`font-medium ${deliveryFee === 0 ? 'text-primary' : ''}`}>
                  {deliveryFee === 0 ? (
                    <span className="flex items-center gap-1">
                      <span className="text-gray-400 line-through text-xs">₹25</span> FREE
                    </span>
                  ) : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-medium">₹{handlingFee}</span>
              </div>
              <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-dark">
                <span>To Pay</span>
                <span>₹{orderTotal}</span>
              </div>
            </div>
            {cartTotal > 199 && (
              <div className="mt-3 text-xs text-primary bg-green-50 rounded-lg px-3 py-2 font-semibold">
                🎉 You saved ₹25 on delivery!
              </div>
            )}
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full btn-primary flex items-center justify-between py-3.5 px-4 rounded-xl text-base"
          >
            <div>
              <div className="font-bold">{cartCount} items</div>
            </div>
            <div className="flex items-center gap-2 font-bold">
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>

          <p className="text-center text-xs text-gray-400">
            Safe and secure payments. 100% authentic products.
          </p>
        </div>
      </div>
    </div>
  )
}
