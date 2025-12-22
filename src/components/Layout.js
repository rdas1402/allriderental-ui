// components/Layout.js
import React, { useState, useEffect } from "react";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer";
import MobileLayout from "./MobileLayout";
import { authAPI, citiesAPI } from "../services/apiService";
import LocationPopup from "./LocationPopup";
import { useCity } from "../context/CityContext"; // Added import

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  
  // Use CityContext for city management
  const { selectedCity, availableCities, updateCity, setAvailableCities } = useCity();
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  // Helper function to clear auth data
  const clearAuthData = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userBookings");
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle scroll behavior for header visibility
  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // Always show header when hovering
        if (isHovering) {
          setIsHeaderVisible(true);
          setLastScrollY(currentScrollY);
          return;
        }

        // Show header when scrolling up, hide when scrolling down
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsHeaderVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsHeaderVisible(true);
        }

        // Always show header at the top of the page
        if (currentScrollY < 100) {
          setIsHeaderVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlHeader);

    return () => {
      window.removeEventListener('scroll', controlHeader);
    };
  }, [lastScrollY, isHovering]);

  // Load selected city from localStorage on component mount
  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity");
    if (!savedCity) {
      // Show popup if no city is selected (only on home and rent pages)
      const shouldShowPopup = ["/", "/rent"].includes(location.pathname);
      if (shouldShowPopup) {
        setTimeout(() => {
          setShowLocationPopup(true);
        }, 1000);
      }
    }
    
    fetchAvailableCities();
  }, [location.pathname]);

  // Fetch available cities
  const fetchAvailableCities = async () => {
    try {
      setCitiesLoading(true);
      const citiesData = await citiesAPI.getCities();
      
      // Extract just the city names from the objects
      const cityNames = citiesData.map(city => city.name);
      
      // Add "All Cities" option at the beginning
      setAvailableCities(["All Cities", ...cityNames]);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setAvailableCities(["All Cities"]);
    } finally {
      setCitiesLoading(false);
    }
  };

  // Handle city selection
  const handleCitySelect = (city) => {
    updateCity(city); // Use context updateCity
    setShowLocationPopup(false);
    
    // Refresh the page if we're on rent page to show filtered vehicles
    if (location.pathname === "/rent") {
      window.location.reload();
    }
  };

  // Enhanced authentication verification
  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        setIsVerifyingAuth(true);
        
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        const userData = localStorage.getItem("userData");
        const userPhone = localStorage.getItem("userPhone");
        
        if (!loggedIn || !userData || !userPhone) {
          clearAuthData();
          return;
        }

        // Verify user exists and session is valid
        const userProfile = await authAPI.getUserProfile(userPhone);
        
        if (userProfile && userProfile.success) {
          const user = userProfile.profile?.user || userProfile.user || userProfile;
          
          // Validate that the user data matches
          if (user.phone === userPhone) {
            setIsLoggedIn(true);
            setUserInfo(user);
            
            // Update localStorage with fresh data
            localStorage.setItem("userData", JSON.stringify(userProfile));
          } else {
            // Phone number mismatch - clear auth
            clearAuthData();
          }
        } else {
          // Invalid user response - clear auth
          clearAuthData();
        }
      } catch (error) {
        console.error("Authentication verification failed:", error);
        // On any error, clear authentication to be safe
        clearAuthData();
      } finally {
        setIsVerifyingAuth(false);
      }
    };

    verifyAuthentication();
  }, [location]);

  const menuItems = [
    { name: "Home", id: "home", path: "/" },
    { name: "Rent", id: "rent", path: "/rent" },
    { name: "About Us", id: "about", path: "/about" },
    { name: "Blogs", id: "blogs", path: "/blogs" },
    // { name: "Career", id: "career", path: "/career" },
    { name: "Contact Us", id: "contact", path: "/contact" },
    { name: "Buy/Sale", id: "buy", path: "/buy" },
    { name: "Partner with us", id: "partner", path: "/partner" },
  ];

  const adminMenuItems = [
    { name: "🚗 Admin Dashboard", id: "admin", path: "/admin" }
  ];

  const getActiveSection = () => {
    const currentPath = location.pathname;
    
    if (currentPath === "/") {
      return "home";
    }
    
    const exactMatch = menuItems.find(item => item.path === currentPath);
    if (exactMatch) {
      return exactMatch.id;
    }
    
    const startsWithMatch = menuItems.find(item => 
      item.path !== "/" && currentPath.startsWith(item.path)
    );
    
    if (startsWithMatch) {
      return startsWithMatch.id;
    }
    
    // Strict admin check with verification
    if (currentPath === "/admin") {
      if (isLoggedIn && userInfo && (userInfo.role === 'admin' || userInfo.isAdmin === true)) {
        return "admin";
      } else {
        navigate("/");
        return null;
      }
    }
    
    if (currentPath === "/profile") {
      return "profile";
    }
    
    return null;
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setShowDropdown(!showDropdown);
    } else {
      navigate("/login", { 
        state: { 
          from: location.pathname,
          action: "profile" 
        } 
      });
    }
  };

  const handleLogout = () => {
    clearAuthData();
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

  const handleChangeLocation = () => {
    setShowLocationPopup(true);
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

  // Show loading state while verifying authentication
  if (isVerifyingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Use MobileLayout for mobile devices
  if (isMobile) {
    return (
      <>
        <MobileLayout>
          {children}
        </MobileLayout>
        {showLocationPopup && (
          <LocationPopup 
            onLocationSelect={handleCitySelect}
            onClose={() => setShowLocationPopup(false)}
          />
        )}
      </>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Location Popup */}
      {showLocationPopup && (
        <LocationPopup 
          onLocationSelect={handleCitySelect}
          onClose={() => setShowLocationPopup(false)}
        />
      )}

      {/* Desktop Navigation Header - Fixed with hide/show behavior */}
      <nav 
        className={`fixed top-0 left-0 right-0 bg-white backdrop-blur-lg text-slate-800 flex justify-between items-center px-6 lg:px-10 py-4 z-50 border-b border-slate-200 shadow-sm transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Left Section - Logo + App Name */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="All Ride Rental"
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-gold-400 group-hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-lg lg:text-xl font-light text-slate-800 tracking-wide">
            All Ride <span className="font-semibold text-gold-500">Rental</span>
          </h1>
        </div>

        {/* Center Section - City Selector */}
        <div className="hidden lg:flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-50 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-300 min-w-[200px]">
            <span className="text-slate-600 text-sm flex items-center">
              <span className="mr-2">📍</span>
              Location:
            </span>
            {citiesLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gold-500 mr-2"></div>
                <span className="text-slate-500 text-sm">Loading...</span>
              </div>
            ) : (
              <select
                value={selectedCity}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="bg-transparent border-none focus:ring-0 focus:outline-none text-slate-800 font-medium text-sm cursor-pointer w-full"
              >
                {availableCities.map((city, index) => (
                  <option key={index} value={city} className="text-slate-800">
                    {city === "All Cities" ? "All Cities" : city}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          {/* Change Location Button */}
          <button
            onClick={handleChangeLocation}
            className="bg-gold-500 hover:bg-gold-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105 shadow-md flex items-center"
          >
            <span className="mr-1">🔄</span>
            Change
          </button>
        </div>

        {/* Right Section - Menu */}
        <ul className="hidden lg:flex space-x-6 text-xs lg:text-sm font-medium items-center">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`relative cursor-pointer transition-all duration-300 hover:text-gold-500 text-sm ${
                getActiveSection() === item.id ? "text-gold-500" : "text-slate-700"
              }`}
            >
              {item.name}
              {getActiveSection() === item.id && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold-500 rounded-full"></span> 
              )}
            </li>
          ))}

          {/* Admin Navigation Items - Only show after verification */}
          {isLoggedIn && userInfo && (userInfo.role === 'admin' || userInfo.isAdmin === true) && (
            <>
              {adminMenuItems.map((item) => (
                <li
                  key={item.id}
                  onClick={() => navigate(item.path, { state: { scrollToAdmin: true } })}
                  className={`relative cursor-pointer transition-all duration-300 hover:text-gold-500 text-sm ${
                    getActiveSection() === item.id ? "text-gold-500" : "text-slate-700"
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
              className="flex items-center cursor-pointer hover:text-gold-500 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm"
              onClick={handleProfileClick}
            >
              <FaUserCircle
                size={16}
                className="mr-2 hover:scale-105 transition-transform duration-300 text-slate-700"
              />
              <span className="text-slate-700 text-sm">
                {isLoggedIn ? (userInfo?.name || "My Profile") : "My Profile"}
              </span>
              {isLoggedIn && (
                <FaChevronDown 
                  size={12} 
                  className={`ml-2 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''} text-slate-600`}
                />
              )}
            </div>

            {/* Dropdown Menu */}
            {isLoggedIn && showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white backdrop-blur-lg rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-200 mb-2">
                  <p className="text-xs text-slate-600 font-semibold">Current Location</p>
                  <p className="text-sm text-gold-600 font-bold">{selectedCity}</p>
                </div>
                
                <button
                  onClick={handleViewProfile}
                  className="w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-100 hover:text-gold-500 transition-colors flex items-center text-xs"
                >
                  <FaUserCircle className="mr-2" size={14} />
                  View Profile
                </button>
                <button
                  onClick={handleViewBookings}
                  className="w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-100 hover:text-gold-500 transition-colors flex items-center text-xs"
                >
                  <span className="mr-2">📋</span>
                  My Bookings
                </button>
                
                <button
                  onClick={handleChangeLocation}
                  className="w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-100 hover:text-gold-500 transition-colors flex items-center text-xs border-t border-slate-200 mt-2"
                >
                  <span className="mr-2">📍</span>
                  Change Location
                </button>
                
                <div className="border-t border-slate-200 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-500 hover:bg-slate-100 hover:text-red-600 transition-colors flex items-center text-xs"
                >
                  <span className="mr-2">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>

        {/* Mobile City Info - Hidden on desktop */}
        <div className="lg:hidden flex items-center space-x-2">
          <span className="text-slate-600 text-xs">📍</span>
          <span className="text-slate-700 text-xs font-medium">
            {selectedCity === "All Cities" ? "All Locations" : selectedCity}
          </span>
        </div>
      </nav>

      {/* Page Content with padding for fixed header */}
      <main className="flex-grow bg-white pt-16">
        <div className="w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;