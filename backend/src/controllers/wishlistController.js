import Wishlist from '../models/Wishlist.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json(wishlist.products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    wishlist.products.push(productId);
    await wishlist.save();
    
    const updated = await Wishlist.findOne({ user: req.user._id }).populate('products');
    res.json(updated.products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();

    const updated = await Wishlist.findOne({ user: req.user._id }).populate('products');
    res.json(updated.products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
