import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import cartReducer from './cartSlice.js';
import wishlistReducer from './wishlistSlice.js';
import productsReducer from './productsSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productsReducer,
  },
});
