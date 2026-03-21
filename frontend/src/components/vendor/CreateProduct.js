// Third-party library imports
import "quill/dist/quill.snow.css";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { AiOutlinePlus, AiOutlineUpload, AiOutlineDelete } from "react-icons/ai";

// MUI Imports
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
} from "@mui/material";

// Local imports
import { createProduct } from "@/redux/slices/productSlice";
import { fetchCategories } from "@/redux/slices/categorySlice";
import { fetchAllBrands } from "@/redux/slices/brandSlice";
import RichTextEditor from "../common/RichTextEditor";

// Category-specific attributes
const categoryAttributes = {
  clothing: ["size", "color", "material", "gender"],
  vehicles: ["model", "make", "year", "mileage", "fuelType"],
  electronics: ["model", "warranty", "condition", "processor", "memory", "storage", "display"],
  shoes: ["size", "color", "material", "gender"],
  property: ["propertyType", "location", "bedrooms", "bathrooms", "area"],
  content: ["author", "publisher", "genre", "format", "language"],
  home: ["material", "dimensions", "roomType"],
  wellness: ["type", "expiryDate", "ingredients", "gender"],
  jobs: ["jobType", "location", "salary", "experienceLevel", "industry"],
};

// Nigerian Naira formatter
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

const CreateProduct = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const router = useRouter();
  const { vendorInfo } = useSelector((state) => state.vendors);
  const { categories } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    mainCategory: "",
    subCategory: "",
    subSubCategory: "",
    brand: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
    isFeatured: false,
    attributes: {},
  });

  const [errors, setErrors] = useState({});

  // Derived data
  const subcategories = useMemo(() => {
    if (!productData.mainCategory) return [];
    const main = categories?.find((c) => c.slug === productData.mainCategory);
    return main?.subcategories || [];
  }, [categories, productData.mainCategory]);

  const subSubcategories = useMemo(() => {
    if (!productData.subCategory) return [];
    const sub = subcategories.find((s) => s.slug === productData.subCategory);
    return sub?.subsubcategories || [];
  }, [subcategories, productData.subCategory]);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setProductData((prev) => ({
      ...prev,
      mainCategory: value,
      subCategory: "",
      subSubCategory: "",
      attributes: {},
    }));
    if (errors.mainCategory) setErrors((prev) => ({ ...prev, mainCategory: "" }));
  };

  const handleDescriptionChange = (text) => {
    setProductData((prev) => ({ ...prev, description: text }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [name]: value },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));
  };

  const handleIsFeaturedChange = (e) => {
    setProductData((prev) => ({ ...prev, isFeatured: e.target.checked }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!productData.name.trim()) newErrors.name = "Product name is required";
    if (!productData.mainCategory) newErrors.mainCategory = "Main category is required";
    if (!productData.subCategory) newErrors.subCategory = "Subcategory is required";
    if (!productData.brand) newErrors.brand = "Brand is required";
    if (!productData.originalPrice) newErrors.originalPrice = "Original price is required";
    if (!productData.stock) newErrors.stock = "Stock is required";
    if (images.length === 0) newErrors.images = "At least one image is required";
    if (productData.discountPrice && Number(productData.discountPrice) >= Number(productData.originalPrice)) {
      newErrors.discountPrice = "Discount price must be less than original price";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const form = new FormData();
    Object.entries(productData).forEach(([key, val]) => {
      if (key !== "attributes") form.append(key, val);
    });
    form.append("vendorId", vendorInfo._id);
    Object.entries(productData.attributes).forEach(([k, v]) => {
      form.append(`attributes[${k}]`, v);
    });
    images.forEach((dataUrl) => form.append("images", dataUrl));

    try {
      const result = await dispatch(createProduct(form));
      if (result.type === "products/createProduct/fulfilled") {
        toast.success("Product created successfully!");
        router.push("/vendor/dashboard");
      } else {
        const msg = result.payload?.message || "An error occurred while creating the product.";
        toast.error(msg);
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          bgcolor: "white",
          border: "1px solid",
          borderColor: "grey.100",
          flexDirection: isMobile ? "column" : "row",
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
            <AiOutlinePlus size={22} color="#1976d2" />
          </Box>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Create Product
          </Typography>
          <Chip label="New" size="small" color="primary" />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Fill in the details to add a new product
        </Typography>
      </Paper>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Product Information */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "white", border: "1px solid", borderColor: "grey.100" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Product Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle2" gutterBottom>
                Description
              </Typography>
              <RichTextEditor as="text" value={productData.description} onChange={handleDescriptionChange} />
            </Paper>
          </Grid>

          {/* Category & Brand */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "white", border: "1px solid", borderColor: "grey.100" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Category & Brand
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth error={!!errors.mainCategory}>
                    <InputLabel>Main Category</InputLabel>
                    <Select
                      value={productData.mainCategory}
                      onChange={handleCategoryChange}
                      label="Main Category"
                      required
                    >
                      <MenuItem value="">Choose a category</MenuItem>
                      {categories?.map((category) => (
                        <MenuItem key={category.slug} value={category.slug}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.mainCategory && (
                      <Typography variant="caption" color="error">{errors.mainCategory}</Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth error={!!errors.subCategory}>
                    <InputLabel>Subcategory</InputLabel>
                    <Select
                      value={productData.subCategory}
                      onChange={(e) => setProductData((prev) => ({ ...prev, subCategory: e.target.value }))}
                      label="Subcategory"
                      required
                      disabled={!productData.mainCategory}
                    >
                      <MenuItem value="">Choose a subcategory</MenuItem>
                      {subcategories.map((sub) => (
                        <MenuItem key={sub.slug} value={sub.slug}>
                          {sub.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.subCategory && (
                      <Typography variant="caption" color="error">{errors.subCategory}</Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Sub-Subcategory</InputLabel>
                    <Select
                      value={productData.subSubCategory}
                      onChange={(e) => setProductData((prev) => ({ ...prev, subSubCategory: e.target.value }))}
                      label="Sub-Subcategory"
                      disabled={!productData.subCategory}
                    >
                      <MenuItem value="">Choose a sub-subcategory</MenuItem>
                      {subSubcategories.map((ssc) => (
                        <MenuItem key={ssc.slug} value={ssc.slug}>
                          {ssc.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth error={!!errors.brand}>
                    <InputLabel>Brand</InputLabel>
                    <Select
                      value={productData.brand}
                      onChange={(e) => setProductData((prev) => ({ ...prev, brand: e.target.value }))}
                      label="Brand"
                      required
                    >
                      <MenuItem value="">Choose a brand</MenuItem>
                      {brands?.map((brand) => (
                        <MenuItem key={brand.name} value={brand.name}>
                          {brand.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.brand && (
                      <Typography variant="caption" color="error">{errors.brand}</Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Price & Stock */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "white", border: "1px solid", borderColor: "grey.100" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Pricing & Stock
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Original Price (₦)"
                    name="originalPrice"
                    type="number"
                    value={productData.originalPrice}
                    onChange={handleInputChange}
                    error={!!errors.originalPrice}
                    helperText={errors.originalPrice}
                    required
                    InputProps={{ startAdornment: <span>₦</span> }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Discount Price (₦)"
                    name="discountPrice"
                    type="number"
                    value={productData.discountPrice}
                    onChange={handleInputChange}
                    error={!!errors.discountPrice}
                    helperText={errors.discountPrice}
                    InputProps={{ startAdornment: <span>₦</span> }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    name="stock"
                    type="number"
                    value={productData.stock}
                    onChange={handleInputChange}
                    error={!!errors.stock}
                    helperText={errors.stock}
                    required
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Attributes */}
          {categoryAttributes[productData.mainCategory]?.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "white", border: "1px solid", borderColor: "grey.100" }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Product Attributes
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  {categoryAttributes[productData.mainCategory].map((attr) => (
                    <Grid item xs={12} sm={6} md={4} key={attr}>
                      <TextField
                        fullWidth
                        label={attr.charAt(0).toUpperCase() + attr.slice(1)}
                        name={attr}
                        value={productData.attributes[attr] || ""}
                        onChange={handleAttributeChange}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Images */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "white", border: "1px solid", borderColor: "grey.100" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Product Images
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  border: "1px dashed",
                  borderColor: errors.images ? "error.main" : "grey.400",
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                  textAlign: "center",
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button variant="outlined" component="span" startIcon={<AiOutlineUpload />}>
                    Upload Images
                  </Button>
                </label>
                {errors.images && (
                  <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                    {errors.images}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" display="block">
                  You can select multiple images
                </Typography>
              </Box>

              {images.length > 0 && (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  {images.map((src, idx) => (
                    <Box key={idx} sx={{ position: "relative" }}>
                      <Image
                        src={src}
                        alt={`Preview ${idx}`}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                        unoptimized
                      />
                      <IconButton
                        size="small"
                        sx={{ position: "absolute", top: -8, right: -8, bgcolor: "white", boxShadow: 1 }}
                        onClick={() => removeImage(idx)}
                      >
                        <AiOutlineDelete size={16} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Featured Product Switch */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "white", border: "1px solid", borderColor: "grey.100" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={productData.isFeatured}
                    onChange={handleIsFeaturedChange}
                    color="primary"
                  />
                }
                label="Feature this product"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Featured products appear prominently in your store
              </Typography>
            </Paper>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <AiOutlinePlus />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                width: "100%",
                maxWidth: isMobile ? "100%" : "300px",
              }}
            >
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CreateProduct;