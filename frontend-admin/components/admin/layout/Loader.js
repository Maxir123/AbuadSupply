
import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

// Dynamically import the Lottie component with SSR disabled
const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

const Loader = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; 
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require('../../../public/animations/1700172454721.json'), 
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Lottie options={defaultOptions} width={300} height={300} />
    </div>
  );
};

export default Loader;
