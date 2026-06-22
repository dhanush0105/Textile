import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { DollarSign, ShoppingBag, Users, Coins, ArrowUpRight, TrendingUp } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const { data } = await axios.get('/api/admin/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('adminToken');
          navigate('/login');
        }
        setLoading(false);
      }
    };
    fetchStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gold-dark" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-gray-500">
        Could not load analytics metrics. Please ensure Express backend and MongoDB are active.
      </div>
    );
  }

  const { metrics, analytics, topProducts, recentOrders } = stats;

  // Chart 1: Monthly Revenue Bar Chart
  const revenueChartData = {
    labels: analytics?.map(item => item.month) || ['No Data'],
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: analytics?.map(item => item.revenue) || [0],
        backgroundColor: 'rgba(212, 175, 55, 0.75)', // Gold
        borderColor: '#AA7C11',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Chart 2: Monthly Orders Line Chart
  const ordersChartData = {
    labels: analytics?.map(item => item.month) || ['No Data'],
    datasets: [
      {
        label: 'Orders Volume',
        data: analytics?.map(item => item.orders) || [0],
        backgroundColor: 'rgba(26, 15, 6, 0.1)', // Earth brown transparency
        borderColor: '#1A0F06',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Chart 3: Top Products Doughnut
  const topProductsChartData = {
    labels: topProducts?.map(p => p.name.substring(0, 15) + '...') || ['No Data'],
    datasets: [
      {
        data: topProducts?.map(p => p.unitsSold) || [0],
        backgroundColor: [
          '#AA7C11', // Gold Dark
          '#D4AF37', // Gold Main
          '#F4D068', // Gold Light
          '#1A0F06', // Earth Brown
          '#8C6239', // Bronze
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide uppercase">Overview Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">Real-time metrics, revenue analytics, and purchase logs.</p>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Revenue</span>
            <span className="text-2xl font-bold text-gray-800 block">₹{metrics.totalRevenue}</span>
          </div>
          <div className="bg-gold/15 p-3 rounded-full text-gold-dark">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Sales */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Payments Settled</span>
            <span className="text-2xl font-bold text-gray-800 block">{metrics.totalSales}</span>
          </div>
          <div className="bg-green-100 p-3 rounded-full text-green-700">
            <Coins size={24} />
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Orders</span>
            <span className="text-2xl font-bold text-gray-800 block">{metrics.totalOrders}</span>
          </div>
          <div className="bg-blue-100 p-3 rounded-full text-blue-700">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Registered Clients</span>
            <span className="text-2xl font-bold text-gray-800 block">{metrics.totalCustomers}</span>
          </div>
          <div className="bg-purple-100 p-3 rounded-full text-purple-700">
            <Users size={24} />
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Revenue Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
            <TrendingUp size={18} className="text-gold-dark" />
            Monthly Revenue Growth
          </h3>
          <div className="h-64 relative">
            <Bar data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Top Products Doughnut (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Top Selling Products
          </h3>
          <div className="h-64 relative flex items-center justify-center">
            {topProducts?.length > 0 ? (
              <Doughnut data={topProductsChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
              <span className="text-xs text-gray-400">No sale records available.</span>
            )}
          </div>
        </div>

        {/* Order Flow Line Chart (12 cols) */}
        <div className="lg:col-span-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Orders Volume Trends
          </h3>
          <div className="h-48 relative">
            <Line data={ordersChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

      </div>

      {/* Bottom Layout: Recent Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Recent Orders placed</h3>
          <button 
            onClick={() => navigate('/orders')}
            className="text-xs font-semibold text-gold-dark hover:text-earth flex items-center gap-0.5"
          >
            Manage All Orders <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Method</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500 italic">No orders received yet.</td>
                </tr>
              ) : (
                recentOrders?.map((ord) => (
                  <tr key={ord._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-gray-600">
                    <td className="p-4 font-mono font-semibold text-earth">{ord._id}</td>
                    <td className="p-4">
                      <span className="font-bold text-gray-800 block">{ord.user?.name || 'Deleted Account'}</span>
                      <span className="text-[10px] text-gray-400 block">{ord.user?.email || 'N/A'}</span>
                    </td>
                    <td className="p-4 font-semibold">{ord.paymentMethod}</td>
                    <td className="p-4 font-bold text-gray-800">₹{ord.finalPrice}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${ord.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : ord.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-4">{new Date(ord.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
