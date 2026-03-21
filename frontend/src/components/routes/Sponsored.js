import React from 'react';
import { FaTruck, FaRegCreditCard, FaAward } from 'react-icons/fa';
import { GiReturnArrow } from 'react-icons/gi';

const features = [
  {
    id: 1,
    icon: <FaTruck className="text-blue-600 h-8 w-8" />,
    title: 'Fast Delivery all across the country',
  },
  {
    id: 2,
    icon: <FaRegCreditCard className="text-blue-600 h-8 w-8" />,
    title: 'Safe Payment',
  },
  {
    id: 3,
    icon: <GiReturnArrow className="text-blue-600 h-8 w-8" />,
    title: '7 Days Return Policy',
  },
  {
    id: 4,
    icon: <FaAward className="text-blue-600 h-8 w-8" />,
    title: '100% Authentic Products',
  },
];

const Sponsored = () => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Optional section title – can be added if needed */}
        {/* <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          Why Shop With Us
        </h2> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ id, icon, title }) => (
            <FeatureCard key={id} icon={icon} title={title} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title }) => (
  <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 flex flex-col items-center text-center">
    <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-50 rounded-full group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
      <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
        {icon}
      </div>
    </div>
    <p className="text-gray-800 font-semibold text-sm md:text-base">
      {title}
    </p>
  </div>
);

export default Sponsored;