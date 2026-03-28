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
import { createMainCategory, fetchCategories, updateMainCategory, deleteMainCategory } from '@/redux/adminSlice';
import { toast } from 'react-toastify';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineSearch } from 'react-icons/ai';
import EditProductModal from '../common/ProductEditModal';
import Image from 'next/image';

// Utility to safely handle image URLs
const getSafeImageUrl = (url) => {
  if (!url) return "/fallback.jpg";

  try {
    const parsed = new URL(url);

    // only allow trusted hosts
    if (
      parsed.hostname === "images.unsplash.com" ||
      parsed.hostname === "res.cloudinary.com"
    ) {
      return url;
    }

    return "/fallback.jpg";
  } catch {
    return "/fallback.jpg";
  }
};
// Mobile Category Card
const MobileCategoryCard = ({ category, onEdit, onDelete }) => {
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
          {category.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Slug: {category.slug}
        </Typography>
        {category.imageUrl && (
          <Box sx={{ mt: 1 }}>
            <Image
              src={getSafeImageUrl(category.imageUrl)}
              alt={category.name}
              width={80}
              height={80}
              style={{ borderRadius: 4, objectFit: "cover" }}
            />
          </Box>
        )}
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => onEdit(category)}>
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete(category._id)}>
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const CategoryTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.admin);

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

  const handleDeleteCategory = async () => {
    const result = await dispatch(deleteMainCategory(selectedCategoryId));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Category deleted!');
    } else {
      toast.error(result.payload || 'Failed to delete.');
    }
    setDeleteDialogOpen(false);
  };

  const openDeleteConfirmation = (id) => {
    setSelectedCategoryId(id);
    setDeleteDialogOpen(true);
  };

  const getSafeImageUrl = (url) => {
  if (!url) return "/fallback.jpg";

  try {
    const parsed = new URL(url);

    // only allow valid image hosts
    if (
      parsed.hostname === "images.unsplash.com" ||
      parsed.hostname === "res.cloudinary.com"
    ) {
      return url;
    }

    return "/fallback.jpg";
  } catch {
    return "/fallback.jpg";
  }
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
      renderCell: (params) => (
        params.value ? (
          <Image
            src={getSafeImageUrl(params.value)}
            alt="Category"
            width={50}
            height={50}
            style={{ borderRadius: 4, objectFit: "cover" }}
          />
        ) : (
          'No Image'
        )
      ),
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

  const rows = filteredCategories.map((cat) => ({
    id: cat._id,
    name: cat.name,
    slug: cat.slug,
    imageUrl: cat.imageUrl,
    _id: cat._id,
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
            <i className="fas fa-tags text-xl text-primary" />
          </Box>
          <Typography variant="h5" fontWeight="bold">
            Main Categories
          </Typography>
          <Chip label={categories?.length || 0} size="small" color="primary" />
        </Box>
        <Button variant="contained" onClick={() => handleOpenForm()} sx={{ textTransform: "none", borderRadius: 2 }}>
          Create Category
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
          {filteredCategories.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No categories found.
            </Typography>
          ) : (
            filteredCategories.map((cat) => (
              <MobileCategoryCard
                key={cat._id}
                category={cat}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this category? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteCategory} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryTable;