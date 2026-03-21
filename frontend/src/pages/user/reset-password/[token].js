import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { resetUserPassword } from "@/redux/slices/userSlice"; // ✅

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;
  const dispatch = useDispatch();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    if (token) setTokenReady(true);
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const result = await dispatch(resetUserPassword({ token, password: newPassword }));
      if (resetUserPassword.fulfilled.match(result)) {
        toast.success(result.payload.message);
        router.push("/user/login");
      } else {
        toast.error(result.payload);
      }
    } catch (error) {
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenReady) return null;

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold text-center mb-6">
            Reset Your Password
          </h2>
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

export default ResetPassword;
