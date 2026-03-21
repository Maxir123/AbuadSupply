import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

// Async thunks
export const createSale = createAsyncThunk(
  "sales/createSale",
  async (newForm, { rejectWithValue }) => {
    console.log("FORM:", newForm)
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      const { data } = await axiosInstance.post(
        '/api/sales/create-Sale',
        newForm,
        config
      );
      return data.Sale;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getAllSales = createAsyncThunk(
  "sales/getAllSales",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/sales`);
      return data.sales;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const vendorGetAllSales = createAsyncThunk(
  "sales/vendorGetAllSales",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/sales/vendor/${id}`);
      return data.sales;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getSingleSale = createAsyncThunk(
  "sales/getSingleSale",
  async (id, { rejectWithValue }) => {
    console.log(id)
    try {
      const { data } = await axiosInstance.get(`/api/sales/sale/${id}`); // Updated path
      console.log(data)
      return data.sale;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

//FOR VENDOR
export const vendorDeleteSale = createAsyncThunk(
  "sales/vendorDeleteSale",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/api/Sales/Sale/${id}`); // Updated path
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const vendorUpdateSale = createAsyncThunk(
  "sales/vendorUpdateSale",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/sales/sale/${id}`, updatedData);
      return data.sale;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchSingleSaleByVendor = createAsyncThunk(
  "sales/fetchSingleSaleByVendor",
  async (id, { rejectWithValue }) => {
    console.log("ID:", id)
    try {
      const { data } = await axiosInstance.get(`/api/sales/vendor-sale/${id}`);
      console.log("SALE DATA:", data)
      return data.sale;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


// Slice
const SaleSlice = createSlice({
  name: "Sales",
  initialState: {
    singleSale: null,
    sales: [],
    message: null,
    isLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createSale
    .addCase(createSale.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(createSale.fulfilled, (state, action) => {
      state.isLoading = false;
      state.singleSale = action.payload;
      state.success = true;
    })
    .addCase(createSale.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
      // vendorGetAllSales
      .addCase(vendorGetAllSales.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(vendorGetAllSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sales = action.payload;
      })
      .addCase(vendorGetAllSales.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // getSingleSale
      .addCase(getSingleSale.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleSale = action.payload;
      })
      .addCase(getSingleSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(vendorDeleteSale.fulfilled, (state, action) => {
        state.sales = state.sales.filter(
          (product) => product._id !== action.payload
        );
        state.message = action.payload.message;
      })
      .addCase(vendorDeleteSale.rejected, (state, action) => {
        state.error = action.payload;
      })
      // getAllSales
      .addCase(getAllSales.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sales = action.payload;
      })
      .addCase(getAllSales.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(vendorUpdateSale.fulfilled, (state, action) => {
        state.sales = state.sales.map((sale) =>
          sale._id === action.payload._id ? action.payload : sale
        );
        state.message = action.payload.message;
      })
      .addCase(vendorUpdateSale.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchSingleSaleByVendor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSingleSaleByVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleSale = action.payload;
      })
      .addCase(fetchSingleSaleByVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })      
      
  },
});

export const { clearErrors, clearMessages } = SaleSlice.actions;
export default SaleSlice.reducer;
