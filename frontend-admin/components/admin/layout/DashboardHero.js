import React, { useEffect } from 'react';
import {
  FaTruck,
  FaBoxOpen,
  FaTimesCircle,
  FaCheckCircle,
  FaDollarSign,
  FaShoppingCart,
  FaChartLine,
  FaCrown,
} from 'react-icons/fa';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import WeeklyTrendsChart from '../charts/WeeklyTrendsChart';
import { fetchAdminDashboardStats, fetchWeeklyTrends } from '@/redux/adminSlice';
import Loader from './Loader';

const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
};

const StatCard = ({ title, value, icon, trend, trendUp }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2 active:scale-[0.98] transition">
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">{title}</span>
      <span className="text-lg text-gray-400">{icon}</span>
    </div>

    <div className="flex items-end justify-between">
      <p className="text-xl font-semibold text-gray-800 leading-tight">{value}</p>
      {trend && (
        <span className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
      )}
    </div>
  </div>
);

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { dashboardStats, weeklyTrends, isLoading, adminInfo } = useSelector((state) => state.admin);

  const displayName = adminInfo?.name?.split(' ')[0] || adminInfo?.email;

  useEffect(() => {
    if (!adminInfo) return;
    dispatch(fetchAdminDashboardStats());
    dispatch(fetchWeeklyTrends());
  }, [dispatch, adminInfo]);

  if (isLoading || !dashboardStats) return <Loader />;

  const stats = [
    {
      title: "Today's Orders",
      value: dashboardStats.ordersToday,
      icon: <FaCheckCircle className="text-green-500" />,
    },
    {
      title: "Processing",
      value: dashboardStats.pendingOrders,
      icon: <FaTruck className="text-yellow-500" />,
    },
    {
      title: "Delivered",
      value: dashboardStats.deliveredOrders,
      icon: <FaBoxOpen className="text-blue-500" />,
    },
    {
      title: "Cancelled",
      value: dashboardStats.canceledOrders || 0,
      icon: <FaTimesCircle className="text-red-500" />,
    },
  ];

  const salesStats = [
    {
      title: "Today",
      value: formatNaira(dashboardStats.todaySales),
      icon: <FaDollarSign />,
      trend: dashboardStats.todaySalesTrend ? `${dashboardStats.todaySalesTrend}%` : null,
      trendUp: dashboardStats.todaySalesTrend > 0,
    },
    {
      title: "Yesterday",
      value: formatNaira(dashboardStats.yesterdaySales),
      icon: <FaDollarSign />,
    },
    {
      title: "This Month",
      value: formatNaira(dashboardStats.thisMonthSales),
      icon: <FaChartLine />,
    },
    {
      title: "All Time",
      value: formatNaira(dashboardStats.allTimeSales),
      icon: <FaChartLine />,
    },
    {
      title: "Avg Order",
      value: formatNaira(dashboardStats.avgOrderValue),
      icon: <FaShoppingCart />,
    },
    {
      title: "Best Seller",
      value: dashboardStats.bestSellingProduct || "N/A",
      icon: <FaCrown />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-5">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Hi, {displayName}
          </h1>
          <p className="text-xs text-gray-500">Store overview</p>
        </div>

      <Link href="/admin/products">
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-600 active:scale-[0.97] transition-all duration-200">
          
          {/* Optional icon */}
          <span className="text-base">📦</span>

          Manage Products
        </button>
      </Link>
      </div>

      {/* Orders */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Sales */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {salesStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Chart */}
      {!isLoading && weeklyTrends.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Weekly Trend</h2>
          <p className="text-xs text-gray-400 mb-3">Last 7 days</p>
          <WeeklyTrendsChart trends={weeklyTrends} />
        </div>
      )}
    </div>
  );
};

export default DashboardHero;
