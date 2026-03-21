import React from 'react';
import Header from '@/components/layout/Header';
import AllOrders from '@/components/user/AllOrders';
import ProfileSideBar from '@/components/user/layout/ProfileSideBar';
import withUserAuth from '@/lib/withUserAuth';

const Coupons = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden bg-gray-100">
        <div className="w-0 md:w-[100px] lg:w-[330px] bg-white shrink-0">
          <ProfileSideBar active={2} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <AllOrders />
        </div>
      </div>
    </div>
  );
};

export default withUserAuth(Coupons);