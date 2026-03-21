import React from "react";
import { BsCartPlus } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";

const SingleWishListCard = ({ data, removeFromWishListHandler, addToCartHandler }) => {
  const totalPrice = data.discountPrice;

  return (
    <div className="border-b p-4 flex items-center">
      <RiCloseLine
        size={20}
        className="cursor-pointer text-black mr-2"
        title="Remove from wishlist"
        onClick={() => removeFromWishListHandler(data)}
      />
      <Link href={`/product/${data._id}`} passHref legacyBehavior>
        <a className="block">
          <Image
            src={data?.images?.[0]?.url || "/images/fallbackImage.jpg"}
            alt={data?.name || "Product image"}
            width={130}
            height={130}
            className="w-[130px] h-auto ml-2 mr-2 rounded-[5px]"
            sizes="(max-width: 640px) 112px, 130px"
            // unoptimized
          />
        </a>
      </Link>
      <div className="pl-[5px] flex-1">
        <h1>{data.name}</h1>
        <h4 className="font-[600] pt-3 text-[17px] text-[#d02222] font-Roboto">
          ${totalPrice}
        </h4>
      </div>
      <BsCartPlus
        size={20}
        className="cursor-pointer text-black"
        title="Add to cart"
        onClick={() => addToCartHandler(data)}
      />
    </div>
  );
};

export default SingleWishListCard;
