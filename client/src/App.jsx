import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ChangePassword from './pages/ChangePassword';
import UploadImage from './pages/UploadImage';
import UpdateImage from './pages/UpdateImage';
import Navbar from './components/Navbar'; // import Navbar
import CommentSection from './components/CommentSection';

const getUserInfo = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (err) {
    return null;
  }
};

const AppContent = () => {
  const location = useLocation();
  const [user, setUser] = useState(getUserInfo());

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getUserInfo());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isLoggedIn = !!user;
  const isAdmin = isLoggedIn && user.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  // Optional: hide navbar on login/register if you want
  const hideNavbarPaths = ['/login', '/register'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar user={user} onLogout={handleLogout} />}
      
      <Routes>
        <Route path="/" element={<Home setUser={setUser} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
        <Route path="/change-password" element={isLoggedIn ? <ChangePassword /> : <Login />} />
        <Route path="/upload" element={isAdmin ? <UploadImage /> : <Navigate to="/" />} />
        <Route path="/update-img/:id" element={isAdmin ? <UpdateImage /> : <Navigate to="/" />} />
        <Route path="/cmt/:id" element={isLoggedIn ? <CommentSection /> : <Login />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
