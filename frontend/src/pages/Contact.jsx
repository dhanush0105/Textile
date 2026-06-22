import React, { useState } from 'react';
import { useLanguage } from '../components/LanguageContext.jsx';
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';

const Contact = () => {
  const { t, language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919876543210?text=Hello%20Anusree%20Tex%2C%20I%20have%20an%20inquiry.', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-earth uppercase tracking-wide">{t('contact')}</h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">Have questions about fabrics, borders, or bulk wedding orders? Speak to our support team.</p>
        <div className="h-0.5 bg-gold w-16 mx-auto mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Details & Maps (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gold/15 p-6 rounded-lg shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-earth border-b border-gold/10 pb-3">Contact Information</h3>
            
            <ul className="space-y-4 text-xs sm:text-sm text-gray-600">
              <li className="flex items-start">
                <MapPin size={18} className="text-gold-dark mr-3 mt-0.5 shrink-0" />
                <span>12 Temple Street, T. Nagar,<br />Chennai, Tamil Nadu 600017</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-gold-dark mr-3 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-gold-dark mr-3 shrink-0" />
                <span>support@anusreetex.com</span>
              </li>
            </ul>

            <button
              onClick={handleWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-2.5 rounded font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-colors mt-4"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </button>
          </div>

          {/* Map Section */}
          <div className="rounded-lg overflow-hidden border border-gold/15 h-64 bg-cream relative shadow-sm">
            {/* Embed standard premium maps placeholder iframe */}
            <iframe
              title="Google Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8407421112443!2d80.22851227568571!3d13.045802113264426!2m3!1f0!2f0!3f0!3m2!1i1020!2i768!4f13.1!3m3!1m2!1s0x3a526654a24f0c97%3A0x868b44917ccf0f4a!2sT.%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="w-full h-full border-none"
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Side: Message Form (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-gold/15 p-6 rounded-lg shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-earth border-b border-gold/10 pb-3">Send a Message</h3>
          
          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-2.5 rounded flex items-center gap-1.5 font-semibold">
              Message sent successfully! We will get back to you shortly.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                placeholder="Dhanush Kumar"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                placeholder="name@email.com"
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none"
                placeholder="Bulk order query / Fabric customization"
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Message</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-cream-light border border-gold/25 rounded p-2.5 focus:outline-none text-xs"
                placeholder="Enter details of your inquiry here..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-gold hover:bg-gold-dark text-earth px-6 py-3 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors mt-4"
          >
            <Send size={14} /> Send Message
          </button>
        </form>

      </div>

    </div>
  );
};

export default Contact;
