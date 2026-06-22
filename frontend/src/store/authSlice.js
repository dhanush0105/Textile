import { createSlice } from '@reduxjs/toolkit';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
  language: localStorage.getItem('language') || 'en', // 'en' or 'ta'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.error = null;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('cartItems');
    },
    updateProfileSuccess: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    updateAddressesSuccess: (state, action) => {
      if (state.userInfo) {
        state.userInfo.addresses = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      }
    }
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFail,
  logout,
  updateProfileSuccess,
  setLanguage,
  updateAddressesSuccess,
} = authSlice.actions;

export default authSlice.reducer;
