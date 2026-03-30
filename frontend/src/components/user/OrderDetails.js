// Third-party library imports
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BsFillBagFill } from 'react-icons/bs';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { toast } from 'react-toastify';

// Local imports
import { fetchMyOrder, refundOrderRequest, getUserAllOrders } from '@/redux/slices/orderSlice';
import styles from '@/styles/styles';

// Format Nigerian Naira
const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

// Status badge styles
const statusConfig = {
  processing: { label: 'Processing', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  shipped: { label: 'Shipped', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  delivered: { label: 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' },
  'processing refund': { label: 'Processing refund', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  refund_approved: { label: 'Refund Approved', color: 'bg-green-50 text-green-700 border-green-200' },
  refund_rejected: { label: 'Refund Rejected', color: 'bg-gray-50 text-gray-700 border-gray-200' },
};

const OrderDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const { singleOrder, successMessage, error, isLoading } = useSelector(state => state.orders);
  const { userInfo } = useSelector(state => state.user);
  const [isRefunding, setIsRefunding] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchMyOrder(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (successMessage) toast.success(successMessage);
    if (error) toast.error(error);
    // Clear messages/errors from store
    dispatch({ type: 'clearMessages' });
    dispatch({ type: 'clearErrors' });
  }, [dispatch, successMessage, error]);

  const refundHandler = async () => {
    if (!window.confirm('Are you sure you want to request a refund? This action cannot be undone.')) return;
    setIsRefunding(true);
    try {
      const result = await dispatch(refundOrderRequest({ orderId: id, status: "Processing refund" }));
      if (result.type === "orders/refundOrderRequest/fulfilled") {
        toast.success(result.payload.message);
        dispatch(getUserAllOrders(userInfo?._id));
        router.push('/user/orders');
      } else {
        throw new Error(result.payload || "Refund request failed.");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsRefunding(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading order details...</div>
      </div>
    );
  }

  if (!singleOrder) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-red-500">Order not found.</div>
      </div>
    );
  }

  const orderStatus = singleOrder?.status?.toLowerCase();
  const status = statusConfig[orderStatus] || { label: singleOrder?.status || 'Pending', color: 'bg-gray-50 text-gray-600' };
  const canRequestRefund = !['cancelled', 'refunded', 'processing refund', 'refund_approved'].includes(orderStatus);

  return (
    <div className={`${styles.section} bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BsFillBagFill size={24} className="text-blue-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Order Details</h1>
          </div>
          <Link
            href="/user/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <IoIosArrowRoundBack size={24} />
            <span className="font-medium">Back to Orders</span>
          </Link>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="font-mono text-sm font-medium">{singleOrder?._id?.slice(-8)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Date</p>
              <p className="font-medium">{new Date(singleOrder?.createdAt).toLocaleDateString('en-NG')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                {status.label}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <p className="font-medium capitalize">{singleOrder?.paymentInfo?.method || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {singleOrder?.items?.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 mt-2 sm:mt-0">
                  <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  <p className="font-semibold text-gray-900">{formatNaira(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
            <p className="text-sm font-medium text-gray-500">Total:</p>
            <p className="text-lg font-bold text-gray-900 ml-2">{formatNaira(singleOrder?.totalPrice)}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h2>
          <div className="text-gray-600">
            <p className="font-medium">{singleOrder?.shippingAddress?.fullName}</p>
            <p>{singleOrder?.shippingAddress?.address}</p>
            <p>{singleOrder?.shippingAddress?.city}, {singleOrder?.shippingAddress?.postalCode}</p>
            <p>{singleOrder?.shippingAddress?.country}</p>
          </div>
        </div>

        {/* Refund Button */}
        {canRequestRefund && (
          <div className="flex justify-end">
            <button
              onClick={refundHandler}
              disabled={isRefunding}
              className="px-6 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRefunding ? 'Processing...' : 'Request Refund'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;