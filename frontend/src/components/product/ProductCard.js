// ProductCard.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaShoppingCart, FaPlus, FaMinus, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { addItemToCart } from "@/redux/slices/cartSlice";

const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

// Star Rating Component
const RatingStars = ({ rating, reviewCount, showCount = true }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400 text-[10px] sm:text-xs md:text-sm" />
        ))}
        {halfStar && <FaStarHalfAlt className="text-yellow-400 text-[10px] sm:text-xs md:text-sm" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-gray-300 text-[10px] sm:text-xs md:text-sm" />
        ))}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className="text-[10px] sm:text-xs text-gray-500 ml-0.5">({reviewCount})</span>
      )}
    </div>
  );
};

const ProductCard = ({
  product,
  isSale = false,
  saleEndDate,
  isMoreFromSeller = false,
}) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const originalPrice = parseFloat(product?.originalPrice) || 0;
  const discountedPrice = parseFloat(product?.discountPrice) || 0;
  const rating = product?.rating || 0;
  const reviewCount = product?.reviews?.length || 0;
  const brandName = product?.brand?.name || product?.brand || "No brand";
  const stock = product?.stock || 0;

  const discountPercentage =
    originalPrice > 0 && discountedPrice < originalPrice
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0;

  const imageUrl = product?.images?.[0]?.url;
  const productName = product?.name || "Unknown Product";

  const isInCart = cartItems.some((item) => item._id === product._id);

  const handleAddToCart = async () => {
    if (isInCart) {
      toast.info("Item already in cart");
      return;
    }
    if (stock < quantity) {
      toast.error(`Only ${stock} item(s) in stock`);
      return;
    }
    setIsAdding(true);
    try {
      await dispatch(addItemToCart({ ...product, qty: quantity }));
      toast.success(`Added ${quantity} item(s) to cart`);
      setQuantity(1);
    } catch (error) {
      toast.error("Failed to add item");
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQty = () => {
    if (quantity < stock) setQuantity((q) => q + 1);
    else toast.error(`Only ${stock} available`);
  };
  const decrementQty = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const cardBaseClass = `bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group`;

  // ----- Horizontal compact layout (More from seller) -----
  if (isMoreFromSeller) {
    return (
      <Link href={`/product/${product._id}`} className="block group">
        <div className={`${cardBaseClass} border border-gray-100 hover:border-gray-200`}>
          <div className="flex p-2 sm:p-3 gap-2 sm:gap-3">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={imageUrl || "/images/fallbackImage.jpg"}
                alt={productName}
                fill
                className="object-contain p-1"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-1 sm:gap-2">
                <h4 className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                  {productName.length > 25 ? productName.slice(0, 25) + "…" : productName}
                </h4>
                {discountPercentage > 0 && (
                  <span className="inline-flex items-center px-1 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-red-100 text-red-700 whitespace-nowrap">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">{brandName}</p>
              <RatingStars rating={rating} reviewCount={reviewCount} showCount={false} />
              <div className="mt-1 flex items-baseline gap-1 sm:gap-2 flex-wrap">
                <span className="text-xs sm:text-base font-bold text-gray-900">
                  {formatNaira(discountedPrice)}
                </span>
                {originalPrice > discountedPrice && (
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                    {formatNaira(originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ----- Sale card layout (with stars) -----
  if (isSale) {
    return (
      <Link href={`/deals/${product._id}`} className="block group">
        <div className={`${cardBaseClass} border-2 border-red-200 hover:border-red-300`}>
          <div className="p-2 sm:p-3">
            <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2 sm:mb-3">
              <Image
                src={imageUrl || "/images/fallbackImage.jpg"}
                alt={productName}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 50vw, 250px"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 truncate">{brandName}</p>
            <h4 className="text-xs sm:text-sm font-medium text-gray-800 truncate mb-1">
              {productName.length > 18 ? productName.slice(0, 18) + "…" : productName}
            </h4>
            <RatingStars rating={rating} reviewCount={reviewCount} />
            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap mt-1">
              <span className="text-sm sm:text-lg font-bold text-red-600">
                {formatNaira(discountedPrice)}
              </span>
              {originalPrice > discountedPrice && (
                <span className="text-[10px] sm:text-sm text-gray-400 line-through">
                  {formatNaira(originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ----- Default product card (full layout) -----
  return (
    <div className={`${cardBaseClass} border border-gray-200 hover:border-gray-300 flex flex-col h-full`}>
      {/* Image */}
      <Link href={`/product/${product._id}`} className="block overflow-hidden">
        <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <Image
            src={imageUrl || "/images/fallbackImage.jpg"}
            alt={productName}
            fill
            className="object-contain p-2 sm:p-3 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 250px"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md z-10">
              -{discountPercentage}%
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-2 sm:p-3 flex flex-col flex-grow">
        <Link href={`/product/${product._id}`} className="block">
          {/* Brand */}
          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide mb-0.5 font-medium truncate">
            {brandName}
          </p>
          {/* Product name */}
          <h4 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] mb-0.5">
            {productName}
          </h4>
          {/* Rating */}
          <div className="mb-1 sm:mb-2">
            <RatingStars rating={rating} reviewCount={reviewCount} />
          </div>
          {/* Price row */}
          <div className="flex items-center flex-wrap gap-1 sm:gap-2 mb-1">
            <span className="text-sm sm:text-lg font-bold text-gray-900">
              {formatNaira(discountedPrice)}
            </span>
            {originalPrice > discountedPrice && (
              <span className="text-[10px] sm:text-sm text-gray-400 line-through">
                {formatNaira(originalPrice)}
              </span>
            )}
          </div>
        </Link>

        {/* 🔥 Low stock warning - placed here, clearly visible, between price and actions */}
        {stock > 0 && stock < 5 && (
          <div className="my-2">
            <div className="flex items-center justify-center gap-1 bg-orange-50 border border-orange-200 rounded-md py-1 px-2">
              <span className="text-orange-600 text-xs font-medium">⚠️ Only {stock} left!</span>
              <span className="text-orange-400 text-[10px]">— Order soon</span>
            </div>
          </div>
        )}

        {/* Quantity & Add to Cart */}
        {stock > 0 ? (
          <div className="mt-auto pt-1 sm:pt-2 space-y-1 sm:space-y-2">
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={decrementQty}
                  disabled={quantity <= 1}
                  className="px-1.5 sm:px-2 py-1 sm:py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-50 transition"
                >
                  <FaMinus size={8} className="sm:w-[10px] sm:h-[10px]" />
                </button>
                <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">{quantity}</span>
                <button
                  onClick={incrementQty}
                  disabled={quantity >= stock}
                  className="px-1.5 sm:px-2 py-1 sm:py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-50 transition"
                >
                  <FaPlus size={8} className="sm:w-[10px] sm:h-[10px]" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAdding || isInCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2 transition disabled:bg-gray-400 shadow-sm"
              >
                <FaShoppingCart size={10} className="sm:w-[14px] sm:h-[14px]" />
                {isInCart ? "In Cart" : isAdding ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        ) : (
          <button
            disabled
            className="mt-auto w-full bg-gray-100 text-gray-400 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-sm font-medium cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;