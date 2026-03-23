import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AccountBalance, Add, Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

// Nigerian Naira formatter
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Mock data – replace with actual data from your state
const mockBankAccounts = [
  {
    id: 1,
    bankName: "First Bank of Nigeria",
    accountHolder: "John Doe",
    accountNumber: "0123456789",
    iban: "NG1234567890",
    swift: "FBNINGLA",
    isDefault: true,
  },
  // Add more mock accounts if needed
];

const mockTransactions = [
  {
    id: 1,
    date: "2025-03-20T10:30:00Z",
    amount: 50000,
    status: "completed",
    description: "Withdrawal request approved",
  },
  {
    id: 2,
    date: "2025-03-18T14:20:00Z",
    amount: 25000,
    status: "pending",
    description: "Withdrawal request",
  },
  {
    id: 3,
    date: "2025-03-15T09:45:00Z",
    amount: 125000,
    status: "completed",
    description: "Commission payout",
  },
];

const BankOverview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const transactionsColumns = [
    { field: "date", headerName: "Date", minWidth: 150, flex: 1, renderCell: ({ value }) => new Date(value).toLocaleDateString() },
    { field: "description", headerName: "Description", minWidth: 200, flex: 1.5 },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 120,
      flex: 0.8,
      renderCell: ({ value }) => formatNaira(value),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      flex: 0.7,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          color={value === "completed" ? "success" : "warning"}
          variant="outlined"
        />
      ),
    },
  ];

  const transactionsRows = mockTransactions.map((t) => ({
    id: t.id,
    date: t.date,
    description: t.description,
    amount: t.amount,
    status: t.status,
  }));

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          bgcolor: "white",
          border: "1px solid",
          borderColor: "grey.100",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
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
            <AccountBalance fontSize="large" color="primary" />
          </Box>
          <Typography variant="h5" fontWeight="bold">
            Bank Overview
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 2, textTransform: "none" }}>
          Add Bank Account
        </Button>
      </Paper>

      {/* Bank Accounts Section */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Bank Accounts
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {mockBankAccounts.length === 0 ? (
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "white",
                border: "1px solid",
                borderColor: "grey.100",
                textAlign: "center",
              }}
            >
              <Typography color="text.secondary">No bank accounts added yet.</Typography>
            </Paper>
          </Grid>
        ) : (
          mockBankAccounts.map((account) => (
            <Grid item xs={12} md={6} key={account.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "white",
                  border: "1px solid",
                  borderColor: "grey.100",
                  position: "relative",
                }}
              >
                {account.isDefault && (
                  <Chip
                    label="Default"
                    size="small"
                    color="primary"
                    sx={{ position: "absolute", top: 12, right: 12 }}
                  />
                )}
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {account.bankName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Account Holder: {account.accountHolder}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Account Number: {account.accountNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  IBAN: {account.iban}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SWIFT/BIC: {account.swift}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 2, justifyContent: "flex-end" }}>
                  <Button size="small" startIcon={<Edit />} color="primary" variant="outlined">
                    Edit
                  </Button>
                  <Button size="small" startIcon={<Delete />} color="error" variant="outlined">
                    Delete
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      {/* Recent Transactions */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Recent Transactions
      </Typography>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "auto",
          border: "1px solid",
          borderColor: "grey.100",
          bgcolor: "white",
        }}
      >
        <Box sx={{ minWidth: isMobile ? "600px" : "100%" }}>
          <DataGrid
            rows={transactionsRows}
            columns={transactionsColumns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            autoHeight
            disableSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#fafafa",
                borderBottom: "1px solid #e5e7eb",
                fontSize: "0.875rem",
                fontWeight: 600,
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f3f4f6",
                py: 1.5,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f9fafb",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default BankOverview;