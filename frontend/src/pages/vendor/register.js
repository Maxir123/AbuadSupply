import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import VendorRegister from "@/components/vendor/VendorRegister";
import Loader from "@/components/vendor/layout/Loader";

const VendorRegisterPage = () => {
const router = useRouter();
const [loading, setLoading] = useState(true);

const { vendorInfo } = useSelector((state) => state.vendors);

useEffect(() => {
  if (vendorInfo && vendorInfo._id) {
    router.replace("/vendor/dashboard");
  } else {
    setLoading(false);
  }
}, [vendorInfo, router]);

if (loading) {
  return <Loader />; 
}

  return (
    <div>
      <VendorRegister />
    </div>
  );
};

export default VendorRegisterPage;
