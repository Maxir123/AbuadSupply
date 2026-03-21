// src/redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Function to check if we are in the browser environment
const isBrowser = () => typeof window !== "undefined";

// Function to get cartItems from localStorage
const getCartItemsFromStorage = () => {
  if (isBrowser()) {
    const cartItems = localStorage.getItem("cartItems");
    return cartItems ? JSON.parse(cartItems) : [];
  }
  return [];
};

// fetch cart items 
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/cart");
      // Adjust if your API wraps the items differently
      return  data?.cartItems ?? res.data ?? [];
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch cart items";
      return rejectWithValue(msg);
    }
  }
);
// Async thunk to save cart items to the server
export const saveCartItems = createAsyncThunk(
  "cart/saveCartItems",
  async (cartItems, { rejectWithValue }) => {
try {
      // If your API expects { items: [...] }, change to: { items: cartItems }
      const {data} = await axios.post("/api/cart", cartItems, {
        headers: { "Content-Type": "application/json" },
      });
      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save cart items";
      return rejectWithValue(msg);
    }
  }
);

const initialState = {
  cartItems: getCartItemsFromStorage() || [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const item = action.payload;
      const isItemExist = state.cartItems.find((i) => i._id === item._id);
      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i._id === isItemExist._id ? item : i
        );
      } else {
        state.cartItems.push(item);
      }
      if (isBrowser()) {
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i._id !== action.payload);
      if (isBrowser()) {
        if (state.cartItems.length === 0) {
          localStorage.removeItem("cartItems"); // Clear localStorage when empty
        } else {
          localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        }
      }
      state.cartItems = [...state.cartItems]; // Force update
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCartItems
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
        if (isBrowser()) {
          localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        }
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle saveCartItems
      .addCase(saveCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCartItems.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addItemToCart, removeItemFromCart } = cartSlice.actions;

export default cartSlice.reducer;
