import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Add review to product
// @route   POST /api/reviews/:productId
// @access  Private
export const addProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      // Update existing review
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
      await alreadyReviewed.save();
    } else {
      // Create new review
      const review = new Review({
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        product: productId,
      });
      await review.save();
    }

    // Recalculate average rating & review count
    const reviews = await Review.find({ product: productId });
    product.numOfReviews = reviews.length;
    product.ratings =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added/updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Check privileges
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate average rating
    const product = await Product.findById(productId);
    if (product) {
      const reviews = await Review.find({ product: productId });
      product.numOfReviews = reviews.length;
      product.ratings =
        reviews.length > 0
          ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
          : 0;
      await product.save();
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
