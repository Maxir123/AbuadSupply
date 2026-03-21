import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "@/redux/adminSlice";
import { useRouter } from "next/router";
import Loader from "@/components/admin/layout/Loader";

const Login = () => {
  const { adminInfo } = useSelector((state) => state.admin);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (adminInfo && adminInfo._id) {
      router.replace("/dashboard");
    } else {
      setLoading(false); 
    }
  }, [adminInfo, router]);

  if (loading) return <Loader />;
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginAdmin({ email, password }));

      if (result.type === "admin/loginAdmin/fulfilled") {
        toast.success(result.payload.message || "Admin logged in successfully");

        if (rememberMe) {
          localStorage.setItem("adminInfo", JSON.stringify(result.payload.admin));
        } else {
          sessionStorage.setItem("adminInfo", JSON.stringify(result.payload.admin));
        }

        router.push("/dashboard");
      } else {
        toast.error(result.payload || "Login failed");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Sign in
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
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

            <div className="flex items-center justify-between mb-6">
              <div className="block min-h-[1.5rem] pl-[1.5rem]">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem]"
                />
                <label htmlFor="remember-me" className="inline-block pl-[0.15rem] hover:cursor-pointer">
                  Remember me
                </label>
              </div>
              <a
                href="/admin/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none"
            >
              Sign in
            </button>
          </form>

           {/* Demo account info */}
          <div className="mt-6 p-4 bg-gray-100 rounded-md text-sm text-gray-700">
            <p className="font-semibold text-gray-800 mb-2">Demo Admin Account:</p>
            <p><span className="font-medium">Email:</span> admin@gmail.com</p>
            <p><span className="font-medium">Password:</span> Test1234!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
