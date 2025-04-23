import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Helper function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function to get user info from the decoded JWT token
const getUserInfo = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token
    return payload;
  } catch {
    return null; // Return null if decoding fails
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserInfo()); // Store user information from the token
  const [token, setToken] = useState(getToken()); // Store the token

  useEffect(() => {
    const handleStorageChange = () => {
      const currentToken = getToken(); // Get the latest token
      setToken(currentToken); // Update the token in the state
      setUser(getUserInfo()); // Update user state based on the latest token
    };

    window.addEventListener('storage', handleStorageChange); // Listen for changes in localStorage
    return () => {
      window.removeEventListener('storage', handleStorageChange); // Cleanup the event listener
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const logout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setUser(null); // Clear the user state
    setToken(null); // Clear the token state
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the auth context
export const useAuth = () => useContext(AuthContext);
