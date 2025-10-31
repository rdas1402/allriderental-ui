import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vehicle = location.state?.vehicle;

  if (!vehicle) {
    navigate("/rent");
    return null;
  }

  const handleContinueRenting = () => {
    navigate("/rent");
  };

  const handleViewBookings = () => {
    navigate("/my-bookings");
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.9)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-green-400">✓</span>
          </div>

          <h1 className="text-3xl font-light text-white mb-4">
            Booking Confirmed! 🎉
          </h1>
          
          <p className="text-white/70 text-lg mb-8">
            Your {vehicle.name} has been successfully booked
          </p>

          {/* Vehicle Details */}
          <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
            <div className="flex items-center space-x-6">
              <div 
                className="w-24 h-24 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${vehicle.imageUrl})` }}
              ></div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-semibold text-xl mb-2">{vehicle.name}</h3>
                <p className="text-gold-400 font-semibold text-lg mb-1">{vehicle.price}</p>
                <p className="text-white/60 mb-2">📍 {vehicle.city}</p>
                <div className="flex flex-wrap gap-1">
                  {vehicle.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs border border-white/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
            <h3 className="text-white font-semibold mb-4 text-left">Booking Details</h3>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-white/60 text-sm">Booking ID</p>
                <p className="text-white font-medium">#BK{Date.now().toString().slice(-6)}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Booking Date</p>
                <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Pickup Location</p>
                <p className="text-white font-medium">{vehicle.city}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Status</p>
                <p className="text-green-400 font-medium">Confirmed</p>
              </div>
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
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-white/20"
            >
              View My Bookings
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-white/50 text-sm">
              A confirmation has been sent to your registered phone number
            </p>
            <p className="text-white/40 text-xs mt-2">
              Our team will contact you shortly for pickup details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;