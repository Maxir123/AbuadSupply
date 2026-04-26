import React from "react";

const FEATURES = [
  { id: 1, icon: "🚚", title: "FREE DELIVERY", description: "On orders over ₦40,000" },
  { id: 2, icon: "↩️", title: "EASY RETURNS", description: "30-day return policy" },
  { id: 3, icon: "🛡️", title: "SECURE PAYMENT", description: "100% secure payment" },
  { id: 4, icon: "🎧", title: "24/7 SUPPORT", description: "Dedicated support" },
];

const FeatureBar = () => {
  return (
    <div className="max-w-7xl mx-auto px-2 pt-1 pb-1">
      {/* Grid: 2 cols on mobile → 4 on desktop, reduced gap */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {FEATURES.map((feature, idx) => (
          <div
            key={feature.id}
            className="bg-white/95 backdrop-blur-sm p-2 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center group"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            {/* Icon with native Tailwind transition */}
            <div className="relative mx-auto mb-1 h-10 w-10 sm:h-14 sm:w-14 md:h-16 md:w-16 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full transition-transform duration-300 group-hover:scale-110">
              {feature.icon}
            </div>

            <p className="text-gray-800 font-bold text-[10px] sm:text-xs md:text-sm mt-0.5">
              {feature.title}
            </p>
            <p className="text-gray-500 text-[9px] sm:text-[11px] md:text-xs">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureBar;