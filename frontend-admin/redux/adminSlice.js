import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '@/utils/axiosInstance';

// Check if window is defined (to avoid SSR issues)
const isBrowser = () => typeof window !== "undefined";

// Get Admin Info from LocalStorage
const getAdminInfoFromStorage = () => {
  if (isBrowser()) {
    const adminInfo = localStorage.getItem("adminInfo");
    return adminInfo ? JSON.parse(adminInfo) : null;
  }
  return null;
};

// Thunk for admin registration
export const registerAdmin = createAsyncThunk(
  'admin/registerAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      };
      const { data } = await axiosInstance.post('/api/admin/register', adminData, config);
      if (isBrowser()) {
        localStorage.setItem("adminInfo", JSON.stringify(data.admin));
      }
      return data.admin;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// Admin Login
export const loginAdmin = createAsyncThunk(
  "admin/loginAdmin",
  async (adminData, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post(`/api/admin/login`, adminData, {

        withCredentials: true,
      });
      console.log("data:", data)
      if (isBrowser()) {
        localStorage.setItem("adminInfo", JSON.stringify(data.admin));
      }
      return data;
    } catch (error) {
      console.log("error:", error)
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Forgot Admin Password
export const forgotAdminPassword = createAsyncThunk(
  "admin/forgotAdminPassword",
  async (email , { rejectWithValue }) => {
    console.log("email", email)
    try {
      const { data } = await axiosInstance.post(`/api/admin/forgot-password`, { email }, { withCredentials: true });
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to send reset email");
    }
  }
);

// Reset Admin Password
export const resetAdminPassword = createAsyncThunk(
  "admin/resetAdminPassword",
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`/api/admin/reset-password`, {
          token, newPassword, confirmPassword, }, { withCredentials: true 
        });
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
  }
);

// Admin Logout
export const logoutAdmin = createAsyncThunk(
  "admin/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.get(`/api/admin/logout`, {
        withCredentials: true,
      });
      if (isBrowser()) {
        localStorage.removeItem("adminInfo");
      }
      return "Logged out successfully";
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Logout failed");
    }
  }
);

// ---------- USER ACTIONS ----------
// Fetch All Users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/users`, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch users"
      );
    }
  }
);
// Update User
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, updatedUser }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/admin/users/${id}`, updatedUser, {
        withCredentials: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update user"
      );
    }
  }
);
// Delete User
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/api/admin/users/${userId}`, {
        withCredentials: true,
      });
      return { userId, message: data.message }; // Return userId and message for handling in reducers
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete user"
      );
    }
  }
);
// Add the new action to fetch orders for a user
export const fetchUserOrders = createAsyncThunk(
  "admin/fetchUserOrders",
  async (userId, { rejectWithValue }) => {
    console.log("userId:", userId)
    try {
      const { data } = await axiosInstance.get(`/api/admin/orders/user/${userId}`, {
        withCredentials: true,
      });
      console.log("DATA:", data)
      return data; // Return the orders data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch orders"
      );
    }
  }
);

// ---------- VENDOR ACTIONS ----------
// Fetch all vendors
export const fetchAllVendors = createAsyncThunk(
  "admin/fetchAllVendors",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/vendors`, {
        withCredentials: true,
      });
      return data.vendors;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch vendors"
      );
    }
  }
);
// Fetch Single vendor
export const fetchVendorById = createAsyncThunk(
  "admin/fetchVendorById",
  async (vendorId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/vendors/${vendorId}`, {
        withCredentials: true,
      });
      return data.vendor; // Return vendor data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch vendor"
      );
    }
  }
);
// Update Vendor
export const updateVendor = createAsyncThunk(
  "admin/updateVendor",
  async ({ id, updatedVendor }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/admin/vendors/${id}`, updatedVendor, {
        withCredentials: true,
      });
      return data;  // Return the updated vendor
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update vendor"
      );
    }
  }
);

// Delete Vendor
export const deleteVendor = createAsyncThunk(
  "admin/deleteVendor",
  async (vendorId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/admin/vendors/${vendorId}`,
        { withCredentials: true }
      );
      return { vendorId, message: data?.message || "Vendor deleted" };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete vendor"
      );
    }
  }
);

// Block Vendor
export const blockVendor = createAsyncThunk(
  "admin/blockVendor",
  async (vendorId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(
        `/api/admin/vendors/${vendorId}/block`,
        {},
        { withCredentials: true }
      );
      return data; // Return updated vendor data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to block vendor"
      );
    }
  }
);
// Unblock Vendor
export const unblockVendor = createAsyncThunk(
  "admin/unblockVendor",
  async (vendorId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(
        `/api/admin/vendors/${vendorId}/unblock`,
        {},
        {
          withCredentials: true,
        }
      );
      return data; // Return updated vendor data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to unblock vendor"
      );
    }
  }
);

// ---------- ORDER ACTIONS ----------
// Fetch all orders
export const fetchOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/orders`);
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Fetch a single order by ID
export const fetchSingleOrder = createAsyncThunk(
  "admin/fetchSingleOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/orders/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Update order status
export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/admin/orders/${id}/status`, {
        status,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Update order thunk
export const updateOrder = createAsyncThunk(
  "admin/updateOrder", 
  async ({ id, updatedOrder }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/admin/orders/${id}`, updatedOrder); 
      return data; // Return the updated order data
    } catch (error) {
      return rejectWithValue(error.response.data.message); 
    }
  }
);

// Delete an order
export const deleteOrder = createAsyncThunk(
  "admin/deleteOrder",
  async ({ id }, { rejectWithValue }) => { 
    console.log("ID:", id)
    try {
      const { data } = await axiosInstance.delete(`/api/admin/orders/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Process refund COMEBACK???????????????????????????
export const refundOrder = createAsyncThunk(
  "admin/refundOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(`/api/admin/orders/${id}/refund`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// ---------- PRODUCTS ACTIONS ----------
// Create product
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/api/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch all products
export const fetchAllProducts = createAsyncThunk(
  "admin/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/products`, {
        withCredentials: true,
      });
      return data; // Return products data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch products"
      );
    }
  }
);
// Fetch single product
export const fetchSingleProduct = createAsyncThunk(
  "admin/fetchSingleProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/products/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Edit product
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ productId, updatedProduct }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/admin/products/${productId}`,  
        updatedProduct, 
        { withCredentials: true }
      );
      return data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to edit product"
      );
    }
  }
);
// Delete product
export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/api/admin/products/${productId}`, {
        withCredentials: true,
      });
      return data; // Return success message for deletion
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete product"
      );
    }
  }
);

// ---------- CATEGORY ACTIONS ----------
// Fetch main categories
export const fetchCategories = createAsyncThunk(
  'admin/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/categories`); // Using axiosInstance to fetch data
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch categories");
    }
  }
);
// Create Main Category
export const createMainCategory = createAsyncThunk(
  'admin/createMainCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`/api/admin/categories`, categoryData, {
        headers: { 'Content-Type': 'application/json' }, // Setting the content type
      });
      return data.category; // Returning the created category
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create category');
    }
  }
);
// Update Main Category
export const updateMainCategory = createAsyncThunk(
  'admin/updateMainCategory',
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/admin/categories/${categoryId}`, categoryData, {
        headers: { 'Content-Type': 'application/json' }, // Setting the content type
      });
      return data.category; // Returning the updated category
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update category');
    }
  }
);
// Delete Main Category
export const deleteMainCategory = createAsyncThunk(
  'admin/deleteMainCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/api/admin/categories/${categoryId}`); // Sending DELETE request
      return categoryId; // Returning the category ID that was deleted
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete category');
    }
  }
);

// ---------- SUB-CATEGORY ACTIONS ----------
// Fetch subcategories by category slug or fetch all subcategories
export const fetchSubcategories = createAsyncThunk(
  'admin/fetchSubcategories',
  async (mainCategoryId = null, { rejectWithValue }) => {  // Default is null if categorySlug is not provided
    try {
      let url = `/api/admin/subcategories`;
      // If categorySlug is provided, append it to the URL
      if (mainCategoryId) {
        url += `?mainCategoryId=${mainCategoryId}`;
      }

      const response = await axiosInstance.get(url, {
        withCredentials: true, 
      });
      
      // Return subcategories
      return response.data.subcategories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch subcategories");
    }
  }
);
// Create Sub-Subcategory
export const createSubcategory = createAsyncThunk(
  'admin/createSubcategory',
  async (formData, { rejectWithValue }) => {
    console.log("Subcategory formData:", formData)
    try {
      const { data } = await axiosInstance.post(`/api/admin/subcategories`, formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      return data.subCategory;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// Update Subcategory
export const updateSubcategory = createAsyncThunk(
  'admin/updateSubcategory',
  async ({ subcategoryId, subcategoryData }, { rejectWithValue }) => {
    console.log("subcategoryId And subcategoryData ", subcategoryId, subcategoryData )
    try {
      const response = await axiosInstance.put(
        `/api/admin/subcategories/${subcategoryId}`,
        subcategoryData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      // Assuming your response data returns the updated subcategory under "subCategory"
      return response.data.subCategory;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update subcategory'
      );
    }
  }
);
// Delete Subcategory
export const deleteSubcategory = createAsyncThunk(
  'admin/deleteSubcategory',
  async (subcategoryId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/admin/subcategories/${subcategoryId}`, {
        withCredentials: true,
      });
      return subcategoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete subcategory");
    }
  }
);


// ---------- SUB-SUBCATEGORY ACTIONS ----------
// Fetch sub-subcategories by subcategory slug
export const fetchSubSubcategories = createAsyncThunk(
  'admin/fetchSubSubcategories',
  async (subCategoryId, { rejectWithValue }) => {
    try {
      let url = `/api/admin/subsubcategories`;  

      if (subCategoryId) {
        url += `?subCategoryId=${subCategoryId}`;
      }

      const response = await axiosInstance.get(url, {
        withCredentials: true, 
      });
      return response.data.subSubcategories;  
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch sub-subcategories");
    }
  }
);
// Create Sub-Subcategory
export const createSubSubcategory = createAsyncThunk(
  'admin/createSubSubcategory',
  async (formData, { rejectWithValue }) => {
    console.log("formData:", formData)
    try {
      const { data } = await axiosInstance.post(`/api/admin/subsubcategories`, formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      return data.subSubCategory;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// Update Sub-Subcategory
export const updateSubSubcategory = createAsyncThunk(
  'admin/updateSubSubcategory',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/admin/subsubcategories/${id}`, formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      return data.subSubCategory;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// Delete Sub-Subcategory
export const deleteSubSubcategory = createAsyncThunk(
  'admin/deleteSubSubcategory',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/api/admin/subsubcategories/${id}`, {
        withCredentials: true,
      });
      return data; // or data.subSubCategory
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ---------- COUPONS ACTIONS ----------
// Fetch all coupons for the admin
export const fetchAllCoupons = createAsyncThunk(
  'admin/fetchAllCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/coupons`, { withCredentials: true });
      return data.coupons; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch coupons");
    }
  }
);
// Thunk to create a new coupon
export const createCoupon = createAsyncThunk(
  'admin/createCoupon',
  async (couponData, { rejectWithValue }) => {
    console.log("couponData:", couponData)
    try {
      const { data } = await axiosInstance.post(`/api/admin/coupons`, couponData, { withCredentials: true });
      return data.coupon;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create coupon");
    }
  }
);
// Thunk to delete a coupon
export const deleteCoupon = createAsyncThunk(
  'admin/deleteCoupon',
  async (couponId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/admin/coupons/${couponId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Update an existing coupon
export const adminUpdateCoupon = createAsyncThunk(
  "admin/adminUpdateCoupon",
  async ({ couponId, couponData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/admin/coupons/${couponId}`, couponData, { withCredentials: true });
      return { coupon: response.data.coupon, message: response.data.message };  // Return both coupon and message
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ---------- SALE PRODUCTS ACTIONS ----------
// Fetch All Sales
export const fetchAllSales = createAsyncThunk(
  "sales/fetchAllSales",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/sales`, { withCredentials: true });
      console.log("SALES:", data)
      return data.sales; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch Single Sale
export const fetchSingleSale = createAsyncThunk(
  "sales/fetchSingleSale",
  async (saleId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/sales/${saleId}`, { withCredentials: true });
      return data; // single sale object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create Sale
export const createSale = createAsyncThunk(
  "sales/createSale",
  async (saleData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`/api/admin/sales`, saleData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return data.sale;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Sale
export const updateSale = createAsyncThunk(
  "sales/updateSale",
  async ({ saleId, saleData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/admin/sales/${saleId}`, saleData, {
        headers: { "Content-Type": "application/json" },
         withCredentials: true,
      });
      return data.sale;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete Sale
export const deleteSale = createAsyncThunk(
  "sales/deleteSale",
  async (saleId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/admin/sales/${saleId}`, { withCredentials: true });
      return saleId; // Return the deleted ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Admin refund order
export const adminRefundOrder = createAsyncThunk(
  "admin/adminRefundOrder",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/admin/orders/${orderId}/refund`,
        { status },
        { 
          headers: { "Content-Type": "application/json" }, 
          withCredentials: true,
        }
      );
      return data.order; // The updated order
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk to fetch admin profile
export const fetchAdminProfile = createAsyncThunk(
  "admin/fetchAdminProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/profile`, { withCredentials: true });
      return data.admin; // returns the admin profile
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk to update admin profile
export const updateAdminProfile = createAsyncThunk(
  "admin/updateAdminProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/admin/profile`, profileData, { withCredentials: true });
      return data.admin;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ---------- ADMIN PWD UPDATE ----------
// Thunk for updating admin security (password update)
export const updateAdminSecurity = createAsyncThunk(
  "admin/updateAdminSecurity",
  async (securityData, { rejectWithValue }) => {
    console.log("securityData:", securityData)
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      const { data } = await axiosInstance.put(`/api/admin/security`, securityData, config);
      return data; // Return updated admin data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAdminDashboardStats = createAsyncThunk(
  "admin/fetchAdminDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/dashboard`, { withCredentials: true });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// Fetch weekly trends
export const fetchWeeklyTrends = createAsyncThunk(
  "admin/fetchWeeklyTrends",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/analytics/weekly-trends`, { withCredentials: true });
      return data.trends;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Thunk to fetch notification count
export const fetchAdminNotificationCount = createAsyncThunk(
  "admin/fetchAdminNotificationCount",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/notifications/count`, { withCredentials: true });
      return data.count;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch count");
    }
  }
);

// Thunk to fetch all notifications
export const fetchAdminNotifications = createAsyncThunk(
  "admin/fetchAdminNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/notifications`, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

// Thunk to mark a notification as read
export const markNotificationAsRead = createAsyncThunk(
  "admin/markNotificationAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`/api/admin/notifications/${notificationId}/read`, { withCredentials: true });
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark as read");
    }
  }
);

// Delete admin notification
export const deleteAdminNotification = createAsyncThunk(
  "admin/deleteAdminNotification",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/admin/notifications/${id}`, { withCredentials: true });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete admin notification");
    }
  }
);

const initialState = {
  adminInfo: getAdminInfoFromStorage(),
  users: [],
  vendors: [],
  userOrders: [],
  orders: [],
  singleOrder: null,
  singleVendor: null,
  products: [],
  singleProduct: null,
  categories: [],
  subcategories: [],
  subSubcategories: [],
  coupons: [],
  sales: [],
  singleSale: null,
  dashboardStats: null,
  bestSellers: [],
  recentOrders: [],
  weeklyTrends: [],
  notificationCount: 0,
  notifications: [],
  isLoading: false,
  error: null,
  message: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  extraReducers: (builder) => {
    builder
      // Register Admin 
      .addCase(registerAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminInfo = action.payload;
        state.message = "Admin registered successfully";
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Admin Login
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminInfo = action.payload.admin;
        state.message = action.payload.message;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Forgot Admin Password
      .addCase(forgotAdminPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotAdminPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(forgotAdminPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Reset Admin Password
      .addCase(resetAdminPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetAdminPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(resetAdminPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Admin Logout
      .addCase(logoutAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminInfo = null;
        state.message = action.payload;
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.message = action.payload.message;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Edit User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message || "User updated successfully";
        const updatedUser = action.payload.user;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(
          (user) => user._id !== action.payload.userId
        );
        state.message = action.payload.message;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle fetching user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload.orders || []; 
        state.message = action.payload.message 
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Fetch all vendors
      .addCase(fetchAllVendors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllVendors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchAllVendors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetch single vendor
      .addCase(fetchVendorById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleVendor = action.payload; 
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Updating the full order
      .addCase(updateVendor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.vendors = state.vendors.map((vendor) =>
          vendor._id === action.payload.vendor._id ? action.payload.vendor : vendor
        );
        state.message = "Vendor updated successfully!";
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Vendor
      .addCase(deleteVendor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        const id = action.payload.vendorId;
        state.vendors = state.vendors.filter((v) => v._id !== id);
        state.message = action.payload.message;
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Block Vendor
      .addCase(blockVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedVendor = action.payload.vendor; // Get updated vendor
        state.vendors = state.vendors.map((vendor) =>
          vendor._id === updatedVendor._id ? updatedVendor : vendor
        );
        state.message =
          action.payload.message || "Vendor blocked successfully";
      })
      .addCase(blockVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Unblock Vendor
      .addCase(unblockVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedVendor = action.payload.vendor; 
        state.vendors = state.vendors.map((vendor) =>
          vendor._id === updatedVendor._id ? updatedVendor : vendor
        );
        state.message =
          action.payload.message || "Vendor unblocked successfully";
      })
      .addCase(unblockVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSingleOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleOrder = action.payload.order; 
      })
      .addCase(fetchSingleOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order._id === action.payload.order._id ? action.payload.order : order
        );
      })
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order._id === action.payload.order._id ? action.payload.order : order
        );
        state.message = action.payload?.message;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.meta.arg
        );
      })
      .addCase(refundOrder.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order._id === action.payload.order._id ? action.payload.order : order
        );
      })
      // Products
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally push the new product into state.products
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload; 
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleProduct = action.payload.product; 
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.map((product) =>
          product._id === action.payload.product._id
            ? action.payload.product
            : product
        );
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload.productId
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // ---------- CATEGORIES  ----------
      // Handle fetching categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle creating category
      .addCase(createMainCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      // Handle updating category
      .addCase(updateMainCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(category => category._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      // Handle deleting category
      .addCase(deleteMainCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(category => category._id !== action.payload);
      })
      // ---------- SUB-CATEGORIES  ----------
      // Fetch Subcategories
      .addCase(fetchSubcategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subcategories = action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Subcategory
      .addCase(createSubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subcategories.push(action.payload);
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Subcategory
      .addCase(updateSubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.subcategories.findIndex(
          (subcat) => subcat._id === action.payload._id
        );
        if (index !== -1) {
          state.subcategories[index] = action.payload;
        }
      })
      .addCase(updateSubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Subcategory
      .addCase(deleteSubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subcategories = state.subcategories.filter(subcat => subcat._id !== action.payload);
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // ---------- SUB-SUBCATEGORIES  ----------
      .addCase(fetchSubSubcategories.pending, (state) => {
        state.isLoading = true;  
      })
      .addCase(fetchSubSubcategories.fulfilled, (state, action) => {
        state.isLoading = false;  
        state.subSubcategories = action.payload;  
      })
      .addCase(fetchSubSubcategories.rejected, (state, action) => {
        state.isLoading = false;  
        state.error = action.payload; 
      })
      // updateSubSubcategory
      .addCase(updateSubSubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSubSubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.subSubcategories.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) {
          state.subSubcategories[index] = action.payload;
        }
      })
      // createSubSubcategory
      .addCase(createSubSubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSubSubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subSubcategories.push(action.payload);
      })
      .addCase(createSubSubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateSubSubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Sub-Subcategory
      .addCase(deleteSubSubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSubSubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload.subSubCategoryId;
        state.subSubcategories = state.subSubcategories.filter(
          (subSubcat) => subSubcat._id !== deletedId
        );
      })      
      .addCase(deleteSubSubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ---------- COUPONS  ----------
      // Handle fetchAllCoupons
      .addCase(fetchAllCoupons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = action.payload;  // Coupons data returned from API
      })
      .addCase(fetchAllCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle createCoupon
      .addCase(createCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons.push(action.payload); // Correctly adds new coupon
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Handle deleteCoupon
      .addCase(deleteCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = state.coupons.filter(
          (coupon) => coupon._id !== action.payload._id
        );
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })  
    // Handle updateCoupon
    .addCase(adminUpdateCoupon.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(adminUpdateCoupon.fulfilled, (state, action) => {
      state.isLoading = false;
      state.coupons = state.coupons.map((coupon) =>
        coupon._id === action.payload.coupon._id ? action.payload.coupon : coupon
      );
      state.message = action.payload.message; // Store the success message if you need it later
    })
    .addCase(adminUpdateCoupon.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // ---------- SALES  ----------
    // Fetch all sales
    .addCase(fetchAllSales.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchAllSales.fulfilled, (state, action) => {
      state.isLoading = false;
      state.sales = action.payload; 
    })
    .addCase(fetchAllSales.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Fetch single sale
    .addCase(fetchSingleSale.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchSingleSale.fulfilled, (state, action) => {
      state.isLoading = false;
      state.singleSale = action.payload;
    })
    .addCase(fetchSingleSale.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Create sale
    .addCase(createSale.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(createSale.fulfilled, (state, action) => {
      state.isLoading = false;
      state.sales.push(action.payload);
    })
    .addCase(createSale.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Update sale
    .addCase(updateSale.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(updateSale.fulfilled, (state, action) => {
      state.isLoading = false;
      const updated = action.payload; 
      const idx = state.sales.findIndex((s) => s._id === updated._id);
      if (idx !== -1) {
        state.sales[idx] = updated;
      }
    })
    .addCase(updateSale.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Delete sale
    .addCase(deleteSale.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(deleteSale.fulfilled, (state, action) => {
      state.isLoading = false;
      const deletedId = action.payload;
      state.sales = state.sales.filter((s) => s._id !== deletedId);
    })
    .addCase(deleteSale.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // ---------- REFUND ORDER  ----------
    .addCase(adminRefundOrder.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(adminRefundOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      const updatedOrder = action.payload;
      // Replace the old order in state.orders with the updated one
      state.orders = state.orders.map((o) =>
        o._id === updatedOrder._id ? updatedOrder : o
      );
    })
    .addCase(adminRefundOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // ---------- ADMIN  PROFILE  ----------
    .addCase(fetchAdminProfile.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchAdminProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.adminInfo = action.payload;
    })
    .addCase(fetchAdminProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(updateAdminProfile.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(updateAdminProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.adminInfo = action.payload;
      state.message = "Profile updated successfully!";
    })
    .addCase(updateAdminProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
     // updateAdminSecurity
     .addCase(updateAdminSecurity.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(updateAdminSecurity.fulfilled, (state, action) => {
      state.isLoading = false;
      state.adminInfo = action.payload.admin; 
      state.message = action.payload.message;
    })
    .addCase(updateAdminSecurity.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(fetchAdminDashboardStats.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
      state.isLoading = false;
      state.dashboardStats = action.payload;
    })
    .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })    
    // Reducers
    .addCase(fetchWeeklyTrends.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchWeeklyTrends.fulfilled, (state, action) => {
      state.isLoading = false;
      state.weeklyTrends = action.payload;
    })
    .addCase(fetchWeeklyTrends.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Notifications logic
    .addCase(fetchAdminNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload;
      state.notificationCount = action.payload.filter(n => !n.isRead).length;
    })
    .addCase(markNotificationAsRead.fulfilled, (state, action) => {
      const id = action.payload;
      const notification = state.notifications.find(n => n._id === id);
      if (notification) notification.isRead = true;
      state.notificationCount = state.notifications.filter(n => !n.isRead).length;
    })
    .addCase(fetchAdminNotificationCount.fulfilled, (state, action) => {
      state.notificationCount = action.payload;
    })
    .addCase(deleteAdminNotification.fulfilled, (state, action) => {
      state.notifications = state.notifications.filter(n => n._id !== action.payload);
      state.notificationCount = state.notifications.filter(n => !n.isRead).length;
    })
    
  },
});

export default adminSlice.reducer;
