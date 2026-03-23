// SubcategoryTable.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createSubcategory, deleteSubcategory, fetchSubcategories, fetchCategories, updateSubcategory } from '@/redux/adminSlice';
import { toast } from 'react-toastify';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineSearch } from 'react-icons/ai';
import EditSubcategoryModal from '../common/EditSubcategoryModal';
import Image from 'next/image';

// Mobile Subcategory Card
const MobileSubcategoryCard = ({ subcategory, categories, onEdit, onDelete }) => {
  // Find main category name
  const mainCategory = categories.find(cat => cat._id === subcategory.mainCategory);
  const mainCategoryName = mainCategory?.name || 'No Category';

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
          {subcategory.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Slug: {subcategory.slug}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Main Category: {mainCategoryName}
        </Typography>
        {subcategory.imageUrl && (
          <Box sx={{ mt: 1 }}>
            <Image
              src={subcategory.imageUrl}
              alt={subcategory.name}
              width={80}
              height={80}
              style={{ borderRadius: 4, objectFit: "cover" }}
            />
          </Box>
        )}
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => onEdit(subcategory)}>
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete(subcategory._id)}>
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const SubcategoryTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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

  const handleOpenForm = (subcategory = null) => {
    if (subcategory) {
      setIsEditMode(true);
      setSelectedSubcategoryId(subcategory._id);
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

  const openDeleteConfirmation = (id) => {
    setSelectedSubcategoryId(id);
    setDeleteDialogOpen(true);
  };

  // DataGrid columns (desktop)
  const columns = [
    { field: 'name', headerName: 'Name', minWidth: 150, flex: 1 },
    { field: 'slug', headerName: 'Slug', minWidth: 150, flex: 1 },
    {
      field: 'imageUrl',
      headerName: 'Image',
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) =>
        params.value ? (
          <Image
            src={params.value}
            alt="Subcategory"
            width={50}
            height={50}
            style={{ borderRadius: 4, objectFit: "cover" }}
          />
        ) : (
          'No Image'
        ),
    },
    {
      field: 'mainCategory',
      headerName: 'Main Category',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const mainCat = categories.find(cat => cat._id === params.value);
        return mainCat?.name || 'No Category';
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      flex: 0.6,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleOpenForm(params.row)}>
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => openDeleteConfirmation(params.row._id)}>
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = filteredSubcategories?.map((subcat) => ({
    id: subcat._id,
    name: subcat.name,
    slug: subcat.slug,
    imageUrl: subcat.imageUrl,
    mainCategory: subcat.mainCategory,
    _id: subcat._id,
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
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
            <i className="fas fa-layer-group text-xl text-primary" />
          </Box>
          <Typography variant="h5" fontWeight="bold">
            Sub Categories
          </Typography>
          <Chip label={subcategories?.length || 0} size="small" color="primary" />
        </Box>
        <Button variant="contained" onClick={() => handleOpenForm()} sx={{ textTransform: "none", borderRadius: 2 }}>
          Create Subcategory
        </Button>
      </Paper>

      {/* Search */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          bgcolor: "white",
          border: "1px solid",
          borderColor: "grey.100",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
          {filteredSubcategories?.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No subcategories found.
            </Typography>
          ) : (
            filteredSubcategories.map((subcat) => (
              <MobileSubcategoryCard
                key={subcat._id}
                subcategory={subcat}
                categories={categories}
                onEdit={handleOpenForm}
                onDelete={openDeleteConfirmation}
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

      {/* Create/Edit Modal */}
      <EditSubcategoryModal
        open={openFormModal}
        onClose={handleCloseForm}
        data={subcategoryData}
        onInputChange={handleInputChange}
        onSave={handleFormSubmit}
        categories={categories}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this subcategory? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteSubcategory} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubcategoryTable;