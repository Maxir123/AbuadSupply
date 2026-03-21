import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '@/utils/axiosInstance';

// Initial state
const initialState = {
  orders: [],
  singleOrder: null,
  isLoading: false,
  error: null,
};


// 🔹 Create Order 
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/orders", orderData, { withCredentials: true });
      console.log("RESPONSE:", response.data.orders)
      return response.data; // Return multiple orders
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Order creation failed.");
    }
  }
);

// Fetch orders for vendor
export const fetchVendorOrders = createAsyncThunk(
  "orders/fetchVendorOrders",
  async (vendorId, { rejectWithValue }) => {
      try {
          const response = await axiosInstance.get(`/api/orders/vendor-orders/${vendorId}`);
          return response.data.orders;
      } catch (error) {
          return rejectWithValue(error.response?.data?.message || "Error fetching orders");
      }
  }
);

// Update order status (vendor can only update their own orders)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status, vendorId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/orders/update-status/${orderId}`, { status, vendorId }, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update order status.");
    }
  }
);


// Fetch single order (vendor)
export const fetchSingleOrder = createAsyncThunk(
  "orders/fetchSingleOrder",
  async (orderId, { rejectWithValue }) => {
    console.log("Fetching order with ID:", orderId);
    try {
      const response = await axiosInstance.get(`/api/orders/${orderId}`);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details."
      );
    }
  }
);
// Fetch single order (user)
export const fetchMyOrder = createAsyncThunk(
  "orders/fetchMyOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/orders/my/${orderId}`);
      return data.order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch order details."
      );
    }
  }
);

// Delete order (vendor can only delete their own orders)
export const deleteOrder = createAsyncThunk("orders/deleteOrder", async ({ orderId, vendorId }, { rejectWithValue }) => {
  try {
    console.log("Deleting order:", orderId, "for vendor:", vendorId);
    const { data } = await axiosInstance.delete(`/api/orders/${orderId}`, { data: { vendorId } });
    console.log("Delete response:", data);
    return { orderId, message: data.message };
  } catch (error) {
    console.error("Delete error:", error);
    return rejectWithValue(error.response?.data || "Failed to delete order");
  }
});

// Fetch user orders
export const getUserAllOrders = createAsyncThunk(
  "orders/getUserAllOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/orders/user-orders/${userId}`, {
        withCredentials: true,
      });
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching user orders.");
    }
  }
);

// Refund Order Request
export const refundOrderRequest = createAsyncThunk(
  "orders/refundOrderRequest",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/orders/refund/${orderId}`, { status });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Refund request failed");
    }
  }
);
// Fetch refunded orders
export const fetchVendorRefundedOrders = createAsyncThunk(
  "orders/fetchVendorRefundedOrders",
  async (vendorId, { rejectWithValue }) => {
    try {
      const { data }= await axiosInstance.get(`/api/orders/vendor-refunds/${vendorId}`);
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch refunded orders");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.push(action.payload.orders);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch vendor orders
      .addCase(fetchVendorOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVendorOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchVendorOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.order; 
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })      
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single order
      .addCase(fetchSingleOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSingleOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleOrder = action.payload;  
      })
      .addCase(fetchSingleOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleOrder = action.payload;
      })
      .addCase(fetchMyOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload.orderId
        );
      })
       // Fetch user orders
       .addCase(getUserAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getUserAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Refund Order Request
      .addCase(refundOrderRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refundOrderRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.order;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(refundOrderRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch refunded orders
      .addCase(fetchVendorRefundedOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVendorRefundedOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchVendorRefundedOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

// Reducer
export default orderSlice.reducer;
