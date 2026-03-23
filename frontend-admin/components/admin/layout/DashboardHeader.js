import React, { useEffect, useState, useRef } from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdCategory, MdOutlineDashboard } from "react-icons/md";
import { FiPackage, FiShoppingBag, FiTrash } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import Link from "next/link";
import { CiBank, CiMoneyBill, CiSettings } from "react-icons/ci";
import { HiOutlineCollection, HiOutlineReceiptRefund } from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";
import { IoMdPeople } from "react-icons/io";
import { FaStoreAlt, FaBell, FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { RiSubscript2 } from "react-icons/ri";
import Image from "next/image";
import {
  fetchAdminNotificationCount,
  fetchAdminNotifications,
  markNotificationAsRead,
  logoutAdmin,
  deleteAdminNotification,
} from "@/redux/adminSlice";

const DashboardHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentPath = router.pathname;

  const { adminInfo, notificationCount, notifications } = useSelector(
    (state) => state.admin
  );

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAdminNotificationCount());

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  const handleAdminLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const toggleNotifications = async () => {
    const newState = !showDropdown;
    setShowDropdown(newState);

    if (newState) {
      const result = await dispatch(fetchAdminNotifications());
      const unread = result?.payload?.filter((n) => !n.isRead) || [];

      await Promise.all(
        unread.map((n) => dispatch(markNotificationAsRead(n._id)))
      );

      dispatch(fetchAdminNotificationCount());
    }
  };

  const isActive = (path) =>
    currentPath === path
      ? "text-blue-600 bg-blue-50"
      : "text-gray-500";

  const navLinks = [
    { href: "/dashboard", icon: MdOutlineDashboard, label: "Dashboard" },
    { href: "/orders", icon: FiShoppingBag, label: "Orders" },
    { href: "/products", icon: FiPackage, label: "Products" },
    { href: "/customers", icon: IoMdPeople, label: "Customers" },
    { href: "/vendors", icon: FaStoreAlt, label: "Vendors" },
    { href: "/categories", icon: MdCategory, label: "Categories" },
    { href: "/subcategories", icon: RiSubscript2, label: "Subcategories" },
    { href: "/sub-subcategories", icon: HiOutlineCollection, label: "More" },
    { href: "/coupons", icon: AiOutlineGift, label: "Coupons" },
    { href: "/sales", icon: CiMoneyBill, label: "Sales" },
    { href: "/refunds", icon: HiOutlineReceiptRefund, label: "Refunds" },
    { href: "/inbox", icon: BiMessageSquareDetail, label: "Inbox" },
    { href: "/bank", icon: CiBank, label: "Bank" },
    { href: "/settings", icon: CiSettings, label: "Settings" },
  ];

  return (
    <div className="w-full h-[64px] bg-white border-b flex items-center justify-between px-3 sticky top-0 z-50">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          className="mobile-menu-button lg:hidden p-2 rounded-lg active:scale-95"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <FaBars size={20} />
        </button>

        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="logo"
            width={100}
            height={40}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-full active:scale-95"
          >
            <FaBell size={18} />

            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {notificationCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border overflow-hidden">
              <div className="px-3 py-2 text-sm font-semibold border-b">
                Notifications
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className="px-3 py-2 flex justify-between gap-2 text-sm hover:bg-gray-50"
                    >
                      <span className="flex-1 text-gray-600">
                        {n.message}
                      </span>

                      <button
                        onClick={() =>
                          dispatch(deleteAdminNotification(n._id))
                        }
                        className="text-red-500"
                      >
                        <FiTrash size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-400">
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <Link href={`/admin/${adminInfo?._id}`}>
          <Image
            src={adminInfo?.avatar?.url || "/images/admin-placeholder.png"}
            alt="avatar"
            width={34}
            height={34}
            className="rounded-full border"
          />
        </Link>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30">
          <div
            ref={mobileMenuRef}
            className="absolute left-0 top-0 h-full w-[80%] max-w-xs bg-white p-4 rounded-r-2xl shadow-xl animate-slideIn"
          >
            <div className="mb-4">
              <p className="font-semibold text-gray-800">
                {adminInfo?.name}
              </p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive(
                    link.href
                  )}`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}

              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-3 px-3 py-2 text-sm text-red-500"
              >
                <LuLogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
