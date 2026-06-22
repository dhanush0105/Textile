import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { wishlistRequest, wishlistSuccess, wishlistFail } from '../store/wishlistSlice.js';
import { addItem } from '../store/cartSlice.js';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      alert('Please log in to manage your wishlist');
      return;
    }

    try {
      dispatch(wishlistRequest());
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      if (isWishlisted) {
        const { data } = await axios.delete(`/api/wishlist/${product._id}`, config);
        dispatch(wishlistSuccess(data));
      } else {
        const { data } = await axios.post('/api/wishlist', { productId: product._id }, config);
        dispatch(wishlistSuccess(data));
      }
    } catch (error) {
      dispatch(wishlistFail(error.response?.data?.message || error.message));
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    
    const quantity = 1;
    const size = product.size || '4 Meters';
    
    // Add to redux store (local first)
    dispatch(
      addItem({
        product,
        quantity,
        size,
      })
    );

    // Sync to DB if logged in
    if (userInfo) {
      try {
        await axios.post(
          '/api/cart',
          { productId: product._id, quantity, size },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
      } catch (error) {
        console.error('Failed syncing cart to server', error);
      }
    }
  };

  const activePrice = product.discountPrice || product.price;
  const saving = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  // Render placeholder fallback images or dynamic premium svg gradients if the assets don't exist yet!
  // This makes the card look absolutely beautiful even before generating image assets.
  const imageUrl = product.images?.[0] || '';
  const hasLocalImage = imageUrl.startsWith('/assets/');
  
  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-gold/15 hover:border-gold shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      
      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-10 bg-cream-light/85 backdrop-blur-sm p-2 rounded-full border border-gold/15 text-earth hover:text-red-500 transition-colors duration-200"
      >
        <Heart size={18} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
      </button>

      {/* Savings Badge */}
      {saving > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-gold-dark text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
          {saving}% OFF
        </span>
      )}

      {/* Product Image Link */}
      <Link to={`/product/${product._id}`} className="block relative pt-[125%] overflow-hidden bg-cream-dark/10">
        {hasLocalImage ? (
          // Use SVG gradient canvas for visual excellence when images are loading/missing
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-earth/5 to-gold/10">
            <span className="text-earth/20 font-serif italic text-lg">{product.fabric} - {product.borderType}</span>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 opacity-80" style={{ backgroundImage: `url(${imageUrl})` }} />
          </div>
        ) : (
          <img
            src={imageUrl || '/assets/placeholder.jpg'}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600'; // luxury wedding fabric fallback
            }}
          />
        )}
      </Link>

      {/* Product Card Details */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Occasion / Fabric Category */}
        <span className="text-[10px] font-semibold text-gold-dark uppercase tracking-widest mb-1.5 block">
          {product.fabric} • {product.borderType}
        </span>

        {/* Title */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-serif text-sm font-semibold text-earth group-hover:text-gold-dark transition-colors line-clamp-2 h-10 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Ratings */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex text-gold">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                className={i < Math.round(product.ratings || 0) ? 'fill-current' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-[11px] text-gray-500">({product.numOfReviews || 0})</span>
        </div>

        {/* Pricing & Quick Add Button */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gold/10">
          <div className="flex flex-col">
            {product.discountPrice && (
              <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
            )}
            <span className="text-base font-bold text-earth">₹{activePrice}</span>
          </div>
          <button
            onClick={handleQuickAdd}
            className="bg-gold hover:bg-gold-dark text-earth p-2.5 rounded-full transition-all duration-200 hover:shadow-lg shrink-0"
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
