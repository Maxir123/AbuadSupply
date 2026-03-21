import React from 'react';
import Header from '@/components/layout/Header';
import ProfileSideBar from '@/components/user/layout/ProfileSideBar';
import Inbox from '@/components/user/Inbox';

const InboxPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 bg-gray-100">
        <div className="w-0 md:w-[100px] lg:w-[330px] bg-white shrink-0">
          <ProfileSideBar active={5} />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <Inbox />
        </div>
      </div>
    </div>
  );
};

export default InboxPage;