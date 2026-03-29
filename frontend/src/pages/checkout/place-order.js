import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper, Step, StepLabel } from "@mui/material";
import { toast } from "react-toastify";
import { HiOutlineMinus, HiPlus, HiOutlineTrash } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import {
  resetCheckout,
  setOrderItems,
  setPaymentMethod,
  setShippingAddress,
} from "@/redux/slices/checkoutSlice";
import { createOrder } from "@/redux/slices/orderSlice";
import { removeItemFromCart } from "@/redux/slices/cartSlice";
import fallbackImage from "../../../public/images/fallbackImage.jpg";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

// Format Nigerian Naira
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

// Shipping thresholds in NGN
const FREE_SHIPPING_THRESHOLD = 50000; // ₦50,000
const SHIPPING_COST = 5000; // ₦5,000

const steps = ["User Login", "Shipping Address", "Payment Method", "Place Order"];

const PlaceOrder = ({ categories }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { shippingAddress, paymentMethod, orderItems } = useSelector(
    (state) => state.checkout
  );

  const [totalItemPrice, setTotalItemPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const storedShippingAddress =
      JSON.parse(localStorage.getItem("shippingAddress")) || null;
    const storedPaymentMethod = localStorage.getItem("paymentMethod") || "";

    dispatch(setOrderItems(storedCartItems));
    if (storedShippingAddress) dispatch(setShippingAddress(storedShippingAddress));
    if (storedPaymentMethod) dispatch(setPaymentMethod(storedPaymentMethod));
  }, [dispatch]);

  // Recalculate totals whenever orderItems changes
  useEffect(() => {
    const newTotalItemPrice = orderItems.reduce(
      (acc, item) =>
        acc + (item.discountPrice ?? item.originalPrice ?? 0) * (item.qty ?? 1),
      0
    );
    const newShippingCost =
      newTotalItemPrice > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    setTotalItemPrice(newTotalItemPrice);
    setShippingCost(newShippingCost);
    setFinalTotal(newTotalItemPrice + newShippingCost);
  }, [orderItems]);

  const handlePlaceOrder = () => {
    const newOrder = {
      items:
        orderItems?.map((item) => ({
          productId: item._id,
          name: item.name,
          quantity: item.qty,
          price: item.discountPrice || item.originalPrice,
          vendorId: item.vendorId,
        })) || [],
      user: userInfo?._id,
      shippingAddress: shippingAddress
        ? {
            fullName: userInfo?.name,
            address: shippingAddress.street,
            city: shippingAddress.city,
            postalCode: shippingAddress.zipCode,
            country: shippingAddress.country || "Nigeria",
          }
        : null,
      totalPrice: finalTotal,
      status: "processing",
      paymentInfo: {
        method: paymentMethod || "Cash on Delivery",
        status: "Pending",
      },
    };

    dispatch(createOrder(newOrder))
      .unwrap()
      .then(() => {
        toast.success("Order placed successfully!");
        dispatch(resetCheckout());
        router.push("/order-success");
      })
      .catch((error) => {
        toast.error(`Order failed: ${error.message}`);
      });
  };

  const increment = (item) => {
    if (item.stock < item.qty + 1) {
      toast.error("Product stock limited!");
    } else {
      const newQty = item.qty + 1;
      const updatedItems = orderItems.map((orderItem) =>
        orderItem._id === item._id ? { ...orderItem, qty: newQty } : orderItem
      );
      dispatch(setOrderItems(updatedItems));
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    }
  };

  const decrement = (item) => {
    if (item.qty === 1) {
      const updatedItems = orderItems.filter(
        (orderItem) => orderItem._id !== item._id
      );
      dispatch(removeItemFromCart(item._id));
      dispatch(setOrderItems(updatedItems));
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    } else {
      const newQty = item.qty - 1;
      const updatedItems = orderItems.map((orderItem) =>
        orderItem._id === item._id ? { ...orderItem, qty: newQty } : orderItem
      );
      dispatch(setOrderItems(updatedItems));
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header categories={categories} />

      {/* Stepper */}
      <div className="flex justify-center py-6 px-4">
        <Stepper activeStep={3} alternativeLabel className="w-full max-w-2xl">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left column – details */}
        <div className="flex-1 space-y-6">
          {isMounted && userInfo && shippingAddress && orderItems.length > 0 && (
            <Card className="shadow-md rounded-xl overflow-hidden border border-gray-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{userInfo?.name}</p>
                  <p className="text-gray-600 text-sm">{userInfo?.email}</p>
                  <p className="text-gray-700 mt-2">
                    {shippingAddress?.street}, {shippingAddress?.zipCode},{" "}
                    {shippingAddress?.city}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-gray-300"
                  onClick={() => router.push("/checkout/shipping-address")}
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          )}

          {isMounted && paymentMethod && orderItems.length > 0 && (
            <Card className="shadow-md rounded-xl overflow-hidden border border-gray-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
                <p className="text-gray-700">{paymentMethod}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-gray-300"
                  onClick={() => router.push("/checkout/payment-method")}
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          {isMounted && orderItems.length > 0 ? (
            <Card className="shadow-md rounded-xl overflow-hidden border border-gray-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Order Items</h3>
                <div className="hidden md:grid grid-cols-4 gap-4 pb-3 border-b text-gray-500 text-sm font-medium">
                  <span>Item</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Action</span>
                </div>
                {orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col md:grid md:grid-cols-4 gap-4 py-4 border-b last:border-0"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-3">
                      <Link href={`/product/${item._id}`} passHref>
                        <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.images?.[0]?.url || fallbackImage}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                            sizes="64px"
                          />
                        </div>
                      </Link>
                      <span className="text-sm font-medium line-clamp-2">
                        {item.name}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-start md:justify-center gap-2">
                      <button
                        onClick={() => decrement(item)}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                      >
                        <HiOutlineMinus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => increment(item)}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                      >
                        <HiPlus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right md:text-right">
                      <span className="font-semibold text-gray-800">
                        {formatNaira((item.discountPrice || item.originalPrice) * item.qty)}
                      </span>
                    </div>

                    {/* Remove */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          const updatedItems = orderItems.filter(
                            (i) => i._id !== item._id
                          );
                          dispatch(removeItemFromCart(item._id));
                          dispatch(setOrderItems(updatedItems));
                          localStorage.setItem(
                            "cartItems",
                            JSON.stringify(updatedItems)
                          );
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Your cart is empty.</p>
              <Button
                onClick={() => router.push("/")}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>

        {/* Right column – Order Summary */}
        <div className="w-full lg:w-1/3">
          <Card className="shadow-md rounded-xl overflow-hidden border border-gray-100 sticky top-24">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Items</span>
                  <span>{formatNaira(totalItemPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? "Free" : formatNaira(shippingCost)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span>{formatNaira(finalTotal)}</span>
                </div>
              </div>
              <Button
                onClick={handlePlaceOrder}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-6"
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export async function getServerSideProps() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const categoriesRes = await axios.get(`${baseURL}/api/categories`);
    return {
      props: {
        categories: categoriesRes?.data?.categories || [],
      },
    };
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return { props: { categories: [] } };
  }
}

export default PlaceOrder;