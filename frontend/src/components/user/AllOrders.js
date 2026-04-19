// Third-party library imports
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Chip, Card, CardContent, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import { format } from 'date-fns';
import Link from 'next/link';

// Local imports (Redux slices)
import { getUserAllOrders } from '@/redux/slices/orderSlice';
import { setOrderItems } from '@/redux/slices/checkoutSlice';
import ProductTable from '../common/ProductTable';

// Format Nigerian Naira
const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

// Status chip colors
const statusConfig = {
  processing: { label: 'Processing', color: 'warning' },
  shipped: { label: 'Shipped', color: 'info' },
  delivered: { label: 'Delivered', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'error' },
  'processing refund': { label: 'Processing refund', color: 'warning' },
  refund_approved: { label: 'Refund Approved', color: 'success' },
  refund_rejected: { label: 'Refund Rejected', color: 'error' },
};

const AllOrders = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
  if (userInfo && userInfo._id && !isLoading) {
    dispatch(getUserAllOrders(userInfo._id));
    dispatch(setOrderItems([]));
  }
}, [dispatch, userInfo?._id, isLoading]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Handle errors
  useEffect(() => {
    if (error) {
      setOpenSnackbar(true);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <CircularProgress color="primary" />
      </div>
    );
  }

  const rows = orders.map((order) => ({
    id: order._id,
    date: order.createdAt,
    total: order.totalPrice,
    paid: order.isPaid,
    status: order.status?.toLowerCase(),
  }));

  const hasOrders = rows.length > 0;

  // Mobile order card component
  const OrderCard = ({ order }) => {
    const status = statusConfig[order.status] || { label: order.status || 'Pending', color: 'default' };
    const paidStatus = order.paid ? 'Paid' : 'Unpaid';
    const paidColor = order.paid ? 'success' : 'warning';

    return (
      <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
              #{order.id.slice(-8)}
            </Typography>
            <Chip label={status.label} size="small" color={status.color} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(order.date), 'MMM dd, yyyy HH:mm')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" fontWeight="500">
              Total: {formatNaira(order.total)}
            </Typography>
            <Chip label={paidStatus} size="small" color={paidColor} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Link href={`/user/orders/${order.id}`} passHref>
              <Button variant="contained" size="small">
                Details
              </Button>
            </Link>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Desktop columns for ProductTable
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        const id = params.value;
        const lastSixDigits = id.slice(-6);
        return <span className="font-mono text-sm">{`...${lastSixDigits}`}</span>;
      },
    },
    {
      field: 'date',
      headerName: 'DATE',
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => {
        const formattedDate = format(new Date(params.value), 'MMM dd, yyyy HH:mm');
        return <span className="text-sm">{formattedDate}</span>;
      },
    },
    {
      field: 'total',
      headerName: 'TOTAL',
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => <span className="font-semibold">{formatNaira(params.value)}</span>,
    },
    {
      field: 'paid',
      headerName: 'PAID',
      minWidth: 100,
      flex: 0.6,
      renderCell: (params) =>
        params.value ? (
          <Chip label="Yes" size="small" color="success" />
        ) : (
          <Chip label="No" size="small" color="warning" />
        ),
    },
    {
      field: 'status',
      headerName: 'STATUS',
      minWidth: 130,
      flex: 0.8,
      renderCell: (params) => {
        const status = statusConfig[params.value] || { label: params.value || 'Pending', color: 'default' };
        return <Chip label={status.label} size="small" color={status.color} />;
      },
    },
    {
      field: 'preview',
      headerName: 'Preview',
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Link href={`/user/orders/${params.row.id}`} passHref>
          <Button variant="contained" color="primary" size="small">
            Details
          </Button>
        </Link>
      ),
    },
  ];

  const tableRows = rows.map((order) => ({
    id: order.id,
    date: order.date,
    total: order.total,
    paid: order.paid,
    status: order.status,
  }));

  return (
    <div className="w-full bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <i className="fas fa-tags text-blue-500 text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Order List</h1>
            <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
              {orders?.length || 0}
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
                    rows={tableRows}
                    columns={columns}
                    getRowId={(row) => row.id}
                  />
                </div>
              )}

              {/* Mobile: Cards */}
              {isMobile && (
                <div className="p-4">
                  {rows.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <i className="fas fa-box-open text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                You haven&apos;t placed any orders. Start shopping to see your orders here.
              </p>
              <Link href="/" passHref>
                <Button variant="contained" color="primary" sx={{ mt: 3, textTransform: 'none' }}>
                  Browse Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Snackbar for error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error?.message || 'An unexpected error occurred.'}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AllOrders;