import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import Image from "next/image";

const ViewProductModal = ({
  open,
  onClose,
  isLoading,
  singleProduct
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle style={{ fontWeight: "bold" }}>Product Details</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <CircularProgress />
          </div>
        ) : singleProduct ? (
          <div>
            {/* Product Information */}
            <Card style={{ marginBottom: "20px" }}>
              <CardContent>
                <Typography variant="h6">Product Name: {singleProduct.name}</Typography>
                <Divider style={{ margin: "10px 0" }} />
                <Typography variant="body2" color="textSecondary">
                  <strong>Brand:</strong> {singleProduct.brand}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Main Category:</strong> {singleProduct.mainCategory}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Sub Category:</strong> {singleProduct.subCategory}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Sub Sub Category:</strong> {singleProduct.subSubCategory}
                </Typography>
              </CardContent>
            </Card>

            {/* Vendor Information */}
            <Card style={{ marginBottom: "20px" }}>
              <CardContent>
                <Typography variant="h6">Vendor Information</Typography>
                <Divider style={{ margin: "10px 0" }} />
                <Typography variant="body2">
                  <strong>Vendor Name:</strong> {singleProduct?.vendorId?.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Vendor Address:</strong> {singleProduct?.vendorId?.address}
                </Typography>
                {singleProduct?.vendorId?.avatar?.url && (
                  <Image
                    src={singleProduct?.vendorId?.avatar.url}
                    alt="Vendor Avatar"
                    width={50}
                    height={50}
                    style={{ borderRadius: "50%" }}
                  />
                )}
              </CardContent>
            </Card>

            {/* Product Pricing and Stock */}
            <Card style={{ marginBottom: "20px" }}>
              <CardContent>
                <Typography variant="h6">Pricing & Stock</Typography>
                <Divider style={{ margin: "10px 0" }} />
                <Typography variant="body2">
                  <strong>Original Price:</strong> ${singleProduct.originalPrice}
                </Typography>
                <Typography variant="body2">
                  <strong>Discount Price:</strong> ${singleProduct.discountPrice}
                </Typography>
                <Typography variant="body2">
                  <strong>Stock:</strong> {singleProduct.stock}
                </Typography>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card style={{ marginBottom: "20px" }}>
              <CardContent>
                <Typography variant="h6">Product Images</Typography>
                <Divider style={{ margin: "10px 0" }} />
                <div style={{ display: "flex", gap: "10px" }}>
                  {singleProduct.images.map((img, index) => (
                    <Image
                      key={img?._id || index}
                      src={img?.url || "/images/product-placeholder.jpg"}
                      alt={`Product Image ${index + 1}`}
                      width={100}
                      height={100}
                      sizes="100px"
                      className="rounded-[5px] object-cover"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Product Reviews */}
            <Card>
              <CardContent>
                <Typography variant="h6">Product Reviews</Typography>
                <Divider style={{ margin: "10px 0" }} />
                {singleProduct.reviews.length > 0 ? (
                  <ul>
                    {singleProduct.reviews.map((review) => (
                      <li key={review._id}>
                        <Typography variant="body2">
                          <strong>
                            {review.user.name} ({review.rating} stars)
                          </strong>
                        </Typography>
                        <Typography variant="body2">{review.comment}</Typography>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No reviews yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Product details are not available.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewProductModal;
