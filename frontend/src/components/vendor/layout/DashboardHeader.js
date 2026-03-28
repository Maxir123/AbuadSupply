import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  AiOutlineGift,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { MdOutlineDashboard } from "react-icons/md";
import { FiPackage, FiShoppingBag, FiTrash2, FiBell } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { CiBank, CiMoneyBill, CiSettings } from "react-icons/ci";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";
import { BsAlexa } from "react-icons/bs";
import { IoIosAddCircle, IoMdAdd } from "react-icons/io";

import {
  deleteVendorNotification,
  fetchVendorNotificationCount,
  fetchVendorNotifications,
  logoutVendor,
  markVendorNotificationAsRead,
} from "@/redux/slices/vendorSlice";

// Navigation items with path, label, icon
const navItems = [
  { path: "/vendor/dashboard", label: "Dashboard", icon: MdOutlineDashboard },
  { path: "/vendor/orders", label: "Orders", icon: FiShoppingBag },
  { path: "/vendor/products", label: "Products", icon: FiPackage },
  { path: "/vendor/create-product", label: "Add Product", icon: IoMdAdd },
  { path: "/vendor/sales", label: "Sales", icon: BsAlexa },
  { path: "/vendor/create-flash-sale", label: "Flash Sale", icon: IoIosAddCircle },
  { path: "/vendor/withdraw", label: "Withdraw", icon: CiMoneyBill },
  { path: "/vendor/bank-info", label: "Bank Info", icon: CiBank },
  { path: "/vendor/inbox", label: "Inbox", icon: BiMessageSquareDetail },
  { path: "/vendor/coupons", label: "Coupons", icon: AiOutlineGift },
  { path: "/vendor/refunds", label: "Refunds", icon: HiOutlineReceiptRefund },
  { path: "/vendor/settings", label: "Settings", icon: CiSettings },
];

const DashboardHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentPath = router.pathname;
  const { vendorInfo, notificationCount, notifications } = useSelector(
    (state) => state.vendors
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notification count on mount
  useEffect(() => {
    dispatch(fetchVendorNotificationCount());
  }, [dispatch]);

  // Toggle notifications and mark as read when opened
  const toggleNotifications = async () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    if (newState) {
      const result = await dispatch(fetchVendorNotifications());
      if (result?.payload?.length > 0) {
        const unreadIds = result.payload
          .filter((n) => !n.isRead)
          .map((n) => n._id);
        if (unreadIds.length) {
          unreadIds.forEach((id) => dispatch(markVendorNotificationAsRead(id)));
        }
      }
    } else {
      setShowNotifications(false);
    }
  };

  const handleDeleteNotification = (id) => {
    dispatch(deleteVendorNotification(id));
  };

  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutVendor());
      if (result.type === "vendor/logoutVendor/fulfilled") {
        toast.success("Logged out successfully!");
        router.push("/vendor/login");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during logout.");
    }
  };

  const isActive = (path) => currentPath === path;

  return (
    <header className="w-full h-[72px] bg-white shadow-md sticky top-0 left-0 z-30 flex items-center justify-between px-4 md:px-6 lg:px-8">
      {/* Logo */}
      <Link href="/vendor/dashboard" className="flex-shrink-0">
        <Image
          src="/logo.png"
          alt="Store Logo"
          width={140}
          height={48}
          priority
          className="object-contain"
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
        {navItems.map(({ path, icon: Icon }) => (
          <Link
            key={path}
            href={path}
            className={`p-2 rounded-md transition-colors duration-200 hover:bg-gray-100 ${
              isActive(path)
                ? "border-b-2 border-blue-500 text-gray-600"
                : "text-gray-600"
            }`}
            aria-label={path.split("/").pop()}
          >
            <Icon size={24} />
          </Link>
        ))}

        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors relative"
            aria-label="Notifications"
          >
            <FiBell size={22} className="text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                {notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
              <div className="px-4 py-3 font-semibold text-gray-800 border-b bg-gray-50">
                Notifications
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications?.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className="px-4 py-3 hover:bg-gray-50 flex items-start justify-between gap-2 border-b last:border-0"
                    >
                      <p className="text-sm text-gray-700 flex-1">{n.message}</p>
                      <button
                        onClick={() => handleDeleteNotification(n._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete notification"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-sm text-gray-500 text-center">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Logout"
        >
          <LuLogOut size={24} />
        </button>
      </nav>

      {/* Avatar & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        {/* Profile Avatar with Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="focus:outline-none"
            aria-label="Profile menu"
          >
            <Image
              src={vendorInfo?.avatar?.url || "/images/store-backup.png"}
              alt="Avatar"
              width={42}
              height={42}
              className="rounded-full object-cover border-2 border-gray-200 hover:border-crimson transition-colors"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
              <Link
                href="/vendor/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setShowProfileMenu(false)}
              >
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-black bg-opacity-50 z-40">
          <div className="absolute right-0 w-64 h-full bg-white shadow-lg flex flex-col">
            <nav className="flex flex-col p-4 space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  href={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive(path)
                      ? "border-l-4 border-blue-500 text-gray-600 bg-gray-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              ))}
              <div className="border-t my-2"></div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
              >
                <LuLogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;