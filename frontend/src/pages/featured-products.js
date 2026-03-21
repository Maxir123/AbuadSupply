import { getAllProducts } from "../redux/slices/productSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/vendor/layout/Loader";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const FeaturedProductsPage = () => {
  const dispatch = useDispatch();
  const {
    allProducts: products,
    isLoading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

 
  const featuredProducts = products.filter((product) => product.isFeatured);

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Featured Products</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div>No featured products available.</div>
          )}
        </div>
        <div className="text-right mt-4">
          <Link href="/" className="text-blue-500">
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FeaturedProductsPage;
