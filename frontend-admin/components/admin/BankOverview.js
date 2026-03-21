import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const BankOverview = () => {
  return (
    <div className="w-full p-4 md:p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AccountBalanceIcon color="primary" />
          <Typography variant="h5" fontWeight="bold">
            Bank Overview
          </Typography>
        </div>
        <Button variant="contained" color="primary">
          Add Bank Account
        </Button>
      </div>

      {/* Bank Info Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Default Bank Account
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2">
            <strong>Bank Name:</strong> N/A
          </Typography>
          <Typography variant="body2">
            <strong>Account Holder:</strong> N/A
          </Typography>
          <Typography variant="body2">
            <strong>IBAN:</strong> N/A
          </Typography>
          <Typography variant="body2">
            <strong>SWIFT/BIC:</strong> N/A
          </Typography>
        </CardContent>
      </Card>

      {/* Bank Transactions Placeholder */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Transactions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            No transactions available.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankOverview;
