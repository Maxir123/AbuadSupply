// src/lib/withUserAuth.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const withUserAuth = (WrappedComponent) => {
  const WrappedName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  const WithUserAuth = (props) => {
    const router = useRouter();
    const { userInfo } = useSelector((state) => state.user);
    const [isClient, setIsClient] = useState(false);

    // avoid hydration mismatch
    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (!isClient) return;
      if (!userInfo || !userInfo.email) {
        router.replace("/user/login");
      }
    }, [isClient, userInfo, router]); // <-- include userInfo

    if (!isClient) return null;
    return userInfo && userInfo.email ? <WrappedComponent {...props} /> : null;
  };

  WithUserAuth.displayName = `withUserAuth(${WrappedName})`;
  return WithUserAuth;
};

export default withUserAuth;
