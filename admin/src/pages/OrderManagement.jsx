import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, ShieldAlert, CheckCircle2, Truck, Printer, X, Save } from 'lucide-react';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detail Modal popup States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState('Pending');
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  // Invoice view state
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setStatus(order.orderStatus);
    setCarrier(order.carrier || '');
    setTrackingNumber(order.trackingNumber || '');
    setIsPaid(order.isPaid || false);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const { data } = await axios.put(
        `/api/orders/${selectedOrder._id}/status`,
        { status, carrier, trackingNumber, isPaid },
        config
      );

      alert('Order status updated successfully!');
      setSelectedOrder(data);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Order Management</h1>
        <p className="text-xs text-gray-500 mt-1">Fulfill orders, issue tracking numbers, and view customer invoices.</p>
      </div>

      {/* Orders Table */}
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
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Total Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500 italic">No orders received yet.</td>
                  </tr>
                ) : (
                  orders.map((ord) => (
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
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${ord.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {ord.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleRowClick(ord)}
                          className="bg-gray-100 hover:bg-gold/15 text-gray-700 hover:text-gold-dark p-2 rounded"
                          title="View Details"
                        >
                          <Eye size={14} />
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

      {/* DETAIL MODAL POPUP */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gold max-w-4xl w-full rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-scaleUp">
            
            {/* Left side details (8 cols in logic) */}
            <div className="flex-grow p-6 overflow-y-auto space-y-6 custom-scrollbar md:w-3/5 border-r border-gray-100">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-serif text-base font-bold text-earth uppercase">Order Information</h3>
                  <span className="font-mono text-[10px] text-gray-400">ID: {selectedOrder._id}</span>
                </div>
                <button
                  onClick={() => setInvoiceOrder(selectedOrder)}
                  className="bg-gray-100 hover:bg-gold/20 text-gold-dark p-2 rounded flex items-center gap-1 text-[10px] uppercase font-bold"
                >
                  <Printer size={12} /> Invoice
                </button>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Customer Details</span>
                  <span className="font-bold text-gray-800 block mt-1">{selectedOrder.user?.name || 'N/A'}</span>
                  <span className="text-gray-500 block">{selectedOrder.user?.email || 'N/A'}</span>
                  <span className="text-gray-500 block">{selectedOrder.shippingAddress?.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Shipping Address</span>
                  <span className="text-gray-500 block mt-1">{selectedOrder.shippingAddress?.street}</span>
                  <span className="text-gray-500 block">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zipCode}</span>
                  <span className="text-gray-400 block">{selectedOrder.shippingAddress?.country}</span>
                </div>
              </div>

              {/* Items lists */}
              <div className="space-y-3">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Items List</span>
                {selectedOrder.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-xs border-b border-gray-50 pb-2.5 last:border-b-0 last:pb-0 justify-between items-center">
                    <div className="flex gap-2">
                      <div className="w-8 h-10 bg-cream rounded overflow-hidden">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 block">{item.name}</span>
                        <span className="text-[10px] text-gray-400 block">Size: {item.size} | Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Costs summary */}
              <div className="bg-gray-50 p-4 rounded border border-gray-200 grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-500">Items Price:</div>
                <div className="text-right font-semibold text-gray-800">₹{selectedOrder.totalPrice}</div>
                {selectedOrder.discountPrice > 0 && (
                  <>
                    <div className="text-green-700">Discount Applied:</div>
                    <div className="text-right font-semibold text-green-700">−₹{selectedOrder.discountPrice}</div>
                  </>
                )}
                <div className="text-gray-500">GST (18%):</div>
                <div className="text-right font-semibold text-gray-800">₹{selectedOrder.taxPrice}</div>
                <div className="text-gray-500">Shipping Price:</div>
                <div className="text-right font-semibold text-gray-800">₹{selectedOrder.shippingPrice}</div>
                <div className="text-earth font-bold border-t border-gray-200 pt-2 text-sm uppercase">Grand Total:</div>
                <div className="text-right font-bold text-earth border-t border-gray-200 pt-2 text-sm">₹{selectedOrder.finalPrice}</div>
              </div>

            </div>

            {/* Right side controls Form (2 cols in logic) */}
            <form onSubmit={handleUpdateStatus} className="p-6 md:w-2/5 flex flex-col justify-between h-full space-y-4 shrink-0 bg-gray-50 border-t md:border-t-0 border-gray-200">
              
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="font-serif text-sm font-bold text-earth uppercase">Fulfillment Controls</span>
                <button type="button" onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-500 uppercase">Order Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded p-2 focus:outline-none cursor-pointer font-semibold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-500 uppercase">Carrier / Shipping Partner</label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded p-2 focus:outline-none"
                    placeholder="e.g. Blue Dart"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-500 uppercase">AWB Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded p-2 focus:outline-none"
                    placeholder="e.g. AWB123456789"
                  />
                </div>

                <div className="flex items-center pt-2">
                  <label className="flex items-center font-semibold text-gray-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isPaid}
                      onChange={(e) => setIsPaid(e.target.checked)}
                      className="rounded text-gold border-gray-300 mr-2 w-4 h-4"
                    />
                    Mark Invoice as Paid
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-dark text-earth py-2.5 rounded font-bold text-xs uppercase flex items-center justify-center gap-1 mt-4"
              >
                <Save size={14} /> Update Shipping Status
              </button>

            </form>

          </div>
        </div>
      )}

      {/* PRINTABLE INVOICE SHEET VIEW */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col p-8 overflow-y-auto print:p-0">
          
          {/* Header Controls for Screen View */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6 print:hidden">
            <h3 className="font-serif text-lg font-bold text-earth">Print Invoice Invoice</h3>
            <div className="flex gap-2">
              <button
                onClick={printInvoice}
                className="bg-gold text-earth font-bold text-xs uppercase px-4 py-2 rounded flex items-center gap-1"
              >
                <Printer size={14} /> Print
              </button>
              <button
                onClick={() => setInvoiceOrder(null)}
                className="border border-gray-300 text-gray-600 font-semibold text-xs uppercase px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>

          {/* Actual Sheet content */}
          <div className="max-w-3xl mx-auto w-full p-6 border border-gray-300 shadow-lg print:border-none print:shadow-none space-y-8 text-xs sm:text-sm text-gray-600">
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-serif text-2xl font-bold text-earth tracking-widest uppercase">ANUSREE TEX</h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Tradition Woven with Elegance</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-800 uppercase block">INVOICE</span>
                <span className="font-mono text-gray-500 block mt-1">Receipt ID: {invoiceOrder._id}</span>
                <span className="text-gray-400 block">Date: {new Date(invoiceOrder.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="font-bold text-gray-800 uppercase block mb-1.5">Supplier Details</span>
                <span className="block"><b>Anusree Tex Handloom Co-Op Ltd</b></span>
                <span className="block">12 Temple Street, T. Nagar</span>
                <span className="block">Chennai, Tamil Nadu 600017</span>
                <span className="block">GSTIN: 33AAAAA1111A1Z1</span>
              </div>
              <div>
                <span className="font-bold text-gray-800 uppercase block mb-1.5">Billing / Shipping To</span>
                <span className="block"><b>{invoiceOrder.user?.name || 'Deleted Account'}</b></span>
                <span className="block">{invoiceOrder.shippingAddress?.street}</span>
                <span className="block">{invoiceOrder.shippingAddress?.city}, {invoiceOrder.shippingAddress?.state} - {invoiceOrder.shippingAddress?.zipCode}</span>
                <span className="block">Phone: {invoiceOrder.shippingAddress?.phone || 'N/A'}</span>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-left border-collapse border border-gray-200 text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-800">
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5">Size</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Price</th>
                  <th className="p-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceOrder.orderItems?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-2.5 font-semibold text-gray-800">{item.name}</td>
                    <td className="p-2.5">{item.size}</td>
                    <td className="p-2.5 text-center">{item.quantity}</td>
                    <td className="p-2.5 text-right">₹{item.price}</td>
                    <td className="p-2.5 text-right font-semibold text-gray-800">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Math */}
            <div className="flex justify-end pt-4">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal Amount:</span>
                  <span>₹{invoiceOrder.totalPrice}</span>
                </div>
                {invoiceOrder.discountPrice > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount:</span>
                    <span>−₹{invoiceOrder.discountPrice}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>GST (18%):</span>
                  <span>₹{invoiceOrder.taxPrice}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Charge:</span>
                  <span>₹{invoiceOrder.shippingPrice}</span>
                </div>
                <div className="flex justify-between font-bold text-earth text-sm border-t border-gray-300 pt-2.5 uppercase">
                  <span>Final Total:</span>
                  <span>₹{invoiceOrder.finalPrice}</span>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="text-center text-[10px] text-gray-400 space-y-1 py-4">
              <p>Thank you for supporting handloom weaving co-operatives in Tamil Nadu.</p>
              <p>This is a computer generated invoice and does not require signatures.</p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default OrderManagement;
