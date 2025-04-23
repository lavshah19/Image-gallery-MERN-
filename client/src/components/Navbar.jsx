import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, Key, Upload, Menu, X } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {   //window.scrollY returns the number of pixels the page has been scrolled vertically.
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-white py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-extrabold bg-gradient-to-r from-green-600 to-teal-500 text-transparent bg-clip-text">
                Image Gallery
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-teal-400 flex items-center justify-center text-white font-medium">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium">
                  {user.username}
                </span>
              </div>
            )}

            <Link
              to="/change-password"
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                isActive('/change-password')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Key size={16} />
              <span>Change Password</span>
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/upload"
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  isActive('/upload')
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                <Upload size={16} />
                <span>Upload Image</span>
              </Link>
            )}

            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            mobileMenuOpen 
              ? 'max-h-64 opacity-100 mt-4' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-2 pb-4 space-y-2">
            {user && (
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-teal-400 flex items-center justify-center text-white font-medium">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium">
                  {user.username}
                </span>
              </div>
            )}

            <Link
              to="/change-password"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/change-password')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Key size={16} />
              <span>Change Password</span>
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/upload"
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/upload')
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Upload size={16} />
                <span>Upload Image</span>
              </Link>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-red-100 text-red-600 hover:bg-red-200"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;