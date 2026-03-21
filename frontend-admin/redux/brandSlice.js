// redux/slices/brandSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch all brands
export const fetchAllBrands = createAsyncThunk(
  'brands/fetchAllBrands',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/brands`);
      return data.brands;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Thunk to fetch a single brand by ID
export const fetchBrandById = createAsyncThunk(
  'brands/fetchBrandById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/brands/${id}`);
      return data.brand;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Thunk to create a new brand
export const createBrand = createAsyncThunk(
  'brands/createBrand',
  async (brandData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/brands`, brandData);
      return data.brand;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Thunk to update an existing brand
export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async ({ id, brandData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/brands/${id}`, brandData);
      return data.brand;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Thunk to delete a brand
export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/brands/${id}`);
      return id; // Return the ID of the deleted brand
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    brands: [],
    brand: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Brands
      .addCase(fetchAllBrands.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = action.payload;
      })
      .addCase(fetchAllBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Brand By ID
      .addCase(fetchBrandById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrandById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brand = action.payload;
      })
      .addCase(fetchBrandById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Brand
      .addCase(createBrand.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands.push(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Brand
      .addCase(updateBrand.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = state.brands.map(brand =>
          brand._id === action.payload._id ? action.payload : brand
        );
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Brand
      .addCase(deleteBrand.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = state.brands.filter(brand => brand._id !== action.payload);
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default brandSlice.reducer;
