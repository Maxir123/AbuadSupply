// SubcategoryTable.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, CircularProgress } from '@mui/material';
import { createSubcategory, deleteSubcategory, fetchSubcategories, fetchCategories, updateSubcategory} from '@/redux/adminSlice';
import { toast } from 'react-toastify';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import ProductTable from '../common/ProductTable';
import EditSubcategoryModal from '../common/EditSubcategoryModal';
import SearchProducts from '../common/SearchProducts';
import Image from 'next/image';

const SubcategoryTable = () => {
  const dispatch = useDispatch();
  const { categories, subcategories, loading } = useSelector((state) => state.admin);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [mainCategoryId, setMainCategoryId] = useState('');
  const [subcategoryData, setSubcategoryData] = useState({
    name: '',
    slug: '',
    imageUrl: '',
    mainCategory: '',
  });


  const handleInputChange = (e) => {
    setSubcategoryData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (mainCategoryId) {
      dispatch(fetchSubcategories(mainCategoryId));
    } else {
      dispatch(fetchSubcategories());
    }
  }, [dispatch, mainCategoryId]);

  useEffect(() => {
    const filtered = subcategories?.filter((subcat) =>
      subcat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSubcategories(filtered);
  }, [subcategories, searchQuery]);

  // when edit form opens 
  const handleOpenForm = (subcategory = null) => {
    if (subcategory) {
      setIsEditMode(true);
      setSelectedSubcategoryId(subcategory?._id); 
      setSubcategoryData({
        name: subcategory.name,
        slug: subcategory.slug,
        imageUrl: subcategory.imageUrl,
        mainCategory: subcategory.mainCategory || '',
      });
    } else {
      setIsEditMode(false);
      setSubcategoryData({
        name: '',
        slug: '',
        imageUrl: '',
        mainCategory: '',
      });
    }
    setOpenFormModal(true);
  };

  const handleFormSubmit = async () => {
    const action = isEditMode
      ? updateSubcategory({ subcategoryId: selectedSubcategoryId, subcategoryData })
      : createSubcategory(subcategoryData);

    const result = await dispatch(action);

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`Subcategory ${isEditMode ? 'updated' : 'created'} successfully!`);
      handleCloseForm();
    } else {
      toast.error(result.payload || 'Something went wrong.');
    }
  };

  const handleCloseForm = () => {
    setOpenFormModal(false);
    setSelectedSubcategoryId(null);
    setSubcategoryData({ name: '', slug: '', imageUrl: '', mainCategory: '' });
  };

  const handleDeleteSubcategory = async () => {
    const result = await dispatch(deleteSubcategory(selectedSubcategoryId));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Subcategory deleted!');
    } else {
      toast.error(result.payload || 'Failed to delete.');
    }
    setDeleteDialogOpen(false);
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'slug', headerName: 'Slug', flex: 1 },
    {
      field: 'imageUrl',
      headerName: 'Image',
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <Image src={params.value}
            alt="Category"
            width={50}
            height={50}
            style={{ borderRadius: 4, objectFit: "cover" }}
            sizes="50px"
          />
        ) : (
          'No Image'
        ),
    },
    {
      field: 'mainCategory',
      headerName: 'Main Category',
      flex: 1,
      renderCell: (params) =>
        params.value ? params.value.name : 'No Category',
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
                setSelectedSubcategoryId(params.row._id);
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

  const rows = filteredSubcategories?.map((subcat) => ({
    ...subcat,
    id: subcat._id, 
  }));
  
  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Sub Categories</h2>
        <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
          Create Subcategory
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchProducts searchQuery={searchQuery} handleSearchChange={(e) => setSearchQuery(e.target.value)}/>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <CircularProgress />
          </div>
        ) : (
          <ProductTable rows={rows} columns={columns} />
        )}
      </div>

      <EditSubcategoryModal
        open={openFormModal}
        onClose={handleCloseForm}
        data={subcategoryData}
        onInputChange={handleInputChange}
        onSave={handleFormSubmit}
        categories={categories}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this subcategory?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteSubcategory} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SubcategoryTable;
