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

        const userResponse = await axios.get("https://your-render-backend-url.onrender.com/api/v1/users/getuser", {
          withCredentials: true,
          headers: {
              'Origin': 'https://e-commerce-4tzdwcrzx-indranil-maitis-projects.vercel.app'
          }
      });
          // console.log(userResponse);
          if (userResponse.data.data) {
            dispatch(login(userResponse.data.data));
          }
      } catch (error) {
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
