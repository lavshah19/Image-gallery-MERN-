import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteConfirmation from './DeleteConfirmation';
import { Edit2, Trash2, Heart, MessageSquare, Calendar, Eye } from 'lucide-react';

const getToken = () => localStorage.getItem('token');

const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch (err) {
    return null;
  }
};

const getUserRoleFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch (err) {
    return null;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const ImageCard = ({ image, onClick, onDelete }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [likesCount, setLikesCount] = useState(image.likes?.length || 0);

  const userId = getUserIdFromToken();
  const [isLiked, setIsLiked] = useState(image.likes?.includes(userId));

  const navigate = useNavigate();
  const userRole = getUserRoleFromToken();
  const isAdmin = userRole === 'admin';
  const API = import.meta.env.VITE_API_URL;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSuccess = (imageId) => {
    onDelete(imageId);
    setIsDeleteModalOpen(false);
    setIsDeleting(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setIsDeleting(false);
  };

  const handleUpdateClick = (e) => {
    e.stopPropagation();
    navigate(`/update-img/${image._id}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const token = getToken();
      const res = await axios.post(
        `${API}/api/image/like/${image._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { liked, totalLikes } = res.data;
      setIsLiked(liked);
      setLikesCount(totalLikes);
    } catch (err) {
      console.error('Error liking image:', err);
    }
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    navigate(`/cmt/${image._id}`);
  };

  return (
    <div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (!isDeleting) onClick(image);
      }}
    >
  

      {/* Image container with enhanced gradient overlay */}
      <div className="relative overflow-hidden h-72">
        <img
          src={image.url}
          alt={image.title || 'Image'}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
        
        {/* Enhanced overlay gradient - more vibrant */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

       

        {/* Image stats overlay (shown on hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              {/* Date info */}
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span className="text-xs">{formatDate(image.createdAt || new Date())}</span>
              </div>
              
              {/* Views count if available */}
              {/* {image.views !== undefined && (
                <div className="flex items-center">
                  <Eye size={14} className="mr-1" />
                  <span className="text-xs">{image.views || 0}</span>
                </div>
              )} */}
            </div>
            
            {/* Admin controls */}
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateClick}
                  className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none transition-all duration-200 hover:scale-110 shadow-lg"
                  aria-label="Update image"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none transition-all duration-200 hover:scale-110 shadow-lg"
                  aria-label="Delete image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card content with improved styling */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
          {image.title || 'Untitled'}
        </h3>
        
        {/* Description preview if available this feature will add later if i feel like to add it */}
        {/* {image.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 overflow-hidden">
            {image.description}
          </p>
        )} */}
        
        {/* Enhanced author info with more details */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white">
              {image.uploadedBy?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800 leading-tight">
                {image.uploadedBy?.username || 'Unknown user'}
              </p>
              <p className="text-xs text-gray-500">uploader</p>
            </div>
          </div>

          {/* Interactive buttons */}
          <div className="flex items-center space-x-2">
            {/* Like button */}
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors"
              aria-label="Like image"
            >
              <Heart
                className={isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}
                size={16}
              />
              <span className="text-xs font-medium">{likesCount}</span>
            </button>
            
            {/* Comment button */}
            <button
              onClick={handleCommentClick}
              className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors"
              aria-label="Comment on image"
            >
              <MessageSquare
                className="text-gray-500"
                size={16}
              />
              <span className="text-xs font-medium">{image.comments?.length || 0}</span>
            </button>
          </div>
        </div>

        {/* Animated highlight bar */}
        <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mt-4 transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
      </div>

      {isDeleteModalOpen && (
        <DeleteConfirmation
          imageId={image._id}
          onDeleteSuccess={handleDeleteSuccess}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default ImageCard;