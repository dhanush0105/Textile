import express from 'express';
import { getDashboardStats, getCustomersList } from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/dashboard-stats', protect, admin, getDashboardStats);
router.get('/customers', protect, admin, getCustomersList);

export default router;
