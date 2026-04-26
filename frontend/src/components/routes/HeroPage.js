import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const bannerData = [
  {
    src: "/images/bannerImgOne.png",
    eyebrow: "DEALS OF THE DAY",
    title: "Shop the Best Deals Today",
    subtitle: "Top brands. Low prices. Fast delivery.",
    buttonText: "Shop Now",
    link: "/category/gadgets-electronics",
    bg: "from-amber-200 via-yellow-300 to-orange-400",
    text: "text-slate-900",
    badgeBg: "bg-amber-300/90",
  },
  {
    src: "/images/bannerImgThree.jpg",
    eyebrow: "NEW ARRIVALS",
    title: "New Arrivals. Better Choices.",
    subtitle: "Explore the latest trends in tech, fashion, home & more.",
    buttonText: "Explore Now",
    link: "/categories",
    bg: "from-sky-100 via-blue-200 to-cyan-200",
    text: "text-slate-900",
    badgeBg: "bg-sky-300/90",
  },
  {
    src: "/images/bannerImgFour.jpg",
    eyebrow: "HOME & LIVING",
    title: "Refresh Your Space, Elevate Your Life.",
    subtitle: "Stylish home essentials for every corner of your home.",
    buttonText: "Shop Home & Living",
    link: "/category/home-living",
    bg: "from-lime-100 via-emerald-100 to-green-200",
    text: "text-emerald-950",
    badgeBg: "bg-lime-300/90",
  },
];

const PrevArrow = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Previous slide"
    className="absolute left-4 md:left-8 top-1/2 z-20 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-105"
  >
    <span className="text-2xl leading-none text-slate-800">‹</span>
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Next slide"
    className="absolute right-4 md:right-8 top-1/2 z-20 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-105"
  >
    <span className="text-2xl leading-none text-slate-800">›</span>
  </button>
);

const HeroPage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const router = useRouter();

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5500,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    beforeChange: (_, next) => setActiveSlide(next),
    customPaging: (i) => (
      <button
        className={`transition-all duration-300 rounded-full ${
          i === activeSlide
            ? "w-7 bg-slate-800"
            : "w-2.5 bg-slate-400/70 hover:bg-slate-600/80"
        } h-2.5`}
        aria-label={`Go to slide ${i + 1}`}
      />
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  const handleButtonClick = (link) => {
    router.push(link);
  };

  return (
    <div className="w-full overflow-hidden">
      <style jsx global>{`
        .slick-dots {
          position: relative;
          bottom: 0;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .slick-dots li {
          margin: 0 4px;
          width: auto;
          height: auto;
        }
        .slick-dots li button {
          display: none;
        }
        .slick-dots li.slick-active button {
          display: none;
        }
        @media (min-width: 768px) {
          .slick-dots {
            margin-top: 1.25rem;
            margin-bottom: 0.75rem;
          }
        }
      `}</style>

      <Slider {...settings}>
        {bannerData.map((item, index) => (
          <div key={index} className="outline-none">
            <section
              className={`relative w-full overflow-hidden bg-gradient-to-br ${item.bg}`}
            >
              <div className="absolute inset-0 bg-white/5" />

              <div className="relative z-10 px-4 py-6 sm:px-6 md:py-8 lg:py-10">
                <div className="mx-auto max-w-7xl">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                    {/* Text content */}
                    <div className="flex flex-col justify-center text-center md:text-left">
                      <div
                        className={`mb-3 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm md:px-3.5 md:py-1.5 md:text-sm ${item.badgeBg} ${item.text} mx-auto md:mx-0`}
                      >
                        <span className="text-sm">⚡</span>
                        <span>{item.eyebrow}</span>
                      </div>

                      <h2
                        className={`max-w-2xl text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl ${item.text}`}
                      >
                        {item.title}
                      </h2>

                      <p
                        className={`mt-3 max-w-lg text-sm leading-relaxed sm:text-base md:text-lg ${item.text}/85 mx-auto md:mx-0`}
                      >
                        {item.subtitle}
                      </p>

                      <button
                        onClick={() => handleButtonClick(item.link)}
                        className="mt-5 w-fit rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-slate-800 active:scale-95 md:mt-6 md:px-7 md:py-2.5"
                      >
                        {item.buttonText}
                      </button>
                    </div>

                    {/* Image - smaller */}
                    <div className="relative flex items-center justify-center">
                      <div className="relative h-[160px] w-full max-w-sm sm:h-[180px] md:h-[200px] lg:h-[220px]">
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          priority={index === 0}
                          className="object-contain drop-shadow-lg"
                          sizes="(max-width: 768px) 100vw, 40vw"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroPage;