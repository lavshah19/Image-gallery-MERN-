import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, Save, ArrowLeft, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const UpdateImage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  // Fetch image details
  const fetchImage = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showMessage('Unauthorized: Token missing.', 'error');
        navigate('/login');
        return;
      }

      setLoading(true);
      const res = await axios.get(`${API}/api/image/get/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setImage(res.data.image);
        setTitle(res.data.image.title || '');
        setOriginalTitle(res.data.image.title || '');
      } else {
        showMessage('Failed to fetch image.', 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Error fetching image details. The image may not exist.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImage();
  }, [id, navigate]);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    
    if (type === 'success') {
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  };

  // Handle update submission
  const handleUpdate = async () => {
    if (!title.trim()) {
      showMessage('Title cannot be empty.', 'error');
      return;
    }
    
    if (title === originalTitle) {
      showMessage('Title unchanged. No update needed.', 'info');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showMessage('You must be logged in.', 'error');
        navigate('/login');
        return;
      }

      setUpdating(true);
      setMessage('');

      const res = await axios.put(
        `${API}/api/image/update/${id}`,
        { title: title.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        showMessage('Image updated successfully!', 'success');
        setOriginalTitle(title);
        setTimeout(() => navigate('/'), 1500);
      } else {
        showMessage('Update failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || 'Error updating image.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-20 flex flex-col items-center justify-center p-8">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600">Loading image details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-12 mb-12 py-10">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="relative h-16 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center justify-center">
          <button 
            onClick={handleCancel}
            className="absolute left-4 text-white hover:bg-white/20 p-1 rounded-full transition-all"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit2 size={20} />
            Edit Image
          </h2>
        </div>

        <div className="p-6">
          {/* Image Preview */}
          {image && (
            <div className="mb-6">
              <div className="relative rounded-lg overflow-hidden shadow-lg bg-gray-50">
                <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${imageLoaded ? 'hidden' : ''}`}>
                  <Loader className="animate-spin text-blue-500" size={32} />
                </div>
                <img
                  src={image.url}
                  alt={image.title || 'Image'}
                  className={`w-full h-64 object-contain transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
              
              <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 flex items-center justify-center text-white font-medium">
                    {image.uploadedBy?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">
                      {image.uploadedBy?.username || 'Unknown user'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(image.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Image Title</label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 p-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter a descriptive title"
              />
              <Edit2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {title !== originalTitle && (
              <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                <CheckCircle size={12} />
                Changed from original: "{originalTitle}"
              </p>
            )}
          </div>

          {/* Status Message */}
          {message && (
            <div className={`p-3 rounded-lg flex items-start gap-2 text-sm mb-6 ${
              messageType === 'success' 
                ? 'bg-green-50 text-green-800' 
                : messageType === 'info'
                  ? 'bg-blue-50 text-blue-800'
                  : 'bg-red-50 text-red-800'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
              ) : messageType === 'info' ? (
                <AlertCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium"
              disabled={updating}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={updating || (title === originalTitle)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                updating
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : title === originalTitle
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {updating ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateImage;