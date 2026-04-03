const colors = require('colors');
const path = require('path');
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const http = require('http');

// API Routes
const userRoutes = require('./routes/userRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const mainCategoryRoutes = require('./routes/mainCategoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const subSubCategoryRoutes = require('./routes/subSubCategoryRoutes');
const saleRoutes = require('./routes/saleRoutes');
const brandRoutes = require('./routes/brandRoutes');
const couponRoutes = require('./routes/couponCodeRoutes');
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const adminRoutes = require("./routes/adminRoutes");
const siteSettingRoutes = require("./routes/siteSettingRoutes");
const contactRoutes = require('./routes/contactRoutes');

// ✅ PAYSTACK ROUTES (NEW)
const paystackRoutes = require('./routes/paystackRoutes');

// Initialize database connection
connectDB();

// Create Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
];

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    if (/\.vercel\.app$/.test(origin)) return callback(null, true);

    return callback(new Error('CORS not allowed for this origin'), false);
  },
  credentials: true,
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// ======================
// API ROUTES
// ======================

app.use('/api/users', userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', mainCategoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/sub-subcategories', subSubCategoryRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/coupons', couponRoutes);

// ❌ REMOVED ALL OLD PAYMENT ROUTES (Stripe / PayPal)
// app.use('/api/payment', stripePaymentRoutes);
// app.use('/api/payment', paymentRoutes);

// ✅ NEW PAYSTACK ROUTES
app.use('/api/paystack', paystackRoutes);

app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/settings", siteSettingRoutes);
app.use('/api/support', contactRoutes);

// ======================
// SERVER START
// ======================

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.cyan.bold);
});