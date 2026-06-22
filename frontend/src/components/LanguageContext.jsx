import React, { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../store/authSlice.js';

const LanguageContext = createContext();

const translations = {
  en: {
    brandName: 'Anusree Tex',
    tagline: 'Tradition Woven with Elegance',
    home: 'Home',
    shop: 'Shop',
    about: 'About Us',
    blog: 'Blog',
    contact: 'Contact Us',
    cart: 'Cart',
    checkout: 'Checkout',
    myAccount: 'My Account',
    searchPlaceholder: 'Search for premium veshtis...',
    sortBy: 'Sort By',
    featured: 'Featured Collections',
    newArrivals: 'New Arrivals',
    bestSellers: 'Best Sellers',
    weddingColl: 'Wedding Collection',
    festivalColl: 'Festival Collection',
    cottonVeshti: 'Cotton Veshti',
    silkVeshti: 'Silk Veshti',
    premiumColl: 'Premium Collection',
    offers: 'Offers',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    reviews: 'Reviews',
    fabric: 'Fabric',
    borderType: 'Border Type',
    borderSize: 'Border Size',
    occasion: 'Occasion',
    color: 'Color',
    price: 'Price',
    size: 'Size',
    quantity: 'Quantity',
    washingInstructions: 'Washing Instructions',
    sizeGuide: 'Size Guide',
    orderSummary: 'Order Summary',
    applyCoupon: 'Apply Coupon',
    couponPlaceholder: 'Enter Coupon Code',
    subtotal: 'Subtotal',
    discount: 'Discount',
    gst: 'GST (18%)',
    shipping: 'Shipping',
    total: 'Total',
    checkoutBtn: 'Proceed to Checkout',
    faq: 'Frequently Asked Questions',
    testimonials: 'What Our Customers Say',
    newsletterTitle: 'Subscribe to Our Heritage Newsletter',
    newsletterSubtitle: 'Receive styling guides, exclusive discounts, and collection launches.',
    subscribe: 'Subscribe',
    howToWear: 'How to Wear a Traditional Veshti',
    viewDetails: 'View Details',
    shippingAddress: 'Shipping Address',
    paymentMethod: 'Payment Method',
    placeOrder: 'Place Order',
    profile: 'Profile',
    orderHistory: 'Order History',
    wishlist: 'Wishlist',
    savedAddresses: 'Saved Addresses',
  },
  ta: {
    brandName: 'அனுஸ்ரீ டெக்ஸ்',
    tagline: 'பாரம்பரியம் மற்றும் கண்ணியம் நிறைந்த நெசவு',
    home: 'முகப்பு',
    shop: 'கடை',
    about: 'எங்களைப் பற்றி',
    blog: 'வலைப்பதிவு',
    contact: 'தொடர்பு கொள்ள',
    cart: 'கூடை',
    checkout: 'பணம் செலுத்துதல்',
    myAccount: 'எனது கணக்கு',
    searchPlaceholder: 'பிரீமியம் வேஷ்டிகளைத் தேடுங்கள்...',
    sortBy: 'வரிசைப்படுத்து',
    featured: 'சிறப்புத் தொகுப்புகள்',
    newArrivals: 'புதிய வரவுகள்',
    bestSellers: 'அதிகம் விற்பனையாகும் தயாரிப்புகள்',
    weddingColl: 'திருமணத் தொகுப்பு',
    festivalColl: 'பண்டிகைத் தொகுப்பு',
    cottonVeshti: 'பருத்தி வேஷ்டி',
    silkVeshti: 'பட்டு வேஷ்டி',
    premiumColl: 'பிரீமியம் தொகுப்பு',
    offers: 'சலுகைகள்',
    addToCart: 'கூடையில் சேர்க்க',
    buyNow: 'இப்போது வாங்க',
    inStock: 'இருப்பில் உள்ளது',
    outOfStock: 'இருப்பில் இல்லை',
    reviews: 'மதிப்புரைகள்',
    fabric: 'துணி வகை',
    borderType: 'பார்டர் வகை',
    borderSize: 'பார்டர் அளவு',
    occasion: 'சந்தர்ப்பம்',
    color: 'நிறம்',
    price: 'விலை',
    size: 'அளவு',
    quantity: 'அளவு',
    washingInstructions: 'துவைக்கும் முறைகள்',
    sizeGuide: 'அளவு வழிகாட்டி',
    orderSummary: 'ஆர்டர் சுருக்கம்',
    applyCoupon: 'கூப்பனைப் பயன்படுத்து',
    couponPlaceholder: 'கூப்பன் குறியீட்டை உள்ளிடவும்',
    subtotal: 'துணைத்தொகை',
    discount: 'தள்ளுபடி',
    gst: 'ஜிஎஸ்டி (18%)',
    shipping: 'கப்பல் கட்டணம்',
    total: 'மொத்தம்',
    checkoutBtn: 'சரிபார்ப்புக்குச் செல்லவும்',
    faq: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    testimonials: 'எங்கள் வாடிக்கையாளர்கள் கூறுவது',
    newsletterTitle: 'எங்கள் பாரம்பரிய செய்திமடலுக்கு குழுசேரவும்',
    newsletterSubtitle: 'ஸ்டைலிங் வழிகாட்டிகள், பிரத்தியேக தள்ளுபடிகள் மற்றும் தயாரிப்பு அறிமுகங்களைப் பெறுங்கள்.',
    subscribe: 'குழுசேர்',
    howToWear: 'பாரம்பரிய வேஷ்டி அணிவது எப்படி',
    viewDetails: 'விவரங்களைக் காண்க',
    shippingAddress: 'கப்பல் முகவரி',
    paymentMethod: 'பணம் செலுத்தும் முறை',
    placeOrder: 'ஆர்டர் செய்',
    profile: 'விவரக்குறிப்பு',
    orderHistory: 'ஆர்டர் வரலாறு',
    wishlist: 'விருப்பப் பட்டியல்',
    savedAddresses: 'சேமித்த முகவரிகள்',
  },
};

export const LanguageProvider = ({ children }) => {
  const language = useSelector((state) => state.auth.language);
  const dispatch = useDispatch();

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ta' : 'en';
    dispatch(setLanguage(nextLang));
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
