import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BestSellers from '@/components/routes/BestSellers';
import axios from 'axios';

const BestSellersPage = ({ categories }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header activeHeading={2} categories={categories} />
      <main className="flex-grow">
        <BestSellers />
      </main>
      <Footer />
    </div>
  );
};

export async function getServerSideProps() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const categoriesRes = await axios.get(`${baseURL}/api/categories`);

    return {
      props: {
        categories: categoriesRes?.data?.categories || [],
      },
    };
  } catch (error) {
    console.error("Failed to fetch categories:", error.message);
    return {
      props: {
        categories: [],
      },
    };
  }
}

export default BestSellersPage;
