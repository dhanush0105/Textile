import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLanguage } from './LanguageContext.jsx';
import { logout } from '../store/authSlice.js';
import { Menu, X, ShoppingBag, Heart, User, Globe, Search } from 'lucide-react';
import { setFilter } from '../store/productsSlice.js';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const { t, language, toggleLanguage } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilter({ search: searchInput }));
    navigate('/shop');
  };

  return (
    <nav className="sticky top-0 z-50 bg-cream-light border-b border-gold-dark/20 shadow-md">
      {/* Top Bar Banner */}
      <div className="bg-earth text-cream-light text-center py-1 text-xs tracking-wider border-b border-gold">
        ✨ {language === 'en' ? 'Free Shipping on orders above ₹1500' : '₹1500க்கு மேல் வாங்கும் ஆர்டர்களுக்கு இலவச டெலிவரி'} | {language === 'en' ? 'Authentic South Indian Heritage' : 'உண்மையான தென்னிந்திய பாரம்பரியம்'}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex flex-col items-center">
              <span className="font-serif text-2xl font-bold tracking-widest text-earth select-none">
                ANUSREE <span className="gold-text">TEX</span>
              </span>
              <span className="text-[9px] font-sans tracking-widest uppercase text-gold-dark mt-[-3px] font-medium">
                {t('tagline')}
              </span>
            </Link>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-grow max-w-md mx-8 relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white border border-gold/40 text-earth rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-gold-dark text-sm transition-colors duration-200"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gold-dark hover:text-earth">
              <Search size={18} />
            </button>
          </form>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-earth hover:text-gold-dark font-medium transition-colors duration-200 text-sm tracking-wide">
              {t('home')}
            </Link>
            <Link to="/shop" className="text-earth hover:text-gold-dark font-medium transition-colors duration-200 text-sm tracking-wide">
              {t('shop')}
            </Link>
            <Link to="/about" className="text-earth hover:text-gold-dark font-medium transition-colors duration-200 text-sm tracking-wide">
              {t('about')}
            </Link>
            <Link to="/blog" className="text-earth hover:text-gold-dark font-medium transition-colors duration-200 text-sm tracking-wide">
              {t('blog')}
            </Link>
            <Link to="/contact" className="text-earth hover:text-gold-dark font-medium transition-colors duration-200 text-sm tracking-wide">
              {t('contact')}
            </Link>
          </div>

          {/* Actions & Utilities */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center text-earth hover:text-gold-dark font-medium transition-colors duration-200 text-xs border border-gold/30 rounded-full px-3 py-1"
            >
              <Globe size={14} className="mr-1 text-gold-dark" />
              {language === 'en' ? 'தமிழ்' : 'English'}
            </button>

            {/* Wishlist */}
            <Link to="/dashboard?tab=wishlist" className="relative text-earth hover:text-gold-dark transition-colors duration-200">
              <Heart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-dark text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-earth hover:text-gold-dark transition-colors duration-200">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-earth text-cream-light border border-gold-light rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center text-earth hover:text-gold-dark transition-colors duration-200"
              >
                <User size={22} />
                {userInfo && <span className="text-xs font-semibold ml-1.5 max-w-[80px] truncate">{userInfo.name}</span>}
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gold/20 rounded-lg shadow-xl py-2 z-50">
                  {userInfo ? (
                    <>
                      {userInfo.role === 'admin' && (
                        <a
                          href="http://localhost:5174"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gold-dark font-bold hover:bg-cream-dark/30 transition-colors"
                        >
                          Admin Dashboard
                        </a>
                      )}
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-earth hover:bg-cream-dark/30 transition-colors"
                      >
                        {t('myAccount')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-earth hover:bg-cream-dark/30 transition-colors"
                      >
                        Login / Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center md:hidden space-x-4">
            <button
              onClick={toggleLanguage}
              className="text-earth border border-gold/30 rounded-full px-2 py-0.5 text-xs font-medium"
            >
              {language === 'en' ? 'தமிழ்' : 'En'}
            </button>
            <Link to="/cart" className="relative text-earth">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-earth text-cream-light rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-earth hover:text-gold-dark focus:outline-none"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gold/20 bg-cream-light px-4 py-4 space-y-3 shadow-inner">
          <form onSubmit={handleSearchSubmit} className="relative flex mb-4">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white border border-gold/40 text-earth rounded-full py-1.5 pl-3 pr-8 focus:outline-none text-xs"
            />
            <button type="submit" className="absolute right-2.5 top-2 text-gold-dark">
              <Search size={16} />
            </button>
          </form>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-earth font-medium hover:text-gold-dark py-1"
          >
            {t('home')}
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-earth font-medium hover:text-gold-dark py-1"
          >
            {t('shop')}
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-earth font-medium hover:text-gold-dark py-1"
          >
            {t('about')}
          </Link>
          <Link
            to="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-earth font-medium hover:text-gold-dark py-1"
          >
            {t('blog')}
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-earth font-medium hover:text-gold-dark py-1"
          >
            {t('contact')}
          </Link>
          <hr className="border-gold/20" />
          <div className="flex justify-between items-center pt-2">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-earth flex items-center"
            >
              <User size={16} className="mr-1" />
              {userInfo ? userInfo.name : t('myAccount')}
            </Link>
            <Link
              to="/dashboard?tab=wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-earth flex items-center"
            >
              <Heart size={16} className="mr-1 text-red-500" />
              {t('wishlist')} ({wishlistItems.length})
            </Link>
          </div>
          {userInfo && (
            <button
              onClick={handleLogout}
              className="w-full mt-4 text-center py-2 bg-red-50 text-red-600 rounded text-sm font-medium"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
