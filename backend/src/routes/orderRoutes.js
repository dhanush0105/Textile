import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  cancelOrder,
  getOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;
