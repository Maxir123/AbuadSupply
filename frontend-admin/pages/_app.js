import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toast 
import '../styles/globals.css'; // Tailwind CSS
import { wrapper } from '@/redux/store';


function MyApp({ Component, pageProps }) {
  const { store } = wrapper.useWrappedStore(pageProps); // Correct Redux wrapper

  return (
      <Provider store={store}>
        <Component {...pageProps} />
        <ToastContainer />
      </Provider>
  );
}

export default MyApp;
