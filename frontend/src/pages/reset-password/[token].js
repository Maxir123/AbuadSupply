import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { resetUserPassword } from "@/redux/slices/userSlice";

const UserResetPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const result = await dispatch(resetUserPassword({ token, newPassword, confirmPassword }));
      if (result.type.includes("fulfilled")) {
        toast.success("Password reset successfully");
        router.push("/admin/login");
      } else {
        toast.error(result.payload || "Failed to reset password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Admin Password</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold text-center mb-6">
            Reset Admin Password
          </h2>
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded"
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

export default UserResetPassword;
