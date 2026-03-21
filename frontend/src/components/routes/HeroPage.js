import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

// 1. Structured data for unique content per slide
const bannerData = [
  {
    src: "/images/bannerImgOne.png",
    discount: "Summer Sale - 30% OFF",
    title: "Upgrade Your Tech Lifestyle",
    subtitle: "Explore the latest in premium electronics and accessories.",
    buttonText: "Shop Electronics",
    color: "text-blue-400",
  },
  {
    src: "/images/bannerImgThree.jpg",
    discount: "Back to School",
    title: "Fuel Your Knowledge",
    subtitle: "Premium stationery and books to kickstart your semester.",
    buttonText: "View Collection",
    color: "text-red-500",
  },
  {
    src: "/images/bannerImgFour.jpg",
    discount: "Flash Deal: Buy 2 Get 1",
    title: "Fast Global Shipping",
    subtitle: "Delivering your favorite products right to your doorstep.",
    buttonText: "Track Orders",
    color: "text-yellow-500",
  },
];

const HeroPage = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current, next) => setActiveSlide(next),
    appendDots: (dots) => (
      <div style={{ position: "absolute", bottom: "25px" }}>
        <ul className="flex justify-center gap-2"> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          i === activeSlide ? "bg-white w-8" : "bg-white/50"
        }`}
      />
    ),
  };

  return (
    <div className="w-full relative overflow-hidden">
      <Slider {...settings}>
        {bannerData.map((item, index) => (
          <div key={index} className="outline-none">
            <div className="relative w-full h-[400px] md:h-[600px]">
              {/* Background Image */}
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              
              {/* Gradient Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

              {/* Content Container */}
              <div className="absolute inset-0 flex flex-col items-start justify-center px-10 md:px-24">
                <div className={`transition-all duration-700 transform ${
                  activeSlide === index ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}>
                  
                  <span className={`uppercase tracking-widest font-semibold text-sm md:text-base ${item.color}`}>
                    {item.discount}
                  </span>
                  
                  <h2 className="text-white text-3xl md:text-6xl font-extrabold mt-2 mb-4 max-w-lg leading-tight">
                    {item.title}
                  </h2>
                  
                  <p className="text-gray-200 text-sm md:text-lg max-w-md mb-8">
                    {item.subtitle}
                  </p>
                  
                  <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-black hover:text-white transition-colors duration-300 shadow-lg">
                    {item.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroPage;