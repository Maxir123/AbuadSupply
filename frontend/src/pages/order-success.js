import React, { useEffect } from 'react';
import Lottie from 'react-lottie';
import animationData from '../../public/animations/24151-ecommerce-animation.json'; // Import animation file
import { useRouter } from 'next/router';
import Link from 'next/link';

const OrderSuccess = () => {
  const router = useRouter(); 

  // Lottie options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/user/orders');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]); 


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <Lottie options={defaultOptions} height={400} width={400} />
      </div>

      <div className="text-center max-w-lg w-full">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Your order was placed successfully!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for your purchase. You will receive an email with your order details shortly.
        </p>
        <Link href="/" passHref>
          <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
