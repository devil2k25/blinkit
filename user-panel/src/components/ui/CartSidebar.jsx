import React from 'react'
import { X, Plus, Minus, ShoppingCart, Zap, Trash2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function CartSidebar() {
  const {
    cartItems, cartTotal, cartCount, deliveryFee, handlingFee, orderTotal,
    isCartOpen, setIsCartOpen, updateQuantity, removeFromCart,
  } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    setIsCartOpen(false)
    navigate('/checkout')
  }

  if (!isCartOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-dark text-lg">My Cart</h2>
            {cartCount > 0 && (
              <div className="flex items-center gap-1 text-primary text-xs font-semibold mt-0.5">
                <Zap className="w-3 h-3 fill-primary" />
                Delivery in 10 mins
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Body */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-300" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-dark text-lg">Your cart is empty</h3>
              <p className="text-gray-500 text-sm mt-1">Add items to get started</p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="btn-primary w-full text-center"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Delivery savings banner */}
            {cartTotal < 199 && (
              <div className="mx-4 mt-3 px-3 py-2 bg-green-50 rounded-lg text-xs text-primary font-medium">
                Add items worth ₹{199 - cartTotal} more for <strong>FREE delivery</strong>
              </div>
            )}
            {cartTotal >= 199 && (
              <div className="mx-4 mt-3 px-3 py-2 bg-green-50 rounded-lg text-xs text-primary font-medium">
                🎉 You unlocked <strong>FREE delivery!</strong>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-3 py-2 border-b border-gray-50">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-dark truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.unit}</p>
                    <p className="text-sm font-bold text-dark mt-1">₹{item.price * item.quantity}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1 bg-primary rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-white hover:bg-primary-dark transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white font-bold text-sm w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-white hover:bg-primary-dark transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <h4 className="font-bold text-dark text-sm mb-2">Bill Details</h4>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({cartCount})</span>
                  <span className="font-medium">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-primary font-medium' : 'font-medium'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Handling Fee</span>
                  <span className="font-medium">₹{handlingFee}</span>
                </div>
                <div className="flex justify-between font-bold text-dark pt-1.5 border-t border-gray-200 mt-1.5">
                  <span>Total</span>
                  <span>₹{orderTotal}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="px-4 pb-4 pt-2">
              <button
                onClick={handleCheckout}
                className="w-full btn-primary flex items-center justify-between py-3 px-4"
              >
                <span>{cartCount} items</span>
                <span className="flex items-center gap-2">
                  Checkout — ₹{orderTotal}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
