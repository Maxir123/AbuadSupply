import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Button } from '@mui/material';

const EditSubSubCategoryModal = ({
  open,
  onClose,
  data,
  onInputChange,
  onSave,
  subcategories,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {data._id ? 'Edit Sub-Subcategory' : 'Create Sub-Subcategory'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          value={data.name || ''}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Slug"
          name="slug"
          value={data.slug || ''}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Image URL"
          name="imageUrl"
          value={data.imageUrl || ''}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />

        {/* Parent SubCategory */}
        <TextField
          select
          label="Parent Subcategory"
          name="subCategory"
          value={data.subCategory || ''}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        >
          {subcategories.map((subcat) => (
            <MenuItem key={subcat._id} value={subcat._id}>
              {subcat.name}
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

export default EditSubSubCategoryModal;
