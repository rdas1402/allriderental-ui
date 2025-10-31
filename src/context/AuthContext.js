import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const phone = localStorage.getItem('userPhone') || '';
    
    if (loggedIn && phone) {
      setIsLoggedIn(true);
      setUserPhone(phone);
    }
  }, []);

  const login = (phone) => {
    setIsLoggedIn(true);
    setUserPhone(phone);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userPhone', phone);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserPhone('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userPhone');
  };

  const value = {
    isLoggedIn,
    userPhone,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};