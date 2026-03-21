import React, { useEffect, useState,useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineEye, AiOutlineEdit,} from "react-icons/ai";
import { Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tooltip, Typography,} from "@mui/material";
import { toast } from "react-toastify";
 
// Redux thunks and selectors (adjust the paths as needed)
import { fetchAllSales, fetchSingleSale, updateSale, deleteSale, createSale, fetchAllVendors } from "@/redux/adminSlice";
import { fetchCategories, fetchSubcategories, fetchSubSubcategories, } from "@/redux/categorySlice";
import { fetchAllBrands } from "@/redux/brandSlice";

// Local component imports
import ProductTable from "../common/ProductTable";
import EditProductModal from "../common/ProductEditModal"; 
import FilterProducts from "../common/FilterProducts";
import SearchProducts from "../common/SearchProducts";
import Loader from "../admin/layout/Loader";
import ConfirmationModal from "../common/ConfirmationModal";
import CreateItemModal from "../common/CreateItemModal"; 
import Image from "next/image";

const AllSaleProductsTable = () => {
  const dispatch = useDispatch();

  // Redux state selectors
  const { sales, singleSale, vendors, isLoading } = useSelector((state) => state.admin);
  const { brands } = useSelector((state) => state.brands);
  const { categories, subcategories, subSubcategories } = useSelector((state) => state.categories );

  // Local state for filtering and search
  const [searchQuery, setSearchQuery] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // Modal states for editing, viewing, deleting, and creating sale products
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  // Selected sale for editing and deleting
  const [selectedSale, setSelectedSale] = useState(null);
  const [saleToDelete, setSaleToDelete] = useState(null);

  // State for updating sale product data
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

  useEffect(() => {
    dispatch(fetchAllSales());
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

  useEffect(() => {
    if (subCategory) {
      dispatch(fetchSubSubcategories(subCategory));
    }
  }, [dispatch, subCategory]);

const filteredSales = useMemo(() => {
  const list = Array.isArray(sales) ? sales : [];
  let filtered = [...list];

  if (mainCategory) {
    filtered = filtered.filter(s => s.mainCategory === mainCategory);
  }
  if (subCategory) {
    filtered = filtered.filter(s => s.subCategory === subCategory);
  }
  if (subSubCategory) {
    filtered = filtered.filter(s => s.subSubCategory === subSubCategory);
  }
  if (selectedBrand) {
    filtered = filtered.filter(s => s.brand === selectedBrand);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(s =>
      (s.name || "").toLowerCase().includes(q) ||
      (s.brand || "").toLowerCase().includes(q) ||
      (s._id || "").toLowerCase().includes(q)
    );
  }
  return filtered;
}, [sales, mainCategory, subCategory, subSubCategory, selectedBrand, searchQuery]);

  // Handlers for filters and search
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
    const selectedCat = e.target.value;
    setMainCategory(selectedCat);
    setSubCategory("");
    setSubSubCategory("");
    dispatch(fetchSubcategories(selectedCat));
  };
  
  const handleSubCategoryChange = (e) => {
    const selectedSubCat = e.target.value;
    setSubCategory(selectedSubCat);
    setSubSubCategory("");
    dispatch(fetchSubSubcategories(selectedSubCat));
  };
  const handleSubSubCategoryChange = (e) => setSubSubCategory(e.target.value);

  // Handlers for editing a sale product
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
    setMainCategory(sale.mainCategory);
    setSubCategory(sale.subCategory);
    setSubSubCategory(sale.subSubCategory);
    setSelectedBrand(sale.brand || "");
    setOpenEditModal(true);
  };

  const closeEditModal = () => {
    setOpenEditModal(false);
    setSelectedSale(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedSale((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSale = async () => {
    if (!subCategory || !subSubCategory) {
      return toast.error(
        `Please select ${!subCategory ? "Sub-Category" : "Sub-Sub Category"} before updating.`
      );
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
      const result = await dispatch(
        updateSale({ saleId: updatedSale.id, saleData: payload })
      );
      if (result.type === "sales/updateSale/fulfilled") {
        toast.success("Sale updated successfully!");
        dispatch(fetchAllSales());
        setOpenEditModal(false);
        window.location.reload();
      } else {
        toast.error("Failed to update the sale.");
      }
    } catch (error) {
      console.error("Error updating sale:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  // Handlers for deleting a sale product
  const handleDeleteSale = async () => {
    try {
      const result = await dispatch(deleteSale(saleToDelete));
      if (result.type === "sales/deleteSale/fulfilled") {
        toast.success("Sale deleted successfully!");
        dispatch(fetchAllSales());
      } else {
        toast.error("Failed to delete the sale.");
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast.error("An unexpected error occurred while deleting the sale.");
    }
    setOpenDeleteModal(false);
  };

  const openDeleteModalHandler = (saleId) => {
    setSaleToDelete(saleId);
    setOpenDeleteModal(true);
  };

  // Handler for viewing a sale product
  const handleViewSale = async (saleId) => {
      await dispatch(fetchSingleSale(saleId));
      setOpenViewModal(true);
  };

  // Handlers for creating a new sale product
  const handleNewProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // For image file input; we store file objects in newSale.images
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewSale((prev) => ({ ...prev, images: files }));
  };

  const handleNewProductAttributeChange = (e) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [name]: value,
      },
    }));
  };

  const handleCreateSale = async () => {
    // Prepare a FormData object for sale creation (including images and attributes)
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
        toast.success("Sale product created successfully!");
        setOpenCreateModal(false);
        dispatch(fetchAllSales());
        window.location.reload();
      } else {
        toast.error("Failed to create sale product.");
      }
    } catch (error) {
      console.error("Error creating sale product:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  // Helper function to capitalize first letter
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  // Prepare table columns
  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 150,
      flex: 1,
      renderCell: ({ row: { id } }) => `...${id.slice(-4)}`,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
      renderCell: ({ row: { name } }) => `${name.slice(0, 8)}...`,
    },
    { field: "brand", headerName: "Brand", minWidth: 130, flex: 0.6 },
    {
      field: "discountPrice",
      headerName: "Sale Price",
      minWidth: 100,
      flex: 0.6,
      renderCell: ({ row: { discountPrice } }) => `US$ ${discountPrice}`,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 180,
      flex: 1.4,
      renderCell: ({ row: { mainCategory } }) => `${capitalize(mainCategory)}`,
    },
    {
      field: "subcat",
      headerName: "Subcat",
      minWidth: 180,
      flex: 1.4,
      renderCell: ({ row: { subCategory } }) =>  `${capitalize(subCategory)}`,
      
    },
    {
      field: "subSubcat",
      headerName: "SubSubcat",
      minWidth: 180,
      flex: 1.4,
      renderCell: ({ row: { subSubCategory } }) => `${capitalize(subSubCategory)}`,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            paddingTop: "13px",
            display: "flex",
            justifyContent: "flex-start",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <Tooltip title="Edit">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleSaleEdit(params.row)}
              style={{
                padding: "6px 12px",
                minWidth: "auto",
                fontSize: "14px",
              }}
            >
              <AiOutlineEdit size={16} />
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => openDeleteModalHandler(params.row.id)}
              style={{
                padding: "6px 12px",
                minWidth: "auto",
                fontSize: "14px",
              }}
            >
              <AiOutlineDelete size={16} />
            </Button>
          </Tooltip>
          <Tooltip title="View">
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => handleViewSale(params.row.id)}
              style={{
                padding: "6px 12px",
                minWidth: "auto",
                fontSize: "14px",
              }}
            >
              <AiOutlineEye size={16} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];
  const rows = filteredSales.map((sale) => ({
    ...sale,
    id: sale._id,
  }));

  return (
    <div className="w-full min-h-screen overflow-hidden">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4 md:p-8 rounded-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Sale List</h1>
              <span className="ml-2 bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {sales?.length || 0}
              </span>
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenCreateModal(true)}
            >
              Create Sale Product
            </Button>
          </div>

          {/* Filters Section */}
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
            <SearchProducts
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
            />
          </div>

          {/* Data Table Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <ProductTable rows={rows} columns={columns} />
          </div>

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
          <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)} maxWidth="md" fullWidth>
            <DialogTitle style={{ fontWeight: "bold" }}>Sale Details</DialogTitle>
            <DialogContent>
              {isLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                  <CircularProgress />
                </div>
              ) : singleSale ? (
                <div>
                  {/* Sale Information */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Sale Name: {singleSale.name}</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <Typography variant="body2" color="textSecondary">
                        <strong>Brand:</strong> {singleSale.brand}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Main Category:</strong> {singleSale.mainCategory}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Sub Category:</strong> {singleSale.subCategory}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Sub Sub Category:</strong> {singleSale.subSubCategory}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Vendor Information */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Vendor Information</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <Typography variant="body2">
                        <strong>Vendor Name:</strong> {singleSale.vendor?.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Vendor Address:</strong> {singleSale.vendor?.address}
                      </Typography>
                      {singleSale.vendor?.avatar?.url && (
                        <Image
                          key={img?._id || index}
                          src={img?.url || "/images/fallbackImage.jpg"}
                          alt={`Sale Image ${index + 1}`}
                          width={100}
                          height={100}
                          sizes="(max-width: 768px) 80px, 100px"
                          style={{ borderRadius: 5, objectFit: "cover" }}
                          priority={index === 0} // only if these are above the fold
                        />
                      )}
                    </CardContent>
                  </Card>

                  {/* Pricing and Stock */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Pricing & Stock</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <Typography variant="body2">
                        <strong>Original Price:</strong> ${singleSale.originalPrice}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Discount Price:</strong> ${singleSale.discountPrice}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Stock:</strong> {singleSale.stock}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Sale Images */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Sale Images</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <div style={{ display: "flex", gap: "10px" }}>
                        {singleSale?.images?.map((img, index) => (
                          <Image
                            key={img?._id || index}
                            src={img?.url || "/images/fallbackImage.jpg"}
                            alt={`Sale Image ${index + 1}`}
                            width={100}
                            height={100}
                            sizes="(max-width: 768px) 80px, 100px"
                            style={{ borderRadius: 5, objectFit: "cover" }}
                            priority={index === 0} 
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Sale details are not available.
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenViewModal(false)} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Confirmation Delete Modal */}
          <ConfirmationModal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onConfirm={handleDeleteSale}
            title="Confirm Deletion"
            message="Are you sure you want to delete this sale?"
          />
        </div>
      )}
    </div>
  );
};

export default AllSaleProductsTable;
