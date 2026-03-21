'use client';

import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { RxAvatar } from 'react-icons/rx';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { registerAdmin } from '@/redux/adminSlice';

const AdminSignUp = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { adminInfo, success, error } = useSelector((state) => state.admin);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (success || adminInfo) {
      toast.success(adminInfo?.message || 'Admin registered successfully');
      router.push('/admin/dashboard'); 
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, router, adminInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !avatar || !phoneNumber) {
      toast.error('All fields must be filled');
      return;
    }

    const adminData = { name, email, password, phoneNumber, avatar };
    dispatch(registerAdmin(adminData));

    // Reset form fields (optional)
    setName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setAvatar(null);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Registration
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={visible ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                Avatar
              </label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {avatar ? (
                    <Image
                      src={avatar}                
                      alt="Avatar preview"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                      unoptimized                 
                      priority
                    />
                  ) : (
                    <RxAvatar className="h-8 w-8" />
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="ml-5 px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <span>Upload</span>
                  <input
                    type="file"
                    id="file-input"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-500"
            >
              Register as Admin
            </button>
          </form>

          <div className="mt-6 text-center" >
            <Link href="/admin/login" legacyBehavior>
              <a className="text-sm text-blue-600 hover:text-blue-500" >
                Already have an account? Login
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignUp;
