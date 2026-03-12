import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function Login() {
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      email,
      password,
      remember,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#352323] px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        
    
        <h1 className="text-center text-4xl font-serif font-semibold text-gray-900">
          Welcome Back
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          Enter your email and password to access your account
        </p>

       
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

        
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#d28585] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

     
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pr-10 text-sm focus:border-[#d28585] focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

             
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

       
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4"
              />
              Remember me
            </label>

            <a
              href="#"
              className="text-gray-500 hover:text-black"
            >
              Forgot Password
            </a>
          </div>

          
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-[#C47623] py-2.5 text-white font-medium hover:bg-gray-900"
          >
            Sign In
          </button>

        </form>

     
        <p className="mt-8 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link to="/" className="font-medium text-[#C47623]">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}