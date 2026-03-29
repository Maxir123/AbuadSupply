// diagnostics.js
require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Import your models
const Vendor = require("./models/vendorModel");
const MainCategory = require("./models/mainCategory");
const SubCategory = require("./models/subCategory");
const SubSubCategory = require("./models/subSubCategory");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test data (replace with actual IDs or slugs from your DB)
const testData = {
  vendorId: "YOUR_VENDOR_ID_HERE",
  mainCategory: "electronics",
  subCategory: "phones",
  subSubCategory: "smartphones",
  images: [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." // put a real Base64 image here
  ],
};

async function checkCloudinaryUpload(imageBase64) {
  try {
    const buffer = Buffer.from(imageBase64.split(",")[1], "base64");
    const tempPath = path.join(__dirname, `temp-test-${Date.now()}.png`);
    fs.writeFileSync(tempPath, buffer);

    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "diagnostic-test",
      format: "png",
    });

    fs.unlinkSync(tempPath);
    console.log("✅ Cloudinary upload successful:", result.secure_url);
    return true;
  } catch (err) {
    console.error("❌ Cloudinary upload failed:", err.message);
    return false;
  }
}

async function runDiagnostics() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, { dbName: "yourDBName" });
    console.log("✅ MongoDB connected");

    // Check vendor
    const vendor = await Vendor.findById(testData.vendorId);
    if (!vendor) {
      console.error("❌ Vendor not found with ID:", testData.vendorId);
    } else {
      console.log("✅ Vendor found:", vendor.name);
    }

    // Check categories
    const mainCat = await MainCategory.findOne({ slug: testData.mainCategory });
    const subCat = await SubCategory.findOne({ slug: testData.subCategory });
    const subSubCat = await SubSubCategory.findOne({ slug: testData.subSubCategory });

    if (!mainCat) console.error("❌ Main category not found:", testData.mainCategory);
    else console.log("✅ Main category found:", mainCat.name);

    if (!subCat) console.error("❌ Sub category not found:", testData.subCategory);
    else console.log("✅ Sub category found:", subCat.name);

    if (!subSubCat) console.error("❌ Sub-sub category not found:", testData.subSubCategory);
    else console.log("✅ Sub-sub category found:", subSubCat.name);

    // Check image upload
    if (!Array.isArray(testData.images) || testData.images.length === 0) {
      console.error("❌ No images provided to test upload");
    } else {
      for (let i = 0; i < testData.images.length; i++) {
        const success = await checkCloudinaryUpload(testData.images[i]);
        if (!success) console.error(`❌ Image ${i} upload failed`);
      }
    }

    console.log("⚡ Diagnostics complete");
    process.exit(0);
  } catch (error) {
    console.error("❌ Diagnostics failed:", error.message);
    process.exit(1);
  }
}

runDiagnostics();