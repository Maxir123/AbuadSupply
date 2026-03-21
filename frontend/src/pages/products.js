// pages/products.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ProductCard from '@/components/product/ProductCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Loader from '@/components/vendor/layout/Loader';
import { getAllProducts } from '@/redux/slices/productSlice';

// ⬇️ Add HeaderPromo (client-only)
const HeaderPromo = dynamic(() => import('@/components/layout/HeaderPromo'), {
  ssr: false,
});

const ProductsPage = ({ categories }) => {
  const dispatch = useDispatch();
  const { allProducts, isLoading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Products</title>
        <meta name="description" content="Browse our product catalog" />
      </Head>

      <div className="overflow-x-hidden">
        {/* Promo bar with currency selector */}
        <HeaderPromo />

        {/* Keep active nav highlight on Products */}
        <Header activeHeading={2} categories={categories} />

        <main className="mx-auto w-full max-w-[1600px] px-2 sm:px-4 lg:px-10 my-8">
          <hr className="mt-5 mb-2" />
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6">All Products</h2>

            {isLoading ? (
              <Loader />
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allProducts?.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

// Fetch categories for header
export async function getServerSideProps() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const categoriesRes = await axios.get(`${baseURL}/api/categories`);
    return { props: { categories: categoriesRes?.data?.categories || [] } };
  } catch {
    return { props: { categories: [] } };
  }
}

export default ProductsPage;
