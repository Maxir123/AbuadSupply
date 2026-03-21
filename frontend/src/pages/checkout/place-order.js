import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper, Step, StepLabel } from "@mui/material";
import { toast } from "react-toastify";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { resetCheckout, setOrderItems, setPaymentMethod, setShippingAddress} from "@/redux/slices/checkoutSlice";
import { createOrder } from "@/redux/slices/orderSlice";
import fallbackImage from "../../../public/images/fallbackImage.jpg";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { removeItemFromCart } from "@/redux/slices/cartSlice";

const steps = ["User Login", "Shipping Address", "Payment Method", "Place Order"];

const PlaceOrder = ({ categories }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { shippingAddress, paymentMethod, orderItems } = useSelector(
    (state) => state.checkout
  );

  const [totalItemPrice, setTotalItemPrice] = useState(0);
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
    if (storedShippingAddress)
      dispatch(setShippingAddress(storedShippingAddress));
    if (storedPaymentMethod) dispatch(setPaymentMethod(storedPaymentMethod));
  }, [dispatch]);

  const handlePlaceOrder = () => {
    const newOrder = {
      items:
        orderItems?.map((item) => ({
          productId: item._id,
          name: item.name,
          quantity: item.qty, // ✅ Changed to quantity
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
            country: shippingAddress.country || "Sweden",
          }
        : null,
      totalPrice: orderItems.reduce(
        (acc, item) =>
          acc + (item.discountPrice || item.originalPrice) * item.qty,
        0
      ),
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

  useEffect(() => {
    const newTotalItemPrice = orderItems.reduce(
      (acc, item) =>
        acc + (item.discountPrice ?? item.originalPrice ?? 0) * (item.qty ?? 1),
      0
    );

    const newShippingCost = newTotalItemPrice > 50 ? 0 : 4.99;
    setTotalItemPrice(newTotalItemPrice);
    setFinalTotal(newTotalItemPrice + newShippingCost);
  }, [orderItems]);

  const increment = (item) => {
    if (item.stock < item.qty + 1) {
      toast.error("Product stock limited!");
    } else {
      const newQty = item.qty + 1;

      // Update Redux orderItems
      const updatedItems = orderItems.map((orderItem) =>
        orderItem._id === item._id ? { ...orderItem, qty: newQty } : orderItem
      );
      dispatch(setOrderItems(updatedItems));

      // Update localStorage
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

      // Update Redux orderItems
      const updatedItems = orderItems.map((orderItem) =>
        orderItem._id === item._id ? { ...orderItem, qty: newQty } : orderItem
      );
      dispatch(setOrderItems(updatedItems));

      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header categories={categories} />
      {/* Stepper Indicator */}
      <div className="flex justify-center py-6">
        <Stepper activeStep={3} alternativeLabel className="w-full max-w-2xl">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className="flex-grow container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {isMounted && userInfo && shippingAddress && orderItems.length > 0 && (
              <Card className="shadow-xl rounded-lg p-3 bg-white">
                <CardContent>
                  <h3 className="text-2xl font-semibold mb-4">
                    Shipping Address
                  </h3>
                  <p className="text-lg">{userInfo?.name}</p>
                  <p className="text-gray-600 text-lg">
                    {userInfo?.email}, {shippingAddress?.street},{" "}
                    {shippingAddress?.zipCode}, {shippingAddress?.city}
                  </p>
                  <Button
                    variant="outline"
                    size="medium"
                    className="mt-6 w-auto px-6 py-2 text-left border-gray-400 text-gray-800 hover:bg-gray-100"
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            )}

          {isMounted && paymentMethod && orderItems.length > 0 && (
            <Card className="shadow-xl rounded-lg p-3 bg-white">
              <CardContent>
                <h3 className="text-2xl font-semibold mb-4">Payment Method</h3>
                <p className="text-lg text-gray-600">{paymentMethod}</p>
                <Button
                  variant="outline"
                  size="medium"
                  className="mt-6 w-auto px-6 py-2 text-left border-gray-400 text-gray-800 hover:bg-gray-100"
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          {isMounted && orderItems.length > 0 ? (
            <Card className="shadow-xl rounded-lg p-2 bg-white">
              <CardContent>
                <h3 className="text-2xl font-semibold mb-4">Order Items</h3>
                <div className="border-b pb-3 flex justify-between text-gray-500 text-lg font-semibold">
                  <span className="w-1/3 text-left">Item</span>
                  <span className="w-1/3 text-center">Quantity</span>
                  <span className="w-1/3 text-right">Price</span>
                </div>

                {/* Order Items */}
                {orderItems?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 border-b"
                  >
                    <div className="w-1/3 flex items-center space-x-6">
                      <Link href={`/product/${item.id}`} passHref>
                        <Image
                          src={item.images?.[0]?.url || fallbackImage} 
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-md"
                        />
                      </Link>
                      <span className="text-lg">{item.name}</span>
                    </div>

                    <div className="w-1/3 flex items-center justify-center gap-3">
                      <div
                        className="bg-[#e44343] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
                        onClick={() => decrement(item)}
                      >
                        <HiOutlineMinus size={16} color="#fff" />
                      </div>

                      <span className="text-lg">{item.qty}</span>

                      <div
                        className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
                        onClick={() => increment(item)}
                      >
                        <HiPlus size={18} color="#000" />
                      </div>
                    </div>
                    <span className="w-1/3 text-right text-lg font-semibold">
                      ${item.discountPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center mt-8">
              <p className="text-xl text-gray-600">Your cart is empty.</p>
              <Button
                onClick={() => router.push("/")}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Continue Shopping
              </Button>
            </div>          
          )}
        </div>

        <div className="w-full lg:w-1/3">
          <Card className="shadow-xl rounded-lg p-3 bg-white">
            <CardContent>
              <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 text-lg">
                <div className="flex justify-between text-gray-700">
                  <span>Items</span>
                  <span>${totalItemPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>${(totalItemPrice > 50 ? 0 : 4.99).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={handlePlaceOrder}
                className="w-full bg-black text-white p-3 rounded-lg mt-6 hover:bg-gray-900 text-lg"
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
    const categoriesRes = await axios
      .get(`${baseURL}/api/categories`)
      .catch((err) => {
        console.error("Categories Error:", err);
        return null;
      });

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
