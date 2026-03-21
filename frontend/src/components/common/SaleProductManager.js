import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, CircularProgress, Typography, Card, CardContent, Divider, Tooltip
} from "@mui/material";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import ProductTable from "./ProductTable";
import EditProductModal from "./ProductEditModal";
import FilterProducts from "./FilterProducts";
import SearchProducts from "./SearchProducts";
import ConfirmationModal from "./ConfirmationModal";
import CreateItemModal from "./CreateItemModal";

const SaleProductManager = ({
  isAdmin = false,
  vendorInfo,
  loading,
  sales,
  singleSale,
  vendors,
  brands,
  categories,
  subcategories,
  subSubcategories,
  fetchSalesThunk,
  fetchSingleThunk,
  updateSaleThunk,
  deleteSaleThunk,
  createSaleThunk,
  fetchBrandsThunk,
  fetchCategoriesThunk,
  fetchSubcategoriesThunk,
  fetchSubSubcategoriesThunk,
  fetchVendorsThunk
}) => {
  const dispatch = useDispatch();
  const vendorId = vendorInfo?._id || null;

  const [filteredSales, setFilteredSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [selectedSale, setSelectedSale] = useState(null);
  const [saleToDelete, setSaleToDelete] = useState(null);

  const [updatedSale, setUpdatedSale] = useState({
    name: "", description: "", brand: "", mainCategory: "", subCategory: "",
    subSubCategory: "", originalPrice: "", discountPrice: "", stock: ""
  });

  const [newSale, setNewSale] = useState({
    name: "", description: "", brand: "", mainCategory: "", subCategory: "", subSubCategory: "",
    originalPrice: "", discountPrice: "", stock: "", images: [], attributes: {}, vendorId: ""
  });

  // helper to refetch sales appropriately
  const refetchSales = () => {
    if (isAdmin) dispatch(fetchSalesThunk());
    else if (vendorId) dispatch(fetchSalesThunk(vendorId));
  };

  // INITIAL DATA LOAD
  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchSalesThunk());
      dispatch(fetchVendorsThunk());
    } else if (vendorId) {
      dispatch(fetchSalesThunk(vendorId));
    }
    dispatch(fetchCategoriesThunk());
    dispatch(fetchBrandsThunk());
  }, [
    dispatch,
    isAdmin,
    vendorId,
    fetchSalesThunk,
    fetchVendorsThunk,
    fetchCategoriesThunk,
    fetchBrandsThunk,
  ]);

  // DEPENDENT DROPDOWNS
  useEffect(() => {
    if (mainCategory) dispatch(fetchSubcategoriesThunk(mainCategory));
  }, [dispatch, mainCategory, fetchSubcategoriesThunk]);

  useEffect(() => {
    if (subCategory) dispatch(fetchSubSubcategoriesThunk(subCategory));
  }, [dispatch, subCategory, fetchSubSubcategoriesThunk]);

  // FILTERING
  useEffect(() => {
    let filtered = [...sales];
    if (mainCategory) filtered = filtered.filter(s => s.mainCategory === mainCategory);
    if (subCategory) filtered = filtered.filter(s => s.subCategory === subCategory);
    if (subSubCategory) filtered = filtered.filter(s => s.subSubCategory === subSubCategory);
    if (selectedBrand) filtered = filtered.filter(s => s.brand === selectedBrand);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(q) || s._id.toLowerCase().includes(q)
      );
    }
    setFilteredSales(filtered);
  }, [mainCategory, subCategory, subSubCategory, selectedBrand, sales, searchQuery]);

  const handleUpdateSale = async () => {
    const result = await dispatch(updateSaleThunk({ saleId: updatedSale.id, saleData: updatedSale }));
    if (result.type.includes("fulfilled")) {
      toast.success("Sale updated!");
      refetchSales();
      setOpenEditModal(false);
    } else toast.error("Failed to update.");
  };

  const handleDeleteSale = async () => {
    const result = await dispatch(deleteSaleThunk(saleToDelete));
    if (result.type.includes("fulfilled")) {
      toast.success("Sale deleted!");
      refetchSales();
    } else toast.error("Delete failed.");
    setOpenDeleteModal(false);
  };

  const handleCreateSale = async () => {
    const formData = new FormData();
    Object.entries(newSale).forEach(([key, value]) => {
      if (key === "images") value.forEach(file => formData.append("images", file));
      else if (key === "attributes") formData.append("attributes", JSON.stringify(value));
      else formData.append(key, value);
    });
    const result = await dispatch(createSaleThunk(formData));
    if (result.type.includes("fulfilled")) {
      toast.success("Created!");
      refetchSales();
      setOpenCreateModal(false);
    } else toast.error("Create failed.");
  };

  const handleViewSale = async (id) => {
    await dispatch(fetchSingleThunk(id));
    setOpenViewModal(true);
  };

  const handleEditSale = (sale) => {
    setSelectedSale(sale);
    setUpdatedSale({ ...sale, id: sale._id });
    setOpenEditModal(true);
  };

  const rows = filteredSales.map(s => ({ ...s, id: s._id }));
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

  const columns = [
    {
      field: "id", headerName: "ID", minWidth: 150, flex: 1,
      renderCell: ({ row: { id } }) => `...${id.slice(-4)}`
    },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
    { field: "brand", headerName: "Brand", minWidth: 130, flex: 0.6 },
    {
      field: "discountPrice", headerName: "Sale Price", minWidth: 100, flex: 0.6,
      renderCell: ({ row: { discountPrice } }) => `US$ ${discountPrice}`
    },
    { field: "stock", headerName: "Stock", type: "number", minWidth: 80, flex: 0.5 },
    {
      field: "category", headerName: "Category", minWidth: 150, flex: 1,
      renderCell: ({ row: { mainCategory } }) => capitalize(mainCategory)
    },
    {
      field: "actions", headerName: "Actions", minWidth: 200, flex: 1,
      renderCell: (params) => (
        <div className="flex gap-2 items-center">
          <Tooltip title="Edit"><Button color="primary" onClick={() => handleEditSale(params.row)}><AiOutlineEdit /></Button></Tooltip>
          <Tooltip title="Delete"><Button color="error" onClick={() => { setSaleToDelete(params.row.id); setOpenDeleteModal(true); }}><AiOutlineDelete /></Button></Tooltip>
          <Tooltip title="View"><Button color="info" onClick={() => handleViewSale(params.row.id)}><AiOutlineEye /></Button></Tooltip>
        </div>
      )
    },
  ];

  return (
    <div className="w-full p-4 md:p-8 rounded-md">
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Sale Products</h1>
            {isAdmin && (
              <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
                Create Sale Product
              </Button>
            )}
          </div>

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
              handleFilterReset={() => {
                setMainCategory(""); setSubCategory(""); setSubSubCategory("");
                setSelectedBrand(""); setSearchQuery("");
              }}
              handleCategoryChange={(e) => setMainCategory(e.target.value)}
              handleSubCategoryChange={(e) => setSubCategory(e.target.value)}
              handleSubSubCategoryChange={(e) => setSubSubCategory(e.target.value)}
              handleBrandChange={(e) => setSelectedBrand(e.target.value)}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <SearchProducts searchQuery={searchQuery} handleSearchChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <ProductTable rows={rows} columns={columns} />
          </div>

          <EditProductModal
            open={openEditModal} onClose={() => setOpenEditModal(false)} data={updatedSale}
            onInputChange={(e) => setUpdatedSale({ ...updatedSale, [e.target.name]: e.target.value })}
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

          <CreateItemModal
            open={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            newItem={newSale}
            onInputChange={(e) => setNewSale({ ...newSale, [e.target.name]: e.target.value })}
            onAttributeChange={(e) => setNewSale(prev => ({
              ...prev, attributes: { ...prev.attributes, [e.target.name]: e.target.value }
            }))}
            onSave={handleCreateSale}
            selectedBrand={selectedBrand}
            vendors={vendors}
            categories={categories}
            subcategories={subcategories}
            subSubcategories={subSubcategories}
            brands={brands}
            handleCategoryChange={(e) => setMainCategory(e.target.value)}
            handleSubCategoryChange={(e) => setSubCategory(e.target.value)}
            handleSubSubCategoryChange={(e) => setSubSubCategory(e.target.value)}
            handleBrandChange={(e) => setSelectedBrand(e.target.value)}
            handleFileChange={(e) => setNewSale({ ...newSale, images: Array.from(e.target.files) })}
            isSale={true}
          />

          <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Sale Details</DialogTitle>
            <DialogContent>
              {!singleSale ? <CircularProgress /> : (
                <Card>
                  <CardContent>
                    <Typography variant="h6">{singleSale.name}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2"><strong>Brand:</strong> {singleSale.brand}</Typography>
                    <Typography variant="body2"><strong>Category:</strong> {singleSale.mainCategory}</Typography>
                    <Typography variant="body2"><strong>Price:</strong> ${singleSale.discountPrice}</Typography>
                    <Typography variant="body2"><strong>Stock:</strong> {singleSale.stock}</Typography>
                  </CardContent>
                </Card>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenViewModal(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          <ConfirmationModal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onConfirm={handleDeleteSale}
            title="Delete Sale"
            message="Are you sure you want to delete this sale product?"
          />
        </>
      )}
    </div>
  );
};

export default SaleProductManager;
