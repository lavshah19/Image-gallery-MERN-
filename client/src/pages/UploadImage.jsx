import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, Image, AlertCircle, CheckCircle, X } from 'lucide-react';

const UploadImage = () => {
  // State hooks for managing image file, title, preview, messages, uploading status, etc.
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  // Reference for the hidden file input
  const fileInputRef = useRef(null);

  // Handler for when an image is selected from the file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file); // Process the selected file
    }
  };

  // Process the file - check if it's an image and set the preview
  const processFile = (file) => {
    if (file.type.startsWith('image/')) {
      setImageFile(file); // Set the image file state
      setPreview(URL.createObjectURL(file)); // Set the image preview
      // Auto-generate title from filename if title is not provided
      if (!title) {
        const fileName = file.name.split('.')[0]; // Get the name without the extension
        setTitle(fileName.replace(/-|_/g, ' ')); // Format filename as title
      }
    } else {
      showMessage('Please select an image file', 'error'); // Show error if not an image
    }
  };

  // Show status messages (success or error)
  const showMessage = (text, type) => {
    setMessage(text); // Set the message
    setMessageType(type); // Set the message type ('success' or 'error')
    // Auto-clear success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  };

  // Upload the image to the backend
  const handleUpload = async () => {
    // Check if title and image file are provided
    if (!imageFile || !title.trim()) {
      showMessage('Please provide both title and image', 'error');
      return;
    }

    // Check if user is logged in by checking the token
    const token = localStorage.getItem('token');
    if (!token) {
      showMessage('You must be logged in', 'error');
      return;
    }

    // Prepare the data for the upload request
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', title.trim());

    try {
      setUploading(true); // Start uploading
      setMessage(''); // Clear previous message
      const res = await axios.post(`${API}/api/image/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request header
          'Content-Type': 'multipart/form-data', // Set the content type
        },
      });

      // Check if the upload was successful
      if (res.data.success) {
        showMessage('Image uploaded successfully!', 'success');
        setImageFile(null);
        setPreview(null);
        setTitle('');
      } else {
        showMessage('Upload failed. Please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || 'Error uploading image', 'error');
    } finally {
      setUploading(false); // End the uploading process
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true); // Highlight the drop area
    } else if (e.type === 'dragleave') {
      setDragActive(false); // Remove highlight when drag leaves
    }
  };

  // Handle the drop event for drag-and-drop file uploads
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false); // Remove the drop area highlight
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]); // Process the dropped file
    }
  };

  // Trigger the hidden file input when the drop area is clicked
  const triggerFileInput = () => {
    fileInputRef.current.click(); // Simulate the file input click
  };

  // Remove the selected image (reset all states)
  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
    setTitle(""); // Reset title
  };

  return (
    <div className="max-w-xl mx-auto py-28">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
        <div className="bg-gradient-to-r from-green-600 to-teal-500 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Upload size={20} />
            Upload New Image
          </h2>
          <p className="text-green-100 text-sm mt-1">Admin access required</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Title Input - allows user to set the title for the image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Image Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)} // Update title on change
              placeholder="Enter a descriptive title"
              className="w-full p-3 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* File Drop Zone - allows drag-and-drop or click-to-upload */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 transition-all duration-300 ${
              dragActive 
                ? 'border-green-500 bg-green-50' 
                : preview 
                  ? 'border-gray-300 bg-gray-50' 
                  : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={!preview ? triggerFileInput : undefined} // Trigger file input if no preview
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange} // Process the selected image
              className="hidden" // Hide the file input
            />

            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-contain rounded-md"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(); // Remove the image when the button is clicked
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md transition-transform hover:scale-110"
                >
                  <X size={16} />
                </button>
                <div className="mt-2 text-sm text-gray-500 truncate">
                  {imageFile?.name} ({(imageFile?.size / 1024).toFixed(1)} KB)
                </div>
              </div>
            ) : (
              <div className="text-center cursor-pointer">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4 flex text-sm text-gray-600">
                  <p className="mx-auto">
                    <span className="font-medium text-green-600 hover:text-green-500">
                      Upload a file
                    </span>{" "}
                    or drag and drop
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
          </div>

          {/* Upload Button - triggers the image upload */}
          <button
            onClick={handleUpload}
            disabled={uploading} // Disable button while uploading
            className={`w-full py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              uploading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-teal-500 text-white hover:shadow-lg hover:from-green-700 hover:to-teal-600 transform hover:-translate-y-0.5'
            }`}
          >
            {uploading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={18} />
                <span>Upload Image</span>
              </>
            )}
          </button>

          {/* Status Message - shows success or error messages */}
          {message && (
            <div className={`p-3 rounded-lg flex items-start gap-2 text-sm ${
              messageType === 'success' 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
