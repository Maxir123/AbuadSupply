import React from "react";

const FilterProducts = ({
  mainCategory,
  subCategory,
  subSubCategory,
  selectedBrand,
  categories,
  subcategories,
  subSubcategories,
  brands,
  handleFilterReset,
  handleCategoryChange,
  handleSubCategoryChange,
  handleSubSubCategoryChange,
  handleBrandChange
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Main Category Filter */}
    <div className="flex flex-col">
      <label className="block text-gray-700">Main Category</label>
      <select
        className="w-full mt-1 p-2 border border-gray-300 rounded"
        value={mainCategory}
        onChange={handleCategoryChange}
      >
        <option value="">Select Main Category</option>
        {categories?.map((cat) => (
          <option key={cat._id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>

    {/* Sub Category Filter */}
    <div className="flex flex-col">
      <label className="block text-gray-700">Sub Category</label>
      <select
        className="w-full mt-1 p-2 border border-gray-300 rounded"
        value={subCategory}
        onChange={handleSubCategoryChange}
        disabled={!mainCategory}
      >
        <option value="">Select Sub Category</option>
        {subcategories?.map((sub) => (
          <option key={sub._id} value={sub.slug}>
            {sub.name}
          </option>
        ))}
      </select>
    </div>

    {/* Sub-Sub Category Filter */}
    <div className="flex flex-col">
      <label className="block text-gray-700">Sub-Sub Category</label>
      <select
        className="w-full mt-1 p-2 border border-gray-300 rounded"
        value={subSubCategory}
        onChange={handleSubSubCategoryChange}
        disabled={!subCategory} 
      >
        <option value="">Select Sub-Sub Category</option>
        {subSubcategories?.map((subSub) => (
          <option key={subSub._id} value={subSub.slug}>
            {subSub.name}
          </option>
        ))}
      </select>
    </div>

    {/* Brand Filter */}
    <div className="flex flex-col">
      <label className="block text-gray-700">Brand</label>
      <select
        className="w-full mt-1 p-2 border border-gray-300 rounded"
        value={selectedBrand}
        onChange={handleBrandChange}
      >
        <option value="">Select Brand</option>
        {brands?.map((brand) => (
          <option key={brand._id} value={brand.name}>
            {brand.name}
          </option>
        ))}
      </select>
    </div>

    {/* Reset Filters Button */}
    <div className="flex justify-end mt-4">
      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2" onClick={handleFilterReset}>
        Reset Filters
      </button>
    </div>
  </div>
);

export default FilterProducts;
