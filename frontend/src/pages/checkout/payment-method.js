import { useState } from "react";
import { useRouter } from "next/router";
import { Stepper, Step, StepLabel } from "@mui/material";
import { styled } from "@mui/system";
import { useDispatch } from "react-redux";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import axios from "axios";
import { setPaymentMethod } from "@/redux/slices/checkoutSlice";

const steps = ["User Login", "Shipping Address", "Payment Method", "Place Order"];

const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepLabel-label": { fontWeight: "600", color: "#9E9E9E" },
  "& .Mui-active .MuiStepLabel-label": { color: "#E44343" },
  "& .Mui-completed .MuiStepLabel-label": { color: "#4CAF50" },
}));

const PaymentMethod = ({ categories }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // State to track which radio button is selected
  const [selectedPayment, setSelectedPayment] = useState("cash-on-delivery");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save the selection to Redux
    dispatch(setPaymentMethod(selectedPayment)); 
    // Navigate to the final step
    router.push("/checkout/place-order");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header categories={categories} />

      {/* Stepper Progress Bar */}
      <div className="flex justify-center py-4">
        <Stepper activeStep={2} alternativeLabel className="w-full max-w-2xl">
          {steps.map((label) => (
            <Step key={label}>
              <CustomStepLabel>{label}</CustomStepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      {/* Main Form Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Choose Payment Method</h2>
        
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg space-y-6"
        >
          {/* Cash On Delivery Option */}
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="payment"
              value="cash-on-delivery"
              checked={selectedPayment === "cash-on-delivery"}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="w-5 h-5 text-blue-600"
            />
            <div className="ml-4">
              <span className="block font-semibold text-gray-700">Cash On Delivery</span>
              <span className="text-sm text-gray-500">Pay when your order is delivered</span>
            </div>
          </label>

          {/* Paystack Option */}
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="payment"
              value="paystack"
              checked={selectedPayment === "paystack"}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="w-5 h-5 text-blue-600"
            />
            <div className="ml-4">
              <span className="block font-semibold text-gray-700">Paystack (Card/Transfer)</span>
              <span className="text-sm text-gray-500">Secure online payment via Paystack</span>
            </div>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-transform active:scale-95"
          >
            Continue to Order Summary →
          </button>
        </form>
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
        console.error("Categories Fetch Error:", err.message);
        return null;
      });

    return {
      props: {
        categories: categoriesRes?.data?.categories || [],
      },
    };
  } catch (error) {
    console.error("Critical Error in getServerSideProps:", error.message);
    return { props: { categories: [] } };
  }
}

export default PaymentMethod;