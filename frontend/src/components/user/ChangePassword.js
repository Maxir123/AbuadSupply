// Third-party library imports
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Local imports
import { changePassword } from '@/redux/slices/userSlice';
import styles from '@/styles/styles';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

  const passwordChangeHandler = async (e) => {
    e.preventDefault();
    const result = await dispatch(changePassword({ oldPassword, newPassword, confirmPassword }));

    if (result.type === 'user/changePassword/fulfilled') {
      toast.success(result.payload.message);
    } else if (result.type === 'user/changePassword/rejected') {
      toast.error(result.payload);
    }

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12m-6 0v-4m0 4h-4m4 0h4M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
          <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure</p>
        </div>

        {/* Form */}
        <form onSubmit={passwordChangeHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              className={`${styles.input} w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter your current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className={`${styles.input} w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              className={`${styles.input} w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;