import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageCard from './ImageCard';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';

const ImageGrid = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, please log in');
        return;
      }

      const res = await axios.get(`${API}/api/image/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setImages(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch images:', err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = (imageId) => {
    setImages(images.filter((image) => image._id !== imageId)); // Remove image from state
  };

  const handleUploadImage = () => {
    navigate('/upload'); // Redirect to upload page
  };

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {images.length === 0 ? (
        <div className="col-span-full text-center py-10">
          <p className="text-lg font-semibold text-gray-600">No images found.</p>
          <button
            onClick={handleUploadImage}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition"
          >
            Please upload an image
          </button>
        </div>
      ) : (
        images.map((image) => (
          <ImageCard key={image._id} image={image} onClick={setSelectedImage} onDelete={handleDelete}   />
        ))
      )}
      <Modal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default ImageGrid;
