// Third-party library imports
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AiOutlineArrowRight } from 'react-icons/ai';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';

// Local imports
import { getUserAllOrders } from '@/redux/slices/orderSlice';
import Loader from '../vendor/layout/Loader';
import ProductTable from '../common/ProductTable';

// Format Nigerian Naira
const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

// Status mapping (for chips)
const statusConfig = {
  refund_approved: { label: 'Refund Approved', color: 'success' },
  'Processing refund': { label: 'Processing Refund', color: 'warning' },
  refund_rejected: { label: 'Refund Rejected', color: 'error' },
};

const OrdersRefund = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  const [isClient, setIsClient] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setIsClient(true);
    if (!userInfo || !userInfo.email) {
      router.push('/user/login');
    }
  }, [userInfo, router]);

  useEffect(() => {
    if (userInfo?._id && !isLoading) {
      dispatch(getUserAllOrders(userInfo._id));
    }
  }, [dispatch, userInfo?._id]);

  if (!isClient || !userInfo) {
    return <Loader />;
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="max-w-7xl mx-auto px-4 py-8">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const eligibleRefunds = orders.filter((order) => order.status === 'refund_approved');

  // Desktop columns
  const columns = [
    {
      field: 'id',
      headerName: 'Order ID',
      minWidth: 150,
      flex: 0.7,
      renderCell: (params) => (
        <span className="font-mono text-sm">{`...${params.value.slice(-6)}`}</span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => {
        const status = params.row.status;
        const config = statusConfig[status] || { label: status, color: 'default' };
        return <Chip label={config.label} size="small" color={config.color} />;
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
        <span className="font-semibold">{formatNaira(params.value)}</span>
      ),
    },
    {
      field: 'action',
      flex: 1,
      minWidth: 150,
      headerName: '',
      sortable: false,
      renderCell: (params) => (
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
            <AiOutlineArrowRight size={16} />
          </Button>
        </Link>
      ),
    },
  ];

  const rows = eligibleRefunds.map((order) => ({
    id: order._id,
    itemsQty: order.items?.length || 0,
    total: order.totalPrice || 0,
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

        {/* Orders Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {hasRefunds ? (
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
                              endIcon={<AiOutlineArrowRight />}
                              sx={{ textTransform: 'none' }}
                            >
                              View Order
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