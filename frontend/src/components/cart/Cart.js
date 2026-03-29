import React from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "@/redux/slices/cartSlice";
import Link from "next/link";
import SingleCartCard from "./SingleCartCard";

// Format Nigerian Naira
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const Cart = ({ setOpenCart }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * (item.discountPrice || item.originalPrice || 0),
    0
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <IoBagHandleOutline size={24} className="text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">
              Your Cart ({cartItems.length})
            </h2>
          </div>
          <button
            onClick={() => setOpenCart(false)}
            className="p-1 rounded-full hover:bg-gray-100 transition"
            aria-label="Close cart"
          >
            <RxCross1 size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Cart Items (scrollable) */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <IoBagHandleOutline size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Your cart is empty</h3>
            <p className="text-sm text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
            <button
              onClick={() => setOpenCart(false)}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.map((item) => (
                <SingleCartCard
                  key={item._id}
                  data={item}
                  quantityChangeHandler={(data) => dispatch(addItemToCart(data))}
                  removeFromCartHandler={(id) => dispatch(removeItemFromCart(id))}
                />
              ))}
            </div>

            {/* Footer with total and checkout */}
            <div className="border-t p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatNaira(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Shipping and taxes calculated at checkout.</p>
              <Link href="/checkout">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition shadow-sm">
                  Checkout → {formatNaira(totalPrice)}
                </button>
              </Link>
              <button
                onClick={() => setOpenCart(false)}
                className="w-full mt-2 text-center text-sm text-gray-500 hover:text-gray-700"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>

      {/* Optional: Add slide-in animation */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Cart;