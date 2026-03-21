// React-related imports
import React, { useEffect, useState, useMemo } from "react";

// Third-party library imports
import { AiOutlineDelete, AiOutlineEye, AiOutlineEdit } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tooltip, Typography } from "@mui/material";
import { toast } from "react-toastify";

// Redux state slices (Local imports)
import { fetchAllProducts, updateProduct, deleteProduct, fetchSingleProduct, fetchAllVendors, createProduct } from "@/redux/adminSlice";
import { fetchAllBrands } from "@/redux/brandSlice";
import { fetchCategories, fetchSubcategories, fetchSubSubcategories } from "@/redux/categorySlice";

// Local component imports
import ProductTable from "../common/ProductTable";
import EditProductModal from "../common/ProductEditModal";
import FilterProducts from "../common/FilterProducts";
import SearchProducts from "../common/SearchProducts";
import Loader from "./layout/Loader";
import ConfirmationModal from "../common/ConfirmationModal";
import CreateItemModal from "../common/CreateItemModal";
import Image from "next/image";
import ViewProductModal from "../common/ViewproductModal";


const AllProductsTable = () => {
  const dispatch = useDispatch();

  /* ============ Redux State Selectors ============ */
  const { singleProduct, vendors, products, isLoading } = useSelector( (state) => state.admin);
  const { brands } = useSelector((state) => state.brands);
  const { categories, subcategories, subSubcategories, } = useSelector( (state) => state.categories );

  /* ============ Local State ============ */
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  // Filter criteria
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // Modal  states
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Product selection for editing/deleting
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // State for updated product data (for editing)
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    price: "",
    stock: "",
    brand: "",
    mainCategory: "",
    subCategory: "",
    subSubCategory: "",
  });


  // Local State for Creating a New Product
  const [openCreateModal, setOpenCreateModal] = useState(false);
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
    attributes: {}
  });

    /* ============ Effects: Fetching Data =========== */    
  // On mount, fetch products, categories, and brands
  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
    dispatch(fetchAllVendors());
  }, [dispatch]);

  // When mainCategory changes, fetch subcategories
  useEffect(() => {
    if (mainCategory) {
      dispatch(fetchSubcategories(mainCategory));
    }
  }, [dispatch, mainCategory]);

  // When subCategory changes, fetch sub-subcategories
  useEffect(() => {
    if (subCategory) {
      dispatch(fetchSubSubcategories(subCategory));
    }
  }, [dispatch, subCategory]);

  
  
  // Filter products based on selected filters and search query
const filteredProducts = useMemo(() => {
  const list = Array.isArray(products) ? products : [];
  let filtered = [...list];

  if (mainCategory) {
    filtered = filtered.filter(p => p.mainCategory === mainCategory);
  }
  if (subCategory) {
    filtered = filtered.filter(p => p.subCategory === subCategory);
  }
  if (subSubCategory) {
    filtered = filtered.filter(p => p.subSubCategory === subSubCategory);
  }
  if (selectedBrand) {
    filtered = filtered.filter(p => p.brand === selectedBrand);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q) ||
      (p._id || "").toLowerCase().includes(q)
    );
  }
  return filtered;
}, [products, mainCategory, subCategory, subSubCategory, selectedBrand, searchQuery]);


  // Handlers – Filters & Search     
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
    const selectedCategory = e.target.value;
    setMainCategory(selectedCategory);
    setSubCategory("");
    setSubSubCategory("");
    dispatch(fetchSubcategories(selectedCategory));
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCat = e.target.value;
    setSubCategory(selectedSubCat);
    setSubSubCategory("");
    dispatch(fetchSubSubcategories(selectedSubCat));
  };

  const handleSubSubCategoryChange = (e) => setSubSubCategory(e.target.value);

  // Handlers – Editing 
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

  // Custom onInputChange to update updatedProduct state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // for attributes
  const handleNewProductAttributeChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [name]: value,
      },
    }));
  };
  
  // Update Product
  const handleUpdateProduct = async () => {
    if (!subCategory || !subSubCategory) {
      return toast.error(`Please select ${!subCategory ? "Sub-Category" : "Sub-Sub Category"} before updating.`);
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
      const result = await dispatch(
        updateProduct({ productId: updatedProduct.id, updatedProduct: payload })
      );
      if (result.type === "admin/updateProduct/fulfilled") {
        toast.success("Product updated successfully!");
        dispatch(fetchAllProducts());
        setOpenEditModal(false);
        window.location.reload();
      } else {
        toast.error("Failed to update the product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  // Handlers – Creating New Product
  const handleNewProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // For image input
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewProduct((prev) => ({ ...prev, images: files }));
  };
  
const handleCreateProduct = async () => {
  const formData = new FormData();

  // For everything except images
  Object.keys(newProduct).forEach((key) => {
    if (key !== "images") {
      if (key === "attributes") {
        formData.append(key, JSON.stringify(newProduct[key])); 
      } else {
        formData.append(key, newProduct[key]);
      }
    }
  });

  // For images
  newProduct.images.forEach((file) => {
    formData.append("images", file);
  });

  // console.log("🧾 Logging FormData entries:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  try {
    const result = await dispatch(createProduct(formData));
    if (result.type === "admin/createProduct/fulfilled") {
      toast.success("Product created successfully!");
      setOpenCreateModal(false);
      dispatch(fetchAllProducts());
    } else {
      toast.error("Failed to create product.");
    }
  } catch (error) {
    toast.error("An unexpected error occurred.");
  }
};

  // Handlers – Deletion
  const handleDelete = async () => {
    try {
      const result = await dispatch(deleteProduct(productToDelete));
      if (result.type === "admin/deleteProduct/fulfilled") {
        toast.success("Product deleted successfully!");
        dispatch(fetchAllProducts());
      } else {
        toast.error("Failed to delete the product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An unexpected error occurred while deleting the product.");
    }
    setOpenDeleteModal(false);
  };

  const openDeleteModalHandler = (productId) => {
    setProductToDelete(productId);
    setOpenDeleteModal(true);
  };

  // Handlers – Viewing Product Detailsn 
  const handleViewProduct = async (productId) => {
      await dispatch(fetchSingleProduct(productId));
      setOpenViewModal(true);
  };

  // Table Configuration
  // Helper function to capitalize first letter
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const columns = [
    { field: "id", headerName: "ID", minWidth: 150, flex: 1, renderCell: ({ row: { id } }) => `...${id.slice(-4)}` },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4, renderCell: ({ row: { name } }) => `${name.slice(0, 8)}...` },
    { field: "brand", headerName: "Brand", minWidth: 130, flex: 0.6 },
    { field: "price", headerName: "U-Price", minWidth: 100, flex: 0.6, renderCell: ({ row: { originalPrice, discountPrice } }) => discountPrice ? `US$ ${discountPrice}` : `US$ ${originalPrice}` },
    { field: "stock", headerName: "Stock", type: "number", minWidth: 80, flex: 0.5 },
    { field: "category", headerName: "Category", minWidth: 180, flex: 1.4, renderCell: ({ row: { mainCategory } }) => `${capitalize(mainCategory)}` },
    { field: "subcat", headerName: "Subcat", minWidth: 180, flex: 1.4, renderCell: ({ row: { subCategory } }) => `${capitalize(subCategory)}` },
    { field: "subSubcat", headerName: "SubSubcat", minWidth: 180, flex: 1.4, renderCell: ({ row: { subSubCategory } }) => `${capitalize(subSubCategory)}` },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div style={{ paddingTop: "13px", display: "flex", justifyContent: "flex-start", gap: "10px", flexWrap: "wrap" }}>
          <Tooltip title="Edit">
            <Button variant="contained" color="primary" size="small" onClick={() => handleProductEdit(params.row)} style={{ padding: "6px 12px", minWidth: "auto", fontSize: "14px" }}>
              <AiOutlineEdit size={16} />
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button variant="contained" color="error" size="small" onClick={() => openDeleteModalHandler(params.row.id)} style={{ padding: "6px 12px", minWidth: "auto", fontSize: "14px" }}>
              <AiOutlineDelete size={16} />
            </Button>
          </Tooltip>
          <Tooltip title="View">
            <Button variant="contained" color="info" size="small" onClick={() => handleViewProduct(params.row.id)} style={{ padding: "6px 12px", minWidth: "auto", fontSize: "14px" }}>
              <AiOutlineEye size={16} />
            </Button>
          </Tooltip>
        </div>
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

  return (
    <div className="w-full min-h-screen overflow-hidden">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4 md:p-8 rounded-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Product List</h1>
              <span className="ml-2 bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {products?.length || 0}
              </span>
            </div>
            <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
              Create Product
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
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
          </div>

          {/* Search Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <SearchProducts searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
          </div>

          {/* Data Table */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <ProductTable
              rows={rows}
              columns={columns}
            />
          </div>

          {/* Edit Product Modal */}
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

            {/* Create Product Modal */}
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
              vendors={vendors}  // Vendors array passed here
              handleCategoryChange={handleCategoryChange}
              handleSubCategoryChange={handleSubCategoryChange}
              handleSubSubCategoryChange={handleSubSubCategoryChange}
              handleBrandChange={handleBrandChange}
              handleFileChange={handleFileChange}
              isSale={false}  // Normal product creation
            />

        {/* View Product Modal */}
          <Dialog
            open={openViewModal}
            onClose={()=>  setOpenViewModal(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle style={{ fontWeight: 'bold' }}>Product Details</DialogTitle>
            <DialogContent>
              {isLoading ? ( // Show loading spinner while fetching product
                <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                  <CircularProgress />
                </div>
              ) : singleProduct ? (
                <div>
                  {/* Product Information */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Product Name: {singleProduct.name}</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <Typography variant="body2" color="textSecondary">
                        <strong>Brand:</strong> {singleProduct.brand}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Main Category:</strong> {singleProduct.mainCategory}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Sub Category:</strong> {singleProduct.subCategory}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Sub Sub Category:</strong> {singleProduct.subSubCategory}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Vendor Information */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Vendor Information</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <Typography variant="body2">
                        <strong>Vendor Name:</strong> {singleProduct?.vendor?.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Vendor Address:</strong> {singleProduct?.vendor?.address}
                      </Typography>
                      <Image src={singleProduct?.vendor?.avatar.url} alt="Vendor Avatar" width="50" height="50" style={{ borderRadius: "50%" }} />
                    </CardContent>
                  </Card>

                  {/* Product Pricing and Stock */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Pricing & Stock</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <Typography variant="body2">
                        <strong>Original Price:</strong> ${singleProduct.originalPrice}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Discount Price:</strong> ${singleProduct.discountPrice}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Stock:</strong> {singleProduct.stock}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Product Images */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Product Images</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <div style={{ display: "flex", gap: "10px" }}>
                        {singleProduct.images.map((img, index) => (
                          <Image
                            key={img?._id || index}
                            src={img?.url || "/images/fallbackImage.jpg"}
                            alt={`Product Image ${index + 1}`}
                            width={100}
                            height={100}
                            sizes="(max-width: 768px) 80px, 100px"
                            priority={index === 0}          // only the first one if it’s above the fold
                            style={{ borderRadius: 5, objectFit: "cover" }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Product Reviews */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Product Reviews</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      {singleProduct.reviews.length > 0 ? (
                        <ul>
                          {singleProduct.reviews.map((review) => (
                            <li key={review._id}>
                              <Typography variant="body2">
                                <strong>{review.user.name} ({review.rating} stars)</strong>
                              </Typography>
                              <Typography variant="body2">{review.comment}</Typography>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Typography variant="body2" color="textSecondary">No reviews yet.</Typography>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Typography variant="body2" color="textSecondary">Product details are not available.</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>  setOpenViewModal(false)} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <ViewProductModal
            open={openViewModal}
            onClose={() => setOpenViewModal(false)}
            isLoading={isLoading}
            singleProduct={singleProduct}
          />

          {/* Confirmation Delete Modal */}
          <ConfirmationModal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onConfirm={handleDelete}
            title="Confirm Deletion"
            message="Are you sure you want to delete this product?"
          />
        </div>
      )}
    </div>
  );
};

export default AllProductsTable;
