// pages/sale/[id].js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaStar, FaFire, FaBolt, FaShoppingCart, FaTag } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import { Button, TextField, Modal, Box } from "@mui/material";
import { addItemToCart } from "@/redux/slices/cartSlice";
import { addItemToWishList, removeItemFromWishList } from "@/redux/slices/wishListSlice";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import CountdownTimer from "@/components/routes/sales/CountdownTimer";
import { createProductReview } from "@/redux/slices/productSlice";

// Icon mapping for attributes (same as before)
const attributeIcons = { /* ... keep existing mapping ... */ };
const ProductAttributes = ({ attributes }) => { /* ... keep existing ... */ };

const SaleProductDetails = ({ sale, relatedSales }) => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishListItems } = useSelector((state) => state.wishList);
  const { userInfo } = useSelector((state) => state.user);

  const [count, setCount] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    sale?.images?.length > 0 ? sale.images[0].url : "/default-image.jpg"
  );
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [review, setReview] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    setIsInWishlist(wishListItems.some((item) => item._id === id));
  }, [wishListItems, id]);

  const incrementCount = () => setCount((c) => c + 1);
  const decrementCount = () => setCount((c) => (c > 1 ? c - 1 : 1));

  const addToCartHandler = () => {
    const exists = cartItems.find((item) => item._id === sale._id);
    if (exists) return toast.error("Item already in cart!");
    if (sale.stock < count) return toast.error("Stock limited!");
    dispatch(addItemToCart({ ...sale, qty: count }));
    toast.success("🔥 Added to cart!");
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeItemFromWishList(sale));
      setIsInWishlist(false);
      toast.info("Removed from wishlist");
    } else {
      dispatch(addItemToWishList(sale));
      setIsInWishlist(true);
      toast.success("❤️ Added to wishlist");
    }
  };

  const openReviewModal = () => setIsReviewModalOpen(true);
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReview({ rating: 0, comment: "" });
  };

  const submitReview = async () => {
    const newReview = {
      user: userInfo,
      rating: review.rating,
      comment: review.comment,
      productId: sale._id,
    };
    try {
      const result = await dispatch(createProductReview(newReview));
      if (result.type === "products/createProductReview/fulfilled") {
        toast.success("Review submitted!");
        closeReviewModal();
        router.reload();
      } else {
        toast.error(result.payload || "You have already reviewed this product.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (!sale || error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-xl font-bold">{error || "Sale not found!"}</p>
      </div>
    );
  }

  const discountPercent = Math.round(((sale.originalPrice - sale.discountPrice) / sale.originalPrice) * 100);

  return (
    <>
      <Header />
      <main className="bg-gradient-to-br from-gray-50 via-white to-red-50">
        {/* Flash Sale Hero Banner */}
        <div className="relative bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <FaFire className="text-8xl animate-pulse" />
          </div>
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 animate-pulse">
            <div className="flex items-center gap-2">
              <FaBolt className="text-yellow-300 text-2xl" />
              <span className="font-black text-xl tracking-wider">FLASH SALE</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>🔥 Limited time offer</span>
              <span>⚡ Up to {discountPercent}% OFF</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-4 md:p-6">
          {/* Main Product Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-6 p-6">
              {/* Left Column - Images */}
              <div className="lg:w-1/2">
                <div className="relative group">
                  <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <FaFire className="animate-pulse" /> -{discountPercent}%
                  </div>
                  <div className="relative h-80 md:h-96 w-full overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={selectedImage}
                      alt={sale.name}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  {/* Thumbnails */}
                  <div className="flex gap-3 mt-4 justify-center flex-wrap">
                    {sale.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img.url)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === img.url ? "border-red-500 shadow-lg scale-105" : "border-gray-200"
                        }`}
                      >
                        <Image src={img.url} alt={`thumb ${idx}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="lg:w-1/2 flex flex-col">
                {/* Wishlist button (floating) */}
                <button
                  onClick={toggleWishlist}
                  className="self-end mb-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  {isInWishlist ? (
                    <AiFillHeart className="text-red-500 text-3xl" />
                  ) : (
                    <AiOutlineHeart className="text-gray-600 text-3xl" />
                  )}
                </button>

                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">{sale.name}</h1>

                {/* Countdown Timer - Flashy */}
                <div className="my-4 bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2 text-red-700 font-semibold mb-1">
                    <FaFire className="animate-pulse" />
                    <span>Offer ends in:</span>
                  </div>
                  <CountdownTimer
                    endDate={sale.saleEnd}
                    textColor="text-red-700"
                    bgColor="bg-transparent"
                    textSize="text-2xl"
                  />
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-4xl font-black text-red-600">₦{sale.discountPrice}</span>
                  {sale.originalPrice > sale.discountPrice && (
                    <>
                      <span className="text-xl text-gray-400 line-through">₦{sale.originalPrice}</span>
                      <span className="bg-green-100 text-green-700 text-sm font-bold px-2 py-1 rounded-full">
                        Save ₦{(sale.originalPrice - sale.discountPrice).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* Ratings */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(sale.rating) ? "text-yellow-500" : "text-gray-300"} />
                    ))}
                  </div>
                  <span className="font-semibold">{sale.rating?.toFixed(1)}</span>
                  <span className="text-gray-500">({sale.numReviews || 0} reviews)</span>
                  {sale.sold_out > 0 && <span className="text-gray-500">• {sale.sold_out} sold</span>}
                </div>

                {/* Stock */}
                <div className="mt-2">
                  <span className={`text-sm font-bold ${sale.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                    {sale.stock > 0 ? `✅ In Stock (${sale.stock} left)` : "❌ Sold Out"}
                  </span>
                </div>

                <p className="text-gray-600 mt-4 leading-relaxed">{sale.description}</p>
                <ProductAttributes attributes={sale.attributes} />

                {/* Quantity & Actions */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Quantity selector */}
                <div className="flex items-center justify-between sm:justify-start border rounded-full overflow-hidden shadow-sm w-full sm:w-auto">
                  <button
                    onClick={decrementCount}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xl font-bold transition w-1/3 sm:w-auto"
                  >
                    -
                  </button>

                  <span className="px-6 py-2 text-lg font-semibold text-center w-1/3 sm:w-auto">
                    {count}
                  </span>

                  <button
                    onClick={incrementCount}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xl font-bold transition w-1/3 sm:w-auto"
                  >
                    +
                  </button>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={addToCartHandler}
                  className="w-full sm:flex-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FaShoppingCart />
                  <span className="truncate">
                    Add to Cart — ₦{(sale.discountPrice * count).toFixed(2)}
                  </span>
                </button>
              </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <FaTag className="text-red-500 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-800">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedSales?.slice(0, 10).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Review Modal */}
      <Modal open={isReviewModalOpen} onClose={closeReviewModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-medium">Rating:</span>
            {[1, 2, 3, 4, 5].map((r) => (
              <FaStar
                key={r}
                className={`cursor-pointer text-3xl transition ${
                  review.rating >= r ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => setReview((prev) => ({ ...prev, rating: r }))}
              />
            ))}
          </div>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your review"
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            sx={{ mb: 3 }}
          />
          <div className="flex justify-end gap-2">
            <Button onClick={closeReviewModal} variant="outlined">
              Cancel
            </Button>
            <Button onClick={submitReview} variant="contained" color="primary">
              Submit
            </Button>
          </div>
        </Box>
      </Modal>

      <Footer />
    </>
  );
};

export async function getServerSideProps({ params }) {
  const { id } = params;
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const saleRes = await axios.get(`${baseURL}/api/sales/${id}`);
    const sale = saleRes.data.sale;
    if (!sale) return { notFound: true };

    const relRes = await axios.get(
      `${baseURL}/api/sales?subSubCategory=${encodeURIComponent(sale.subSubCategory)}`
    );
    const relatedSales = (relRes.data.sales || []).filter((s) => s._id !== id);

    return { props: { sale, relatedSales } };
  } catch (error) {
    console.error("Failed to fetch sale:", error.message);
    return { notFound: true };
  }
}

export default SaleProductDetails;