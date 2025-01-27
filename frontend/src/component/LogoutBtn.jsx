import React from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../store/authSlice';
import toast, { Toaster } from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'
import { LogOut} from 'lucide-react';

function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const logoutHandler = async () => {
        try {
            const res = await axios.post("https://e-commerce-smoky-omega.vercel.app/api/v1/users/logout", {}, {
                withCredentials: true, // Ensure cookies are sent
            });
            if (res.status === 200) {
                dispatch(logout());
                toast.success('You have successfully logged out!');
                navigate("/")
                // console.log("User Logged out successfully");
            }
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
            toast.error('Logout failed. Please try again.');
        }
    };

    return (
        // <div className='flex'>
        //     <Toaster
        //         position="top-center"
        //         reverseOrder={false}
        //         toastOptions={{
        //             style: {
        //                 background: '#363636',
        //                 color: '#fff',
        //             },
        //             success: {
        //                 duration: 4000,
        //                 theme: {
        //                     primary: 'green',
        //                     secondary: 'black',
        //                 },
        //             },
        //             error: {
        //                 duration: 5000,
        //                 theme: {
        //                     primary: 'red',
        //                     secondary: 'black',
        //                 },
        //             },
        //         }}
        //     />

        //     <LogOut size={18} />
        //     <button
        //         className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full text-gray-600 hover:text-purple-600 transition-colors font-poppins'
        //         onClick={logoutHandler}
        //     >
        //         Logout
        //     </button>
        // </div>
        <div className="flex items-center">
  <Toaster
    position="top-center"
    reverseOrder={false}
    toastOptions={{
      style: {
        background: '#363636',
        color: '#fff',
      },
      success: {
        duration: 4000,
        theme: {
          primary: 'green',
          secondary: 'black',
        },
      },
      error: {
        duration: 5000,
        theme: {
          primary: 'red',
          secondary: 'black',
        },
      },
    }}
  />

  <div 
  onClick={logoutHandler}
  className="flex items-center hover:text-purple-600 transition-colors">
    <LogOut size={18} className="text-gray-600 hover:text-purple-600" />
    <button
        className='inline-flex items-center py-2 rounded-full text-gray-600 hover:text-purple-600 transition-colors font-poppins'
        >
        Logout
    </button>
  </div>
</div>

    );
}

export default LogoutBtn;
