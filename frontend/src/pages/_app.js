
import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { wrapper } from "../redux/store";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { Inter } from "next/font/google";

import { fetchSiteSettings } from "@/redux/slices/siteSettingsSlice";
import MaintenancePage from "@/maintenance";
import Loader from "@/components/vendor/layout/Loader";

const inter = Inter({ subsets: ["latin"], display: "swap" });

function InnerApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  const router = useRouter();

const { siteSettings: settings, isLoading: loading, error } = useSelector(
  (state) => state.settings
);

  useEffect(() => {
    dispatch(fetchSiteSettings());
  }, [dispatch]);

  if (loading) return <Loader />; 
  if (error) return <Component {...pageProps} />; 

  const isMaintenance = !!settings?.advanced?.maintenanceMode;

  // If maintenance mode is ON and we’re not already on /maintenance,show the MaintenancePage
  if (isMaintenance && router.pathname !== "/maintenance") {
    return <MaintenancePage />;
  }

  return <Component {...pageProps} />;
}

function MyApp({ Component, pageProps }) {
  const { store } = wrapper.useWrappedStore(pageProps);

  return (
    <div className={inter.className}>
      <SessionProvider session={pageProps.session}>
        <Provider store={store}>
          <InnerApp Component={Component} pageProps={pageProps} />
          <ToastContainer />
        </Provider>
      </SessionProvider>
    </div>
  );
}

export default MyApp;

