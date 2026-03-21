import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

// Icons
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { SearchIcon } from "@heroicons/react/solid";

// Styles & Utilities
import styles from "../../styles/styles";
import ClientOnly from "../common/ClientOnly";

// Lazy-loaded popups (no SSR)
const Cart = dynamic(() => import("../cart/Cart"), { ssr: false });
const Wishlist = dynamic(() => import("../wishlist/WishList"), { ssr: false });

/**
 * HeaderUpper Component – Desktop header with search, icons, and user menu.
 * Only renders on screens wider than 768px.
 */
const HeaderUpper = ({ handleSearchChange, searchData }) => {
  // Redux state
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishListItems } = useSelector((state) => state.wishList);

  // Local state
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024); // default desktop

  // Track window width for responsive rendering
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // set initial width
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Do not render on mobile (handled by HeaderBottom)
  if (windowWidth < 768) return null;

  return (
    <ClientOnly>
      <header className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-3 flex justify-between items-center gap-4 shadow-sm">
        {/* Logo with enhanced visibility */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Abuad Supply"
            width={140}
            height={48}
            priority
            className="cursor-pointer object-contain drop-shadow-md hover:drop-shadow-lg transition-all duration-200"
          />
        </Link>

        {/* Search Bar with Autocomplete */}
        <div className="flex-1 max-w-2xl mx-4 relative">
          <div className="flex items-center h-10 bg-white rounded-full overflow-hidden shadow-sm">
            <input
              type="text"
              placeholder="Search products..."
              onChange={handleSearchChange}
              className="flex-1 h-full px-4 text-gray-800 outline-none"
            />
            <span className="w-12 h-full flex items-center justify-center bg-green-600 hover:bg-green-700 transition-colors cursor-pointer">
              <SearchIcon className="h-5 w-5 text-white" />
            </span>
          </div>

          {/* Search Results Dropdown */}
          {searchData?.length > 0 && (
            <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2 max-h-96 overflow-y-auto">
              <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Products
              </h3>
              {searchData.map((item) => (
                <Link
                  href={`/product/${item._id}`}
                  key={item._id}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Image
                    src={item.images[0]?.url}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 mr-4 rounded-md object-cover"
                  />
                  <span className="text-sm text-gray-800 font-medium">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          {/* Wishlist */}
          <button
            onClick={() => setOpenWishlist(true)}
            className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Wishlist"
          >
            <AiOutlineHeart size={24} />
            {wishListItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishListItems.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => setOpenCart(true)}
            className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Shopping cart"
          >
            <AiOutlineShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* User Profile / Login */}
          <Link
            href={userInfo?.avatar?.url ? "/user/profile" : "/user/login"}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Profile"
          >
            {userInfo?.avatar?.url ? (
              <Image
                src={userInfo.avatar.url}
                alt="User"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full ring-2 ring-white/20"
              />
            ) : (
              <CgProfile size={28} />
            )}
          </Link>
        </div>

        {/* Popup Modals */}
        {openCart && <Cart setOpenCart={setOpenCart} />}
        {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
      </header>
    </ClientOnly>
  );
};

export default HeaderUpper;