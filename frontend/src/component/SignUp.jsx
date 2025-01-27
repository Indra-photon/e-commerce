import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function SignUp() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const create = async ({ username, email, fullname, password }) => {
    setError("");
    setLoading(true);

    const loadingToast = toast.loading("Creating your account...");
    try {
      const res = await axios.post("http://localhost:5174/api/v1/users/register", {
        username,
        email,
        fullname,
        password,
      });

      toast.dismiss(loadingToast);

      if (res.data.success) {
        toast.success(res.data.message || "Account created successfully!");
        setTimeout(() => navigate("/signin"), 2000); // Redirect to SignIn after 2 seconds
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit(create)}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register("username", { required: "Please enter your username" })}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.username ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.username && <span className="text-sm text-red-500">{errors.username.message}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Please enter your email" })}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-600 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              {...register("fullname", { required: "Please enter your full name" })}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.fullname ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.fullname && <span className="text-sm text-red-500">{errors.fullname.message}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Please enter your password" })}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white rounded-md transition duration-200 ${
              loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
