import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "./api";
import { useAuth } from "./context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface LoginInfo {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInfo>();

  const onSubmit = async (formData: LoginInfo) => {
    try {
      const response = await loginUser(formData);
      if (response?.access_token) {
        login(response.access_token, response.user);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(response?.message || "Login failed: No token received");
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data?.message || "Login failed");
      } else if (error.request) {
        toast.error("Network error: Cannot reach server");
      } else {
        toast.error("Unexpected error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#C47623] flex items-center justify-center px-4 py-8">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-serif text-center mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-center text-sm sm:text-base mb-8">
          Enter your email and password to access your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C47623]"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm focus:border-[#C47623] focus:outline-none"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                })}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#C47623]" />
              Remember me
            </label>
            <a href="#" className="text-gray-500 hover:text-black transition">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#C47623] text-white py-3 rounded-lg font-medium hover:bg-black transition disabled:opacity-60"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-500">
          Don't have an account?{" "}
          <Link to="/" className="font-semibold text-[#C47623] hover:text-black transition">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
