import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  discountAmount: { type: Number, required: true }, // % or flat value
  minPurchaseAmount: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number, default: 100 },
  usageCount: { type: Number, default: 0 }
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
