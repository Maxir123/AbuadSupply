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
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Send, History, AccountBalanceWallet } from "@mui/icons-material";
import { formatNaira } from "@/utils/format";

// Mock data
const mockWithdrawals = [
  { id: 1, amount: 50000, createdAt: "2022-10-12T10:00:00Z", status: "denied" },
  { id: 2, amount: 60000, createdAt: "2022-10-12T11:30:00Z", status: "approved" },
  { id: 3, amount: 50000, createdAt: "2022-10-12T14:15:00Z", status: "pending" },
];

const VendorWithdraw = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          bgcolor: "white",
          border: "1px solid",
          borderColor: "grey.100",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "primary.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AccountBalanceWallet fontSize="large" color="primary" />
          </Box>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Withdraw Funds
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Request payouts from your available balance
        </Typography>
      </Paper>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Left Column – Withdrawal Request */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.100",
              bgcolor: "white",
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Request Payout
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Balance Box */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "primary.lighter",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Available Balance
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary.main"
                sx={{ fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" } }}
              >
                {formatNaira(withdrawableBalance)}
              </Typography>
            </Box>

            {/* Withdrawal Form */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Amount (₦)"
                type="number"
                value={withdrawAmount}
                onChange={handleAmountChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₦</InputAdornment>,
                }}
                placeholder="Enter amount"
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontSize: "1rem" }}
              >
                {isSubmitting ? "Processing..." : "Request Withdrawal"}
              </Button>
            </form>

            {/* Bank Info Hint */}
            {!vendorInfo?.vendorBankInfo?.bankAccountNumber && (
              <Typography color="error" variant="caption" display="block" sx={{ mt: 2 }}>
                * Add your bank details before requesting a withdrawal.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Right Column – Withdrawal History */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.100",
              bgcolor: "white",
              overflowX: "auto",
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Withdrawal History
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {withdrawals.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                No withdrawal requests yet.
              </Typography>
            ) : (
              <TableContainer>
                <Table sx={{ minWidth: isMobile ? 500 : "100%" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Amount</TableCell>
                      <TableCell>Request Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {withdrawals.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{formatNaira(item.amount)}</TableCell>
                        <TableCell>
                          {new Date(item.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </TableCell>
                        <TableCell>{getStatusChip(item.status)}</TableCell>
                        <TableCell align="right">
                          {item.status !== "pending" && (
                            <Button variant="outlined" size="small">
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