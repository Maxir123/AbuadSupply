// Third-party library imports
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { MdTrackChanges } from 'react-icons/md';
import Button from '@mui/material/Button';
import { Tooltip, CircularProgress, Alert, Chip, Box, Typography, Card, CardContent, CardActions, Divider, useMediaQuery, useTheme } from '@mui/material';

// Local imports
import { getUserAllOrders } from '@/redux/slices/orderSlice';
import ProductTable from '../common/ProductTable';

// Format Nigerian Naira
const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

// Status chip mapping
const statusConfig = {
  processing: { label: 'Processing', color: 'warning' },
  shipped: { label: 'Shipped', color: 'info' },
  delivered: { label: 'Delivered', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'error' },
  refunded: { label: 'Refunded', color: 'success' },
  'Processing refund': { label: 'Processing Refund', color: 'warning' },
  refund_approved: { label: 'Refund Approved', color: 'success' },
  refund_rejected: { label: 'Refund Rejected', color: 'error' },
};

const OrderTracker = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  const [isClient, setIsClient] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(getUserAllOrders(userInfo._id));
    }
  }, [dispatch, userInfo?._id]);

  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </div>
    );
  }

  const rows = orders.map((order) => ({
    id: order._id,
    itemsQty: order.items?.length || 0,
    total: order.totalPrice,
    status: order.status?.toLowerCase(),
  }));

  const hasOrders = rows.length > 0;

  // Desktop columns
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
        const config = statusConfig[status] || { label: status, color: 'default' };
        return <Chip label={config.label} size="small" color={config.color} />;
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
      renderCell: (params) => <span className="font-semibold">{formatNaira(params.value)}</span>,
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

        {/* Orders Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {hasOrders ? (
            <>
              {/* Desktop: Table */}
              {!isMobile && (
                <div className="overflow-x-auto">
                  <ProductTable
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.id}
                  />
                </div>
              )}

              {/* Mobile: Cards */}
              {isMobile && (
                <div className="p-4">
                  {rows.map((order) => {
                    const config = statusConfig[order.status] || { label: order.status, color: 'default' };
                    return (
                      <Card
                        key={order.id}
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          border: '1px solid #f0f0f0',
                        }}
                      >
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                              #{order.id.slice(-8)}
                            </Typography>
                            <Chip label={config.label} size="small" color={config.color} />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Items: {order.itemsQty}
                          </Typography>
                          <Typography variant="body2" fontWeight="500" sx={{ mt: 0.5 }}>
                            Total: {formatNaira(order.total)}
                          </Typography>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: 'flex-end', p: 1.5 }}>
                          <Link href={`/user/orders/track/${order.id}`} passHref>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<MdTrackChanges />}
                              sx={{ textTransform: 'none' }}
                            >
                              Track Order
                            </Button>
                          </Link>
                        </CardActions>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <MdTrackChanges size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders to track
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                You haven&apos;t placed any orders yet. When you do, you can track them here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;