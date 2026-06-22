import Coupon from '../models/Coupon.js';

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res) => {
  const { code, cartTotal } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: 'Coupon is inactive' });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    if (cartTotal < coupon.minPurchaseAmount) {
      return res.status(400).json({
        message: `Minimum purchase amount of ₹${coupon.minPurchaseAmount} required to use this coupon`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (cartTotal * coupon.discountAmount) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountAmount;
    }

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountAmount: coupon.discountAmount,
      calculatedDiscount: Math.round(discount),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  const {
    code,
    discountType,
    discountAmount,
    minPurchaseAmount,
    maxDiscountAmount,
    expiryDate,
    isActive,
    usageLimit,
  } = req.body;

  try {
    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code,
      discountType,
      discountAmount,
      minPurchaseAmount,
      maxDiscountAmount,
      expiryDate,
      isActive: isActive !== undefined ? isActive : true,
      usageLimit: usageLimit || 100,
    });

    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      await coupon.deleteOne();
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
