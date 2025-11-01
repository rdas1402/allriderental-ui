import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleRentCars = () => {
    navigate("/rent?type=car");
  };

  const handleRentBikes = () => {
    navigate("/rent?type=bike");
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.9)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-light text-white mb-6 leading-tight">
            Welcome to <span className="font-semibold text-gold-400">All Ride Rental</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience luxury travel with our premium fleet of cars and bikes. 
            Your journey begins with us.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={handleRentCars}
              className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              🚗 Explore Cars
            </button>
            <button 
              onClick={handleRentBikes}
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 border border-white/30"
            >
              🏍️ Discover Bikes
            </button>
          </div>
        </div>

        {/* Vehicle Selection Section */}
        {/* Vehicle Selection Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
          <div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-gold-400 hover:translate-y-[-8px] group"
            onClick={handleRentCars}
          >
            {/* Car Image */}
            <div className="w-full h-48 mb-6 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Premium Cars"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">Premium Cars</h2>
            <p className="text-white/70 mb-4">Luxury sedans, SUVs, and sports cars for every occasion</p>
            <div className="text-gold-300 font-medium flex items-center group-hover:translate-x-2 transition-transform duration-300">
              Discover our fleet <span className="ml-2">→</span>
            </div>
          </div>
          
          <div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-gold-400 hover:translate-y-[-8px] group"
            onClick={handleRentBikes}
          >
            {/* Bike Image */}
            <div className="w-full h-48 mb-6 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                alt="Adventure Bikes"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">Adventure Bikes</h2>
            <p className="text-white/70 mb-4">Premium motorcycles for your thrilling adventures</p>
            <div className="text-gold-300 font-medium flex items-center group-hover:translate-x-2 transition-transform duration-300">
              Start your journey <span className="ml-2">→</span>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-2xl max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-white mb-12 text-center">
            Why Choose <span className="font-semibold text-gold-400">All Ride Rental</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: "⭐", title: "Premium Quality", desc: "Impeccably maintained luxury vehicles with regular service" },
              { icon: "💰", title: "Best Value", desc: "Competitive pricing for premium travel experiences" },
              { icon: "🔧", title: "24/7 Support", desc: "Round-the-clock concierge service for your convenience" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gold-400/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-gold-300">{item.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto text-center">
          {[
            { number: "500+", label: "Premium Vehicles" },
            { number: "50+", label: "Cities Covered" },
            { number: "10K+", label: "Happy Customers" }
          ].map((stat, index) => (
            <div key={index} className="text-white">
              <div className="text-3xl font-bold text-gold-400 mb-2">{stat.number}</div>
              <div className="text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;