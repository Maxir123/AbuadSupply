import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

// Read-only: fetch site settings for the public app
export const fetchSiteSettings = createAsyncThunk(
  "settings/fetchSiteSettings",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/settings/public");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load settings"
      );
    }
  }
);

const siteSettingsSlice = createSlice({
  name: "settings",
  initialState: {
    siteSettings: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { clearSettingsError } = siteSettingsSlice.actions;
export default siteSettingsSlice.reducer;
