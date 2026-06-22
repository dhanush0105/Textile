import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext.jsx';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-earth text-cream border-t-2 border-gold-dark mt-auto">
      
      {/* Top Banner with Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gold/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-serif text-2xl text-gold font-semibold mb-2">
              {t('newsletterTitle')}
            </h3>
            <p className="text-sm text-cream/70">
              {t('newsletterSubtitle')}
            </p>
          </div>
          <div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder={language === 'en' ? 'Enter your email address' : 'உங்கள் மின்னஞ்சல் முகவரி'}
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-earth-light border border-gold/30 text-cream px-4 py-2.5 rounded focus:outline-none focus:border-gold text-sm"
              />
              <button
                type="submit"
                className="bg-gold hover:bg-gold-dark text-earth px-6 py-2.5 rounded font-semibold text-sm transition-colors duration-200"
              >
                {subscribed ? (language === 'en' ? 'Subscribed!' : 'குழுசேரப்பட்டது!') : t('subscribe')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Logo & Legacy Section */}
          <div className="space-y-4">
            <h4 className="font-serif text-xl text-gold font-bold tracking-widest">
              ANUSREE <span className="text-white">TEX</span>
            </h4>
            <p className="text-sm text-cream/60 leading-relaxed font-light">
              {language === 'en' 
                ? 'Weaving the heritage of South India into every thread. From pure wedding silk to premium daily cotton, we promise comfort, luxury, and unmatched traditional elegance.' 
                : 'தென்னிந்தியாவின் பாரம்பரியத்தை ஒவ்வொரு நூலிலும் நெசவு செய்கிறோம். தூய திருமணப் பட்டு முதல் பிரீமியம் பருத்தி வரை, நாங்கள் சௌகரியம், ஆடம்பரம் மற்றும் இணையற்ற பாரம்பரியத்தை வழங்குகிறோம்.'}
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-cream/60 hover:text-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-cream/60 hover:text-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-cream/60 hover:text-gold transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-4">
            <h5 className="font-serif text-md text-gold font-bold tracking-wider uppercase">
              {language === 'en' ? 'Collections' : 'தொகுப்புகள்'}
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop?category=wedding-collection" className="text-cream/70 hover:text-gold transition-colors">
                  {t('weddingColl')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=silk-veshti" className="text-cream/70 hover:text-gold transition-colors">
                  {t('silkVeshti')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cotton-veshti" className="text-cream/70 hover:text-gold transition-colors">
                  {t('cottonVeshti')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=premium-collection" className="text-cream/70 hover:text-gold transition-colors">
                  {t('premiumColl')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=offers" className="text-cream/70 hover:text-gold transition-colors">
                  {t('offers')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support Links */}
          <div className="space-y-4">
            <h5 className="font-serif text-md text-gold font-bold tracking-wider uppercase">
              {language === 'en' ? 'Customer Support' : 'வாடிக்கையாளர் ஆதரவு'}
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/contact" className="text-cream/70 hover:text-gold transition-colors">
                  {language === 'en' ? 'Contact Support' : 'ஆதரவைத் தொடர்பு கொள்ளவும்'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-cream/70 hover:text-gold transition-colors">
                  {language === 'en' ? 'Our Story' : 'எங்கள் கதை'}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-cream/70 hover:text-gold transition-colors">
                  {language === 'en' ? 'Traditional Guides' : 'பாரம்பரிய வழிகாட்டிகள்'}
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=orders" className="text-cream/70 hover:text-gold transition-colors">
                  {language === 'en' ? 'Track My Order' : 'என் ஆர்டரைக் கண்காணிக்க'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h5 className="font-serif text-md text-gold font-bold tracking-wider uppercase">
              {language === 'en' ? 'Headquarters' : 'தலைமையகம்'}
            </h5>
            <ul className="space-y-3.5 text-cream/70 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="text-gold mr-2.5 shrink-0 mt-0.5" />
                <span>12 Temple Street, T. Nagar,<br />Chennai, Tamil Nadu 600017</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-gold mr-2.5 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-gold mr-2.5 shrink-0" />
                <span>support@anusreetex.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Trim */}
      <div className="bg-earth-dark text-center py-6 text-xs text-cream/40 border-t border-gold/5">
        <p>&copy; {new Date().getFullYear()} Anusree Tex. All Rights Reserved. Crafted with respect for Tamil Heritage.</p>
      </div>

    </footer>
  );
};

export default Footer;
