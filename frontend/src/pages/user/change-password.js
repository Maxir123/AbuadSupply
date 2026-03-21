import React from 'react';
import Header from '@/components/layout/Header';
import ProfileSideBar from '@/components/user/layout/ProfileSideBar';
import ChangePassword from '@/components/user/ChangePassword';

const ChangePasswordPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 bg-gray-100">
        <div className="w-0 md:w-[100px] lg:w-[330px] bg-white shrink-0">
          <ProfileSideBar active={6} />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <ChangePassword />
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;