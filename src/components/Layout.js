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

  const adminMenuItems = [
    { name: "🚗 Admin Dashboard", id: "admin", path: "/admin" }
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
        const parsedData = JSON.parse(userData);
        // Extract user info from the nested structure
        const userInfo = parsedData.profile?.user || parsedData.user || parsedData;
        setUserInfo(userInfo);
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
    
    // Special case for home - should only be active on exact "/"
    if (currentPath === "/") {
      return "home";
    }
    
    // Check for exact matches first
    const exactMatch = menuItems.find(item => item.path === currentPath);
    if (exactMatch) {
      return exactMatch.id;
    }
    
    // Check for path starts with (for nested routes)
    const startsWithMatch = menuItems.find(item => 
      item.path !== "/" && currentPath.startsWith(item.path)
    );
    
    if (startsWithMatch) {
      return startsWithMatch.id;
    }
    
    // For admin dashboard - only highlight when on /admin
    if (currentPath === "/admin" && isLoggedIn && userInfo && (userInfo.role === 'admin' || userInfo.isAdmin)) {
      return "admin";
    }
    
    // For profile page - highlight profile, not admin
    if (currentPath === "/profile") {
      return "profile"; // This should highlight the profile section
    }
    
    // Default to no active item instead of "home"
    return null;
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      // If already logged in, show dropdown
      setShowDropdown(!showDropdown);
    } else {
      // If not logged in, navigate to login page
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
    localStorage.removeItem("userBookings");
    setIsLoggedIn(false);
    setUserInfo(null);
    setShowDropdown(false);
    navigate("/");
  };

  const handleViewProfile = () => {
    navigate("/profile", { state: { scrollToProfile: true } });
    setShowDropdown(false);
  };

  const handleViewBookings = () => {
    navigate("/profile", { state: { scrollToBookings: true } });
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
    <div className="min-h-screen bg-white flex flex-col"> {/* Changed to white background */}
      {/* Navigation Header - Lighter Blue */}
      <nav className="bg-blue-100 backdrop-blur-lg text-slate-800 flex justify-between items-center px-10 py-5 sticky top-0 z-50 border-b border-blue-200 shadow-sm"> {/* Changed to lighter blue */}
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
          <h1 className="text-2xl font-light text-slate-800 tracking-wide"> {/* Changed text color */}
            All Ride <span className="font-semibold text-gold-500">Rental</span> {/* Changed gold color */}
          </h1>
        </div>

        {/* Right Section - Menu */}
        <ul className="flex space-x-8 text-md font-medium items-center">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`relative cursor-pointer transition-all duration-300 hover:text-gold-500 ${
                getActiveSection() === item.id ? "text-gold-500" : "text-slate-700" // Changed text colors
              }`}
            >
              {item.name}
              {getActiveSection() === item.id && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold-500 rounded-full"></span> 
              )}
            </li>
          ))}

          {/* Admin Navigation Items */}
          {isLoggedIn && userInfo && (userInfo.role === 'admin' || userInfo.isAdmin) && (
            <>
              {adminMenuItems.map((item) => (
                <li
                  key={item.id}
                  onClick={() => navigate(item.path, { state: { scrollToAdmin: true } })}
                  className={`relative cursor-pointer transition-all duration-300 hover:text-gold-500 ${
                    getActiveSection() === item.id ? "text-gold-500" : "text-slate-700" // Changed text colors
                  }`}
                >
                  {item.name}
                  {getActiveSection() === item.id && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold-500 rounded-full"></span>
                  )}
                </li>
              ))}
            </>
          )}
          
          {/* Profile Section */}
          <li className="relative profile-dropdown">
            <div 
              className="flex items-center cursor-pointer hover:text-gold-500 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-200" // Changed hover background
              onClick={handleProfileClick}
            >
              <FaUserCircle
                size={20}
                className="mr-2 hover:scale-105 transition-transform duration-300 text-slate-700" // Changed icon color
              />
              <span className="text-slate-700"> {/* Changed text color */}
                {isLoggedIn ? (userInfo?.name || "My Profile") : "My Profile"}
              </span>
              {isLoggedIn && (
                <FaChevronDown 
                  size={12} 
                  className={`ml-2 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''} text-slate-600`} // Changed icon color
                />
              )}
            </div>

            {/* Dropdown Menu - Only show when logged in */}
            {isLoggedIn && showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-blue-50 backdrop-blur-lg rounded-xl shadow-lg border border-blue-200 py-2 z-50"> {/* Changed to lighter blue */}
                <button
                  onClick={handleViewProfile}
                  className="w-full text-left px-4 py-3 text-slate-700 hover:bg-blue-100 hover:text-gold-500 transition-colors flex items-center" // Changed colors
                >
                  <FaUserCircle className="mr-2" size={14} />
                  View Profile
                </button>
                <button
                  onClick={handleViewBookings}
                  className="w-full text-left px-4 py-3 text-slate-700 hover:bg-blue-100 hover:text-gold-500 transition-colors flex items-center" // Changed colors
                >
                  <span className="mr-2">📋</span>
                  My Bookings
                </button>
                <div className="border-t border-blue-200 my-1"></div> {/* Changed border color */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-500 hover:bg-blue-100 hover:text-red-600 transition-colors flex items-center" // Changed colors
                >
                  <span className="mr-2">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* Page Content - White Background */}
      <main className="flex-grow bg-white"> {/* Added white background */}
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;