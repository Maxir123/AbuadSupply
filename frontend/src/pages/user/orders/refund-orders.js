import React from 'react';
import Header from '@/components/layout/Header';
import OrdersRefund from '@/components/user/OrdersRefund';
import ProfileSideBar from '@/components/user/layout/ProfileSideBar';
import withUserAuth from '@/lib/withUserAuth';

const RefundOrdersPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden bg-gray-100">
        <div className="w-0 md:w-[100px] lg:w-[330px] bg-white shrink-0">
          <ProfileSideBar active={4} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <OrdersRefund />
        </div>
      </div>
    </div>
  );
};

export default withUserAuth(RefundOrdersPage);