import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { IoIosMenu } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { AiOutlineHeart } from "react-icons/ai";
import { SearchIcon, ShoppingCartIcon, XIcon } from "@heroicons/react/solid";

import { navItems } from "../../static/data";

const Cart = dynamic(() => import("../cart/Cart"), { ssr: false });
const Wishlist = dynamic(() => import("../wishlist/WishList"), { ssr: false });

const ClientOnly = ({ children, fallback = null }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? children : fallback;
};

const HeaderBottom = ({ categories, handleSearchChange }) => {
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishListItems } = useSelector((state) => state.wishList);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [sidebarOpen]);

  const handleAllClick = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      router.push("/products");
    } else {
      setSidebarOpen(true);
    }
  }, [router]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openWishlist = useCallback(() => setWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setWishlistOpen(false), []);

  const cartCount = useMemo(() => cartItems.length, [cartItems.length]);
  const wishlistCount = useMemo(() => wishListItems.length, [wishListItems.length]);

  const profileAvatar = userInfo?.avatar?.url;
  const profileLink = profileAvatar ? "/user/profile" : "/user/login";

  return (
    <>
      {/* ========== MOBILE HEADER (no sticky) ========== */}
      <div className="block md:hidden bg-white/95 backdrop-blur-sm transition-all duration-300 shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleAllClick}
            className="p-2 -ml-2 rounded-full hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 transform hover:scale-105"
            aria-label="Menu"
          >
            <IoIosMenu size={26} className="text-gray-700" />
          </button>

          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Abuad Supply"
              width={120}
              height={40}
              className="object-contain transition-all duration-300 hover:opacity-80"
              priority
              onError={(e) => (e.currentTarget.src = "/fallback.png")}
            />
          </Link>

          <div className="flex items-center gap-4">
            <Link href={profileLink} className="block">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center transition-all duration-200 hover:shadow-md hover:shadow-emerald-200/50 hover:scale-105">
                <ClientOnly fallback={<CgProfile size={24} className="text-gray-600" />}>
                  {profileAvatar ? (
                    <Image
                      src={profileAvatar}
                      width={32}
                      height={32}
                      alt="Profile"
                      className="object-cover w-full h-full"
                      onError={(e) => (e.currentTarget.src = "/fallback.png")}
                    />
                  ) : (
                    <CgProfile size={24} className="text-gray-600" />
                  )}
                </ClientOnly>
              </div>
            </Link>

            <button
              onClick={openWishlist}
              className="relative p-1 rounded-full hover:bg-gradient-to-r hover:from-rose-50 hover:to-amber-50 transition-all duration-200 transform hover:scale-105"
              aria-label="Wishlist"
            >
              <AiOutlineHeart size={24} className="text-gray-700 hover:text-rose-500 transition-colors" />
              {wishlistCount > 0 && (
                <ClientOnly>
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-400 to-amber-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-bounce shadow-md">
                    {wishlistCount}
                  </span>
                </ClientOnly>
              )}
            </button>

            <button
              onClick={openCart}
              className="relative p-1 rounded-full hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 transform hover:scale-105"
              aria-label="Shopping cart"
            >
              <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-emerald-600 transition-colors" />
              {cartCount > 0 && (
                <ClientOnly>
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse shadow-md">
                    {cartCount}
                  </span>
                </ClientOnly>
              )}
            </button>
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-center bg-gray-50 rounded-full px-4 h-11 border border-gray-200 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-200/50 transition-all duration-200">
            <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              onChange={handleSearchChange}
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
              aria-label="Search"
            />
          </div>
        </div>
      </div>

      {/* ========== DESKTOP NAVIGATION (no sticky) ========== */}
      <nav className="hidden md:block bg-white/95 backdrop-blur-sm transition-all duration-300 shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-6 h-12 max-w-7xl mx-auto">
          <ul className="flex items-center gap-1">
            <li>
              <button
                onClick={handleAllClick}
                className="px-3 py-1.5 flex items-center gap-1 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 rounded-lg hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 group"
                aria-label="All categories"
              >
                <IoIosMenu size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                <span>All</span>
              </button>
            </li>

            {navItems.map((item) => (
              <li key={item.url}>
                <Link
                  href={item.url}
                  className="px-3 py-1.5 block text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 rounded-lg hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-emerald-400 after:to-teal-400 after:transition-all after:duration-300 hover:after:w-4/5"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ========== MOBILE SIDEBAR ========== */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div
            onClick={closeSidebar}
            className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
            aria-hidden="true"
          />

          <div className="absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-white shadow-xl animate-slideInLeft">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <Link href="/" onClick={closeSidebar}>
                <Image
                  src="/logo.png"
                  alt="Abuad Supply"
                  width={130}
                  height={44}
                  className="transition-transform duration-200 hover:scale-105"
                  onError={(e) => (e.currentTarget.src = "/fallback.png")}
                />
              </Link>
              <button
                onClick={closeSidebar}
                className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:rotate-90"
                aria-label="Close menu"
              >
                <XIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto h-[calc(100%-80px)]">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.url}>
                    <Link
                      href={item.url}
                      onClick={closeSidebar}
                      className="block py-2.5 px-3 text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-transparent rounded-lg transition-all duration-200 font-medium transform hover:translate-x-1"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {cartOpen && <Cart setOpenCart={closeCart} />}
      {wishlistOpen && <Wishlist setOpenWishlist={closeWishlist} />}

      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-bounce {
          animation: bounce 0.5s ease-in-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </>
  );
};

export default HeaderBottom;