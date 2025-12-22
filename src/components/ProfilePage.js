import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI, adminAPI } from "../services/apiService";

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  
  const profileSectionRef = useRef(null);
  const bookingsSectionRef = useRef(null);

  // Helper function to clear auth data and redirect to login
  const clearAuthAndRedirect = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userBookings");
    navigate("/login");
  };

  // Format time display function
  const formatTimeDisplay = (timeString) => {
    if (!timeString) return 'Not set';
    
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch {
      return timeString;
    }
  };

  useEffect(() => {
    if (location.state?.scrollToBookings && bookingsSectionRef.current) {
      setTimeout(() => {
        bookingsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } else if (location.state?.scrollToProfile && profileSectionRef.current) {
      setTimeout(() => {
        profileSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.state]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setMessage("");
        
        const userPhone = localStorage.getItem("userPhone");
        if (!userPhone) {
          clearAuthAndRedirect();
          return;
        }

        // Verify user exists and get fresh data from API
        try {
          const response = await authAPI.getUserProfile(userPhone);

          if (response && response.success) {
            const user = response.profile?.user || response.user || response;
            
            if (user && user.phone === userPhone) {
              setUserData(user);
              setFormData(user);

              // Check admin role with API
              try {
                const adminCheck = await adminAPI.checkAdminRole(userPhone);
                setIsAdmin(adminCheck.isAdmin === true);
              } catch (adminError) {
                console.log("Admin API check failed, using user data:", adminError);
                setIsAdmin(user.role === 'admin' || user.isAdmin === true);
              }

              setUserBookings(response.bookings || response.profile?.bookings || []);
              
              // Update localStorage with fresh verified data
              const currentUserData = JSON.parse(localStorage.getItem("userData") || "{}");
              const updatedUserData = {
                ...currentUserData,
                profile: {
                  ...currentUserData.profile,
                  user: user
                }
              };
              localStorage.setItem("userData", JSON.stringify(updatedUserData));
            } else {
              // User data mismatch - clear auth
              clearAuthAndRedirect();
              return;
            }
          } else {
            throw new Error("Failed to fetch user profile from API");
          }
        } catch (apiError) {
          console.error("API call failed:", apiError);
          // If API fails, user is not properly authenticated
          clearAuthAndRedirect();
          return;
        }

      } catch (error) {
        console.error("Error loading user data:", error);
        setMessage("Authentication failed. Please login again.");
        clearAuthAndRedirect();
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setMessage("");
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setMessage("");

      if (!userData?.phone) {
        setMessage("User phone not found");
        return;
      }

      const response = await authAPI.updateUser({
        phone: userData.phone,
        name: formData.name || "",
        email: formData.email || "",
        dob: formData.dob || ""
      });

      if (response.success) {
        const updatedUser = { ...userData, ...formData };
        
        const currentUserData = JSON.parse(localStorage.getItem("userData") || "{}");
        const updatedUserData = {
          ...currentUserData,
          profile: {
            ...currentUserData.profile,
            user: updatedUser
          }
        };
        
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        setUserData(updatedUser);
        setMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(userData || {});
    setIsEditing(false);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Lighter Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4)), url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Profile Section */}
        <div ref={profileSectionRef} className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 mb-8 shadow-lg">
          <h1 className="text-2xl font-light text-slate-800 mb-8 text-center">
            My <span className="font-semibold text-gold-500">Profile</span>
            {isAdmin && <span className="ml-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full">Admin</span>}
          </h1>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-center text-sm ${
              message.includes("success") 
                ? "bg-green-100 text-green-700 border border-green-300" 
                : "bg-red-100 text-red-700 border border-red-300"
            }`}>
              {message}
            </div>
          )}

          {userData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-blue-50 rounded-xl text-slate-800 border border-blue-200 text-sm">
                      {userData.name || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <div className="px-4 py-3 bg-blue-50 rounded-xl text-slate-800 border border-blue-200 text-sm">
                    +91 {userData.phone}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-blue-50 rounded-xl text-slate-800 border border-blue-200 text-sm">
                      {userData.email || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-blue-50 rounded-xl text-slate-800 border border-blue-200 text-sm">
                      {formatDate(userData.dob)}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Member Since
                  </label>
                  <div className="px-4 py-3 bg-blue-50 rounded-xl text-slate-800 border border-blue-200 text-sm">
                    {formatDate(userData.joinDate || userData.createdAt)}
                  </div>
                </div>

                {isAdmin && (
                  <div className="md:col-span-2">
                    <label className="block text-slate-700 text-sm font-medium mb-2">
                      Role
                    </label>
                    <div className="px-4 py-3 bg-red-100 rounded-xl text-red-700 border border-red-300 text-sm">
                      Administrator
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-center space-x-4">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saveLoading}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg text-sm"
                    >
                      {saveLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-slate-500 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600 text-sm mb-4">User data not found</p>
              <button
                onClick={() => navigate("/login")}
                className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg text-sm"
              >
                Login Again
              </button>
            </div>
          )}
        </div>

        {/* Personal Bookings Section */}
        <div ref={bookingsSectionRef} className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 shadow-lg">
          <h2 className="text-xl font-light text-slate-800 mb-6 text-center">
            My <span className="font-semibold text-gold-500">Bookings</span>
          </h2>

          {userBookings && userBookings.length > 0 ? (
              <div className="space-y-6">
                {userBookings.map((booking, index) => (
                  <div key={booking.id || index} className="bg-blue-50 rounded-xl p-6 border border-blue-200 hover:border-gold-400 transition-all duration-300 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                      <div className="w-full lg:w-40 h-40 rounded-lg flex-shrink-0 overflow-hidden">
                        {booking.vehicleImageUrl || booking.vehicleImage ? (
                          <img 
                            src={booking.vehicleImageUrl || booking.vehicleImage}
                            alt={booking.vehicleName || booking.vehicle || 'Vehicle'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
                              e.target.className = 'w-full h-full object-cover';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-4xl">🚗</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                              {booking.vehicleName || booking.vehicle || `Booking ${index + 1}`}
                            </h3>
                            <p className="text-gold-500 font-semibold text-base">
                              ₹{(booking.totalAmount || 0).toLocaleString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs mt-2 lg:mt-0 ${
                            (booking.status || 'Confirmed').toLowerCase() === 'confirmed' 
                              ? 'bg-green-100 text-green-700' 
                              : (booking.status || 'Confirmed').toLowerCase() === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.status || 'Confirmed'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-600 text-sm">
                          <div>
                            <p className="text-slate-500 text-xs">Booking ID</p>
                            <p className="font-medium">#{booking.id}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Booking Date</p>
                            <p className="font-medium">{formatDateTime(booking.bookingDate)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Pickup Location</p>
                            <p className="font-medium">{booking.pickupLocation}</p>
                          </div>
                          <div className="md:col-span-2 lg:col-span-3">
                            <p className="text-slate-500 text-xs">Rental Period</p>
                            <p className="font-medium">
                              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Pickup Time</p>
                            <p className="font-medium">
                              {formatTimeDisplay(booking.pickupTime)}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Dropoff Time</p>
                            <p className="font-medium">
                              {formatTimeDisplay(booking.dropoffTime)}
                            </p>
                          </div>
                          {booking.insurance && (
                            <div>
                              <p className="text-slate-500 text-xs">Insurance</p>
                              <p className="font-medium capitalize text-sm">{booking.insurance}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <span className="text-3xl text-slate-400">📋</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">No bookings found</p>
                <p className="text-slate-500 text-xs mb-6">Start your journey by renting a vehicle</p>
                <button
                  onClick={() => navigate("/rent")}
                  className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                >
                  Rent a Vehicle
                </button>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default ProfilePage;