import React,{ StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import SignUp from './component/SignUp.jsx';
import Signin from './component/SignIn.jsx';
import AuthLayout from './component/AuthLayout.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx';
import Cart from './pages/Cart.jsx';
import ShopPage from './pages/ShopPage.jsx';
import AddProductForm from './component/AddProductForm.jsx'
import ForgotPassword from './component/ForgotPassword.jsx'
import ResetPassword from './component/ResetPassword.jsx'
import AdminDashboard from './component/AdminDashboard.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
          path: "/",
          element: <Home />,
      },
      {
          path: "/signin",
          element: (
              <AuthLayout authentication={false}>
                  <Signin />
              </AuthLayout>
          ),
      },
      {
          path: "/signup",
          element: (
              <AuthLayout authentication={false}>
                  <SignUp />
              </AuthLayout>
          ),
      },
      {
        path: "/shop-page",
        element: <ShopPage />,
      },
      {
        path: "/profile",
        element: (
            <AuthLayout authentication={true}>
                <Profile />
            </AuthLayout>
        ),
      },
      {
        path: "/cart",
        element: (
            <AuthLayout authentication={true}>
                <Cart />
            </AuthLayout>
        ),
      },
      {
        path : "/admin-panel",
        element : (
          <AddProductForm />
        )
      },
      {
        path : "/admin-dashbaord",
        element : (
          <AdminDashboard />
        )
      },
      {
        path : "/forgot-password",
        element : (
          <ForgotPassword />
        )
      },
      {
        path : "/reset-password",
        element : (
          <ResetPassword />
        )
      }
  ],
},
])


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)
