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
import { toast } from "react-toastify";
import { AiOutlineDelete, AiOutlineEye, AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import { fetchAllProducts, updateProduct, deleteProduct, fetchSingleProduct, fetchAllVendors, createProduct } from "@/redux/adminSlice";
import { fetchAllBrands } from "@/redux/brandSlice";
import { fetchCategories, fetchSubcategories, fetchSubSubcategories } from "@/redux/categorySlice";
import EditProductModal from "../common/ProductEditModal";
import FilterProducts from "../common/FilterProducts";
import Loader from "./layout/Loader";
import ConfirmationModal from "../common/ConfirmationModal";
import CreateItemModal from "../common/CreateItemModal";
import ViewProductModal from "../common/ViewproductModal";

// Nigerian Naira formatter
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Mobile Product Card
const MobileProductCard = ({ product, onEdit, onDelete, onView }) => {
  const price = product.discountPrice || product.originalPrice;
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
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Brand: {product.brand}
        </Typography>
        <Typography variant="body2" fontWeight="500" color="primary.main" gutterBottom>
          {formatNaira(price)}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
          <Chip
            label={`Stock: ${product.stock}`}
            size="small"
            color={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "error"}
            variant="outlined"
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Edit">
              <IconButton size="small" color="primary" onClick={() => onEdit(product)}>
                <AiOutlineEdit size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => onDelete(product.id)}>
                <AiOutlineDelete size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="View">
              <IconButton size="small" color="info" onClick={() => onView(product.id)}>
                <AiOutlineEye size={18} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const AllProductsTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  // Redux state
  const { singleProduct, vendors, products, isLoading } = useSelector((state) => state.admin);
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

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    id: "",
    name: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
    brand: "",
    mainCategory: "",
    subCategory: "",
    subSubCategory: "",
  });

  // New product state
  const [newProduct, setNewProduct] = useState({
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
  });

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
    dispatch(fetchAllVendors());
  }, [dispatch]);

  // Fetch subcategories when main category changes
  useEffect(() => {
    if (mainCategory) {
      dispatch(fetchSubcategories(mainCategory));
    }
  }, [dispatch, mainCategory]);

  // Fetch sub‑subcategories when subcategory changes
  useEffect(() => {
    if (subCategory) {
      dispatch(fetchSubSubcategories(subCategory));
    }
  }, [dispatch, subCategory]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];
    if (mainCategory) list = list.filter((p) => p.mainCategory === mainCategory);
    if (subCategory) list = list.filter((p) => p.subCategory === subCategory);
    if (subSubCategory) list = list.filter((p) => p.subSubCategory === subSubCategory);
    if (selectedBrand) list = list.filter((p) => p.brand === selectedBrand);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p._id?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, mainCategory, subCategory, subSubCategory, selectedBrand, searchQuery]);

  // Handlers
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
  const handleProductEdit = (product) => {
    setSelectedProduct(product);
    setUpdatedProduct({
      id: product.id,
      name: product.name,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice || "",
      stock: product.stock,
      brand: product.brand,
      mainCategory: product.mainCategory,
      subCategory: product.subCategory,
      subSubCategory: product.subSubCategory,
    });
    setMainCategory(product.mainCategory);
    setSubCategory(product.subCategory);
    setSubSubCategory(product.subSubCategory);
    setSelectedBrand(product.brand);
    setOpenEditModal(true);
  };

  const closeEditModal = () => {
    setOpenEditModal(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProduct = async () => {
    if (!subCategory || !subSubCategory) {
      return toast.error("Please select both sub‑category and sub‑sub‑category.");
    }
    const payload = {
      id: updatedProduct.id,
      name: updatedProduct.name,
      originalPrice: updatedProduct.originalPrice,
      discountPrice: updatedProduct.discountPrice,
      stock: updatedProduct.stock,
      brand: selectedBrand,
      mainCategory,
      subCategory,
      subSubCategory,
    };
    try {
      const result = await dispatch(updateProduct({ productId: updatedProduct.id, updatedProduct: payload }));
      if (result.type === "admin/updateProduct/fulfilled") {
        toast.success("Product updated!");
        dispatch(fetchAllProducts());
        setOpenEditModal(false);
      } else {
        toast.error("Update failed.");
      }
    } catch {
      toast.error("An error occurred.");
    }
  };

  // Delete handlers
  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setOpenDeleteModal(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      const result = await dispatch(deleteProduct(productToDelete));
      if (result.type === "admin/deleteProduct/fulfilled") {
        toast.success("Product deleted!");
        dispatch(fetchAllProducts());
      } else {
        toast.error("Deletion failed.");
      }
    } catch {
      toast.error("An error occurred.");
    }
    setOpenDeleteModal(false);
  };

  // View handler
  const handleViewProduct = async (productId) => {
    await dispatch(fetchSingleProduct(productId));
    setOpenViewModal(true);
  };

  // Create product handlers
  const handleNewProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };
  const handleNewProductAttributeChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [name]: value },
    }));
  };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewProduct((prev) => ({ ...prev, images: files }));
  };
  const handleCreateProduct = async () => {
    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      if (key !== "images") {
        if (key === "attributes") {
          formData.append(key, JSON.stringify(newProduct[key]));
        } else {
          formData.append(key, newProduct[key]);
        }
      }
    });
    newProduct.images.forEach((file) => {
      formData.append("images", file);
    });
    try {
      const result = await dispatch(createProduct(formData));
      if (result.type === "admin/createProduct/fulfilled") {
        toast.success("Product created!");
        setOpenCreateModal(false);
        dispatch(fetchAllProducts());
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
      field: "price",
      headerName: "Price",
      minWidth: 120,
      flex: 0.8,
      renderCell: ({ row }) => formatNaira(row.discountPrice || row.originalPrice),
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
            <IconButton size="small" color="primary" onClick={() => handleProductEdit(params.row)}>
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDeleteClick(params.row.id)}>
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton size="small" color="info" onClick={() => handleViewProduct(params.row.id)}>
              <AiOutlineEye size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = filteredProducts.map((p) => ({
    id: p._id,
    name: p.name,
    brand: p.brand,
    originalPrice: p.originalPrice,
    discountPrice: p.discountPrice,
    stock: p.stock,
    mainCategory: p.mainCategory,
  }));

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: "white", border: "1px solid", borderColor: "grey.100" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "primary.light", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="fas fa-boxes text-xl text-primary" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              Products
            </Typography>
            <Chip label={products?.length || 0} size="small" color="primary" />
          </Box>
          <Button variant="contained" startIcon={<AiOutlineEdit />} onClick={() => setOpenCreateModal(true)} sx={{ textTransform: "none", borderRadius: 2 }}>
            Create Product
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
          {filteredProducts.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No products found.
            </Typography>
          ) : (
            filteredProducts.map((product) => (
              <MobileProductCard
                key={product._id}
                product={{
                  id: product._id,
                  name: product.name,
                  brand: product.brand,
                  originalPrice: product.originalPrice,
                  discountPrice: product.discountPrice,
                  stock: product.stock,
                }}
                onEdit={handleProductEdit}
                onDelete={handleDeleteClick}
                onView={handleViewProduct}
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

      {/* Modals */}
      <EditProductModal
        open={openEditModal}
        onClose={closeEditModal}
        data={updatedProduct}
        onInputChange={handleInputChange}
        onSave={handleUpdateProduct}
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

      <CreateItemModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        newItem={newProduct}
        onInputChange={handleNewProductInputChange}
        onAttributeChange={handleNewProductAttributeChange}
        onSave={handleCreateProduct}
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
        isSale={false}
      />

      <ViewProductModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        isLoading={isLoading}
        singleProduct={singleProduct}
      />

      <ConfirmationModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </Box>
  );
};

export default AllProductsTable;