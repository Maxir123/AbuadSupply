// pages/vendor/reset-password/[token].js
import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { resetVendorPassword } from "@/redux/slices/vendorSlice";

const VendorResetPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill out all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const result = await dispatch(
        resetVendorPassword({ token, newPassword, confirmPassword })
      );

      if (resetVendorPassword.fulfilled.match(result)) {
        toast.success(result.payload.message || "Password reset successfully!");
        router.push("/vendor/login");
      } else {
        toast.error(result.payload || "Password reset failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Vendor Password</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default VendorResetPassword;
