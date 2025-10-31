import React from "react";
import { useNavigate } from "react-router-dom";

const BookingsPage = () => {
  const navigate = useNavigate();
  // Mock bookings data - in real app, this would come from API
  const bookings = [
    {
      id: 1,
      vehicle: "Royal Enfield Classic 350",
      date: "2024-01-15",
      duration: "3 days",
      total: "₹4,500",
      status: "Completed"
    },
    {
      id: 2,
      vehicle: "Yamaha MT-15",
      date: "2024-01-20",
      duration: "2 days",
      total: "₹2,800",
      status: "Upcoming"
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-light text-white mb-8 text-center">
          My <span className="font-semibold text-gold-400">Bookings</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-gold-400/50 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">{booking.vehicle}</h3>
              <div className="space-y-2 text-white/80">
                <p>Date: {booking.date}</p>
                <p>Duration: {booking.duration}</p>
                <p className="text-gold-400 font-semibold">Total: {booking.total}</p>
                <p className={`inline-block px-3 py-1 rounded-full text-sm ${
                  booking.status === 'Completed' 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {booking.status}
                </p>
              </div>
              <button className="w-full mt-4 bg-gold-500 hover:bg-gold-600 text-slate-900 py-2 rounded-xl font-semibold transition-all duration-300">
                View Details
              </button>
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg mb-4">No bookings found</p>
            <button
              onClick={() => navigate("/rent")}
              className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Rent a Vehicle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;