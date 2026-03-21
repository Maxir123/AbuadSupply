import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const Checkout = () => {
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.user); 

  useEffect(() => {
    if (userInfo) {
      router.replace("/checkout/shipping-address"); 
    } else {
      router.replace("/user/login"); 
    }
  }, [userInfo, router]);

  return null; 
};

export default Checkout;
