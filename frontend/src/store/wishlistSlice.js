import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlistItems: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    wishlistRequest: (state) => {
      state.loading = true;
    },
    wishlistSuccess: (state, action) => {
      state.loading = false;
      state.wishlistItems = action.payload;
      state.error = null;
    },
    wishlistFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    wishlistClear: (state) => {
      state.wishlistItems = [];
      state.error = null;
    }
  },
});

export const { wishlistRequest, wishlistSuccess, wishlistFail, wishlistClear } = wishlistSlice.actions;
export default wishlistSlice.reducer;
