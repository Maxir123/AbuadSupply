import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { debounce } from "lodash";

import HeaderBottom from "./HeaderBottom";
import HeaderUpper from "./HeaderUpper";

const Header = ({ products, categories }) => {
  const [searchData, setSearchData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [active, setActive] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    const handler = debounce(() => {
      const filteredProducts = products?.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchData(filteredProducts);
    }, 300);

    if (searchTerm) handler();

    return () => handler.cancel();
  }, [products, searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 70);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value === "") {
      setSearchData(null);
    }
  };

  return (
    <div className="w-full sticky top-0 z-50">
      {/* Sticky Header */}
      <div
        className={`w-full ${
          active ? "fixed top-0 left-0 shadow-sm z-40 bg-white" : "relative"
        }`}
      >
        <div className="hidden md:block">
          <HeaderUpper
            categories={categories}
            handleSearchChange={handleSearchChange}
            searchData={searchData}
            setSearchData={setSearchData}
          />
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebar && (
        <motion.div
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: -500, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 right-0 w-full sm:w-[350px] h-full z-50 bg-[#131921]/90 text-white"
        ></motion.div>
      )}

      {/* Bottom Header */}
      <HeaderBottom
        categories={categories}
        setActive={setActive}
        handleSearchChange={handleSearchChange}
        searchData={searchData}
        setSearchData={setSearchData}
      />
    </div>
  );
};

export default Header;