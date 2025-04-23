// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ImageGrid from '../components/ImageGrid';

const Home = ({ setUser }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`${API}/api/home/welcome`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user)); // store for later use
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError('Failed to fetch user info. Please try again later.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, setUser]);

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto mt-8 px-4 py-7">
        <ImageGrid />
      </div>
    </div>
  );
};

export default Home;
