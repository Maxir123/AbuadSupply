const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const mongoose = require('mongoose');
const { Readable } = require('stream');
const expressAsyncHandler = require("express-async-handler");
const cloudinary = require("../utils/cloudinary"); // must export configured cloudinary instance

const Product = require("../models/productModel");
const Sale = require("../models/saleModel");
const Vendor = require("../models/vendorModel");
const MainCategory = require("../models/mainCategory");
const SubCategory = require("../models/subCategory");
const SubSubCategory = require("../models/subSubCategory");

// Ensure uploads directory exists (used only if we fallback to disk)
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper: Escape regex special characters
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Helper: Find category by ID or slug (case‑insensitive)
const findCategory = async (model, value) => {
  if (!value) return null;
  if (mongoose.Types.ObjectId.isValid(value)) {
    return model.findById(value);
  }
  const escaped = escapeRegex(value);
  return model.findOne({ slug: new RegExp(`^${escaped}$`, 'i') });
};

// Upload images to Cloudinary with timeout and quality reduction
const uploadImages = async (files) => {
  if (!files?.length) throw new Error("No image files provided");

  const imagesLinks = [];
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(`Unsupported format: ${file.mimetype}`);
    }

    try {
      // Optimize to a smaller buffer
      const processedBuffer = await sharp(file.buffer || file.path)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 60, progressive: true })
        .toBuffer();

      // Upload with retry (max 3 attempts)
      let result;
      let lastError;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
result = await new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    { 
      folder: "products", 
      format: "jpg",
      timeout: 60000 // 60 seconds is usually plenty for a processed buffer
    },
    (err, res) => {
      if (err) return reject(err);
      resolve(res);
    }
  );

  // End the stream and send the buffer
  uploadStream.end(processedBuffer); 
});
          break; // success
        } catch (err) {
          lastError = err;
          console.log(`Upload attempt ${attempt} failed: ${err.message}`);
          if (attempt < 3) await new Promise(r => setTimeout(r, 3000 * attempt));
        }
      }

      if (!result) throw lastError || new Error("All upload attempts failed");

      imagesLinks.push({ public_id: result.public_id, url: result.secure_url });
    } catch (err) {
      console.error(`Failed to upload image ${i}:`, err);
      // Optional fallback to local storage
      const fallbackPath = path.join(uploadsDir, `fallback-${Date.now()}-${i}.jpg`);
      fs.writeFileSync(fallbackPath, await sharp(file.buffer || file.path).jpeg({ quality: 80 }).toBuffer());
      imagesLinks.push({ public_id: `local/${path.basename(fallbackPath)}`, url: `/uploads/${path.basename(fallbackPath)}` });
    }
  }
  return imagesLinks;
};

// Create product
const createProduct = expressAsyncHandler(async (req, res) => {
  const {
    mainCategory, subCategory, subSubCategory, brand,
    vendorId, isFeatured, attributes: attributesRaw,
    name, description, originalPrice, discountPrice, stock
  } = req.body;

  try {
    // 1. Validate vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(400).json({ message: "Vendor Id is invalid!" });
    }

    // 2. Parse attributes (sent as JSON string from frontend)
    let attributes = {};
    if (attributesRaw) {
      try {
        attributes = typeof attributesRaw === 'string' ? JSON.parse(attributesRaw) : attributesRaw;
      } catch (e) {
        return res.status(400).json({ message: "Invalid attributes format" });
      }
    }

    // 3. Find categories by ID or slug
    const existingMainCategory = await findCategory(MainCategory, mainCategory);
    const existingSubCategory = await findCategory(SubCategory, subCategory);
    const existingSubSubCategory = await findCategory(SubSubCategory, subSubCategory);

    if (!existingMainCategory || !existingSubCategory || !existingSubSubCategory) {
      return res.status(400).json({
        message: "Invalid category, subcategory, or sub-subcategory ID or name"
      });
    }

    // 4. Upload images (req.files from multer)
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one product image is required" });
    }
    const images = await uploadImages(req.files);

    // 5. Build product data
    const productData = {
      name,
      description,
      mainCategory: existingMainCategory.slug,
      subCategory: existingSubCategory.slug,
      subSubCategory: existingSubSubCategory.slug,
      brand,
      originalPrice: Number(originalPrice),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock),
      vendorId,
      vendor: {
        name: vendor.name,
        avatar: vendor.avatar,
        createdAt: vendor.createdAt,
        address: vendor.address,
        phoneNumber: vendor.phoneNumber,
        email: vendor.email,
        zipCode: vendor.zipCode,
        reviews: vendor.reviews,
      },
      isFeatured: isFeatured === 'true' || isFeatured === true,
      attributes: new Map(Object.entries(attributes)),
      images,
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error("Create product error:", error);
    const statusCode = error.message.includes("Unsupported") ? 400 : 500;
    return res.status(statusCode).json({
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get all products of a store
const getVendorAllProducts = expressAsyncHandler(async (req, res) => {
  const vendorId = req.params.vendorId;
  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    const products = await Product.find({ vendorId });

    if (products.length === 0) {
      return res.status(200).json({ success: true, products: [] });
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete product
const deleteProduct = expressAsyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({ message: "Product not found" });
  }
});

// Update product
const updateProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, originalPrice, discountPrice, stock, brand, mainCategory, subCategory, subSubCategory } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, {
      name,
      stock,
      originalPrice,
      discountPrice,
      brand,
      mainCategory,
      subCategory,
      subSubCategory,
    }, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
});

// Get all products
const getAllProducts = expressAsyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Get a single product by ID
const getProductById = expressAsyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'mainCategory',
        select: 'name'
      });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Fetch products by subSubCategorySlug
const getProductsBySubSubCategory = expressAsyncHandler(async (req, res) => {
  const { subSubCategory } = req.query;
  const regex = new RegExp(escapeRegex(subSubCategory).replace(/\s+/g, '[-\\s]?'), "i");
  const products = await Product.find({ subSubCategory: regex });

  if (!products || products.length === 0) {
    return res.status(200).json({ success: true, products: [] });
  }

  res.status(200).json({ success: true, products });
});

// Get a single product for vendor dashboard
const getVendorSingleProduct = expressAsyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.vendorId.toString() !== req.vendor.id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this product" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create product review
const createProductReview = expressAsyncHandler(async (req, res) => {
  const { user, rating, comment, productId } = req.body;

  if (!req.user?._id) {
    return res.status(401).json({ message: "Please log in to review this product." });
  }
  if (!rating) {
    return res.status(400).json({ message: "Rating is required" });
  }

  let product = await Product.findById(productId);
  if (!product) {
    product = await Sale.findById(productId);
  }

  if (product) {
    if (!Array.isArray(product.reviews)) {
      product.reviews = [];
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user._id.toString() === user._id
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      user,
      rating: Number(rating),
      comment: comment?.trim() || "",
      productId,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    return res.status(201).json({ success: true, message: "Product reviewed successfully" });
  } else {
    return res.status(404).json({ message: "Product not found" });
  }
});

module.exports = {
  createProduct,
  getVendorAllProducts,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  createProductReview,
  getProductsBySubSubCategory,
  getVendorSingleProduct
};