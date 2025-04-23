import React from 'react';

const Modal = ({ image, onClose }) => {
  if (!image) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-3xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-3xl font-bold"
        >
          ×
        </button>
        <img
          src={image.url}
          alt={image.title || 'Image'}
          className="w-full max-h-[80vh] object-contain"
        />
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold">{image.title || 'Untitled'}</h2>
        </div>
      </div>
    </div>
  );
};

export default Modal;
