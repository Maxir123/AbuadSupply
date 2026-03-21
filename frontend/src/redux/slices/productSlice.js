import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';


// Async thunks
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (newForm, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      const { data } = await axiosInstance.post('/api/products/create-product', newForm, config);
      return data;
    } catch (error) {
      console.log("error.response.data:", error.response.data.message)
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/products`);
      return data.products;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

//CHANFE TO FETCH
export const vendorGetAllProducts = createAsyncThunk(
  'products/vendorGetAllProducts',
  async (vendorId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/products/${vendorId}/products`);
      return data.products; 
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchProductsBySubSubCategory = createAsyncThunk(
  'products/fetchProductsBySubSubCategory',
  async ({ subSubCategory }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/products?subSubCategory=${subSubCategory}`);
      
      return response.data.products;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const vendorDeleteProduct = createAsyncThunk(
  'products/vendorDeleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/api/products/${id}`, { withCredentials: true });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const vendorUpdateProduct = createAsyncThunk(
  'products/vendorUpdateProduct',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/products/update-product/${payload.id}`,
        payload, 
        { withCredentials: true }
      );
      return data;  
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const fetchVendorSingleProduct = createAsyncThunk(
  "products/fetchVendorSingleProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/products/vendor/product/${productId}`, {
        withCredentials: true,
      });
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product");
    }
  }
);

export const createProductReview = createAsyncThunk(
  'products/createProductReview',
  async ({ user, rating, comment, productId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/products/reviews",
        { user, rating, comment, productId },
        { withCredentials: true }
      );
      console.log("data message:", data.message)
      return { message: data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "An unexpected error occurred.");
    }
  }
);



const productSlice = createSlice({
  name: 'products',
  initialState: {
    isLoading: true,
    vendorProducts: [],
    product: null,
    similarProducts: [],
    allProducts: [], 
    latestProducts: [], 
    message: null,
    successMessage: null,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.successMessage = null;
    },
    clearProducts: (state) => {
      state.similarProducts = []; 
    },
  },
  extraReducers: (builder) => {
    builder
        // Handle creat product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle vendor Delete Product
      .addCase(vendorDeleteProduct.fulfilled, (state, action) => {
        state.vendorProducts = state.vendorProducts.filter(
          (product) => product._id !== action.payload
        );
        state.successMessage = "Product deleted successfully!";
      })
      .addCase(vendorDeleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Handle update product
      .addCase(vendorUpdateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(vendorUpdateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProduct = action.payload;
        state.vendorProducts = state.vendorProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        );
        state.successMessage = 'Product updated successfully!';
      })      
      .addCase(vendorUpdateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle get all products
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allProducts = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      })
      // // Handle get product by ID
      // .addCase(getProductById.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(getProductById.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.product = action.payload;
      // })
      // .addCase(getProductById.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload;
      // })
      // Handle Get all vendor products
      .addCase(vendorGetAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(vendorGetAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorProducts = action.payload;
      })      
      .addCase(vendorGetAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Products by Sub-Subcategory
      .addCase(fetchProductsBySubSubCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductsBySubSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchProductsBySubSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle  products review
      .addCase(createProductReview.pending, (state) => {
        state.isLoading = true;
        state.error = null; 
      })
      .addCase(createProductReview.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "An error occurred while submitting the review.";
      })
      .addCase(fetchVendorSingleProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVendorSingleProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(fetchVendorSingleProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      

  },
});

export const { clearErrors, clearMessages, clearProducts } = productSlice.actions;

export default productSlice.reducer;
