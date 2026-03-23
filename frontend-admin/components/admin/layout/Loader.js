import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

const Loader = ({ text = "Loading..." }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require("../../../public/animations/1700172454721.json"),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Animation */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <Lottie options={defaultOptions} width={180} height={180} />
      </div>

      {/* Text */}
      <p className="mt-4 text-sm text-gray-600 font-medium animate-pulse">
        {text}
      </p>

      {/* Optional subtle dots */}
      <div className="flex gap-1 mt-2">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
      </div>
    </div>
  );
};

export default Loader;