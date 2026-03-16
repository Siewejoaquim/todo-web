import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "./api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface LoginInfo {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
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
        // ✅ Store token and user info
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("user", JSON.stringify(response.user));

        toast.success("Login successful!");
        navigate("/Dash"); // Navigate to dashboard
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
    <div className="min-h-screen bg-[#352323] flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-serif text-center mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-8">
          Enter your email and password to access your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pr-10 text-sm focus:border-[#d28585] focus:outline-none"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                })}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* REMEMBER & FORGOT */}
          <div className="flex justify-between items-center mb-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#" className="text-gray-600 hover:underline">
              Forgot Password
            </a>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#C47623] text-white py-3 rounded-md font-medium hover:bg-gray-900 transition"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm mt-8 text-gray-600">
          Don't have an account?{" "}
          <Link to="/" className="font-semibold text-black">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
