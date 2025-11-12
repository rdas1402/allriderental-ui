// components/VehicleList.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import car1 from "../assets/car1.jpg";
import car2 from "../assets/car2.jpg";
import bike1 from "../assets/bike1.jpg";
import bike2 from "../assets/bike2.jpg";

// Vehicle data
const VEHICLES = [
  { 
    id: 1, 
    image: car1, 
    name: "Hyundai i20", 
    type: "Car", 
    price: "₹1200/day",
    features: ["5 Seats", "AC", "Automatic"],
    rating: 4.5
  },
  { 
    id: 2, 
    image: car2, 
    name: "Maruti Swift", 
    type: "Car", 
    price: "₹1000/day",
    features: ["5 Seats", "AC", "Manual"],
    rating: 4.3
  },
  { 
    id: 3, 
    image: bike1, 
    name: "Royal Enfield Classic 350", 
    type: "Bike", 
    price: "₹700/day",
    features: ["350cc", "Cruiser"],
    rating: 4.7
  },
  { 
    id: 4, 
    image: bike2, 
    name: "Yamaha R15", 
    type: "Bike", 
    price: "₹800/day",
    features: ["155cc", "Sports"],
    rating: 4.6
  },
];

function VehicleList() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get("city") || "Unknown City";
  
  const [selectedType, setSelectedType] = useState("Car"); // Default to Car
  const [sortOption, setSortOption] = useState("price-low-high"); // New state for sorting

  // Sort vehicles based on selected option
  const sortVehicles = (vehicles, option) => {
    const sortedVehicles = [...vehicles];
    
    switch (option) {
      case "price-low-high":
        return sortedVehicles.sort((a, b) => {
          const priceA = extractPrice(a.price);
          const priceB = extractPrice(b.price);
          return priceA - priceB;
        });
      
      case "price-high-low":
        return sortedVehicles.sort((a, b) => {
          const priceA = extractPrice(a.price);
          const priceB = extractPrice(b.price);
          return priceB - priceA;
        });
      
      case "rating":
        return sortedVehicles.sort((a, b) => b.rating - a.rating);
      
      default:
        return sortedVehicles;
    }
  };

  // Helper function to extract numeric price from string (e.g., "₹1200/day" -> 1200)
  const extractPrice = (priceString) => {
    const priceMatch = priceString.match(/\d+/);
    return priceMatch ? parseInt(priceMatch[0]) : 0;
  };

  // Filter and sort vehicles
  const filteredVehicles = sortVehicles(
    VEHICLES.filter((vehicle) => vehicle.type === selectedType),
    sortOption
  );

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleVehicleSelect = (vehicleId) => {
    navigate(`/vehicle/${vehicleId}?city=${encodeURIComponent(city)}`);
  };

  const VehicleCard = ({ vehicle }) => (
    <div 
      className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition cursor-pointer border border-blue-200"
      onClick={() => handleVehicleSelect(vehicle.id)}
    >
      <img 
        src={vehicle.image} 
        alt={vehicle.name} 
        className="rounded-lg mb-3 w-full h-48 object-cover"
      />
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-semibold text-slate-800">{vehicle.name}</h4>
        <span className="flex items-center bg-gold-50 text-gold-700 px-2 py-1 rounded text-sm border border-gold-200">
          ⭐ {vehicle.rating}
        </span>
      </div>
      <p className="text-gold-500 font-semibold mb-2">{vehicle.price}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {vehicle.features.map((feature, index) => (
          <span 
            key={index}
            className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-200"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Image with Light Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header with Logo-inspired styling */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg transition duration-300 font-semibold border border-slate-700"
          >
            ← Back to Home
          </button>
          <div className="text-center">
            <div className="text-2xl font-light text-slate-800">
              <span className="font-semibold text-gold-500">All Ride</span> Central
            </div>
          </div>
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>

        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-8 border border-blue-200">
          <h2 className="text-2xl md:text-3xl font-light text-center text-slate-800">
            Available Rides in <span className="font-semibold text-gold-500">{city}</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Segmented Control */}
          <div className="lg:w-1/4">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg p-6 sticky top-6 border border-blue-200">
              <h3 className="text-lg font-semibold mb-4 text-slate-800">Vehicle Type</h3>
              
              {/* Segmented Control */}
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setSelectedType("Car")}
                  className={`flex items-center px-4 py-3 rounded-xl transition duration-300 border ${
                    selectedType === "Car" 
                      ? "bg-gold-500 text-slate-900 border-gold-500 shadow-md" 
                      : "bg-white text-slate-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  <span className="mr-3 text-xl">🚗</span>
                  <div className="text-left">
                    <div className="font-semibold">Cars</div>
                    <div className={`text-sm ${
                      selectedType === "Car" ? "text-slate-700" : "text-slate-500"
                    }`}>
                      {VEHICLES.filter(v => v.type === "Car").length} available
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedType("Bike")}
                  className={`flex items-center px-4 py-3 rounded-xl transition duration-300 border ${
                    selectedType === "Bike" 
                      ? "bg-gold-500 text-slate-900 border-gold-500 shadow-md" 
                      : "bg-white text-slate-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  <span className="mr-3 text-xl">🏍️</span>
                  <div className="text-left">
                    <div className="font-semibold">Bikes</div>
                    <div className={`text-sm ${
                      selectedType === "Bike" ? "text-slate-700" : "text-slate-500"
                    }`}>
                      {VEHICLES.filter(v => v.type === "Bike").length} available
                    </div>
                  </div>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-blue-200">
                <h4 className="font-semibold mb-3 text-slate-700">Quick Stats</h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Total Vehicles:</span>
                    <span className="font-semibold text-gold-500">{VEHICLES.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cars:</span>
                    <span className="font-semibold text-blue-600">{VEHICLES.filter(v => v.type === "Car").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bikes:</span>
                    <span className="font-semibold text-green-600">{VEHICLES.filter(v => v.type === "Bike").length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Vehicle Grid */}
          <div className="lg:w-3/4">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">
                  {selectedType === "Car" ? "🚗" : "🏍️"} {selectedType}s 
                  <span className="text-gold-500 ml-2">({filteredVehicles.length} available)</span>
                </h3>
                
                <select 
                  value={sortOption}
                  onChange={handleSortChange}
                  className="border border-blue-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-slate-800"
                >
                  <option value="price-low-high">Sort by: Price (Low to High)</option>
                  <option value="price-high-low">Sort by: Price (High to Low)</option>
                  <option value="rating">Sort by: Rating</option>
                </select>
              </div>
            </div>

            {/* Vehicle Grid */}
            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-blue-200">
                <div className="text-6xl mb-4 text-slate-400">🚫</div>
                <p className="text-xl text-slate-600 mb-4">No {selectedType.toLowerCase()}s available in {city}</p>
                <p className="text-slate-500">Please check back later or try a different vehicle type.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleList;