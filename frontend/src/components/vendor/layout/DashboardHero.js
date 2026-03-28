import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  FaClock,
  FaCheckCircle,
  FaBox,
  FaTruck,
  FaBoxOpen,
  FaTimesCircle,
  FaUndo,
  FaBan,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";

const DashboardHero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { vendorInfo } = useSelector((state) => state.vendors);

  const formatNaira = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Mock data for sales and profit (last 7 days)
  const chartData = [
    { day: "Mon", sales: 12500, profit: 3750 },
    { day: "Tue", sales: 18200, profit: 5460 },
    { day: "Wed", sales: 9800, profit: 2940 },
    { day: "Thu", sales: 21300, profit: 6390 },
    { day: "Fri", sales: 27500, profit: 8250 },
    { day: "Sat", sales: 32200, profit: 9660 },
    { day: "Sun", sales: 29800, profit: 8940 },
  ];

  // Order stats (mock data)
  const orderStats = [
    { label: "Pending", count: 3, icon: FaClock, color: "warning" },
    { label: "Confirmed", count: 4, icon: FaCheckCircle, color: "success" },
    { label: "Packaging", count: 1, icon: FaBox, color: "info" },
    { label: "Out For Delivery", count: 2, icon: FaTruck, color: "primary" },
    { label: "Delivered", count: 10, icon: FaBoxOpen, color: "success" },
    { label: "Cancelled", count: 1, icon: FaTimesCircle, color: "error" },
    { label: "Returned", count: 1, icon: FaUndo, color: "warning" },
    { label: "Failed To Deliver", count: 2, icon: FaBan, color: "error" },
  ];

  // Wallet data (static)
  const walletItems = [
    {
      label: "Withdrawable Balance",
      amount: 10023.5,
      icon: "/icons/wallet.svg",
      action: { text: "Withdraw", link: "/vendor/withdraw" },
    },
    {
      label: "Pending Withdraw",
      amount: 50.0,
      icon: "/icons/load.svg",
    },
    {
      label: "Total Commission Given",
      amount: 6394.47,
      icon: "/icons/commission.svg",
    },
    {
      label: "Already Withdrawn",
      amount: 600.0,
      icon: "/icons/withdrawal.svg",
    },
    {
      label: "Total Delivery Charge Earned",
      amount: 822.0,
      icon: "/icons/delivery.svg",
    },
    {
      label: "Total Tax Given",
      amount: 1000.0,
      icon: "/icons/taxes.svg",
    },
  ];

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: "white",
            p: 1.5,
            border: "1px solid",
            borderColor: "grey.200",
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {label}
          </Typography>
          <Typography variant="body2" color="primary.main">
            Sales: {formatNaira(payload[0]?.value)}
          </Typography>
          <Typography variant="body2" color="success.main">
            Profit: {formatNaira(payload[1]?.value)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Welcome Header */}
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
          textAlign: isMobile ? "center" : "left",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Welcome back, {vendorInfo?.name || vendorInfo?.email?.split("@")[0] || "Vendor"}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here's what's happening with your store today.
          </Typography>
        </Box>
        <Link href="/vendor/products">
          <Button variant="contained" sx={{ textTransform: "none", borderRadius: 2 }}>
            Manage Products
          </Button>
        </Link>
      </Paper>

      {/* Order Analytics Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: 3,
          bgcolor: "white",
          border: "1px solid",
          borderColor: "grey.100",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Order Analytics
          </Typography>
          <Button variant="text" size="small" sx={{ textTransform: "none" }}>
            Last 30 days
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          {orderStats.map((stat, idx) => (
            <Grid item xs={6} sm={4} md={3} key={idx}>
              <Card variant="outlined" sx={{ borderRadius: 2, transition: "all 0.2s", "&:hover": { boxShadow: 2 } }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <stat.icon size={20} color={theme.palette[stat.color]?.main || "#9e9e9e"} />
                    <Typography variant="h5" fontWeight="bold">
                      {stat.count}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Sales & Profit Chart Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: 3,
          bgcolor: "white",
          border: "1px solid",
          borderColor: "grey.100",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Sales & Profit Overview
          </Typography>
          <Button variant="text" size="small" sx={{ textTransform: "none" }}>
            Last 7 days
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(value) => formatNaira(value).replace("₦", "")}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="sales"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              name="Sales"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke={theme.palette.success.main}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              name="Profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Vendor Wallet Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          bgcolor: "white",
          border: "1px solid",
          borderColor: "grey.100",
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Vendor Wallet
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          {walletItems.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card variant="outlined" sx={{ borderRadius: 2, height: "100%", transition: "all 0.2s", "&:hover": { boxShadow: 2 } }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
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
                      <Image src={item.icon} alt={item.label} width={24} height={24} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                    {formatNaira(item.amount)}
                  </Typography>
                  {item.action && (
                    <Link href={item.action.link}>
                      <Button variant="contained" fullWidth sx={{ textTransform: "none", borderRadius: 2 }}>
                        {item.action.text}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default DashboardHero;