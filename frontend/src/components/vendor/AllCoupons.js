import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
  Switch,
  Tooltip,
  IconButton,
  InputAdornment,
  Chip,
  Divider,
  Box,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineSearch,
  AiOutlinePlus,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../vendor/layout/Loader";
import {
  fetchAllCoupons,
  createCoupon,
  deleteCoupon,
  updateCoupon,
} from "@/redux/slices/couponSlice";
import { vendorGetAllProducts } from "@/redux/slices/productSlice";
import {
  fetchCategories,
  fetchSubcategories,
  fetchSubSubcategories,
} from "@/redux/slices/categorySlice";
import ProductTable from "../common/ProductTable";

const AllCoupons = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useDispatch();
  const { vendorInfo } = useSelector((state) => state.vendors);
  const { coupons, loading } = useSelector((state) => state.coupons);
  const { vendorProducts } = useSelector((state) => state.products);
  const { categories, subcategories, subSubcategories } = useSelector(
    (state) => state.categories
  );

  // State
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [editCouponId, setEditCouponId] = useState(null);

  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("Purchase");
  const [status, setStatus] = useState("active");
  const [validityStart, setValidityStart] = useState(new Date());
  const [validityEnd, setValidityEnd] = useState(new Date());

  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Effects
  useEffect(() => {
    if (vendorInfo?._id) {
      dispatch(fetchAllCoupons(vendorInfo._id));
      dispatch(vendorGetAllProducts(vendorInfo._id));
    }
    dispatch(fetchCategories());
  }, [dispatch, vendorInfo]);

  useEffect(() => {
    if (mainCategory) {
      dispatch(fetchSubcategories(mainCategory));
      setSubCategory("");
      setSubSubCategory("");
    }
  }, [dispatch, mainCategory]);

  useEffect(() => {
    if (subCategory) {
      dispatch(fetchSubSubcategories(subCategory));
      setSubSubCategory("");
    }
  }, [dispatch, subCategory]);

  useEffect(() => {
    if (subSubCategory) {
      const filtered = vendorProducts.filter(
        (product) => product.subSubCategory === subSubCategory
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [subSubCategory, vendorProducts]);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredCoupons(
      coupons.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) || c._id?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, coupons]);

  // Helpers
  const resetForm = () => {
    setName("");
    setValue("");
    setType("Purchase");
    setStatus("active");
    setValidityStart(new Date());
    setValidityEnd(new Date());
    setMainCategory("");
    setSubCategory("");
    setSubSubCategory("");
    setSelectedProducts([]);
    setEditMode(false);
    setEditCouponId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const couponData = {
      name,
      value,
      type,
      validityStart,
      validityEnd,
      status,
      selectedProducts,
      vendorId: vendorInfo._id,
      mainCategory,
      subCategory,
      subSubCategory,
    };

    const action = editMode
      ? updateCoupon({ couponId: editCouponId, couponData })
      : createCoupon(couponData);

    const result = await dispatch(action);
    if (
      result.type ===
      (editMode
        ? "coupons/updateCoupon/fulfilled"
        : "coupons/createCoupon/fulfilled")
    ) {
      toast.success(editMode ? "Coupon updated!" : "Coupon created!");
      dispatch(fetchAllCoupons(vendorInfo._id));
      setOpenDialog(false);
      resetForm();
    } else {
      toast.error("Operation failed.");
    }
  };

  const handleEdit = (coupon) => {
    setEditMode(true);
    setEditCouponId(coupon.id);
    setName(coupon.name);
    setValue(coupon.value ?? "");
    setType(coupon.type);
    setStatus(coupon.status);
    setValidityStart(new Date(coupon.validity?.start || coupon.validityStart));
    setValidityEnd(new Date(coupon.validity?.end || coupon.validityEnd));
    setSelectedProducts(coupon.selectedProducts);
    setMainCategory(coupon.mainCategory || "");
    setSubCategory(coupon.subCategory || "");
    setSubSubCategory(coupon.subSubCategory || "");
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteCoupon(deleteTargetId));
    if (result.type === "coupons/deleteCoupon/fulfilled") {
      toast.success("Deleted.");
      dispatch(fetchAllCoupons(vendorInfo._id));
    } else {
      toast.error("Delete failed.");
    }
    setDeleteDialog(false);
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const currentCoupon = coupons.find((c) => c._id === id);
    const updated = { ...currentCoupon, status: newStatus };

    const result = await dispatch(
      updateCoupon({ couponId: id, couponData: updated })
    );
    if (result.type === "coupons/updateCoupon/fulfilled") {
      toast.success("Status updated.");
      dispatch(fetchAllCoupons(vendorInfo._id));
    } else {
      toast.error("Status update failed.");
    }
  };

  const handleProductSelection = (e) => {
    const { options } = e.target;
    const selected = [];
    for (const option of options) {
      if (option.selected) selected.push(option.value);
    }
    setSelectedProducts(selected);
  };

  // Table columns
  const columns = [
    { field: "name", headerName: "Name", minWidth: 150, flex: 1 },
    { field: "valueDisplay", headerName: "Value", minWidth: 80, flex: 0.7 },
    {
      field: "type",
      headerName: "Type",
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.row.type}
          size="small"
          color={params.row.type === "Purchase" ? "success" : "primary"}
          variant="outlined"
        />
      ),
    },
    {
      field: "validity",
      headerName: "Validity",
      minWidth: 200,
      flex: 1.2,
      renderCell: ({ row }) => {
        const start = row.validity.start
          ? new Date(row.validity.start).toLocaleDateString()
          : "N/A";
        const end = row.validity.end
          ? new Date(row.validity.end).toLocaleDateString()
          : "N/A";
        return `${start} - ${end}`;
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 80,
      flex: 0.5,
      renderCell: ({ row }) => (
        <Switch
          checked={row.status === "active"}
          onChange={() => handleStatusToggle(row.id, row.status)}
          color="primary"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 1,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              onClick={() => handleEdit(row)}
              size="small"
            >
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => {
                setDeleteTargetId(row.id);
                setDeleteDialog(true);
              }}
              size="small"
            >
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = filteredCoupons.map((coupon, index) => ({
    id: coupon._id ?? index,
    name: coupon.name ?? "N/A",
    valueDisplay: coupon.value ? `${coupon.value}%` : "0%",
    value: coupon.value || "0",
    type: coupon.type === "Purchase" ? "Purchase" : "Delivery",
    validity: {
      start: coupon.validityStart,
      end: coupon.validityEnd,
    },
    status: coupon.status ?? "active",
    selectedProducts: coupon.selectedProducts ?? [],
    mainCategory: coupon.mainCategory,
    subCategory: coupon.subCategory,
    subSubCategory: coupon.subSubCategory,
  }));

  if (loading) return <Loader />;

  return (
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
          backgroundColor: "white",
          border: "1px solid",
          borderColor: "grey.100",
          flexDirection: isMobile ? "column" : "row",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        <div>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            My Coupons
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your promotional coupons
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AiOutlinePlus />}
          onClick={() => setOpenDialog(true)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            py: 1,
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
            width: isMobile ? "100%" : "auto",
          }}
        >
          Create Coupon
        </Button>
      </Paper>

      {/* Search Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: 2,
          borderRadius: 3,
          backgroundColor: "white",
          border: "1px solid",
          borderColor: "grey.100",
        }}
      >
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

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "auto",
          border: "1px solid",
          borderColor: "grey.100",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ minWidth: isMobile ? "700px" : "100%" }}>
          <ProductTable
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                py: 2,
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
              },
            }}
          />
        </Box>
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, m: isMobile ? 2 : 1 },
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: "bold" }}>
          {editMode ? "Update Coupon" : "Create New Coupon"}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Coupon Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Discount (%)"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                mb: 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                select
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ flex: 1 }}
              >
                <MenuItem value="Purchase">Purchase</MenuItem>
                <MenuItem value="Delivery">Delivery</MenuItem>
              </TextField>
              <TextField
                select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ flex: 1 }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Box>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Validity Period
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                mb: 3,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <DatePicker
                selected={validityStart}
                onChange={setValidityStart}
                customInput={
                  <TextField fullWidth label="Start Date" variant="outlined" />
                }
              />
              <DatePicker
                selected={validityEnd}
                onChange={setValidityEnd}
                customInput={
                  <TextField fullWidth label="End Date" variant="outlined" />
                }
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Product Eligibility (Optional)
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                mb: 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                select
                label="Main Category"
                value={mainCategory}
                onChange={(e) => setMainCategory(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ flex: 1 }}
              >
                <MenuItem value="">Select</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c._id} value={c.slug}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Sub Category"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                disabled={!mainCategory}
                fullWidth
                variant="outlined"
                sx={{ flex: 1 }}
              >
                <MenuItem value="">Select</MenuItem>
                {subcategories.map((c) => (
                  <MenuItem key={c._id} value={c.slug}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                select
                label="Sub-Sub Category"
                value={subSubCategory}
                onChange={(e) => setSubSubCategory(e.target.value)}
                disabled={!subCategory}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="">Select</MenuItem>
                {subSubcategories.map((c) => (
                  <MenuItem key={c._id} value={c.slug}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <TextField
              select
              label="Specific Products"
              value={selectedProducts}
              onChange={handleProductSelection}
              fullWidth
              variant="outlined"
              SelectProps={{
                multiple: true,
                renderValue: (selected) => {
                  const selectedNames = selected.map(
                    (id) => vendorProducts.find((p) => p._id === id)?.name || id
                  );
                  return selectedNames.join(", ");
                },
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                },
              }}
              sx={{ mb: 2 }}
              disabled={!subSubCategory && filteredProducts.length === 0}
            >
              {filteredProducts.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name}
                </MenuItem>
              ))}
            </TextField>
            {!subSubCategory && filteredProducts.length === 0 && (
              <Typography variant="caption" color="text.secondary">
                Select a sub-sub category to see products.
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            flexDirection: isMobile ? "column" : "row",
            gap: 1,
          }}
        >
          <Button onClick={() => setOpenDialog(false)} color="inherit" fullWidth={isMobile}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ borderRadius: 2, textTransform: "none" }}
            fullWidth={isMobile}
          >
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        PaperProps={{ sx: { borderRadius: 3, m: 2 } }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this coupon? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            flexDirection: isMobile ? "column" : "row",
            gap: 1,
          }}
        >
          <Button onClick={() => setDeleteDialog(false)} color="inherit" fullWidth={isMobile}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2, textTransform: "none" }}
            fullWidth={isMobile}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllCoupons;