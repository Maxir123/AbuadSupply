//payment method
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
  "& .MuiStepLabel-label": { fontWeight: "600", color: "#9E9E9E", },
  "& .Mui-active .MuiStepLabel-label": { color: "#E44343", },
  "& .Mui-completed .MuiStepLabel-label": { color: "#4CAF50", },
}));

const PaymentMethod = ({ categories }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedPayment, setSelectedPayment] = useState("cash-on-delivery"); 

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setPaymentMethod(selectedPayment)); 
    router.push("/checkout/place-order");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header categories={categories} />

      <div className="flex justify-center py-4">
        <Stepper activeStep={2} alternativeLabel className="w-full max-w-2xl">
          {steps.map((label) => (
            <Step key={label}>
              <CustomStepLabel>{label}</CustomStepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl space-y-4"
        >
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="cash-on-delivery"
              checked={selectedPayment === "cash-on-delivery"}
              readOnly
            />
            <span>Cash On Delivery</span>
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            Continue →
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

export default PaymentMethod;

