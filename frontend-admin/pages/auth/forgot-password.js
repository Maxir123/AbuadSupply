import React, { useState } from "react";
import { toast } from "react-toastify";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { forgotAdminPassword } from "@/redux/adminSlice";

const AdminForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    try {
      setLoading(true);
      const result = await dispatch(forgotAdminPassword(email));
      if (result.type.includes("fulfilled")) {
        toast.success("Password reset email sent.");
        setEmail("");
      } else {
        toast.error(result.payload || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Forgot Password</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Forgot your admin password?
          </h2>
          <p className="text-sm text-center text-gray-600 mb-6">
            Enter your email to receive a reset link.
          </p>
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminForgotPassword;
