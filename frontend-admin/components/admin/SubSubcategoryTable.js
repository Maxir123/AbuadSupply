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
import { AiOutlineDelete, AiOutlineEdit, AiOutlineSearch } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Image from 'next/image';

import { fetchSubSubcategories, fetchSubcategories, createSubSubcategory, updateSubSubcategory, deleteSubSubcategory } from '@/redux/adminSlice';
import EditSubSubCategoryModal from '../common/EditSubSubCategoryModal';

// Mobile card component
const MobileSubSubCategoryCard = ({ item, subcategories, onEdit, onDelete }) => {
  // Find the parent subcategory name
  const parentSubcategory = subcategories?.find(
    (sc) => sc._id === (item.subCategory?._id || item.subCategory)
  );
  const parentName = parentSubcategory?.name || 'No Subcategory';

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
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Slug: {item.slug}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Subcategory: {parentName}
        </Typography>
        {item.imageUrl && (
          <Box sx={{ mt: 1 }}>
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={80}
              height={80}
              style={{ borderRadius: 4, objectFit: "cover" }}
            />
          </Box>
        )}
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => onEdit(item)}>
              <AiOutlineEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete(item._id)}>
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const SubSubCategoryTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  // Redux state
  const { subSubcategories, subcategories, loading } = useSelector((state) => state.admin);

  // Local state
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

  const handleInputChange = (e) => {
    setSubSubCategoryData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Fetch data
  useEffect(() => {
    dispatch(fetchSubSubcategories());
    dispatch(fetchSubcategories());
  }, [dispatch]);

  // Filter sub‑subcategories by search
  useEffect(() => {
    const result = subSubcategories?.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFiltered(result);
  }, [subSubcategories, searchQuery]);

  // Open create/edit modal
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

  // Create / update sub‑subcategory
  const handleFormSubmit = async () => {
    const action = isEditMode
      ? updateSubSubcategory({ id: selectedId, formData: subSubCategoryData })
      : createSubSubcategory(subSubCategoryData);

    const result = await dispatch(action);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`Sub‑subcategory ${isEditMode ? 'updated' : 'created'} successfully!`);
      handleCloseForm();
    } else {
      toast.error(result.payload || 'Something went wrong.');
    }
  };

  // Delete
  const handleDelete = async () => {
    const result = await dispatch(deleteSubSubcategory(selectedId));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Sub‑subcategory deleted!');
    } else {
      toast.error(result.payload || 'Failed to delete.');
    }
    setDeleteDialogOpen(false);
  };

  const openDeleteDialog = (id) => {
    setSelectedId(id);
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
            alt="Sub‑subcategory"
            width={50}
            height={50}
            style={{ borderRadius: 4, objectFit: "cover" }}
          />
        ) : (
          'No Image'
        ),
    },
    {
      field: 'subCategory',
      headerName: 'Subcategory',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        // params.value can be object or string
        const subcatId = params.value?._id || params.value;
        const parent = subcategories?.find((sc) => sc._id === subcatId);
        return parent?.name || 'No Subcategory';
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
            <IconButton size="small" color="error" onClick={() => openDeleteDialog(params.row._id)}>
              <AiOutlineDelete size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = filtered?.map((item) => ({
    id: item._id,
    name: item.name,
    slug: item.slug,
    imageUrl: item.imageUrl,
    subCategory: item.subCategory,
    _id: item._id,
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
            <i className="fas fa-tag text-xl text-primary" />
          </Box>
          <Typography variant="h5" fontWeight="bold">
            Sub‑Subcategories
          </Typography>
          <Chip label={subSubcategories?.length || 0} size="small" color="primary" />
        </Box>
        <Button variant="contained" onClick={() => handleOpenForm()} sx={{ textTransform: "none", borderRadius: 2 }}>
          Create Sub‑Subcategory
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
          {filtered?.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No sub‑subcategories found.
            </Typography>
          ) : (
            filtered.map((item) => (
              <MobileSubSubCategoryCard
                key={item._id}
                item={item}
                subcategories={subcategories}
                onEdit={handleOpenForm}
                onDelete={openDeleteDialog}
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

      {/* Modal for create/edit */}
      <EditSubSubCategoryModal
        open={openFormModal}
        onClose={handleCloseForm}
        data={subSubCategoryData}
        onInputChange={handleInputChange}
        onSave={handleFormSubmit}
        subcategories={subcategories}
      />

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this sub‑subcategory? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubSubCategoryTable;