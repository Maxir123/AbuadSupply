import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Chip,
  InputAdornment,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid,
  Divider,
  Avatar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineUser,
} from "react-icons/ai";
import {
  fetchAllUsers,
  updateUser,
  deleteUser,
  fetchUserOrders,
} from "@/redux/adminSlice";
import EditProductModal from "../common/ProductEditModal";
import Loader from "./layout/Loader";

// Nigerian Naira formatter
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Mobile card component for each user
const MobileUserCard = ({ user, onEdit, onDelete, onViewOrders }) => {
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: "primary.light" }}>
            <AiOutlineUser />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Joined {format(new Date(user.joiningDate), "MMM dd, yyyy")}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">
              Email
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2" noWrap>
              {user.email}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">
              Phone
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">{user.phone}</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">
              Address
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2" noWrap>
              {user.mainAddress}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 1 }}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => onEdit(user)}>
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete(user.id)}>
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Orders">
            <IconButton size="small" color="info" onClick={() => onViewOrders(user.id)}>
              <AiOutlineEye size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const AllCustomersTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { isLoading, error, adminInfo, users, userOrders } = useSelector((state) => state.admin);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    addresses: [],
  });
  const [openOrdersModal, setOpenOrdersModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    if (adminInfo) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, adminInfo]);

  // Filter users based on search
  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        (user?.name?.toLowerCase() || "").includes(lower) ||
        (user?._id?.toLowerCase() || "").includes(lower) ||
        (user?.email?.toLowerCase() || "").includes(lower)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // Edit handlers
  const handleEditModalOpen = (user) => {
    setSelectedUser(user);
    setUpdatedUser({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      addresses: user.addresses || [],
    });
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => setOpenEditModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    setIsSubmitting(true);
    const result = await dispatch(updateUser({ id: selectedUser._id, updatedUser }));
    if (result.type === "admin/updateUser/fulfilled") {
      toast.success(result.payload.message || "User updated");
      dispatch(fetchAllUsers());
      setOpenEditModal(false);
    } else {
      toast.error("User update failed");
    }
    setIsSubmitting(false);
  };

  // Delete handlers
  const handleDeleteClick = (userId) => {
    setSelectedUser(userId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    const result = await dispatch(deleteUser(selectedUser));
    if (result.type === "admin/deleteUser/fulfilled") {
      toast.success("User deleted");
      dispatch(fetchAllUsers());
      setOpenDeleteDialog(false);
    } else {
      toast.error("Delete failed");
    }
    setIsSubmitting(false);
  };

  // View orders
  const handleViewOrders = (userId) => {
    dispatch(fetchUserOrders(userId));
    setOpenOrdersModal(true);
  };

  // DataGrid columns (desktop)
  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => `...${params.value.slice(-6)}`,
    },
    {
      field: "joiningDate",
      headerName: "Joining Date",
      minWidth: 140,
      flex: 1,
      renderCell: (params) => format(new Date(params.value), "MMM dd, yyyy"),
    },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.5 },
    { field: "email", headerName: "Email", minWidth: 220, flex: 2 },
    { field: "phone", headerName: "Phone", minWidth: 140, flex: 1 },
    {
      field: "addresses",
      headerName: "Address",
      minWidth: 220,
      flex: 1.5,
      renderCell: (params) => (
        <Tooltip title={params.row.fullAddress} placement="top">
          <span>{params.row.mainAddress || "No address"}</span>
        </Tooltip>
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
            <IconButton size="small" color="primary" onClick={() => handleEditModalOpen(params.row)}>
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDeleteClick(params.row.id)}>
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Orders">
            <IconButton size="small" color="info" onClick={() => handleViewOrders(params.row.id)}>
              <AiOutlineEye size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = filteredUsers.map((user) => ({
    id: user._id,
    joiningDate: user.createdAt,
    name: user.name,
    email: user.email,
    phone: user.phoneNumber,
    addresses: user.addresses,
    mainAddress: user.addresses?.[0]?.street || "No address",
    fullAddress: user.addresses?.map((a) => `${a.street}, ${a.city}, ${a.country}`).join("; ") || "No address",
  }));

  // Orders modal columns (desktop)
  const ordersColumns = [
    { field: "orderId", headerName: "Order ID", minWidth: 180, flex: 1.2 },
    {
      field: "orderDate",
      headerName: "Order Date",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => format(new Date(params.value), "MMM dd, yyyy"),
    },
    { field: "status", headerName: "Status", minWidth: 120, flex: 1 },
    {
      field: "total",
      headerName: "Total",
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => formatNaira(params.value),
    },
  ];

  const ordersRows = (userOrders || []).map((order) => ({
    id: order._id,
    orderId: order._id,
    orderDate: order.createdAt,
    status: order.status,
    total: order.totalPrice,
  }));

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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
              <i className="fas fa-users text-xl text-primary" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              Customers List
            </Typography>
            <Chip label={users?.length || 0} size="small" color="primary" />
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
          placeholder="Search by name, email, or ID..."
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredUsers.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No customers found.
            </Typography>
          ) : (
            filteredUsers.map((user) => (
              <MobileUserCard
                key={user._id}
                user={{
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  phone: user.phoneNumber,
                  joiningDate: user.createdAt,
                  mainAddress: user.addresses?.[0]?.street || "No address",
                }}
                onEdit={handleEditModalOpen}
                onDelete={handleDeleteClick}
                onViewOrders={handleViewOrders}
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
        </Paper>
      )}

      {/* Edit User Modal */}
      <EditProductModal
        open={openEditModal}
        onClose={handleEditModalClose}
        data={updatedUser}
        onInputChange={handleInputChange}
        onSave={handleEditSubmit}
        isCustomerEdit={true}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Orders Modal */}
      <Dialog
        open={openOrdersModal}
        onClose={() => setOpenOrdersModal(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Orders by {userOrders?.[0]?.user?.name || selectedUser?.name || "Customer"}
        </DialogTitle>
        <DialogContent dividers>
          {!userOrders ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : userOrders.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No orders found for this customer.
            </Typography>
          ) : (
            <Box sx={{ minWidth: isMobile ? "600px" : "100%", overflowX: "auto" }}>
              <DataGrid
                rows={ordersRows}
                columns={ordersColumns}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                autoHeight
                disableSelectionOnClick
                sx={{
                  border: "none",
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#fafafa",
                    borderBottom: "1px solid #e5e7eb",
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenOrdersModal(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllCustomersTable;