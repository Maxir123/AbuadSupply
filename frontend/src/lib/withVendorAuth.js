// lib/withVendorAuth.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "@/utils/axiosInstance";

const withVendorAuth = (Wrapped) => {
  const WrappedName = Wrapped.displayName || Wrapped.name || "Component";

  const WithVendorAuth = (props) => {
    const router = useRouter();
    const { vendorInfo } = useSelector((state) => state.vendors);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      let alive = true;

      // 1) No client cache? go login
      if (!vendorInfo?.email) {
        router.replace("/vendor/login?reason=required");
        setChecking(false);
        return;
      }

      // 2) Soft-verify the cookie with the server (once)
      (async () => {
        try {
          await axios.get("/api/vendors/profile", { withCredentials: true });
          if (alive) setChecking(false);
        } catch {
          // cookie expired → interceptor will redirect; we just stop rendering
          if (alive) setChecking(false);
        }
      })();

      return () => { alive = false; };
    }, [vendorInfo?.email, router]);

    if (checking) return null;                  // or a tiny loader
    if (!vendorInfo?.email) return null;        // guarded above
    return <Wrapped {...props} />;
  };

  WithVendorAuth.displayName = `withVendorAuth(${WrappedName})`;
  return WithVendorAuth;
};

export default withVendorAuth;
