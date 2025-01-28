import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom';
import { Outlet } from 'react-router-dom'
import Header from './component/Header';
import {login, logout} from "./store/authSlice.js"
import { useDispatch } from 'react-redux'
import axios from 'axios';

function App() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
          const userResponse = await axios.get("https://luxe-store.onrender.com/api/v1/users/getuser", {
              withCredentials: true,
          });
          
          if (userResponse) {
            dispatch(login(userResponse.data.data));
          } else {
            dispatch(logout());
          }
      } catch (error) {
        // console.error("Error fetching user:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
}, []);

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  ) : null
}

export default App
