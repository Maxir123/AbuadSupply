import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

const EditProductModal = ({
  open,
  onClose,
  data,
  onInputChange,
  onSave,
  mainCategory,
  subCategory,
  subSubCategory,
  selectedBrand,
  categories,
  subcategories,
  subSubcategories,
  brands,
  handleCategoryChange,  
  handleSubCategoryChange,  
  handleSubSubCategoryChange,
  handleBrandChange,

  isOrderEdit,
  isVendorEdit,
  isCustomerEdit,
  isCategoryEdit,
  isCouponEdit,
}) => {

  // console.log("data:", data)
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "600" }}>
        {isOrderEdit
          ? "Edit Order"
          : isCustomerEdit
          ? "Edit Customer"
          : isVendorEdit
          ? "Edit Vendor"
          : isCategoryEdit
          ? "Edit Category" 
          : isCouponEdit
          ? "Edit Coupon"
          : "Edit Product"}{" "}
        {/* Dynamically set title */}
      </DialogTitle>
      <DialogContent>
        {/* Customer-specific fields */}
        {isCustomerEdit && (
          <>
            <TextField
              label="Name"
              name="name"
              value={data.name || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={data.email || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={data.phoneNumber || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />

            {/* Dropdown for selecting an address */}
            {data.addresses && data.addresses.length > 0 && (
              <TextField
                select
                label="Select Address"
                name="selectedAddress"
                value={data.selectedAddress || data.addresses[0]._id} 
                onChange={onInputChange}
                fullWidth
                margin="normal"
              >
                {data.addresses.map((address) => (
                  <MenuItem key={address._id} value={address._id}>
                    {address.addressType || "No Type"} - {address.street},{" "}
                    {address.city}, {address.zipCode}, {address.country}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {/* Show selected address details below the dropdown */}
            {data.selectedAddress && (
              <div>
                {/* Find the selected address */}
                {data.addresses.map((address, index) =>
                  address._id === data.selectedAddress ? (
                    <div key={address._id}>
                      <TextField
                        label="Address Type"
                        name={`addressType_${index}`} 
                        value={address.addressType || ""}
                        onChange={onInputChange}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Street"
                        name={`street_${index}`} 
                        value={address.street || ""}
                        onChange={onInputChange}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="City"
                        name={`city_${index}`} 
                        value={address.city || ""}
                        onChange={onInputChange}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Postal Code"
                        name={`postalCode_${index}`} 
                        value={address.zipCode || ""}
                        onChange={onInputChange}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Country"
                        name={`country_${index}`} 
                        value={address.country || ""}
                        onChange={onInputChange}
                        fullWidth
                        margin="normal"
                      />
                    </div>
                  ) : null
                )}
              </div>
            )}
          </>
        )}

        {/* Fields for order edit */}
        {isOrderEdit && (
          <>
            <TextField
              label="Customer Full Name"
              name="shippingAddress.fullName"
              value={data.shippingAddress?.fullName || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Shipping Address"
              name="shippingAddress.address"
              value={data.shippingAddress?.address || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="City"
              name="shippingAddress.city"
              value={data.shippingAddress?.city || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Postal Code"
              name="shippingAddress.postalCode"
              value={data.shippingAddress?.postalCode || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Country"
              name="shippingAddress.country"
              value={data.shippingAddress?.country || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
            <TextField 
              label="Total Amount"
              name="totalAmount"
              value={data.totalAmount || ""}
              onChange={onInputChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Payment Method"
              name="paymentInfo.method"
              value={data.paymentInfo?.method || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="cash-on-delivery">Cash on Delivery</MenuItem>
              <MenuItem value="credit-card">Credit Card</MenuItem>
            </TextField>

            <TextField
              select
              label="Payment Status"
              name="paymentInfo.status"
              value={data.paymentInfo?.status || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </TextField>

            <TextField
              select
              label="Order Status"
              name="status"
              value={data.status || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </>
        )}
        {/* Vendor-specific fields */}
        {isVendorEdit && (
          <>
            <TextField
              label="Vendor Name"
              name="name"
              value={data.name || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={data.email || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contact Number"
              name="phoneNumber"
              value={data.phoneNumber || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
          </>
        )}
        {/* Category-specific fields */}
        {isCategoryEdit && (
          <>
            <TextField
              label="Category Name"
              name="name"
              value={data.name || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Category Slug"
              name="slug"
              value={data.slug || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Image URL"
              name="imageUrl"
              value={data.imageUrl || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
          </>
        )}
        {/* Coupon Edit Fields */}
        {isCouponEdit && (
          <>
            <TextField
              label="Coupon Name"
              name="name"
              value={data.name || ""} // Coupon code
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Discount"
              name="value"
              value={data.value || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              type="number"
            />

            <TextField
              label="Type"
              name="type"
              value={data.type || ""} 
              onChange={onInputChange}
              fullWidth
              margin="normal"
              select
            >
              <MenuItem value="Purchase">Purchase</MenuItem> 
              <MenuItem value="Delivery">Delivery</MenuItem>
            </TextField>

            <TextField
              label="Validity Start"
              name="validityStart"
              type="date"
              value={data.validityStart || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="Validity End"
              name="validityEnd"
              type="date"
              value={data.validityEnd || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="Status"
              name="status"
              value={data.status || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              select
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </>
        )}

        {/* Fields for data edit */}
        {!isOrderEdit && !isCustomerEdit && !isVendorEdit && !isCategoryEdit && !isCouponEdit && (
          <>
            <TextField
              label="Name"
              name="name"
              value={data?.name || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Original Price"
              name="originalPrice"
              type="number"
              value={data?.originalPrice || ""}
              onChange={onInputChange}
              margin="normal"
            />
            <TextField
              label="Discount Price"
              name="discountPrice"
              type="number"
              value={data?.discountPrice || ""}
              onChange={onInputChange}
              margin="normal"
            />
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={data?.stock || ""}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />

            {/* Brand, Category, and Subcategory fields only for product edit */}
            <TextField
              select
              label="Brand"
              name="brand"
              value={selectedBrand || ""}
              onChange={handleBrandChange}
              fullWidth
              margin="normal"
            >
              {brands && brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.name}>
                  {brand.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Main Category"
              name="mainCategory"
              value={mainCategory || ""}
              onChange={handleCategoryChange}
              fullWidth
              margin="normal"
            >
              {categories && categories.map((category) => (
                <MenuItem key={category.slug} value={category.slug}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Sub Category"
              name="subCategory"
              value={subCategory || ""}
              onChange={handleSubCategoryChange}
              fullWidth
              margin="normal"
              disabled={!mainCategory}
            >
              {subcategories && subcategories.map((subcategory) => (
                <MenuItem key={subcategory.slug} value={subcategory.slug}>
                  {subcategory.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Sub-Sub Category"
              name="subSubCategory"
              value={subSubCategory || ""}
              onChange={handleSubSubCategoryChange}
              fullWidth
              margin="normal"
              disabled={!subCategory}
            >
              {subSubcategories && subSubcategories.map((subSubcategory) => (
                <MenuItem key={subSubcategory.slug} value={subSubcategory.slug}>
                  {subSubcategory.name}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
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

export default EditProductModal;



             