import React from "react";
import {
  FaClock,
  FaCheckCircle,
  FaBox,
  FaTruck,
  FaBoxOpen,
  FaTimesCircle,
  FaUndo,
  FaBan,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";

const DashboardHero = () => {
  const { vendorInfo } = useSelector((state) => state.vendors);

  // Format Nigerian Naira with ₦ symbol
  const formatNaira = (amount) => {
    // Use Nigerian locale and currency symbol
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
    // This outputs "₦10,023.50" for 10023.5
  };

  // Order status data (could be dynamic from state)
  const orderStats = [
    { label: "Pending", count: 3, icon: FaClock, color: "bg-yellow-100 text-yellow-600" },
    { label: "Confirmed", count: 4, icon: FaCheckCircle, color: "bg-green-100 text-green-600" },
    { label: "Packaging", count: 1, icon: FaBox, color: "bg-blue-100 text-blue-600" },
    { label: "Out For Delivery", count: 2, icon: FaTruck, color: "bg-indigo-100 text-indigo-600" },
    { label: "Delivered", count: 10, icon: FaBoxOpen, color: "bg-emerald-100 text-emerald-600" },
    { label: "Cancelled", count: 1, icon: FaTimesCircle, color: "bg-red-100 text-red-600" },
    { label: "Returned", count: 1, icon: FaUndo, color: "bg-amber-100 text-amber-600" },
    { label: "Failed To Deliver", count: 2, icon: FaBan, color: "bg-rose-100 text-rose-600" },
  ];

  // Wallet data (static for UI demo)
  const walletItems = [
    {
      label: "Withdrawable Balance",
      amount: 10023.5,
      icon: "/icons/wallet.svg",
      action: { text: "Withdraw", link: "/vendor/withdraw" },
    },
    {
      label: "Pending Withdraw",
      amount: 50.0,
      icon: "/icons/load.svg",
    },
    {
      label: "Total Commission Given",
      amount: 6394.47,
      icon: "/icons/commission.svg",
    },
    {
      label: "Already Withdrawn",
      amount: 600.0,
      icon: "/icons/withdrawal.svg",
    },
    {
      label: "Total Delivery Charge Earned",
      amount: 822.0,
      icon: "/icons/delivery.svg",
    },
    {
      label: "Total Tax Given",
      amount: 1000.0,
      icon: "/icons/taxes.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome back, {vendorInfo?.name || vendorInfo?.email?.split("@")[0] || "Vendor"}!
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your store today.
          </p>
        </div>
        <Link href="/vendor/products">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition duration-200">
            Manage Products
          </button>
        </Link>
      </div>

      {/* Order Analytics Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Order Analytics</h2>
          <button className="text-sm text-gray-500 hover:text-gray-700 mt-2 sm:mt-0">
            Last 30 days
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {orderStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition duration-200"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-gray-800">{stat.count}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Wallet Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Vendor Wallet</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {walletItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-gray-600 text-sm font-medium">{item.label}</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-3">
                {formatNaira(item.amount)}
              </p>
              {item.action && (
                <Link href={item.action.link}>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition">
                    {item.action.text}
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;