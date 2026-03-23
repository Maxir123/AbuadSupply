import React, { useEffect, useState, useMemo } from "react";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineDelete, AiOutlineEye, AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import { toast } from "react-toastify";
import Image from "next/image";

// Redux thunks and selectors (adjust the paths as needed)
import { fetchAllSales, fetchSingleSale, updateSale, deleteSale, createSale, fetchAllVendors } from "@/redux/adminSlice";
import { fetchCategories, fetchSubcategories, fetchSubSubcategories } from "@/redux/categorySlice";
import { fetchAllBrands } from "@/redux/brandSlice";

// Local component imports
import EditProductModal from "../common/ProductEditModal";
import FilterProducts from "../common/FilterProducts";
import Loader from "../admin/layout/Loader";
import ConfirmationModal from "../common/ConfirmationModal";
import CreateItemModal from "../common/CreateItemModal";

// Nigerian Naira formatter
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Mobile Sale Card
const MobileSaleCard = ({ sale, onEdit, onDelete, onView }) => {
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
          {sale.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Brand: {sale.brand}
        </Typography>
        <Typography variant="body2" fontWeight="500" color="primary.main" gutterBottom>
          {formatNaira(sale.discountPrice)}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
          <Chip
            label={`Stock: ${sale.stock}`}
            size="small"
            color={sale.stock > 10 ? "success" : sale.stock > 0 ? "warning" : "error"}
            variant="outlined"
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Edit">
              <IconButton size="small" color="primary" onClick={() => onEdit(sale)}>
                <AiOutlineEdit size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => onDelete(sale.id)}>
                <AiOutlineDelete size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="View">
              <IconButton size="small" color="info" onClick={() => onView(sale.id)}>
                <AiOutlineEye size={18} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const AllSaleProductsTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  // Redux state
  const { sales, singleSale, vendors, isLoading } = useSelector((state) => state.admin);
  const { brands } = useSelector((state) => state.brands);
  const { categories, subcategories, subSubcategories } = useSelector((state) => state.categories);

  // Filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // Modal states
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [selectedSale, setSelectedSale] = useState(null);
  const [saleToDelete, setSaleToDelete] = useState(null);

  // Updated sale data for editing
  const [updatedSale, setUpdatedSale] = useState({
    id: "",
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

  // New sale data
  const [newSale, setNewSale] = useState({
    name: "",
    description: "",
    mainCategory: "",
    subCategory: "",
    subSubCategory: "",
    brand: "",
    originalPrice: 0,
    discountPrice: 0,
    stock: 0,
    vendorId: "",
    isFeatured: false,
    images: [],
    attributes: {},
    saleStart: "",
    saleEnd: "",
  });

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchAllSales());
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
    dispatch(fetchAllVendors());
  }, [dispatch]);

  // Subcategory / sub‑subcategory dependencies
  useEffect(() => {
    if (mainCategory) dispatch(fetchSubcategories(mainCategory));
  }, [dispatch, mainCategory]);

  useEffect(() => {
    if (subCategory) dispatch(fetchSubSubcategories(subCategory));
  }, [dispatch, subCategory]);

  // Filter sales
  const filteredSales = useMemo(() => {
    let list = Array.isArray(sales) ? [...sales] : [];
    if (mainCategory) list = list.filter((s) => s.mainCategory === mainCategory);
    if (subCategory) list = list.filter((s) => s.subCategory === subCategory);
    if (subSubCategory) list = list.filter((s) => s.subSubCategory === subSubCategory);
    if (selectedBrand) list = list.filter((s) => s.brand === selectedBrand);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.brand?.toLowerCase().includes(q) ||
          s._id?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [sales, mainCategory, subCategory, subSubCategory, selectedBrand, searchQuery]);

  // Filter handlers
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleFilterReset = () => {
    setMainCategory("");
    setSubCategory("");
    setSubSubCategory("");
    setSelectedBrand("");
    setSearchQuery("");
  };
  const handleBrandChange = (e) => setSelectedBrand(e.target.value);
  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setMainCategory(val);
    setSubCategory("");
    setSubSubCategory("");
    dispatch(fetchSubcategories(val));
  };
  const handleSubCategoryChange = (e) => {
    const val = e.target.value;
    setSubCategory(val);
    setSubSubCategory("");
    dispatch(fetchSubSubcategories(val));
  };
  const handleSubSubCategoryChange = (e) => setSubSubCategory(e.target.value);

  // Edit handlers
  const handleSaleEdit = (sale) => {
    setSelectedSale(sale);
    setUpdatedSale({
      id: sale.id,
      name: sale.name,
      description: sale.description || "",
      brand: sale.brand,
      mainCategory: sale.mainCategory,
      subCategory: sale.subCategory,
      subSubCategory: sale.subSubCategory,
      originalPrice: sale.originalPrice,
      discountPrice: sale.discountPrice,
      stock: sale.stock,
    });
    setMainCategory(sale.mainCategory);
    setSubCategory(sale.subCategory);
    setSubSubCategory(sale.subSubCategory);
    setSelectedBrand(sale.brand);
    setOpenEditModal(true);
  };

  const closeEditModal = () => {
    setOpenEditModal(false);
    setSelectedSale(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedSale((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSale = async () => {
    if (!subCategory || !subSubCategory) {
      toast.error("Please select both sub‑category and sub‑sub‑category.");
      return;
    }
    const payload = {
      name: updatedSale.name,
      description: updatedSale.description,
      brand: selectedBrand,
      mainCategory,
      subCategory,
      subSubCategory,
      originalPrice: updatedSale.originalPrice,
      discountPrice: updatedSale.discountPrice,
      stock: updatedSale.stock,
    };
    try {
      const result = await dispatch(updateSale({ saleId: updatedSale.id, saleData: payload }));
      if (result.type === "sales/updateSale/fulfilled") {
        toast.success("Sale updated!");
        dispatch(fetchAllSales());
        setOpenEditModal(false);
      } else {
        toast.error("Update failed.");
      }
    } catch {
      toast.error("An error occurred.");
    }
  };

  // Delete handlers
  const handleDeleteClick = (saleId) => {
    setSaleToDelete(saleId);
    setOpenDeleteModal(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      const result = await dispatch(deleteSale(saleToDelete));
      if (result.type === "sales/deleteSale/fulfilled") {
        toast.success("Sale deleted!");
        dispatch(fetchAllSales());
      } else {
        toast.error("Deletion failed.");
      }
    } catch {
      toast.error("An error occurred.");
    }
    setOpenDeleteModal(false);
  };

  // View handler
  const handleViewSale = async (saleId) => {
    await dispatch(fetchSingleSale(saleId));
    setOpenViewModal(true);
  };

  // Create handlers
  const handleNewProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewSale((prev) => ({ ...prev, images: files }));
  };
  const handleNewProductAttributeChange = (e) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [name]: value },
    }));
  };
  const handleCreateSale = async () => {
    const formData = new FormData();
    Object.keys(newSale).forEach((key) => {
      if (key !== "images") {
        if (key === "attributes") {
          formData.append(key, JSON.stringify(newSale[key]));
        } else {
          formData.append(key, newSale[key]);
        }
      }
    });
    newSale.images.forEach((file) => {
      formData.append("images", file);
    });
    try {
      const result = await dispatch(createSale(formData));
      if (result.type === "sales/createSale/fulfilled") {
        toast.success("Sale created!");
        setOpenCreateModal(false);
        dispatch(fetchAllSales());
      } else {
        toast.error("Creation failed.");
      }
    } catch {
      toast.error("An error occurred.");
    }
  };

  // DataGrid columns (desktop)
  const columns = [
    { field: "id", headerName: "ID", minWidth: 120, flex: 1, renderCell: ({ value }) => `...${value.slice(-6)}` },
    { field: "name", headerName: "Name", minWidth: 200, flex: 1.4 },
    { field: "brand", headerName: "Brand", minWidth: 130, flex: 0.8 },
    {
      field: "discountPrice",
      headerName: "Sale Price",
      minWidth: 120,
      flex: 0.8,
      renderCell: ({ value }) => formatNaira(value),
    },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 80,
      flex: 0.5,
      renderCell: ({ value }) => (
        <Chip label={value} size="small" color={value > 10 ? "success" : value > 0 ? "warning" : "error"} variant="outlined" />
      ),
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 150,
      flex: 1,
      renderCell: ({ row }) => row.mainCategory,
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
            <IconButton size="small" color="primary" onClick={() => handleSaleEdit(params.row)}>
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDeleteClick(params.row.id)}>
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton size="small" color="info" onClick={() => handleViewSale(params.row.id)}>
              <AiOutlineEye size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = filteredSales.map((sale) => ({
    id: sale._id,
    name: sale.name,
    brand: sale.brand,
    discountPrice: sale.discountPrice,
    stock: sale.stock,
    mainCategory: sale.mainCategory,
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
            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "secondary.light", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="fas fa-percent text-xl text-secondary" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              Sale Products
            </Typography>
            <Chip label={sales?.length || 0} size="small" color="secondary" />
          </Box>
          <Button variant="contained" startIcon={<AiOutlineEdit />} onClick={() => setOpenCreateModal(true)} sx={{ textTransform: "none", borderRadius: 2 }}>
            Create Sale Product
          </Button>
        </Box>
      </Paper>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: "white", border: "1px solid", borderColor: "grey.100" }}>
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
          handleCategoryChange={handleCategoryChange}
          handleSubCategoryChange={handleSubCategoryChange}
          handleSubSubCategoryChange={handleSubSubCategoryChange}
          handleBrandChange={handleBrandChange}
        />
      </Paper>

      {/* Search */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: "white", border: "1px solid", borderColor: "grey.100" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name, brand, or ID..."
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
          {filteredSales.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No sale products found.
            </Typography>
          ) : (
            filteredSales.map((sale) => (
              <MobileSaleCard
                key={sale._id}
                sale={{
                  id: sale._id,
                  name: sale.name,
                  brand: sale.brand,
                  discountPrice: sale.discountPrice,
                  stock: sale.stock,
                }}
                onEdit={handleSaleEdit}
                onDelete={handleDeleteClick}
                onView={handleViewSale}
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

      {/* Edit Sale Modal */}
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
        handleBrandChange={handleBrandChange}
        handleCategoryChange={handleCategoryChange}
        handleSubCategoryChange={handleSubCategoryChange}
        handleSubSubCategoryChange={handleSubSubCategoryChange}
        brands={brands}
        categories={categories}
        subcategories={subcategories}
        subSubcategories={subSubcategories}
      />

      {/* Create Sale Modal */}
      <CreateItemModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        newItem={newSale}
        onInputChange={handleNewProductInputChange}
        onAttributeChange={handleNewProductAttributeChange}
        onSave={handleCreateSale}
        selectedBrand={selectedBrand}
        categories={categories}
        subcategories={subcategories}
        subSubcategories={subSubcategories}
        brands={brands}
        vendors={vendors}
        handleCategoryChange={handleCategoryChange}
        handleSubCategoryChange={handleSubCategoryChange}
        handleSubSubCategoryChange={handleSubSubCategoryChange}
        handleBrandChange={handleBrandChange}
        handleFileChange={handleFileChange}
        isSale={true}
      />

      {/* View Sale Modal */}
      <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Sale Details</DialogTitle>
        <DialogContent dividers>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : singleSale ? (
            <Box>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{singleSale.name}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    <strong>Brand:</strong> {singleSale.brand}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Category:</strong> {singleSale.mainCategory}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Subcategory:</strong> {singleSale.subCategory}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Sub‑subcategory:</strong> {singleSale.subSubCategory}
                  </Typography>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">Vendor Information</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    <strong>Name:</strong> {singleSale.vendor?.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Address:</strong> {singleSale.vendor?.address}
                  </Typography>
                  {singleSale.vendor?.avatar?.url && (
                    <Image
                      src={singleSale.vendor.avatar.url}
                      alt="Vendor Avatar"
                      width={50}
                      height={50}
                      style={{ borderRadius: "50%", marginTop: 8 }}
                    />
                  )}
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">Pricing & Stock</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    <strong>Original Price:</strong> {formatNaira(singleSale.originalPrice)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Sale Price:</strong> {formatNaira(singleSale.discountPrice)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Stock:</strong> {singleSale.stock}
                  </Typography>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Images</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {singleSale.images?.map((img, idx) => (
                      <Image
                        key={img._id || idx}
                        src={img.url}
                        alt={`Sale ${idx + 1}`}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
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
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this sale product? This action cannot be undone."
      />
    </Box>
  );
};

export default AllSaleProductsTable;