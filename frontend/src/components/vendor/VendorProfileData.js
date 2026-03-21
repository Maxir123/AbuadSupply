import React from 'react';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaStore, FaBriefcase, FaInfoCircle, FaLink, 
  FaFacebook, FaTwitter, FaInstagram, FaGlobe 
} from 'react-icons/fa';

const VendorProfileData = ({ vendor }) => {
  // Default social link icons based on platform
  const getSocialIcon = (platform) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('facebook')) return <FaFacebook className="text-blue-600" />;
    if (platformLower.includes('twitter')) return <FaTwitter className="text-blue-400" />;
    if (platformLower.includes('instagram')) return <FaInstagram className="text-pink-500" />;
    return <FaGlobe className="text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">Vendor Profile</h2>
        <p className="text-blue-100">Detailed information about the vendor</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaUser className="text-blue-500" />
              Basic Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FaUser className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-gray-800 font-medium">{vendor.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium">{vendor.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800 font-medium">{vendor.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800 font-medium">{vendor.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaStore className="text-blue-500" />
              Business Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FaStore className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Business Name</p>
                  <p className="text-gray-800 font-medium">{vendor.businessName || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaBriefcase className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Business Type</p>
                  <p className="text-gray-800 font-medium">{vendor.businessType || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">About</p>
                  <p className="text-gray-800 font-medium">{vendor.description || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {vendor.socialLinks && vendor.socialLinks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaLink className="text-blue-500" />
              Social Links
            </h3>
            <div className="flex flex-wrap gap-4">
              {vendor.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  {getSocialIcon(link.platform)}
                  <span className="text-gray-700 font-medium">{link.platform}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProfileData;