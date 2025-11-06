// components/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI, statsAPI } from "../services/apiService";
import VehicleAvailabilityManager from "./VehicleAvailabilityManager";
import AdminStatsDashboard from "./AdminStatsDashboard";
import VehiclePriceManager from "./VehiclePriceManager";
import VehiclePurposeManager from "./VehiclePurposeManager";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const [adminBookings, setAdminBookings] = useState({
    upcoming: [],
    completed: []
  });
  const [adminLoading, setAdminLoading] = useState(false);
  const [bookingsSubTab, setBookingsSubTab] = useState('upcoming');

  // Check admin access and load data
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const userPhone = localStorage.getItem("userPhone");
        
        if (!isLoggedIn || !userPhone) {
          navigate("/login", { state: { from: "/admin" } });
          return;
        }

        // Check admin role
        const adminCheck = await adminAPI.checkAdminRole(userPhone);
        if (!adminCheck.isAdmin) {
          setUserInfo(null);
          setIsAdmin(false);
          navigate("/profile");
          return;
        }

        setIsAdmin(true);
        setUserInfo(adminCheck.user);

        // Load admin data
        await loadAdminData();

      } catch (error) {
        console.error("Admin access check failed:", error);
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
    } finally {
      setAdminLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-white">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-red-400">🚫</div>
          <h2 className="text-2xl font-semibold text-white mb-4">Access Denied</h2>
          <p className="text-white/70 mb-6">You don't have permission to access the admin dashboard.</p>
          <button
            onClick={() => navigate("/profile")}
            className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-6 py-3 rounded-xl font-semibold"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-light text-white mb-2">
                <span className="font-semibold text-gold-400">Admin</span> Dashboard
              </h1>
              <p className="text-white/70">
                Welcome back, {userInfo?.name || 'Admin'}! Manage your rental business efficiently.
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm border border-red-500/30">
                Administrator
              </span>
              <button
                onClick={() => navigate("/profile")}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
              >
                My Profile
              </button>
            </div>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-8 border-b border-white/20 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'stats' 
                  ? 'bg-gold-500 text-slate-900' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'bookings' 
                  ? 'bg-gold-500 text-slate-900' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              📅 Bookings
            </button>
            <button
              onClick={() => setActiveTab('prices')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'prices' 
                  ? 'bg-gold-500 text-slate-900' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              💰 Price Management
            </button>
            <button
              onClick={() => setActiveTab('purpose')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'purpose' 
                  ? 'bg-gold-500 text-slate-900' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              🎯 Purpose Management
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'vehicles' 
                  ? 'bg-gold-500 text-slate-900' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              🚗 Vehicle Availability
            </button>
          </div>

          {adminLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400 mx-auto mb-4"></div>
              <p className="text-white/70">Loading admin data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Statistics Dashboard Tab */}
              {activeTab === 'stats' && <AdminStatsDashboard />}

              {/* Bookings Management Tab */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <div className="flex space-x-4 mb-6">
                    <button
                      onClick={() => setBookingsSubTab('upcoming')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        bookingsSubTab === 'upcoming' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      📅 Upcoming ({adminBookings.upcoming.length})
                    </button>
                    <button
                      onClick={() => setBookingsSubTab('completed')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        bookingsSubTab === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      ✅ Completed ({adminBookings.completed.length})
                    </button>
                  </div>

                  {/* Show bookings based on sub-tab selection */}
                  {bookingsSubTab === 'upcoming' && (
                    <>
                      <h3 className="text-2xl font-semibold text-white mb-4">
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
                          />
                        ))
                      ) : (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-6xl mb-4 text-white/40">📅</div>
                          <p className="text-white/70 text-lg mb-2">No upcoming bookings</p>
                          <p className="text-white/50 text-sm">All upcoming bookings will appear here</p>
                        </div>
                      )}
                    </>
                  )}

                  {bookingsSubTab === 'completed' && (
                    <>
                      <h3 className="text-2xl font-semibold text-white mb-4">
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
                          />
                        ))
                      ) : (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-6xl mb-4 text-white/40">✅</div>
                          <p className="text-white/70 text-lg mb-2">No completed bookings</p>
                          <p className="text-white/50 text-sm">Completed bookings will appear here</p>
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
              {activeTab === 'vehicles' && <VehicleAvailabilityManager />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Admin Booking Card Component (reuse from ProfilePage)
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
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
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
                <p className="text-sm text-white/60">Status</p>
                <p className={`font-medium capitalize ${
                  booking.status === 'confirmed' ? 'text-green-400' :
                  booking.status === 'completed' ? 'text-blue-400' :
                  'text-red-400'
                }`}>
                  {booking.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60">Booking Date</p>
                <p className="font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-sm text-white/60">Rental Period</p>
                <p className="font-medium">
                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
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

export default AdminDashboard;