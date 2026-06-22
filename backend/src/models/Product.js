import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String, required: true }],
  fabric: { type: String, required: true }, // e.g. Silk, Cotton, Art Silk
  borderType: { type: String, required: true }, // e.g. Gold Jari, Silver Jari, Thread, Temple
  borderSize: { type: String }, // e.g. 2 inch, 3 inch, 4 inch, Double side
  occasion: { type: String, required: true }, // e.g. Wedding, Festival, Casual
  color: { type: String, required: true, default: 'White' }, // White, Off-white, Cream
  size: { type: String, default: '4 Meters (Double Veshti)' }, // 2 Meters (Single), 4 Meters (Double)
  stock: { type: Number, required: true, default: 0 },
  ratings: { type: Number, default: 0 },
  numOfReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isWedding: { type: Boolean, default: false },
  isFestival: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
