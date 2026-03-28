// Third-Party Imports
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineSearch,
} from "react-icons/ai";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Tooltip,
  Typography,
  Box,
  Paper,
  Grid,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// Local Imports
import {
  fetchVendorSingleProduct,
  vendorDeleteProduct,
  vendorGetAllProducts,
  vendorUpdateProduct,
} from "../../redux/slices/productSlice";
import { fetchAllBrands } from "@/redux/slices/brandSlice";
import {
  fetchCategories,
  fetchSubcategories,
  fetchSubSubcategories,
} from "@/redux/slices/categorySlice";
import Loader from "./layout/Loader";
import EditProductModal from "../common/ProductEditModal";
import FilterProducts from "../common/FilterProducts";
import SearchProducts from "../common/SearchProducts";
import ConfirmationModal from "../common/ConfirmationModal";

// Nigerian Naira formatter
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Mobile Product Card Component
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
          Brand: {product.brand?.name || "No brand"}
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

const AllProducts = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { vendorInfo } = useSelector((state) => state.vendors);
  const { vendorProducts, product, isLoading } = useSelector(
    (state) => state.products
  );
  const { brands } = useSelector((state) => state.brands);
  const { categories, subcategories, subSubcategories } = useSelector(
    (state) => state.categories
  );

  // State
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isViewLoading, setIsViewLoading] = useState(false);

  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    price: "",
    stock: "",
    brand: "",
    mainCategory: "",
    subCategory: "",
    subSubCategory: "",
  });

  // Handlers
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleFilterReset = () => {
    setMainCategory("");
    setSubCategory("");
    setSubSubCategory("");
    setSelectedBrand("");
    setSearchQuery("");
  };

  const handleProductEdit = (product) => {
    setSelectedProduct(product);
    setUpdatedProduct({
      id: product.id,
      name: product.name,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice || "",
      stock: product.stock,
      brand: product.brand?.name || "No brand",
      mainCategory: product.mainCategory,
      subCategory: product.subCategory,
      subSubCategory: product.subSubCategory,
    });
    setMainCategory(product.mainCategory);
    setSubCategory(product.subCategory);
    setSubSubCategory(product.subSubCategory);
    setSelectedBrand(product.brand?.name || "No brand");
    setOpenEditModal(true);
  };

  const closeEditModal = () => {
    setOpenEditModal(false);
    setSelectedProduct(null);
  };

  const handleBrandChange = (e) => setSelectedBrand(e.target.value);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setMainCategory(selectedCategory);
    setSubCategory("");
    setSubSubCategory("");
    dispatch(fetchSubcategories(selectedCategory));
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = e.target.value;
    setSubCategory(selectedSubCategory);
    setSubSubCategory("");
    dispatch(fetchSubSubcategories(selectedSubCategory));
  };

  const handleSubSubCategoryChange = (e) => setSubSubCategory(e.target.value);

  const handleUpdateProduct = async () => {
    if (!subCategory || !subSubCategory) {
      return toast.error(
        `Please select ${!subCategory ? "Sub-Category" : "Sub-Sub Category"} before updating.`
      );
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
      const result = await dispatch(vendorUpdateProduct(payload));
      if (result.type === "products/vendorUpdateProduct/fulfilled") {
        toast.success("Product updated successfully!");
        dispatch(vendorGetAllProducts(vendorInfo._id));
        window.location.reload();
        setOpenEditModal(false);
      } else {
        toast.error("Failed to update the product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await dispatch(vendorDeleteProduct(id));
      if (result.type === "products/vendorDeleteProduct/fulfilled") {
        toast.success("Product deleted successfully!");
        dispatch(vendorGetAllProducts(vendorInfo._id));
      } else {
        toast.error(result.payload || "Product deletion failed");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
    }
    setOpenDeleteModal(false);
  };

  const openDeleteModalHandler = (productId) => {
    setProductToDelete(productId);
    setOpenDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewProduct = async (productId) => {
    setIsViewLoading(true);
    await dispatch(fetchVendorSingleProduct(productId));
    setIsViewLoading(false);
    setOpenViewModal(true);
  };

  // Data fetching
  useEffect(() => {
    if (vendorInfo?._id) {
      dispatch(vendorGetAllProducts(vendorInfo._id));
    }
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
  }, [dispatch, vendorInfo]);

  useEffect(() => {
    if (mainCategory) {
      dispatch(fetchSubcategories(mainCategory));
    }
  }, [dispatch, mainCategory]);

  useEffect(() => {
    if (subCategory) {
      dispatch(fetchSubSubcategories(subCategory));
    }
  }, [dispatch, subCategory]);

  // Filter products
  useEffect(() => {
    let filtered = [...vendorProducts];

    if (mainCategory) {
      filtered = filtered.filter((product) => product.mainCategory === mainCategory);
    }
    if (subCategory) {
      filtered = filtered.filter((product) => product.subCategory === subCategory);
    }
    if (subSubCategory) {
      filtered = filtered.filter((product) => product.subSubCategory === subSubCategory);
    }
    if (selectedBrand) {
      filtered = filtered.filter((product) => product.brand?.name || "No brand" === selectedBrand);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand?.name || "No brand".toLowerCase().includes(searchQuery.toLowerCase()) ||
          product._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [
    mainCategory,
    subCategory,
    subSubCategory,
    selectedBrand,
    vendorProducts,
    searchQuery,
  ]);

  // Table columns (desktop)
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
          <span>{name.length > 20 ? `${name.slice(0, 20)}...` : name}</span>
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
      field: "price",
      headerName: "Price",
      minWidth: 120,
      flex: 0.8,
      renderCell: ({ row: { originalPrice, discountPrice } }) => {
        const price = discountPrice ? discountPrice : originalPrice;
        return formatNaira(price);
      },
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
      renderCell: ({ row: { mainCategory } }) => (
        <Tooltip title={mainCategory}>
          <span>{mainCategory.length > 15 ? `${mainCategory.slice(0, 15)}...` : mainCategory}</span>
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
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleProductEdit(params.row)}
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
              onClick={() => handleViewProduct(params.row.id)}
            >
              <AiOutlineEye size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = filteredProducts.map((item) => ({
    id: item._id,
    name: item.name,
    brand: item.brand,
    originalPrice: item.originalPrice,
    discountPrice: item.discountPrice,
    stock: item.stock,
    mainCategory: item.mainCategory,
    subCategory: item.subCategory,
    subSubCategory: item.subSubCategory,
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
              bgcolor: "primary.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i className="fas fa-percent text-xl text-primary" />
          </Box>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Products
          </Typography>
          <Chip
            label={vendorProducts?.length || 0}
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage your product catalog
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
          handleCategoryChange={handleCategoryChange}
          handleSubCategoryChange={handleSubCategoryChange}
          handleSubSubCategoryChange={handleSubSubCategoryChange}
          handleBrandChange={handleBrandChange}
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
        <SearchProducts searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
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
                  brand: product.brand?.name || "No brand",
                  originalPrice: product.originalPrice,
                  discountPrice: product.discountPrice,
                  stock: product.stock,
                }}
                onEdit={handleProductEdit}
                onDelete={openDeleteModalHandler}
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

      {/* Edit Product Modal (external component) */}
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

      {/* View Product Modal */}
      <Dialog
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>Product Details</DialogTitle>
        <DialogContent dividers>
          {isViewLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : product ? (
            <Grid container spacing={2}>
              {/* Basic Info */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {product.name}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Brand:</strong> {product.brand?.name || "No brand"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Category:</strong> {product.mainCategory}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Subcategory:</strong> {product.subCategory}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Sub-Subcategory:</strong> {product.subSubCategory}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Pricing & Stock */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Pricing & Stock
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Original Price:</strong> {formatNaira(product.originalPrice)}
                    </Typography>
                    {product.discountPrice && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Discount Price:</strong> {formatNaira(product.discountPrice)}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      <strong>Stock:</strong> {product.stock}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Vendor Info */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Vendor Information
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Name:</strong> {product.vendor?.name || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Address:</strong> {product.vendor?.address || "N/A"}
                    </Typography>
                    {product.vendor?.avatar?.url && (
                      <Box sx={{ mt: 2 }}>
                        <Image
                          src={product.vendor.avatar.url}
                          alt="Vendor Avatar"
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Product Images */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Product Images
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      {Array.isArray(product.images) &&
                        product.images.map(
                          (img, idx) =>
                            img?.url && (
                              <Image
                                key={img._id || idx}
                                src={img.url}
                                alt={`Product ${idx + 1}`}
                                width={100}
                                height={100}
                                style={{ objectFit: "cover", borderRadius: 8 }}
                              />
                            )
                        )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Reviews */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Reviews
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    {product.reviews?.length > 0 ? (
                      product.reviews.map((review) => (
                        <Box key={review._id} sx={{ mb: 2 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {review.user?.name} ({review.rating} stars)
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {review.comment}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No reviews yet.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Product details are not available.
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
        onConfirm={() => handleDelete(productToDelete)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </Box>
  );
};

export default AllProducts;