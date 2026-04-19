// Third-party imports
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { Box, Typography, Button, TextField, IconButton, Card, CardContent, Grid, Collapse } from "@mui/material";
import { toast } from "react-toastify";
import Image from "next/image";

// Local imports
import { addPaymentMethod, deletePaymentMethod } from "@/redux/slices/userSlice";

const PaymentMethod = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const [isClient, setIsClient] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleAddPaymentMethod = async () => {
    try {
      const result = await dispatch(addPaymentMethod(cardDetails));

      if (result.type === "user/addPaymentMethod/fulfilled") {
        toast.success(result.payload.message);
        setCardDetails({
          cardHolderName: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
        });
        setShowForm(false);
      } else {
        toast.error(result.payload);
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast.error("Failed to add payment method. Please try again.");
    }
  };

  const handleDeletePaymentMethod = async () => {
    try {
      const result = await dispatch(deletePaymentMethod());

      if (result.type === "user/deletePaymentMethod/fulfilled") {
        toast.success(result.payload.message);
      } else {
        toast.error(result.payload);
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error("Failed to delete payment method. Please try again.");
    }
  };

  return (
    <Box className="w-full bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <Box className="max-w-7xl mx-auto">
        {/* Header */}
        <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Box className="flex items-center gap-2">
            <Box className="p-2 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </Box>
            <Typography variant="h5" component="h1" className="text-2xl font-bold text-gray-900">
              Payment Methods
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setShowForm(!showForm)}
            sx={{
              bgcolor: "#2563eb",
              "&:hover": { bgcolor: "#1d4ed8" },
              textTransform: "none",
              borderRadius: "0.5rem",
            }}
          >
            {showForm ? "Cancel" : "Add New"}
          </Button>
        </Box>

        {/* Add Card Form (collapsible) */}
        <Collapse in={showForm}>
          <Box className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <Typography variant="h6" className="text-gray-900 font-semibold mb-4">
              Add New Card
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Card Holder Name"
                  name="cardHolderName"
                  value={cardDetails.cardHolderName}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  className="bg-gray-50"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    "& .MuiInputLabel-root": { fontSize: "0.875rem" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Card Number"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  className="bg-gray-50"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
              <TextField
                label="Expiry Date (MM/YY)" // This is fine, but if ESLint complains, change to:
                // label={'Expiry Date (MM/YY)'}
                name="expiryDate"
                value={cardDetails.expiryDate}
                onChange={handleChange}
                fullWidth
                size="small"
                className="bg-gray-50"
                placeholder="MM/YY"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="CVV"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  className="bg-gray-50"
                  type="password"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    onClick={handleAddPaymentMethod}
                    sx={{
                      bgcolor: "#2563eb",
                      "&:hover": { bgcolor: "#1d4ed8" },
                      textTransform: "none",
                      borderRadius: 2,
                    }}
                  >
                    Save Card
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        {/* Saved Payment Method */}
        {isClient && userInfo?.paymentMethod?.cardNumber ? (
          <Card className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 gap-4">
              <Box className="flex items-center gap-3">
                <Image
                  src="/images/visa.png"
                  alt="Visa"
                  width={48}
                  height={48}
                  priority={false}
                  className="object-contain"
                />
                <Box>
                  <Typography className="font-medium text-gray-900">
                    {userInfo.paymentMethod.cardHolderName}
                  </Typography>
                  <Typography className="text-sm text-gray-500 font-mono">
                    **** **** **** {userInfo.paymentMethod.cardNumber.slice(-4)}
                  </Typography>
                </Box>
              </Box>

              <Box className="flex items-center gap-6">
                <Typography className="text-gray-600">
                  Expires: {userInfo.paymentMethod.expiryDate}
                </Typography>
                <IconButton
                  onClick={handleDeletePaymentMethod}
                  className="hover:bg-red-50 transition-colors"
                  sx={{ color: "#ef4444" }}
                >
                  <AiOutlineDelete size={20} />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Box className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <Typography variant="body1" className="text-gray-500">
              No saved payment methods. Click "Add New" to add a card.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PaymentMethod;