import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Loader from "@/components/admin/layout/Loader"; 
import Login from "./auth/login";

const Index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { adminInfo } = useSelector((state) => state.admin);

  useEffect(() => {
    if (adminInfo && adminInfo._id) {
      router.replace("/dashboard");
    } else {
      setLoading(false);
    }
  }, [adminInfo, router]);

  if (loading) {
    return <Loader />; 
  }

  return <Login />;
};

export default Index;
