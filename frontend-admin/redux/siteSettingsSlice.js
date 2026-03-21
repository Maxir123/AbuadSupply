import axiosInstance from "@/utils/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch site settings
export const fetchSiteSettings = createAsyncThunk(
  "settings/fetchSiteSettings",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/settings`);
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update site settings (including logo upload)
export const updateSiteSettings = createAsyncThunk(
  "settings/updateSiteSettings",
  async (settingsData, { rejectWithValue }) => {
    console.log("settingsData", settingsData)
    try {
      let formData = new FormData();
      
      // Create FormData to include all fields; logo (if file) will be appended as such.
      Object.keys(settingsData).forEach((key) => {
        if (key === "notifications" || key === "advanced") {
          formData.append(key, JSON.stringify(settingsData[key]));
        } else {
          formData.append(key, settingsData[key]);
        }
      });

      const { data } = await axiosInstance.put(`/api/settings`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const siteSettingsSlice = createSlice({
  name: "settings",
  initialState: {
    siteSettings: null,
    isLoading: false,
    successMessage: null,
    error: null,
  },
  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
    },
    clearSettingsSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch site settings
      .addCase(fetchSiteSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSiteSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.siteSettings = action.payload;
      })
      .addCase(fetchSiteSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update site settings
      .addCase(updateSiteSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateSiteSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.siteSettings = action.payload.settings;
        state.successMessage = action.payload.message;
      })
      .addCase(updateSiteSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSettingsError, clearSettingsSuccess } = siteSettingsSlice.actions;
export default siteSettingsSlice.reducer;
