import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";
import { CiBank, CiMoneyBill, CiSettings } from "react-icons/ci";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logoutVendor } from "@/redux/slices/vendorSlice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { BsAlexa } from "react-icons/bs";
import { IoIosAddCircle, IoMdAdd } from "react-icons/io";

const DashboardSideBar = ({ active }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleVendorLogout = async () => {
    try {
      const result = await dispatch(logoutVendor());
      if (result.type === "vendor/logoutVendor/fulfilled") {
        toast.success("You have logged out successfully!");
        router.push("/vendor/login");
      } else {
        toast.error("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("An unexpected error occurred during logout.");
    }
  };

  const navItems = [
    { id: 1, href: "/vendor/dashboard", icon: MdOutlineDashboard, label: "Dashboard" },
    { id: 2, href: "/vendor/orders", icon: FiShoppingBag, label: "Orders" },
    { id: 3, href: "/vendor/products", icon: FiPackage, label: "Products" },
    { id: 4, href: "/vendor/create-product", icon: IoMdAdd, label: "Create Product" },
    { id: 5, href: "/vendor/sales", icon: BsAlexa, label: "Sales" },
    { id: 6, href: "/vendor/create-flash-sale", icon: IoIosAddCircle, label: "Create Sale" },
    { id: 7, href: "/vendor/withdraw", icon: CiMoneyBill, label: "Withdraw Money" },
    { id: 8, href: "/vendor/bank-info", icon: CiBank, label: "Bank" },
    { id: 9, href: "/vendor/inbox", icon: BiMessageSquareDetail, label: "Inbox" },
    { id: 10, href: "/vendor/coupons", icon: AiOutlineGift, label: "Coupons" },
    { id: 11, href: "/vendor/refunds", icon: HiOutlineReceiptRefund, label: "Refunds" },
    { id: 12, href: "/vendor/settings", icon: CiSettings, label: "Settings" },
  ];

  return (
    <div className="w-full h-[94vh] bg-white/90 backdrop-blur-md shadow-xl rounded-r-2xl overflow-y-auto sticky top-0 left-0 z-10 flex flex-col border-r border-gray-100/50">
      {/* Optional: Vendor Profile Summary */}
      <div className="p-6 border-b border-gray-100/80 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-orange-400 flex items-center justify-center text-white font-semibold shadow-md">
            V
          </div>
          <div className="hidden 800px:block">
            <h3 className="font-semibold text-gray-800">Vendor Space</h3>
            <p className="text-xs text-gray-500">manage your store</p>
          </div>
        </div>
      </div>

      <div className="flex-grow px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = active === item.id;
          const IconComponent = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                  ? "bg-gradient-to-r from-red-50/80 to-white text-red-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50/70 hover:text-gray-900"
                }
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-red-500 to-orange-400 rounded-r-full" />
              )}

              <IconComponent
                size={20}
                className={`transition-colors ${isActive ? "text-red-500" : "text-gray-500 group-hover:text-gray-700"}`}
              />
              <h5 className={`
                text-[14px] font-medium tracking-wide hidden 800px:block
                ${isActive ? "text-red-600" : "text-gray-600 group-hover:text-gray-800"}
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
          onClick={handleVendorLogout}
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