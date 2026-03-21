import React from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { toast } from "react-toastify";

import SingleWishListCard from "./SingleWishListCard";
import { useDispatch, useSelector } from "react-redux";

import styles from "../../styles/styles";
import { addItemToCart } from "@/redux/slices/cartSlice";
import { removeItemFromWishList } from "@/redux/slices/wishListSlice";


const Wishlist = ({ setOpenWishlist }) => {
  const { wishListItems } = useSelector((state) => state.wishList);
  const { cartItems } = useSelector((state) => state.cart);
  
  const dispatch = useDispatch();

  const addToCartHandler = (product) => {
    const already = cartItems.find((i) => i._id === product._id);
    if (already) {
      toast.error("Item already in cart!");
      return false;
    }
    const qty = 1;
    const stock = product?.stock ?? 0;
    if (stock < qty) {
      toast.error("Product stock limited!");
      return false;
    }
    dispatch(addItemToCart({ ...product, qty }));
    toast.success("Item added to cart successfully!");
    return true;
  };

  const removeFromWishListHandler = (product) => {
    dispatch(removeItemFromWishList(product));
  };

  // add to cart then auto-remove from wishlist
  const addToCartAndRemove = (product) => {
    const added = addToCartHandler(product);
    if (added) removeFromWishListHandler(product);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-25 z-10 flex justify-center items-center">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[45%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {wishListItems && wishListItems.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3 text-black">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <h5 className="text-gray-700 font-normal">Wishlist items are empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5 text-black">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>
              <div className={`${styles.normalFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500] text-black">
                  {wishListItems && wishListItems.length} items
                </h5>
              </div>
              <br />
              <div className="w-full border-t">
                {wishListItems &&
                  wishListItems.map((item, index) => (
                    <SingleWishListCard
                      key={index}
                      data={item}
                      addToCartHandler={addToCartAndRemove}
                      removeFromWishListHandler={removeFromWishListHandler}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
