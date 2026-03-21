// Third-party library imports
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BsFillBagFill } from 'react-icons/bs';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { toast } from 'react-toastify';

// Local imports
import { fetchMyOrder, refundOrderRequest, getUserAllOrders } from '@/redux/slices/orderSlice';
import styles from '@/styles/styles';

const OrderDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const { singleOrder, successMessage, error } = useSelector(state => state.orders);
  const { userInfo } = useSelector(state => state.user);

  useEffect(() => {
    if (id) dispatch(fetchMyOrder(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (successMessage) toast.success(successMessage);
    if (error) toast.error(error);
    dispatch({ type: 'clearMessages' });
    dispatch({ type: 'clearErrors' });
  }, [dispatch, successMessage, error]);

  const refundHandler = async () => {
    try {
      const result = await dispatch(refundOrderRequest({ orderId: id, status: "Processing refund" }));

      if (result.type === "orders/refundOrderRequest/fulfilled") {
        toast.success(result.payload.message);
        dispatch(getUserAllOrders(userInfo?._id));
      } else {
        throw new Error(result.payload || "Refund request failed.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  if (!singleOrder) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-gray-500">Loading order details...</div>
      </div>
    );
  }

  const statusColor = {
    processing: 'text-amber-600 bg-amber-50',
    shipped: 'text-sky-600 bg-sky-50',
    delivered: 'text-emerald-600 bg-emerald-50',
    cancelled: 'text-red-500 bg-red-50',
  }[singleOrder.status?.toLowerCase()] || 'text-gray-600 bg-gray-50';

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
              <p className="font-medium">{new Date(singleOrder?.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                {singleOrder?.status || 'Pending'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <p className="font-medium capitalize">{singleOrder?.paymentInfo?.method || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Customer's Cart */}
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
                  <p className="font-semibold text-gray-900">₦ {item.price?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
            <p className="text-sm font-medium text-gray-500">Total:</p>
            <p className="text-lg font-bold text-gray-900 ml-2">₦ {singleOrder?.totalPrice?.toLocaleString()}</p>
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
        {singleOrder?.status !== 'cancelled' && singleOrder?.status !== 'refunded' && (
          <div className="flex justify-end">
            <button
              onClick={refundHandler}
              className="px-6 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors font-medium text-sm"
            >
              Request Refund
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;