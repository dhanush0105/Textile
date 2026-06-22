import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../components/LanguageContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { productsRequest, productsSuccess, productsFail, setActiveCategory } from '../store/productsSlice.js';
import axios from 'axios';
import { Star, ChevronRight, Play, BookOpen, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading } = useSelector((state) => state.products);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        dispatch(productsRequest());
        const { data } = await axios.get('/api/products');
        dispatch(productsSuccess(data));
      } catch (error) {
        dispatch(productsFail(error.response?.data?.message || error.message));
      }
    };
    fetchFeaturedProducts();
  }, [dispatch]);

  const featuredCollections = [
    {
      name: language === 'en' ? 'Wedding Collection' : 'திருமணத் தொகுப்பு',
      desc: language === 'en' ? 'Authentic heavy gold jari pure silk veshtis' : 'கண்ணியமான பட்டு மற்றும் தங்க ஜரிகை வேஷ்டிகள்',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
      slug: 'wedding-collection',
    },
    {
      name: language === 'en' ? 'Festival Collection' : 'பண்டிகைத் தொகுப்பு',
      desc: language === 'en' ? 'Jari borders and traditional templates' : 'அழகான பார்டர் மற்றும் பாரம்பரிய வடிவங்கள்',
      image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=600',
      slug: 'festival-collection',
    },
    {
      name: language === 'en' ? 'Premium Handloom' : 'பிரீமியம் கைத்தறி',
      desc: language === 'en' ? 'High count fine Giza cotton drapes' : 'உயர்தர பருத்தி நூல்களால் நெய்யப்பட்டவை',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      slug: 'premium-collection',
    },
  ];

  const faqs = [
    {
      q: language === 'en' ? 'What sizes are available for Anusree Tex?' : 'என்னென்ன அளவுகளில் வேஷ்டிகள் கிடைக்கின்றன?',
      a: language === 'en' 
        ? 'We offer single veshtis (2 meters) and double veshtis (4 meters). The double veshti is folded in half when worn. Our standard width is 44 inches to fit all heights comfortably.'
        : 'நாங்கள் ஒற்றை வேஷ்டிகள் (2 மீட்டர்கள்) மற்றும் இரட்டை வேஷ்டிகள் (4 மீட்டர்கள்) வழங்குகிறோம். வேஷ்டியின் அகலம் 44 இன்ச் ஆகும்.',
    },
    {
      q: language === 'en' ? 'How do I care for my pure silk veshti?' : 'தூய பட்டு வேஷ்டியை எவ்வாறு பராமரிப்பது?',
      a: language === 'en'
        ? 'Pure silk veshtis should be dry cleaned only. Avoid folding them along the same crease repeatedly to prevent yarn breakage. Store in clean muslin wraps.'
        : 'தூய பட்டு வேஷ்டிகளை டிரை கிளீன் (dry clean) மட்டுமே செய்ய வேண்டும். ஒரே மடிப்பில் தொடர்ந்து மடிக்காமல் காற்றோட்டமாக வைக்கவும்.',
    },
    {
      q: language === 'en' ? 'Does the gold border tarnish over time?' : 'தங்க ஜரிகை பார்டர் மங்குமா?',
      a: language === 'en'
        ? 'No, Anusree Tex uses premium quality tested gold jari threads that resist oxidation. Ensure you keep it away from direct perfumes, moisture, and high heat ironing.'
        : 'இல்லை, அனுஸ்ரீ டெக்ஸ் வேஷ்டியில் உயர்தர சோதிக்கப்பட்ட ஜரிகை பயன்படுத்தப்படுகிறது. வாசனை திரவியங்கள் மற்றும் அதிக வெப்ப அயர்னிங் தவிர்க்கவும்.',
    },
  ];

  const handleCollectionClick = (slug) => {
    dispatch(setActiveCategory(slug));
    navigate('/shop');
  };

  const weddingProducts = products.filter((p) => p.isWedding).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[650px] flex items-center justify-center bg-earth overflow-hidden border-b-4 border-gold">
        {/* Background Visual Overlay */}
        <div className="absolute inset-0 bg-cover bg-center opacity-30 select-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-earth via-earth/70 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold uppercase tracking-widest text-xs sm:text-sm font-semibold block"
          >
            {language === 'en' ? 'ESTABLISHED TRADITION' : 'பாரம்பரியத்தின் சின்னம்'}
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-cream-light leading-tight"
          >
            Tradition Woven<br />with <span className="gold-text">Elegance</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-cream/80 max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-light leading-relaxed"
          >
            {language === 'en' 
              ? 'Indulge in the luxury of pure Mulberry pattu and fine count Giza cotton veshtis, handmade by generational master weavers of Tamil Nadu.' 
              : 'தமிழ்நாட்டின் பாரம்பரிய தலைமுறை மாஸ்டர் நெசவாளர்களால் கையால் தயாரிக்கப்பட்ட தூய பட்டு மற்றும் உயர்தர பருத்தி வேஷ்டிகளின் சொகுசை அனுபவியுங்கள்.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-4 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/shop"
              className="bg-gold hover:bg-gold-dark text-earth px-8 py-3.5 rounded font-bold text-sm tracking-wide uppercase transition-all duration-300 hover:shadow-lg"
            >
              {language === 'en' ? 'Explore Shop' : 'கடையை ஆராய்க'}
            </Link>
            <Link
              to="/about"
              className="border border-cream/40 hover:border-gold text-cream hover:text-gold px-8 py-3.5 rounded font-semibold text-sm tracking-wide uppercase transition-all duration-300"
            >
              {language === 'en' ? 'Our Heritage' : 'எங்கள் பாரம்பரியம்'}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. PROMISE STATS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-white border border-gold/10 p-8 rounded-lg shadow-md">
          <div className="space-y-2 flex flex-col items-center">
            <ShieldCheck className="text-gold-dark" size={32} />
            <h4 className="font-bold text-earth text-sm uppercase tracking-wider">{language === 'en' ? '100% Genuine Fabrics' : '100% உண்மையான துணி'}</h4>
            <p className="text-xs text-gray-500 max-w-xs">{language === 'en' ? 'Silk mark certified pure Mulberry pattu and handloom counts.' : 'சான்றளிக்கப்பட்ட தூய மல்பெரி பட்டு மற்றும் பருத்தி நூல்.'}</p>
          </div>
          <div className="space-y-2 flex flex-col items-center border-y md:border-y-0 md:border-x border-gold/15 py-6 md:py-0">
            <RefreshCw className="text-gold-dark" size={32} />
            <h4 className="font-bold text-earth text-sm uppercase tracking-wider">{language === 'en' ? 'Easy Returns' : 'எளிதான வருவாய்'}</h4>
            <p className="text-xs text-gray-500 max-w-xs">{language === 'en' ? '7-day hassle-free returns and exchanges for your convenience.' : '7 நாட்கள் தொந்தரவு இல்லாத திரும்பப்பெறுதல் கொள்கை.'}</p>
          </div>
          <div className="space-y-2 flex flex-col items-center">
            <Clock className="text-gold-dark" size={32} />
            <h4 className="font-bold text-earth text-sm uppercase tracking-wider">{language === 'en' ? 'Heritage Craftsmanship' : 'பாரம்பரிய கைவினைத்திறன்'}</h4>
            <p className="text-xs text-gray-500 max-w-xs">{language === 'en' ? 'Woven by certified generational handloom weavers of Kanchipuram.' : 'காஞ்சிபுரம் பாரம்பரிய நெசவாளர்களால் நெய்யப்பட்டவை.'}</p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-earth tracking-wide">{t('featured')}</h2>
          <div className="h-0.5 bg-gold w-24 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCollections.map((col, idx) => (
            <div
              key={idx}
              onClick={() => handleCollectionClick(col.slug)}
              className="group relative h-96 rounded-lg overflow-hidden border border-gold/10 shadow-lg cursor-pointer transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${col.image})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-earth via-earth/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <h3 className="font-serif text-xl text-gold font-bold">{col.name}</h3>
                <p className="text-xs text-cream-light/85 line-clamp-2">{col.desc}</p>
                <span className="inline-flex items-center text-xs font-semibold text-gold group-hover:translate-x-1.5 transition-transform">
                  {language === 'en' ? 'Shop Collection' : 'தொகுப்பைக் காண்க'} <ChevronRight size={14} className="ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WEDDING SPECIAL COLLECTION */}
      {weddingProducts.length > 0 && (
        <section className="bg-cream border-y border-gold/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gold/20 pb-4">
              <div>
                <span className="text-gold-dark text-xs uppercase tracking-widest font-bold font-sans">Kalyana Vaibhogam</span>
                <h2 className="text-3xl font-bold text-earth">{t('weddingColl')}</h2>
              </div>
              <Link to="/shop?category=wedding-collection" className="text-gold-dark hover:text-earth flex items-center font-semibold text-sm mt-3 md:mt-0">
                {language === 'en' ? 'View All Wedding Wear' : 'திருமண ஆடைகள் அனைத்தையும் காண்க'} <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {weddingProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. HOW TO WEAR VIDEO GUIDE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-gold-dark font-sans text-xs uppercase tracking-widest font-bold">{t('howToWear')}</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-earth font-bold leading-tight">
            {language === 'en' 
              ? 'Wrape and Fold Like a Generational Master' 
              : 'பாரம்பரிய முறைப்படி கச்சிதமாக வேஷ்டி கட்டுவது எப்படி?'}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed font-light">
            {language === 'en'
              ? 'Draping a veshti is a ritual of pride. Watch our quick video tutorial showing the clean folds, adjustments, and roll-lock method ensuring the veshti sits snug and looks elegant all day long.'
              : 'வேஷ்டி கட்டுவது என்பது ஒரு கலை. எங்கள் எளிய வீடியோ வழிகாட்டியைப் பார்த்து இரட்டை மடிப்பு, மடிப்புகள் மற்றும் இடுப்பு பூட்டு இடுவதைக் கற்றுக்கொள்ளுங்கள்.'}
          </p>
          <div className="space-y-3">
            <div className="flex items-center text-sm font-semibold text-earth">
              <Clock size={16} className="text-gold-dark mr-2" />
              <span>{language === 'en' ? 'Length: 2 Mins' : 'நேரம்: 2 நிமிடங்கள்'}</span>
            </div>
            <div className="flex items-center text-sm font-semibold text-earth">
              <BookOpen size={16} className="text-gold-dark mr-2" />
              <span>{language === 'en' ? 'Languages: Tamil & English Audio' : 'மொழி: தமிழ் & ஆங்கிலம்'}</span>
            </div>
          </div>
          <Link to="/blog" className="inline-block bg-earth text-cream-light font-bold text-xs uppercase px-6 py-3 rounded tracking-wider hover:bg-gold hover:text-earth transition-colors duration-200">
            {language === 'en' ? 'Read Draping Guides' : 'வழிகாட்டி கட்டுரைகளை வாசியுங்கள்'}
          </Link>
        </div>
        
        {/* Video Player Mock Frame */}
        <div className="lg:col-span-6 relative rounded-lg overflow-hidden border border-gold/25 shadow-2xl pt-[56.25%] bg-earth">
          <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600')` }} />
          <div className="absolute inset-0 bg-earth/20 flex items-center justify-center">
            <a 
              href="https://www.youtube.com/watch?v=kR2jK1GkX5I" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-gold hover:bg-gold-dark text-earth p-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 relative flex items-center justify-center group"
            >
              <Play size={28} className="fill-current group-hover:scale-95 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS & NEW ARRIVALS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {bestSellers.length > 0 && (
          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-gold/15 pb-4">
              <h2 className="text-2xl font-bold text-earth">{t('bestSellers')}</h2>
              <Link to="/shop?sort=rating" className="text-xs font-semibold text-gold-dark hover:text-earth uppercase tracking-widest">{language === 'en' ? 'View All' : 'அனைத்தும்'}</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {bestSellers.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

        {newArrivals.length > 0 && (
          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-gold/15 pb-4">
              <h2 className="text-2xl font-bold text-earth">{t('newArrivals')}</h2>
              <Link to="/shop?sort=new" className="text-xs font-semibold text-gold-dark hover:text-earth uppercase tracking-widest">{language === 'en' ? 'View All' : 'அனைத்தும்'}</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {newArrivals.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="bg-earth text-cream-light py-20 border-y border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl font-bold text-gold">{t('testimonials')}</h2>
            <p className="text-xs text-cream/60 max-w-sm mx-auto">{language === 'en' ? 'What our premium wedding patrons say about us' : 'எங்கள் தயாரிப்புகள் பற்றி வாடிக்கையாளர்களின் அனுபவம்'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-earth-light border border-gold/10 p-8 rounded-lg space-y-4">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
              </div>
              <p className="text-sm text-cream/75 italic leading-relaxed font-light">
                "{language === 'en'
                  ? 'I wore the Kalyana Swarnam silk veshti for my wedding reception. The fabric was incredibly soft, and the gold border was stunning. Got so many compliments!'
                  : 'என் திருமண வரவேற்பிற்கு அனுஸ்ரீ டெக்ஸ் பட்டு வேஷ்டி அணிந்தேன். ஜரிகை மிகவும் அட்டகாசமாக இருந்தது. அனைவரும் பாராட்டினர்.'}"
              </p>
              <div>
                <h5 className="font-bold text-gold text-xs uppercase tracking-wider">Raghavan Sundaram</h5>
                <span className="text-[10px] text-cream/45">{language === 'en' ? 'Groom Patrons, Madurai' : 'வாடிக்கையாளர், மதுரை'}</span>
              </div>
            </div>
            <div className="bg-earth-light border border-gold/10 p-8 rounded-lg space-y-4">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
              </div>
              <p className="text-sm text-cream/75 italic leading-relaxed font-light">
                "{language === 'en'
                  ? 'The handloom cotton veshti count is unmatched. Light, soft, and easy to wash. Very suitable for daily temple wear. Ordering more.'
                  : 'கைத்தறி பருத்தி வேஷ்டி தரம் மிகவும் அருமை. லேசாகவும் மிருதுவாகவும் உள்ளது. தினசரி பயன்பாட்டிற்கு மிகவும் உகந்தது.'}"
              </p>
              <div>
                <h5 className="font-bold text-gold text-xs uppercase tracking-wider">Dr. Karthik Raja</h5>
                <span className="text-[10px] text-cream/45">{language === 'en' ? 'Temple Regulars, Chennai' : 'வாடிக்கையாளர், சென்னை'}</span>
              </div>
            </div>
            <div className="bg-earth-light border border-gold/10 p-8 rounded-lg space-y-4">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
              </div>
              <p className="text-sm text-cream/75 italic leading-relaxed font-light">
                "{language === 'en'
                  ? 'Their sizing is accurate. The size guide helped me choose the double veshti. The delivery was fast and the premium packaging made me feel wow!'
                  : 'அளவுகள் சரியாக உள்ளன. வடிவமைப்பு வழிகாட்டி மிகவும் உதவியது. பேக்கிங் மிகவும் ஆடம்பரமாக இருந்தது. மிக விரைவான டெலிவரி.'}"
              </p>
              <div>
                <h5 className="font-bold text-gold text-xs uppercase tracking-wider">Venkatraman G.</h5>
                <span className="text-[10px] text-cream/45">{language === 'en' ? 'Festival Patrons, Coimbatore' : 'வாடிக்கையாளர், கோயம்புத்தூர்'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-earth">{t('faq')}</h2>
          <div className="h-0.5 bg-gold w-16 mx-auto" />
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-gold/15 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-cream/20 transition-colors"
              >
                <span className="font-semibold text-earth text-sm sm:text-base">{faq.q}</span>
                <span className="text-gold-dark font-bold text-lg">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-sm text-gray-500 leading-relaxed border-t border-cream-dark/20 font-light">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
