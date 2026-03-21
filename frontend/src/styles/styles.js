const styles = {
  // Container with max width and responsive padding
  custom_container: "w-11/12 mx-auto hidden sm:block max-w-7xl px-4 sm:px-6 lg:px-8",

  // Responsive heading with improved typography
  heading: "text-2xl sm:text-3xl md:text-4xl font-semibold font-Roboto text-center md:text-left pb-5 leading-tight",

  // Section container with consistent padding
  section: "w-11/12 mx-auto px-4 sm:px-6 lg:px-8",

  // Product title scales across breakpoints
  productTitle: "text-xl sm:text-2xl md:text-3xl font-semibold font-Roboto text-gray-800",

  // Discount price with responsive text size
  productDiscountPrice: "text-base sm:text-lg font-bold font-Roboto text-gray-800",

  // Original price (strikethrough) with negative margin adjustment
  price: "font-medium text-sm sm:text-base text-[#d55b45] pl-3 -mt-1 line-through",

  // Shop name with vertical padding
  shop_name: "py-3 text-sm sm:text-base text-blue-500 font-medium",

  // Active indicator (e.g., for navigation)
  active_indicator: "absolute -bottom-1/4 left-0 h-0.5 w-full bg-red-600",

  // General button with hover transition
  button: "w-[150px] h-10 bg-black text-white my-1 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-800 transition-colors duration-200",

  // Cart button – pill shape with hover effect
  cart_button: "px-5 h-9 sm:h-10 rounded-full bg-[#f63b60] flex items-center justify-center cursor-pointer hover:bg-[#e02e4a] transition-colors duration-200",

  // Cart button text
  cart_button_text: "text-white text-base font-semibold",

  // Input field with focus ring
  input: "w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow",

  // Online/active status dot
  activeStatus: "w-2.5 h-2.5 rounded-full absolute top-0 right-1 bg-green-500",

  // Flex utility
  normalFlex: "flex items-center"
};

export default styles;