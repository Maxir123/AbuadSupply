// lib/withAdminAuth.js
import React, { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";
// optional: npm i hoist-non-react-statics
import hoistNonReactStatics from "hoist-non-react-statics";

const withAdminAuth = (Wrapped) => {
  const WrappedName = Wrapped.displayName || Wrapped.name || "Component";

  const WithAdminAuth = (props) => {
    const [ok, setOk] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      let alive = true;
      (async () => {
        try {
          await axios.get("/api/admin/profile", { withCredentials: true });
          if (alive) { setOk(true); setChecking(false); }
        } catch {
          try { localStorage.removeItem("adminInfo"); } catch {}
          try { sessionStorage.removeItem("adminInfo"); } catch {}
          if (!alive) return;
          setChecking(false);
          window.location.replace("/auth/login?reason=expired");
        }
      })();
      return () => { alive = false; };
    }, []);

    if (checking) return <div className="p-6 text-center">Checking session…</div>;
    if (!ok) return null;
    return <Wrapped {...props} />;
  };

  WithAdminAuth.displayName = `withAdminAuth(${WrappedName})`;
  hoistNonReactStatics(WithAdminAuth, Wrapped);
  return WithAdminAuth;
};

export default withAdminAuth;


// // src/lib/withVendorAuth.js
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";

// const withVendorAuth = (Wrapped) => {
//   const WrappedName = Wrapped.displayName || Wrapped.name || "Component";

//   const WithVendorAuth = (props) => {
//     const router = useRouter();
//     const { vendorInfo } = useSelector((state) => state.vendors);
//     const [ok, setOk] = useState(false);
//     const [checking, setChecking] = useState(true);

//     useEffect(() => {
//       // Only runs on client
//       if (!vendorInfo || !vendorInfo.email) {
//         setChecking(false);
//         router.replace("/vendor/login?reason=required");
//         return;
//       }
//       if (vendorInfo.isBlocked) {
//         toast.error("Your vendor account is deactivated.");
//         setChecking(false);
//         router.replace("/vendor/login?reason=deactivated");
//         return;
//       }
//       setOk(true);
//       setChecking(false);
//     }, [vendorInfo, router]);

//     if (checking) return null;       // or a small loader if you prefer
//     if (!ok) return null;

//     return <Wrapped {...props} />;
//   };

//   WithVendorAuth.displayName = `withVendorAuth(${WrappedName})`;
//   return WithVendorAuth;
// };

// export default withVendorAuth;
