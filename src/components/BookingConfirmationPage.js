// components/BookingConfirmationPage.js
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicle, booking, user } = location.state || {};

  // Fix scrolling issues
  useEffect(() => {
    // Ensure body scroll is enabled
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    
    // Reset any potential scroll locks
    document.body.classList.remove('no-scroll', 'overflow-hidden');
    
    // Scroll to top on page load
    window.scrollTo(0, 0);

    return () => {
      // Cleanup - ensure scrolling is enabled when leaving
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  useEffect(() => {
    // If no booking data, try to get from localStorage as fallback
    if (!vehicle || !booking) {
      const userBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
      const latestBooking = userBookings[0]; // Get the most recent booking
      
      if (latestBooking) {
        // You might need to reconstruct the vehicle object from the booking data
        // For now, redirect to rent if we can't properly reconstruct
        console.log("Found booking in localStorage:", latestBooking);
      } else {
        navigate("/rent");
      }
    }
  }, [vehicle, booking, navigate]);

  const handleContinueRenting = () => {
    navigate("/rent");
  };

  const handleViewBookings = () => {
    navigate("/profile");
  };

  if (!vehicle && !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Image with Light Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 shadow-2xl text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-300">
            <span className="text-4xl text-green-500">✓</span>
          </div>

          <h1 className="text-3xl font-light text-slate-800 mb-4">
            Booking Confirmed! 🎉
          </h1>
          
          <p className="text-slate-600 text-lg mb-8">
            Your {vehicle?.name || booking?.vehicle} has been successfully booked
          </p>

          {/* Vehicle Details */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
            <div className="flex items-center space-x-6">
              <div 
                className="w-24 h-24 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${vehicle?.imageUrl || booking?.vehicleImage})` }}
              ></div>
              <div className="flex-1 text-left">
                <h3 className="text-slate-800 font-semibold text-xl mb-2">{vehicle?.name || booking?.vehicle}</h3>
                <p className="text-gold-500 font-semibold text-lg mb-1">{vehicle?.price || booking?.total}</p>
                <p className="text-slate-600 mb-2">📍 {vehicle?.city || booking?.pickupLocation}</p>
                <div className="flex flex-wrap gap-1">
                  {(vehicle?.features || booking?.features || []).map((feature, index) => {
                    const featureText = typeof feature === 'string' 
                      ? feature 
                      : (feature?.feature || feature?.name || '');
                    
                    return featureText ? (
                      <span 
                        key={index}
                        className="bg-white text-slate-700 px-2 py-1 rounded text-xs border border-blue-300"
                      >
                        {featureText}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
            <h3 className="text-slate-800 font-semibold mb-4 text-left">Booking Details</h3>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-slate-600 text-sm">Booking ID</p>
                <p className="text-slate-800 font-medium">{booking?.id || `#BK${Date.now().toString().slice(-6)}`}</p>
              </div>
              <div>
                <p className="text-slate-600 text-sm">Booking Date</p>
                <p className="text-slate-800 font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-600 text-sm">Pickup Location</p>
                <p className="text-slate-800 font-medium">{vehicle?.city || booking?.pickupLocation}</p>
              </div>
              <div>
                <p className="text-slate-600 text-sm">Status</p>
                <p className="text-green-500 font-medium">Confirmed & Paid</p>
              </div>
              {booking?.duration && (
                <div className="col-span-2">
                  <p className="text-slate-600 text-sm">Rental Duration</p>
                  <p className="text-slate-800 font-medium">{booking.duration}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleContinueRenting}
              className="flex-1 bg-gold-500 hover:bg-gold-600 text-slate-900 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Continue Renting
            </button>
            <button
              onClick={handleViewBookings}
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-slate-700 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-blue-300"
            >
              View My Bookings
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              A confirmation has been sent to your registered phone number
            </p>
            <p className="text-slate-400 text-xs mt-2">
              Our team will contact you shortly for pickup details
            </p>
          </div>
          {/* Notification Status */}
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-center space-x-4 text-green-700">
              <div className="flex items-center">
                <span className="mr-2">📧</span>
                <span className="text-sm">Confirmation email sent</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📱</span>
                <span className="text-sm">SMS confirmation sent</span>
              </div>
            </div>
            <p className="text-green-600 text-xs text-center mt-2">
              Check your email and phone for booking details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;