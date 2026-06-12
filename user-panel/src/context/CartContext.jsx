import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('blinkit_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('blinkit_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item._id === product._id)
      if (existing) {
        toast.success(`${product.name} quantity updated`)
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      }
      toast.success(`${product.name} added to cart`)
      return [...prev, { ...product, quantity: qty }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const item = prev.find(i => i._id === productId)
      if (item) toast.success(`${item.name} removed from cart`)
      return prev.filter(item => item._id !== productId)
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('blinkit_cart')
  }

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  )

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const deliveryFee = cartTotal > 199 ? 0 : 25
  const handlingFee = 5
  const orderTotal = cartTotal + deliveryFee + handlingFee

  const isInCart = (productId) => cartItems.some(i => i._id === productId)
  const getQuantity = (productId) => {
    const item = cartItems.find(i => i._id === productId)
    return item ? item.quantity : 0
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      cartTotal,
      cartCount,
      deliveryFee,
      handlingFee,
      orderTotal,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      getQuantity,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
