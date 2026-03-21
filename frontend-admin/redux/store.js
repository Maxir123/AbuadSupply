import { configureStore } from '@reduxjs/toolkit';
import adminReducer from "./adminSlice";
import categoryReducer from './categorySlice';
import brandReducer from './brandSlice';
import siteSettingsReducer from './siteSettingsSlice';

import { createWrapper } from 'next-redux-wrapper';

export function makeStore(preloadedState) {
  return configureStore({
    reducer: {
      admin: adminReducer,
      categories: categoryReducer,
      brands: brandReducer, 
      settings: siteSettingsReducer,
    },
    preloadedState, // For server-side rendering
  });
}

export const wrapper = createWrapper(makeStore, { debug: false });

