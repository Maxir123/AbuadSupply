import React, { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Loader from "../vendor/layout/Loader";
import ProductCard from "../product/ProductCard";

const BestSellers = ({ products, isLoading, error }) => {
  const scrollRef = useRef(null);

  // Filter and sort best‑selling products (sales > 100)
  const bestSellers =
    products?.length > 0
      ? products
          .filter((product) => product.sales > 100)
          .sort((a, b) => b.sales - a.sales)
      : [];

  // Scroll handlers
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Loading & error states
  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        Error: {error}
      </div>
    );
  if (!products || products.length === 0)
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        No products found.
      </div>
    );
  if (bestSellers.length === 0)
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        No best‑selling products available.
      </div>
    );

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Best Selling Products
          </h2>
          {/* Optional "View All" link – can be added if needed */}
          {/* <Link href="/best-sellers" className="text-blue-600 hover:text-blue-800 font-medium">
            View All
          </Link> */}
        </div>

        {/* Carousel wrapper */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Scroll left"
          >
            <FaArrowLeft className="text-gray-600 w-4 h-4" />
          </button>

          {/* Products container – horizontal scroll */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
          >
            {bestSellers.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 w-[220px] sm:w-[240px] md:w-[260px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Scroll right"
          >
            <FaArrowRight className="text-gray-600 w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hide scrollbar (add to global CSS if preferred) */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default BestSellers;