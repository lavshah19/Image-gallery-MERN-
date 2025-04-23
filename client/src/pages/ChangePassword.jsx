import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Key, Eye, EyeOff, Shield, Check, AlertTriangle, ArrowLeft } from 'lucide-react';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Calculate password strength when new password changes
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    // Simple password strength calculator
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match');
      setMessageType('error');
      return;
    }
    
    if (passwordStrength < 2) {
      setMessage('Please use a stronger password');
      setMessageType('error');
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API}/api/auth/change-password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || 'Password changed successfully');
      setMessageType('success');
      
      // Show success message before redirecting
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="w-full max-w-md p-1 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="relative h-16 bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
            <button 
              onClick={goBack}
              className="absolute left-4 text-white hover:bg-white/20 p-1 rounded-full transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield size={20} />
              Change Password
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Current Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  placeholder="Enter your current password"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10 transition-all"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {/* <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
              </div>
            </div>
            
            {/* New Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10 transition-all"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex gap-1">
                      <div className={`h-1 w-6 rounded-full ${passwordStrength >= 1 ? getStrengthColor() : 'bg-gray-200'}`}></div>
                      <div className={`h-1 w-6 rounded-full ${passwordStrength >= 2 ? getStrengthColor() : 'bg-gray-200'}`}></div>
                      <div className={`h-1 w-6 rounded-full ${passwordStrength >= 3 ? getStrengthColor() : 'bg-gray-200'}`}></div>
                      <div className={`h-1 w-6 rounded-full ${passwordStrength >= 4 ? getStrengthColor() : 'bg-gray-200'}`}></div>
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength === 1 ? 'text-red-500' : 
                      passwordStrength === 2 ? 'text-yellow-500' : 
                      passwordStrength === 3 ? 'text-blue-500' : 
                      passwordStrength === 4 ? 'text-green-500' : 'text-gray-400'
                    }`}>
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <ul className="text-xs text-gray-500 space-y-1 mt-2">
                    <li className={`flex items-center gap-1 ${formData.newPassword.length >= 8 ? 'text-green-600' : ''}`}>
                      {formData.newPassword.length >= 8 ? <Check size={12} /> : <span>•</span>} At least 8 characters
                    </li>
                    <li className={`flex items-center gap-1 ${formData.newPassword.match(/[A-Z]/) ? 'text-green-600' : ''}`}>
                      {formData.newPassword.match(/[A-Z]/) ? <Check size={12} /> : <span>•</span>} One uppercase letter
                    </li>
                    <li className={`flex items-center gap-1 ${formData.newPassword.match(/[0-9]/) ? 'text-green-600' : ''}`}>
                      {formData.newPassword.match(/[0-9]/) ? <Check size={12} /> : <span>•</span>} One number
                    </li>
                    <li className={`flex items-center gap-1 ${formData.newPassword.match(/[^A-Za-z0-9]/) ? 'text-green-600' : ''}`}>
                      {formData.newPassword.match(/[^A-Za-z0-9]/) ? <Check size={12} /> : <span>•</span>} One special character
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10 transition-all ${
                    formData.confirmPassword && formData.newPassword !== formData.confirmPassword 
                      ? 'border-red-300 focus:ring-red-400' 
                      : ''
                  }`}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
              )}
            </div>

            {/* Status Message */}
            {message && (
              <div className={`p-3 rounded-lg flex items-start gap-2 text-sm ${
                messageType === 'success' 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                {messageType === 'success' ? (
                  <Check size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <span>{message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:from-blue-700 hover:to-cyan-600 transform hover:-translate-y-0.5'
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Shield size={18} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;