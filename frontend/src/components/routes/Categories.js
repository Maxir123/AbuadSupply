import React from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/solid";
import Image from "next/image";

const Categories = ({ categories = [] }) => {
  const fallbackImage = "/images/category-placeholder.png";

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Find exactly what you're looking for
            </p>
          </div>
          <Link 
            href="/categories" 
            className="group flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All Categories
            <ChevronRightIcon className="ml-1 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Scrollable Container */}
        <div className="relative overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex flex-nowrap gap-6 md:gap-10">
            {categories.map((category) => (
              <Link 
                key={category._id} 
                href={`/category/${category.slug}`}
                className="group flex flex-col items-center flex-shrink-0 w-24 md:w-32"
              >
                {/* Image Wrapper */}
                <div className="relative w-20 h-20 md:w-28 md:h-28 mb-4">
                  {/* Decorative Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 scale-110 opacity-0 group-hover:opacity-100" />
                  
                  {/* Main Image Container */}
                  <div className="w-full h-full rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
                    <div className="relative w-12 h-12 md:w-16 md:h-16 transform group-hover:scale-110 transition-transform duration-500">
                      <Image
                        src={category.imageUrl || fallbackImage}
                        alt={category.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Label */}
                <p className="text-sm md:text-base font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-center truncate w-full">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;