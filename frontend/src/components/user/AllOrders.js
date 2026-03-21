// Third-party library imports
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from '@mui/material';
import { format } from 'date-fns';
import Link from 'next/link';

// Local imports (Redux slices)
import { getUserAllOrders } from '@/redux/slices/orderSlice';
import { setOrderItems } from '@/redux/slices/checkoutSlice';
import ProductTable from '../common/ProductTable';

const AllOrders = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo && userInfo._id && !isLoading) {
      dispatch(getUserAllOrders(userInfo._id));
      dispatch(setOrderItems([]));
    }
  }, [dispatch, userInfo?._id]);

  const mockOrders = orders.length === 0 ? [] : orders;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <CircularProgress color="primary" />
      </div>
    );
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

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
        const formattedDate = format(new Date(params.value), 'MMM dd, yyyy HH:mm:ss');
        return <span className="text-sm">{formattedDate}</span>;
      },
    },
    {
      field: 'total',
      headerName: 'TOTAL',
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => <span className="font-semibold">{params.value}</span>,
    },
    {
      field: 'paid',
      headerName: 'PAID',
      minWidth: 100,
      flex: 0.6,
      renderCell: (params) =>
        params.value ? (
          <span className="text-emerald-600 font-semibold">Yes</span>
        ) : (
          <span className="text-amber-600 font-semibold">No</span>
        ),
    },
    {
      field: 'status',
      headerName: 'STATUS',
      minWidth: 130,
      flex: 0.8,
      renderCell: (params) => {
        const status = params.value;

        let statusColor;
        switch (status) {
          case 'processing':
            statusColor = 'text-amber-600';
            break;
          case 'shipped':
            statusColor = 'text-sky-600';
            break;
          case 'delivered':
            statusColor = 'text-emerald-600';
            break;
          case 'cancelled':
            statusColor = 'text-red-500';
            break;
          default:
            statusColor = 'text-gray-500';
        }

        return <span className={`${statusColor} font-semibold`}>{status}</span>;
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

  const rows = mockOrders.map((order) => ({
    id: order._id || Math.random().toString(36).substring(2, 9),
    date: order.createdAt,
    total:
      order.totalPrice && typeof order.totalPrice === 'number'
        ? `₦ ${order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '₦ 0.00',
    paid: order.isPaid,
    status: order.status,
  }));

  const hasOrders = rows.length > 0;

  return (
    <div className="w-full bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
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
                <i className="fas fa-box-open text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                You haven't placed any orders. Start shopping to see your orders here.
              </p>
              <Link href="/" passHref>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, textTransform: 'none' }}
                >
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