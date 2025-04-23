import React from 'react';

const Admin = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">You have admin access.</p>
        {/* You can add admin-specific components here */}
      </div>
    </div>
  );
};

export default Admin;
