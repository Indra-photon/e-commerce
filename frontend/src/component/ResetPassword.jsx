import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";


function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get token from URL
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');
  console.log(`token from URL: ${token}`);
  

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // const resetPassword = async (data) => {
  //   if (!token) {
  //     toast.error("Invalid reset link");
  //     return;
  //   }

  //   setLoading(true);
  //   const loadingToast = toast.loading("Resetting password...");

  //   try {
  //     // Log the token and request body for debugging
  //     // console.log("Token:", token);
  //     // console.log("Password:", data.newPassword);

  //     const res = await axios.post(
  //       "http://localhost:5174/api/v1/users/reset-password",
  //       {
  //         token: token,
  //         newPassword: data.newPassword
  //       }
  //     );

  //     toast.dismiss(loadingToast);
  //     toast.success("Password reset successfully!");
  //     setTimeout(() => navigate("/signin"), 2000);
      
  //   } catch (error) {
  //     toast.dismiss(loadingToast);
  //     const errorMessage = error.response?.data?.message || "Something went wrong";
  //     toast.error(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const resetPassword = async (data) => {
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Resetting password...");

    try {
      const res = await axios.post(
        "http://localhost:5174/api/v1/users/reset-password",
        {
          token: token,
          newPassword: data.newPassword
        },
        {
          withCredentials: true  // Added this to handle cookies
        }
      );

      toast.dismiss(loadingToast);
      if(res.data.success) {
        toast.success("Password reset successfully!");
        setTimeout(() => navigate("/signin"), 2000);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
        
        <form onSubmit={handleSubmit(resetPassword)}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600 mb-2">
              New Password
            </label>
            <input
              type="password"
              {...register("newPassword", { 
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                }
              })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2"
            />
            {errors.newPassword && (
              <span className="text-sm text-red-500">{errors.newPassword.message}</span>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", { 
                required: "Please confirm your password",
                validate: (value, formValues) => value === formValues.newPassword || "Passwords do not match"
              })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2"
            />
            {errors.confirmPassword && (
              <span className="text-sm text-red-500">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white rounded-md ${
              loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;