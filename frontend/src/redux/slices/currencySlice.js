import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

// Async Thunk: Fetch exchange rates from USD
export const fetchExchangeRates = createAsyncThunk(
  "currency/fetchExchangeRates",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("https://open.er-api.com/v6/latest/USD");
      return data.rates;
    } catch (error) {
      return rejectWithValue("Failed to fetch exchange rates");
    }
  }
);

// Async thunk to fetch exchange rates
export const getExchangeRates = createAsyncThunk(
  "currency/getExchangeRates",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("https://api.exchangerate-api.com/v4/latest/USD", {
         withCredentials: false,
      });
      return data.rates;
    } catch (error) {
      return rejectWithValue("Failed to fetch exchange rates");
    }
  }
);


const initialState = {
  code: "USD",               // Currency code (e.g., EUR)
  symbol: "$",               // Currency symbol (e.g., €)
  label: "USD $",            // UI label
  rates: {},                 // Exchange rates map { EUR: 0.91, GBP: 0.78, ... }
  isLoading: false,
  error: null,
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      const { code, symbol, label } = action.payload;
      state.code = code;
      state.symbol = symbol;
      state.label = label;
    },
    resetCurrency: (state) => {
      state.code = "USD";
      state.symbol = "$";
      state.label = "USD $";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rates = action.payload;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getExchangeRates.fulfilled, (state, action) => {
        state.rates = action.payload;
      })
      .addCase(getExchangeRates.rejected, (state, action) => {
        console.error(action.payload);
      });
  },
});

export const { setCurrency, resetCurrency } = currencySlice.actions;
export default currencySlice.reducer;
