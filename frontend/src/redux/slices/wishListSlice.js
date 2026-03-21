// // wishListSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper function to check if we are in the browser environment
const isBrowser = () => typeof window !== "undefined";

// Helper function to get wishListItems from localStorage
const getWishListItemsFromStorage = () => {
  if (isBrowser()) {
    const wishListItems = localStorage.getItem("wishListItems");
    return wishListItems ? JSON.parse(wishListItems) : [];
  }
  return [];
};

// Async thunk for adding item to wishlist
export const addItemToWishList = createAsyncThunk(
  "wishList/addItemToWishList",
  async (data, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const wishListItems = state.wishList.wishListItems;
      const isItemExist = wishListItems.find((i) => i._id === data._id);

      if (!isItemExist) {
        const updatedWishListItems = [...wishListItems, data];
        if (typeof window !== "undefined") {
          localStorage.setItem("wishListItems", JSON.stringify(updatedWishListItems));
        }
        return data;
      }
      return rejectWithValue("Item already in wishlist");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for removing item from wishlist
export const removeItemFromWishList = createAsyncThunk(
  "wishList/removeItemFromWishList",
  async (data, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const updatedWishListItems = state.wishList.wishListItems.filter((i) => i._id !== data._id);
      if (typeof window !== "undefined") {
        localStorage.setItem("wishListItems", JSON.stringify(updatedWishListItems));
      }
      return data._id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  wishListItems: getWishListItemsFromStorage(),
  isLoading: false,
  error: null,
  success: false,
};

const wishListSlice = createSlice({
  name: "wishList",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add item to wishlist
      .addCase(addItemToWishList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addItemToWishList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishListItems.push(action.payload);
        state.success = true;
      })
      .addCase(addItemToWishList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Remove item from wishlist
      .addCase(removeItemFromWishList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeItemFromWishList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishListItems = state.wishListItems.filter((i) => i._id !== action.payload);
        state.success = true;
      })
      .addCase(removeItemFromWishList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearErrors, clearSuccess } = wishListSlice.actions;
export default wishListSlice.reducer;
