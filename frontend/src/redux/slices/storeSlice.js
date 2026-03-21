// storeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

// Helper function to check if we are in the browser environment
const isBrowser = () => typeof window !== "undefined";

// Helper function to get storeInfo from localStorage
const getStoreInfoFromStorage = () => {
  if (isBrowser()) {
    const storeInfo = localStorage.getItem("storeInfo");
    return storeInfo ? JSON.parse(storeInfo) : {};
    
  }
  return null;
};

// Thunks
export const registerStore = createAsyncThunk(
  "store/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axiosInstance.post("/api/stores/register", credentials, config);
      if (isBrowser()) {
        localStorage.setItem("storeInfo", JSON.stringify(data.store));
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const loginStore = createAsyncThunk(
  "store/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axiosInstance.post("/api/stores/login", credentials, config);
      if (isBrowser()) {
        localStorage.setItem("storeInfo", JSON.stringify(data.store));
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const logoutStore = createAsyncThunk(
  "store/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/stores/logout", { withCredentials: true });
      if (isBrowser()) {
        localStorage.removeItem("storeInfo");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("wishListItems");
      }
      return data.msg;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getStoreInfo = createAsyncThunk(
  "store/getInfo",
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axiosInstance.get(`/api/stores/get-store-info/${id}`, config);
      if (isBrowser()) {
        localStorage.setItem("storeInfo", JSON.stringify(data.store));
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateStoreInformation = createAsyncThunk(
  "store/updateInfo",
  async ({ name, description, address, phoneNumber, zipCode, id }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        "/api/stores/update-store-info",
        { name, description, address, phoneNumber, zipCode, id },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Credentials": true,
          },
        }
      );
      if (isBrowser()) {
        localStorage.setItem("storeInfo", JSON.stringify(data.store));
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Slice
const storeSlice = createSlice({
  name: "store",
  initialState: {
    isLoading: false,
    storeInfo: getStoreInfoFromStorage(),
    error: null,
    success: false,
    successMessage: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Store
      .addCase(registerStore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerStore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storeInfo = action.payload.store;
        state.success = true;
        state.successMessage = action.payload.msg;
      })
      .addCase(registerStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Login Store
      .addCase(loginStore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginStore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storeInfo = action.payload.store;
        state.success = true;
        state.successMessage = action.payload.msg;
      })
      .addCase(loginStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Logout Store
      .addCase(logoutStore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutStore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storeInfo = null;
        state.successMessage = action.payload;
      })
      .addCase(logoutStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Store Info
      .addCase(getStoreInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStoreInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storeInfo = action.payload.store;
        state.success = true;
        state.successMessage = action.payload.msg;
      })
      .addCase(getStoreInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update Store Information
      .addCase(updateStoreInformation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStoreInformation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storeInfo = action.payload.store;
        state.successMessage = action.payload.msg;
      })
      .addCase(updateStoreInformation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, clearMessages } = storeSlice.actions;

export default storeSlice.reducer;
