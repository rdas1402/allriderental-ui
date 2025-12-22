// components/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI, statsAPI, authAPI } from "../services/apiService";
import VehicleAvailabilityManager from "./VehicleAvailabilityManager";
import AdminStatsDashboard from "./AdminStatsDashboard";
import VehiclePriceManager from "./VehiclePriceManager";
import VehiclePurposeManager from "./VehiclePurposeManager";
import allRideRentalImage from "../assets/AllRideRental.jpg";
import VehicleManagement from "./VehicleManagement";
import CouponManagement from "./CouponManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const [adminBookings, setAdminBookings] = useState({
    upcoming: [],
    completed: [],
    cancelled: []
  });
  const [adminLoading, setAdminLoading] = useState(false);
  const [bookingsSubTab, setBookingsSubTab] = useState('upcoming');

  // Helper function to clear auth data
  const clearAuthData = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userBookings");
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

  // Enhanced admin access check with authentication verification
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const checkAdminAccess = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is logged in and verify with backend
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const userPhone = localStorage.getItem("userPhone");
        const userData = localStorage.getItem("userData");
        
        if (!isLoggedIn || !userPhone || !userData) {
          clearAuthData();
          navigate("/login", { state: { from: "/admin" } });
          return;
        }

        // Verify user exists and session is valid
        try {
          const userProfile = await authAPI.getUserProfile(userPhone);
          
          if (!userProfile || !userProfile.success) {
            throw new Error("User verification failed");
          }

          const user = userProfile.profile?.user || userProfile.user || userProfile;
          
          // Validate that the user data matches
          if (user.phone !== userPhone) {
            throw new Error("User data mismatch");
          }

          // Now check admin role with verified user
          const adminCheck = await adminAPI.checkAdminRole(userPhone);
          if (!adminCheck.isAdmin) {
            setUserInfo(null);
            setIsAdmin(false);
            navigate("/profile");
            return;
          }

          setIsAdmin(true);
          setUserInfo(user);

          // Load admin data only after successful verification
          await loadAdminData();

        } catch (authError) {
          console.error("Authentication verification failed:", authError);
          clearAuthData();
          navigate("/login", { state: { from: "/admin" } });
          return;
        }

      } catch (error) {
        console.error("Admin access check failed:", error);
        clearAuthData();
        navigate("/login", { state: { from: "/admin" } });
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  // Load admin-specific data
  const loadAdminData = async () => {
    try {
      setAdminLoading(true);
      
      const [upcomingResponse, completedResponse, cancelledResponse] = await Promise.all([
        adminAPI.getUpcomingBookings(),
        adminAPI.getCompletedBookings(),
        adminAPI.getCancelledBookings()
      ]);

      setAdminBookings({
        upcoming: upcomingResponse.data || upcomingResponse || [],
        completed: completedResponse.data || completedResponse || [],
        cancelled: cancelledResponse.data || cancelledResponse || []
      });
    } catch (error) {
      console.error("Error loading admin data:", error);
      // If admin data loading fails, it might indicate session issues
      if (error.response?.status === 401 || error.message?.includes('unauthorized')) {
        clearAuthData();
        navigate("/login");
      }
    } finally {
      setAdminLoading(false);
    }
  };

  // Admin booking management functions
  const handleUpdateBooking = async (bookingId, updateData) => {
    try {
      setAdminLoading(true);
      const response = await adminAPI.updateBooking(bookingId, updateData);
      
      if (response.success) {
        await loadAdminData(); // Refresh data
      } else {
        throw new Error(response.message || "Failed to update booking");
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
      if (error.response?.status === 401) {
        clearAuthData();
        navigate("/login");
      }
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
        await loadAdminData(); // Refresh data
      } else {
        throw new Error(response.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      if (error.response?.status === 401) {
        clearAuthData();
        navigate("/login");
      }
    } finally {
      setAdminLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4 text-red-400">🚫</div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Access Denied</h2>
          <p className="text-slate-600 mb-6 text-sm">You don't have permission to access the admin dashboard.</p>
          <button
            onClick={() => navigate("/profile")}
            className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-6 py-3 rounded-xl font-semibold transition-colors text-sm"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Image with Light Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Right Background Image - Inverted */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url(${allRideRentalImage})`,
            backgroundPosition: "right center",
            filter: "invert(100%)"
          }}
        ></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-light text-slate-800 mb-2">
                <span className="font-semibold text-gold-500">Admin</span> Dashboard
              </h1>
              <p className="text-slate-600 text-sm">
                Welcome back, {userInfo?.name || 'Admin'}! Manage your rental business efficiently.
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <span className="bg-red-500/20 text-red-700 px-3 py-1 rounded-full text-xs border border-red-300">
                Administrator
              </span>
              <button
                onClick={() => navigate("/profile")}
                className="bg-blue-50 hover:bg-blue-100 text-slate-700 px-4 py-2 rounded-lg transition-colors border border-blue-200 text-sm"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  clearAuthData();
                  navigate("/");
                }}
                className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg transition-colors border border-red-200 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 shadow-lg">
          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-8 border-b border-blue-200 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap text-sm ${
                activeTab === 'stats' 
                  ? 'bg-gold-500 text-slate-900' 
                  : 'bg-blue-50 text-slate-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap text-sm ${
                activeTab === 'bookings' 
                  ? 'bg-gold-500 text-slate-900' 
                  : 'bg-blue-50 text-slate-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              📅 Bookings
            </button>
            <button
              onClick={() => setActiveTab('prices')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap text-sm ${
                activeTab === 'prices' 
                  ? 'bg-gold-500 text-slate-900' 
                  : 'bg-blue-50 text-slate-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              💰 Price Management
            </button>
            <button
              onClick={() => setActiveTab('purpose')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap text-sm ${
                activeTab === 'purpose' 
                  ? 'bg-gold-500 text-slate-900' 
                  : 'bg-blue-50 text-slate-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              🎯 Purpose Management
            </button>
            <button
              onClick={() => setActiveTab('vehiclesAvailability')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap text-sm ${
                activeTab === 'vehiclesAvailability' 
                  ? 'bg-gold-500 text-slate-900' 
                  : 'bg-blue-50 text-slate-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              🚗 Vehicle Availability
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap text-sm ${
                activeTab === 'vehicles' 
                  ? 'bg-gold-500 text-slate-900' 
                  : 'bg-blue-50 text-slate-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              🚗 Vehicle Management
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap text-sm ${
                activeTab === 'coupons' 
                  ? 'bg-gold-500 text-slate-900' 
                  : 'bg-blue-50 text-slate-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              🎫 Coupon Management
            </button>
          </div>

          {adminLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto mb-4"></div>
              <p className="text-slate-600 text-sm">Loading admin data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Statistics Dashboard Tab */}
              {activeTab === 'stats' && <AdminStatsDashboard />}

              {/* Bookings Management Tab */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <div className="flex space-x-4 mb-6 overflow-x-auto">
                    <button
                      onClick={() => setBookingsSubTab('upcoming')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap text-sm ${
                        bookingsSubTab === 'upcoming' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-blue-50 text-slate-700 hover:bg-blue-100 border border-blue-200'
                      }`}
                    >
                      📅 Upcoming ({adminBookings.upcoming.length})
                    </button>
                    <button
                      onClick={() => setBookingsSubTab('completed')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap text-sm ${
                        bookingsSubTab === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-blue-50 text-slate-700 hover:bg-blue-100 border border-blue-200'
                      }`}
                    >
                      ✅ Completed ({adminBookings.completed.length})
                    </button>
                    <button
                      onClick={() => setBookingsSubTab('cancelled')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap text-sm ${
                        bookingsSubTab === 'cancelled' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-blue-50 text-slate-700 hover:bg-blue-100 border border-blue-200'
                      }`}
                    >
                      ❌ Cancelled ({adminBookings.cancelled.length})
                    </button>
                  </div>

                  {/* Show bookings based on sub-tab selection */}
                  {bookingsSubTab === 'upcoming' && (
                    <>
                      <h3 className="text-xl font-semibold text-slate-800 mb-4">
                        Upcoming Bookings ({adminBookings.upcoming.length})
                      </h3>
                      {adminBookings.upcoming.length > 0 ? (
                        adminBookings.upcoming.map((booking, index) => (
                          <AdminBookingCard
                            key={booking.id || index}
                            booking={booking}
                            type="upcoming"
                            onUpdate={handleUpdateBooking}
                            onCancel={handleCancelBooking}
                            formatTimeDisplay={formatTimeDisplay}
                          />
                        ))
                      ) : (
                        <div className="text-center py-12 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="text-6xl mb-4 text-slate-400">📅</div>
                          <p className="text-slate-600 text-sm mb-2">No upcoming bookings</p>
                          <p className="text-slate-500 text-xs">All upcoming bookings will appear here</p>
                        </div>
                      )}
                    </>
                  )}

                  {bookingsSubTab === 'completed' && (
                    <>
                      <h3 className="text-xl font-semibold text-slate-800 mb-4">
                        Completed Bookings ({adminBookings.completed.length})
                      </h3>
                      {adminBookings.completed.length > 0 ? (
                        adminBookings.completed.map((booking, index) => (
                          <AdminBookingCard
                            key={booking.id || index}
                            booking={booking}
                            type="completed"
                            onUpdate={handleUpdateBooking}
                            onCancel={handleCancelBooking}
                            formatTimeDisplay={formatTimeDisplay}
                          />
                        ))
                      ) : (
                        <div className="text-center py-12 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="text-6xl mb-4 text-slate-400">✅</div>
                          <p className="text-slate-600 text-sm mb-2">No completed bookings</p>
                          <p className="text-slate-500 text-xs">Completed bookings will appear here</p>
                        </div>
                      )}
                    </>
                  )}

                  {bookingsSubTab === 'cancelled' && (
                    <>
                      <h3 className="text-xl font-semibold text-slate-800 mb-4">
                        Cancelled Bookings ({adminBookings.cancelled.length})
                      </h3>
                      {adminBookings.cancelled.length > 0 ? (
                        adminBookings.cancelled.map((booking, index) => (
                          <AdminBookingCard
                            key={booking.id || index}
                            booking={booking}
                            type="cancelled"
                            onUpdate={handleUpdateBooking}
                            onCancel={handleCancelBooking}
                            formatTimeDisplay={formatTimeDisplay}
                          />
                        ))
                      ) : (
                        <div className="text-center py-12 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="text-6xl mb-4 text-slate-400">❌</div>
                          <p className="text-slate-600 text-sm mb-2">No cancelled bookings</p>
                          <p className="text-slate-500 text-xs">Cancelled bookings will appear here</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Price Management Tab */}
              {activeTab === 'prices' && <VehiclePriceManager />}

              {/* Purpose Management Tab */}
              {activeTab === 'purpose' && <VehiclePurposeManager />}

              {/* Vehicle Availability Tab */}
              {activeTab === 'vehiclesAvailability' && <VehicleAvailabilityManager />}

              {/* Vehicle Management Tab */}
              {activeTab === 'vehicles' && <VehicleManagement />}

              {/* Coupon Management Tab */}
              {activeTab === 'coupons' && <CouponManagement />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Admin Booking Card Component (reuse from ProfilePage)
const AdminBookingCard = ({ booking, type, onUpdate, onCancel, formatTimeDisplay }) => {
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
    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 hover:border-gold-400 transition-all duration-300 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
        <div className="w-full lg:w-32 h-32 rounded-lg flex-shrink-0 overflow-hidden">
          {booking.vehicleImageUrl || booking.vehicleImage ? (
            <img 
              src={booking.vehicleImageUrl || booking.vehicleImage}
              alt={booking.vehicleName || booking.vehicle || 'Vehicle'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800 mb-2">
                {booking.vehicleName || booking.vehicle}
              </h3>
              <p className="text-gold-500 font-semibold text-sm">
                ₹{(booking.totalAmount || 0).toLocaleString()}
              </p>
              <p className="text-slate-600 text-xs">
                Customer: {booking.customerName} ({booking.customerPhone})
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-2 lg:mt-0">
              {!isEditing ? (
                <>
                  {type !== 'cancelled' && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                      >
                        Edit
                      </button>
                      {type === 'upcoming' && (
                        <button
                          onClick={() => onCancel(booking.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 text-sm">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={editData.pickupDate ? editData.pickupDate.split('T')[0] : ''}
                  onChange={(e) => setEditData({...editData, pickupDate: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded text-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Pickup Time</label>
                <div className="relative">
                  <select
                    value={editData.pickupTime}
                    onChange={(e) => setEditData({...editData, pickupTime: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded text-slate-800 text-xs appearance-none cursor-pointer"
                  >
                    {Array.from({ length: 49 }, (_, i) => {
                      const totalMinutes = i * 30; // 30-minute intervals
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      
                      // 24-hour format
                      const time24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                      
                      // 12-hour format with AM/PM
                      const period = hours >= 12 ? 'PM' : 'AM';
                      const displayHours = hours % 12 || 12;
                      const time12 = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
                      
                      return (
                        <option key={time24} value={time24} className="text-slate-900 bg-white">
                          {time12}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Dropoff Date</label>
                <input
                  type="date"
                  value={editData.dropoffDate ? editData.dropoffDate.split('T')[0] : ''}
                  onChange={(e) => setEditData({...editData, dropoffDate: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded text-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Dropoff Time</label>
                <div className="relative">
                  <select
                    value={editData.dropoffTime}
                    onChange={(e) => setEditData({...editData, dropoffTime: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded text-slate-800 text-xs appearance-none cursor-pointer"
                  >
                    {Array.from({ length: 49 }, (_, i) => {
                      const totalMinutes = i * 30; // 30-minute intervals
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      
                      // 24-hour format
                      const time24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                      
                      // 12-hour format with AM/PM
                      const period = hours >= 12 ? 'PM' : 'AM';
                      const displayHours = hours % 12 || 12;
                      const time12 = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
                      
                      return (
                        <option key={time24} value={time24} className="text-slate-900 bg-white">
                          {time12}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-slate-600 block mb-1">Pickup Location</label>
                <input
                  type="text"
                  value={editData.pickupLocation}
                  onChange={(e) => setEditData({...editData, pickupLocation: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded text-slate-800 text-xs"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-slate-600 block mb-1">Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded text-slate-800 text-xs"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-700 text-sm">
              <div>
                <p className="text-xs text-slate-600">Booking ID</p>
                <p className="font-medium text-sm">#{booking.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Status</p>
                <p className={`font-medium text-sm capitalize ${
                  booking.status === 'confirmed' ? 'text-green-500' :
                  booking.status === 'completed' ? 'text-blue-500' :
                  'text-red-500'
                }`}>
                  {booking.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Booking Date</p>
                <p className="font-medium text-sm">{new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-xs text-slate-600">Rental Period</p>
                <p className="font-medium text-sm">
                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Pickup Time</p>
                <p className="font-medium text-sm">
                  {formatTimeDisplay(booking.pickupTime)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Dropoff Time</p>
                <p className="font-medium text-sm">
                  {formatTimeDisplay(booking.dropoffTime)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Pickup Location</p>
                <p className="font-medium text-sm">{booking.pickupLocation}</p>
              </div>
              {type === 'cancelled' && booking.cancellationReason && (
                <div className="md:col-span-2 lg:col-span-3">
                  <p className="text-xs text-slate-600">Cancellation Reason</p>
                  <p className="font-medium text-sm text-red-600">{booking.cancellationReason}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;