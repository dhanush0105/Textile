import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLanguage } from '../components/LanguageContext.jsx';
import { clearCart } from '../store/cartSlice.js';
import axios from 'axios';
import { CreditCard, Truck, CheckCircle, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems, itemsPrice, coupon, shippingPrice, taxPrice, totalPrice, discountPrice } = useSelector((state) => state.cart);

  // Address Form States
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState(userInfo?.phone || '');

  // Selection states
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'Razorpay'
  const [loading, setLoading] = useState(false);
  const [showMockPaymentModal, setShowMockPaymentModal] = useState(false);
  const [mockOrderId, setMockOrderId] = useState('');

  // Prefill default address if available
  useEffect(() => {
    if (userInfo && userInfo.addresses && userInfo.addresses.length > 0) {
      const defaultAddr = userInfo.addresses.find((addr) => addr.isDefault) || userInfo.addresses[0];
      setStreet(defaultAddr.street || '');
      setCity(defaultAddr.city || '');
      setState(defaultAddr.state || '');
      setZipCode(defaultAddr.zipCode || '');
      setCountry(defaultAddr.country || 'India');
    }
  }, [userInfo]);

  const selectAddress = (addr) => {
    setStreet(addr.street);
    setCity(addr.city);
    setState(addr.state);
    setZipCode(addr.zipCode);
    setCountry(addr.country);
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();

    if (!userInfo) {
      alert('Please register or login to complete checkout');
      navigate('/dashboard');
      return;
    }

    if (!street || !city || !state || !zipCode || !phone) {
      alert('Please fill out all address details');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.discountPrice || item.product.price,
          image: item.product.images?.[0] || '/assets/placeholder.jpg',
          size: item.size,
        })),
        shippingAddress: { street, city, state, zipCode, country },
        paymentMethod,
        totalPrice: itemsPrice,
        discountPrice,
        finalPrice: totalPrice,
        couponCode: coupon?.code,
      };

      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      if (paymentMethod === 'COD') {
        // Post directly
        await axios.post('/api/orders', orderData, config);
        dispatch(clearCart());
        setLoading(false);
        alert('Order placed successfully via Cash on Delivery!');
        navigate('/dashboard?tab=orders');
      } else {
        // Razorpay checkout
        const { data: payOrder } = await axios.post('/api/payments/create-order', { amount: totalPrice }, config);
        
        if (payOrder.isMock) {
          setMockOrderId(payOrder.id);
          setShowMockPaymentModal(true);
          setLoading(false);
        } else {
          // Live Razorpay setup (SDK required)
          const options = {
            key: payOrder.key_id,
            amount: payOrder.amount,
            currency: payOrder.currency,
            name: 'Anusree Tex',
            description: 'Premium South Indian Heritage Wear',
            order_id: payOrder.id,
            handler: async (response) => {
              try {
                // Verify signature on backend
                await axios.post('/api/payments/verify', {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }, config);

                // Create Order in DB
                orderData.paymentResult = {
                  id: response.razorpay_payment_id,
                  status: 'Success',
                  email_address: userInfo.email,
                };
                
                await axios.post('/api/orders', orderData, config);
                dispatch(clearCart());
                alert('Order placed successfully via Razorpay!');
                navigate('/dashboard?tab=orders');
              } catch (err) {
                alert('Payment verification failed. Please check with support.');
              }
            },
            prefill: {
              name: userInfo.name,
              email: userInfo.email,
              contact: phone,
            },
            theme: { color: '#D4AF37' },
          };
          
          const rzp = new window.Razorpay(options);
          rzp.open();
          setLoading(false);
        }
      }
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleMockPaymentSuccess = async () => {
    setShowMockPaymentModal(false);
    setLoading(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.discountPrice || item.product.price,
          image: item.product.images?.[0] || '/assets/placeholder.jpg',
          size: item.size,
        })),
        shippingAddress: { street, city, state, zipCode, country },
        paymentMethod,
        totalPrice: itemsPrice,
        discountPrice,
        finalPrice: totalPrice,
        couponCode: coupon?.code,
        paymentResult: {
          id: `mock_pay_${Date.now()}`,
          status: 'Paid',
          email_address: userInfo.email,
        },
      };

      await axios.post('/api/orders', orderData, config);
      dispatch(clearCart());
      setLoading(false);
      alert('Mock payment confirmed. Order placed successfully!');
      navigate('/dashboard?tab=orders');
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold text-earth mb-8 uppercase tracking-wide">
        {t('checkout')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side Form (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Saved Addresses list for quick click */}
          {userInfo && userInfo.addresses && userInfo.addresses.length > 0 && (
            <div className="bg-white border border-gold/15 p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="font-serif text-md font-bold text-earth uppercase tracking-wide">
                {t('savedAddresses')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userInfo.addresses.map((addr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectAddress(addr)}
                    className="text-left border border-gold/20 p-3 rounded hover:bg-cream/10 hover:border-gold-dark transition-all text-xs"
                  >
                    <span className="font-bold block text-earth">{addr.isDefault ? 'Default Address' : `Address #${idx + 1}`}</span>
                    <span className="text-gray-500 block mt-1">{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Checkout Form */}
          <form onSubmit={handlePlaceOrder} className="bg-white border border-gold/15 p-6 rounded-lg shadow-sm space-y-4">
            <h3 className="font-serif text-md font-bold text-earth uppercase tracking-wide border-b border-gold/10 pb-3">
              {t('shippingAddress')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                  placeholder="Door No., Street name, Area"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                  placeholder="Chennai"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                  placeholder="Tamil Nadu"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Zip Code / Pin Code</label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                  placeholder="600017"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <hr className="border-gold/10" />

            {/* Payment Selections */}
            <div className="space-y-3">
              <h3 className="font-serif text-md font-bold text-earth uppercase tracking-wide">
                {t('paymentMethod')}
              </h3>
              
              <div className="flex gap-4">
                <label className={`flex-1 border p-4 rounded flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-gold-dark bg-gold/10' : 'border-gold/20'}`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-gold-dark focus:ring-gold border-gold/30 mr-3 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-earth text-sm block">Cash On Delivery</span>
                      <span className="text-[10px] text-gray-400 block">Pay cash at your doorstep</span>
                    </div>
                  </div>
                  <Truck className="text-gold-dark" size={24} />
                </label>

                <label className={`flex-1 border p-4 rounded flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'Razorpay' ? 'border-gold-dark bg-gold/10' : 'border-gold/20'}`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Razorpay'}
                      onChange={() => setPaymentMethod('Razorpay')}
                      className="text-gold-dark focus:ring-gold border-gold/30 mr-3 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-earth text-sm block">Online Payment</span>
                      <span className="text-[10px] text-gray-400 block">UPI, Cards, Netbanking</span>
                    </div>
                  </div>
                  <CreditCard className="text-gold-dark" size={24} />
                </label>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-dark text-earth py-4 rounded font-bold text-xs uppercase tracking-widest mt-6 transition-all duration-200"
            >
              {loading ? 'Processing Order...' : t('placeOrder')}
            </button>
          </form>

        </div>

        {/* Right Side Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gold/15 p-6 rounded-lg shadow-sm h-fit space-y-6">
          <h3 className="font-serif text-md font-bold text-earth uppercase tracking-wide border-b border-gold/10 pb-3">
            {t('orderSummary')}
          </h3>

          {/* Items lists */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
            {cartItems.map((item, idx) => {
              const activePrice = item.product.discountPrice || item.product.price;
              return (
                <div key={idx} className="flex gap-3 text-xs border-b border-gray-100 pb-3">
                  <div className="w-10 h-12 bg-cream rounded overflow-hidden shrink-0">
                    <img
                      src={item.product.images?.[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <span className="font-semibold text-earth block truncate">{item.product.name}</span>
                    <span className="text-gray-400 block mt-0.5">Qty: {item.quantity} | Size: {item.size}</span>
                  </div>
                  <span className="font-bold text-earth shrink-0">₹{activePrice * item.quantity}</span>
                </div>
              );
            })}
          </div>

          {/* Price details */}
          <div className="space-y-2.5 text-xs">
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
            <div className="flex justify-between font-bold text-earth text-base pt-1">
              <span>{t('total')}</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          <div className="bg-cream-dark/10 p-4 rounded text-[11px] text-gray-500 flex items-start gap-2 border border-gold/10 leading-relaxed">
            <ShieldCheck size={16} className="text-gold-dark shrink-0 mt-0.5" />
            <span>Secure Checkout with AES encryption. Handwoven with pride. Undergoing direct verification.</span>
          </div>

        </div>

      </div>

      {/* MOCK PAYMENT SCREEN MODAL */}
      {showMockPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gold max-w-md w-full rounded-lg shadow-2xl p-6 space-y-6 text-center animate-scaleUp">
            
            <div className="space-y-2">
              <CheckCircle className="mx-auto text-gold-dark" size={48} />
              <h3 className="font-serif text-xl font-bold text-earth">Razorpay Sandbox Simulator</h3>
              <p className="text-xs text-gray-500">We detected that Razorpay key configurations are empty. We have simulated this sandbox modal for payment testing.</p>
            </div>

            <div className="bg-cream-light p-4 rounded border border-gold/20 space-y-2.5 text-left text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Simulator Order ID:</span>
                <span className="font-mono font-semibold">{mockOrderId}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Customer Email:</span>
                <span className="font-semibold">{userInfo?.email}</span>
              </div>
              <div className="flex justify-between text-earth font-bold text-sm border-t border-gold/10 pt-2.5">
                <span>Total Amount Payable:</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowMockPaymentModal(false)}
                className="flex-1 border border-gray-300 py-2.5 rounded font-semibold text-xs text-gray-600 uppercase hover:bg-gray-50"
              >
                Cancel Checkout
              </button>
              <button
                onClick={handleMockPaymentSuccess}
                className="flex-1 bg-gold hover:bg-gold-dark text-earth py-2.5 rounded font-bold text-xs uppercase"
              >
                Authorize Payment
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
