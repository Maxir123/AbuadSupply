import React, { useEffect } from 'react';
import { FaTruck, FaBoxOpen, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import WeeklyTrendsChart from '../charts/WeeklyTrendsChart';
import { fetchAdminDashboardStats, fetchWeeklyTrends } from '@/redux/adminSlice';
import Loader from './Loader';

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { dashboardStats, weeklyTrends, isLoading } = useSelector((state) => state.admin);
  const { adminInfo } = useSelector((state) => state.admin);
  const displayName = adminInfo?.name?.split(" ")[0] || adminInfo?.email;

  useEffect(() => {
    if (!adminInfo) return;
    dispatch(fetchAdminDashboardStats());
    dispatch(fetchWeeklyTrends());
     if (!adminInfo.name) {
    dispatch(fetchAdminProfile());
  }
  }, [dispatch, adminInfo]);


  if (isLoading || !dashboardStats) return <Loader />;
  return (
    <div className="w-full p-4 md:p-8 rounded-md bg-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
        <div className="mb-3 sm:mb-0">
          <h1 className="text-lg sm:text-xl font-semibold">Welcome {displayName}</h1>
          <p className="text-xs sm:text-sm text-gray-600">Monitor overall site statistics.</p>
        </div>
        <Link href="/admin/products">
          <button className="bg-blue-600 text-white px-3 py-1 text-xs sm:text-sm rounded">
            Manage Products
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

          {/* Orders Confirmed (assumed same as Today Orders) */}
          <div className="bg-green-100 p-3 sm:p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaCheckCircle className="text-lg sm:text-xl text-green-600 mr-2" />
              <span className="text-sm sm:text-base">Today’s Orders</span>
            </div>
            <span className="text-lg sm:text-xl font-bold">
              {dashboardStats?.ordersToday}
            </span>
          </div>

          {/* Orders in Transit (Processing) */}
          <div className="bg-yellow-100 p-3 sm:p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaTruck className="text-lg sm:text-xl text-yellow-600 mr-2" />
              <span className="text-sm sm:text-base">Processing Orders</span>
            </div>
            <span className="text-lg sm:text-xl font-bold">
              {dashboardStats?.pendingOrders}
            </span>
          </div>

          {/* Orders Delivered */}
          <div className="bg-blue-100 p-3 sm:p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaBoxOpen className="text-lg sm:text-xl text-blue-600 mr-2" />
              <span className="text-sm sm:text-base">Delivered Orders</span>
            </div>
            <span className="text-lg sm:text-xl font-bold">
              {dashboardStats?.deliveredOrders}
            </span>
          </div>

          {/* Orders Cancelled */}
          <div className="bg-red-100 p-3 sm:p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaTimesCircle className="text-lg sm:text-xl text-red-600 mr-2" />
              <span className="text-sm sm:text-base">Cancelled Orders</span>
            </div>
            <span className="text-lg sm:text-xl font-bold">
              {dashboardStats?.canceledOrders || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Sales" value={`$${dashboardStats?.todaySales.toFixed(2)}`} bg="bg-green-200" icon={<FaCheckCircle className="text-green-600" />} />
        <StatCard title="Yesterday's Sales" value={`$${dashboardStats?.yesterdaySales.toFixed(2)}`} bg="bg-orange-200" />
        <StatCard title="This Month" value={`$${dashboardStats?.thisMonthSales.toFixed(2)}`} bg="bg-blue-200" />
        <StatCard title="All Time Sales" value={`$${dashboardStats?.allTimeSales.toFixed(2)}`} bg="bg-emerald-300" />
        <StatCard title="Avg. Order Value" value={`$${dashboardStats?.avgOrderValue}`} bg="bg-purple-200" />
        <StatCard title="Best Seller" value={dashboardStats?.bestSellingProduct} bg="bg-pink-200" />
      </div>

      {!isLoading && weeklyTrends.length > 0 && (
        <div className="mt-6">
          <WeeklyTrendsChart trends={weeklyTrends} />
        </div>     
      )}
    </div>
  );
};

const StatCard = ({ title, value, bg, icon }) => (
  <div className={`${bg} p-4 rounded-lg shadow flex flex-col gap-1`}>
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      {icon && <div className="text-lg">{icon}</div>}
    </div>
    <p className="text-lg font-bold text-gray-900">{value}</p>
  </div>
);

export default DashboardHero;
