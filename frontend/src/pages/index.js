import 'tailwindcss/tailwind.css';
import React from 'react';
import axios from 'axios';

import dynamic from "next/dynamic";

const HeaderPromo = dynamic(() => import('@/components/layout/HeaderPromo'));
const Header = dynamic(() => import('@/components/layout/Header'));
const HeroPage = dynamic(() => import('@/components/routes/HeroPage'), { ssr: false });
const Categories = dynamic(() => import('@/components/routes/Categories'));
const TopSellers = dynamic(() => import('@/components/routes/Sellers'), { ssr: false });
const Brands      = dynamic(() => import('@/components/routes/Brands'));
const Sponsored = dynamic(() => import('@/components/routes/Sponsored'));
const Footer = dynamic(() => import('@/components/layout/Footer'));


const HomePage = ({ products, categories, vendors, sales, brands }) => {
  return (
    <div className="overflow-x-hidden">
      <HeaderPromo />
      <Header activeHeading={1} products={products} categories={categories} />
      <HeroPage /> 
      <Categories categories={categories} />
      <TopSellers vendors={vendors} />
      <Brands brands={brands} />
      <Sponsored />
      <Footer />  
    </div>
  );
};

export async function getServerSideProps() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const [productsRes, categoriesRes, vendorsRes, salesRes, brandsRes] = await Promise.all([
      axios.get(`${baseURL}/api/products`).catch(err => { console.error("Products Error:", err); return null; }),
      axios.get(`${baseURL}/api/categories`).catch(err => { console.error("Categories Error:", err); return null; }),
      axios.get(`${baseURL}/api/vendors`).catch(err => { console.error("Vendors Error:", err); return null; }),
      axios.get(`${baseURL}/api/sales`).catch(err => { console.error("Sales Error:", err); return null; }),
      axios.get(`${baseURL}/api/brands`).catch((err) => { console.error("Brands Error:", err); return null; }),
    ]);

    return {
      props: {
        products: productsRes?.data?.products || [],
        categories: categoriesRes?.data?.categories || [],
        vendors: vendorsRes?.data?.vendors || [],
        sales: salesRes?.data?.sales || [],
        brands: brandsRes?.data?.brands || [],
      },
    };
  } catch (error) {
    
    return {
      props: {
        products: [],
        categories: [],
        vendors: [],
        sales: [],
        brands: [],
      },
    };
  }
}


export default HomePage;

