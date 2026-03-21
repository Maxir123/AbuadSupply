//categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';

// -------------- CATEGORY ACTIONS --------------
// Fetch main categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/api/categories');
      return data.categories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create Main Category
export const createMainCategory = createAsyncThunk(
  'categories/createMainCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/api/categories', categoryData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data.category;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Main Category
export const updateMainCategory = createAsyncThunk(
  'categories/updateMainCategory',
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/categories/${categoryId}`, categoryData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data.category;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete Main Category
export const deleteMainCategory = createAsyncThunk(
  'categories/deleteMainCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/categories/${categoryId}`);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// -------------- SUB-CATEGORY ACTIONS --------------
// Fetch subcategories by category slug
export const fetchSubcategories = createAsyncThunk(
  'categories/fetchSubcategories',
  async (categorySlug, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/subcategories?categorySlug=${categorySlug}`);
      return data.subcategories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create Subcategory
export const createSubcategory = createAsyncThunk(
  'categories/createSubcategory',
  async (subcategoryData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/api/subcategories', subcategoryData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data.subcategory;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Subcategory
export const updateSubcategory = createAsyncThunk(
  'categories/updateSubcategory',
  async ({ subcategoryId, subcategoryData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/subcategories/${subcategoryId}`, subcategoryData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data.subcategory;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete Subcategory
export const deleteSubcategory = createAsyncThunk(
  'categories/deleteSubcategory',
  async (subcategoryId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/subcategories/${subcategoryId}`);
      return subcategoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// -------------- SUB-SUBCATEGORY ACTIONS --------------
// Fetch sub-subcategories by subcategory slug
export const fetchSubSubcategories = createAsyncThunk(
  'categories/fetchSubSubcategories',
  async (subCategorySlug, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/sub-subcategories?subCategorySlug=${subCategorySlug}`);
      return data.subSubcategories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create Sub-Subcategory
export const createSubSubcategory = createAsyncThunk(
  'categories/createSubSubcategory',
  async (subSubcategoryData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/api/sub-subcategories', subSubcategoryData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data.subSubcategory;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Sub-Subcategory
export const updateSubSubcategory = createAsyncThunk(
  'categories/updateSubSubcategory',
  async ({ subSubcategoryId, subSubcategoryData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/sub-subcategories/${subSubcategoryId}`, subSubcategoryData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data.subSubcategory;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete Sub-Subcategory
export const deleteSubSubcategory = createAsyncThunk(
  'categories/deleteSubSubcategory',
  async (subSubcategoryId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/sub-subcategories/${subSubcategoryId}`);
      return subSubcategoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    subcategories: [],
    subSubcategories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchCategories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle CRUD actions for Main Categories, Subcategories, and Sub-Subcategories
    builder
      .addCase(createMainCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateMainCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteMainCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      });
    //  fetchSubcategories
    builder
      .addCase(fetchSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    //  Subcategory
    builder
      .addCase(createSubcategory.fulfilled, (state, action) => {
        state.subcategories.push(action.payload);
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        const index = state.subcategories.findIndex(
          (subcategory) => subcategory._id === action.payload._id
        );
        if (index !== -1) {
          state.subcategories[index] = action.payload;
        }
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        state.subcategories = state.subcategories.filter(
          (subcategory) => subcategory._id !== action.payload
        );
      });

    // Handle Sub-Subcategory CRUD
    builder
      .addCase(createSubSubcategory.fulfilled, (state, action) => {
        state.subSubcategories.push(action.payload);
      })
      .addCase(updateSubSubcategory.fulfilled, (state, action) => {
        const index = state.subSubcategories.findIndex(
          (subSubcategory) => subSubcategory._id === action.payload._id
        );
        if (index !== -1) {
          state.subSubcategories[index] = action.payload;
        }
      })
      .addCase(deleteSubSubcategory.fulfilled, (state, action) => {
        state.subSubcategories = state.subSubcategories.filter(
          (subSubcategory) => subSubcategory._id !== action.payload
        );
      });


    // Handle fetchSubSubcategories
    builder
    .addCase(fetchSubSubcategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchSubSubcategories.fulfilled, (state, action) => {
      state.loading = false;
      state.subSubcategories = action.payload;
    })
    .addCase(fetchSubSubcategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default categorySlice.reducer;
