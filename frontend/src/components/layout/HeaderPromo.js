import React from "react";
import { FaTruck, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const HeaderPromo = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#FF7A18] via-[#FF3B3B] to-[#22C55E] text-white shadow-md hover:shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 px-3 sm:px-4 md:px-6 py-2 text-xs sm:text-sm md:text-base font-medium">

        {/* Left Section */}
        <div className="flex items-center gap-2 min-w-0">
          <FaTruck className="text-sm sm:text-base md:text-lg animate-pulse flex-shrink-0" />
          <span className="truncate">
            <span className="font-semibold sm:font-bold">FREE delivery</span>
            <span className="hidden sm:inline"> on campus</span>
          </span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

          {/* Limited badge */}
          <span className="hidden md:inline bg-white text-[#FF3B3B] px-2 py-[2px] rounded-full text-[10px] md:text-xs font-semibold whitespace-nowrap">
            Limited time
          </span>

          {/* CTA */}
          <Link
            href="/products"
            className="flex items-center gap-1 group whitespace-nowrap"
          >
            <span className="hidden sm:inline">Shop now</span>
            <FaArrowRight className="text-xs sm:text-sm group-hover:translate-x-1 transition-transform duration-200" />
          </Link>

        </div>

      </div>
    </div>
  );
};

export default HeaderPromo;