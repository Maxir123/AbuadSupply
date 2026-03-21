import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { categoryAttributes } from "@/lib/categoryAttributes";

const CreateItemModal = ({
  open,
  onClose,
  newItem,              
  onInputChange,
  onAttributeChange,     
  onSave,
  selectedBrand,
  categories = [],
  subcategories = [],
  subSubcategories = [],
  brands = [],
  vendors = [],
  handleCategoryChange,
  handleSubCategoryChange,
  handleSubSubCategoryChange,
  handleBrandChange,
  handleFileChange,
  isSale = false,        
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isSale ? "Create Sale Product" : "Create Product"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          value={newItem.name}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={newItem.description}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Main Category"
          name="mainCategory"
          value={newItem.mainCategory}
          onChange={(e) => {
            onInputChange(e);
            handleCategoryChange(e);
          }}
          fullWidth
          margin="normal"
        >
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat.slug}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sub Category"
          name="subCategory"
          value={newItem.subCategory}
          onChange={(e) => {
            onInputChange(e);
            handleSubCategoryChange(e);
          }}
          fullWidth
          margin="normal"
          disabled={!newItem.mainCategory}
        >
          {subcategories.map((subcat) => (
            <MenuItem key={subcat._id} value={subcat.slug}>
              {subcat.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sub Sub Category"
          name="subSubCategory"
          value={newItem.subSubCategory}
          onChange={(e) => {
            onInputChange(e);
            handleSubSubCategoryChange(e);
          }}
          fullWidth
          margin="normal"
          disabled={!newItem.subCategory}
        >
          {subSubcategories.map((subsub) => (
            <MenuItem key={subsub._id} value={subsub.slug}>
              {subsub.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Brand"
          name="brand"
          value={selectedBrand || ""}
          onChange={(e) => {
            onInputChange(e);
            handleBrandChange(e);
          }}
          fullWidth
          margin="normal"
        >
          {brands.map((brand) => (
            <MenuItem key={brand.id} value={brand.name}>
              {brand.name}
            </MenuItem>
          ))}
        </TextField>
        {/* Vendor Dropdown */}
        <TextField
          select
          label="Vendor"
          name="vendorId"
          value={newItem.vendorId}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        >
          {vendors.map((vendor) => (
            <MenuItem key={vendor._id} value={vendor._id}>
              {vendor.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={newItem.stock}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Original Price"
          name="originalPrice"
          type="number"
          value={newItem.originalPrice}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Discount Price"
          name="discountPrice"
          type="number"
          value={newItem.discountPrice}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />
        {/* Render product attributes dynamically */}
        {categoryAttributes[newItem.mainCategory]?.map((attribute) => (
          <TextField
            key={attribute}
            label={attribute.charAt(0).toUpperCase() + attribute.slice(1)}
            name={attribute}
            value={newItem.attributes?.[attribute] || ""}
            onChange={onAttributeChange}
            fullWidth
            margin="normal"
          />
        ))}
        {/* File Input for Images */}
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        {/* Additional Sale-specific Fields */}
        {isSale && (
          <>
            <TextField
              label="Sale Start"
              name="saleStart"
              type="date"
              value={newItem.saleStart || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Sale End"
              name="saleEnd"
              type="date"
              value={newItem.saleEnd || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSave} variant="contained" color="primary">
          {isSale ? "Create Sale Product" : "Create Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateItemModal;
