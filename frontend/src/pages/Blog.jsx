import React, { useEffect, useState } from 'react';
import { useLanguage } from '../components/LanguageContext.jsx';
import axios from 'axios';
import { Calendar, User, Clock, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';

const Blog = () => {
  const { language } = useLanguage();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/blogs');
        setBlogs(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed fetching blogs, setting mocks', err);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold-dark" />
      </div>
    );
  }

  // 1. ARTICLE DETAIL VIEW PAGE
  if (selectedBlog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 animate-fadeIn">
        <button
          onClick={() => setSelectedBlog(null)}
          className="text-gold-dark hover:text-earth flex items-center font-bold text-xs uppercase tracking-wider"
        >
          <ArrowLeft size={16} className="mr-1.5" /> Back to Articles
        </button>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
            <span className="flex items-center"><User size={13} className="mr-1 text-gold-dark" /> {selectedBlog.author}</span>
            <span className="flex items-center"><Calendar size={13} className="mr-1 text-gold-dark" /> {new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center"><Clock size={13} className="mr-1 text-gold-dark" /> {selectedBlog.readTime}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth leading-tight border-b border-gold/15 pb-4">
            {selectedBlog.title}
          </h1>
        </div>

        <div className="rounded-lg overflow-hidden border border-gold/15 h-80 bg-cream">
          <img
            src={selectedBlog.image}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800';
            }}
          />
        </div>

        <article className="text-sm sm:text-base text-gray-700 leading-relaxed font-light space-y-6 whitespace-pre-line px-2">
          {selectedBlog.content}
        </article>

        {/* Tags */}
        <div className="flex gap-2 pt-4 border-t border-gold/10">
          {selectedBlog.tags?.map((t, i) => (
            <span key={i} className="bg-cream border border-gold/20 text-gold-dark font-semibold text-[10px] px-2 py-0.5 rounded uppercase">
              {t}
            </span>
          ))}
        </div>

      </div>
    );
  }

  // 2. ARTICLES LIST VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-earth uppercase tracking-wide">Anusree Editorial & Guides</h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">Explore South Indian ethnic draping tutorials, style lookbooks, and handloom legacy stories.</p>
        <div className="h-0.5 bg-gold w-16 mx-auto mt-2" />
      </div>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-500 italic py-20 bg-cream-light border border-gold/15 rounded">
          No articles written yet. Check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((b) => (
            <div
              key={b._id}
              className="bg-white border border-gold/15 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
            >
              {/* Cover Image */}
              <div className="h-52 overflow-hidden bg-cream">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600';
                  }}
                />
              </div>

              {/* Summary details */}
              <div className="p-5 flex flex-col flex-grow space-y-3">
                <div className="flex gap-3 text-[10px] text-gray-400 font-sans font-medium uppercase tracking-wide">
                  <span className="flex items-center"><Calendar size={11} className="mr-1 text-gold" /> {new Date(b.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center"><Clock size={11} className="mr-1 text-gold" /> {b.readTime}</span>
                </div>

                <h3 className="font-serif text-base font-bold text-earth line-clamp-2 leading-snug">
                  {b.title}
                </h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-3">
                  {b.summary}
                </p>

                <button
                  onClick={() => setSelectedBlog(b)}
                  className="text-gold-dark hover:text-earth inline-flex items-center text-xs font-bold uppercase tracking-wider mt-auto pt-4 border-t border-gold/5 w-fit"
                >
                  Read Article <ArrowRight size={14} className="ml-1" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Blog;
