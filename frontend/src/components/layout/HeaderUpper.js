import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { SearchIcon } from "@heroicons/react/solid";

// Lazy-loaded popups (no SSR)
const Cart = dynamic(() => import("../cart/Cart"), { ssr: false });
const Wishlist = dynamic(() => import("../wishlist/WishList"), { ssr: false });

/**
 * HeaderUpper Component – Desktop header with search, icons, and user menu.
 * Only visible on md+ screens via Tailwind (hidden md:flex).
 */
const HeaderUpper = ({ handleSearchChange, searchData }) => {
  // Redux state
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishListItems } = useSelector((state) => state.wishList);

  // Local state
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ added missing state

  // Refs for outside click handling
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Open dropdown when search results appear
  useEffect(() => {
    if (searchData && searchData.length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [searchData]);

  // Handle outside clicks and Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Handle search input change
  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearchChange(value);
  };

  // Handle search icon click
  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      handleSearchChange(searchTerm);
      inputRef.current?.blur();
    }
  };

  // Memoize search results dropdown
  const searchResultsDropdown = useMemo(() => {
    if (!searchData?.length || !isDropdownOpen) return null;

    return (
      <div
        className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2 max-h-96 overflow-y-auto"
        role="listbox"
        id="search-results"
      >
        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Products
        </h3>
        {searchData.map((item) => (
          <Link
            href={`/product/${item._id}`}
            key={item._id}
            className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
            onClick={() => setIsDropdownOpen(false)}
            role="option"
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
    );
  }, [searchData, isDropdownOpen]);

  return (
    <header className="hidden md:flex w-full bg-white text-black px-4 py-3 justify-between items-center gap-4 shadow-sm">
      {/* Logo */}
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
      <div ref={searchContainerRef} className="flex-1 max-w-2xl mx-4 relative">
        <div className="flex items-center h-10 bg-white rounded-full overflow-hidden shadow-sm">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 py-2 rounded-l-lg border-0 focus:ring-2 focus:ring-blue-500 outline-none"
            role="combobox"
            aria-expanded={isDropdownOpen} // ✅ uses existing state
            aria-label="Search"
            aria-autocomplete="list"
            aria-controls="search-results"
            value={searchTerm}
            onChange={onSearchChange}
            onFocus={() => setIsDropdownOpen(!!searchData?.length)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // delay to allow click on results
          />
          <button
            onClick={handleSearchClick}
            className="w-12 h-full flex items-center justify-center bg-green-600 hover:bg-green-700 transition-colors cursor-pointer"
            aria-label="Submit search"
          >
            <SearchIcon className="h-5 w-5 text-white" aria-hidden="true" />
          </button>
        </div>
        {searchResultsDropdown}
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
              alt={`${userInfo.name || "User"}'s profile`}
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
  );
};

export default HeaderUpper;