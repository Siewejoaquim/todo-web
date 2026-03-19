import type { FC } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { registerUser } from "./api";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import "react-toastify/dist/ReactToastify.css";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const Signup: FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<FormData>();

  /* SUCCESS SUBMIT */

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await registerUser(data);

      toast.success("Account created successfully 🎉");

      reset();

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(error);
      toast.error("Unable to create account ❌");
    }
  };

  /* FORM VALIDATION ERROR */

  const onError: SubmitErrorHandler<FormData> = (errors) => {

    if (errors.name) {
      toast.error(errors.name.message);
    }

    if (errors.email) {
      toast.error(errors.email.message);
    }

    if (errors.password) {
      toast.error(errors.password.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#C47623]">

      <ToastContainer position="top-right" autoClose={2000} />

      <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow">

        <h1 className="text-2xl font-semibold mb-1 text-center">Sign up</h1>

        <p className="text-gray-500 text-center text-sm mb-6">
          Start your 30-day free trial.
        </p>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">

          {/* NAME */}

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 4,
                  message: "Name must be at least 4 characters",
                },
              })}
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#d28585] focus:outline-none"
            />
          </div>

          {/* EMAIL */}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email like name@example.com",
                },
              })}
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#d28585] focus:outline-none"
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                    message:
                      "Password must include uppercase, lowercase, number and special character",
                  },
                })}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pr-10 text-sm focus:border-[#d28585] focus:outline-none"
              />

              {/* SHOW / HIDE PASSWORD */}

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </span>

            </div>

            <p className="text-xs text-gray-500 mt-1">
              Must contain uppercase, lowercase, number and special character.
            </p>

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-[#C47623] text-white py-2 rounded-md font-medium hover:bg-black transition"
          >
            {isSubmitting ? "Submitting..." : "Create account"}
          </button>

        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#C47623] font-medium">
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
