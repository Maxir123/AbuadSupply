import React, { useEffect, useState, useCallback } from "react";
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

// Helper component to avoid hydration mismatch for dynamic client-only data
const MountedWrapper = ({ children, fallback = null }) => {
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleAllClick = useCallback(() => {
    if (window.innerWidth >= 768) {
      router.push("/products");
    } else {
      setSidebarOpen(true);
    }
  }, [router]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="block md:hidden bg-white shadow-sm">
        <div className="flex items-center justify-between px-3 py-2">
          <button onClick={handleAllClick} aria-label="Menu" className="p-1 -ml-1">
            <IoIosMenu size={26} />
          </button>

          <Link href="/">
            <Image
              src="/logo.png"
              alt="Abuad Supply"
              width={120}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link href={userInfo ? "/user/profile" : "/user/login"} aria-label="Profile">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <MountedWrapper fallback={<CgProfile size={26} />}>
                  {userInfo?.avatar?.url ? (
                    <Image
                      src={userInfo.avatar.url}
                      width={32}
                      height={32}
                      alt={`${userInfo.name || "User"}'s profile`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <CgProfile size={26} />
                  )}
                </MountedWrapper>
              </div>
            </Link>

            <button onClick={() => setWishlistOpen(true)} aria-label="Wishlist" className="relative">
              <AiOutlineHeart size={24} />
              <MountedWrapper>
                {wishListItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {wishListItems.length}
                  </span>
                )}
              </MountedWrapper>
            </button>

            <button onClick={() => setCartOpen(true)} aria-label="Cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6" />
              <MountedWrapper>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {cartItems.length}
                  </span>
                )}
              </MountedWrapper>
            </button>
          </div>
        </div>

        <div className="px-3 pb-3">
          <div className="flex items-center bg-gray-100 rounded-xl px-3 h-11 border border-gray-200">
            <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search products, brands and categories"
              onChange={handleSearchChange}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* DESKTOP NAV - Refined Typography */}
      <nav className="hidden md:block bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-b border-emerald-100 shadow-sm relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative flex items-center justify-between px-4 h-12 max-w-7xl mx-auto">
          <ul className="flex items-center gap-1">
            <li>
              <button
                onClick={handleAllClick}
                className="flex items-center gap-1 cursor-pointer px-4 py-1.5 text-gray-700 hover:text-emerald-700 hover:bg-emerald-100/60 rounded-full transition-all duration-200 text-sm font-medium tracking-wide"
              >
                <IoIosMenu size={18} />
                <span>All</span>
              </button>
            </li>

            {navItems.map((item) => (
              <li key={item.url}>
                <Link
                  href={item.url}
                  className="px-4 py-1.5 text-gray-700 hover:text-emerald-700 hover:bg-emerald-100/60 rounded-full block text-sm font-medium tracking-wide transition-all duration-200"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Optional: small promo text with refined typography */}
          <div className="text-xs font-medium text-emerald-700 hidden lg:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wide">FREE delivery on campus</span>
            </span>
          </div>
        </div>
      </nav>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div
            onClick={closeSidebar}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
            aria-hidden="true"
          />

          <div className="absolute left-0 top-0 h-full w-[85%] max-w-[360px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out animate-slide-in">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <Link href="/" onClick={closeSidebar} className="flex items-center gap-3">
                  <div className="relative w-32 h-20">
                    <Image src="/logo.png" alt="Abuad Supply" fill className="object-contain" />
                  </div>
                </Link>
                <button
                  onClick={closeSidebar}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <XIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4">
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.url}
                      href={item.url}
                      onClick={closeSidebar}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:text-emerald-600 transition-all duration-200 text-base"
                    >
                      {item.icon && <span className="text-gray-400">{item.icon}</span>}
                      {item.title}
                    </Link>
                  ))}
                  
                  <button
                    onClick={() => {
                      closeSidebar();
                      setWishlistOpen(true);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:text-emerald-600 transition-all duration-200 w-full text-left text-base"
                  >
                    <AiOutlineHeart size={20} className="text-gray-400" />
                    Wishlist
                    <MountedWrapper>
                      {wishListItems.length > 0 && (
                        <span className="ml-auto bg-emerald-600 text-white text-xs font-medium rounded-full px-2 py-0.5">
                          {wishListItems.length}
                        </span>
                      )}
                    </MountedWrapper>
                  </button>
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 space-y-3">
                <Link
                  href="/user/login"
                  onClick={closeSidebar}
                  className="block w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-center py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md text-base tracking-wide"
                >
                  Sign In
                </Link>
                <Link
                  href="/user/register"
                  onClick={closeSidebar}
                  className="block w-full border-2 border-gray-300 text-gray-700 text-center py-3 rounded-xl font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all text-base tracking-wide"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {cartOpen && <Cart setOpenCart={setCartOpen} />}
      {wishlistOpen && <Wishlist setOpenWishlist={setWishlistOpen} />}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default HeaderBottom;