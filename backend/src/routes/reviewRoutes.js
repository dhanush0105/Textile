import express from 'express';
import { addProductReview, getProductReviews, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/:productId').get(getProductReviews).post(protect, addProductReview);
router.route('/:id').delete(protect, deleteReview);

export default router;
