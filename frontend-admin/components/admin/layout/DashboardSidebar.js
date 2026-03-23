import React from "react";
import {
  MdOutlineDashboard,
  MdCategory,
} from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { CiBank, CiMoneyBill, CiSettings } from "react-icons/ci";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund, HiOutlineCollection } from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";
import { IoMdPeople } from "react-icons/io";
import { FaStoreAlt } from "react-icons/fa";
import { AiOutlineGift } from "react-icons/ai";
import { RiSubscript2 } from "react-icons/ri";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { logoutAdmin } from "@/redux/adminSlice";

const DashboardSideBar = ({ active }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleAdminLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap();
      toast.success("You have logged out successfully!");
      router.push("/auth/login");
    } catch (error) {
      toast.error(error || "Failed to log out.");
      console.error("Logout Error:", error);
    }
  };

  const navItems = [
    { id: 1, href: "/dashboard", icon: MdOutlineDashboard, label: "Dashboard" },
    { id: 2, href: "/customers", icon: IoMdPeople, label: "Customers" },
    { id: 3, href: "/vendors", icon: FaStoreAlt, label: "Vendors" },
    { id: 4, href: "/orders", icon: FiShoppingBag, label: "Orders" },
    { id: 5, href: "/products", icon: FiPackage, label: "Products" },
    { id: 6, href: "/categories", icon: MdCategory, label: "Categories" },
    { id: 7, href: "/subcategories", icon: RiSubscript2, label: "Subcategories" },
    { id: 8, href: "/sub-subcategories", icon: HiOutlineCollection, label: "Sub-subcategories" },
    { id: 9, href: "/coupons", icon: AiOutlineGift, label: "Coupons" },
    { id: 10, href: "/sales", icon: CiMoneyBill, label: "Sales" },
    { id: 11, href: "/refunds", icon: HiOutlineReceiptRefund, label: "Refunds" },
    { id: 12, href: "/inbox", icon: BiMessageSquareDetail, label: "Inbox" },
    { id: 13, href: "/bank", icon: CiBank, label: "Bank" },
    { id: 14, href: "/settings", icon: CiSettings, label: "Settings" },
  ];

  return (
    <div className="w-full h-screen bg-white/80 backdrop-blur-sm shadow-xl rounded-r-2xl overflow-y-auto sticky top-0 left-0 z-10 flex flex-col border-r border-gray-100/50">
      {/* Optional: Admin profile summary */}
      <div className="p-6 border-b border-gray-100/80 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center text-white font-semibold shadow-md">
            A
          </div>
          <div className="hidden 800px:block">
            <h3 className="font-semibold text-gray-800">Admin Panel</h3>
            <p className="text-xs text-gray-500">Manage platform</p>
          </div>
        </div>
      </div>

      <div className="flex-grow px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                  ? "bg-gradient-to-r from-blue-50/80 to-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50/70 hover:text-gray-900"
                }
              `}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-400 rounded-r-full" />
              )}
              <Icon
                size={20}
                className={`transition-colors ${isActive ? "text-blue-500" : "text-gray-500 group-hover:text-gray-700"}`}
              />
              <h5 className={`
                text-[14px] font-medium tracking-wide hidden 800px:block
                ${isActive ? "text-blue-600" : "text-gray-600 group-hover:text-gray-800"}
              `}>
                {item.label}
              </h5>
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100/80 mt-auto">
        <button
          onClick={handleAdminLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50/80 hover:bg-red-500 text-gray-700 hover:text-white transition-all duration-200 group"
        >
          <LuLogOut size={20} className="text-gray-500 group-hover:text-white transition-colors" />
          <h5 className="text-[14px] font-medium hidden 800px:block group-hover:text-white">
            Logout
          </h5>
        </button>
      </div>
    </div>
  );
};

export default DashboardSideBar;