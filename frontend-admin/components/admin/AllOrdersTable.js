import React, { useEffect, useState } from "react";

// Third-party library imports
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEye,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  MenuItem,
  Select,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Typography,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Box,
  Paper,
  Chip,
  useMediaQuery,
  useTheme,
  InputAdornment,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { AiOutlineSearch } from "react-icons/ai";

// Local imports
import Loader from "./layout/Loader";
import { deleteOrder, fetchOrders, fetchSingleOrder, updateOrder, updateOrderStatus } from "@/redux/adminSlice";
import EditProductModal from "../common/ProductEditModal";

// Nigerian Naira formatter
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Mobile Order Card component
const MobileOrderCard = ({ order, onStatusChange, onEdit, onDelete, onView }) => {
  const [status, setStatus] = useState(order.status);
  const statusOptions = [
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "Processing refund",
    "refund_approved",
    "refund_rejected",
  ];

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onStatusChange(order.id, newStatus);
  };

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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Order #{order.id.slice(-8)}
          </Typography>
          <Chip
            label={order.status}
            size="small"
            color={
              order.status === "delivered"
                ? "success"
                : order.status === "cancelled"
                ? "error"
                : "warning"
            }
            variant="outlined"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Customer: {order.customerName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Total: {formatNaira(order.totalAmount)}
        </Typography>

        <Box sx={{ mt: 2, mb: 1 }}>
          <FormControl fullWidth size="small">
            <Select
              value={order.status}
              onChange={(e) => handleStatusChange(e)}
              sx={{ fontSize: "0.875rem" }}
            >
              {statusOptions.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 1 }}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => onEdit(order)}>
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete(order.id)}>
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton size="small" color="info" onClick={() => onView(order.id)}>
              <AiOutlineEye size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const AllOrdersTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { singleOrder, orders, isLoading, error } = useSelector((state) => state.admin);

  // State Variables
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [updatedOrder, setUpdatedOrder] = useState({
    status: "",
    shippingAddress: {
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    totalAmount: 0,
    paymentInfo: { method: "", status: "" },
  });

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    const filtered = orders.filter((order) => {
      const fullName = order?.shippingAddress?.fullName?.toLowerCase() || "";
      const orderId = order?._id?.toLowerCase() || "";
      const status = order?.status?.toLowerCase() || "";
      return fullName.includes(lower) || orderId.includes(lower) || status.includes(lower);
    });
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  // Status change
  const handleStatusChange = async (orderId, status) => {
    try {
      const result = await dispatch(updateOrderStatus({ id: orderId, status }));
      if (result.type === "admin/updateOrderStatus/fulfilled") {
        toast.success(result.payload?.message);
        dispatch(fetchOrders());
      } else {
        toast.error(result.payload?.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the order status.");
    }
  };

  // Delete handlers
  const handleDeleteConfirmation = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrderId) return;
    try {
      const result = await dispatch(deleteOrder({ id: selectedOrderId }));
      if (result.type === "admin/deleteOrder/fulfilled") {
        toast.success("Order deleted!");
        dispatch(fetchOrders());
      } else {
        toast.error("Failed to delete order.");
      }
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error("An error occurred while deleting the order.");
    }
  };

  // Search
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // Edit handlers
  const handleOrderEdit = (order) => {
    setSelectedOrderId(order.id);
    setUpdatedOrder({
      status: order.status,
      shippingAddress: order.shippingAddress,
      totalAmount: order.totalAmount,
      paymentInfo: order.paymentInfo,
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedOrderId(null);
  };

  const handleUpdateOrder = async () => {
    try {
      const result = await dispatch(
        updateOrder({
          id: selectedOrderId,
          status: updatedOrder.status,
          updatedOrder,
        })
      );
      if (result.type === "admin/updateOrder/fulfilled") {
        toast.success("Order updated successfully!");
        dispatch(fetchOrders());
        setOpenEditModal(false);
      } else {
        toast.error("Failed to update the order.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  // View handlers
  const handleViewOrder = async (orderId) => {
    try {
      await dispatch(fetchSingleOrder(orderId));
      setOpenViewModal(true);
    } catch (error) {
      toast.error("Failed to fetch order details.");
    }
  };

  const handleCloseViewModal = () => setOpenViewModal(false);

  // Input change for nested objects (for edit modal)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const keys = name.split(".");
      setUpdatedOrder((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setUpdatedOrder((prev) => ({ ...prev, [name]: value }));
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
      field: "shippingAddress",
      headerName: "Shipping Address",
      minWidth: 250,
      flex: 1,
      renderCell: ({ row }) => (
        <Tooltip title={`${row.shippingAddress.address}, ${row.shippingAddress.city}, ${row.shippingAddress.country} ${row.shippingAddress.postalCode}`}>
          <span>{`${row.shippingAddress.address}, ${row.shippingAddress.city}`}</span>
        </Tooltip>
      ),
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      minWidth: 150,
      flex: 1,
      renderCell: ({ row }) => row.paymentInfo.method,
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      minWidth: 150,
      flex: 1,
      renderCell: ({ row }) => row.paymentInfo.status,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      renderCell: ({ row }) => (
        <FormControl fullWidth>
          <Select
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            size="small"
          >
            {[
              "processing",
              "shipped",
              "delivered",
              "cancelled",
              "Processing refund",
              "refund_approved",
              "refund_rejected",
            ].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleOrderEdit(params.row)}>
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDeleteConfirmation(params.row.id)}>
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton size="small" color="info" onClick={() => handleViewOrder(params.row.id)}>
              <AiOutlineEye size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = filteredOrders.map((order) => ({
    id: order._id,
    customerName: order.shippingAddress.fullName,
    totalAmount: order.totalPrice,
    status: order.status,
    shippingAddress: order.shippingAddress,
    paymentInfo: order.paymentInfo,
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
                bgcolor: "primary.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="fas fa-shopping-cart text-xl text-primary" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              Orders List
            </Typography>
            <Chip label={orders?.length || 0} size="small" color="primary" />
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

      {/* Content: either DataGrid or mobile cards */}
      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {filteredOrders.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No orders found.
            </Typography>
          ) : (
            filteredOrders.map((order) => (
              <MobileOrderCard
                key={order._id}
                order={{
                  id: order._id,
                  customerName: order.shippingAddress.fullName,
                  totalAmount: order.totalPrice,
                  status: order.status,
                  shippingAddress: order.shippingAddress,
                  paymentInfo: order.paymentInfo,
                }}
                onStatusChange={handleStatusChange}
                onEdit={handleOrderEdit}
                onDelete={handleDeleteConfirmation}
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

      {/* Edit Order Modal */}
      <EditProductModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        data={updatedOrder}
        onInputChange={handleInputChange}
        onSave={handleUpdateOrder}
        isOrderEdit={true}
      />

      {/* View Order Modal */}
      <Dialog open={openViewModal} onClose={handleCloseViewModal} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Order Details</DialogTitle>
        <DialogContent dividers>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : singleOrder ? (
            <Box>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">Order ID: {singleOrder._id}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    <strong>Status:</strong> {singleOrder.status}
                    <Box component="span" sx={{ ml: 1 }}>
                      {singleOrder.status === "delivered" ? (
                        <AiOutlineCheckCircle color="green" size={20} />
                      ) : (
                        <AiOutlineCloseCircle color="red" size={20} />
                      )}
                    </Box>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Created At:</strong> {new Date(singleOrder.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">Shipping Address</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    <strong>Name:</strong> {singleOrder.shippingAddress.fullName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Address:</strong> {singleOrder.shippingAddress.address}, {singleOrder.shippingAddress.city}, {singleOrder.shippingAddress.country}, {singleOrder.shippingAddress.postalCode}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">Payment Information</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    <strong>Method:</strong> {singleOrder.paymentInfo.method}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {singleOrder.paymentInfo.status}
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6">Items</Typography>
                  <Divider sx={{ my: 1 }} />
                  {singleOrder.items.map((item) => (
                    <Box key={item._id} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2">
                        {item.name} (x{item.quantity})
                      </Typography>
                      <Typography variant="body2">{formatNaira(item.price)}</Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h6" sx={{ textAlign: "right" }}>
                    Total: {formatNaira(singleOrder.totalPrice)}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this order? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteOrder} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllOrdersTable;