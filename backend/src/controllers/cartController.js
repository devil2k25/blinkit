const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private (user)
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price discountPrice unit stock isActive deliveryTime');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 199 ? 0 : 20;
    const total = subtotal + deliveryFee;

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        subtotal,
        deliveryFee,
        total,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        updatedAt: cart.updatedAt,
      },
    });
  } catch (error) {
    console.error('GetCart error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private (user)
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemPrice = product.discountPrice || product.price;
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQty = cart.items[existingItemIndex].quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({ success: false, message: 'Cannot add more than available stock' });
      }
      cart.items[existingItemIndex].quantity = newQty;
      cart.items[existingItemIndex].price = itemPrice;
    } else {
      cart.items.push({ product: productId, quantity, price: itemPrice });
    }

    await cart.save();
    await cart.populate('items.product', 'name images price discountPrice unit stock isActive deliveryTime');

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 199 ? 0 : 20;
    const total = subtotal + deliveryFee;

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        subtotal,
        deliveryFee,
        total,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('AddToCart error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private (user)
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Product ID and quantity are required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      if (quantity > product.stock) {
        return res.status(400).json({ success: false, message: 'Quantity exceeds available stock' });
      }

      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
      if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: 'Item not found in cart' });
      }

      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = product.discountPrice || product.price;
    }

    await cart.save();
    await cart.populate('items.product', 'name images price discountPrice unit stock isActive deliveryTime');

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 199 ? 0 : 20;
    const total = subtotal + deliveryFee;

    res.json({
      success: true,
      message: 'Cart updated',
      cart: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        subtotal,
        deliveryFee,
        total,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('UpdateCartItem error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private (user)
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product', 'name images price discountPrice unit stock isActive deliveryTime');

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 199 ? 0 : 20;
    const total = subtotal + deliveryFee;

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        subtotal,
        deliveryFee,
        total,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('RemoveFromCart error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private (user)
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('ClearCart error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
