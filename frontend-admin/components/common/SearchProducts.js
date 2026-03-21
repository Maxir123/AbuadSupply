import React from "react";

const SearchProducts = ({ searchQuery, handleSearchChange }) => (
  <div className="flex items-center w-full md:w-1/2 mb-2 md:mb-0">
    <div className="relative w-full">
      <input
        className="w-full p-2 border border-gray-300 rounded pr-10"
        placeholder="Search by Product Name"
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
        <i className="fas fa-search text-gray-500"></i>
      </span>
    </div>
    <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
      Search
    </button>
  </div>
);

export default SearchProducts;
