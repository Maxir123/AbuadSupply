import Link from "next/link";
import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/solid";

const Brands = ({ brands = [] }) => {
  if (!brands.length) return null;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Brands
          </h2>
          <Link
            href="/brands"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View All
            <ChevronRightIcon className="ml-1 h-5 w-5" />
          </Link>
        </div>

        {/* Horizontal scrollable brand list */}
        <div className="relative">
          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/brand/${brand.slug || brand._id}`}
                className="group flex-shrink-0 block w-24 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-gray-200 group-hover:border-blue-400 flex items-center justify-center p-3 shadow-sm group-hover:shadow-md transition-all duration-300 mx-auto">
                  <Image
                    src={brand.logo || "/images/brand-placeholder.png"}
                    alt={brand.name || "Brand logo"}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain rounded-full"
                    sizes="96px"
                  />
                </div>
                {/* Brand name (if available) */}
                {brand.name && (
                  <p className="mt-3 text-sm font-medium text-gray-700 group-hover:text-blue-600 truncate">
                    {brand.name}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar globally (can also be placed in global CSS) */}
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

export default Brands;