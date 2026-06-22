import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLanguage } from '../components/LanguageContext.jsx';
import { updateItemQty, removeItem, applyCouponSuccess, removeCoupon } from '../store/cartSlice.js';
import axios from 'axios';
import { Trash2, Tag, Percent, ArrowRight, ShoppingBag, Info, X } from 'lucide-react';

const Cart = () => {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems, itemsPrice, coupon, shippingPrice, taxPrice, totalPrice, discountPrice } = useSelector((state) => state.cart);

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccessMsg, setCouponSuccessMsg] = useState('');

  const handleQtyChange = async (productId, size, quantity, itemId) => {
    dispatch(updateItemQty({ productId, size, quantity }));
    
    // Sync to DB if logged in
    if (userInfo && itemId) {
      try {
        await axios.put(
          `/api/cart/${itemId}`,
          { quantity },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
      } catch (err) {
        console.error('Failed syncing quantity to server', err);
      }
    }
  };

  const handleRemove = async (productId, size, itemId) => {
    dispatch(removeItem({ productId, size }));

    // Sync to DB if logged in
    if (userInfo && itemId) {
      try {
        await axios.delete(
          `/api/cart/${itemId}`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
      } catch (err) {
        console.error('Failed deleting item from server cart', err);
      }
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccessMsg('');

    if (!couponCode) return;
    if (!userInfo) {
      setCouponError('Please log in to apply coupons.');
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.post(
        '/api/coupons/validate',
        { code: couponCode, cartTotal: itemsPrice },
        config
      );

      dispatch(applyCouponSuccess(data));
      setCouponSuccessMsg(`Coupon ${data.code} applied! Discount: ₹${data.calculatedDiscount}`);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.response?.data?.message || err.message);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponSuccessMsg('');
    setCouponError('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <ShoppingBag size={64} className="mx-auto text-gold-dark/30 animate-pulse" />
        <h2 className="font-serif text-2xl font-bold text-earth">{language === 'en' ? 'Your Shopping Bag is Empty' : 'உங்கள் கூடை காலியாக உள்ளது'}</h2>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">Browse our exquisite handloom collections and weave some tradition into your wardrobe today.</p>
        <Link
          to="/shop"
          className="inline-block bg-gold hover:bg-gold-dark text-earth px-8 py-3 rounded font-bold text-xs uppercase tracking-wider transition-colors duration-200"
        >
          {language === 'en' ? 'Continue Shopping' : 'கொள்முதல் செய்யத் தொடங்குங்கள்'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold text-earth mb-8 uppercase tracking-wide">
        {language === 'en' ? 'Shopping Bag' : 'வாங்குதல் கூடை'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item, idx) => {
            const product = item.product;
            const itemPrice = product.discountPrice || product.price;
            
            return (
              <div
                key={idx}
                className="bg-white border border-gold/15 rounded-lg p-4 flex gap-4 md:gap-6 items-center shadow-sm hover:shadow transition-shadow"
              >
                {/* Thumb Image */}
                <div className="w-16 h-20 md:w-20 md:h-24 bg-cream rounded overflow-hidden shrink-0">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=100';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <Link to={`/product/${product._id}`} className="block">
                    <h3 className="font-serif text-sm md:text-base font-semibold text-earth hover:text-gold-dark transition-colors truncate">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1 uppercase tracking-wider">
                    {t('fabric')}: {product.fabric} | {t('size')}: {item.size}
                  </p>

                  <div className="flex items-center space-x-4 mt-3">
                    {/* Quantity selectors */}
                    <div className="flex border border-gold/20 rounded bg-white text-xs">
                      <button
                        onClick={() => item.quantity > 1 && handleQtyChange(product._id, item.size, item.quantity - 1, item._id)}
                        className="px-2.5 py-1 hover:bg-cream/20 font-bold"
                      >
                        −
                      </button>
                      <span className="px-3.5 py-1 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => item.quantity < product.stock && handleQtyChange(product._id, item.size, item.quantity + 1, item._id)}
                        className="px-2.5 py-1 hover:bg-cream/20 font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleRemove(product._id, item.size, item._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="text-right shrink-0">
                  <span className="font-bold text-sm md:text-base text-earth block">₹{itemPrice * item.quantity}</span>
                  {item.quantity > 1 && (
                    <span className="text-[10px] text-gray-400 block font-light">₹{itemPrice} / piece</span>
                  )}
                </div>

              </div>
            );
          })}

          {/* Shipping Limit Alerts */}
          {itemsPrice < 1500 && (
            <div className="bg-cream-dark/20 border border-gold/15 p-4 rounded text-xs text-earth/80 flex items-start gap-2">
              <Info size={16} className="text-gold-dark shrink-0 mt-0.5" />
              <span>
                Add <b>₹{1500 - itemsPrice}</b> more to your cart to qualify for <b>Free Delivery</b>! (Current shipping charge: ₹100).
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Order Summary & Coupon (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Coupon Code Section */}
          <div className="bg-white border border-gold/15 p-6 rounded-lg shadow-sm space-y-4">
            <h4 className="font-serif text-sm font-bold text-earth flex items-center gap-1.5 uppercase">
              <Tag size={16} className="text-gold-dark" />
              {t('applyCoupon')}
            </h4>
            
            {coupon ? (
              <div className="bg-gold/10 border border-gold/30 p-3 rounded flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-gold-dark">
                  <Percent size={14} />
                  <span>Code Applied: <b>{coupon.code}</b> (Saved ₹{discountPrice})</span>
                </div>
                <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('couponPlaceholder')}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow bg-cream-light border border-gold/20 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold-dark uppercase font-semibold"
                />
                <button
                  type="submit"
                  className="bg-earth text-cream-light px-4 py-2 rounded font-bold text-xs uppercase hover:bg-gold hover:text-earth transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>
            )}
            {couponSuccessMsg && (
              <p className="text-[11px] text-green-700 font-semibold">{couponSuccessMsg}</p>
            )}
          </div>

          {/* Pricing Details Panel */}
          <div className="bg-white border border-gold/15 p-6 rounded-lg shadow-sm space-y-4">
            <h4 className="font-serif text-sm font-bold text-earth uppercase tracking-wide border-b border-gold/10 pb-3">
              {t('orderSummary')}
            </h4>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{t('subtotal')}</span>
                <span>₹{itemsPrice}</span>
              </div>
              {discountPrice > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>{t('discount')}</span>
                  <span>−₹{discountPrice}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>{t('gst')}</span>
                <span>₹{taxPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600 border-b border-gold/10 pb-3">
                <span>{t('shipping')}</span>
                <span>{shippingPrice === 0 ? <b className="text-green-700">FREE</b> : `₹${shippingPrice}`}</span>
              </div>
              <div className="flex justify-between font-bold text-earth text-base sm:text-lg pt-1">
                <span>{t('total')}</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gold hover:bg-gold-dark text-earth py-3.5 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200"
            >
              {t('checkoutBtn')} <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;
