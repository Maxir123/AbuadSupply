import { RxPerson } from 'react-icons/rx';
import { AiOutlineMessage, AiOutlineLogout } from 'react-icons/ai';
import { MdPayment, MdOutlineTrackChanges } from 'react-icons/md';
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from 'react-icons/hi';
import { TbAddressBook } from 'react-icons/tb';
import { RiLockPasswordLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
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
  const scrollRef = useRef(null);
  const [showHint, setShowHint] = useState(true);

  // Hide scroll hint after first scroll or after 5 seconds
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
    toast.success('User logged out');
    router.push('/user/login');
  };

  return (
    <>
      {/* ================= MOBILE BOTTOM NAVBAR (scrollable with hint) ================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg z-50 safe-bottom">
        {/* Scroll container */}
        <div
          ref={scrollRef}
          className={`flex overflow-x-auto no-scrollbar px-2 py-2 gap-2 justify-start relative ${showHint ? 'scroll-hint' : 'no-fade'}`}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <Link href={item.link} key={item.id}>
                <div
                  className={`flex flex-col items-center justify-center text-xs min-w-[60px] transition-all duration-200 
                    ${isActive ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Icon size={22} className="transition-transform duration-200 group-hover:scale-105" />
                  <span className="mt-1 text-[11px] font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute -top-[2px] w-6 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </div>
              </Link>
            );
          })}
          {/* Logout */}
          <div
            onClick={logoutHandler}
            className="flex flex-col items-center justify-center text-xs cursor-pointer transition-all duration-200 text-gray-400 hover:text-rose-500 min-w-[60px]"
          >
            <AiOutlineLogout size={22} />
            <span className="mt-1 text-[11px] font-medium">Logout</span>
          </div>
        </div>

        {/* Optional: small pulsing arrow hint (disappears after scroll/timeout) */}
        {showHint && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none pulse-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        )}
      </div>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:flex flex-col justify-between w-full h-full bg-white rounded-2xl shadow-lg border border-gray-100/80 p-5 transition-all">
        {/* Optional: User summary */}
        <div className="mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-semibold shadow-sm">
              U
            </div>
            <div>
              <p className="font-semibold text-gray-800">Welcome back!</p>
              <p className="text-xs text-gray-500">Your account</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <Link href={item.link} key={item.id}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <Icon size={20} className={`transition-transform duration-200 ${isActive ? 'scale-105' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <div
          onClick={logoutHandler}
          className="flex items-center gap-3 px-3 py-2.5 mt-6 border-t border-gray-100 pt-5 cursor-pointer rounded-xl transition-all duration-200 text-gray-600 hover:text-rose-600 hover:bg-rose-50 group"
        >
          <AiOutlineLogout size={20} className="transition-transform group-hover:-translate-x-0.5" />
          <span className="text-sm font-medium">Logout</span>
        </div>
      </div>
    </>
  );
};

export default ProfileSideBar;