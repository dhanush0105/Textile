import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  size: { type: String }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [orderItemSchema],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  paymentMethod: { type: String, required: true, enum: ['COD', 'Razorpay'] },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String }
  },
  taxPrice: { type: Number, default: 0.0 },
  shippingPrice: { type: Number, default: 0.0 },
  totalPrice: { type: Number, required: true }, // Before discount
  discountPrice: { type: Number, default: 0.0 },
  finalPrice: { type: Number, required: true }, // After discount
  couponCode: { type: String },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  trackingNumber: { type: String },
  carrier: { type: String }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
