import React, { useState, useEffect } from 'react';
import { ShoppingCart, UserCircle, CreditCard, LogOut, Trash2, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login, logout } from "../store/authSlice";
import ProfileUpdateForm from '../component/ProfileUpdateForm';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [updateForm, setupdateForm] = useState(true);
  const [user, setUser] = useState({});
  const userData = useSelector(state => state.auth.userData);
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(null);

const handleFileChange = (e) => {
  setAvatar(e.target.files[0]); // Store the selected file
};

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  const update = async ({ username, email, fullname, address }) => {
    try {
      const updateResponse = await axios.patch("https://luxe-store.onrender.com/api/v1/users/update-account", {
        username,
        email,
        fullname,
        address
      }, {
        withCredentials: true,
      });
      if (updateResponse) {
        toast.success('User updated successfully!');
        setupdateForm(true);
        dispatch(login(updateResponse.data.data));
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
      toast.error(errorMessage);
    }
  };

  const updateAvatar = async () => {
    try {
      if (!avatar) {
        toast.error('Please select an avatar to upload.');
        return;
      }
  
      const formData = new FormData();
      formData.append('avatar', avatar); // This matches the field name expected by the backend
  
      const updateResponse = await axios.patch(
        "https://luxe-store.onrender.com/api/v1/users/update-avatar",
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
        }
      );
  
      if (updateResponse) {
        toast.success('Avatar updated successfully!');
        // console.log(updateResponse);
        dispatch(login(updateResponse.data.data));
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Toaster position="top-center" />
      
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your profile and preferences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col items-center">
                  {/* <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.fullname}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                  </div> */}
                  <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.fullname}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-gray-900">{user.fullname}</h2>
                    <p className="text-sm text-gray-500">{user.email}</p>

                    <div className="mt-5">
                      <label
                        htmlFor="avatar"
                        className="block text-sm font-medium text-gray-700 text-center"
                      >
                        Update Avatar
                      </label>
                      <div className="flex-col items-center gap-4 mt-2">
                        <input
                          id="avatar"
                          type="file"
                          onChange={handleFileChange}
                          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors duration-200"
                        />
                        <div className='flex justify-center items-center'>
                          <button
                            onClick={() => {updateAvatar({ avatar })}}
                            className="text-sm mt-3 px-4 py-2 bg-blue-900 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
                          >
                            Upload
                        </button>
                        </div>
                      </div>
                    </div>
                  <h2 className="mt-4 text-xl font-bold text-gray-900">{user.fullname}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                <nav className="mt-8 space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      activeTab === 'profile'
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <UserCircle size={20} />
                      <span>Profile Details</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && !updateForm ? (
              <div className="bg-white rounded-2xl shadow-md">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-center items-center">
                    <ProfileUpdateForm
                      handleSubmit={handleSubmit(update)}
                      register={register}
                      errors={errors}
                      loading={loading}
                      onClose = {() => setupdateForm(true)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                    <button
                      onClick={() => setupdateForm(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    {[
                      { label: 'Username', value: user.username },
                      { label: 'Email', value: user.email },
                      { label: 'Full Name', value: user.fullname },
                      { label: 'Address', value: user.address || 'Not specified' }
                    ].map((field, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-gray-100 last:border-0">
                        <span className="text-sm font-medium text-gray-500 sm:w-1/3">{field.label}</span>
                        <span className="mt-1 sm:mt-0 text-base text-gray-900">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;