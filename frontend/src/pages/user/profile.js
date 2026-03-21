import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import ProfileSideBar from '@/components/user/layout/ProfileSideBar';
import ProfileContent from '@/components/user/profile/ProfileContent';
import withUserAuth from '@/lib/withUserAuth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '@/redux/slices/categorySlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 bg-gray-100">
        <div className="w-0 md:w-[100px] lg:w-[330px] bg-white shrink-0">
          <ProfileSideBar active={1} />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <ProfileContent />
        </div>
      </div>
    </div>
  );
};

export default withUserAuth(ProfilePage);