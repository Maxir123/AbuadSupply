import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleOrder, fetchVendorRefundedOrders } from "@/redux/slices/orderSlice";
import Loader from "./layout/Loader";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { TextField, InputAdornment } from "@mui/material";

// Nigerian Naira formatter
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Mobile Refund Card Component
const MobileRefundCard = ({ order, onView }) => {
  const getStatusColor = (status) => {
    if (status === "refund_approved") return "success";
    if (status === "refund_rejected") return "error";
    return "warning";
  };

  const statusLabel = status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        "&:hover": { boxShadow: "0 2px 6px rgba(0,0,0,0.1)" },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Order #{order.id.slice(-8)}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Customer: {order.customerName}
        </Typography>
        <Typography variant="body2" fontWeight="500" color="primary.main" gutterBottom>
          Total: {formatNaira(order.total)}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
          <Chip
            label={statusLabel}
            size="small"
            color={getStatusColor(order.status)}
            variant="outlined"
          />
          <Tooltip title="View Details">
            <IconButton size="small" color="primary" onClick={() => onView(order.id)}>
              <AiOutlineEye size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const AllRefundsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { vendorInfo } = useSelector((state) => state.vendors);
  const { orders, singleOrder, isLoading } = useSelector((state) => state.orders);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    if (vendorInfo?._id) {
      dispatch(fetchVendorRefundedOrders(vendorInfo._id));
    }
  }, [dispatch, vendorInfo]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredOrders(orders);
    } else {
      const lower = searchQuery.toLowerCase();
      const filtered = orders.filter((order) =>
        order._id.toLowerCase().includes(lower) ||
        order.shippingAddress?.fullName?.toLowerCase().includes(lower)
      );
      setFilteredOrders(filtered);
    }
  }, [orders, searchQuery]);

  const handleViewClick = async (orderId) => {
    setIsModalLoading(true);
    await dispatch(fetchSingleOrder(orderId));
    setIsModalLoading(false);
    setOpenModal(true);
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 1 },
    { field: "customerName", headerName: "Customer", minWidth: 180, flex: 1.5 },
    {
      field: "total",
      headerName: "Total",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => formatNaira(params.row.total),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      renderCell: ({ row }) => {
        const status = row.status;
        let color = "default";
        if (status === "refund_approved") color = "success";
        else if (status === "refund_rejected") color = "error";
        else if (status === "Processing refund") color = "warning";

        const label = status
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        return <Chip label={label} color={color} variant="outlined" />;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.8,
      sortable: false,
      renderCell: ({ row }) => (
        <Tooltip title="View Refund">
          <IconButton
            color="primary"
            onClick={() => handleViewClick(row.id)}
            size="small"
          >
            <AiOutlineEye size={18} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const rows = filteredOrders.map((order) => ({
    id: order._id,
    customerName: order.shippingAddress?.fullName || "N/A",
    total: order.totalPrice,
    status: order.status,
  }));

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
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
          textAlign: isMobile ? "center" : "left",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "error.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i className="fas fa-undo-alt text-xl text-error" />
          </Box>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Refunded Orders
          </Typography>
          <Chip
            label={orders?.length || 0}
            size="small"
            color="error"
            sx={{ ml: 1 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          View and manage refund requests
        </Typography>
      </Paper>

      {/* Search Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: 3,
          borderRadius: 3,
          bgcolor: "white",
          border: "1px solid",
          borderColor: "grey.100",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by order ID or customer name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AiOutlineSearch size={20} color="#9ca3af" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2 },
          }}
        />
      </Paper>

      {/* Content: DataGrid (desktop) or cards (mobile) */}
      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {filteredOrders.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No refund requests found.
            </Typography>
          ) : (
            filteredOrders.map((order) => (
              <MobileRefundCard
                key={order._id}
                order={{
                  id: order._id,
                  customerName: order.shippingAddress?.fullName || "N/A",
                  total: order.totalPrice,
                  status: order.status,
                }}
                onView={handleViewClick}
              />
            ))
          )}
        </Box>
      ) : (
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
          <Box sx={{ minWidth: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
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
      )}

      {/* Refund Details Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
          Refund Order Details
        </DialogTitle>
        <DialogContent dividers>
          {isModalLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {/* Order Summary */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Order Summary
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body2">
                    <strong>Order ID:</strong> {singleOrder?._id}
                  </Typography>
                  <Box display="flex" gap={1} mt={1}>
                    <Typography variant="body2">
                      <strong>Status:</strong>
                    </Typography>
                    <Chip
                      label={
                        singleOrder?.status
                          ?.replace(/_/g, " ")
                          ?.replace(/\b\w/g, (char) => char.toUpperCase())
                      }
                      color={
                        singleOrder?.status === "refund_approved"
                          ? "success"
                          : singleOrder?.status === "refund_rejected"
                          ? "error"
                          : "warning"
                      }
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" mt={1}>
                    <strong>Total Price:</strong> {formatNaira(singleOrder?.totalPrice)}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    <strong>Created At:</strong>{" "}
                    {singleOrder?.createdAt
                      ? new Date(singleOrder.createdAt).toLocaleString()
                      : "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              {/* Shipping Address */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body2">
                    {singleOrder?.shippingAddress?.fullName}
                  </Typography>
                  <Typography variant="body2">
                    {singleOrder?.shippingAddress?.address}
                  </Typography>
                  <Typography variant="body2">
                    {singleOrder?.shippingAddress?.city},{" "}
                    {singleOrder?.shippingAddress?.postalCode}
                  </Typography>
                  <Typography variant="body2">
                    {singleOrder?.shippingAddress?.country}
                  </Typography>
                </Paper>
              </Grid>

              {/* Order Items */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Order Items
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  {singleOrder?.items?.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                        borderBottom:
                          index !== singleOrder.items.length - 1
                            ? "1px solid #eee"
                            : "none",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {item.name} <span style={{ color: "#666" }}>(x{item.quantity})</span>
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {formatNaira(item.price)}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>

              {/* Payment Info */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Payment Information
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body2">
                    <strong>Transaction ID:</strong> {singleOrder?.paymentInfo?.transactionId}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    <strong>Status:</strong> {singleOrder?.paymentInfo?.status}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    <strong>Method:</strong> {singleOrder?.paymentInfo?.method}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllRefundsPage;