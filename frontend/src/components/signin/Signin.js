import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { loginUser } from "@/redux/slices/userSlice";
import { toast } from "react-toastify";
import Router, { useRouter } from "next/router";

import { getSession, signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { error } = router.query;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { email, password };
      const result = await dispatch(loginUser(userData));

      if (result.type === "user/loginUser/fulfilled") {
        if (rememberMe) {
          localStorage.setItem("userInfo", JSON.stringify(result.payload.user));
        } else {
          sessionStorage.setItem("userInfo", JSON.stringify(result.payload.user));
        }
        toast.success(result.payload.message || "Login successful!");
        Router.push("/user/profile");
      } else if (result.type === "user/loginUser/rejected") {
        toast.error(result.payload || "Login failed");
      }          
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    const syncGoogleUser = async () => {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) return; // prevent re-sync if already logged in

      const session = await getSession(); // from next-auth/react
      if (session?.user?.email) {
        try {
          // const res = await fetch( "/api/users/google-login", {
            const res = await fetch("/api/users/google-login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
              }),
            }
          );
          const data = await res.json();

          if (data.success) {
            dispatch({
              type: "user/loginUser/fulfilled",
              payload: { user: data.user },
            });
            localStorage.setItem("userInfo", JSON.stringify(data.user));
            router.push("/user/profile");
          }
        } catch (error) {
          console.error("Google login sync failed:", error);
        }
      }
    };

    syncGoogleUser();
  }, [dispatch, router]);

  return (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-8 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login to your account
        </h2>
      </div>
      {/* // later in JSX: */}
      {error && (
        <p className="text-red-500 text-sm text-center mb-2">
          Google sign-in failed. Please try again.
        </p>
      )}
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
                  htmlFor="exampleCheck3"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/user/forgot-password"
                className="text-blue-700 transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
              >
                Forgot password?
              </Link>
            </div>
            <div>
              <button className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                Sign in
              </button>
            </div>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/user/profile" })}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition-all"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          <p className="mt-12 text-s font-light text-center">
            {" "}
            Don&apos;t have an account?{" "}
            <Link
              href="/user/register"
              className="font-medium text-blue-600 dark:text-gray-200 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
