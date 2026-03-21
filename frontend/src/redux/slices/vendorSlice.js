import axiosInstance from "@/utils/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



// Helper function to check if we are in the browser environment
const isBrowser = () => typeof window !== "undefined";


// Helper function to get storeInfo from localStorage
const getVendorInfoFromLocalStorage = () => {
  if (isBrowser()) {
    const vendorInfo = localStorage.getItem("vendorInfo");
    return vendorInfo ? JSON.parse(vendorInfo) : null;
  }
  return null;
};

// Vendor register
export const registerVendor = createAsyncThunk(
  "vendor/registerVendor",
  async (credentials, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axiosInstance.post("/api/vendors/register", credentials, config);
      localStorage.setItem("vendorInfo", JSON.stringify(data));
      return data
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

// Vendor login
export const loginVendor = createAsyncThunk(
  "vendor/loginVendor",
  async (vendorData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/vendors/login",
        vendorData,
        {
          withCredentials: true,             
          headers: { "Content-Type": "application/json" },
        }
      );
      localStorage.setItem("vendorInfo", JSON.stringify(data.vendor));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

// Forgot Vendor Password
export const forgotVendorPassword = createAsyncThunk(
  "vendor/forgotVendorPassword",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/api/vendors/forgot-password", { email });
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to send reset email");
    }
  }
);

// Reset Vendor Password
export const resetVendorPassword = createAsyncThunk(
  "vendor/resetVendorPassword",
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/api/vendors/reset-password", {
        token,
        newPassword,
        confirmPassword,
      });
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to reset password");
    }
  }
);

// Vendor logout
export const logoutVendor = createAsyncThunk(
  "vendor/logoutVendor",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/vendors/logout", { withCredentials: true });
      localStorage.removeItem("vendorInfo");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("wishListItems");
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

// Get all vendors
export const getAllVendors = createAsyncThunk(
  "vendor/getAllVendors",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/vendors");
      return data.vendors;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

// Get vendor info
export const getVendorInfo = createAsyncThunk(
  "vendor/getVendorInfo",
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axiosInstance.get(`/api/vendors/get-vendor-info/${id}`, config);
      localStorage.setItem("vendorInfo", JSON.stringify(data.vendor));
      return data.vendor;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

// Update vendor information
export const updateVendorInformation = createAsyncThunk(
  "vendor/updateVendorInformation",
  async ({ name, description, address, phoneNumber, zipCode, email, id }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        "/api/vendors/update-vendor-info",
        { name, description, address, phoneNumber, zipCode, email, id },
        { withCredentials: true }
      );
      localStorage.setItem("vendorInfo", JSON.stringify(data.vendor)); // Ensure localStorage is updated
      return data.vendor; // Return updated vendor
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

// Async thunk for updating vendor avatar
export const updateVendorAvatar = createAsyncThunk(
  'vendor/updateVendorAvatar',
  async ({ id, avatar }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatar); // Attach the file

      const response = await axiosInstance.put(
        `/api/vendors/update-avatar/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return response.data.vendor; // Updated vendor information
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch vendor info by ID
export const fetchVendorById = createAsyncThunk(
  'vendor/fetchVendorById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/vendors/${id}`);
      localStorage.setItem("vendorInfo", JSON.stringify(data.vendor));
      return data.vendor;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

// Get vendor statistics
export const getVendorStatistics = createAsyncThunk(
  "vendor/getVendorStatistics",
  async (vendorId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/vendors/${vendorId}/statistics`);
      return { vendorId, ...data };
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

// Update vendor bank info
export const createVendorBankInfo = createAsyncThunk(
  "vendor/createVendorBankInfo",
  async ({ bankDetails, vendorId }, { rejectWithValue }) => {
    console.log("BANK:", bankDetails, vendorId);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axiosInstance.post(`/api/vendors/${vendorId}/bank-info`, bankDetails, config); // Changed to POST
      localStorage.setItem("vendorInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

// Update Bank Info
export const updateVendorBankInfo = createAsyncThunk(
  "vendors/updateVendorBankInfo",
  async ({ bankDetails, vendorId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/vendors/${vendorId}/bank-info`, bankDetails);
      console.log("DATA:", data);
      localStorage.setItem("vendorInfo", JSON.stringify(data.vendor));
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch notification count
export const fetchVendorNotificationCount = createAsyncThunk(
  "vendor/fetchVendorNotificationCount",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/vendors/notifications/count", { withCredentials: true });
      console.log("DATA_", data)
      return data.count;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch vendor notification count");
    }
  }
);

// Fetch all vendor notifications
export const fetchVendorNotifications = createAsyncThunk(
  "vendor/fetchVendorNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/vendors/notifications", { withCredentials: true });
      return data.notifications;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch vendor notifications");
    }
  }
);

// Mark vendor notification as read
export const markVendorNotificationAsRead = createAsyncThunk(
  "vendor/markVendorNotificationAsRead",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`/api/vendors/notifications/${id}/read`, {}, { withCredentials: true });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to mark vendor notification as read");
    }
  }
);

// Delete vendor notification
export const deleteVendorNotification = createAsyncThunk(
  "vendor/deleteVendorNotification",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/vendors/notifications/${id}`, { withCredentials: true });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete vendor notification");
    }
  }
);

const initialState = {
  isLoading: false,
  vendorInfo: getVendorInfoFromLocalStorage(),
  error: null,
  vendorStatistics: {},
  notificationCount: 0,
  notifications: [],
  success: false,
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Vendor register
      .addCase(registerVendor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorInfo = action.payload.vendor;
        state.success = true;
      })
      .addCase(registerVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Vendor login
      .addCase(loginVendor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorInfo = action.payload.vendor;
        state.success = action.payload.success;
      })
      .addCase(loginVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Vendor forgot Password
      .addCase(forgotVendorPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotVendorPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(forgotVendorPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
        // Vendor reset Password
      .addCase(resetVendorPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetVendorPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(resetVendorPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })      
      // Vendor logout
      .addCase(logoutVendor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorInfo = null;
      })
      .addCase(logoutVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle getAllVendors
      .addCase(getAllVendors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllVendors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendors = action.payload;
        state.success = true;
      })
      .addCase(getAllVendors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get vendor info
      .addCase(getVendorInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getVendorInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorInfo = action.payload;
        state.success = true;
      })
      .addCase(getVendorInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update vendor information
      .addCase(updateVendorInformation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateVendorInformation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorInfo = action.payload; 
        state.status = 'success';
      })
      .addCase(updateVendorInformation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateVendorAvatar.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateVendorAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorInfo = { ...state.vendorInfo, avatar: action.payload.avatar };
        localStorage.setItem('vendorInfo', JSON.stringify(state.vendorInfo)); 
      })      
      .addCase(updateVendorAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error updating avatar';
      })
      .addCase(fetchVendorById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vendorInfo = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
    .addCase(getVendorStatistics.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getVendorStatistics.fulfilled, (state, action) => {
      state.isLoading = false;
      const { vendorId, productCount, averageRating, reviewCount } = action.payload;
      
      // Update the vendor statistics for the specific vendor
      state.vendorStatistics[vendorId] = {
        productCount,
        averageRating,
        reviewCount
      };
    })
    .addCase(getVendorStatistics.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Handle update vendor bank info
    .addCase(createVendorBankInfo.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(createVendorBankInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.vendorInfo = action.payload.vendor;
    })
    .addCase(createVendorBankInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(updateVendorBankInfo.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(updateVendorBankInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.vendorInfo = action.payload; // Directly assign the vendor object
    })
    .addCase(updateVendorBankInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(fetchVendorNotificationCount.fulfilled, (state, action) => {
      state.notificationCount = action.payload;
    })
    .addCase(fetchVendorNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload;
      state.notificationCount = action.payload.filter(n => !n.isRead).length;
    })
    .addCase(markVendorNotificationAsRead.fulfilled, (state, action) => {
      const id = action.payload;
      const idx = state.notifications.findIndex(n => n._id === id);
      if (idx !== -1) state.notifications[idx].isRead = true;
      state.notificationCount = state.notifications.filter(n => !n.isRead).length;
    })    
    .addCase(deleteVendorNotification.fulfilled, (state, action) => {
      state.notifications = state.notifications.filter(n => n._id !== action.payload);
      state.notificationCount = state.notifications.filter(n => !n.isRead).length;
    })
    
  },
});

export default vendorSlice.reducer;
