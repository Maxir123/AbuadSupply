import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, CircularProgress } from '@mui/material';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { toast } from 'react-toastify';
import ProductTable from '../common/ProductTable';
import EditSubSubCategoryModal from '../common/EditSubSubCategoryModal';

// import your redux actions
import { fetchSubSubcategories, fetchSubcategories, createSubSubcategory, updateSubSubcategory, deleteSubSubcategory} from '@/redux/adminSlice';
import SearchProducts from '../common/SearchProducts';
import Image from 'next/image';

const SubSubCategoryTable = () => {
  const dispatch = useDispatch();

  // Grab from store
  const { subSubcategories, subcategories, loading } = useSelector((state) => state.admin);

  // local states
  const [openFormModal, setOpenFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [subSubCategoryData, setSubSubCategoryData] = useState({
      name: '',
      slug: '',
      imageUrl: '',
      subCategory: '',
    });

  // input change handler
  const handleInputChange = (e) => {
    setSubSubCategoryData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    dispatch(fetchSubSubcategories());
    dispatch(fetchSubcategories());
  }, [dispatch]);

  // filter the subSubcategories for search
  useEffect(() => {
    const result = subSubcategories?.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFiltered(result);
  }, [subSubcategories, searchQuery]);

  // open form (for create or edit)
  const handleOpenForm = (subsubcat = null) => {
    if (subsubcat) {
      setIsEditMode(true);
      setSelectedId(subsubcat._id);
      setSubSubCategoryData({
        name: subsubcat.name,
        slug: subsubcat.slug,
        imageUrl: subsubcat.imageUrl,
        subCategory: subsubcat.subCategory?._id || subsubcat.subCategory,
      });
    } else {
      setIsEditMode(false);
      setSubSubCategoryData({
        name: '',
        slug: '',
        imageUrl: '',
        subCategory: '',
      });
    }
    setOpenFormModal(true);
  };

  const handleCloseForm = () => {
    setOpenFormModal(false);
    setSelectedId(null);
    setSubSubCategoryData({ name: '', slug: '', imageUrl: '', subCategory: '' });
  };

  // create/update sub-subcategory
  const handleFormSubmit = async () => {
    const action = isEditMode
      ? updateSubSubcategory({ id: selectedId, formData: subSubCategoryData })
      : createSubSubcategory(subSubCategoryData);

    const result = await dispatch(action);

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`Sub-Subcategory ${isEditMode ? 'updated' : 'created'} successfully!`);
      handleCloseForm();
    } else {
      toast.error(result.payload || 'Something went wrong.');
    }
  };

  // confirm delete
  const handleDelete = async () => {
    const result = await dispatch(deleteSubSubcategory(selectedId));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Sub-Subcategory deleted!');
    } else {
      toast.error(result.payload || 'Failed to delete.');
    }
    setDeleteDialogOpen(false);
  };

  // define table columns
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
      field: 'subCategory',
      headerName: 'Subcategory',
      flex: 1,
      renderCell: (params) => {
        // if subCategory is an object
        if (params.value && typeof params.value === 'object') {
          return params.value.name;
        }
        return 'No SubCategory';
      },
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
                setSelectedId(params.row._id);
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

  // define table rows
  const rows = filtered?.map((item) => ({
    id: item._id,
    ...item,
  }));

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Sub-Subcategories</h2>
        <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
          Create Sub-Subcategory
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

      {/* The modal for create/edit */}
      <EditSubSubCategoryModal
        open={openFormModal}
        onClose={handleCloseForm}
        data={subSubCategoryData}
        onInputChange={handleInputChange}
        onSave={handleFormSubmit}
        subcategories={subcategories}
      />

      {/* The delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this sub-subcategory?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SubSubCategoryTable;
