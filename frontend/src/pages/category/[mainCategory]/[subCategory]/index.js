import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { capitalizeWords } from "@/lib/utils";

import Head from "next/head";
import axios from "axios";
import HeaderPromo from "@/components/layout/HeaderPromo";
import Image from "next/image";

const SubCategoryPage = ({ categories, subSubcategories }) => {
  const fallbackImage = "/images/category-placeholder.png";

  const router = useRouter();
  const { mainCategory, subCategory } = router.query;

  return (
    <>
      <Head>
        <title>{capitalizeWords(subCategory || "Subcategory")} | HornCart</title>
        <meta
          name="description"
          content={`Discover items under ${capitalizeWords(subCategory || "subcategory")} in our ${capitalizeWords(mainCategory || "")} category.`}
        />
      </Head>

      <div className="min-h-screen flex flex-col">
        <HeaderPromo />
        <Header categories={categories} />
        <div className="flex-grow py-8 container mx-auto px-4 sm:pb-20 md:pb-28">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: mainCategory, href: `/category/${mainCategory}` },
              { label: subCategory },
            ]}
          />

          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {subCategory ? capitalizeWords(subCategory) : "Unknown Sub-Subcategory"}
          </h1>

          {subSubcategories?.length > 0 ? (
            <div className="relative overflow-x-auto">
              <div className="flex flex-nowrap gap-6 items-center justify-center md:justify-start">
                {subSubcategories.map((subSubCat) => (
                  <div
                    key={subSubCat._id}
                    className="flex flex-col items-center text-center flex-shrink-0"
                  >
                    <Link
                      href={`/category/${mainCategory}/${subCategory}/${subSubCat.slug}`}
                      passHref
                      legacyBehavior
                    >
                      <a className="cursor-pointer">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-white flex items-center justify-center">
                          <Image
                            src={ subSubCat.imageUrl || fallbackImage}
                            alt={subSubCat.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-20 md:h-20 object-contain"
                          />
                        </div>
                        <p className="text-[10px] sm:text-xs md:text-sm font-medium mt-2 truncate">{subSubCat.name}</p>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center mt-4">No sub-subcategories available.</p>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const { mainCategory, subCategory } = context.params;
    console.log("Query Params in getServerSideProps:", context.query);
    try {
      const [categoriesRes, subcategoriesRes, subSubcategoriesRes] = await Promise.all([
        axios.get(`${baseURL}/api/categories`).catch(err => { console.error("Categories Error:", err); return null; }),
        axios.get(`${baseURL}/api/subcategories?categorySlug=${mainCategory}`).catch(err => { console.error("Sub Categories Error:", err); return null; }),
        axios.get(`${baseURL}/api/sub-subcategories?subCategorySlug=${subCategory}`).catch(err => { console.error("Sub Sub-Categories Error:", err); return null; }),
      ]);
  
      return {
        props: {
          categories: categoriesRes.data.categories || [],
          subcategories: subcategoriesRes.data.subcategories || [],
          subSubcategories: subSubcategoriesRes.data.subSubcategories || [],
        },
      };
    } catch (error) {
      console.error("Error fetching data:", error.message);
  
      return {
        props: {
          categories: [],
          subcategories: [],
          subSubcategories: [],
        },
      };
    }
  }
  


export default SubCategoryPage;
