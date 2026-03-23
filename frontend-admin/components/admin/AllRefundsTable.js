// AllRefundsTable.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Divider,
  Chip,
  InputAdornment,
  CircularProgress,
  useMediaQuery,
  useTheme,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchOrders, fetchSingleOrder, updateOrderStatus, adminRefundOrder } from "@/redux/adminSlice";
import Loader from "../admin/layout/Loader";

// Nigerian Naira formatter
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Mobile Refund Order Card
const MobileRefundCard = ({ order, onStatusChange, onView }) => {
  const statusOptions = [
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "Processing refund",
  ];
  const refundOptions = [
    "Processing refund",
    "refund_approved",
    "refund_rejected",
  ];

  const handleStatusSelect = (e) => {
    onStatusChange(order.id, e.target.value);
  };

  const isRefundPending = order.status === "Processing refund";
  const selectOptions = isRefundPending ? refundOptions : statusOptions;

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
          {formatNaira(order.totalAmount)}
        </Typography>
        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <Select value={order.status} onChange={handleStatusSelect}>
            {selectOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt === "refund_approved" ? "Approve Refund" : opt === "refund_rejected" ? "Reject Refund" : opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Tooltip title="View Order">
            <IconButton size="small" color="info" onClick={() => onView(order.id)}>
              <AiOutlineEye size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const AllRefundsTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const { orders, singleOrder, isLoading } = useSelector((state) => state.admin);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openViewModal, setOpenViewModal] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (!orders?.length) {
      setFilteredOrders([]);
      return;
    }
    const lower = searchQuery.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order._id.toLowerCase().includes(lower) ||
        order.status.toLowerCase().includes(lower) ||
        order.shippingAddress.fullName.toLowerCase().includes(lower)
    );
    setFilteredOrders(filtered);
  }, [orders, searchQuery]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleViewOrder = async (orderId) => {
    try {
      await dispatch(fetchSingleOrder(orderId));
      setOpenViewModal(true);
    } catch {
      toast.error("Failed to fetch order details.");
    }
  };

  const handleCloseViewModal = () => setOpenViewModal(false);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      if (newStatus === "refund_approved" || newStatus === "refund_rejected") {
        const result = await dispatch(adminRefundOrder({ orderId, status: newStatus }));
        if (result.type === "admin/adminRefundOrder/fulfilled") {
          toast.success("Refund status updated");
          dispatch(fetchOrders());
        } else {
          toast.error("Failed to update refund status");
        }
      } else {
        const result = await dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
        if (result.type === "admin/updateOrderStatus/fulfilled") {
          toast.success(result.payload?.message || "Status updated");
          dispatch(fetchOrders());
        } else {
          toast.error("Failed to update order status");
        }
      }
    } catch (error) {
      toast.error("An error occurred while updating the order status.");
    }
  };

  // DataGrid columns (desktop)
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 1 },
    { field: "customerName", headerName: "Customer Name", minWidth: 180, flex: 1.4 },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => formatNaira(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 220,
      flex: 1,
      renderCell: ({ row }) => {
        const isRefundPending = row.status === "Processing refund";
        const selectOptions = isRefundPending
          ? ["Processing refund", "refund_approved", "refund_rejected"]
          : ["processing", "shipped", "delivered", "cancelled", "Processing refund"];
        return (
          <FormControl fullWidth>
            <Select
              value={row.status}
              onChange={(e) => handleStatusChange(row.id, e.target.value)}
              size="small"
            >
              {selectOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt === "refund_approved"
                    ? "Approve Refund"
                    : opt === "refund_rejected"
                    ? "Reject Refund"
                    : opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.6,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="View Order">
          <IconButton color="info" onClick={() => handleViewOrder(params.row.id)}>
            <AiOutlineEye size={18} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const rows = filteredOrders.map((order) => ({
    id: order._id,
    customerName: order.shippingAddress.fullName,
    totalAmount: order.totalPrice,
    status: order.status,
  }));

  if (isLoading) return <Loader />;

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
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "warning.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="fas fa-undo-alt text-xl text-warning" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              Refund Orders
            </Typography>
            <Chip label={orders?.length || 0} size="small" color="warning" />
          </Box>
        </Box>
      </Paper>

      {/* Search */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
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
          placeholder="Search by order ID, customer name, or status..."
          value={searchQuery}
          onChange={handleSearchChange}
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
              No refund orders found.
            </Typography>
          ) : (
            filteredOrders.map((order) => (
              <MobileRefundCard
                key={order._id}
                order={{
                  id: order._id,
                  customerName: order.shippingAddress.fullName,
                  totalAmount: order.totalPrice,
                  status: order.status,
                }}
                onStatusChange={handleStatusChange}
                onView={handleViewOrder}
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

      {/* View Order Modal */}
      <Dialog
        open={openViewModal}
        onClose={handleCloseViewModal}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Order Details</DialogTitle>
        <DialogContent dividers>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : singleOrder ? (
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Order #{singleOrder._id}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                  <strong>Status:</strong> {singleOrder.status}
                </Typography>
                <Typography variant="body2">
                  <strong>Total:</strong> {formatNaira(singleOrder.totalPrice)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  <strong>Items:</strong>
                </Typography>
                <ul>
                  {singleOrder.items?.map((item) => (
                    <li key={item._id}>
                      <Typography variant="body2">
                        {item.name} (x{item.quantity}) – {formatNaira(item.price)}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Order details are not available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseViewModal} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllRefundsTable;