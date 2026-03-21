import React, { useState } from "react";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

const SingleCartCard = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = (data.discountPrice * value).toFixed(2);
console.log("cart data:", data)

const increment = () => {
  if (data.stock < value + 1) {
    toast.error("Product stock limited!");
  } else {
    const newQty = value + 1;
    setValue(newQty);
    quantityChangeHandler({ ...data, qty: newQty });

    // Update localStorage cart items
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCart = cartItems.map((item) =>
      item._id === data._id ? { ...item, qty: newQty } : item
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  }
};

const decrement = () => {
  if (value === 1) {
    removeFromCartHandler(data);
  } else {
    const newQty = value - 1;
    setValue(newQty);
    quantityChangeHandler({ ...data, qty: newQty });

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCart = cartItems.map((item) =>
      item._id === data._id ? { ...item, qty: newQty } : item
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  }
};


  return (
    <div className="border-b p-4 flex flex-col gap-2">
      {/* Vendor Name and Image with Link */}
      <div className="w-full flex items-center gap-2">
        <Link href={`/vendor/dashboard/${data?.vendor?._id}`} className="flex items-center gap-2">
          {data?.vendor?.avatar?.url && (
            <Image
              src={data?.vendor.avatar.url}
              alt={data?.vendor.name}
              width={30}
              height={30}
              className="rounded-full cursor-pointer"
            />
          )}
          <h3 className="text-gray-800 text-md font-semibold">
            <span className="hover:text-red-600 transition duration-300 cursor-pointer">
              {data?.vendor?.name}
            </span>
          </h3>
        </Link>
      </div>

      {/* Product Data */}
      <div className="flex items-center justify-between">
        {/* Product Image */}
        <Link href={`/product/${data._id}`} className="w-[100px]">
          <Image
            src={data?.images?.[0]?.url || '/images/product-placeholder.jpg'}
            alt={data?.name || 'Product image'}
            width={100}
            height={100}
            className="rounded-[5px] cursor-pointer w-full h-auto"
            sizes="100px"
          />
        </Link>

        {/* Quantity Controls */}
        <div className="flex items-center">
          <div
            className="bg-[#e44343] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={increment}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="px-2 text-gray-700">{value}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={decrement}
          >
            <HiOutlineMinus size={16} color="#000" />
          </div>
        </div>

        {/* Product Pricing */}
        <div className="text-center">
        <h4 className="text-sm text-[#121010] line-through">${data?.originalPrice}</h4>
          
          <h4 className="text-md text-[#d02222] font-semibold">${totalPrice}</h4>
        </div>

        {/* Remove Icon */}
        <RxCross1
          className="cursor-pointer text-black"
          size={20}
          onClick={() => removeFromCartHandler(data._id)}
        />
      </div>
    </div>
  );
};

export default SingleCartCard;
