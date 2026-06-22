import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get Admin dashboard analytics
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Customers
    const totalCustomers = await User.countDocuments({ role: 'user' });

    // 2. Total Orders
    const totalOrders = await Order.countDocuments({ orderStatus: { $ne: 'Cancelled' } });

    // 3. Total Revenue
    const revenueData = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$finalPrice' } } },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // 4. Sales count (Paid or COD not cancelled)
    const totalSales = await Order.countDocuments({ isPaid: true });

    // 5. Monthly Sales Analytics (For last 6 months)
    const monthlySales = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$finalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const analytics = monthlySales.map((item) => {
      const monthIndex = item._id.month - 1;
      return {
        month: `${months[monthIndex]} ${item._id.year}`,
        revenue: item.revenue,
        orders: item.orders,
      };
    });

    // 6. Top Selling Products
    const topProductsData = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$orderItems.name' },
          image: { $first: '$orderItems.image' },
          unitsSold: { $sum: '$orderItems.quantity' },
          totalSales: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 5 },
    ]);

    // 7. Recent Orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      metrics: {
        totalCustomers,
        totalOrders,
        totalRevenue,
        totalSales,
      },
      analytics,
      topProducts: topProductsData,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get registered customer logs
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getCustomersList = async (req, res) => {
  try {
    const customers = await User.find({ role: 'user' }).select('-password');
    const customerLogs = [];
    
    for (const customer of customers) {
      const orders = await Order.find({ user: customer._id });
      const totalSpend = orders
        .filter(o => o.orderStatus !== 'Cancelled')
        .reduce((acc, o) => acc + o.finalPrice, 0);
        
      customerLogs.push({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || 'N/A',
        ordersCount: orders.length,
        totalSpend,
        createdAt: customer.createdAt,
      });
    }
    
    res.json(customerLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
