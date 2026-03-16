import { useState } from "react";
import type { FC, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";



type FormData = {
  name: string;
  email: string;
  password: string;
};

const Signup: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#352323]">
      <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-1 text-center">Sign up</h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Start your 30-day free trial.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pr-10 text-sm focus:border-[#d28585] focus:outline-none"
             
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pr-10 text-sm focus:border-[#d28585] focus:outline-none"
              
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pr-10 text-sm focus:border-[#d28585] focus:outline-none"
             
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters.
            </p>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-[#C47623] text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Create account
          </button>
        </form>

        <div className="mt-4 space-y-3">

          

        </div>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to ="/Login" className="text-[#C47623] font-medium">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
