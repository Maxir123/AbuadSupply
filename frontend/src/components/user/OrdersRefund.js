// Third-party library imports
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { AiOutlineArrowRight } from 'react-icons/ai';

// Local imports
import { getUserAllOrders } from '@/redux/slices/orderSlice';
import Loader from '../vendor/layout/Loader';
import ProductTable from '../common/ProductTable';

const OrdersRefund = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!userInfo || !userInfo.email) {
      Router.push('/user/login');
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(getUserAllOrders(userInfo._id));
    }
  }, [dispatch, userInfo?._id]);

  if (!isClient || !userInfo || !userInfo.email) {
    return <Loader />;
  }

  const eligibleRefunds = orders.filter((order) => order.status === 'refund_approved');

  const columns = [
    { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => {
        const status = params.row.status;

        let color = 'text-gray-800';
        if (status === 'Processing refund') color = 'text-amber-600';
        else if (status === 'refund_approved') color = 'text-emerald-600';
        else if (status === 'refund_rejected') color = 'text-red-500';

        const label = status
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return <span className={`font-semibold ${color}`}>{label}</span>;
      },
    },
    {
      field: 'itemsQty',
      headerName: 'Items Qty',
      type: 'number',
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      minWidth: 130,
      flex: 0.8,
      renderCell: (params) => (
        <span className="font-semibold">₦ {params.value}</span>
      ),
    },
    {
      field: 'action',
      flex: 1,
      minWidth: 150,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params) => (
        <Link href={`/user/orders/track/${params.id}`} legacyBehavior>
          <a className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
            <AiOutlineArrowRight size={18} />
          </a>
        </Link>
      ),
    },
  ];

  const rows = eligibleRefunds.map((order) => ({
    id: order._id,
    itemsQty: order.items?.length || 0,
    total: order.totalPrice?.toFixed(2) || '0.00',
    status: order.status,
  }));

  const hasRefunds = rows.length > 0;

  return (
    <div className="w-full bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <i className="fas fa-receipt text-blue-500 text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Refunded Orders</h1>
            <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
              {eligibleRefunds.length}
            </span>
          </div>
        </div>

        {/* Orders Table / Empty State */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {hasRefunds ? (
            <div className="overflow-x-auto">
              <ProductTable
                rows={rows}
                columns={columns}
                getRowId={(row) => row.id}
              />
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <i className="fas fa-receipt text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No refunded orders
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                You don't have any approved refunds yet. When an order is refunded, it will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersRefund;