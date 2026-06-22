import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLanguage } from '../components/LanguageContext.jsx';
import { loginRequest, loginSuccess, loginFail, updateProfileSuccess, updateAddressesSuccess } from '../store/authSlice.js';
import { wishlistSuccess } from '../store/wishlistSlice.js';
import { addItem } from '../store/cartSlice.js';
import axios from 'axios';
import { User, ClipboardList, Heart, MapPin, Key, Plus, Trash2, ShieldAlert, Check } from 'lucide-react';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { userInfo, loading: authLoading, error: authError } = useSelector((state) => state.auth);

  // Tabs management
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders', 'wishlist', 'addresses'
  
  // URL Tab Sync
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['profile', 'orders', 'wishlist', 'addresses'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Auth form states
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Profile update form states
  const [profName, setProfName] = useState(userInfo?.name || '');
  const [profEmail, setProfEmail] = useState(userInfo?.email || '');
  const [profPhone, setProfPhone] = useState(userInfo?.phone || '');
  const [profPassword, setProfPassword] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Orders log states
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Address add states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Wishlist local states
  const { wishlistItems } = useSelector((state) => state.wishlist);

  // Load user data on mount / auth change
  useEffect(() => {
    if (userInfo) {
      setProfName(userInfo.name);
      setProfEmail(userInfo.email);
      setProfPhone(userInfo.phone || '');

      // Load Wishlist from DB
      const loadWishlist = async () => {
        try {
          const { data } = await axios.get('/api/wishlist', {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          dispatch(wishlistSuccess(data));
        } catch (err) {
          console.error('Failed fetching wishlist from DB', err);
        }
      };

      // Load Orders
      const loadOrders = async () => {
        try {
          setOrdersLoading(true);
          const { data } = await axios.get('/api/orders/myorders', {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          setOrders(data);
          setOrdersLoading(false);
        } catch (err) {
          console.error(err);
          setOrdersLoading(false);
        }
      };

      loadWishlist();
      loadOrders();
    }
  }, [userInfo, dispatch]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginRequest());
    try {
      const { data } = await axios.post('/api/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });
      dispatch(loginSuccess(data));
    } catch (err) {
      dispatch(loginFail(err.response?.data?.message || err.message));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginRequest());
    try {
      const { data } = await axios.post('/api/auth/register', {
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
      });
      dispatch(loginSuccess(data));
    } catch (err) {
      dispatch(loginFail(err.response?.data?.message || err.message));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.put(
        '/api/auth/profile',
        {
          name: profName,
          email: profEmail,
          phone: profPhone,
          password: profPassword || undefined,
        },
        config
      );
      dispatch(updateProfileSuccess(data));
      setProfPassword('');
      setProfileSuccessMsg('Profile updated successfully!');
      setTimeout(() => setProfileSuccessMsg(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.put(`/api/orders/${orderId}/cancel`, {}, config);
      
      // Refresh orders
      const { data } = await axios.get('/api/orders/myorders', config);
      setOrders(data);
      alert('Order cancelled successfully.');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.post(
        '/api/auth/addresses',
        { street, city, state, zipCode, isDefault },
        config
      );
      dispatch(updateAddressesSuccess(data));
      setStreet('');
      setCity('');
      setState('');
      setZipCode('');
      setIsDefault(false);
      setShowAddressForm(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.delete(`/api/auth/addresses/${addrId}`, config);
      dispatch(updateAddressesSuccess(data));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleWishlistToCart = (product) => {
    dispatch(addItem({ product, quantity: 1, size: product.size || '4 Meters' }));
    alert(`${product.name} added to cart!`);
  };

  const handleRemoveWishlist = async (productId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.delete(`/api/wishlist/${productId}`, config);
      dispatch(wishlistSuccess(data));
    } catch (err) {
      console.error(err);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // 1. ANONYMOUS AUTH STATE (Register/Login)
  if (!userInfo) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white border border-gold/15 rounded-lg shadow-xl p-6 sm:p-8 space-y-6">
          
          <div className="flex border-b border-gold/10 text-center text-xs">
            <button
              onClick={() => setIsLoginView(true)}
              className={`flex-1 pb-3 font-bold uppercase tracking-wider ${isLoginView ? 'border-b-2 border-gold-dark text-gold-dark' : 'text-gray-500'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLoginView(false)}
              className={`flex-1 pb-3 font-bold uppercase tracking-wider ${!isLoginView ? 'border-b-2 border-gold-dark text-gold-dark' : 'text-gray-500'}`}
            >
              Register
            </button>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded flex items-center gap-1.5 font-semibold">
              <ShieldAlert size={14} /> {authError}
            </div>
          )}

          {isLoginView ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                  placeholder="name@email.com"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gold hover:bg-gold-dark text-earth py-3 rounded font-bold uppercase tracking-wider transition-colors mt-2"
              >
                {authLoading ? 'Signing In...' : 'Log In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                  placeholder="Dhanush Kumar"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                  placeholder="name@email.com"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Phone Number</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                  placeholder="9876543210"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-earth text-cream hover:bg-gold hover:text-earth py-3 rounded font-bold uppercase tracking-wider transition-colors mt-2"
              >
                {authLoading ? 'Registering...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="text-center pt-2 text-xs text-gray-400">
            <p>Demo accounts (preloaded):</p>
            <p>Admin: <code className="text-earth font-bold">admin@anusreetex.com</code> (admin123)</p>
            <p>User: <code className="text-earth font-bold">customer@anusreetex.com</code> (user123)</p>
          </div>

        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED DASHBOARD VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* User Hello Header */}
      <div className="bg-earth border-b-2 border-gold text-cream-light p-8 rounded-lg shadow mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-gold-light text-xs uppercase tracking-widest font-bold font-sans">Vanakkam,</span>
          <h1 className="font-serif text-3xl font-semibold text-white mt-1">{userInfo.name}</h1>
          <p className="text-xs text-cream/60 mt-1">{userInfo.email} | {userInfo.phone || 'No phone registered'}</p>
        </div>
        <div className="flex gap-2">
          {userInfo.role === 'admin' && (
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold hover:bg-gold-dark text-earth px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wide transition-all"
            >
              Enter Admin Portal
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar (3 cols) */}
        <aside className="lg:col-span-3 space-y-2.5">
          <button
            onClick={() => switchTab('profile')}
            className={`w-full text-left px-4 py-3 rounded flex items-center text-sm font-semibold transition-all ${activeTab === 'profile' ? 'bg-gold/15 text-gold-dark font-bold border-l-4 border-gold-dark pl-3' : 'bg-white text-gray-600 hover:bg-cream/20'}`}
          >
            <User size={18} className="mr-2.5 shrink-0" />
            Profile Management
          </button>
          <button
            onClick={() => switchTab('orders')}
            className={`w-full text-left px-4 py-3 rounded flex items-center text-sm font-semibold transition-all ${activeTab === 'orders' ? 'bg-gold/15 text-gold-dark font-bold border-l-4 border-gold-dark pl-3' : 'bg-white text-gray-600 hover:bg-cream/20'}`}
          >
            <ClipboardList size={18} className="mr-2.5 shrink-0" />
            {t('orderHistory')}
          </button>
          <button
            onClick={() => switchTab('wishlist')}
            className={`w-full text-left px-4 py-3 rounded flex items-center text-sm font-semibold transition-all ${activeTab === 'wishlist' ? 'bg-gold/15 text-gold-dark font-bold border-l-4 border-gold-dark pl-3' : 'bg-white text-gray-600 hover:bg-cream/20'}`}
          >
            <Heart size={18} className="mr-2.5 shrink-0 text-red-500" />
            {t('wishlist')}
          </button>
          <button
            onClick={() => switchTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded flex items-center text-sm font-semibold transition-all ${activeTab === 'addresses' ? 'bg-gold/15 text-gold-dark font-bold border-l-4 border-gold-dark pl-3' : 'bg-white text-gray-600 hover:bg-cream/20'}`}
          >
            <MapPin size={18} className="mr-2.5 shrink-0" />
            {t('savedAddresses')}
          </button>
        </aside>

        {/* Tab Page Viewer (9 cols) */}
        <main className="lg:col-span-9 bg-white border border-gold/15 p-6 rounded-lg shadow-sm min-h-[400px]">
          
          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="font-serif text-lg font-bold text-earth border-b border-gold/10 pb-3 uppercase tracking-wide">
                Account Credentials
              </h2>
              
              {profileSuccessMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-2.5 rounded flex items-center gap-1.5 font-semibold">
                  <Check size={14} /> {profileSuccessMsg}
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-xl text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500 uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      value={profEmail}
                      onChange={(e) => setProfEmail(e.target.value)}
                      className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      value={profPhone}
                      onChange={(e) => setProfPhone(e.target.value)}
                      className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500 uppercase">New Password (optional)</label>
                    <input
                      type="password"
                      value={profPassword}
                      onChange={(e) => setProfPassword(e.target.value)}
                      className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                      placeholder="Leave blank to keep same"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-gold hover:bg-gold-dark text-earth px-6 py-2.5 rounded font-bold uppercase tracking-wider mt-4"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-serif text-lg font-bold text-earth border-b border-gold/10 pb-3 uppercase tracking-wide">
                Purchase Order Logs
              </h2>

              {ordersLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold-dark" />
                </div>
              ) : orders.length === 0 ? (
                <p className="text-sm text-gray-500 italic bg-cream-light p-6 rounded border border-gold/10">
                  You have not placed any orders yet on Anusree Tex.
                </p>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div key={ord._id} className="border border-gold/15 rounded-lg overflow-hidden text-xs">
                      
                      {/* Order Header bar */}
                      <div className="bg-cream-dark/20 p-4 border-b border-gold/15 flex flex-wrap justify-between gap-2 text-earth font-medium">
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase">Order ID</span>
                          <span className="font-mono">{ord._id}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase">Placed Date</span>
                          <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase">Total Amount</span>
                          <span className="font-bold">₹{ord.finalPrice}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase">Status</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ord.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : ord.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items details */}
                      <div className="p-4 space-y-3 bg-white">
                        {ord.orderItems?.map((item, index) => (
                          <div key={index} className="flex gap-3 justify-between border-b border-gray-50 pb-2 last:border-b-0 last:pb-0">
                            <div className="flex gap-2">
                              <div className="w-8 h-10 bg-cream rounded overflow-hidden">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <span className="font-semibold text-earth block">{item.name}</span>
                                <span className="text-[10px] text-gray-400 block">Qty: {item.quantity} | Size: {item.size}</span>
                              </div>
                            </div>
                            <span className="font-bold text-earth align-middle self-center">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="bg-cream-light/40 p-4 border-t border-gold/10 flex justify-between items-center flex-wrap gap-2">
                        <div>
                          {ord.trackingNumber && (
                            <span className="text-[10px] text-gray-500">
                              Tracking: <b>{ord.carrier}</b> ({ord.trackingNumber})
                            </span>
                          )}
                        </div>
                        
                        {(ord.orderStatus === 'Pending' || ord.orderStatus === 'Processing') && (
                          <button
                            onClick={() => handleCancelOrder(ord._id)}
                            className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded hover:bg-red-100 transition-colors font-bold text-[10px] uppercase"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="font-serif text-lg font-bold text-earth border-b border-gold/10 pb-3 uppercase tracking-wide">
                Your Saved Favorites
              </h2>

              {wishlistItems.length === 0 ? (
                <p className="text-sm text-gray-500 italic bg-cream-light p-6 rounded border border-gold/10">
                  Your wishlist is empty. Explore our catalog and save your favorites here.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistItems.map((prod) => (
                    <div
                      key={prod._id}
                      className="border border-gold/15 rounded-lg p-3 flex gap-3 bg-white shadow-sm items-center relative"
                    >
                      <button
                        onClick={() => handleRemoveWishlist(prod._id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div className="w-14 h-18 bg-cream rounded overflow-hidden shrink-0">
                        <img src={prod.images?.[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-grow min-w-0 pr-6 text-xs">
                        <span className="font-serif font-bold text-earth block truncate">{prod.name}</span>
                        <span className="text-[10px] text-gold-dark uppercase tracking-wider block mt-0.5">{prod.fabric}</span>
                        <span className="font-bold text-earth block mt-1">₹{prod.discountPrice || prod.price}</span>
                        
                        <button
                          onClick={() => handleWishlistToCart(prod)}
                          className="bg-gold text-earth font-bold text-[10px] uppercase px-3 py-1 rounded mt-2.5 hover:bg-gold-dark"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg font-bold text-earth uppercase tracking-wide">
                  Shipping Directory
                </h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="bg-earth text-cream-light hover:bg-gold hover:text-earth px-3 py-1.5 rounded flex items-center gap-1 text-xs font-bold uppercase"
                >
                  <Plus size={14} /> Add Address
                </button>
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="bg-cream-light border border-gold/20 p-4 rounded-lg space-y-3 text-xs sm:text-sm max-w-xl">
                  <h3 className="font-serif font-bold text-earth">New Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-semibold text-gray-500 uppercase">Street Address</label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full bg-white border border-gold/25 rounded p-2.5 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-500 uppercase">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border border-gold/25 rounded p-2.5 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-500 uppercase">State</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-white border border-gold/25 rounded p-2.5 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-500 uppercase">Zip Code</label>
                      <input
                        type="text"
                        required
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full bg-white border border-gold/25 rounded p-2.5 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center pt-5">
                      <label className="flex items-center text-xs text-gray-600 font-semibold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isDefault}
                          onChange={(e) => setIsDefault(e.target.checked)}
                          className="rounded text-gold-dark focus:ring-gold border-gold/30 mr-2 w-4 h-4 cursor-pointer"
                        />
                        Set as Default Address
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="bg-gold text-earth font-bold text-xs uppercase px-4 py-2 rounded"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="border border-gray-300 text-gray-600 font-semibold text-xs uppercase px-4 py-2 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Addresses Grid list */}
              {(!userInfo.addresses || userInfo.addresses.length === 0) ? (
                <p className="text-sm text-gray-500 italic bg-cream-light p-6 rounded border border-gold/10">
                  No addresses stored. Add a shipping address above for faster checkout experiences.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userInfo.addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="border border-gold/15 rounded-lg p-4 bg-white shadow-sm flex justify-between items-start text-xs leading-relaxed relative"
                    >
                      <div className="space-y-1">
                        <span className="font-bold text-earth block">
                          {addr.isDefault ? 'Default Address' : 'Additional Address'}
                        </span>
                        <span className="text-gray-500 block">{addr.street}</span>
                        <span className="text-gray-500 block">{addr.city}, {addr.state} - {addr.zipCode}</span>
                        <span className="text-gray-400 block">{addr.country}</span>
                      </div>

                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="text-gray-400 hover:text-red-500 shrink-0"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>

      </div>

    </div>
  );
};

export default Dashboard;
