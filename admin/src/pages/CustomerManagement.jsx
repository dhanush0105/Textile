import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, Search } from 'lucide-react';

const CustomerManagement = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/customers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [navigate]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Customer logs</h1>
          <p className="text-xs text-gray-500 mt-1">Review accounts activity, purchase statistics, and profiles.</p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name/email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-gray-300 rounded px-4 py-2 pl-9 text-xs focus:outline-none focus:border-gold w-64"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
        </div>
      </div>

      {/* Customers Table */}
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
                  <th className="p-4">Customer ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4 text-center">Orders Placed</th>
                  <th className="p-4">Total Spends</th>
                  <th className="p-4">Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-500 italic">No customers matched this query.</td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr key={c._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-gray-600">
                      <td className="p-4 font-mono font-semibold text-earth">{c._id}</td>
                      <td className="p-4">
                        <span className="font-bold text-gray-800 block">{c.name}</span>
                        <span className="text-[10px] text-gray-400 block">{c.email}</span>
                      </td>
                      <td className="p-4 font-semibold">{c.phone}</td>
                      <td className="p-4 text-center font-bold text-gray-800">{c.ordersCount} orders</td>
                      <td className="p-4 font-bold text-green-700">₹{c.totalSpend}</td>
                      <td className="p-4">{new Date(c.createdAt).toLocaleDateString()}</td>
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

export default CustomerManagement;
