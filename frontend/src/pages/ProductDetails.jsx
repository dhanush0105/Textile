import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../components/LanguageContext.jsx';
import { addItem } from '../store/cartSlice.js';
import { wishlistRequest, wishlistSuccess, wishlistFail } from '../store/wishlistSlice.js';
import axios from 'axios';
import { Star, Heart, ShoppingBag, Eye, Calendar, Sparkles, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, language } = useLanguage();

  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'fabric', 'washing'

  // Hover Zoom States
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const zoomContainerRef = useRef(null);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setActiveImage(data.images?.[0] || '');
        setSelectedSize(data.size || '4 Meters (Double Veshti)');

        // Fetch Reviews
        const { data: reviewsData } = await axios.get(`/api/reviews/${id}`);
        setReviews(reviewsData);

        // Fetch Related Products (same category)
        const { data: allProducts } = await axios.get('/api/products');
        const related = allProducts
          .filter((p) => p.category?._id === data.category?._id && p._id !== data._id)
          .slice(0, 4);
        setRelatedProducts(related);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = zoomContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '250%',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const handleAddToCart = async () => {
    if (!product) return;
    dispatch(addItem({ product, quantity, size: selectedSize }));

    // Sync to DB if logged in
    if (userInfo) {
      try {
        await axios.post(
          '/api/cart',
          { productId: product._id, quantity, size: selectedSize },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
      } catch (err) {
        console.error('Failed syncing cart to server', err);
      }
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const toggleWishlist = async () => {
    if (!product) return;
    if (!userInfo) {
      alert('Please log in to manage your wishlist');
      return;
    }

    const isWishlisted = wishlistItems.some((item) => item._id === product._id);

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

  const submitReview = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      alert('Please log in to submit a review');
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.post(`/api/reviews/${product._id}`, { rating, comment }, config);
      setReviewSuccess(true);
      setComment('');
      
      // Re-fetch reviews and product details (for rating average recalculation)
      const { data: newReviews } = await axios.get(`/api/reviews/${product._id}`);
      setReviews(newReviews);
      
      const { data: updatedProduct } = await axios.get(`/api/products/${product._id}`);
      setProduct(updatedProduct);

      setTimeout(() => setReviewSuccess(false), 5000);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold-dark" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-earth">Product Not Found</h2>
        <Link to="/shop" className="bg-gold text-earth px-6 py-2.5 rounded font-bold">Go to Shop</Link>
      </div>
    );
  }

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Product Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Images Grid Columns (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Display Image Container with Hover Zoom */}
          <div
            ref={zoomContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative border border-gold/15 bg-white rounded-lg overflow-hidden pt-[125%] cursor-crosshair"
          >
            <img
              src={activeImage || '/assets/placeholder.jpg'}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';
              }}
            />
            {/* Magnifier Overlay */}
            <div
              style={zoomStyle}
              className="absolute inset-0 pointer-events-none border border-gold/20 shadow-inner rounded-lg"
            />
          </div>

          {/* Thumbnail Selectors */}
          <div className="flex gap-2">
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-24 border rounded overflow-hidden shrink-0 bg-white transition-all ${activeImage === img ? 'border-gold-dark ring-1 ring-gold-dark' : 'border-gold/20'}`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=100';
                  }}
                />
              </button>
            ))}
          </div>

        </div>

        {/* Details Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="space-y-2">
            <span className="text-gold-dark text-xs uppercase tracking-widest font-bold font-sans">
              {product.fabric} • {product.borderType}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth leading-tight">
              {product.name}
            </h1>
            
            {/* Ratings Header */}
            <div className="flex items-center space-x-2">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.round(product.ratings || 0) ? 'fill-current' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {product.ratings?.toFixed(1) || 0} ({reviews.length} {t('reviews')})
              </span>
            </div>
          </div>

          <hr className="border-gold/10" />

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-earth">₹{product.discountPrice || product.price}</span>
              {product.discountPrice && (
                <span className="text-sm text-gray-400 line-through">MRP ₹{product.price}</span>
              )}
            </div>
            <p className="text-[10px] text-gray-500 font-sans tracking-wide">Inclusive of all local handloom taxes & GST.</p>
          </div>

          {/* Selection Attributes */}
          <div className="space-y-4 pt-2">
            
            {/* Sizes */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-earth uppercase tracking-wide">{t('size')}</span>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-gold-dark hover:underline font-semibold"
                >
                  {t('sizeGuide')}
                </button>
              </div>
              <div className="flex gap-3">
                {['2 Meters (Single)', '4 Meters (Double Veshti)'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 border text-xs font-semibold rounded transition-all ${selectedSize === s ? 'border-gold-dark bg-gold/10 text-gold-dark font-bold' : 'border-gold/25 text-earth bg-white'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-earth uppercase tracking-wide">{t('quantity')}</span>
              <div className="flex items-center space-x-3">
                <div className="flex border border-gold/20 rounded bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-cream/30 text-earth font-bold text-sm"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold select-none">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1.5 hover:bg-cream/30 text-earth font-bold text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-500 italic">
                  {product.stock > 0 ? `${product.stock} ${t('inStock')}` : t('outOfStock')}
                </span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-grow bg-white border border-gold-dark text-gold-dark hover:bg-gold/5 px-6 py-4 rounded font-bold text-sm uppercase flex items-center justify-center gap-2 transition-all duration-200"
            >
              <ShoppingBag size={18} /> {t('addToCart')}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-grow bg-gold hover:bg-gold-dark text-earth px-6 py-4 rounded font-bold text-sm uppercase flex items-center justify-center gap-2 transition-all duration-200"
            >
              {t('buyNow')}
            </button>
            <button
              onClick={toggleWishlist}
              className={`p-4 border rounded transition-all shrink-0 ${isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-gold/25 text-earth hover:text-red-500 bg-white'}`}
            >
              <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
            </button>
          </div>

          <hr className="border-gold/10" />

          {/* Tabs Details Section */}
          <div className="space-y-4">
            <div className="flex border-b border-gold/10 text-xs">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-2.5 px-4 font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'description' ? 'border-gold-dark text-gold-dark' : 'border-transparent text-gray-500'}`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('fabric')}
                className={`pb-2.5 px-4 font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'fabric' ? 'border-gold-dark text-gold-dark' : 'border-transparent text-gray-500'}`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('washing')}
                className={`pb-2.5 px-4 font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'washing' ? 'border-gold-dark text-gold-dark' : 'border-transparent text-gray-500'}`}
              >
                Washing & Care
              </button>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed font-light px-4">
              {activeTab === 'description' && (
                <p>{product.description}</p>
              )}

              {activeTab === 'fabric' && (
                <ul className="space-y-2.5">
                  <li className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-earth">{t('fabric')}</span>
                    <span>{product.fabric}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-earth">{t('borderType')}</span>
                    <span>{product.borderType}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-earth">{t('borderSize')}</span>
                    <span>{product.borderSize || 'Standard'}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-earth">{t('occasion')}</span>
                    <span>{product.occasion}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-bold text-earth">{t('color')}</span>
                    <span>{product.color}</span>
                  </li>
                </ul>
              )}

              {activeTab === 'washing' && (
                <div className="space-y-2">
                  <p className="font-semibold text-earth">{t('washingInstructions')}:</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    {product.fabric === 'Silk' ? (
                      <>
                        <li>Dry clean only. Do not machine wash.</li>
                        <li>Avoid direct spraying of perfumes or deodorants onto the fabric/zari.</li>
                        <li>Iron at low-to-medium silk heat settings, preferably placing a cotton cloth over the veshti.</li>
                        <li>Store in clean muslin bags in a cool dry closet.</li>
                      </>
                    ) : (
                      <>
                        <li>Hand wash gently in cold water with mild detergent.</li>
                        <li>Wash dark colored border veshtis separately.</li>
                        <li>Do not wring forcefully. Line dry in shade.</li>
                        <li>Iron at cotton settings. Starch lightly if crisp fold look is desired.</li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-gold/15 pt-16">
        
        {/* Left Side: Reviews list (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-serif text-xl font-bold text-earth uppercase tracking-wide">
            {language === 'en' ? 'Customer Reviews' : 'வாடிக்கையாளர் மதிப்புரைகள்'} ({reviews.length})
          </h3>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500 italic bg-cream-light border border-gold/10 p-6 rounded">
              {language === 'en' ? 'No reviews yet for this product. Be the first to review!' : 'இன்னும் மதிப்புரைகள் இல்லை.'}
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev._id} className="border-b border-gold/10 pb-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="text-sm font-bold text-earth">{rev.name}</h5>
                    <span className="text-[11px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < rev.rating ? 'fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Add a Review form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gold/15 p-6 rounded-lg shadow-sm h-fit space-y-4">
          <h4 className="font-serif text-lg font-bold text-earth border-b border-gold/10 pb-3">
            {language === 'en' ? 'Write a Review' : 'மதிப்பீட்டை எழுதவும்'}
          </h4>

          {userInfo ? (
            <form onSubmit={submitReview} className="space-y-4">
              {reviewSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-2.5 rounded flex items-center gap-1.5">
                  <Check size={14} /> Review submitted successfully!
                </div>
              )}

              {/* Rating Star Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-earth uppercase tracking-wider">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-gold focus:outline-none hover:scale-110 transition-transform"
                    >
                      <Star
                        size={22}
                        className={star <= rating ? 'fill-current' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Text */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-earth uppercase tracking-wider">Comments</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience wearing this veshti, detailing the border finish, fabric quality, and comfort..."
                  className="w-full bg-cream-light border border-gold/30 rounded p-3 text-xs focus:outline-none focus:border-gold-dark"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-earth text-cream hover:bg-gold hover:text-earth py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-colors duration-200"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <div className="text-center p-6 border border-dashed border-gold/25 rounded bg-cream-light/40 space-y-3">
              <Eye size={32} className="mx-auto text-gold-dark/40 animate-pulse" />
              <p className="text-xs text-gray-500">Only verified buyers can leave a product review on Anusree Tex.</p>
              <Link to="/dashboard" className="inline-block bg-gold text-earth font-bold text-xs px-4 py-2 rounded uppercase tracking-wider">
                Log In to Review
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 border-t border-gold/15 pt-16">
          <div className="text-center space-y-2">
            <h3 className="font-serif text-2xl font-bold text-earth uppercase tracking-wider">
              {language === 'en' ? 'Related Masterpieces' : 'தொடர்புடைய சிறந்த தயாரிப்புகள்'}
            </h3>
            <div className="h-0.5 bg-gold w-16 mx-auto" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal Popup */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full border-2 border-gold rounded-lg shadow-2xl overflow-hidden animate-scaleUp">
            
            <div className="bg-earth text-gold px-6 py-4 flex justify-between items-center border-b border-gold-dark/20">
              <h3 className="font-serif text-lg font-bold">Veshti Size Guide</h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-cream hover:text-gold text-2xl font-bold focus:outline-none">&times;</button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
              <p>Anusree Tex veshtis are woven in two primary length configurations to match standard traditional draping preferences:</p>
              
              <table className="w-full text-left border-collapse border border-gold/20 text-xs">
                <thead>
                  <tr className="bg-cream-dark/20 border-b border-gold/20 font-bold text-earth">
                    <th className="p-2.5 border-r border-gold/20">Length Option</th>
                    <th className="p-2.5 border-r border-gold/20">Dimensions</th>
                    <th className="p-2.5">Style Preference</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gold/10">
                    <td className="p-2.5 border-r border-gold/20 font-bold text-earth">2 Meters (Single)</td>
                    <td className="p-2.5 border-r border-gold/20">2.0m x 1.1m (approx. 2.2 yards)</td>
                    <td className="p-2.5">Lightweight, direct wrap. Simple fold. Good for casual home wear, hot afternoons, and daily prayers.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border-r border-gold/20 font-bold text-earth">4 Meters (Double)</td>
                    <td className="p-2.5 border-r border-gold/20">4.0m x 1.1m (approx. 4.4 yards)</td>
                    <td className="p-2.5">Thick, premium look. Worn by folding in half. Mandatory for weddings, temple festivals, and formal receptions.</td>
                  </tr>
                </tbody>
              </table>

              <p className="italic text-[11px] text-gold-dark mt-2 font-medium">✨ All borders feature precision handloom weaving with a fixed height profile of 44 inches fitting heights from 5'2" to 6'4" comfortably.</p>
            </div>
            
            <div className="bg-cream-light/60 px-6 py-3 text-right border-t border-gold/10">
              <button
                onClick={() => setShowSizeGuide(false)}
                className="bg-earth text-cream-light font-bold text-xs uppercase px-4 py-2 rounded"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
