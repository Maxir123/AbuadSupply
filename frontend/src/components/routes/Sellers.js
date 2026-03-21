import Image from "next/image";
import Link from "next/link";

const TopSellers = ({ vendors = [] }) => {
  const bannerSrc = "/images/store.png";
  const backupLogo = "/images/store-backup.png";

  // Only take the top 5 vendors
  const topVendors = vendors.slice(0, 5);

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Top Sellers
            </h2>
            <Link
              href="/vendors"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              View All
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Horizontal scroll container */}
          <div className="relative">
            <div className="flex overflow-x-auto space-x-5 pb-4 scrollbar-hide">
              {topVendors.map((seller, index) => (
                <Link
                  href={`/vendor/dashboard/${seller._id}`}
                  key={seller._id}
                  className="group block flex-shrink-0 w-[280px] sm:w-[300px]"
                >
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* Banner with gradient overlay */}
                    <div className="relative h-28 bg-gray-200">
                      <Image
                        src={bannerSrc}
                        alt={`${seller.name} banner`}
                        fill
                        sizes="(max-width: 640px) 280px, 300px"
                        className="object-cover"
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                      {/* Avatar - positioned overlapping banner and card */}
                      <div className="absolute -bottom-10 left-4">
                        <div className="w-20 h-20 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                          <Image
                            src={seller.avatar?.url || backupLogo}
                            alt={`${seller.name} logo`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-12 pb-5 px-4">
                      <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {seller.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center justify-center mt-1 text-sm">
                        <span className="text-gray-700 font-medium">
                          {seller.rating}
                        </span>
                        <div className="flex items-center ml-1 text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(seller.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-gray-500 ml-1">
                          ({seller.reviews})
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 text-sm">
                        <div className="text-center">
                          <p className="font-bold text-gray-900">
                            {seller.reviews}
                          </p>
                          <p className="text-gray-500">Reviews</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-gray-900">
                            {seller.products}
                          </p>
                          <p className="text-gray-500">Products</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* Optional fade edges for scroll hint - can add with pseudo-elements if needed */}
          </div>
        </div>
      </div>

      {/* Hide scrollbar globally for this component (add to your global CSS if you prefer) */}
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

export default TopSellers;