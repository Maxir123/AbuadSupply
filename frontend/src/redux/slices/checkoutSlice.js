// checkout slice
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  shippingAddress: 
    typeof window !== "undefined" && localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : null,
  paymentMethod: 
    typeof window !== "undefined" && localStorage.getItem("paymentMethod")
      ? localStorage.getItem("paymentMethod")
      : "",
  orderItems: 
    typeof window !== "undefined" && localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
};


const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("paymentMethod", action.payload);
    },
    setOrderItems: (state, action) => {
      state.orderItems = action.payload;
      localStorage.setItem("cartItems", JSON.stringify(action.payload));
    },
    resetCheckout: (state) => {
      state.shippingAddress = null;
      state.paymentMethod = "";
      state.orderItems = [];

      localStorage.removeItem("paymentMethod");
      localStorage.removeItem("cartItems");
    },
  },
});

export const { setShippingAddress, setPaymentMethod, setOrderItems, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
