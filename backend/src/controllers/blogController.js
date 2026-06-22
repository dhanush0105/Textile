import Blog from '../models/Blog.js';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a blog post (Admin)
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  const { title, content, summary, author, image, tags, readTime } = req.body;

  try {
    const blog = new Blog({
      title,
      content,
      summary,
      author: author || 'Anusree Editorial',
      image: image || '/assets/placeholder-blog.jpg',
      tags: tags || [],
      readTime: readTime || '5 mins read',
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a blog post (Admin)
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      blog.title = req.body.title || blog.title;
      blog.content = req.body.content || blog.content;
      blog.summary = req.body.summary || blog.summary;
      blog.author = req.body.author || blog.author;
      blog.image = req.body.image || blog.image;
      blog.tags = req.body.tags || blog.tags;
      blog.readTime = req.body.readTime || blog.readTime;
      blog.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : blog.isPublished;

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blog post (Admin)
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      await blog.deleteOne();
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
