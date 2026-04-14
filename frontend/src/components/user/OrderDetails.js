// Third-party library imports
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BsFillBagFill } from 'react-icons/bs';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { AiOutlineStar } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { Modal, Box, Rating, TextField, Button, CircularProgress, Typography } from '@mui/material';

// Local imports
import { fetchMyOrder, refundOrderRequest, getUserAllOrders } from '@/redux/slices/orderSlice';
import { createProductReview } from '@/redux/slices/productSlice';
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

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedProductIds, setReviewedProductIds] = useState([]);

  useEffect(() => {
    if (id) dispatch(fetchMyOrder(id));
  }, [dispatch, id]);

  // Initialize reviewed product IDs from order items if they have a hasReviewed flag
  useEffect(() => {
    if (singleOrder?.items) {
      const reviewed = singleOrder.items
        .filter(item => item.hasReviewed)
        .map(item => item.productId);
      setReviewedProductIds(reviewed);
    }
  }, [singleOrder]);

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

  const openReviewModal = (product) => {
    setSelectedProduct(product);
    setReviewData({ rating: 0, comment: '' });
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedProduct(null);
  };

  const submitReview = async () => {
    if (!reviewData.rating) {
      toast.error('Please select a rating');
      return;
    }

    setSubmittingReview(true);
    try {
      const result = await dispatch(createProductReview({
        productId: selectedProduct.productId,
        rating: reviewData.rating,
        comment: reviewData.comment.trim(),
        user: userInfo,
      }));

      if (result.type.endsWith('/fulfilled')) {
        toast.success('Review submitted successfully!');
        // Mark product as reviewed locally
        setReviewedProductIds(prev => [...prev, selectedProduct.productId]);
        closeReviewModal();
      } else {
        toast.error(result.payload || 'Failed to submit review');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setSubmittingReview(false);
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
            {singleOrder?.items?.map((item) => {
              const isReviewed = reviewedProductIds.includes(item.productId);
              return (
                <div key={item._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 mt-2 sm:mt-0">
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    <p className="font-semibold text-gray-900">{formatNaira(item.price)}</p>
                    {/* Review Button */}
                    <button
                      onClick={() => openReviewModal(item)}
                      disabled={isReviewed}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        isReviewed
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      {isReviewed ? 'Reviewed' : (
                        <span className="flex items-center gap-1">
                          <AiOutlineStar size={16} /> Write Review
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
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

        {/* Review Modal */}
        <Modal open={reviewModalOpen} onClose={closeReviewModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 500 },
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" className="mb-4">
              Review {selectedProduct?.name}
            </Typography>
            <div className="flex items-center gap-2 mb-4">
              <Rating
                name="product-rating"
                value={reviewData.rating}
                onChange={(e, newVal) => setReviewData({ ...reviewData, rating: newVal || 0 })}
                precision={1}
                size="large"
              />
              <span className="text-sm text-gray-500">{reviewData.rating} / 5</span>
            </div>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your review (optional)"
              placeholder="Share your experience with this product..."
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              variant="outlined"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={closeReviewModal} variant="outlined">Cancel</Button>
              <Button onClick={submitReview} variant="contained" disabled={submittingReview}>
                {submittingReview ? <CircularProgress size={24} /> : 'Submit Review'}
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default OrderDetails;