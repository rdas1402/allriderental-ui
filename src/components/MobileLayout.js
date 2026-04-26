import React, { useState, useEffect } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import Footer from "./Footer";

const MobileLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const menuItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Rent", path: "/rent", icon: "🚗" },
    { name: "Subscription", path: "/subscription", icon: "📅" },
    { name: "About Us", path: "/about", icon: "ℹ️" },
    { name: "Blogs", path: "/blogs", icon: "📝" },
    { name: "Contact Us", path: "/contact", icon: "📞" },
  ];

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

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setShowDropdown(!showDropdown);
    } else {
      navigate("/login", { 
        state: { from: location.pathname, action: "profile" } 
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
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Mobile Header */}
      <header className="bg-blue-100 border-b border-blue-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={logo}
                alt="All Ride Rental"
                className="w-10 h-10 rounded-full border-2 border-gold-400"
              />
              <h1 className="text-base font-semibold text-slate-800">
                All Ride <span className="text-gold-500">Rental</span>
              </h1>
            </div>

            {/* Right Section - Menu Button & Profile */}
            <div className="flex items-center space-x-3">
              {/* Profile Icon */}
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="p-2 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <FaUserCircle size={20} className="text-slate-700" />
                </button>

                {/* Dropdown Menu */}
                {isLoggedIn && showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-xs font-semibold text-slate-800">
                        {userInfo?.name || "User"}
                      </p>
                      <p className="text-xs text-slate-600">{userInfo?.phone}</p>
                    </div>
                    <button
                      onClick={() => handleNavigation("/profile")}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 transition-colors text-xs"
                    >
                      👤 View Profile
                    </button>
                    <button
                      onClick={() => handleNavigation("/profile")}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 transition-colors text-xs"
                    >
                      📋 My Bookings
                    </button>
                    {userInfo && (userInfo.role === 'admin' || userInfo.isAdmin) && (
                      <button
                        onClick={() => handleNavigation("/admin")}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 transition-colors text-xs"
                      >
                        🚗 Admin Dashboard
                      </button>
                    )}
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 transition-colors text-xs"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <nav className="mt-4 pb-4 border-b border-blue-300">
              <div className="flex flex-col space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors text-sm ${
                      location.pathname === item.path
                        ? "bg-gold-500 text-white"
                        : "text-slate-700 hover:bg-blue-200"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-white overflow-x-hidden">
        <div className="w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 lg:hidden">
        <div className="flex justify-around items-center py-3">
          <button
            onClick={() => handleNavigation("/")}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors text-xs ${
              location.pathname === "/" ? "text-gold-500" : "text-gray-600"
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button
            onClick={() => handleNavigation("/rent")}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors text-xs ${
              location.pathname === "/rent" ? "text-gold-500" : "text-gray-600"
            }`}
          >
            <span className="text-xl">🚗</span>
            <span className="text-xs mt-1">Rent</span>
          </button>
          
          <button
            onClick={() => handleNavigation("/subscription")}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors text-xs ${
              location.pathname === "/subscription" ? "text-gold-500" : "text-gray-600"
            }`}
          >
            <span className="text-xl">📅</span>
            <span className="text-xs mt-1">Subscribe</span>
          </button>
          
          <button
            onClick={() => handleNavigation("/profile")}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors text-xs ${
              location.pathname === "/profile" ? "text-gold-500" : "text-gray-600"
            }`}
          >
            <span className="text-xl">👤</span>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>

      {/* Add padding to account for bottom navigation */}
      <div className="pb-16 lg:pb-0"></div>

      {/* Footer - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
};

export default MobileLayout;