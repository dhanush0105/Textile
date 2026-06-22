import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, X, Percent, Save } from 'lucide-react';

const CouponManagement = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountAmount, setDiscountAmount] = useState('');
  const [minPurchaseAmount, setMinPurchaseAmount] = useState('');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState(100);

  const fetchCoupons = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get('/api/coupons', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [navigate]);

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.post(
        '/api/coupons',
        {
          code,
          discountType,
          discountAmount: Number(discountAmount),
          minPurchaseAmount: Number(minPurchaseAmount || 0),
          maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
          expiryDate: new Date(expiryDate),
          usageLimit: Number(usageLimit || 100),
        },
        config
      );

      alert('Coupon created successfully!');
      resetForm();
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.delete(`/api/coupons/${id}`, config);
      alert('Coupon removed successfully');
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const resetForm = () => {
    setCode('');
    setDiscountType('percentage');
    setDiscountAmount('');
    setMinPurchaseAmount('');
    setMaxDiscountAmount('');
    setExpiryDate('');
    setUsageLimit(100);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Coupon Management</h1>
          <p className="text-xs text-gray-500 mt-1">Configure active customer coupons and discount rates.</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gold hover:bg-gold-dark text-earth px-4 py-2.5 rounded font-bold text-xs uppercase flex items-center gap-1 shadow transition-colors"
          >
            <Plus size={16} /> Create Coupon
          </button>
        )}
      </div>

      {/* Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleSaveCoupon} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4 max-w-xl text-xs sm:text-sm">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h2 className="font-serif text-lg font-bold text-earth">New Promo Code Details</h2>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Coupon Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none uppercase font-semibold"
                placeholder="WELCOME10"
              />
            </div>
            
            <div className="space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none bg-white cursor-pointer"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Discount Value</label>
              <input
                type="number"
                required
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none"
                placeholder={discountType === 'percentage' ? '15%' : '500'}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Minimum Cart purchase (₹)</label>
              <input
                type="number"
                value={minPurchaseAmount}
                onChange={(e) => setMinPurchaseAmount(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none"
                placeholder="1000"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Max Cap Discount (₹ - optional)</label>
              <input
                type="number"
                value={maxDiscountAmount}
                onChange={(e) => setMaxDiscountAmount(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none"
                placeholder="1000"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Usage Limit</label>
              <input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none"
                placeholder="500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Expiry Date</label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="bg-gold hover:bg-gold-dark text-earth px-6 py-2.5 rounded font-bold text-xs uppercase flex items-center gap-1"
            >
              <Save size={14} /> Create Coupon
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border border-gray-300 px-6 py-2.5 rounded font-semibold text-xs text-gray-600 uppercase hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Coupon List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold-dark" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Coupon Code</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Min Spend</th>
                  <th className="p-4">Times Used</th>
                  <th className="p-4">Expiry</th>
                  <th className="p-4 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500 italic">No coupons created.</td>
                  </tr>
                ) : (
                  coupons.map((c) => (
                    <tr key={c._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-gray-600">
                      <td className="p-4 font-mono font-semibold text-earth">{c.code}</td>
                      <td className="p-4 capitalize">{c.discountType}</td>
                      <td className="p-4 font-bold text-gray-800">
                        {c.discountType === 'percentage' ? `${c.discountAmount}%` : `₹${c.discountAmount}`}
                      </td>
                      <td className="p-4">₹{c.minPurchaseAmount}</td>
                      <td className="p-4 font-bold">{c.usageCount} / {c.usageLimit}</td>
                      <td className="p-4">{new Date(c.expiryDate).toLocaleDateString()}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteCoupon(c._id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded"
                          title="Delete Coupon"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default CouponManagement;
