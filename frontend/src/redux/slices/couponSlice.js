// src/redux/slices/couponSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';


// Thunk to fetch all coupons for a specific vendor
export const fetchAllCoupons = createAsyncThunk(
  'coupons/fetchAllCoupons',
  async (vendorId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/coupons/vendor/${vendorId}`);
      return response.data.coupons;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to create a new coupon
export const createCoupon = createAsyncThunk(
  'coupons/createCoupon',
  async (couponData, { rejectWithValue }) => {
    console.log("couponData:", couponData)
    try {
      const response = await axiosInstance.post(`/api/coupons/create`, couponData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a coupon
export const deleteCoupon = createAsyncThunk(
  'coupons/deleteCoupon',
  async (couponId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/coupons/${couponId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update an existing coupon
export const updateCoupon = createAsyncThunk(
  'coupons/updateCoupon',
  async ({ couponId, couponData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/coupons/${couponId}`, couponData);
      return response.data.updatedCoupon; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

const couponSlice = createSlice({
  name: 'coupons',
  initialState: {
    coupons: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchAllCoupons
      .addCase(fetchAllCoupons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = action.payload;
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
        state.coupons = state.coupons.filter(
          (coupon) => coupon._id !== action.payload._id
        );
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
    .addCase(updateCoupon.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(updateCoupon.fulfilled, (state, action) => {
      state.isLoading = false;
      state.coupons = state.coupons.map((coupon) =>
        coupon._id === action.payload?._id ? action.payload : coupon
      );
    })
    .addCase(updateCoupon.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

  },
});

export default couponSlice.reducer;
