// Third-party library imports
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  AccountBalance,
  Person,
  Numbers,
  Receipt,
  Save,
  Edit,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// Local imports (Redux slices)
import {
  createVendorBankInfo,
  getVendorInfo,
  updateVendorBankInfo,
} from "@/redux/slices/vendorSlice";

// Section header component
const SectionHeader = ({ icon: Icon, title }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
    <Icon size={20} color="#1976d2" />
    <Typography variant="h6" fontWeight="bold">
      {title}
    </Typography>
  </Box>
);

const VendorBankInfo = () => {
  const dispatch = useDispatch();
  const { vendorInfo, isLoading } = useSelector((state) => state.vendors);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    bankName: "",
    bankAccountNumber: "",
    iban: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (vendorInfo?.vendorBankInfo) {
      setBankDetails({
        accountHolderName: vendorInfo.vendorBankInfo.accountHolderName || "",
        bankName: vendorInfo.vendorBankInfo.bankName || "",
        bankAccountNumber: vendorInfo.vendorBankInfo.bankAccountNumber || "",
        iban: vendorInfo.vendorBankInfo.iban || "",
      });
    }
  }, [vendorInfo]);

  const validateForm = () => {
    const newErrors = {};
    if (!bankDetails.accountHolderName.trim())
      newErrors.accountHolderName = "Account holder name is required";
    if (!bankDetails.bankName.trim())
      newErrors.bankName = "Bank name is required";
    if (!bankDetails.bankAccountNumber.trim())
      newErrors.bankAccountNumber = "Account number is required";
    else if (!/^\d{10,}$/.test(bankDetails.bankAccountNumber))
      newErrors.bankAccountNumber = "Account number must be at least 10 digits";
    if (!bankDetails.iban.trim())
      newErrors.iban = "IBAN is required";
    else if (bankDetails.iban.length < 8)
      newErrors.iban = "IBAN must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    let result;
    try {
      if (vendorInfo?.vendorBankInfo) {
        result = await dispatch(
          updateVendorBankInfo({ bankDetails, vendorId: vendorInfo._id })
        );
      } else {
        result = await dispatch(
          createVendorBankInfo({ bankDetails, vendorId: vendorInfo._id })
        );
      }

      if (
        result.type === "vendors/updateVendorBankInfo/fulfilled" ||
        result.type === "vendors/createVendorBankInfo/fulfilled"
      ) {
        toast.success("Bank information saved successfully!");
        await dispatch(getVendorInfo(vendorInfo._id));
      } else {
        toast.error(result.payload?.message || "Failed to update bank information.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vendorInfo && !isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="error">Vendor information not found. Please log in again.</Alert>
      </Box>
    );
  }

  const isEditMode = !!vendorInfo?.vendorBankInfo;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 700,
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "grey.100",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <AccountBalance sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {isEditMode ? "Update Bank Information" : "Add Bank Information"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Manage your payout account details
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <form onSubmit={handleSubmit}>
            <SectionHeader icon={AccountBalance} title="Bank Account Details" />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Holder Name"
                  name="accountHolderName"
                  value={bankDetails.accountHolderName}
                  onChange={handleChange}
                  error={!!errors.accountHolderName}
                  helperText={errors.accountHolderName}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  name="bankName"
                  value={bankDetails.bankName}
                  onChange={handleChange}
                  error={!!errors.bankName}
                  helperText={errors.bankName}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBalance fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Number"
                  name="bankAccountNumber"
                  value={bankDetails.bankAccountNumber}
                  onChange={handleChange}
                  error={!!errors.bankAccountNumber}
                  helperText={errors.bankAccountNumber}
                  required
                  type="text"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Numbers fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="IBAN (International Bank Account Number)"
                  name="iban"
                  value={bankDetails.iban}
                  onChange={handleChange}
                  error={!!errors.iban}
                  helperText={errors.iban}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Receipt fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting || isLoading}
              startIcon={isEditMode ? <Edit /> : <Save />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              {isSubmitting || isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isEditMode ? (
                "Update Bank Info"
              ) : (
                "Save Bank Info"
              )}
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default VendorBankInfo;