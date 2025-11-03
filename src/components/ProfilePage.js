import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/apiService";

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
  const profileSectionRef = useRef(null);
  const bookingsSectionRef = useRef(null);

  // Check if we should auto-scroll to specific section
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
      // Default: scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.state]);

  // Function to properly parse localStorage data (only used as fallback)
  const parseLocalStorageData = () => {
    try {
      const userDataStr = localStorage.getItem("userData");
      const bookingsDataStr = localStorage.getItem("userBookings");

      console.log("Using localStorage fallback - Raw userData:", userDataStr);
      console.log("Using localStorage fallback - Raw bookingsData:", bookingsDataStr);

      let parsedUser = null;
      let parsedBookings = [];

      // Parse user data
      if (userDataStr) {
        try {
          const userObj = JSON.parse(userDataStr);
          if (userObj && userObj.profile && userObj.profile.user) {
            parsedUser = userObj.profile.user;
          } else if (userObj && userObj.user) {
            parsedUser = userObj.user;
          } else {
            parsedUser = userObj;
          }
        } catch (e) {
          console.error("Error parsing user data from localStorage:", e);
        }
      }

      // Parse bookings data
      if (bookingsDataStr) {
        try {
          const bookingsObj = JSON.parse(bookingsDataStr);
          if (bookingsObj && bookingsObj.bookings && Array.isArray(bookingsObj.bookings)) {
            parsedBookings = bookingsObj.bookings;
          } else if (bookingsObj && Array.isArray(bookingsObj)) {
            parsedBookings = bookingsObj;
          }
        } catch (e) {
          console.error("Error parsing bookings data from localStorage:", e);
        }
      }

      return { user: parsedUser, bookings: parsedBookings };
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      return { user: null, bookings: [] };
    }
  };

  // Function to extract data from API response
  const extractDataFromAPIResponse = (response) => {
    let user = null;
    let bookings = [];

    if (response.success) {
      // Extract user data
      if (response.profile?.user) {
        user = response.profile.user;
      } else if (response.user) {
        user = response.user;
      }

      // Extract bookings data
      if (response.bookings && Array.isArray(response.bookings)) {
        bookings = response.bookings;
      } else if (response.profile?.bookings && Array.isArray(response.profile.bookings)) {
        bookings = response.profile.bookings;
      }
    }

    return { user, bookings };
  };

  // Function to update localStorage with fresh data
  const updateLocalStorageWithFreshData = (user, bookings, apiResponse) => {
    try {
      // Store user data
      if (user && apiResponse) {
        localStorage.setItem("userData", JSON.stringify(apiResponse));
      }

      // Store bookings data
      if (bookings && Array.isArray(bookings)) {
        localStorage.setItem("userBookings", JSON.stringify({
          bookings: bookings,
          success: true,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error("Error updating localStorage with fresh data:", error);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setMessage("");
        
        const userPhone = localStorage.getItem("userPhone");
        if (!userPhone) {
          navigate("/login");
          return;
        }

        console.log("=== STARTING DATA LOAD ===");

        // First try to get fresh data from API
        let apiDataLoaded = false;
        
        try {
          console.log("Calling API for profile data...");
          const response = await authAPI.getUserProfile(userPhone);
          console.log("API Response:", response);

          if (response && response.success) {
            // Extract data from API response
            const { user, bookings } = extractDataFromAPIResponse(response);
            console.log("Extracted from API - User:", user, "Bookings:", bookings);

            if (user) {
              // Update state with API data
              setUserData(user);
              setFormData(user);
              
              // Update localStorage with fresh API data
              updateLocalStorageWithFreshData(user, bookings, response);
              apiDataLoaded = true;
            }

            if (bookings && Array.isArray(bookings)) {
              setUserBookings(bookings);
              apiDataLoaded = true;
            }

            if (apiDataLoaded) {
              console.log("Data successfully loaded from API");
              return; // Exit early since API data was successfully loaded
            }
          } else {
            console.log("API response indicates failure:", response);
          }
        } catch (apiError) {
          console.log("API call failed, will use localStorage fallback:", apiError);
        }

        // Only use localStorage if API call failed or returned no data
        console.log("Using localStorage as fallback...");
        const { user, bookings } = parseLocalStorageData();
        
        if (user) {
          setUserData(user);
          setFormData(user);
        }
        
        if (bookings && Array.isArray(bookings)) {
          setUserBookings(bookings);
        }

        console.log("Final state from localStorage - User:", user, "Bookings:", bookings);

      } catch (error) {
        console.error("Error loading user data:", error);
        setMessage("Error loading profile data");
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
        
        // Update localStorage with the new user data
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Section */}
        <div ref={profileSectionRef} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <h1 className="text-3xl font-light text-white mb-8 text-center">
            My <span className="font-semibold text-gold-400">Profile</span>
          </h1>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-center ${
              message.includes("success") 
                ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}>
              {message}
            </div>
          )}

          {userData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-white/5 rounded-xl text-white border border-white/10">
                      {userData.name || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <div className="px-4 py-3 bg-white/5 rounded-xl text-white border border-white/10">
                    +91 {userData.phone}
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-white/5 rounded-xl text-white border border-white/10">
                      {userData.email || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-white/5 rounded-xl text-white border border-white/10">
                      {formatDate(userData.dob)}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Member Since
                  </label>
                  <div className="px-4 py-3 bg-white/5 rounded-xl text-white border border-white/10">
                    {formatDate(userData.joinDate || userData.createdAt)}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center space-x-4">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saveLoading}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                      {saveLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/70 text-lg mb-4">User data not found</p>
              <button
                onClick={() => navigate("/login")}
                className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-6 py-3 rounded-xl font-semibold"
              >
                Login Again
              </button>
            </div>
          )}
        </div>

        {/* Bookings Section */}
        <div ref={bookingsSectionRef} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-light text-white mb-6 text-center">
            My <span className="font-semibold text-gold-400">Bookings</span>
          </h2>

          {userBookings && userBookings.length > 0 ? (
            <div className="space-y-6">
              {userBookings.map((booking, index) => (
                <div key={booking.id || index} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-gold-400/50 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                    {/* Vehicle Image - Updated to use actual image from API */}
                    <div className="w-full lg:w-40 h-40 rounded-lg flex-shrink-0 overflow-hidden">
                      {booking.vehicleImageUrl || booking.vehicleImage ? (
                        <img 
                          src={booking.vehicleImageUrl || booking.vehicleImage}
                          alt={booking.vehicleName || booking.vehicle || 'Vehicle'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.target.src = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
                            e.target.className = 'w-full h-full object-cover';
                          }}
                        />
                      ) : (
                        // Fallback if no image is provided
                        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-4xl">🚗</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {booking.vehicleName || booking.vehicle || `Booking ${index + 1}`}
                          </h3>
                          <p className="text-gold-400 font-semibold text-lg">
                            ₹{(booking.totalAmount || 0).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm mt-2 lg:mt-0 ${
                          (booking.status || 'Confirmed').toLowerCase() === 'confirmed' 
                            ? 'bg-green-500/20 text-green-300' 
                            : (booking.status || 'Confirmed').toLowerCase() === 'completed'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {booking.status || 'Confirmed'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-white/80">
                        <div>
                          <p className="text-sm text-white/60">Booking ID</p>
                          <p className="font-medium">#{booking.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Booking Date</p>
                          <p className="font-medium">{formatDateTime(booking.bookingDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Pickup Location</p>
                          <p className="font-medium">{booking.pickupLocation}</p>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                          <p className="text-sm text-white/60">Rental Period</p>
                          <p className="font-medium">
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Pickup Time</p>
                          <p className="font-medium">{booking.pickupTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Dropoff Time</p>
                          <p className="font-medium">{booking.dropoffTime}</p>
                        </div>
                        {booking.insurance && (
                          <div>
                            <p className="text-sm text-white/60">Insurance</p>
                            <p className="font-medium capitalize">{booking.insurance}</p>
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
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white/40">📋</span>
              </div>
              <p className="text-white/70 text-lg mb-4">No bookings found</p>
              <p className="text-white/50 text-sm mb-6">Start your journey by renting a vehicle</p>
              <button
                onClick={() => navigate("/rent")}
                className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
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