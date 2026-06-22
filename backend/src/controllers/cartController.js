import User from '../models/User.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cartItems.product');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  const { productId, quantity, size } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if product already exists in cart with same size
    const existingIndex = user.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existingIndex > -1) {
      user.cartItems[existingIndex].quantity += Number(quantity || 1);
    } else {
      user.cartItems.push({ product: productId, quantity: Number(quantity || 1), size });
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cartItems.product');
    res.json(updatedUser.cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity/size
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  const { quantity, size } = req.body;
  const { itemId } = req.params;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const item = user.cartItems.id(itemId);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });

    if (quantity !== undefined) item.quantity = Number(quantity);
    if (size !== undefined) item.size = size;

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cartItems.product');
    res.json(updatedUser.cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cartItems = user.cartItems.filter((item) => item._id.toString() !== itemId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cartItems.product');
    res.json(updatedUser.cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
