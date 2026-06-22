import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getCart).post(addToCart);
router.route('/:itemId').put(updateCartItem).delete(removeFromCart);

export default router;
