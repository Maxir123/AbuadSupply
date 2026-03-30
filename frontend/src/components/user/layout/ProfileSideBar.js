import { RxPerson } from 'react-icons/rx';
import { AiOutlineMessage, AiOutlineLogout, AiOutlineSearch } from 'react-icons/ai';
import { MdPayment, MdOutlineTrackChanges } from 'react-icons/md';
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from 'react-icons/hi';
import { TbAddressBook } from 'react-icons/tb';
import { RiLockPasswordLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { logoutUser } from '@/redux/slices/userSlice';

const menuItems = [
  { id: 1, icon: RxPerson, label: 'Profile', link: '/user/profile' },
  { id: 2, icon: HiOutlineShoppingBag, label: 'Orders', link: '/user/orders' },
  { id: 3, icon: MdOutlineTrackChanges, label: 'Track', link: '/user/orders/track-order' },
  { id: 4, icon: HiOutlineReceiptRefund, label: 'Refunds', link: '/user/orders/refund-orders' },
  { id: 5, icon: AiOutlineMessage, label: 'Inbox', link: '/user/inbox' },
  { id: 6, icon: RiLockPasswordLine, label: 'Password', link: '/user/change-password' },
  { id: 7, icon: TbAddressBook, label: 'Address', link: '/user/address' },
  { id: 8, icon: MdPayment, label: 'Payment', link: '/user/payment-method' },
];

const ProfileSideBar = ({ active }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.user);
  const scrollRef = useRef(null);
  const [showHint, setShowHint] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter menu items based on search term
  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    const scrollElement = scrollRef.current;
    const handleScroll = () => setShowHint(false);
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => {
        clearTimeout(timer);
        scrollElement.removeEventListener('scroll', handleScroll);
      };
    }
    return () => clearTimeout(timer);
  }, []);

  const logoutHandler = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out successfully');
    router.push('/user/login');
  };

  const userInitial = userInfo?.name?.charAt(0)?.toUpperCase() || userInfo?.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <>
      {/* ================= MOBILE BOTTOM NAVBAR ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg z-50 safe-bottom">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar px-3 py-2 gap-2"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <Link
                href={item.link}
                key={item.id}
                className="flex flex-col items-center justify-center min-w-[70px] px-1 py-1 rounded-lg transition-all duration-200 group"
              >
                <div className={`relative ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  <Icon size={22} className="transition-transform group-hover:scale-105" />
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                  )}
                </div>
                <span className={`mt-1 text-xs font-medium ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          {/* Logout button (mobile) */}
          <button
            onClick={logoutHandler}
            className="flex flex-col items-center justify-center min-w-[70px] px-1 py-1 rounded-lg transition-all duration-200 text-gray-400 hover:text-rose-500 group"
            aria-label="Logout"
          >
            <AiOutlineLogout size={22} className="transition-transform group-hover:scale-105" />
            <span className="mt-1 text-xs font-medium">Logout</span>
          </button>
        </div>
        {/* Optional fade hint (disappears after scroll/timeout) */}
        {showHint && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none animate-pulse">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        )}
      </div>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:flex flex-col w-full h-full bg-white rounded-2xl shadow-lg border border-gray-100/80 p-5 transition-all">
        {/* User summary */}
        <div className="mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
              {userInitial}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{userInfo?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{userInfo?.email || 'account@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Navigation Menu (filtered) */}
        <div className="flex-1 space-y-1">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <Link href={item.link} key={item.id}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200
                      ${isActive
                        ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Icon size={20} className={`transition-transform duration-200 ${isActive ? 'scale-105' : ''}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">
              No matching menu items
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={logoutHandler}
          className="flex items-center gap-3 px-3 py-2.5 mt-6 border-t border-gray-100 pt-5 rounded-xl transition-all duration-200 text-gray-600 hover:text-rose-600 hover:bg-rose-50 group"
          aria-label="Logout"
        >
          <AiOutlineLogout size={20} className="transition-transform group-hover:-translate-x-0.5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );
};

export default ProfileSideBar;