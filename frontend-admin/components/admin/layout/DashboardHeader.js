import React, { useEffect, useState } from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdCategory, MdOutlineDashboard } from "react-icons/md";
import { FiPackage, FiShoppingBag, FiTrash } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import Link from "next/link";
import { CiBank, CiMoneyBill, CiSettings } from "react-icons/ci";
import { HiOutlineCollection, HiOutlineReceiptRefund } from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";
import { IoMdPeople } from "react-icons/io";
import { FaStoreAlt, FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { RiSubscript2 } from "react-icons/ri";
import Image from "next/image";
import { fetchAdminNotificationCount, fetchAdminNotifications, markNotificationAsRead, logoutAdmin, deleteAdminNotification } from "@/redux/adminSlice";



const DashboardHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentPath = router.pathname;

  const { adminInfo, notificationCount, notifications } = useSelector(
    (state) => state.admin
  );
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminNotificationCount());
  }, [dispatch]);

  const handleAdminLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap();
      toast.success("You have logged out successfully!");
      router.push("/auth/login");
    } catch (error) {
      toast.error(error || "Failed to log out.");
    }
  };

  const toggleNotifications = async () => {
    const newState = !showDropdown;
    setShowDropdown(newState);

    if (newState) {
      const result = await dispatch(fetchAdminNotifications());

      const unread = result?.payload?.filter(n => !n.isRead) || [];
      await Promise.all(
        unread.map((n) => dispatch(markNotificationAsRead(n._id)))
      );

      dispatch(fetchAdminNotificationCount());
    }
  };

  //helper func for the active link
  const isActive = (path) => currentPath === path ? "crimson" : "#555";

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      {/* Logo */}
      <Image
        src="/logo.png"
        alt="Store Logo"
        width={140}
        height={80}
        priority
        className="cursor-pointer"
      />

      {/* Navigation */}
      <div className="flex items-center">
        <div className="flex items-center mr-4 relative">
          <Link href="/dashboard">
            <MdOutlineDashboard className="mx-5 cursor-pointer hidden lg:block" size={25} color={isActive("/dashboard")} />
          </Link>
          <Link href="/customers">
            <IoMdPeople className="mx-5 cursor-pointer hidden lg:block" size={25} color={isActive("/customers")} />
          </Link>
          <Link href="/vendors">
            <FaStoreAlt className="mx-5 cursor-pointer hidden lg:block" size={25} color={isActive("/vendors")} />
          </Link>
          <Link href="/orders">
            <FiShoppingBag className="mx-5 cursor-pointer hidden lg:block" size={25} color={isActive("/orders")} />
          </Link>
          <Link href="/products">
            <FiPackage className="mx-5 cursor-pointer hidden lg:block" size={25} color={isActive("/products")} />
          </Link>
          <Link href="/categories">
            <MdCategory className="mx-5 cursor-pointer hidden lg:block" size={25} color={isActive("/categories")} />
          </Link>
          <Link href="/subcategories">
            <RiSubscript2 className="mx-5 cursor-pointer hidden lg:block" size={25} color={isActive("/subcategories")} />
          </Link>
          <Link href="/sub-subcategories">
            <HiOutlineCollection className="mx-5 cursor-pointer hidden lg:block" size={25} color={isActive("/sub-subcategories")} />
          </Link>

          <Link href="/coupons">
            <AiOutlineGift className="mx-5 cursor-pointer hidden lg:block" size={25} color={isActive("/coupons")} />
          </Link>
          <Link href="/sales">
            <CiMoneyBill className="mx-5 cursor-pointer hidden lg:block" size={28} color={isActive("/sales")} />
          </Link>
          <Link href="/refunds">
            <HiOutlineReceiptRefund className="mx-5 cursor-pointer hidden lg:block" size={25} color={isActive("/refunds")} />
          </Link>
          <Link href="/inbox">
            <BiMessageSquareDetail className="mx-5 cursor-pointer hidden lg:block" size={25} color={isActive("/inbox")} />
          </Link>
          <Link href="/bank">
            <CiBank className="mx-5 cursor-pointer hidden lg:block" size={25} color={isActive("/bank")} />
          </Link>
          <Link href="/settings">
            <CiSettings className="mx-5 cursor-pointer hidden lg:block" size={25} color={isActive("/settings")} />
          </Link>

          {/* 🔔 Notifications */}
          <div
            className="relative mx-5 cursor-pointer hidden lg:block"
            onClick={toggleNotifications}
          >
            <FaBell size={22} className="text-green-600" />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notificationCount}
              </span>
            )}

            {/* Notifications Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-[260px] bg-white shadow-lg rounded-md border border-gray-200 z-50">
                <div className="px-4 py-2 font-semibold border-b">Notifications</div>
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <span>{n.message}</span>
                      <button
                        onClick={() => dispatch(deleteAdminNotification(n._id))}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Notification"
                      >
                        <FiTrash size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
                )}
              </div>
            )}
          </div>

          {/* 🔓 Logout */}
          <button
            onClick={handleAdminLogout}
            className="mx-5 cursor-pointer hidden lg:block bg-transparent border-none"
          >
            <LuLogOut size={25} color="#555" />
          </button>

          {/* 👤 Avatar */}
          <Link href={`/admin/${adminInfo?._id}`} className="inline-block">
            <Image
              src={adminInfo?.avatar?.url || "/images/admin-placeholder.png"}
              alt={adminInfo?.name ? `${adminInfo.name} avatar` : "Admin avatar"}
              width={50}
              height={50}
              className="rounded-full object-cover"
              sizes="50px"
              // unoptimized
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
