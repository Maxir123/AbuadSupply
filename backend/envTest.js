require("dotenv").config();

console.log("----- ENV TEST -----");

console.log("Cloud Name:", process.env.CLOUD_NAME);
console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY);
console.log("Cloudinary API Secret:", process.env.CLOUDINARY_API_SECRET);

console.log("Mongo URI:", process.env.MONGO_URI);
console.log("JWT Secret:", process.env.JWT_SECRET);
console.log("Port:", process.env.PORT);

console.log("--------------------");

if (!process.env.CLOUD_NAME) {
  console.log("❌ CLOUD_NAME is NOT loaded");
} else {
  console.log("✅ CLOUD_NAME loaded correctly");
}

if (!process.env.CLOUDINARY_API_KEY) {
  console.log("❌ CLOUDINARY_API_KEY is NOT loaded");
} else {
  console.log("✅ CLOUDINARY_API_KEY loaded correctly");
}

if (!process.env.CLOUDINARY_API_SECRET) {
  console.log("❌ CLOUDINARY_API_SECRET is NOT loaded");
} else {
  console.log("✅ CLOUDINARY_API_SECRET loaded correctly");
}