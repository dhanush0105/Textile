import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    fabric: '',
    borderType: '',
    occasion: '',
    color: '',
    minPrice: '',
    maxPrice: '',
  },
  sort: 'new',
  activeCategory: '',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    productsRequest: (state) => {
      state.loading = true;
    },
    productsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload;
      state.error = null;
    },
    productsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        fabric: '',
        borderType: '',
        occasion: '',
        color: '',
        minPrice: '',
        maxPrice: '',
      };
      state.activeCategory = '';
      state.sort = 'new';
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
  },
});

export const {
  productsRequest,
  productsSuccess,
  productsFail,
  setFilter,
  resetFilters,
  setSort,
  setActiveCategory,
} = productsSlice.actions;

export default productsSlice.reducer;
