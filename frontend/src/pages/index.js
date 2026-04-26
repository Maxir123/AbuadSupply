import 'tailwindcss/tailwind.css';
import React from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import FeatureBar from '@/components/routes/FeatureBar';

// Lazy load components
const HeaderPromo = dynamic(() => import('@/components/layout/HeaderPromo'));
const Header = dynamic(() => import('@/components/layout/Header'));
const HeroPage = dynamic(() => import('@/components/routes/HeroPage'), { ssr: false });
const Categories = dynamic(() => import('@/components/routes/Categories'));
const TopSellers = dynamic(() => import('@/components/routes/Sellers'), { ssr: false });
const Brands = dynamic(() => import('@/components/routes/Brands'));
const Sponsored = dynamic(() => import('@/components/routes/Sponsored'));
const Footer = dynamic(() => import('@/components/layout/Footer'));

const HomePage = ({
  products,
  categories,
  vendors,
  sales,
  brands,
  dealProduct,
  bestSellersProducts,
  newarrivalsProducts,
}) => {
  return (
    <div className="overflow-x-hidden">
      <HeaderPromo />

      <Header
        activeHeading={1}
        products={products}
        categories={categories}
      />

      <HeroPage />

      <FeatureBar />

      <Categories
        categories={categories}
        dealProduct={dealProduct}
        bestSellersProducts={bestSellersProducts}
        newarrivalsProducts={newarrivalsProducts}
      />

      <TopSellers vendors={vendors} />

      <Brands brands={brands} />

      <Sponsored />

      <Footer />
    </div>
  );
};

export async function getServerSideProps() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  try {
    const [productsRes, categoriesRes, vendorsRes, salesRes, brandsRes] =
      await Promise.all([
        axios.get(`${baseURL}/api/products`).catch(() => null),
        axios.get(`${baseURL}/api/categories`).catch(() => null),
        axios.get(`${baseURL}/api/vendors`).catch(() => null),
        axios.get(`${baseURL}/api/sales`).catch(() => null),
        axios.get(`${baseURL}/api/brands`).catch(() => null),
      ]);

    const allProducts = productsRes?.data?.products || [];
    const allSales = salesRes?.data?.sales || [0];

    // Deals come from the Sale model
    const dealProduct = allSales;

    // Best sellers based on rating and number of reviews
    const bestSellersProducts = [...allProducts]
      .sort((a, b) => {
        const scoreA = (a.rating || 0) * (a.numReviews || 0);
        const scoreB = (b.rating || 0) * (b.numReviews || 0);
        return scoreB - scoreA;
      })
      .slice(0, 10);

    // New arrivals based on createdAt
    const newarrivalsProducts = [...allProducts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    return {
      props: {
        products: allProducts,
        categories: categoriesRes?.data?.categories || [],
        vendors: vendorsRes?.data?.vendors || [],
        sales: allSales,
        brands: brandsRes?.data?.brands || [],
        dealProduct,
        bestSellersProducts,
        newarrivalsProducts,
      },
    };
  } catch (error) {
    console.error('Server Error:', error);

    return {
      props: {
        products: [],
        categories: [],
        vendors: [],
        sales: [],
        brands: [],
        dealProduct: [],
        bestSellersProducts: [],
        newarrivalsProducts: [],
      },
    };
  }
}

export default HomePage;

