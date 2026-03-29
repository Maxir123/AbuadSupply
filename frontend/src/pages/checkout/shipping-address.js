// React & Next
import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
// Utils
import axios from "axios";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";
// UI – internal
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// UI – external
import {
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select as MSelect,
} from "@mui/material";
import { HiOutlineMinus, HiOutlineTrash, HiPlus } from "react-icons/hi";
// Redux slices
import {
  resetCheckout,
  setOrderItems,
  setShippingAddress,
} from "@/redux/slices/checkoutSlice";
import { removeItemFromCart } from "@/redux/slices/cartSlice";
import { addUserAddress } from "@/redux/slices/userSlice";
// Assets
import fallbackImage from "../../../public/images/fallbackImage.jpg";

// Format Nigerian Naira
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const steps = ["User Login", "Shipping Address", "Payment Method", "Place Order"];

// Shipping threshold and cost in NGN
const FREE_SHIPPING_THRESHOLD = 50000; // ₦50,000
const SHIPPING_COST = 5000; // ₦5,000

const ShippingAddress = ({ categories }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { orderItems } = useSelector((state) => state.checkout);
  const addresses = useMemo(
    () => (Array.isArray(userInfo?.addresses) ? userInfo.addresses : []),
    [userInfo?.addresses]
  );
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const hasRedirected = useRef(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addrForm, setAddrForm] = useState({
    country: null,
    state: null,
    city: null,
    street: "",
    zipCode: "",
    addressType: "Home",
  });

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    dispatch(setOrderItems(storedCartItems));

    const storedShippingAddress =
      JSON.parse(localStorage.getItem("shippingAddress")) || null;
    if (storedShippingAddress) {
      dispatch(setShippingAddress(storedShippingAddress));
      setSelectedAddress(storedShippingAddress);
    }
    setIsMounted(true);
  }, [dispatch]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const homeAddress =
        addresses.find((addr) => addr.addressType === "Home") || addresses[0];
      setSelectedAddress(homeAddress);
      dispatch(setShippingAddress(homeAddress));
      localStorage.setItem("shippingAddress", JSON.stringify(homeAddress));
    }
  }, [addresses, selectedAddress, dispatch]);

  // Redirect when cart becomes empty
  useEffect(() => {
    if (isMounted && orderItems.length === 0 && !hasRedirected.current) {
      hasRedirected.current = true;
      localStorage.removeItem("shippingAddress");
      dispatch(resetCheckout());
      router.push("/");
    }
  }, [orderItems, isMounted, dispatch, router]);

  const handleAddressSelection = (address) => {
    setSelectedAddress(address);
    dispatch(setShippingAddress(address));
    localStorage.setItem("shippingAddress", JSON.stringify(address));
  };

  const handleContinueToPayment = () => {
    if (selectedAddress) {
      dispatch(setShippingAddress(selectedAddress));
      localStorage.setItem("shippingAddress", JSON.stringify(selectedAddress));
      router.push("/checkout/payment-method");
    } else {
      toast.error("Please select or add a shipping address.");
    }
  };

  const handleIncrement = (itemId) => {
    const updatedItems = orderItems.map((item) =>
      item._id === itemId ? { ...item, qty: item.qty + 1 } : item
    );
    dispatch(setOrderItems(updatedItems));
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const handleDecrement = (itemId) => {
    const updatedItems = orderItems.map((item) =>
      item._id === itemId
        ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 }
        : item
    );
    dispatch(setOrderItems(updatedItems));
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = orderItems.filter((item) => item._id !== itemId);
    dispatch(setOrderItems(updatedItems));
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    dispatch(removeItemFromCart(itemId));

    if (updatedItems.length === 0 && isMounted && !hasRedirected.current) {
      hasRedirected.current = true;
      dispatch(resetCheckout());
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  const totalItemPrice = orderItems.reduce(
    (acc, item) => acc + (item.discountPrice || item.originalPrice) * item.qty,
    0
  );
  const shippingCost = totalItemPrice > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const finalTotal = totalItemPrice + shippingCost;

  const countryOptions = Country.getAllCountries();
  const stateOptions = addrForm.country
    ? State.getStatesOfCountry(addrForm.country.isoCode)
    : [];
  const cityOptions =
    addrForm.country && addrForm.state
      ? City.getCitiesOfState(addrForm.country.isoCode, addrForm.state.isoCode)
      : [];

  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header categories={categories} />

      {/* Stepper Indicator */}
      <div className="flex justify-center py-6 px-4">
        <Stepper activeStep={1} alternativeLabel className="w-full max-w-2xl">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {/* Shipping Address Card */}
          {userInfo && orderItems.length > 0 && (
            <Card className="shadow-md rounded-xl overflow-hidden border border-gray-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="mb-4 border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    if (!userInfo?._id) {
                      toast.info("Please sign in to add a shipping address.");
                      router.push(
                        `/user/login?redirect=${encodeURIComponent(router.asPath)}`
                      );
                      return;
                    }
                    setAddOpen(true);
                  }}
                >
                  + Add New Address
                </Button>
                {addresses.length > 1 && (
                  <div className="mb-4">
                    <Typography className="text-gray-700 font-medium mb-1">
                      Select Address
                    </Typography>
                    <MSelect
                      fullWidth
                      value={selectedAddress?.addressType || ""}
                      onChange={(e) => {
                        const newAddress = addresses.find(
                          (addr) => addr.addressType === e.target.value
                        );
                        handleAddressSelection(newAddress);
                      }}
                      className="mt-1"
                    >
                      {addresses.map((addr) => (
                        <MenuItem key={addr._id} value={addr.addressType}>
                          {addr.addressType} - {addr.street}
                        </MenuItem>
                      ))}
                    </MSelect>
                  </div>
                )}
                {selectedAddress ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{userInfo?.name}</p>
                    <p className="text-gray-600 text-sm">{userInfo?.email}</p>
                    <p className="text-gray-700 mt-2">
                      {selectedAddress.street}, {selectedAddress.zipCode},{" "}
                      {selectedAddress.city}, {selectedAddress.country}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 border-gray-300"
                    >
                      Edit
                    </Button>
                  </div>
                ) : (
                  <Typography className="text-gray-500">
                    No saved addresses. Click <b>Add New</b> to enter one.
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}

          {/* Order Items Card */}
          {orderItems.length > 0 ? (
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
                        onClick={() => item.qty > 1 && handleDecrement(item._id)}
                        disabled={item.qty <= 1}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 transition"
                      >
                        <HiOutlineMinus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleIncrement(item._id)}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                      >
                        <HiPlus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right md:text-right">
                      <span className="font-semibold text-gray-800">
                        {formatNaira(item.discountPrice * item.qty)}
                      </span>
                    </div>

                    {/* Remove Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleRemoveItem(item._id)}
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
              <Link href="/">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Order Summary Card */}
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
                    {shippingCost === 0
                      ? "Free"
                      : formatNaira(shippingCost)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span>{formatNaira(finalTotal)}</span>
                </div>
              </div>
              {orderItems.length > 0 && (
                <Button
                  onClick={handleContinueToPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-6"
                >
                  Continue to Payment
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Address Modal */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel>Country</InputLabel>
            <MSelect
              label="Country"
              value={addrForm.country?.isoCode || ""}
              onChange={(e) => {
                const country = countryOptions.find(
                  (c) => c.isoCode === e.target.value
                );
                setAddrForm({
                  country,
                  state: null,
                  city: null,
                  street: "",
                  zipCode: "",
                  addressType: addrForm.addressType,
                });
              }}
            >
              {countryOptions.map((c) => (
                <MenuItem key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </MenuItem>
              ))}
            </MSelect>
          </FormControl>

          <FormControl fullWidth margin="normal" disabled={!addrForm.country}>
            <InputLabel>State/Region</InputLabel>
            <MSelect
              label="State/Region"
              value={addrForm.state?.isoCode || ""}
              onChange={(e) => {
                const state = stateOptions.find(
                  (s) => s.isoCode === e.target.value
                );
                setAddrForm((prev) => ({ ...prev, state, city: null }));
              }}
            >
              {stateOptions.map((s) => (
                <MenuItem key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </MenuItem>
              ))}
            </MSelect>
          </FormControl>

          <FormControl fullWidth margin="normal" disabled={!addrForm.state}>
            <InputLabel>City</InputLabel>
            <MSelect
              label="City"
              value={addrForm.city?.name || ""}
              onChange={(e) => {
                const city = cityOptions.find(
                  (c) => c.name === e.target.value
                );
                setAddrForm((prev) => ({ ...prev, city }));
              }}
            >
              {cityOptions.map((c) => (
                <MenuItem key={c.name} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </MSelect>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Street *"
            value={addrForm.street}
            onChange={(e) =>
              setAddrForm((prev) => ({ ...prev, street: e.target.value }))
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Zip Code *"
            value={addrForm.zipCode}
            onChange={(e) =>
              setAddrForm((prev) => ({ ...prev, zipCode: e.target.value }))
            }
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Address Type</InputLabel>
            <MSelect
              label="Address Type"
              value={addrForm.addressType}
              onChange={(e) =>
                setAddrForm((prev) => ({
                  ...prev,
                  addressType: e.target.value,
                }))
              }
            >
              {["Home", "Work", "Other"].map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </MSelect>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button variant="outline" onClick={() => setAddOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (
                !addrForm.country ||
                !addrForm.state ||
                !addrForm.city ||
                !addrForm.street.trim() ||
                !addrForm.zipCode.trim()
              ) {
                toast.error("Please fill all the fields!");
                return;
              }
              const addressData = {
                country: addrForm.country.name,
                state: addrForm.state.name,
                city: addrForm.city.name,
                street: addrForm.street.trim(),
                zipCode: addrForm.zipCode.trim(),
                addressType: addrForm.addressType,
              };
              const result = await dispatch(addUserAddress(addressData));
              if (result.type === "user/addUserAddress/fulfilled") {
                handleAddressSelection(addressData);
                toast.success(result.payload?.message || "Address added");
                setAddOpen(false);
                setAddrForm({
                  country: null,
                  state: null,
                  city: null,
                  street: "",
                  zipCode: "",
                  addressType: "Home",
                });
              } else {
                toast.error(result.payload || "Failed to add address");
              }
            }}
          >
            Add Address
          </Button>
        </DialogActions>
      </Dialog>

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

export default ShippingAddress;