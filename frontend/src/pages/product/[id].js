// pages/product/[id].js
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Head from "next/head";
import axios from "axios";
import { toast } from "react-toastify";
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart, AiOutlineStar, AiFillStar } from "react-icons/ai";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { MdOutlineVerified, MdOutlineLocalShipping } from "react-icons/md";
import { HiOutlineCurrencyNaira } from "react-icons/hi";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";

import { addItemToCart } from "@/redux/slices/cartSlice";
import { addItemToWishList, removeItemFromWishList } from "@/redux/slices/wishListSlice";
import { createProductReview } from "@/redux/slices/productSlice";

import { Button, TextField, Modal, Box, Rating, CircularProgress } from "@mui/material";
import { Typography as JoyTypography } from "@mui/joy";

const HeaderPromo = dynamic(() => import("@/components/layout/HeaderPromo"), { ssr: false });

// Format NGN
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const ProductDetailPage = ({ product, similarProducts, vendorProducts, categories }) => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const { cartItems } = useSelector((s) => s.cart);
  const { wishListItems } = useSelector((s) => s.wishList);
  const { userInfo } = useSelector((s) => s.user);
  const isLoggedIn = !!userInfo?._id;
  const hasReviewed = product?.reviews?.some((r) => r?.user?._id === userInfo?._id);

  // Local state
  const [count, setCount] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0]?.url || "/default-image.jpg");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const originalPrice = product?.originalPrice || 0;
  const discountPrice = product?.discountPrice || 0;

  useEffect(() => {
    if (product?.images?.length) setSelectedImage(product.images[0].url);
  }, [product]);

  useEffect(() => {
    setIsInWishlist(!!wishListItems.find((item) => item._id === id));
  }, [wishListItems, id]);

  const incrementCount = () => setCount((c) => c + 1);
  const decrementCount = () => setCount((c) => (c > 1 ? c - 1 : c));

  const addToCartHandler = () => {
    const exists = cartItems.find((item) => item._id === product._id);
    if (exists) return toast.error("Item already in cart!");
    if (product.stock < count) return toast.error("Product stock limited!");
    dispatch(addItemToCart({ ...product, qty: count }));
    toast.success("Added to cart!");
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeItemFromWishList(product));
      setIsInWishlist(false);
      toast.info("Removed from wishlist");
    } else {
      dispatch(addItemToWishList(product));
      setIsInWishlist(true);
      toast.success("Added to wishlist");
    }
  };

  const openReviewModal = () => {
    if (!isLoggedIn) {
      toast.info("Please log in to leave a review.");
      router.push(`/user/login?redirect=/product/${product._id}`);
      return;
    }
    if (hasReviewed) {
      toast.info("You have already reviewed this product.");
      return;
    }
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReview({ rating: 0, comment: "" });
  };

  const submitReview = async () => {
    if (!isLoggedIn) {
      toast.info("Please log in to review.");
      router.push(`/auth/login?redirect=/product/${product._id}`);
      return;
    }
    if (hasReviewed) {
      toast.info("You already reviewed this product.");
      return;
    }
    if (!review.rating) return toast.error("Please select a rating.");

    setSubmitting(true);
    const newReviewData = {
      user: userInfo,
      rating: review.rating,
      comment: (review.comment || "").trim(),
      productId: product._id,
    };

    try {
      const result = await dispatch(createProductReview(newReviewData));
      if (result.type.endsWith("/fulfilled")) {
        toast.success("Review submitted! Thank you.");
        closeReviewModal();
        router.replace(`/product/${product._id}`);
      } else {
        toast.error(result.payload || "Failed to submit review.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-500 text-xl font-semibold">Product not found!</p>
          <button onClick={() => router.push("/")} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Go Home</button>
        </div>
      </div>
    );
  }

  // Calculate average rating
  const avgRating = product?.reviews?.length
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : 0;

  return (
    <>
      <Head>
        <title>{product.name} | Nigerian Store</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
      </Head>
      <div className="bg-gray-50 min-h-screen">
        <HeaderPromo />
        <Header categories={categories} />

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Product Main Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* Left - Image Gallery */}
              <div>
                <div className="relative h-80 md:h-96 bg-gray-100 rounded-xl overflow-hidden mb-4">
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images?.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img.url)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                        selectedImage === img.url ? "border-blue-500" : "border-gray-200"
                      }`}
                    >
                      <Image src={img.url} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right - Product Info */}
              <div className="flex flex-col">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
                  <button
                    onClick={toggleWishlist}
                    className="text-red-500 hover:scale-110 transition p-2"
                    aria-label="Wishlist"
                  >
                    {isInWishlist ? <AiFillHeart size={28} /> : <AiOutlineHeart size={28} />}
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {avgRating >= star ? (
                          <AiFillStar className="text-yellow-400" />
                        ) : avgRating >= star - 0.5 ? (
                          <FaStarHalfAlt className="text-yellow-400" />
                        ) : (
                          <AiOutlineStar className="text-yellow-400" />
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews?.length || 0} reviews)</span>
                  <span className="text-sm text-green-600">⭐ {avgRating || "No ratings"}</span>
                </div>

                {/* Price in NGN */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatNaira(discountPrice)}
                  </span>
                  {originalPrice > discountPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatNaira(originalPrice)}
                    </span>
                  )}
                  {product.discount && (
                    <span className="bg-red-100 text-red-700 text-sm px-2 py-0.5 rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Stock & Shipping */}
                <div className="mt-4 flex items-center gap-4">
                  <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                    {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : "✗ Out of Stock"}
                  </span>
                  <span className="flex items-center text-gray-500 text-sm">
                    <MdOutlineLocalShipping className="mr-1" /> Free Delivery over ₦50,000
                  </span>
                </div>

                {/* Description */}
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-700">Description</h3>
                  <p className="text-gray-600 mt-1 leading-relaxed">{product.description}</p>
                </div>

                {/* Attributes */}
                <ProductAttributes attributes={product.attributes} />

                {/* Quantity & Actions */}
                <div className="mt-6 flex flex-wrap gap-4 items-center">
                  <div className="flex border rounded-lg overflow-hidden">
                    <button onClick={decrementCount} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold">
                      -
                    </button>
                    <span className="px-6 py-2 text-lg font-medium">{count}</span>
                    <button onClick={incrementCount} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold">
                      +
                    </button>
                  </div>
                  <button
                    onClick={addToCartHandler}
                    disabled={product.stock === 0}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:bg-gray-400"
                  >
                    <AiOutlineShoppingCart size={20} /> Add to Cart
                  </button>
                  <button
                    onClick={openReviewModal}
                    className="border border-gray-300 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium transition"
                  >
                    Write a Review
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Modal (Improved) */}
          <Modal open={isReviewModalOpen} onClose={closeReviewModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: 500 },
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: 24,
                p: 4,
              }}
            >
              <JoyTypography level="h4" className="mb-2">Rate this product</JoyTypography>
              <div className="flex items-center gap-2 mb-4">
                <Rating
                  name="product-rating"
                  value={review.rating}
                  onChange={(e, newVal) => setReview({ ...review, rating: newVal || 0 })}
                  precision={1}
                  size="large"
                />
                <span className="text-sm text-gray-500">{review.rating} / 5</span>
              </div>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your review (optional)"
                placeholder="Tell others what you think..."
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                variant="outlined"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={closeReviewModal} variant="outlined">Cancel</Button>
                <Button onClick={submitReview} variant="contained" disabled={submitting}>
                  {submitting ? <CircularProgress size={24} /> : "Submit Review"}
                </Button>
              </div>
            </Box>
          </Modal>

          {/* Related Products & More from Store */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similarProducts.slice(0, 4).map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">More from this store</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {vendorProducts.slice(0, 6).map((p) => (
                  <ProductCard key={p._id} product={p} isMoreFromSeller />
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

/* -------- Attributes Component (Improved) -------- */
import {
  FaTag, FaRuler, FaPalette, FaCogs, FaCar, FaClock, FaGasPump, FaMapMarkerAlt,
  FaBed, FaBath, FaBook, FaBuilding, FaBriefcase, FaMoneyBillWave, FaUser, FaLayerGroup,
  FaMap, FaCalendarAlt, FaVial,
} from "react-icons/fa";

const attributeIcons = {
  brand: FaTag, size: FaRuler, color: FaPalette, material: FaCogs, gender: FaUser,
  model: FaCar, make: FaCar, year: FaClock, mileage: FaMapMarkerAlt, fuelType: FaGasPump,
  warranty: FaCalendarAlt, condition: FaCogs, processor: FaCogs, memory: FaLayerGroup,
  storage: FaLayerGroup, display: FaRuler, propertyType: FaBuilding, location: FaMap,
  bedrooms: FaBed, bathrooms: FaBath, area: FaRuler, author: FaUser, publisher: FaBuilding,
  genre: FaBook, format: FaBook, language: FaBook, roomType: FaBuilding, type: FaTag,
  expiryDate: FaCalendarAlt, ingredients: FaVial, jobType: FaBriefcase, salary: FaMoneyBillWave,
  experienceLevel: FaUser, industry: FaCogs,
};

const ProductAttributes = ({ attributes }) => {
  if (!attributes || Object.keys(attributes).length === 0) return null;
  return (
    <div className="mt-4 border-t pt-3">
      <h3 className="font-semibold text-gray-700 mb-2">Specifications</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {Object.entries(attributes).map(([key, value]) => {
          const Icon = attributeIcons[key.toLowerCase()];
          return (
            <div key={key} className="flex items-center gap-2 py-1">
              {Icon && <Icon className="text-gray-500" size={14} />}
              <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <span className="text-gray-600">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* -------- Server Side Props -------- */
export async function getServerSideProps({ params }) {
  const { id } = params;
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const productRes = await axios.get(`${baseURL}/api/products/${id}`).catch(() => null);
    if (!productRes?.data?.product) return { notFound: true };
    const product = productRes.data.product;

    const [similarProductsRes, vendorProductsRes, categoriesRes] = await Promise.all([
      axios.get(`${baseURL}/api/products`, { params: { subSubCategory: product.subSubCategory } }).catch(() => null),
      axios.get(`${baseURL}/api/products/${product.vendorId}/products`).catch(() => null),
      axios.get(`${baseURL}/api/categories`).catch(() => null),
    ]);

    return {
      props: {
        product,
        similarProducts: similarProductsRes?.data?.products || [],
        vendorProducts: vendorProductsRes?.data?.products || [],
        categories: categoriesRes?.data?.categories || [],
      },
    };
  } catch (error) {
    console.error("SSR error:", error);
    return { notFound: true };
  }
}

export default ProductDetailPage;