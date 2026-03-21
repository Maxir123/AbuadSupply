// Third-party library imports
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { MdTrackChanges } from 'react-icons/md';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';

// Local imports
import { getUserAllOrders } from '@/redux/slices/orderSlice';
import ProductTable from '../common/ProductTable';

const OrderTracker = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(getUserAllOrders(userInfo._id));
    }
  }, [dispatch, userInfo?._id]);

  const columns = [
    {
      field: 'id',
      headerName: 'ORDER ID',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <span className="font-mono text-sm">{`...${params.value.slice(-6)}`}</span>
      ),
    },
    {
      field: 'status',
      headerName: 'STATUS',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const status = params.row.status;
        const statusConfig = {
          processing: { label: 'Processing', color: 'text-amber-600 bg-amber-50' },
          shipped: { label: 'Shipped', color: 'text-sky-600 bg-sky-50' },
          delivered: { label: 'Delivered', color: 'text-emerald-600 bg-emerald-50' },
          cancelled: { label: 'Cancelled', color: 'text-red-500 bg-red-50' },
          refunded: { label: 'Refunded', color: 'text-emerald-600 bg-emerald-50' },
          'Processing refund': { label: 'Processing Refund', color: 'text-amber-600 bg-amber-50' },
          refund_approved: { label: 'Refund Approved', color: 'text-emerald-600 bg-emerald-50' },
          refund_rejected: { label: 'Refund Rejected', color: 'text-red-500 bg-red-50' },
        };
        const config = statusConfig[status] || { label: status, color: 'text-gray-600 bg-gray-50' };
        return (
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      field: 'itemsQty',
      headerName: 'ITEMS QTY',
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => <span className="font-medium">{params.value}</span>,
    },
    {
      field: 'total',
      headerName: 'TOTAL',
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => <span className="font-semibold">₦ {params.value}</span>,
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      minWidth: 120,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Tooltip title="Track Order" arrow>
            <Link href={`/user/orders/track/${params.id}`} passHref>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 'auto',
                  padding: '6px 10px',
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: '#eff6ff',
                  },
                }}
              >
                <MdTrackChanges size={16} />
              </Button>
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  const rows = orders.map((order) => ({
    id: order._id,
    itemsQty: order.cart?.length || 0,
    total: order.totalPrice ? order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00',
    status: order.status,
  }));

  const hasOrders = rows.length > 0;

  return (
    <div className="w-full bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MdTrackChanges size={24} className="text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Track Orders</h1>
            <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
              {orders.length}
            </span>
          </div>
        </div>

        {/* Orders Table / Empty State */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {hasOrders ? (
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
                <MdTrackChanges size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders to track
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                You haven't placed any orders yet. When you do, you can track them here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;