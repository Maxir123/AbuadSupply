import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import vendorReducer from './slices/vendorSlice';
import cartReducer from './slices/cartSlice';
import wishListReducer from './slices/wishListSlice';
import orderReducer from './slices/orderSlice';
import saleReducer from './slices/saleSlice';
import categoryReducer from './slices/categorySlice';
import brandReducer from './slices/brandSlice';
import couponReducer from './slices/couponSlice';
import checkoutReducer from './slices/checkoutSlice';
import currencyReducer from './slices/currencySlice';
import siteSettingsReducer from './slices/siteSettingsSlice';

import { createWrapper } from 'next-redux-wrapper';

export function makeStore(preloadedState) {
  return configureStore({
    reducer: {
      products: productReducer,
      user: userReducer,
      vendors: vendorReducer,
      cart: cartReducer,
      wishList: wishListReducer,
      orders: orderReducer,
      sales: saleReducer,
      categories: categoryReducer,
      brands: brandReducer, 
      coupons: couponReducer, 
      checkout: checkoutReducer,
      currency: currencyReducer,
      settings: siteSettingsReducer,
    },
    preloadedState, // For server-side rendering
  });
}

export const wrapper = createWrapper(makeStore, { debug: false });

