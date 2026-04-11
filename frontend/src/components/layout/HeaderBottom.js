import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { IoIosMenu } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { SearchIcon, ShoppingCartIcon, XIcon } from "@heroicons/react/solid";

import { navItems } from "../../static/data";

const Cart = dynamic(() => import("../cart/Cart"), { ssr: false });

const HeaderBottom = ({ categories, handleSearchChange }) => {
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.user);

  const [sidebar, setSidebar] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [mounted, setMounted] = useState(false); // Track client mount

  useEffect(() => {
    setMounted(true);
    const resize = () => setWindowWidth(window.innerWidth);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleAllClick = () => {
    if (windowWidth >= 768) {
      router.push("/products");
    } else {
      setSidebar(true);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* MOBILE HEADER */}
      {windowWidth < 768 && (
        <div className="md:hidden bg-white shadow-sm">
          {/* TOP ROW */}
          <div className="flex items-center justify-between px-3 py-2">
            <button onClick={handleAllClick}>
              <IoIosMenu size={26} />
            </button>

            <Link href="/">
              <Image
                src="/logo.png"
                alt="Abuad Supply"
                width={120}
                height={40}
                className="object-contain"
              />
            </Link>

            <div className="flex items-center gap-3">
              {/* PROFILE */}
              <Link href={userInfo ? "/user/profile" : "/user/login"}>
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  {userInfo?.avatar?.url ? (
                    <Image
                      src={userInfo.avatar.url}
                      width={32}
                      height={32}
                      alt="user"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <CgProfile size={26} />
                  )}
                </div>
              </Link>

              {/* CART */}
              <button onClick={() => setOpenCart(true)}>
                <ShoppingCartIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="px-3 pb-3">
            <div className="flex items-center bg-gray-200 rounded-xl px-3 h-11">
              <SearchIcon className="h-5 w-5 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search products, brands and categories"
                onChange={handleSearchChange}
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP NAV */}
      {windowWidth >= 768 && (
        <nav className="hidden md:flex items-center justify-between px-4 h-12 bg-gray-900 text-white">
          {/* LEFT NAV ITEMS */}
          <ul className="flex items-center gap-2">
            <li
              onClick={handleAllClick}
              className="flex items-center gap-1 cursor-pointer px-3 py-1 hover:bg-white/10 rounded"
            >
              <IoIosMenu size={22} />
              All
            </li>

            {navItems.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className="px-3 py-1 hover:bg-white/10 rounded"
              >
                {item.title}
              </Link>
            ))}
          </ul>

          {/* RIGHT NAV: EMPTY ON DESKTOP */}
        </nav>
      )}

      {/* SIDEBAR */}
{sidebar && (
  <div className="fixed inset-0 z-50">
    {/* Backdrop with blur */}
    <div
      onClick={() => setSidebar(false)}
      className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
    />

    {/* Sidebar panel */}
    <div className="absolute left-0 top-0 h-full w-[85%] max-w-[360px] bg-white shadow-2xl animate-slide-in">
      <div className="flex flex-col h-full">
        {/* Header with logo and close button */}
{/* Header with logo and close button */}
<div className="flex items-center justify-between p-5 border-b border-gray-100">
  <Link href="/" onClick={() => setSidebar(false)} className="flex items-center gap-3">
<div className="relative w-32 h-20">
  <Image
    src="/logo.png"
    alt="Logo"
    fill
    className="object-contain"
  />
</div>
  </Link>
  <button
    onClick={() => setSidebar(false)}
    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
  >
    <XIcon className="h-5 w-5 text-gray-500" />
  </button>
</div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                onClick={() => setSidebar(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
              >
                {item.icon && <span className="text-gray-400">{item.icon}</span>}
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="p-5 border-t border-gray-100 space-y-3">
          <Link
            href="/user/login"
            onClick={() => setSidebar(false)}
            className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
          >
            Sign In
          </Link>
          <Link
            href="/user/register"
            onClick={() => setSidebar(false)}
            className="block w-full border-2 border-gray-300 text-gray-700 text-center py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  </div>
)}

      {/* CART */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
    </>
  );
};

export default HeaderBottom;