import React, { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ProductCard from "@/components/product/ProductCard";
import CountdownTimer from "@/components/ui/CountdownTimer"; // adjust path as needed

const Sale = ({ sales }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Filter only active sales
  const now = new Date();
  const activeSales = sales?.filter(
    ({ saleStart, saleEnd }) =>
      now >= new Date(saleStart) && now <= new Date(saleEnd)
  );

  // If no active sales, you might want to return null or a placeholder
  if (!activeSales || activeSales.length === 0) return null;

  // For demo purposes, we use the first active sale's end date for the countdown
  // You could also use a fixed end date from props
  const saleEndDate = activeSales[0]?.saleEnd;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Flash Deal Card */}
          <div className="lg:w-1/3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg overflow-hidden h-full">
              <div className="p-6 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  FLASH DEAL
                </h2>
                <p className="text-blue-100 text-lg mb-6">
                  Hurry! Offer ends soon. Grab your favorites before they're gone.
                </p>

                {/* Countdown Timer */}
                {saleEndDate && (
                  <div className="mb-6">
                    <CountdownTimer
                      endDate={saleEndDate}
                      bgColor="bg-white/20"
                      textColor="text-white"
                      textSize="text-2xl"
                      showLabels={true}
                      className="justify-center"
                    />
                  </div>
                )}

                {/* Progress Bar (example: sold items) */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sold: 68%</span>
                    <span>Limited stock</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: "68%" }}
                    />
                  </div>
                </div>

                {/* Optional CTA */}
                <button className="mt-6 w-full bg-white text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Shop Now
                </button>
              </div>
            </div>
          </div>

          {/* Products Carousel */}
          <div className="lg:w-2/3 relative">
            {/* Left Arrow */}
            <button
              onClick={scrollLeft}
              className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Scroll left"
            >
              <FaArrowLeft className="text-gray-600 w-4 h-4" />
            </button>

            {/* Products Container */}
            <div
              ref={scrollRef}
              className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
            >
              {activeSales.map((product) => (
                <div
                  key={product._id}
                  className="flex-shrink-0 w-[220px] sm:w-[240px] md:w-[260px]"
                >
                  <ProductCard
                    product={product}
                    isSale={true}
                    saleEndDate={product.saleEnd}
                  />
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
      </div>

      {/* Hide scrollbar */}
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

export default Sale;