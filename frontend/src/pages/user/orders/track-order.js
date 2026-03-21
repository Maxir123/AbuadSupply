import React from 'react';
import Header from '@/components/layout/Header';
import OrderTracker from '@/components/user/OrderTracker';
import ProfileSideBar from '@/components/user/layout/ProfileSideBar';
import withUserAuth from '@/lib/withUserAuth';

const TrackOrder = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden bg-gray-100">
        <div className="w-0 md:w-[100px] lg:w-[330px] bg-white shrink-0">
          <ProfileSideBar active={3} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <OrderTracker />
        </div>
      </div>
    </div>
  );
};

export default withUserAuth(TrackOrder);