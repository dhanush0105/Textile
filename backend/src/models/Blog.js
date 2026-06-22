import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String, required: true },
  author: { type: String, required: true, default: 'Anusree Editorial' },
  image: { type: String, required: true },
  tags: [{ type: String }],
  readTime: { type: String, default: '5 mins read' },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
