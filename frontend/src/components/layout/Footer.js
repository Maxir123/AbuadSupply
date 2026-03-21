import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      {/* Top social bar – fresh green gradient */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-4 px-4 sm:px-6 lg:px-8 border-b border-green-200">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-sm font-medium text-gray-700 tracking-wide">
            📱 Connect with us on social networks
          </span>
          <div className="flex space-x-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="text-gray-600 hover:text-white hover:bg-green-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Abuad Supply"
                width={140}
                height={48}
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your campus delivery partner – fast, reliable, and always on time.
              We bring your favorite products right to your doorstep.
            </p>
          </div>

          {/* Products – green headings */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600 relative inline-block">
              Products
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-700 rounded-full"></span>
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Flash Deals', href: '/dealsw' },
                { label: 'Latest Products', href: '/products?filter=latest' },
                { label: 'Best Selling', href: '/best-sellers' },
                { label: 'Sell on Abuad', href: '/vendor/dashboard' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-green-600 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 group-hover:bg-green-600 transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600 relative inline-block">
              Useful Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-700 rounded-full"></span>
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Your Account', href: '/user/profile' },
                { label: 'Track Order', href: '/track-order' },
                { label: 'Refund Policy', href: '/faq' },
                { label: 'Help Center', href: '/support' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-green-600 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 group-hover:bg-green-600 transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact – green icon backgrounds */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600 relative inline-block">
              Contact
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-700 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FaMapMarkerAlt className="text-green-600 w-4 h-4" />
                </div>
                <span>Abuad, Nigeria</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FaEnvelope className="text-green-600 w-4 h-4" />
                </div>
                <span className="break-all">abuadsupply@gmail.com</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FaPhoneAlt className="text-green-600 w-4 h-4" />
                </div>
                <span>+234 903 955 7658</span>
              </li>
            </ul>
          </div>
        </div>

                {/* Newsletter section – green themed */}
        <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Text */}
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-gray-800">
                Subscribe to our newsletter
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Get the latest deals and campus updates straight to your inbox.
              </p>
            </div>

            {/* Input + Button */}
            <div className="flex flex-col sm:flex-row w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-64 px-4 py-2 border border-gray-300 
                sm:rounded-l-lg rounded-lg sm:rounded-r-none 
                focus:outline-none focus:ring-2 focus:ring-green-500 
                focus:border-transparent"
              />

              <button
                className="mt-2 sm:mt-0 bg-green-600 hover:bg-green-700 text-white 
                px-5 py-2 sm:rounded-r-lg rounded-lg sm:rounded-l-none 
                transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaPaperPlane className="w-4 h-4" />
                <span>Subscribe</span>
              </button>
            </div>

          </div>
        </div>
     </div>

      {/* Bottom copyright – green hover */}
      <div className="bg-gray-100 py-4 px-4 sm:px-6 lg:px-8 border-t border-green-200">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Abuad Supply. All rights reserved.</span>
          <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-green-600 transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-green-600 transition-colors duration-200">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;