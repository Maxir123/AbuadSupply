import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Switch,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Chip,
  InputAdornment,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineSearch, AiOutlinePlus, AiOutlineTag } from "react-icons/ai";
import { fetchAllCoupons, adminUpdateCoupon, deleteCoupon, createCoupon } from "@/redux/adminSlice";
import Loader from "../admin/layout/Loader";

// Mobile coupon card component
const MobileCouponCard = ({ coupon, onStatusToggle, onEdit, onDelete }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "primary.light", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AiOutlineTag size={20} color="#1976d2" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {coupon.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {coupon.value} discount
            </Typography>
          </Box>
          <Switch
            checked={coupon.status === "active"}
            onChange={() => onStatusToggle(coupon.id, coupon.status)}
            color="primary"
            size="small"
          />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">
              Type
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Chip
              label={coupon.type}
              size="small"
              color={coupon.type === "Purchase" ? "success" : "primary"}
              variant="outlined"
              sx={{ height: 24, fontSize: "0.7rem" }}
            />
          </Grid>

          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">
              Valid
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">
              {formatDate(coupon.validityStart)} – {formatDate(coupon.validityEnd)}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 1 }}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => onEdit(coupon)}>
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete(coupon.id)}>
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const AllCouponsTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { isLoading, error, adminInfo, coupons } = useSelector((state) => state.admin);

  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updatedCoupon, setUpdatedCoupon] = useState({
    name: "",
    value: "",
    type: "Purchase",
    status: "active",
    validityStart: "",
    validityEnd: "",
  });

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    type: "Purchase",
    status: "active",
    validityStart: "",
    validityEnd: "",
  });

  useEffect(() => {
    if (adminInfo) dispatch(fetchAllCoupons());
  }, [dispatch, adminInfo]);

  // Filter coupons based on search
  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    const filtered = coupons.filter((coupon) =>
      (coupon?.name?.toLowerCase() || "").includes(lower) ||
      (coupon?._id?.toLowerCase() || "").includes(lower)
    );
    setFilteredCoupons(filtered);
  }, [searchQuery, coupons]);

  // Helper: Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  // Status toggle
  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const coupon = coupons.find((c) => c._id === id);
    if (!coupon) return;
    const updated = { ...coupon, status: newStatus };
    const result = await dispatch(adminUpdateCoupon({ couponId: id, couponData: updated }));
    if (result.type === "admin/adminUpdateCoupon/fulfilled") {
      toast.success("Status updated");
      dispatch(fetchAllCoupons());
    } else {
      toast.error("Failed to update status");
    }
  };

  // Edit handlers
  const handleEditModalOpen = (coupon) => {
    const start = coupon.validityStart?.split("T")[0] || "";
    const end = coupon.validityEnd?.split("T")[0] || "";
    setSelectedCoupon(coupon);
    setUpdatedCoupon({
      name: coupon.name || "",
      value: coupon.value?.replace("%", "") || "",
      type: coupon.type === "Purchase" ? "Purchase" : "Delivery",
      status: coupon.status,
      validityStart: start,
      validityEnd: end,
    });
    setOpenEditModal(true);
  };

  const handleEditSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      name: updatedCoupon.name,
      value: updatedCoupon.value,
      status: updatedCoupon.status,
      type: updatedCoupon.type,
      validityStart: updatedCoupon.validityStart,
      validityEnd: updatedCoupon.validityEnd,
    };
    const result = await dispatch(adminUpdateCoupon({ couponId: selectedCoupon._id, couponData: payload }));
    if (result.type === "admin/adminUpdateCoupon/fulfilled") {
      toast.success("Coupon updated");
      dispatch(fetchAllCoupons());
      setOpenEditModal(false);
    } else {
      toast.error("Update failed");
    }
    setIsSubmitting(false);
  };

  // Create handlers
  const handleCreateSubmit = async () => {
    if (!newCoupon.code || !newCoupon.discount || !newCoupon.validityStart || !newCoupon.validityEnd) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsSubmitting(true);
    const payload = {
      ...newCoupon,
      vendorId: adminInfo?._id,
      discount: Number(newCoupon.discount),
    };
    const result = await dispatch(createCoupon(payload));
    if (result.type === "admin/createCoupon/fulfilled") {
      toast.success("Coupon created");
      dispatch(fetchAllCoupons());
      setOpenCreateModal(false);
      setNewCoupon({ code: "", discount: "", type: "Purchase", status: "active", validityStart: "", validityEnd: "" });
    } else {
      toast.error("Creation failed");
    }
    setIsSubmitting(false);
  };

  // Delete handlers
  const handleDeleteClick = (id) => {
    setSelectedCoupon(id);
    setOpenDeleteDialog(true);
  };
  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    const result = await dispatch(deleteCoupon(selectedCoupon));
    if (result.type === "admin/deleteCoupon/fulfilled") {
      toast.success("Coupon deleted");
      dispatch(fetchAllCoupons());
    } else {
      toast.error("Delete failed");
    }
    setOpenDeleteDialog(false);
    setIsSubmitting(false);
  };

  // DataGrid columns (desktop)
  const columns = [
    { field: "name", headerName: "Coupon Name", minWidth: 150, flex: 1 },
    { field: "value", headerName: "Value", minWidth: 100, flex: 0.8 },
    {
      field: "type",
      headerName: "Type",
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === "Purchase" ? "success" : "primary"}
          variant="outlined"
        />
      ),
    },
    {
      field: "validityStart",
      headerName: "Start Date",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "validityEnd",
      headerName: "End Date",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.7,
      renderCell: (params) => (
        <Switch
          checked={params.row.status === "active"}
          onChange={() => handleStatusChange(params.row.id, params.row.status)}
          color="primary"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.6,
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
        </Box>
      ),
    },
  ];

  const rows = filteredCoupons.map((c) => ({
    id: c._id,
    name: c.name,
    value: `${c.value}%`,
    type: c.type,
    validityStart: c.validityStart,
    validityEnd: c.validityEnd,
    status: c.status,
  }));

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: "white", border: "1px solid", borderColor: "grey.100" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "primary.light", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="fas fa-tags text-xl text-primary" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              Coupons List
            </Typography>
            <Chip label={coupons?.length || 0} size="small" color="primary" />
          </Box>
          <Button
            variant="contained"
            startIcon={<AiOutlinePlus />}
            onClick={() => setOpenCreateModal(true)}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Add Coupon
          </Button>
        </Box>
      </Paper>

      {/* Search */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: "white", border: "1px solid", borderColor: "grey.100" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or ID..."
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

      {/* Content: either DataGrid or mobile cards */}
      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredCoupons.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No coupons found.
            </Typography>
          ) : (
            filteredCoupons.map((coupon) => (
              <MobileCouponCard
                key={coupon._id}
                coupon={{
                  id: coupon._id,
                  name: coupon.name,
                  value: `${coupon.value}%`,
                  type: coupon.type,
                  validityStart: coupon.validityStart,
                  validityEnd: coupon.validityEnd,
                  status: coupon.status,
                }}
                onStatusToggle={handleStatusChange}
                onEdit={handleEditModalOpen}
                onDelete={handleDeleteClick}
              />
            ))
          )}
        </Box>
      ) : (
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: "auto", border: "1px solid", borderColor: "grey.100", bgcolor: "white" }}>
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

      {/* Edit Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Edit Coupon</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Coupon Name"
            name="name"
            value={updatedCoupon.name}
            onChange={(e) => setUpdatedCoupon({ ...updatedCoupon, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Discount (%)"
            name="value"
            type="number"
            value={updatedCoupon.value}
            onChange={(e) => setUpdatedCoupon({ ...updatedCoupon, value: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Type"
            name="type"
            select
            value={updatedCoupon.type}
            onChange={(e) => setUpdatedCoupon({ ...updatedCoupon, type: e.target.value })}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Purchase">Purchase</MenuItem>
            <MenuItem value="Delivery">Delivery</MenuItem>
          </TextField>
          <TextField
            label="Status"
            name="status"
            select
            value={updatedCoupon.status}
            onChange={(e) => setUpdatedCoupon({ ...updatedCoupon, status: e.target.value })}
            fullWidth
            margin="normal"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
          <TextField
            label="Validity Start"
            type="date"
            value={updatedCoupon.validityStart}
            onChange={(e) => setUpdatedCoupon({ ...updatedCoupon, validityStart: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Validity End"
            type="date"
            value={updatedCoupon.validityEnd}
            onChange={(e) => setUpdatedCoupon({ ...updatedCoupon, validityEnd: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEditModal(false)} color="inherit">Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Create Coupon</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Coupon Name"
            name="code"
            value={newCoupon.code}
            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Discount (%)"
            name="discount"
            type="number"
            value={newCoupon.discount}
            onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Type"
            name="type"
            select
            value={newCoupon.type}
            onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Purchase">Purchase</MenuItem>
            <MenuItem value="Delivery">Delivery</MenuItem>
          </TextField>
          <TextField
            label="Validity Start"
            type="date"
            value={newCoupon.validityStart}
            onChange={(e) => setNewCoupon({ ...newCoupon, validityStart: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Validity End"
            type="date"
            value={newCoupon.validityEnd}
            onChange={(e) => setNewCoupon({ ...newCoupon, validityEnd: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenCreateModal(false)} color="inherit">Cancel</Button>
          <Button onClick={handleCreateSubmit} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this coupon? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllCouponsTable;