import React, { useState } from 'react';
import { Save, ShieldAlert, CheckCircle } from 'lucide-react';

const Settings = () => {
  const [storeName, setStoreName] = useState('Anusree Tex');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [supportEmail, setSupportEmail] = useState('support@anusreetex.com');
  const [address, setAddress] = useState('12 Temple Street, T. Nagar, Chennai, Tamil Nadu 600017');
  
  // Socials
  const [facebook, setFacebook] = useState('https://facebook.com/anusreetex');
  const [instagram, setInstagram] = useState('https://instagram.com/anusreetex');
  const [twitter, setTwitter] = useState('https://twitter.com/anusreetex');
  
  const [success, setSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-2xl text-xs sm:text-sm">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Website Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Adjust store phone parameters, emails, and corporate links.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-6">
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-2.5 rounded flex items-center gap-1.5 font-semibold">
            <CheckCircle size={14} /> Store settings saved successfully!
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-serif text-base font-bold text-earth border-b border-gray-100 pb-2">General Contacts</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Store Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Support Email</label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Support Phone</label>
              <input
                type="text"
                required
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Physical Corporate Location</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="font-serif text-base font-bold text-earth border-b border-gray-100 pb-2">Social Channels</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Facebook Page URL</label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Instagram Profile URL</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-500 uppercase">Twitter Handle URL</label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-gold hover:bg-gold-dark text-earth px-6 py-2.5 rounded font-bold text-xs uppercase flex items-center gap-1"
        >
          <Save size={14} /> Commit Changes
        </button>

      </form>

    </div>
  );
};

export default Settings;
