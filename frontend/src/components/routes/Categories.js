// components/DashboardSections.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// ---------- Categories (now a horizontal scroll on mobile, but artistic) ----------
const CategoriesRow = ({ categories = [] }) => {
  const fallbackImage = "/images/category-placeholder.png";
  const displayCategories = categories.slice(0, 6);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">Collections</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">Shop by<br />Category</h2>
        </div>
        <Link href="/categories" className="text-sm font-medium text-gray-400 hover:text-indigo-500 transition flex items-center gap-1">
          Explore all
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory">
        {displayCategories.map((category) => (
          <Link
            key={category._id}
            href={`/category/${category.slug}`}
            className="group flex flex-col items-center flex-shrink-0 w-24 snap-start"
          >
            <div className="relative w-20 h-20 rounded-2xl bg-gray-100 border-2 border-transparent group-hover:border-indigo-400 transition-all duration-300 flex items-center justify-center shadow-md group-hover:shadow-xl">
              <div className="relative w-12 h-12">
                <Image
                  src={category.imageUrl || fallbackImage}
                  alt={category.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-600 mt-2 group-hover:text-indigo-600 transition-colors">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

// ---------- Deal of the Day – large hero card with countdown style ----------
const DealHero = ({ product }) => {
  if (!product) return <div className="text-gray-400 text-center py-12">No active deal</div>;

  return (
    <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl group">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-orange-500/20 to-red-600/20 mix-blend-overlay"></div>
      <div className="relative z-10 p-6 md:p-8">
        <div className="inline-block bg-white/10 backdrop-blur rounded-full px-3 py-1 text-xs font-semibold text-white mb-4">
          🔥 Limited Offer
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight max-w-xs">
          Deal of the Day
        </h3>
        <div className="relative h-40 md:h-48 w-full my-4">
          <Image
            src={product.images?.[0] || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>
        <p className="text-white/90 text-sm font-medium line-clamp-2">{product.name}</p>
        <div className="flex items-baseline gap-3 mt-3">
          <span className="text-3xl font-black text-white">${product.price}</span>
          {product.oldPrice && (
            <span className="text-lg line-through text-white/50">${product.oldPrice}</span>
          )}
          <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded-full">
            -{product.discount}%
          </span>
        </div>
        <Link
          href={`/product/${product.slug}`}
          className="mt-5 block w-full bg-white text-black text-center py-3 rounded-xl font-bold hover:bg-gray-100 transition transform hover:scale-[1.02]"
        >
          Grab Deal
        </Link>
      </div>
    </div>
  );
};

// ---------- Best Sellers – vertical ranking list with numbers ----------
const BestSellersRanking = ({ products = [] }) => {
  const bestSellers = products
    .filter(p => p.sales > 100)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 3);

  if (bestSellers.length === 0) return <div className="text-gray-400 text-center py-12">No best sellers</div>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-3xl">🏆</span>
        <h3 className="text-xl font-black text-gray-900">Best Sellers</h3>
      </div>
      <div className="space-y-3">
        {bestSellers.map((product, idx) => (
          <Link
            key={product._id}
            href={`/product/${product.slug}`}
            className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition group"
          >
            <div className="text-2xl font-black text-gray-300 w-8">{idx + 1}</div>
            <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-sm">
              <Image
                src={product.images?.[0] || "/images/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 truncate group-hover:text-indigo-600">{product.name}</p>
              <p className="text-sm font-bold text-gray-900">${product.price}</p>
            </div>
            <div className="text-sm font-black text-green-600">{product.sales} sold</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// ---------- Newest Arrival – minimalist card with large image ----------
const NewestSpotlight = ({ product }) => {
  if (!product) return <div className="text-gray-400 text-center py-12">No new arrivals</div>;

  return (
    <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl overflow-hidden shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-500 font-semibold">Just dropped</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">New Arrival</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
        </div>
        <div className="relative h-40 w-full my-4">
          <Image
            src={product.images?.[0] || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-contain drop-shadow-lg"
          />
        </div>
        <p className="font-bold text-gray-800 line-clamp-2">{product.name}</p>
        <div className="mt-2">
          <span className="text-2xl font-black text-gray-900">${product.price}</span>
          {product.oldPrice && (
            <span className="ml-2 text-sm line-through text-gray-400">${product.oldPrice}</span>
          )}
        </div>
        <Link
          href={`/product/${product.slug}`}
          className="mt-5 block text-center border-2 border-indigo-600 text-indigo-600 py-2 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition"
        >
          Discover
        </Link>
      </div>
    </div>
  );
};

// ---------- MAIN COMPONENT – bold asymmetric layout ----------
const DashboardSections = ({
  categories = [],
  dealProduct,
  bestSellersProducts = [],
  newestProduct,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-5 py-12">
      {/* Asymmetric grid: different spans per breakpoint */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column – spans 2 on tablet/laptop, contains Categories + Best Sellers */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <CategoriesRow categories={categories} />
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <BestSellersRanking products={bestSellersProducts} />
          </div>
        </div>

        {/* Right column – Deal and Newest stacked */}
        <div className="space-y-8">
          <DealHero product={dealProduct} />
          <NewestSpotlight product={newestProduct} />
        </div>
      </div>
    </div>
  );
};
export default DashboardSections;