import React from 'react';
import { UserCircle, Mail, User, MapPin, X } from 'lucide-react';

const ProfileUpdateForm = ({ handleSubmit, register, errors, loading, onClose }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Form Header */}
        <div className="text-center mb-8">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Update Your Profile
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Keep your information up to date for a better shopping experience
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white py-8 px-10 shadow-xl rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <UserCircle className="w-4 h-4 mr-2 text-gray-400" />
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="username"
                  className={`block w-full pr-10 sm:text-sm rounded-lg
                    ${errors.username 
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }
                    transition-all duration-200 ease-in-out
                  `}
                  {...register("username", { required: "Username is required" })}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="email"
                  id="email"
                  className={`block w-full pr-10 sm:text-sm rounded-lg
                    ${errors.email 
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }
                    transition-all duration-200 ease-in-out
                  `}
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Full Name Field */}
            <div>
              <label 
                htmlFor="fullname" 
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <User className="w-4 h-4 mr-2 text-gray-400" />
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="fullname"
                  className={`block w-full pr-10 sm:text-sm rounded-lg
                    ${errors.fullname 
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }
                    transition-all duration-200 ease-in-out
                  `}
                  {...register("fullname", { required: "Full Name is required" })}
                />
              </div>
              {errors.fullname && (
                <p className="mt-1 text-sm text-red-600">{errors.fullname.message}</p>
              )}
            </div>

            {/* Address Field */}
            <div>
              <label 
                htmlFor="address" 
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                Shipping Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="address"
                  className={`block w-full pr-10 sm:text-sm rounded-lg
                    ${errors.address 
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }
                    transition-all duration-200 ease-in-out
                  `}
                  {...register("address")}
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                  ${loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }
                  transition-all duration-200 ease-in-out
                `}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Profile...
                  </div>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdateForm;
