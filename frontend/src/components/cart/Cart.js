import React from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "@/redux/slices/cartSlice";
import Link from "next/link";
import SingleCartCard from "./SingleCartCard";

const Cart = ({ setOpenCart }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[45%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {cartItems && cartItems.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3 text-black">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5 className="text-gray-700 font-normal">Cart is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              {/* Close Cart Icon */}
              <div className="flex justify-end pt-5 pr-5 text-black">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>

              {/* Item Count */}
              <div className="flex items-center p-4">
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] text-black font-[500]">
                  ({cartItems.length}) items
                </h5>
              </div>

              {/* Cart Items */}
              <div className="w-full border-t">
                {cartItems.map((item, index) => (
                  <SingleCartCard
                    key={index}
                    data={item}
                    quantityChangeHandler={(data) => dispatch(addItemToCart(data))}
                    removeFromCartHandler={(id) => dispatch(removeItemFromCart(id))}
                  />
                ))}
              </div>
            </div>

            <div className="px-5 mb-3">
              {/* Checkout Button */}
              <Link href="/checkout">
                <div className="h-[45px] flex items-center justify-center w-full bg-[#e44343] rounded-[5px]">
                  <h1 className="text-white text-[18px] font-[600]">
                    Checkout Now (${totalPrice})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
