import React, { useEffect, useState } from "react";

// Third-party library imports
import { AiOutlineDelete, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  MenuItem,
  Select,
  Modal,
  Box,
  Typography,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  FormControl,
  InputAdornment,
  TextField,
  Chip,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";

// Local imports
import { updateOrderStatus, fetchVendorOrders, fetchSingleOrder, deleteOrder } from "../../redux/slices/orderSlice";
import Loader from "./layout/Loader";

const AllOrdersTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useDispatch();
  const { orders, isLoading, singleOrder } = useSelector((state) => state.orders);
  const { vendorInfo } = useSelector((state) => state.vendors);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Handle status change
  const handleStatusChange = async (orderId, status) => {
    try {
      const result = await dispatch(
        updateOrderStatus({ orderId, status, vendorId: vendorInfo?._id })
      );
      if (result.type === "orders/updateOrderStatus/fulfilled") {
        toast.success(result.payload?.message);
        dispatch(fetchVendorOrders(vendorInfo._id));
      } else {
        toast.error(result.payload?.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the order status.");
    }
  };

  // Delete confirmation
  const handleDeleteConfirmation = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrderId) return;
    try {
      const result = await dispatch(
        deleteOrder({ orderId: selectedOrderId, vendorId: vendorInfo?._id })
      );
      if (result.type === "orders/deleteOrder/fulfilled") {
        toast.success("Order deleted!");
        dispatch(fetchVendorOrders(vendorInfo._id));
      } else {
        toast.error("Failed to delete order.");
      }
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error("An error occurred while deleting the order.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter orders based on search
  useEffect(() => {
    let filtered = [...orders];
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        const customerName = order?.shippingAddress?.fullName?.toLowerCase();
        const orderId = order?._id?.toLowerCase();
        const status = order?.status?.toLowerCase();
        return (
          customerName?.includes(lowerCaseQuery) ||
          orderId?.includes(lowerCaseQuery) ||
          status?.includes(lowerCaseQuery)
        );
      });
    }
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  // Fetch orders on mount
  useEffect(() => {
    if (vendorInfo?._id) {
      dispatch(fetchVendorOrders(vendorInfo._id));
    }
  }, [dispatch, vendorInfo]);

  const handlePreviewClick = (orderId) => {
    dispatch(fetchSingleOrder(orderId));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Columns for DataGrid
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 180, flex: 1 },
    { field: "customerName", headerName: "Customer Name", minWidth: 200, flex: 1.4 },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      minWidth: 140,
      flex: 1,
      renderCell: (params) => (
        <Typography fontWeight="600" color="primary.main">
          ${params.row.totalAmount}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 180,
      flex: 1,
      renderCell: ({ row }) => {
        const statusColors = {
          processing: "warning",
          shipped: "info",
          delivered: "success",
          cancelled: "error",
          "Processing refund": "warning",
          refund_approved: "success",
          refund_rejected: "error",
        };
        return (
          <FormControl size="small" fullWidth>
            <Select
              value={row.status}
              onChange={(e) => handleStatusChange(row.id, e.target.value)}
              variant="outlined"
              sx={{ fontSize: "0.875rem" }}
            >
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="Processing refund">Processing refund</MenuItem>
              <MenuItem value="refund_approved">Refund Approved</MenuItem>
              <MenuItem value="refund_rejected">Refund Rejected</MenuItem>
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
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton
              color="primary"
              onClick={() => handlePreviewClick(params.row.id)}
              size="small"
            >
              <AiOutlineEye size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Order">
            <IconButton
              color="error"
              onClick={() => handleDeleteConfirmation(params.row.id)}
              size="small"
            >
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = filteredOrders.map((order) => ({
    id: order._id,
    customerName: order.shippingAddress?.fullName || "N/A",
    totalAmount: order.totalPrice,
    status: order.status,
  }));

  if (isLoading) return <Loader />;

  return (
    <>
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 2,
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
                bgcolor: "primary.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="fas fa-box-open text-xl text-primary" />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Orders
            </Typography>
            <Chip
              label={orders?.length || 0}
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Manage all customer orders
          </Typography>
        </Paper>

        {/* Search Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: 2,
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

        {/* Orders Table */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "auto",
            border: "1px solid",
            borderColor: "grey.100",
            bgcolor: "white",
            width: "100%",
          }}
        >
          <Box sx={{ minWidth: isMobile ? "600px" : "100%" }}>
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
      </Box>

      {/* Order Details Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="order-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: "80%", md: "70%" },
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 3,
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Typography
            id="order-modal-title"
            variant="h5"
            component="h2"
            fontWeight="bold"
            textAlign="center"
            mb={2}
          >
            Order Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            {/* General Information */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  General Information
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  <strong>Order ID:</strong> {singleOrder?._id}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Status:</strong>{" "}
                  <Chip
                    label={singleOrder?.status}
                    size="small"
                    color={
                      singleOrder?.status === "delivered"
                        ? "success"
                        : singleOrder?.status === "cancelled"
                        ? "error"
                        : "warning"
                    }
                  />
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Total Price:</strong> ${singleOrder?.totalPrice}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Created At:</strong>{" "}
                  {singleOrder?.createdAt
                    ? new Date(singleOrder.createdAt).toLocaleString()
                    : "N/A"}
                </Typography>
              </Paper>
            </Grid>

            {/* Shipping Address */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  <strong>Name:</strong> {singleOrder?.shippingAddress?.fullName}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Address:</strong> {singleOrder?.shippingAddress?.address}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>City:</strong> {singleOrder?.shippingAddress?.city}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Postal Code:</strong> {singleOrder?.shippingAddress?.postalCode}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Country:</strong> {singleOrder?.shippingAddress?.country}
                </Typography>
              </Paper>
            </Grid>

            {/* Order Items */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Order Items
                </Typography>
                {singleOrder?.items?.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                      borderBottom: index !== singleOrder.items.length - 1 ? "1px solid #eee" : "none",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography>
                      {item.name} <span style={{ color: "#666" }}>(x{item.quantity})</span>
                    </Typography>
                    <Typography fontWeight="500">${item.price}</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>

            {/* Payment Information */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Payment Information
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  <strong>Transaction ID:</strong> {singleOrder?.paymentInfo?.transactionId}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Status:</strong> {singleOrder?.paymentInfo?.status}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Method:</strong> {singleOrder?.paymentInfo?.method}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleCloseModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{ sx: { borderRadius: 3, m: 2 } }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this order? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, flexDirection: isMobile ? "column" : "row", gap: 1 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit" fullWidth={isMobile}>
            Cancel
          </Button>
          <Button onClick={handleDeleteOrder} color="error" variant="contained" fullWidth={isMobile}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllOrdersTable;