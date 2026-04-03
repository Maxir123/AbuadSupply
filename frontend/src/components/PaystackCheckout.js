// components/PaystackCheckout.js
import { usePaystackPayment } from "react-paystack";
import { Button } from "@/components/ui/button";

const PaystackCheckout = ({ config, onSuccess, onClose, disabled, children }) => {
  const initializePayment = usePaystackPayment(config);

  const handleClick = () => {
    initializePayment(onSuccess, onClose);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-lg mt-6 text-lg"
    >
      {children}
    </Button>
  );
};

export default PaystackCheckout;