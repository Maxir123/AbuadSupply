import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

const Loader = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require("../../../../public/animations/1700172454721.json"),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      
      {/* Glow background */}
      <div className="absolute w-72 h-72 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>

      {/* Lottie animation */}
      <div className="relative z-10">
        <Lottie options={defaultOptions} width={260} height={260} />
      </div>

      {/* Loading text */}
      <p className="mt-6 text-lg font-medium tracking-wide animate-pulse">
        Loading, please wait...
      </p>
    </div>
  );
};

export default Loader;