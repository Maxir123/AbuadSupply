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

const steps = [ "User Login", "Shipping Address", "Payment Method","Place Order" ];

const ShippingAddress = ({ categories }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { orderItems } = useSelector( (state) => state.checkout );
  console.log("userInfo", userInfo)
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

    // Also update the cart slice for HeaderUpper
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
  const shippingCost = totalItemPrice > 50 ? 0 : 4.99;
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header categories={categories} />

      {/* Stepper Indicator */}
      <div className="flex justify-center py-6">
        <Stepper activeStep={1} alternativeLabel className="w-full max-w-2xl">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {/* Shipping Address Card */}
          {userInfo && orderItems.length > 0 && (
            <Card className="shadow-xl rounded-lg p-6 bg-white">
              <CardContent>
                <h3 className="text-2xl font-semibold mb-4">
                  Shipping Address
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-400 text-gray-800 hover:bg-gray-100"
                  onClick={() => {
                      if (!userInfo?._id) {
                        toast.info("Please sign in to add a shipping address.");
                        router.push(`/user/login?redirect=${encodeURIComponent(router.asPath)}`);
                        return;
                      }
                      setAddOpen(true);
                    }} 
                 >
                  Add New
                </Button>
                {addresses.length > 1 && (
                  <div className="mb-4">
                    <Typography className="text-gray-700 font-medium">
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
                      className="mt-2"
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
                  <div className="text-lg text-gray-700">
                    <p>{userInfo?.name}</p>
                    <p>{userInfo?.email}</p>
                    <p>
                      {selectedAddress.street}, {selectedAddress.zipCode},{" "}
                      {selectedAddress.city}, {selectedAddress.country}
                    </p>
                    <Button
                      variant="outline"
                      size="medium"
                      className="mt-6 w-auto px-6 py-2 border-gray-400 text-gray-800 hover:bg-gray-100"
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
            <Card className="shadow-xl rounded-lg p-6 bg-white">
              <CardContent>
                <h3 className="text-2xl font-semibold mb-4">Order Items</h3>
                <div className="border-b pb-3 flex justify-between text-gray-500 text-lg font-semibold">
                  <span className="w-1/4 text-left">Item</span>
                  <span className="w-1/4 text-center">Quantity</span>
                  <span className="w-1/4 text-right">Price</span>
                  <span className="w-1/4 text-right">Action</span>
                </div>
                {orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between py-4 border-b"
                  >
                    {/* Product Info */}
                    <div className="w-1/4 flex items-center space-x-6">
                      <Link href={`/product/${item._id}`} passHref>
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

                    {/* Quantity Controls */}
                    <div className="w-1/4 flex items-center justify-center gap-3">
                      <div
                        className={`rounded-full w-[25px] h-[25px] flex items-center justify-center ${
                          item.qty > 1
                            ? "bg-[#e44343] cursor-pointer"
                            : "bg-gray-300 cursor-not-allowed opacity-50"
                        }`}
                        onClick={() =>
                          item.qty > 1 && handleDecrement(item._id)
                        }
                      >
                        <HiOutlineMinus size={16} color="#fff" />
                      </div>
                      <span className="text-lg">{item.qty}</span>
                      <div
                        className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
                        onClick={() => handleIncrement(item._id)}
                      >
                        <HiPlus size={18} color="#000" />
                      </div>
                    </div>

                    {/* Price */}
                    <div className="w-1/4 text-right">
                      <span className="text-lg font-semibold">
                        ${(item.discountPrice * item.qty).toFixed(2)}
                      </span>
                    </div>

                    {/* Remove Button */}
                    <div className="w-1/4 text-right flex justify-end">
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center mt-8">
              <p className="text-xl text-gray-600">
                Your cart is empty. Please add items to your cart.
              </p>
              <Link href="/" passHref>
                <Button className="mt-4 bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Order Summary Card */}
        <div className="w-full lg:w-1/3">
          <Card className="shadow-xl rounded-lg p-6 bg-white">
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
              {orderItems.length > 0 && (
                <Button
                  onClick={handleContinueToPayment}
                  className="w-full bg-black text-white p-3 rounded-lg mt-6 hover:bg-gray-900 text-lg"
                >
                  Continue to Payment
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Add address Modal */}
        <Dialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add New Address</DialogTitle>
          <DialogContent dividers>
            {/* Country */}
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

            {/* State */}
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

            {/* City */}
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
                // basic validation
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

                // match the payload shape used in Address.js
                const addressData = {
                  country: addrForm.country.name,
                  state: addrForm.state.name,
                  city: addrForm.city.name,
                  street: addrForm.street.trim(),
                  zipCode: addrForm.zipCode.trim(),
                  addressType: addrForm.addressType,
                };

                // dispatch thunk
                const result = await dispatch(addUserAddress(addressData));

                if (result.type === "user/addUserAddress/fulfilled") {
                  // optimistic select for checkout right away
                  handleAddressSelection(addressData);

                  // UX niceties
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

export default ShippingAddress;
