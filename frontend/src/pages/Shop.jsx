import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import {
  productsRequest,
  productsSuccess,
  productsFail,
  setFilter,
  resetFilters,
  setSort,
  setActiveCategory,
} from '../store/productsSlice.js';
import axios from 'axios';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

const Shop = () => {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { products, loading, error, filters, sort, activeCategory } = useSelector((state) => state.products);

  // Parse URL category parameter if any
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      dispatch(setActiveCategory(urlCategory));
    }
  }, [searchParams, dispatch]);

  // Fetch products based on active filters and sorts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(productsRequest());
        
        // Build query string
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (activeCategory) params.append('category', activeCategory);
        if (filters.fabric) params.append('fabric', filters.fabric);
        if (filters.borderType) params.append('borderType', filters.borderType);
        if (filters.occasion) params.append('occasion', filters.occasion);
        if (filters.color) params.append('color', filters.color);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (sort) params.append('sort', sort);

        const { data } = await axios.get(`/api/products?${params.toString()}`);
        dispatch(productsSuccess(data));
      } catch (err) {
        dispatch(productsFail(err.response?.data?.message || err.message));
      }
    };
    fetchProducts();
  }, [filters, sort, activeCategory, dispatch]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ [key]: value }));
  };

  const handleCategoryChange = (slug) => {
    dispatch(setActiveCategory(slug));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  // Lists of available filters based on our product seeder attributes
  const fabrics = ['Cotton', 'Silk', 'Art Silk'];
  const borderTypes = ['Gold Jari', 'Silver Jari', 'Temple', 'Thread'];
  const occasions = ['Wedding', 'Festival', 'Casual'];
  const colors = ['White', 'Off-white', 'Cream'];
  const categoriesList = [
    { name: t('cottonVeshti'), slug: 'cotton-veshti' },
    { name: t('silkVeshti'), slug: 'silk-veshti' },
    { name: t('weddingColl'), slug: 'wedding-collection' },
    { name: t('premiumColl'), slug: 'premium-collection' },
    { name: t('offers'), slug: 'offers' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Search and Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-earth tracking-wide uppercase">{t('shop')}</h1>
          <p className="text-xs text-gray-500 mt-1">
            {products.length} {language === 'en' ? 'premium products found' : 'சிறந்த தயாரிப்புகள் கண்டறியப்பட்டன'}
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="bg-white border border-gold/30 rounded px-4 py-2 text-sm focus:outline-none focus:border-gold w-64"
          />

          {/* Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">{t('sortBy')}:</span>
            <select
              value={sort}
              onChange={(e) => dispatch(setSort(e.target.value))}
              className="bg-white border border-gold/30 text-earth text-xs rounded px-3 py-2 focus:outline-none focus:border-gold cursor-pointer"
            >
              <option value="new">{language === 'en' ? 'New Arrivals' : 'புதிய வரவுகள்'}</option>
              <option value="priceAsc">{language === 'en' ? 'Price: Low to High' : 'விலை: குறைந்ததிலிருந்து அதிகம்'}</option>
              <option value="priceDesc">{language === 'en' ? 'Price: High to Low' : 'விலை: அதிகத்திலிருந்து குறைவு'}</option>
              <option value="rating">{language === 'en' ? 'Highest Rating' : 'உயர்ந்த மதிப்பீடு'}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FILTERS SIDEBAR (3 cols) */}
        <aside className="lg:col-span-3 space-y-6 bg-white border border-gold/15 p-6 rounded-lg shadow-sm h-fit">
          <div className="flex justify-between items-center border-b border-gold/15 pb-4">
            <h2 className="font-serif text-lg font-bold text-earth flex items-center">
              <SlidersHorizontal size={18} className="text-gold-dark mr-2" />
              {language === 'en' ? 'Filters' : 'வடிகட்டிகள்'}
            </h2>
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-gold-dark flex items-center gap-1 font-semibold"
            >
              <RotateCcw size={12} /> {language === 'en' ? 'Reset' : 'மீட்டமை'}
            </button>
          </div>

          {/* 1. Category Filter */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider font-bold text-gold-dark">{language === 'en' ? 'Category' : 'வகை'}</h3>
            <div className="flex flex-col gap-1.5 text-sm">
              <button
                onClick={() => handleCategoryChange('')}
                className={`text-left py-1 hover:text-gold transition-colors ${!activeCategory ? 'text-gold-dark font-bold' : 'text-gray-600'}`}
              >
                {language === 'en' ? 'All Collections' : 'அனைத்து தொகுப்புகள்'}
              </button>
              {categoriesList.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`text-left py-1 hover:text-gold transition-colors ${activeCategory === cat.slug ? 'text-gold-dark font-bold' : 'text-gray-600'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gold/10" />

          {/* 2. Fabric Filter */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider font-bold text-gold-dark">{t('fabric')}</h3>
            <div className="flex flex-col gap-1.5">
              {fabrics.map((f, idx) => (
                <label key={idx} className="flex items-center text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.fabric === f}
                    onChange={() => handleFilterChange('fabric', filters.fabric === f ? '' : f)}
                    className="rounded text-gold-dark focus:ring-gold border-gold/30 mr-2.5 w-4 h-4 cursor-pointer"
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gold/10" />

          {/* 3. Border Type Filter */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider font-bold text-gold-dark">{t('borderType')}</h3>
            <div className="flex flex-col gap-1.5">
              {borderTypes.map((bt, idx) => (
                <label key={idx} className="flex items-center text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.borderType === bt}
                    onChange={() => handleFilterChange('borderType', filters.borderType === bt ? '' : bt)}
                    className="rounded text-gold-dark focus:ring-gold border-gold/30 mr-2.5 w-4 h-4 cursor-pointer"
                  />
                  {bt}
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gold/10" />

          {/* 4. Price Filter */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider font-bold text-gold-dark">{t('price')}</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-1/2 bg-cream-light border border-gold/30 rounded px-2 py-1 text-xs focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-1/2 bg-cream-light border border-gold/30 rounded px-2 py-1 text-xs focus:outline-none"
              />
            </div>
          </div>

          <hr className="border-gold/10" />

          {/* 5. Occasion Filter */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider font-bold text-gold-dark">{t('occasion')}</h3>
            <div className="flex flex-col gap-1.5">
              {occasions.map((oc, idx) => (
                <label key={idx} className="flex items-center text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.occasion === oc}
                    onChange={() => handleFilterChange('occasion', filters.occasion === oc ? '' : oc)}
                    className="rounded text-gold-dark focus:ring-gold border-gold/30 mr-2.5 w-4 h-4 cursor-pointer"
                  />
                  {oc}
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gold/10" />

          {/* 6. Color Filter */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider font-bold text-gold-dark">{t('color')}</h3>
            <div className="flex flex-col gap-1.5">
              {colors.map((c, idx) => (
                <label key={idx} className="flex items-center text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.color === c}
                    onChange={() => handleFilterChange('color', filters.color === c ? '' : c)}
                    className="rounded text-gold-dark focus:ring-gold border-gold/30 mr-2.5 w-4 h-4 cursor-pointer"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* PRODUCTS GRID (9 cols) */}
        <main className="lg:col-span-9">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold-dark" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-8 border border-red-200 bg-red-50 rounded">
              Error fetching products: {error}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-gold/35 rounded bg-cream-light/40 space-y-4">
              <Filter size={48} className="mx-auto text-gold-dark/40" />
              <h3 className="font-serif text-lg font-bold text-earth">No products match filters</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">Try resetting your filters or typing different search phrases to find what you want.</p>
              <button
                onClick={handleReset}
                className="bg-gold text-earth font-bold text-xs uppercase px-4 py-2 rounded transition-colors hover:bg-gold-dark"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
};

export default Shop;
