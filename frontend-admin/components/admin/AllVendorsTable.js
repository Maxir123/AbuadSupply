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
  Card,
  CardContent,
  Divider,
  Chip,
  InputAdornment,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Switch,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Image from "next/image";

import { fetchAllVendors, blockVendor, unblockVendor, fetchVendorById, updateVendor, deleteVendor } from "@/redux/adminSlice";
import EditProductModal from "../common/ProductEditModal";
import Loader from "./layout/Loader";

// Nigerian Naira formatter (kept for consistency, though not used in vendors)
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Mobile Vendor Card
const MobileVendorCard = ({ vendor, onEdit, onDelete, onView, onStatusToggle }) => {
  const isBlocked = vendor.isBlocked;
  const statusLabel = isBlocked ? "Blocked" : "Active";
  const statusColor = isBlocked ? "error" : "success";

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
          {vendor.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Email: {vendor.email}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Phone: {vendor.phoneNumber}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Joined: {format(new Date(vendor.registrationDate), "MMM dd, yyyy")}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
          <Chip label={statusLabel} size="small" color={statusColor} variant="outlined" />
          <Switch
            checked={!isBlocked}
            onChange={() => onStatusToggle(vendor.id, isBlocked)}
            color="primary"
            size="small"
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => onEdit(vendor)}>
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete(vendor.id)}>
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Details">
            <IconButton size="small" color="info" onClick={() => onView(vendor.id)}>
              <AiOutlineEye size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const AllVendorsTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const { isLoading, error, adminInfo, vendors, singleVendor } = useSelector((state) => state.admin);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [updatedVendor, setUpdatedVendor] = useState({ name: "", email: "", phoneNumber: "" });
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (adminInfo) {
      dispatch(fetchAllVendors());
    }
  }, [dispatch, adminInfo]);

  useEffect(() => {
    let filtered = [...vendors];
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter((vendor) =>
        (vendor?.name?.toLowerCase() || "").includes(lower) ||
        (vendor?._id?.toLowerCase() || "").includes(lower) ||
        (vendor?.email?.toLowerCase() || "").includes(lower)
      );
    }
    setFilteredVendors(filtered);
  }, [searchQuery, vendors]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleVendorEdit = (vendor) => {
    setSelectedVendorId(vendor.id);
    setUpdatedVendor({
      name: vendor.name,
      email: vendor.email,
      phoneNumber: vendor.phoneNumber,
    });
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => setOpenEditModal(false);

  const handleDeleteConfirmation = (vendorId) => {
    setSelectedVendorId(vendorId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteVendor = async () => {
    setIsSubmitting(true);
    const result = await dispatch(deleteVendor(selectedVendorId));
    if (result.type === "admin/deleteVendor/fulfilled") {
      toast.success("Vendor deleted!");
      dispatch(fetchAllVendors());
    } else {
      toast.error("Failed to delete vendor.");
    }
    setOpenDeleteDialog(false);
    setIsSubmitting(false);
  };

  const handleStatusToggle = async (id, isBlocked) => {
    setIsSubmitting(true);
    if (isBlocked) {
      const result = await dispatch(unblockVendor(id));
      if (result.type === "admin/unblockVendor/fulfilled") {
        toast.success("Vendor unblocked!");
        dispatch(fetchAllVendors());
      } else {
        toast.error("Failed to unblock vendor.");
      }
    } else {
      const result = await dispatch(blockVendor(id));
      if (result.type === "admin/blockVendor/fulfilled") {
        toast.success("Vendor blocked!");
        dispatch(fetchAllVendors());
      } else {
        toast.error("Failed to block vendor.");
      }
    }
    setIsSubmitting(false);
  };

  const handleViewVendor = async (vendorId) => {
    setIsSubmitting(true);
    const result = await dispatch(fetchVendorById(vendorId));
    if (result.type === "admin/fetchVendorById/fulfilled") {
      setOpenViewModal(true);
    } else {
      toast.error("Failed to fetch vendor details.");
    }
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedVendor((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateVendor = async () => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(
        updateVendor({
          id: selectedVendorId,
          updatedVendor: updatedVendor,
        })
      );
      if (result.type === "admin/updateVendor/fulfilled") {
        toast.success("Vendor updated!");
        dispatch(fetchAllVendors());
        setOpenEditModal(false);
      } else {
        toast.error("Failed to update vendor.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // DataGrid columns (desktop)
  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 120,
      flex: 1,
      renderCell: ({ value }) => `...${value.slice(-6)}`,
    },
    {
      field: "registrationDate",
      headerName: "Reg Date",
      minWidth: 140,
      flex: 1,
      renderCell: ({ value }) => format(new Date(value), "MMM dd, yyyy"),
    },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.5 },
    { field: "email", headerName: "Email", minWidth: 220, flex: 2 },
    { field: "phoneNumber", headerName: "Phone", minWidth: 140, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.7,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={row.isBlocked ? "Blocked" : "Active"}
            size="small"
            color={row.isBlocked ? "error" : "success"}
            variant="outlined"
          />
          <Switch
            checked={!row.isBlocked}
            onChange={() => handleStatusToggle(row.id, row.isBlocked)}
            color="primary"
            size="small"
          />
        </Box>
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
            <IconButton size="small" color="primary" onClick={() => handleVendorEdit(params.row)}>
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDeleteConfirmation(params.row.id)}>
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton size="small" color="info" onClick={() => handleViewVendor(params.row.id)}>
              <AiOutlineEye size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = filteredVendors.map((vendor) => ({
    id: vendor._id,
    registrationDate: vendor.createdAt,
    name: vendor.name,
    email: vendor.email,
    phoneNumber: vendor.phoneNumber,
    isBlocked: vendor.isBlocked,
  }));

  if (isLoading) return <Loader />;
  if (error) return <Box sx={{ p: 3 }}><Typography color="error">{String(error)}</Typography></Box>;

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
              <i className="fas fa-store text-xl text-primary" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              Vendors
            </Typography>
            <Chip label={vendors?.length || 0} size="small" color="primary" />
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

      {/* Content: DataGrid or mobile cards */}
      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {filteredVendors.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No vendors found.
            </Typography>
          ) : (
            filteredVendors.map((vendor) => (
              <MobileVendorCard
                key={vendor._id}
                vendor={{
                  id: vendor._id,
                  name: vendor.name,
                  email: vendor.email,
                  phoneNumber: vendor.phoneNumber,
                  registrationDate: vendor.createdAt,
                  isBlocked: vendor.isBlocked,
                }}
                onEdit={handleVendorEdit}
                onDelete={handleDeleteConfirmation}
                onView={handleViewVendor}
                onStatusToggle={handleStatusToggle}
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

      {/* Edit Vendor Modal */}
      <EditProductModal
        open={openEditModal}
        onClose={handleEditModalClose}
        data={updatedVendor}
        onInputChange={handleInputChange}
        onSave={handleUpdateVendor}
        isVendorEdit={true}
      />

      {/* View Vendor Modal */}
      <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {singleVendor?.name ? `Details for ${singleVendor.name}` : "Vendor Details"}
        </DialogTitle>
        <DialogContent dividers>
          {!singleVendor ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{singleVendor.name}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    <strong>Email:</strong> {singleVendor.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {singleVendor.phoneNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Address:</strong> {singleVendor.address || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Zip Code:</strong> {singleVendor.zipCode || "N/A"}
                  </Typography>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">Avatar</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Image
                    src={singleVendor.avatar?.url || "/images/avatar-placeholder.png"}
                    alt={`${singleVendor.name} Avatar`}
                    width={80}
                    height={80}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Approval Status</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    <strong>Approved:</strong> {singleVendor.isApproved ? "Yes" : "No"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Blocked:</strong> {singleVendor.isBlocked ? "Yes" : "No"}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenViewModal(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this vendor? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteVendor} color="error" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllVendorsTable;