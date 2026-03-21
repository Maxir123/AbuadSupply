// Third-party library imports
import "quill/dist/quill.snow.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Image from "next/image";

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
import { AiOutlinePlus, AiOutlineDelete, AiOutlineUpload } from "react-icons/ai";

// Local imports
import { createSale } from "@/redux/slices/saleSlice";
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

const CreateFlashSale = () => {
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
    startDate: "",
    endDate: "",
    isFeatured: false,
    attributes: {},
  });

  const [subcategories, setSubcategories] = useState([]);
  const [subSubcategories, setSubSubcategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  useEffect(() => {
    if (!productData.mainCategory) return;
    const main = categories.find((c) => c.slug === productData.mainCategory);
    setSubcategories(main?.subcategories || []);
    setProductData((prev) => ({
      ...prev,
      subCategory: "",
      subSubCategory: "",
      attributes: {},
    }));
  }, [productData.mainCategory, categories]);

  useEffect(() => {
    if (productData.subCategory) {
      const subCategoryObj = subcategories.find(
        (subcat) => subcat.slug === productData.subCategory
      );
      setSubSubcategories(subCategoryObj?.subsubcategories || []);
    } else {
      setSubSubcategories([]);
    }
  }, [productData.subCategory, subcategories]);

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setProductData({
      ...productData,
      mainCategory: value,
      subCategory: "",
      subSubCategory: "",
      attributes: {},
    });
    setErrors((prev) => ({ ...prev, mainCategory: "" }));
  };

  const handleDescriptionChange = (text) => {
    setProductData((prev) => ({ ...prev, description: text }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      attributes: { ...productData.attributes, [name]: value },
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
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
  };

  const handleIsFeaturedChange = (e) => {
    setProductData({ ...productData, isFeatured: e.target.checked });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!productData.name.trim()) newErrors.name = "Product name is required";
    if (!productData.mainCategory) newErrors.mainCategory = "Category is required";
    if (!productData.subCategory) newErrors.subCategory = "Subcategory is required";
    if (!productData.brand) newErrors.brand = "Brand is required";
    if (!productData.originalPrice) newErrors.originalPrice = "Original price is required";
    if (!productData.stock) newErrors.stock = "Stock is required";
    if (!productData.startDate) newErrors.startDate = "Start date is required";
    if (!productData.endDate) newErrors.endDate = "End date is required";
    if (images.length === 0) newErrors.images = "At least one image is required";
    if (productData.discountPrice && Number(productData.discountPrice) >= Number(productData.originalPrice)) {
      newErrors.discountPrice = "Discount price must be less than original price";
    }
    if (new Date(productData.startDate) >= new Date(productData.endDate)) {
      newErrors.dates = "End date must be after start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const newForm = new FormData();
    Object.keys(productData).forEach((key) => {
      if (key !== "attributes") {
        newForm.append(key, productData[key]);
      }
    });
    newForm.append("vendorId", vendorInfo._id);

    Object.keys(productData.attributes).forEach((key) => {
      newForm.append(`attributes[${key}]`, productData.attributes[key]);
    });

    images.forEach((url) => {
      newForm.append("images", url);
    });

    try {
      const result = await dispatch(createSale(newForm));
      if (result.type === "sales/createSale/fulfilled") {
        toast.success("Sale created successfully!");
        router.push("/vendor/dashboard");
      } else {
        toast.error("Sale creation failed.");
      }
    } catch (error) {
      console.error("Sale creation error:", error);
      toast.error("An error occurred while creating the sale.");
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
            Create Flash Sale
          </Typography>
          <Chip label="New" size="small" color="primary" />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Fill in the details to launch your sale product
        </Typography>
      </Paper>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Product Information Section */}
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
              <RichTextEditor
                as="text"
                value={productData.description}
                onChange={handleDescriptionChange}
                className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Paper>
          </Grid>

          {/* Category & Brand Section */}
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
                      {categories.map((category) => (
                        <MenuItem key={category.slug} value={category.slug}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.mainCategory && (
                      <Typography variant="caption" color="error">
                        {errors.mainCategory}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth error={!!errors.subCategory}>
                    <InputLabel>Subcategory</InputLabel>
                    <Select
                      value={productData.subCategory}
                      onChange={(e) =>
                        setProductData({ ...productData, subCategory: e.target.value })
                      }
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
                      <Typography variant="caption" color="error">
                        {errors.subCategory}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Sub-Subcategory</InputLabel>
                    <Select
                      value={productData.subSubCategory}
                      onChange={(e) =>
                        setProductData({ ...productData, subSubCategory: e.target.value })
                      }
                      label="Sub-Subcategory"
                      disabled={!productData.subCategory}
                    >
                      <MenuItem value="">Choose a sub-subcategory</MenuItem>
                      {subSubcategories.map((subSub) => (
                        <MenuItem key={subSub.slug} value={subSub.slug}>
                          {subSub.name}
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
                      onChange={(e) =>
                        setProductData({ ...productData, brand: e.target.value })
                      }
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
                      <Typography variant="caption" color="error">
                        {errors.brand}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Price & Stock Section */}
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

          {/* Sale Dates Section */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "white", border: "1px solid", borderColor: "grey.100" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Sale Period
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    name="startDate"
                    value={productData.startDate}
                    onChange={handleInputChange}
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    name="endDate"
                    value={productData.endDate}
                    onChange={handleInputChange}
                    error={!!errors.endDate}
                    helperText={errors.endDate}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                {errors.dates && (
                  <Grid item xs={12}>
                    <Alert severity="error" sx={{ mt: 1 }}>{errors.dates}</Alert>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Attributes Section */}
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

          {/* Images Section */}
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
                  {images.map((img, idx) => (
                    <Box key={idx} sx={{ position: "relative" }}>
                      <Image
                        src={img}
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
              {loading ? "Creating..." : "Create Sale Product"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CreateFlashSale;