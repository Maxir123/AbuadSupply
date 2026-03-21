import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineSearch,
} from "react-icons/ai";
import {
  Button,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Paper,
  Grid,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
  TextField,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import Image from "next/image";

import { vendorDeleteSale, vendorGetAllSales, fetchSingleSaleByVendor, vendorUpdateSale } from "@/redux/slices/saleSlice";
import { fetchCategories, fetchSubcategories, fetchSubSubcategories } from "@/redux/slices/categorySlice";
import { fetchAllBrands } from "@/redux/slices/brandSlice";

import Loader from "./layout/Loader";
import EditProductModal from "../common/ProductEditModal";
import FilterProducts from "../common/FilterProducts";
import ConfirmationModal from "../common/ConfirmationModal";

// Nigerian Naira formatter
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

const AllSaleProducts = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const { vendorInfo } = useSelector((state) => state.vendors);
  const { sales, singleSale, isLoading } = useSelector((state) => state.sales);
  const { brands } = useSelector((state) => state.brands);
  const { categories, subcategories, subSubcategories } = useSelector((state) => state.categories);

  const [searchQuery, setSearchQuery] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false);

  const [selectedSale, setSelectedSale] = useState(null);
  const [saleToDelete, setSaleToDelete] = useState(null);

  const [updatedSale, setUpdatedSale] = useState({
    name: "",
    description: "",
    brand: "",
    mainCategory: "",
    subCategory: "",
    subSubCategory: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
  });

  const vendorId = vendorInfo?._id;

  // Data fetching
  useEffect(() => {
    if (vendorId) {
      dispatch(vendorGetAllSales(vendorId));
    }
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
  }, [dispatch, vendorId]);

  useEffect(() => {
    if (mainCategory) dispatch(fetchSubcategories(mainCategory));
  }, [dispatch, mainCategory]);

  useEffect(() => {
    if (subCategory) dispatch(fetchSubSubcategories(subCategory));
  }, [dispatch, subCategory]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    let list = Array.isArray(sales) ? [...sales] : [];

    if (mainCategory) list = list.filter(s => s.mainCategory === mainCategory);
    if (subCategory) list = list.filter(s => s.subCategory === subCategory);
    if (subSubCategory) list = list.filter(s => s.subSubCategory === subSubCategory);
    if (selectedBrand) list = list.filter(s => s.brand === selectedBrand);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        (s.name || "").toLowerCase().includes(q) ||
        (s._id || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [sales, mainCategory, subCategory, subSubCategory, selectedBrand, searchQuery]);

  // Handlers
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleFilterReset = () => {
    setMainCategory("");
    setSubCategory("");
    setSubSubCategory("");
    setSelectedBrand("");
    setSearchQuery("");
  };

  const handleSaleEdit = (sale) => {
    setSelectedSale(sale);
    setUpdatedSale({
      id: sale._id,
      name: sale.name,
      description: sale.description || "",
      brand: sale.brand || "",
      mainCategory: sale.mainCategory,
      subCategory: sale.subCategory,
      subSubCategory: sale.subSubCategory,
      originalPrice: sale.originalPrice || "",
      discountPrice: sale.discountPrice,
      stock: sale.stock,
    });
    setOpenEditModal(true);
  };

  const closeEditModal = () => setOpenEditModal(false);
  const handleInputChange = (e) =>
    setUpdatedSale({ ...updatedSale, [e.target.name]: e.target.value });

  const handleUpdateSale = async () => {
    const result = await dispatch(vendorUpdateSale({
      id: updatedSale.id,
      updatedData: updatedSale,
    }));
    if (result.type.includes("fulfilled")) {
      toast.success("Sale product updated!");
      setOpenEditModal(false);
      dispatch(vendorGetAllSales(vendorId));
    } else {
      toast.error("Failed to update sale product");
    }
  };

  const openDeleteModalHandler = (id) => {
    setSaleToDelete(id);
    setOpenDeleteModal(true);
  };

  const handleDeleteSale = async () => {
    const result = await dispatch(vendorDeleteSale(saleToDelete));
    if (result.type.includes("fulfilled")) {
      toast.success("Sale product deleted!");
      dispatch(vendorGetAllSales(vendorId));
    } else {
      toast.error("Failed to delete.");
    }
    setOpenDeleteModal(false);
  };

  const handleViewSale = async (id) => {
    setIsViewLoading(true);
    await dispatch(fetchSingleSaleByVendor(id));
    setIsViewLoading(false);
    setOpenViewModal(true);
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // DataGrid columns
  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 120,
      flex: 1,
      renderCell: ({ row: { id } }) => `...${id.slice(-6)}`,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1.4,
      renderCell: ({ row: { name } }) => (
        <Tooltip title={name}>
          <span>{name.length > 25 ? `${name.slice(0, 25)}...` : name}</span>
        </Tooltip>
      ),
    },
    {
      field: "brand",
      headerName: "Brand",
      minWidth: 120,
      flex: 0.8,
    },
    {
      field: "discountPrice",
      headerName: "Sale Price",
      minWidth: 120,
      flex: 0.8,
      renderCell: ({ row: { discountPrice } }) => formatNaira(discountPrice),
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
      renderCell: ({ row: { stock } }) => (
        <Chip
          label={stock}
          size="small"
          color={stock > 10 ? "success" : stock > 0 ? "warning" : "error"}
          variant="outlined"
        />
      ),
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 150,
      flex: 1,
      renderCell: ({ row: { mainCategory } }) => capitalize(mainCategory),
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
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleSaleEdit(params.row)}
            >
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              size="small"
              onClick={() => openDeleteModalHandler(params.row.id)}
            >
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton
              color="info"
              size="small"
              onClick={() => handleViewSale(params.row.id)}
            >
              <AiOutlineEye size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = filteredSales.map((s) => ({
    ...s,
    id: s._id,
  }));

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
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
              bgcolor: "secondary.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i className="fas fa-percent text-xl text-secondary" />
          </Box>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Sale Products
          </Typography>
          <Chip
            label={sales?.length || 0}
            size="small"
            color="secondary"
            sx={{ ml: 1 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage your discounted products
        </Typography>
      </Paper>

      {/* Filters */}
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
        <FilterProducts
          mainCategory={mainCategory}
          subCategory={subCategory}
          subSubCategory={subSubCategory}
          selectedBrand={selectedBrand}
          categories={categories}
          subcategories={subcategories}
          subSubcategories={subSubcategories}
          brands={brands}
          handleFilterReset={handleFilterReset}
          handleCategoryChange={(e) => setMainCategory(e.target.value)}
          handleSubCategoryChange={(e) => setSubCategory(e.target.value)}
          handleSubSubCategoryChange={(e) => setSubSubCategory(e.target.value)}
          handleBrandChange={(e) => setSelectedBrand(e.target.value)}
        />
      </Paper>

      {/* Search */}
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
          placeholder="Search by name or ID..."
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

      {/* Table */}
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
        <Box sx={{ minWidth: isMobile ? "800px" : "100%" }}>
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

      {/* Edit Product Modal */}
      <EditProductModal
        open={openEditModal}
        onClose={closeEditModal}
        data={updatedSale}
        onInputChange={handleInputChange}
        onSave={handleUpdateSale}
        selectedBrand={selectedBrand}
        mainCategory={mainCategory}
        subCategory={subCategory}
        subSubCategory={subSubCategory}
        handleBrandChange={(e) => setSelectedBrand(e.target.value)}
        handleCategoryChange={(e) => setMainCategory(e.target.value)}
        handleSubCategoryChange={(e) => setSubCategory(e.target.value)}
        handleSubSubCategoryChange={(e) => setSubSubCategory(e.target.value)}
        brands={brands}
        categories={categories}
        subcategories={subcategories}
        subSubcategories={subSubcategories}
      />

      {/* View Sale Modal */}
      <Dialog
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>Sale Details</DialogTitle>
        <DialogContent dividers>
          {isViewLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : singleSale ? (
            <Grid container spacing={2}>
              {/* Basic Info */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {singleSale.name}
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Brand:</strong> {singleSale.brand}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Main Category:</strong> {singleSale.mainCategory}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Sub Category:</strong> {singleSale.subCategory}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Sub Sub Category:</strong> {singleSale.subSubCategory}
                  </Typography>
                  {singleSale.description && (
                    <Typography variant="body2" mt={1}>
                      <strong>Description:</strong> {singleSale.description}
                    </Typography>
                  )}
                </Paper>
              </Grid>

              {/* Pricing & Stock */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Pricing & Stock
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Original Price:</strong> {formatNaira(singleSale.originalPrice)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Sale Price:</strong> {formatNaira(singleSale.discountPrice)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Stock:</strong> {singleSale.stock}
                  </Typography>
                </Paper>
              </Grid>

              {/* Vendor Info */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Vendor Information
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {singleSale.vendor?.name || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Address:</strong> {singleSale.vendor?.address || "N/A"}
                  </Typography>
                  {singleSale.vendor?.avatar?.url && (
                    <Box sx={{ mt: 2 }}>
                      <Image
                        src={singleSale.vendor.avatar.url}
                        alt="Vendor Avatar"
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Product Images */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Sale Images
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {Array.isArray(singleSale.images) &&
                      singleSale.images.map((img, idx) =>
                        img?.url ? (
                          <Image
                            key={img._id || idx}
                            src={img.url}
                            alt={`Sale ${idx + 1}`}
                            width={100}
                            height={100}
                            style={{ objectFit: "cover", borderRadius: 8 }}
                          />
                        ) : null
                      )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Sale details are not available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenViewModal(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteSale}
        title="Delete Sale"
        message="Are you sure you want to delete this sale product? This action cannot be undone."
      />
    </Box>
  );
};

export default AllSaleProducts;