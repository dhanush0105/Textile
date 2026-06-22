import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { KeyRound, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      if (data.role !== 'admin') {
        setError('Access Denied. Only administrator accounts can login to the Control Panel.');
        setLoading(false);
        return;
      }

      localStorage.setItem('adminToken', data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth flex items-center justify-center p-4 relative select-none">
      
      {/* Visual background texture */}
      <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200')` }} />

      <div className="bg-white border-t-4 border-gold rounded-lg shadow-2xl max-w-sm w-full p-6 sm:p-8 space-y-6 relative z-10">
        <div className="text-center space-y-1">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-earth tracking-widest uppercase">
            ANUSREE <span className="text-gold-dark">TEX</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Control Panel Gateway</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded flex items-start gap-1.5 leading-relaxed font-semibold">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1">
            <label className="font-semibold text-gray-500 uppercase">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded p-2.5 focus:outline-none focus:border-gold-dark"
              placeholder="admin@anusreetex.com"
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-gray-500 uppercase">Secret Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded p-2.5 focus:outline-none focus:border-gold-dark"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-earth text-cream hover:bg-gold hover:text-earth py-3 rounded font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all mt-2"
          >
            <KeyRound size={16} />
            {loading ? 'Authenticating...' : 'Sign In To Panel'}
          </button>
        </form>

        <div className="text-[10px] text-center text-gray-400">
          Demo Admin Credentials: <code className="text-earth font-bold">admin@anusreetex.com</code> (admin123)
        </div>
      </div>

    </div>
  );
};

export default Login;
