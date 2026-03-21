import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button,Dialog,DialogActions,DialogContent,DialogTitle,Tooltip,CircularProgress } from '@mui/material';
import { createMainCategory, fetchCategories, updateMainCategory, deleteMainCategory } from '@/redux/adminSlice';
import { toast } from 'react-toastify';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import EditProductModal from '../common/ProductEditModal';
import ProductTable from '../common/ProductTable';
import SearchProducts from '../common/SearchProducts';
import Image from 'next/image';

const CategoryTable = () => {
  const dispatch = useDispatch();
  const { categories, loading, } = useSelector((state) => state.admin);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [categoryData, setCategoryData] = useState({ name: '', slug: '', imageUrl: '' });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories, searchQuery]);

  const handleOpenForm = (category = null) => {
    if (category) {
      setIsEditMode(true);
      setSelectedCategoryId(category._id);
      setCategoryData({
        name: category.name,
        slug: category.slug,
        imageUrl: category.imageUrl,
      });
    } else {
      setIsEditMode(false);
      setCategoryData({ name: '', slug: '', imageUrl: '' });
    }
    setOpenFormModal(true);
  };

  // Close the form modal
  const handleCloseForm = () => {
    setOpenFormModal(false);
    setSelectedCategoryId(null);
    setCategoryData({ name: '', slug: '', imageUrl: '' });
  };

  const handleFormSubmit = async () => {
    const action = isEditMode
      ? updateMainCategory({ categoryId: selectedCategoryId, categoryData })
      : createMainCategory(categoryData);

    const result = await dispatch(action);

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`Category ${isEditMode ? 'updated' : 'created'} successfully!`);
      handleCloseForm();
    } else {
      toast.error(result.payload || 'Something went wrong.');
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async () => {
    const result = await dispatch(deleteMainCategory(selectedCategoryId));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Category deleted!');
    } else {
      toast.error(result.payload || 'Failed to delete.');
    }
    setDeleteDialogOpen(false);
  };

  // Table columns definition
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'slug', headerName: 'Slug', flex: 1 },
    {
      field: 'imageUrl',
      headerName: 'Image',
      flex: 1,
      renderCell: (params) => (
        params.value ? (
          <Image
            src={params.value}
            alt="Category"
            width={50}
            height={50}
            style={{ borderRadius: 4, objectFit: "cover" }}
            sizes="50px"
          />
        ) : (
          'No Image'
        )
      ),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div style={{ paddingTop: "13px", display: "flex", justifyContent: "flex-start", gap: "10px", flexWrap: "wrap" }}
        >
          <Tooltip title="Edit">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleOpenForm(params.row)}
            >
              <AiOutlineEdit size={16} />
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                setSelectedCategoryId(params.row._id);
                setDeleteDialogOpen(true);
              }}
            >
              <AiOutlineDelete size={16} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Transform categories into rows for the table
  const rows = filteredCategories.map((cat) => ({
    id: cat._id,
    ...cat,
  }));

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Main Categories</h2>
        <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
          Create Category
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchProducts searchQuery={searchQuery} handleSearchChange={(e) => setSearchQuery(e.target.value)}/>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div className="flex justify-center items-center p-8"> <CircularProgress /></div>
        ) : (
          <ProductTable rows={rows} columns={columns} />
        )}
      </div>

      {/* Create/Edit Modal */}
      <EditProductModal
        open={openFormModal}
        onClose={handleCloseForm}
        data={categoryData}
        onInputChange={(e) =>
          setCategoryData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        }
        onSave={handleFormSubmit}
        isCategoryEdit={true} 
      />

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this category?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteCategory} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CategoryTable;
