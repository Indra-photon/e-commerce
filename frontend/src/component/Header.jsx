import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, House, ShoppingBag, LogIn   } from 'lucide-react';
import Container from './Container';
import LogoutBtn from './LogoutBtn';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true,
      icon: <House size={18} />
    },
    {
      name: 'Profile',
      slug: "/profile",
      active: authStatus,
      icon: <User size={18} />
    },
    // {
    //   name: 'Admin',
    //   slug: "/admin-dashboard",
    //   active: authStatus,
    //   icon: <User size={18} />
    // },
    {
      name: 'Cart',
      slug: "/cart",
      active: authStatus,
      icon: <ShoppingCart size={18} />
    },
    {
      name: "Shop",
      slug: "/shop-page",
      active: true,
      icon: <ShoppingBag size={18} />
    },
    {
      name: "Sign In",
      slug: "/signin",
      active: !authStatus,
      icon: <LogIn size={18} />
    },
  ];

  return (
    <header className='bg-white shadow-lg'>
      <Container>
        <nav className='h-20'>
          <div className='max-w-7xl mx-auto flex items-center justify-between h-full'>
            {/* Logo */}
            <Link to='/' className='flex-shrink-0'>
              <h1 className='text-3xl font-playfair font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                LUXE
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center space-x-2'>
              {navItems.map((item) => 
                item.active ? (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.slug)}
                    className='inline-flex items-center px-6 py-2 rounded-full text-gray-600 hover:text-purple-600 transition-colors font-poppins'
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.name}
                  </button>
                ) : null
              )}
              {authStatus && (
                <div className='ml-2'>
                  <LogoutBtn />
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className='md:hidden'>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className='text-gray-600 hover:text-purple-600 transition-colors'
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className='md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg py-4 z-50'>
              <div className='flex flex-col space-y-2 px-4'>
                {navItems.map((item) => 
                  item.active ? (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.slug);
                        setIsMenuOpen(false);
                      }}
                      className='inline-flex items-center px-4 py-2 rounded-full text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors font-poppins text-left'
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.name}
                    </button>
                  ) : null
                )}
                {authStatus && (
                  <div className='pt-2 border-t border-gray-100'>
                    <LogoutBtn />
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </Container>

      {/* Font styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
          
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-poppins { font-family: 'Poppins', sans-serif; }
        `}
      </style>
    </header>
  );
}

export default Header;