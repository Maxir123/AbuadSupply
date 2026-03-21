require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");

console.log("===== AbuadSupply Pre-Launch Checklist =====\n");

const backendURL = `http://localhost:${process.env.PORT || 8000}`;

// 1️⃣ Check environment variables
console.log("1️⃣ Checking Environment Variables...");

const envVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "MONGO_URI",
  "JWT_SECRET",
  "PORT",
];

envVars.forEach((v) => {
  if (process.env[v]) {
    console.log(`✅ ${v} loaded`);
  } else {
    console.log(`❌ ${v} NOT loaded`);
  }
});
console.log("\n");

// 2️⃣ Test MongoDB connection
console.log("2️⃣ Testing MongoDB Connection...");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    testAPIs();
  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed:", err.message);
  });

// 3️⃣ Test key API endpoints
async function testAPIs() {
  console.log("\n3️⃣ Testing API Endpoints...");

  const endpoints = [
    { path: "/api/settings", desc: "Settings API" },
    { path: "/api/products", desc: "Products API" },
    { path: "/api/users", desc: "Users API (list, if exists)" },
  ];

  for (const ep of endpoints) {
    try {
      const res = await axios.get(`${backendURL}${ep.path}`);
      if (res.status === 200) {
        console.log(`✅ ${ep.desc} reachable`);
      } else {
        console.log(`❌ ${ep.desc} returned status ${res.status}`);
      }
    } catch (err) {
      console.log(`❌ ${ep.desc} not reachable:`, err.message);
    }
  }

  // 4️⃣ Test Cloudinary env (optional)
  console.log("\n4️⃣ Checking Cloudinary Env...");

  if (
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME
  ) {
    console.log("✅ Cloudinary variables look OK");
  } else {
    console.log("❌ Cloudinary variables missing or misconfigured");
  }

  console.log("\n===== Pre-Launch Checklist Complete =====");
  process.exit();
}