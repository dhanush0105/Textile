import { createSlice } from '@reduxjs/toolkit';

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const initialState = {
  cartItems: cartItemsFromStorage,
  coupon: null, // { code, discountType, discountAmount, calculatedDiscount }
  shippingPrice: 100, // Flat ₹100 shipping
  taxPrice: 0.18, // 18% GST (mock)
};

const calculateTotals = (state) => {
  const itemsPrice = state.cartItems.reduce((acc, item) => {
    const activePrice = item.product.discountPrice || item.product.price;
    return acc + activePrice * item.quantity;
  }, 0);

  state.itemsPrice = itemsPrice;

  // Calculate coupon discount
  let discount = 0;
  if (state.coupon) {
    if (state.coupon.discountType === 'percentage') {
      discount = (itemsPrice * state.coupon.discountAmount) / 100;
    } else {
      discount = state.coupon.discountAmount;
    }
    // Cap at minimum items price
    if (discount > itemsPrice) {
      discount = itemsPrice;
    }
  }
  state.discountPrice = Math.round(discount);

  // Free shipping over ₹1500
  state.shippingPrice = itemsPrice > 1500 || itemsPrice === 0 ? 0 : 100;

  // GST calculation (18% on discounted subtotal)
  const taxableAmount = itemsPrice - state.discountPrice;
  state.taxPrice = Math.round(taxableAmount * 0.18);

  state.totalPrice = Math.max(0, Math.round(taxableAmount + state.shippingPrice + state.taxPrice));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      // Used to load cart from database on login
      state.cartItems = action.payload.map(item => ({
        _id: item._id,
        product: item.product,
        quantity: item.quantity,
        size: item.size
      }));
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      calculateTotals(state);
    },
    addItem: (state, action) => {
      const newItem = action.payload;
      const existItemIndex = state.cartItems.findIndex(
        (x) => x.product._id === newItem.product._id && x.size === newItem.size
      );

      if (existItemIndex > -1) {
        state.cartItems[existItemIndex].quantity += newItem.quantity;
      } else {
        state.cartItems.push(newItem);
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      calculateTotals(state);
    },
    updateItemQty: (state, action) => {
      const { productId, size, quantity } = action.payload;
      const index = state.cartItems.findIndex(
        (x) => x.product._id === productId && x.size === size
      );

      if (index > -1) {
        state.cartItems[index].quantity = Number(quantity);
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      calculateTotals(state);
    },
    removeItem: (state, action) => {
      const { productId, size } = action.payload;
      state.cartItems = state.cartItems.filter(
        (x) => !(x.product._id === productId && x.size === size)
      );

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      calculateTotals(state);
    },
    applyCouponSuccess: (state, action) => {
      state.coupon = action.payload;
      calculateTotals(state);
    },
    removeCoupon: (state) => {
      state.coupon = null;
      calculateTotals(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.coupon = null;
      localStorage.removeItem('cartItems');
      calculateTotals(state);
    },
  },
});

export const {
  setCart,
  addItem,
  updateItemQty,
  removeItem,
  applyCouponSuccess,
  removeCoupon,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
