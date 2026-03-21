import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import VendorLogin from "@/components/vendor/VendorLogin";
import Loader from "@/components/vendor/layout/Loader";

const VendorLoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { vendorInfo } = useSelector((state) => state.vendors);

useEffect(() => {
  if (vendorInfo && vendorInfo._id) {
    router.replace("/vendor/dashboard");
  } else {
    // If there's no previous page to go back to (e.g., user refreshed or landed here directly)
    if (typeof window !== "undefined" && window.history.length <= 1) {
      router.replace("/"); // Send them to homepage instead of trapping
    } else {
      setLoading(false); // Show login
    }
  }
}, [vendorInfo, router]);

  if (loading) {
    return <Loader />; 
  }

  return (
    <div>
      <VendorLogin />
    </div>
  );
};

export default VendorLoginPage;
