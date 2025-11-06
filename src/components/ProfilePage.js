// Updated ProfilePage.js with Admin functionality using existing admin APIs
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI, adminAPI } from "../services/apiService";
import VehicleAvailabilityManager from "./VehicleAvailabilityManager";
import AdminStatsDashboard from "./AdminStatsDashboard";
import VehiclePriceManager from "../components/VehiclePriceManager";
import VehiclePurposeManager from "../components/VehiclePurposeManager";

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
  const [adminBookings, setAdminBookings] = useState({
    completed: [],
    upcoming: []
  });
  const [adminLoading, setAdminLoading] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('upcoming');
  
  const profileSectionRef = useRef(null);
  const bookingsSectionRef = useRef(null);
  const adminSectionRef = useRef(null);

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
    } else if (location.state?.scrollToAdmin && adminSectionRef.current) {
      setTimeout(() => {
        adminSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.state]);

  // Check admin role and load data
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

        // First, check if user is admin using existing admin API
        let isUserAdmin = false;
        try {
          const adminCheck = await adminAPI.checkAdminRole(userPhone);
          isUserAdmin = adminCheck.isAdmin;
          setIsAdmin(isUserAdmin);
          console.log("User is admin:", isUserAdmin);
        } catch (adminError) {
          console.log("Admin check failed:", adminError);
        }

        // Load user profile data
        try {
          console.log("Calling profile API...");
          const response = await authAPI.getUserProfile(userPhone);
          console.log("Profile API Response:", response);

          if (response && response.success) {
            const user = response.profile?.user || response.user || response;
            
            if (user) {
              setUserData(user);
              setFormData(user);
            }

            // For ALL users (including admin), show personal bookings
            setUserBookings(response.bookings || response.profile?.bookings || []);

            // Check admin role but don't load admin data here
            let isUserAdmin = false;
            try {
              const adminCheck = await adminAPI.checkAdminRole(userPhone);
              isUserAdmin = adminCheck.isAdmin;
              setIsAdmin(isUserAdmin);
              console.log("User is admin:", isUserAdmin);
            } catch (adminError) {
              console.log("Admin check failed:", adminError);
            }

            console.log("Data successfully loaded from API");
            return;
          }
        } catch (apiError) {
          console.log("API call failed, will use localStorage fallback:", apiError);
        }

        // Fallback to localStorage
        console.log("Using localStorage as fallback...");
        const userDataStr = localStorage.getItem("userData");
        const bookingsDataStr = localStorage.getItem("userBookings");

        let parsedUser = null;
        let parsedBookings = [];

        if (userDataStr) {
          try {
            const userObj = JSON.parse(userDataStr);
            parsedUser = userObj.profile?.user || userObj.user || userObj;
            
            if (parsedUser.role === 'admin' || parsedUser.isAdmin) {
              setIsAdmin(true);
            }
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }

        if (bookingsDataStr) {
          try {
            const bookingsObj = JSON.parse(bookingsDataStr);
            parsedBookings = bookingsObj.bookings || bookingsObj || [];
          } catch (e) {
            console.error("Error parsing bookings data:", e);
          }
        }

        if (parsedUser) {
          setUserData(parsedUser);
          setFormData(parsedUser);
        }
        
        if (parsedBookings && Array.isArray(parsedBookings)) {
          setUserBookings(parsedBookings);
        }

      } catch (error) {
        console.error("Error loading user data:", error);
        setMessage("Error loading profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  // Load admin-specific data using existing admin endpoints
  const loadAdminData = async () => {
    if (!isAdmin) return;
    
    try {
      setAdminLoading(true);
      console.log("Loading admin data using admin APIs...");
      
      // Use the existing admin endpoints from AdminController
      const [upcomingResponse, completedResponse] = await Promise.all([
        adminAPI.getUpcomingBookings(),
        adminAPI.getCompletedBookings()
      ]);

      setAdminBookings({
        upcoming: upcomingResponse.data || upcomingResponse || [],
        completed: completedResponse.data || completedResponse || []
      });

    } catch (error) {
      console.error("Error loading admin data:", error);
      setMessage("Error loading admin bookings data");
      
      // Fallback: try to get data from profile endpoint
      try {
        const userPhone = localStorage.getItem("userPhone");
        const response = await authAPI.getUserProfile(userPhone);
        if (response && response.success) {
          setAdminBookings({
            upcoming: response.profile?.upcomingBookings || [],
            completed: response.profile?.completedBookings || []
          });
        }
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    } finally {
      setAdminLoading(false);
    }
  };

  // Admin booking management functions - using existing admin APIs
  const handleUpdateBooking = async (bookingId, updateData) => {
    try {
      setAdminLoading(true);
      const response = await adminAPI.updateBooking(bookingId, updateData);
      
      if (response.success) {
        setMessage("Booking updated successfully!");
        loadAdminData(); // Refresh admin data
      } else {
        throw new Error(response.message || "Failed to update booking");
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
      setMessage("Failed to update booking. Please try again.");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setAdminLoading(true);
      const response = await adminAPI.cancelBooking(bookingId);
      
      if (response.success) {
        setMessage("Booking cancelled successfully!");
        loadAdminData(); // Refresh admin data
      } else {
        throw new Error(response.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      setMessage("Failed to cancel booking. Please try again.");
    } finally {
      setAdminLoading(false);
    }
  };

  // Existing functions (unchanged)
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
      <div className="max-w-7xl mx-auto">
        {/* Profile Section */}
        <div ref={profileSectionRef} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <h1 className="text-3xl font-light text-white mb-8 text-center">
            My <span className="font-semibold text-gold-400">Profile</span>
            {isAdmin && <span className="ml-2 bg-red-500 text-white text-sm px-3 py-1 rounded-full">Admin</span>}
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

                {isAdmin && (
                  <div className="md:col-span-2">
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Role
                    </label>
                    <div className="px-4 py-3 bg-red-500/20 rounded-xl text-red-300 border border-red-500/30">
                      Administrator
                    </div>
                  </div>
                )}
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

        {/* Personal Bookings Section (for non-admin users) */}
        <div ref={bookingsSectionRef} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-light text-white mb-6 text-center">
            My <span className="font-semibold text-gold-400">Bookings</span>
          </h2>

          {userBookings && userBookings.length > 0 ? (
              <div className="space-y-6">
                {userBookings.map((booking, index) => (
                  <div key={booking.id || index} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-gold-400/50 transition-all duration-300">
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

// // Admin Booking Card Component
const AdminBookingCard = ({ booking, type, onUpdate, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    pickupDate: booking.startDate || booking.pickupDate,
    pickupTime: booking.pickupTime,
    dropoffDate: booking.endDate || booking.dropoffDate,
    dropoffTime: booking.dropoffTime,
    pickupLocation: booking.pickupLocation,
    status: booking.status
  });

  const handleSave = () => {
    onUpdate(booking.id, editData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      pickupDate: booking.startDate || booking.pickupDate,
      pickupTime: booking.pickupTime,
      dropoffDate: booking.endDate || booking.dropoffDate,
      dropoffTime: booking.dropoffTime,
      pickupLocation: booking.pickupLocation,
      status: booking.status
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-gold-400/30 transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
        <div className="w-full lg:w-32 h-32 rounded-lg flex-shrink-0 overflow-hidden">
          {booking.vehicleImageUrl || booking.vehicleImage ? (
            <img 
              src={booking.vehicleImageUrl || booking.vehicleImage}
              alt={booking.vehicleName || booking.vehicle || 'Vehicle'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {booking.vehicleName || booking.vehicle}
              </h3>
              <p className="text-gold-400 font-semibold">
                ₹{(booking.totalAmount || 0).toLocaleString()}
              </p>
              <p className="text-white/60 text-sm">
                Customer: {booking.customerName} ({booking.customerPhone})
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-2 lg:mt-0">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  {type === 'upcoming' && (
                    <button
                      onClick={() => onCancel(booking.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
              {/* Pickup Date and Time */}
              <div>
                <label className="text-sm text-white/60 block mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={editData.pickupDate ? editData.pickupDate.split('T')[0] : ''}
                  onChange={(e) => setEditData({...editData, pickupDate: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-white/60 block mb-1">Pickup Time</label>
                <input
                  type="time"
                  value={editData.pickupTime}
                  onChange={(e) => setEditData({...editData, pickupTime: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                />
              </div>
              
              {/* Dropoff Date and Time */}
              <div>
                <label className="text-sm text-white/60 block mb-1">Dropoff Date</label>
                <input
                  type="date"
                  value={editData.dropoffDate ? editData.dropoffDate.split('T')[0] : ''}
                  onChange={(e) => setEditData({...editData, dropoffDate: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-white/60 block mb-1">Dropoff Time</label>
                <input
                  type="time"
                  value={editData.dropoffTime}
                  onChange={(e) => setEditData({...editData, dropoffTime: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                />
              </div>
              
              {/* Location and Status */}
              <div className="md:col-span-2">
                <label className="text-sm text-white/60 block mb-1">Pickup Location</label>
                <input
                  type="text"
                  value={editData.pickupLocation}
                  onChange={(e) => setEditData({...editData, pickupLocation: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-white/60 block mb-1">Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                  style={{ color: 'white' }}
                >
                  <option value="confirmed" style={{ color: 'black', background: 'white' }}>Confirmed</option>
                  <option value="completed" style={{ color: 'black', background: 'white' }}>Completed</option>
                  <option value="cancelled" style={{ color: 'black', background: 'white' }}>Cancelled</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-white/80">
              <div>
                <p className="text-sm text-white/60">Booking ID</p>
                <p className="font-medium">#{booking.id}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Booking Date</p>
                <p className="font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Status</p>
                <p className={`font-medium capitalize ${
                  booking.status === 'confirmed' ? 'text-green-400' :
                  booking.status === 'completed' ? 'text-blue-400' :
                  'text-red-400'
                }`}>
                  {booking.status}
                </p>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-sm text-white/60">Rental Period</p>
                <p className="font-medium">
                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60">Pickup Date & Time</p>
                <p className="font-medium">
                  {new Date(booking.startDate).toLocaleDateString()} at {booking.pickupTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60">Dropoff Date & Time</p>
                <p className="font-medium">
                  {new Date(booking.endDate).toLocaleDateString()} at {booking.dropoffTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60">Pickup Location</p>
                <p className="font-medium">{booking.pickupLocation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;