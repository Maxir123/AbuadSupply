import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Button } from '@mui/material';

const EditSubcategoryModal = ({
  open,
  onClose,
  data,
  onInputChange,
  onSave,
  categories,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {data._id ? 'Edit Subcategory' : 'Create Subcategory'}
      </DialogTitle>

      <DialogContent>
        {/* Subcategory Name */}
        <TextField
          label="Subcategory Name"
          name="name"
          value={data.name || ''}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />

        {/* Subcategory Slug */}
        <TextField
          label="Subcategory Slug"
          name="slug"
          value={data.slug || ''}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />

        {/* Image URL */}
        <TextField
          label="Image URL"
          name="imageUrl"
          value={data.imageUrl || ''}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />

        {/* Main Category Dropdown */}
        <TextField
          select
          label="Main Category"
          name="mainCategory"
          value={data.mainCategory || ''} // value from subcategoryData
          onChange={onInputChange}
          fullWidth
          margin="normal"
        >
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSubcategoryModal;
