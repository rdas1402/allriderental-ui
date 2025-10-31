import React, { useState, useEffect } from "react";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const menuItems = [
    { name: "Home", id: "home", path: "/" },
    { name: "Rent", id: "rent", path: "/rent" },
    { name: "About Us", id: "about", path: "/about" },
    { name: "Blogs", id: "blogs", path: "/blogs" },
    { name: "Career", id: "career", path: "/career" },
    { name: "Contact Us", id: "contact", path: "/contact" },
    { name: "Buy", id: "buy", path: "/buy" },
    { name: "Partner with us", id: "partner", path: "/partner" },
  ];

  // Check login status on component mount and route changes
  useEffect(() => {
    checkLoginStatus();
  }, [location]);

  const checkLoginStatus = () => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userData = localStorage.getItem("userData");
    
    setIsLoggedIn(loggedIn);
    if (loggedIn && userData) {
      try {
        setUserInfo(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  };

  const getActiveSection = () => {
    const currentPath = location.pathname;
    const item = menuItems.find(item => item.path === currentPath);
    return item ? item.id : "home";
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      // If already logged in, show dropdown
      setShowDropdown(!showDropdown);
    } else {
      // If not logged in, navigate to login page
      // Pass the current location to redirect back after login
      navigate("/login", { 
        state: { 
          from: location.pathname,
          action: "profile" 
        } 
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    localStorage.removeItem("userPhone");
    setIsLoggedIn(false);
    setUserInfo(null);
    setShowDropdown(false);
    navigate("/");
  };

  const handleViewProfile = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  const handleViewBookings = () => {
    navigate("/bookings");
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-black/30 backdrop-blur-lg text-white flex justify-between items-center px-10 py-5 sticky top-0 z-50 border-b border-white/10">
        {/* Left Section - Logo + App Name */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="All Ride Rental"
            className="w-12 h-12 rounded-full border-2 border-gold-400 group-hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-2xl font-light text-white tracking-wide">
            All Ride <span className="font-semibold text-gold-400">Rental</span>
          </h1>
        </div>

        {/* Right Section - Menu */}
        <ul className="flex space-x-8 text-md font-medium items-center">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`relative cursor-pointer transition-all duration-300 hover:text-gold-300 ${
                getActiveSection() === item.id ? "text-gold-400" : "text-white/90"
              }`}
            >
              {item.name}
              {getActiveSection() === item.id && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold-400 rounded-full"></span>
              )}
            </li>
          ))}
          
          {/* Profile Section */}
          <li className="relative profile-dropdown">
            <div 
              className="flex items-center cursor-pointer hover:text-gold-300 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/5"
              onClick={handleProfileClick}
            >
              <FaUserCircle
                size={20}
                className="mr-2 hover:scale-105 transition-transform duration-300 text-white/90"
              />
              <span className="text-white/90">
                {isLoggedIn ? (userInfo?.name || "My Profile") : "My Profile"}
              </span>
              {isLoggedIn && (
                <FaChevronDown 
                  size={12} 
                  className={`ml-2 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
                />
              )}
            </div>

            {/* Dropdown Menu - Only show when logged in */}
            {isLoggedIn && showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800/90 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10 py-2 z-50">
                <button
                  onClick={handleViewProfile}
                  className="w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 hover:text-gold-300 transition-colors flex items-center"
                >
                  <FaUserCircle className="mr-2" size={14} />
                  View Profile
                </button>
                <button
                  onClick={handleViewBookings}
                  className="w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 hover:text-gold-300 transition-colors flex items-center"
                >
                  <span className="mr-2">📋</span>
                  My Bookings
                </button>
                <div className="border-t border-white/10 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors flex items-center"
                >
                  <span className="mr-2">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* Page Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;