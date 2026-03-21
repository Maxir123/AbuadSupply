import React, { useState } from "react";
import { toast } from "react-toastify";
import Head from "next/head";
import Link from "next/link";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset link sent to your email.");
        setEmail("");
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Forgot your password?
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Enter your email below and we’ll send you a link to reset your password.
          </p>

          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-500">
            Remember your password?{" "}
            <Link href="/user/login/" className="text-blue-600 ...">Back to login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
