import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import CountdownTimer from "../routes/sales/CountdownTimer";
import { useSelector } from "react-redux";

// Helper to format price with commas (e.g., 1,500.00)
const formatPrice = (amount) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ProductCard = ({
  product,
  isSale = false,
  saleEndDate,
  isMoreFromSeller = false,
}) => {
  const [sampleRating, setSampleRating] = useState(0);
  const { symbol, code, rates } = useSelector((state) => state.currency);

  const originalPrice = parseFloat(product?.originalPrice) || 0;
  const discountedPrice = parseFloat(product?.discountPrice) || 0;

  // Convert to selected currency
  const convertedOriginal =
    code === "USD" ? originalPrice : originalPrice * (rates[code] || 1);
  const convertedDiscount =
    code === "USD" ? discountedPrice : discountedPrice * (rates[code] || 1);

  useEffect(() => {
    setSampleRating(Math.random() * (5 - 3) + 3);
  }, []);

  const discountPercentage =
    originalPrice > 0
      ? (((originalPrice - discountedPrice) / originalPrice) * 100).toFixed(0)
      : 0;

  const imageUrl = product?.images?.[0]?.url;
  const productName = product?.name || "Unknown Product";
  const brandName = product?.brand || "Unknown Brand";

  // Rating stars (use product.rating or fallback to sampleRating)
  const rating = product?.rating || sampleRating;

  // Determine badge color based on mode
  const badgeColor = isSale ? "bg-red-500" : isMoreFromSeller ? "bg-green-500" : "bg-blue-500";

  if (isMoreFromSeller) {
    return (
      <Link href={`/product/${product._id}`} className="block group">
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
          <div className="flex p-3 gap-3">
            {/* Image */}
            <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={imageUrl || "/images/fallbackImage.jpg"}
                alt={productName}
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-gray-900 truncate pr-2">
                  {productName.length > 20
                    ? productName.slice(0, 20) + "…"
                    : productName}
                </h4>
                {discountPercentage > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {symbol}
                  {formatPrice(convertedDiscount)}
                </span>
                {originalPrice > discountedPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {symbol}
                    {formatPrice(convertedOriginal)}
                  </span>
                )}
              </div>

              {/* Optional small meta (e.g., sold count) can go here */}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (isSale) {
    return (
      <Link href={`/deals/${product._id}`} className="block group">
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-red-200 hover:border-red-300 overflow-hidden">
          <div className="p-3">
            {/* Image */}
            <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
              <Image
                src={imageUrl || "/images/fallbackImage.jpg"}
                alt={productName}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 50vw, 250px"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {productName.length > 15
                  ? productName.slice(0, 15) + "…"
                  : productName}
              </h4>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-red-600">
                  {symbol}
                  {formatPrice(convertedDiscount)}
                </span>
                {originalPrice > discountedPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {symbol}
                    {formatPrice(convertedOriginal)}
                  </span>
                )}
              </div>

              {saleEndDate && (
                <div className="mt-2">
                  <CountdownTimer
                    endDate={saleEndDate}
                    textColor="text-gray-700"
                    bgColor="bg-red-50"
                    textSize="text-sm"
                    showLabels={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default product card
  return (
    <Link href={`/product/${product._id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 overflow-hidden">
        {/* Image container */}
        <div className="relative w-full aspect-square bg-gray-50">
          <Image
            src={imageUrl || "/images/fallbackImage.jpg"}
            alt={productName}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 50vw, 250px"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Brand */}
          <p className="text-xs text-gray-500 mb-1">{brandName}</p>

          {/* Product name */}
          <h4 className="text-sm font-medium text-gray-900 truncate mb-2">
            {productName.length > 20
              ? productName.slice(0, 20) + "…"
              : productName}
          </h4>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.floor(rating)
                      ? "text-yellow-400"
                      : "text-gray-200"
                  }
                  size={14}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">{rating.toFixed(1)}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">
                {symbol}
                {formatPrice(convertedDiscount)}
              </span>
              {originalPrice > discountedPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  {symbol}
                  {formatPrice(convertedOriginal)}
                </span>
              )}
            </div>
            {/* Optional: add to cart button can go here */}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;