import React, { useState } from "react";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

// Format Nigerian Naira
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const SingleCartCard = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const originalPrice = parseFloat(data.originalPrice) || 0;
  const discountPrice = parseFloat(data.discountPrice) || 0;
  const finalPrice = discountPrice || originalPrice;
  const totalPrice = finalPrice * value;

  const increment = () => {
    if (data.stock < value + 1) {
      toast.error(`Only ${data.stock} items in stock!`);
    } else {
      const newQty = value + 1;
      setValue(newQty);
      quantityChangeHandler({ ...data, qty: newQty });
    }
  };

  const decrement = () => {
    if (value === 1) {
      removeFromCartHandler(data);
    } else {
      const newQty = value - 1;
      setValue(newQty);
      quantityChangeHandler({ ...data, qty: newQty });
    }
  };

  const vendorName = data?.vendor?.name || data?.shop?.name || "Vendor";
  const vendorAvatar = data?.vendor?.avatar?.url || data?.shop?.logo?.url || "/images/store-backup.png";
  const productName = data?.name || "Product";
  const imageUrl = data?.images?.[0]?.url || "/images/fallbackImage.jpg";

  return (
    <div className="bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow p-3 sm:p-4 mb-3">
      {/* Vendor row */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
        <Link href={`/vendor/${data?.vendor?._id}`} className="flex items-center gap-2 group">
          <div className="relative w-6 h-6 rounded-full overflow-hidden">
            <Image
              src={vendorAvatar}
              alt={vendorName}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-xs sm:text-sm text-gray-600 group-hover:text-blue-600 transition">
            {vendorName}
          </span>
        </Link>
      </div>

      {/* Product row */}
      <div className="flex gap-3 sm:gap-4">
        {/* Image */}
        <Link href={`/product/${data._id}`} className="flex-shrink-0">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={productName}
              fill
              className="object-contain p-1"
              sizes="96px"
            />
          </div>
        </Link>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <Link href={`/product/${data._id}`}>
            <h4 className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2 mb-1 hover:text-blue-600 transition">
              {productName}
            </h4>
          </Link>
          
          {/* Price and quantity row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-gray-900">
                {formatNaira(finalPrice)}
              </span>
              {discountPrice < originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatNaira(originalPrice)}
                </span>
              )}
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={decrement}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                aria-label="Decrease quantity"
              >
                <HiOutlineMinus size={14} className="text-gray-600" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{value}</span>
              <button
                onClick={increment}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                aria-label="Increase quantity"
                disabled={value >= data.stock}
              >
                <HiPlus size={14} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Total price for this item */}
          <div className="flex justify-between items-center mt-2 pt-1 border-t border-dashed border-gray-100">
            <span className="text-xs text-gray-500">Subtotal:</span>
            <span className="text-sm font-semibold text-blue-600">
              {formatNaira(totalPrice)}
            </span>
          </div>

          {/* Low stock warning */}
          {data.stock > 0 && data.stock < 5 && (
            <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
              ⚡ Only {data.stock} left — order soon
            </p>
          )}
        </div>

        {/* Remove button */}
        <button
          onClick={() => removeFromCartHandler(data._id)}
          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition"
          aria-label="Remove item"
        >
          <RxCross1 size={18} />
        </button>
      </div>
    </div>
  );
};

export default SingleCartCard;