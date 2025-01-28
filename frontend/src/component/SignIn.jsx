import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/authSlice';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

function SignIn() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const loginResponse = await axios.post(
                'https://luxe-store.onrender.com/api/v1/users/signin',
                { email, password },
                { withCredentials: true }
            );

            if (loginResponse.data.data) {
                const accessToken = loginResponse.data.data.accessToken;
                console.log("Token received:", accessToken);

                const userResponse = await axios.get(
                    'https://luxe-store.onrender.com/api/v1/users/getuser',
                    { 
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );

                if (userResponse.data.data) {
                    toast.success('Welcome back!');
                    dispatch(login(userResponse.data.data));
                }
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || 'Login failed';
            toast.error(errorMessage);
            dispatch(logout());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-xl rounded-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign up now
                        </a>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleLogin)}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                    errors.email ? 'border-red-500' : ''
                                }`}
                                placeholder="Email address"
                                {...register('email', { required: 'Email is required' })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="mt-4">
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                    errors.password ? 'border-red-500' : ''
                                }`}
                                placeholder="Password"
                                {...register('password', { required: 'Password is required' })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 block text-sm text-gray-900"
                            >
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                        <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                            Forgot your password?
                        </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
