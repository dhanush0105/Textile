import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products with advanced filtering and search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      fabric,
      borderType,
      occasion,
      color,
      minPrice,
      maxPrice,
      sort,
      isWedding,
      isFestival,
      isNewArrival,
      isBestSeller,
      isPremium,
    } = req.query;

    let query = {};

    // Text search on name/description
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Category filtering
    if (category) {
      const foundCategory = await Category.findOne({ slug: category });
      if (foundCategory) {
        query.category = foundCategory._id;
      } else if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      }
    }

    // Specific filters
    if (fabric) {
      query.fabric = { $regex: new RegExp(`^${fabric}$`, 'i') };
    }
    if (borderType) {
      query.borderType = { $regex: new RegExp(`^${borderType}$`, 'i') };
    }
    if (occasion) {
      query.occasion = { $regex: new RegExp(`^${occasion}$`, 'i') };
    }
    if (color) {
      query.color = { $regex: new RegExp(`^${color}$`, 'i') };
    }

    // Booleans
    if (isWedding === 'true') query.isWedding = true;
    if (isFestival === 'true') query.isFestival = true;
    if (isNewArrival === 'true') query.isNewArrival = true;
    if (isBestSeller === 'true') query.isBestSeller = true;
    if (isPremium === 'true') query.isPremium = true;

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Build query builder
    let queryResult = Product.find(query).populate('category', 'name slug');

    // Sorting
    if (sort) {
      if (sort === 'priceAsc') {
        queryResult = queryResult.sort({ price: 1 });
      } else if (sort === 'priceDesc') {
        queryResult = queryResult.sort({ price: -1 });
      } else if (sort === 'rating') {
        queryResult = queryResult.sort({ ratings: -1 });
      } else if (sort === 'new') {
        queryResult = queryResult.sort({ createdAt: -1 });
      }
    } else {
      queryResult = queryResult.sort({ createdAt: -1 }); // default new
    }

    const products = await queryResult;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      images,
      fabric,
      borderType,
      borderSize,
      occasion,
      color,
      size,
      stock,
      isFeatured,
      isNewArrival,
      isBestSeller,
      isWedding,
      isFestival,
      isPremium,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      category,
      images: images && images.length ? images : ['/assets/placeholder.jpg'],
      fabric,
      borderType,
      borderSize,
      occasion,
      color,
      size,
      stock,
      isFeatured: isFeatured || false,
      isNewArrival: isNewArrival || false,
      isBestSeller: isBestSeller || false,
      isWedding: isWedding || false,
      isFestival: isFestival || false,
      isPremium: isPremium || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price !== undefined ? req.body.price : product.price;
      product.discountPrice = req.body.discountPrice !== undefined ? req.body.discountPrice : product.discountPrice;
      product.category = req.body.category || product.category;
      product.images = req.body.images || product.images;
      product.fabric = req.body.fabric || product.fabric;
      product.borderType = req.body.borderType || product.borderType;
      product.borderSize = req.body.borderSize || product.borderSize;
      product.occasion = req.body.occasion || product.occasion;
      product.color = req.body.color || product.color;
      product.size = req.body.size || product.size;
      product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
      product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured;
      product.isNewArrival = req.body.isNewArrival !== undefined ? req.body.isNewArrival : product.isNewArrival;
      product.isBestSeller = req.body.isBestSeller !== undefined ? req.body.isBestSeller : product.isBestSeller;
      product.isWedding = req.body.isWedding !== undefined ? req.body.isWedding : product.isWedding;
      product.isFestival = req.body.isFestival !== undefined ? req.body.isFestival : product.isFestival;
      product.isPremium = req.body.isPremium !== undefined ? req.body.isPremium : product.isPremium;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
