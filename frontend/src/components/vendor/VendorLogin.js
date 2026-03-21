// Third-party library imports
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { toast } from "react-toastify";
import Router from 'next/router';
import { useDispatch } from "react-redux";

// Local imports (Redux slice)
import { loginVendor } from "@/redux/slices/vendorSlice";


const VendorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { email, password };
      const result = await dispatch(loginVendor(userData));
      if (result.type === 'vendor/loginVendor/fulfilled') {
        toast.success(result.payload.message || "Login successful");
      
        if (rememberMe) {
          localStorage.setItem("vendorInfo", JSON.stringify(result.payload.vendor));
        } else {
          sessionStorage.setItem("vendorInfo", JSON.stringify(result.payload.vendor));
        }
      
        Router.push('/vendor/dashboard');
      } else {
        toast.error(result.payload || "Login failed");
      }  
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-8 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Login Your Store
      </h2>
    </div>
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
                type={visible ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
          <div className="mb-6 flex items-center justify-between">
            <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
              <input
                type="checkbox"
                name="remember-me"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem]"
              />
              <label
                className="inline-block pl-[0.15rem] hover:cursor-pointer"
                htmlFor="remember-me"
              >
                Remember me
              </label>
            </div>
            <Link href="/vendor/forgot-password/" className="text-sm ...">Forgot password?</Link>
          </div>
          <div>
            <button className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
              Sign in
            </button>
          </div>
        </form>
        <p className="mt-12 text-s font-light text-center text-gray-700">
          {" "}
          Don&apos;t have a store yet?{" "}
          <Link href="/vendor/register" className="font-medium text-blue-600 dark:text-gray-200 hover:underline">
            Register new store
          </Link>
        </p>
      </div>
    </div>

    <div className="mt-4 text-center">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 underline">
        ← Back to Home
      </Link>
    </div>

  </div>
);
};

export default VendorLogin;