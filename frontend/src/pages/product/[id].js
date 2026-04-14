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
import { FaStar, FaRegStar, FaStarHalfAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdOutlineVerified, MdOutlineLocalShipping } from "react-icons/md";
import { HiOutlineCurrencyNaira } from "react-icons/hi";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";

import { addItemToCart } from "@/redux/slices/cartSlice";
import { addItemToWishList, removeItemFromWishList } from "@/redux/slices/wishListSlice";
import { createProductReview } from "@/redux/slices/productSlice";

const HeaderPromo = dynamic(() => import("@/components/layout/HeaderPromo"), { ssr: false });

// Format NGN
const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

// Helper to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Horizontal scrollable container component
const ScrollableRow = ({ title, children }) => {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-gray-700" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-gray-700" />
        </button>
      </div>
    </div>
  );
};

const ProductDetailPage = ({ product, similarProducts, vendorProducts, categories = [] }) => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const { cartItems } = useSelector((s) => s.cart);
  const { wishListItems } = useSelector((s) => s.wishList);
  const { userInfo } = useSelector((s) => s.user);
  const isLoggedIn = !!userInfo?._id;

  // Local state
  const [count, setCount] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0]?.url || "/default-image.jpg");
  const [showReviews, setShowReviews] = useState(false); // Reviews toggle state

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
                </div>
              </div>
            </div>
          </div>


          {/* You May Also Like - Horizontally Scrollable */}
          {similarProducts.length > 0 && (
            <div className="mt-12">
              <ScrollableRow title="You May Also Like">
                {similarProducts.map((p) => (
                  <div key={p._id} className="w-64 flex-shrink-0">
                    <ProductCard product={p} />
                  </div>
                ))}
              </ScrollableRow>
            </div>
          )}

          {/* More from this store - Horizontally Scrollable */}
          {vendorProducts.length > 0 && (
            <div className="mt-12">
              <ScrollableRow title="More from this store">
                {vendorProducts.map((p) => (
                  <div key={p._id} className="w-64 flex-shrink-0">
                    <ProductCard product={p} isMoreFromSeller />
                  </div>
                ))}
              </ScrollableRow>
            </div>
          )}

          {/* Customer Reviews Section - Bottom with Toggle */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Customer Reviews</h2>
              <button
                onClick={() => setShowReviews(!showReviews)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
              >
                {showReviews ? "Hide Reviews" : "Show Reviews"} ({product.reviews?.length || 0})
              </button>
            </div>

            {showReviews && (
              <div className="mt-6">
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review, index) => (
                      <div key={review._id || index} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold flex-shrink-0">
                            {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <p className="font-medium text-gray-800">{review.user?.name || "Anonymous"}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i}>
                                      {review.rating >= i + 1 ? (
                                        <FaStar className="text-yellow-400 text-sm" />
                                      ) : (
                                        <FaRegStar className="text-gray-300 text-sm" />
                                      )}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <span className="text-sm text-gray-400">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-gray-600 mt-2 text-sm leading-relaxed">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">No reviews yet.</p>
                )}
              </div>
            )}
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