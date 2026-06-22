import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit3, Trash2, X, Upload, Save } from 'lucide-react';

const BlogManagement = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Anusree Editorial');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState('');
  const [readTime, setReadTime] = useState('5 mins read');
  
  // Upload status
  const [uploading, setUploading] = useState(false);

  const fetchBlogs = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get('/api/blogs');
      setBlogs(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      };
      const { data } = await axios.post('/api/upload', formData, config);
      setImage(data.url);
      setUploading(false);
    } catch (err) {
      alert('Upload failed');
      setUploading(false);
    }
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const payload = {
      title,
      summary,
      content,
      author,
      image: image || '/assets/placeholder-blog.jpg',
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      readTime,
    };

    try {
      if (editingBlog) {
        await axios.put(`/api/blogs/${editingBlog._id}`, payload, config);
        alert('Blog article updated successfully!');
      } else {
        await axios.post('/api/blogs', payload, config);
        alert('Blog article created successfully!');
      }

      resetForm();
      fetchBlogs();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleEditClick = (b) => {
    setEditingBlog(b);
    setTitle(b.title);
    setSummary(b.summary);
    setContent(b.content);
    setAuthor(b.author);
    setImage(b.image);
    setTags(b.tags?.join(', ') || '');
    setReadTime(b.readTime);
    setShowForm(true);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.delete(`/api/blogs/${id}`, config);
      alert('Article deleted successfully');
      fetchBlogs();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const resetForm = () => {
    setEditingBlog(null);
    setTitle('');
    setSummary('');
    setContent('');
    setAuthor('Anusree Editorial');
    setImage('');
    setTags('');
    setReadTime('5 mins read');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Blog Authoring</h1>
          <p className="text-xs text-gray-500 mt-1">Write ethnic guides, fashion advice, or festival styling articles.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-gold hover:bg-gold-dark text-earth px-4 py-2.5 rounded font-bold text-xs uppercase flex items-center gap-1 shadow transition-colors"
          >
            <Plus size={16} /> Write Article
          </button>
        )}
      </div>

      {/* Blog Authoring Form */}
      {showForm && (
        <form onSubmit={handleSaveBlog} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4 max-w-4xl text-xs sm:text-sm">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h2 className="font-serif text-lg font-bold text-earth">
              {editingBlog ? `Edit: ${editingBlog.title}` : 'Write New Article'}
            </h2>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Title / Summary / Content */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Article Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded p-2.5 focus:outline-none"
                  placeholder="A Guide to Wearing the Traditional Veshti..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Short Summary</label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded p-2.5 focus:outline-none"
                  placeholder="Master ethnic draping methods with our step-by-step styling tips..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Article Content</label>
                <textarea
                  required
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded p-2.5 focus:outline-none text-xs whitespace-pre-line"
                  placeholder="Draft your main article content body..."
                />
              </div>
            </div>

            {/* Side Metadata */}
            <div className="space-y-4 bg-gray-50 p-4 border border-gray-200 rounded">
              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Author Name</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded p-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Estimated Read Time</label>
                <input
                  type="text"
                  required
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded p-2 focus:outline-none"
                  placeholder="5 mins read"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded p-2 focus:outline-none"
                  placeholder="Guides, Wedding, Styling"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-500 uppercase">Cover Image</label>
                <div className="flex gap-2 items-center">
                  <label className="bg-earth hover:bg-gold text-cream hover:text-earth border border-gold/20 px-3 py-2 rounded font-bold text-[10px] uppercase cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload size={12} /> {uploading ? 'Uploading...' : 'Choose File'}
                    <input type="file" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {image && <span className="truncate text-[10px] text-gray-400 font-mono">Image attached</span>}
                </div>
                {image && (
                  <div className="w-full h-32 border border-gray-200 rounded overflow-hidden mt-3 bg-white">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="flex gap-2.5 pt-4 border-t border-gray-100">
            <button
              type="submit"
              className="bg-gold hover:bg-gold-dark text-earth px-6 py-2.5 rounded font-bold text-xs uppercase flex items-center gap-1"
            >
              <Save size={14} /> Publish Article
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border border-gray-300 px-6 py-2.5 rounded font-semibold text-xs text-gray-600 uppercase hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>

        </form>
      )}

      {/* Blogs List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold-dark" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Visual</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Read Time</th>
                  <th className="p-4">Date Published</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-500 italic">No blog posts found. Use seeder script or add new above.</td>
                  </tr>
                ) : (
                  blogs.map((b) => (
                    <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-gray-600">
                      <td className="p-4 shrink-0">
                        <div className="w-8 h-10 bg-cream rounded overflow-hidden">
                          <img src={b.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-gray-800 block truncate max-w-xs">{b.title}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{b.summary?.substring(0, 45)}...</span>
                      </td>
                      <td className="p-4 font-semibold">{b.author}</td>
                      <td className="p-4">{b.readTime}</td>
                      <td className="p-4">{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(b)}
                            className="bg-gray-100 hover:bg-gold/15 text-gray-700 hover:text-gold-dark p-2 rounded"
                            title="Edit Article"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(b._id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded"
                            title="Delete Article"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default BlogManagement;
