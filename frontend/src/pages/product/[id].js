// pages/product/[id].js
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Head from "next/head";
import axios from "axios";
import { toast } from "react-toastify";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaStar } from "react-icons/fa";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";

import { addItemToCart } from "@/redux/slices/cartSlice";
import { addItemToWishList, removeItemFromWishList } from "@/redux/slices/wishListSlice";
import { createProductReview } from "@/redux/slices/productSlice";

import { Button, TextField, Modal, Box } from "@mui/material";
import { Typography as JoyTypography } from "@mui/joy";

// client-only promo bar (currency selector)
const HeaderPromo = dynamic(() => import("@/components/layout/HeaderPromo"), { ssr: false });

/* --------------------------------- PAGE --------------------------------- */

const ProductDetailPage = ({ product, similarProducts, vendorProducts, categories }) => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const { cartItems } = useSelector((s) => s.cart);
  const { wishListItems } = useSelector((s) => s.wishList);
  const { userInfo } = useSelector((s) => s.user);

  //convert into a strict boolean (true or false).
  const isLoggedIn = !!userInfo?._id;

// review was saved with `user` object; be defensive about shapes:
  const hasReviewed = product?.reviews?.some(r => r?.user?._id === userInfo?._id);

  // currency, 
  const { symbol, code, rates } = useSelector((s) => s.currency);
  const original = Number(product?.originalPrice) || 0;
  const discount = Number(product?.discountPrice) || 0;
  const rate = code === "USD" ? 1 : (rates?.[code] || 1); //look up rates[code].
  const convertedOriginal = original * rate;
  const convertedDiscount = discount * rate;

  // local UI state
  const [count, setCount] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0]?.url || "/default-image.jpg"
  );
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [review, setReview] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    if (product?.images?.length > 0) setSelectedImage(product.images[0].url);
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
    toast.success("Item added to cart successfully!");
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeItemFromWishList(product));
      setIsInWishlist(false);
    } else {
      dispatch(addItemToWishList(product));
      setIsInWishlist(true);
    }
  };

  // review modal
  const openReviewModal = () => {
    if (!isLoggedIn) {
      toast.info("Please log in to leave a review.");
      router.push(`/user/login?redirect=/product/${product._id}`);
      return;
    }
    if (hasReviewed) {
      toast.info("You’ve already reviewed this product.");
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
    toast.info("Please log in to leave a review.");
    router.push(`/auth/login?redirect=/product/${product._id}`);
    return;
  }
  if (hasReviewed) {
    toast.info("You’ve already reviewed this product.");
    return;
  }
    if (!review.rating) return toast.error("Please provide a rating before submitting.");

    const newReviewData = {
      user: userInfo,
      rating: review.rating,
      comment: (review.comment || "").trim(),
      productId: product._id,
    };

    try {
      const result = await dispatch(createProductReview(newReviewData));
      if (result.type.endsWith("/fulfilled")) {
        toast.success(result.payload?.message || "Review submitted successfully!");
        closeReviewModal();
        router.replace(`/product/${product?._id}`);
      } else {
        toast.error(result.payload || "You have already reviewed this product.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong.");
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg font-semibold">Product not found!</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{product?.name || "Product Details"}</title>
        <meta name="description" content={product?.description?.slice(0, 150) || "Product detail"} />
      </Head>

      <div className="overflow-x-hidden">
        <HeaderPromo />
        <Header categories={categories} />

        <div className="container mx-auto p-6">
          {/* Main two-column layout */}
          <div className="flex flex-col lg:flex-row gap-4 bg-[#F6F6F6] shadow-md rounded-lg p-4 items-stretch">
            {/* Left: images */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full">
                {/* Main image */}
                <div className="w-full h-[400px] relative mb-4">
                  <Image
                    src={selectedImage}
                    alt={product?.name}
                    fill
                    sizes="(max-width:1024px) 100vw, 50vw"
                    className="object-contain rounded-lg border border-gray-200"
                  />
                </div>

                {/* Thumbnails */}
                <div className="flex gap-4 mt-2 overflow-x-auto">
                  {(product?.images || []).map((img, i) => (
                    <button
                      key={i}
                      className={`w-24 h-24 flex-shrink-0 border rounded-lg overflow-hidden ${
                        selectedImage === img.url ? "border-2 border-blue-500" : "border-gray-200"
                      }`}
                      onClick={() => setSelectedImage(img.url)}
                    >
                      <Image
                        src={img.url}
                        alt={`Thumbnail ${i + 1}`}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: details */}
            <div className="flex-1 p-4 flex flex-col justify-between relative">
              {/* Wishlist */}
              <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                aria-label="Toggle wishlist"
              >
                {isInWishlist ? <AiFillHeart className="text-3xl" /> : <AiOutlineHeart className="text-3xl" />}
              </button>

              <div>
                <h1 className="text-gray-800 font-semibold text-[clamp(1.25rem,3.6vw,2rem)]">
                  {product?.name}
                </h1>

                {/* Prices (converted) */}
                <div className="flex items-center mt-3">
                  <span className="text-black font-bold text-[clamp(1.125rem,3.6vw,1.5rem)]">
                    {symbol}
                    {convertedDiscount.toFixed(2)}
                  </span>
                  {original > discount && (
                    <span className="ml-3 text-gray-500 line-through text-[clamp(0.95rem,3vw,1.125rem)]">
                      {symbol}
                      {convertedOriginal.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Rating + Sold */}
                <div className="flex items-center mt-2">
                  <span className="flex text-yellow-500 text-[clamp(0.85rem,2.7vw,1rem)]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FaStar
                        key={index}
                        className={`${(product?.rating || 0) >= index + 1 ? "text-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                  </span>
                  <span className="ml-2 text-yellow-500 font-bold text-[clamp(0.85rem,2.7vw,1rem)]">
                    ({product?.rating || "4.5"})
                  </span>
                  <span className="ml-4 text-gray-600 text-[clamp(0.85rem,2.5vw,0.95rem)]">
                    {product?.sold_out} Sold
                  </span>
                </div>

                {/* Stock */}
                <div className="mt-2">
                  <span
                    className={`font-semibold text-[clamp(0.85rem,2.5vw,1rem)] ${
                      product?.stock > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {product?.stock > 0 ? "In Stock" : "Sold Out"}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-4 text-gray-600 leading-relaxed text-[clamp(0.95rem,2.7vw,1.05rem)]">
                  {product?.description}
                </p>

                <ProductAttributes attributes={product?.attributes} />
              </div>

              {/* Quantity / actions */}
              <div className="mt-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={decrementCount}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-l-lg hover:bg-gray-300 text-lg"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-8 py-2 text-gray-700 text-lg">{count}</span>
                  <button
                    onClick={incrementCount}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-r-lg hover:bg-gray-300 text-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={addToCartHandler}
                  className="flex items-center justify-center px-6 py-2.5 bg-gray-900 text-white text-sm md:text-md lg:text-lg font-medium rounded-lg shadow hover:bg-gray-800"
                >
                  + Cart
                </button>

                {/* Review button (short text + tooltip) */}
                {!userInfo ? (
                <button
                  onClick={() => {
                    toast.info("Please log in to review.");
                    router.push({
                      pathname: "/user/login",
                      query: { redirect: `/product/${product._id}` },
                    });
                  }}
                  className="flex items-center justify-center px-6 py-2.5 bg-gray-200 text-gray-700 text-sm md:text-md lg:text-lg font-medium rounded-lg shadow hover:bg-gray-300"
                  title="Sign in to review"
                >
                  Review
                </button>

                ) : hasReviewed ? (
                  <button
                    disabled
                    className="flex items-center justify-center px-6 py-2.5 bg-gray-200 text-gray-500 text-sm md:text-md lg:text-lg font-medium rounded-lg cursor-not-allowed"
                    title="You already reviewed this item"
                  >
                    Reviewed
                  </button>
                ) : (
                  <button
                    onClick={openReviewModal}
                    className="flex items-center justify-center px-6 py-2.5 bg-blue-500 text-white text-sm md:text-md lg:text-lg font-medium rounded-lg shadow hover:bg-blue-600"
                    title="Leave a review"
                  >
                    Review
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Review Modal */}
          <Modal open={isReviewModalOpen} onClose={closeReviewModal} aria-labelledby="review-modal-title">
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 600,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                maxWidth: "94vw",
              }}
            >
              <JoyTypography id="review-modal-title" level="h4">
                Leave a Review
              </JoyTypography>

              {/* Rating */}
              <div className="flex items-center mt-4 gap-2">
                <span className="text-red-500">*</span> Rating:
                {[1, 2, 3, 4, 5].map((v) => (
                  <FaStar
                    key={v}
                    className={`cursor-pointer text-2xl ${review.rating >= v ? "text-yellow-500" : "text-gray-300"}`}
                    onClick={() => setReview((prev) => ({ ...prev, rating: v }))}
                  />
                ))}
              </div>

              {/* Comment */}
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="(Optional) Write your review here..."
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                sx={{ mt: 2 }}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button onClick={closeReviewModal} sx={{ mr: 2 }} variant="outlined">
                  Cancel
                </Button>
                <Button onClick={submitReview} variant="contained">
                  Submit
                </Button>
              </Box>
            </Box>
          </Modal>

          {/* Related + More from the Store */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
            <section className="min-w-0">
              <h3 className="text-xl font-semibold">Related Products</h3>

              <div
                className="mt-6 -mx-2 px-2 grid grid-flow-col 
                auto-cols-[minmax(260px,1fr)]
                gap-4 overflow-x-auto pb-2 snap-x snap-mandatory
                lg:auto-cols-[minmax(360px,1fr)]"
              >
                {(similarProducts || []).slice(0, 12).map((p) => (
                  <div key={p._id} className="snap-start">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>

            <aside className="md:w-[360px]">
              <h3 className="text-xl font-semibold">More From The Store</h3>
              <div className="mt-6 flex flex-col gap-4 max-h-[640px] overflow-y-auto pr-1">
                {(vendorProducts || []).slice(0, 12).map((p) => (
                  <ProductCard key={p._id} product={p} isMoreFromSeller />
                ))}
              </div>
            </aside>
          </div>

          <div className="mt-12" />
        </div>

        <Footer />
      </div>
    </>
  );
};

/* --------------------------- ATTRIBUTES SECTION -------------------------- */

import {
  FaTag, FaRuler, FaPalette, FaCogs, FaCar, FaClock, FaGasPump, FaMapMarkerAlt,
  FaBed, FaBath, FaBook, FaBuilding, FaBriefcase, FaMoneyBillWave, FaUser, FaLayerGroup,
  FaMap, FaCalendarAlt, FaVial,
} from "react-icons/fa";

const attributeIcons = {
  brand: FaTag,
  size: FaRuler,
  color: FaPalette,
  material: FaCogs,
  gender: FaUser,
  model: FaCar,
  make: FaCar,
  year: FaClock,
  mileage: FaMapMarkerAlt,
  fuelType: FaGasPump,
  warranty: FaCalendarAlt,
  condition: FaCogs,
  processor: FaCogs,
  memory: FaLayerGroup,
  storage: FaLayerGroup,
  display: FaRuler,
  propertyType: FaBuilding,
  location: FaMap,
  bedrooms: FaBed,
  bathrooms: FaBath,
  area: FaRuler,
  author: FaUser,
  publisher: FaBuilding,
  genre: FaBook,
  format: FaBook,
  language: FaBook,
  roomType: FaBuilding,
  type: FaTag,
  expiryDate: FaCalendarAlt,
  ingredients: FaVial,
  jobType: FaBriefcase,
  salary: FaMoneyBillWave,
  experienceLevel: FaUser,
  industry: FaCogs,
};

const ProductAttributes = ({ attributes }) => {
  if (!attributes || Object.keys(attributes).length === 0) return null;

  return (
    <div className="mt-4">
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(attributes).map(([key, value]) => {
          const Icon = attributeIcons[key.toLowerCase()];
          return (
            <li key={key} className="text-gray-700 flex items-center">
              {Icon && <Icon className="mr-2 text-gray-500" />}
              <span className="font-semibold">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </span>
              <span className="ml-2">{String(value)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/* -------- DATA FETCHING -------------- */

export async function getServerSideProps({ params }) {
  const { id } = params;
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const productRes = await axios.get(`${baseURL}/api/products/${id}`).catch(() => null);
    if (!productRes?.data?.product) return { notFound: true };

    const product = productRes.data.product;

    const [similarProductsRes, vendorProductsRes, categoriesRes] = await Promise.all([
      axios.get(`${baseURL}/api/products`, {
        params: { subSubCategory: product.subSubCategory },
      }).catch(() => null),
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
  } catch (e) {
    console.error("getServerSideProps error:", e?.message);
    return { notFound: true };
  }
}

export default ProductDetailPage;
