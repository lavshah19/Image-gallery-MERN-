import React, { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, Trash2, X, Check, Loader } from "lucide-react";

const DeleteConfirmation = ({ imageId, onDeleteSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null, 'success', 'error'
  const [message, setMessage] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  // Handle automatic close after success
  useEffect(() => {
    let timer;
    if (status === 'success') {
      timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          onDeleteSuccess(imageId);
        }, 300);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [status, imageId, onDeleteSuccess]);

  const handleDelete = async () => {
    setLoading(true);
    setStatus(null);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus('error');
        setMessage("No token found, please log in");
        return;
      }

      const res = await axios.delete(
        `${API}/api/image/delete/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setStatus('success');
        setMessage("Image deleted successfully!");
      } else {
        setStatus('error');
        setMessage("Failed to delete image!");
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || "Error deleting image");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      onCancel();
    }, 300);
  };

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden transition-all transform duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-red-500" size={20} />
            <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-600">
            Are you sure you want to delete this image? This action cannot be undone.
          </p>
          
          {/* Status message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg flex items-center ${
              status === 'success' ? 'bg-green-50 text-green-700' :
              status === 'error' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
            }`}>
              {status === 'success' && <Check size={18} className="mr-2 flex-shrink-0" />}
              {status === 'error' && <AlertCircle size={18} className="mr-2 flex-shrink-0" />}
              <span className="text-sm">{message}</span>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className={`px-4 py-2 rounded-lg font-medium flex items-center justify-center min-w-24 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
              loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
            } text-white`}
            disabled={loading || status === 'success'}
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin mr-2" />
                <span>Deleting...</span>
              </>
            ) : status === 'success' ? (
              <>
                <Check size={16} className="mr-2" />
                <span>Deleted</span>
              </>
            ) : (
              <>
                <Trash2 size={16} className="mr-2" />
                <span>Delete Image</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;