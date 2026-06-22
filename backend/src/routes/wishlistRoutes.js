import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getWishlist).post(addToWishlist);
router.route('/:productId').delete(removeFromWishlist);

export default router;
