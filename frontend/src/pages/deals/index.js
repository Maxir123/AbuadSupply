import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import axios from "axios";

import ProductCard from "@/components/product/ProductCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/vendor/layout/Loader";
import { getAllSales } from "@/redux/slices/saleSlice";

/**
 * Filter out expired sales
 * @param {Array} products - List of sale products
 * @returns {Array} Only products with saleEnd date >= today
 */
const getActiveSales = (products) => {
  const now = new Date();
  return products?.filter((product) => new Date(product.saleEnd) >= now) ?? [];
};

const SaleProductsPage = ({ categories }) => {
  const dispatch = useDispatch();
  const { sales, isLoading, error } = useSelector((state) => state.sales);

  useEffect(() => {
    dispatch(getAllSales());
  }, [dispatch]);

  const activeSales = useMemo(() => getActiveSales(sales), [sales]);

  // Render different states
  if (isLoading) return <Loader />;
  
  if (error) {
    return (
      <>
        <Header activeHeading={4} categories={categories} />
        <main className="flex-1 mx-auto w-full max-w-[1600px] px-4 my-8">
          <div className="text-center text-red-500 bg-red-50 p-6 rounded-lg">
            <p className="font-semibold">Something went wrong</p>
            <p className="text-sm">{error}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Sale - Huge Discounts!</title>
        <meta
          name="description"
          content="Browse our flash sale products and grab your favorites at discounted prices!"
        />
      </Head>

      <div className="flex flex-col min-h-screen">
        <Header activeHeading={4} categories={categories} />

        <main className="flex-1 mx-auto w-full max-w-[1600px] px-2 sm:px-4 lg:px-10 my-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              🔥 Flash Sale 🔥
            </h1>
           <Head>
          <title>Deals – Limited Time Offers</title>
          <meta name="description" content="Don&apos;t miss out on our best deals!" />
        </Head>
          </div>
          <hr className="mb-8 border-gray-200" />

          {activeSales.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No active sales right now.</p>
              <p className="text-sm text-gray-300 mt-1">Check back soon for new deals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
              {activeSales.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isSale
                  saleEndDate={product.saleEnd}
                />
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

// Fetch categories on the server
export async function getServerSideProps() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const { data } = await axios.get(`${API_BASE}/api/categories`);
    return {
      props: {
        categories: data?.categories ?? [],
      },
    };
  } catch (err) {
    console.error("Failed to load categories:", err.message);
    return {
      props: { categories: [] },
    };
  }
}

export default SaleProductsPage;