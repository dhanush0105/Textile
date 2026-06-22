import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay only if key details exist
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// @desc    Create a payment order
// @route   POST /api/payments/create-order
// @access  Private
export const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body; // In INR (e.g. 500)

  try {
    const options = {
      amount: Math.round(amount * 100), // in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    if (razorpayInstance) {
      const order = await razorpayInstance.orders.create(options);
      res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        isMock: false,
      });
    } else {
      // Return mock payment credentials
      res.json({
        id: `mock_order_${Math.random().toString(36).substring(7)}`,
        amount: options.amount,
        currency: 'INR',
        isMock: true,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify payment signature
// @route   POST /api/payments/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  try {
    if (!razorpayInstance) {
      // Mock validation succeeds automatically
      return res.json({ success: true, message: 'Mock payment verified successfully' });
    }

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    if (digest === razorpaySignature) {
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
