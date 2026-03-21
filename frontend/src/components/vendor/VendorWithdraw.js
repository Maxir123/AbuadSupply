import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  InputAdornment,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { formatNaira } from "@/utils/format";

// Mock data
const mockWithdrawals = [
  { id: 1, amount: 50000, createdAt: "2022-10-12T10:00:00Z", status: "denied" },
  { id: 2, amount: 60000, createdAt: "2022-10-12T11:30:00Z", status: "approved" },
  { id: 3, amount: 50000, createdAt: "2022-10-12T14:15:00Z", status: "pending" },
];

const VendorWithdraw = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { vendorInfo } = useSelector((state) => state.vendors);
  const withdrawals = useSelector((state) => state.withdrawals?.list) || mockWithdrawals;

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const withdrawableBalance = vendorInfo?.wallet?.balance || 0;

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && !isNaN(Number(value)))) {
      setWithdrawAmount(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);

    if (amount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }

    if (amount > withdrawableBalance) {
      toast.error(`Insufficient balance: ${formatNaira(withdrawableBalance)}`);
      return;
    }

    if (!vendorInfo?.vendorBankInfo?.bankAccountNumber) {
      toast.error("Add your bank details first.");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Withdrawal request submitted!");
      setWithdrawAmount("");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusChip = (status) => {
    const map = {
      approved: { label: "Approved", color: "success" },
      pending: { label: "Pending", color: "warning" },
      denied: { label: "Denied", color: "error" },
    };

    const item = map[status] || { label: status, color: "default" };

    return <Chip label={item.label} color={item.color} size="small" variant="outlined" />;
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
      }}
    >
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* LEFT */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Withdraw Funds
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Balance */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "#e3f2fd",
              }}
            >
              <Typography variant="body2">Available Balance</Typography>

              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
                }}
                color="primary"
              >
                {formatNaira(withdrawableBalance)}
              </Typography>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={withdrawAmount}
                onChange={handleAmountChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₦</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={18} /> : <Send />}
                sx={{ py: 1.5, borderRadius: 2, textTransform: "none" }}
              >
                {isSubmitting ? "Processing..." : "Request Withdrawal"}
              </Button>
            </form>

            {!vendorInfo?.vendorBankInfo?.bankAccountNumber && (
              <Typography color="error" variant="caption" sx={{ mt: 2 }}>
                Add your bank details to withdraw.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3, overflowX: "auto" }}>
            <Typography variant="h6" fontWeight="bold">
              Withdrawal History
            </Typography>

            <Divider sx={{ my: 2 }} />

            {withdrawals.length === 0 ? (
              <Typography align="center">No withdrawals yet</Typography>
            ) : (
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Amount</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {withdrawals.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{formatNaira(item.amount)}</TableCell>

                        <TableCell>
                          {new Date(item.createdAt).toLocaleString()}
                        </TableCell>

                        <TableCell>{getStatusChip(item.status)}</TableCell>

                        <TableCell align="right">
                          {item.status !== "pending" && (
                            <Button size="small" variant="outlined">
                              Close
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorWithdraw;