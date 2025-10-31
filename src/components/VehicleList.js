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

  const filteredVehicles = VEHICLES.filter((vehicle) => vehicle.type === selectedType);

  const handleVehicleSelect = (vehicleId) => {
    navigate(`/vehicle/${vehicleId}?city=${encodeURIComponent(city)}`);
  };

  const VehicleCard = ({ vehicle }) => (
    <div 
      className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition cursor-pointer border border-gray-100"
      onClick={() => handleVehicleSelect(vehicle.id)}
    >
      <img 
        src={vehicle.image} 
        alt={vehicle.name} 
        className="rounded-lg mb-3 w-full h-48 object-cover"
      />
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-bold text-gray-800">{vehicle.name}</h4>
        <span className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-sm border border-yellow-200">
          ⭐ {vehicle.rating}
        </span>
      </div>
      <p className="text-gray-700 font-semibold mb-2">{vehicle.price}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {vehicle.features.map((feature, index) => (
          <span 
            key={index}
            className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-yellow-400 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logo-inspired styling */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
          >
            ← Back to Home
          </button>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              <span className="text-blue-600">A</span>
              <span className="text-gray-800"> RIDE</span>
              <span className="text-blue-600"> Central</span>
            </div>
          </div>
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
            Available Rides in <span className="text-blue-600">{city}</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Segmented Control */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Vehicle Type</h3>
              
              {/* Segmented Control */}
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setSelectedType("Car")}
                  className={`flex items-center px-4 py-3 rounded-xl transition duration-300 border ${
                    selectedType === "Car" 
                      ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                      : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  <span className="mr-3 text-xl">🚗</span>
                  <div className="text-left">
                    <div className="font-semibold">Cars</div>
                    <div className={`text-sm ${
                      selectedType === "Car" ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {VEHICLES.filter(v => v.type === "Car").length} available
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedType("Bike")}
                  className={`flex items-center px-4 py-3 rounded-xl transition duration-300 border ${
                    selectedType === "Bike" 
                      ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                      : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  <span className="mr-3 text-xl">🏍️</span>
                  <div className="text-left">
                    <div className="font-semibold">Bikes</div>
                    <div className={`text-sm ${
                      selectedType === "Bike" ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {VEHICLES.filter(v => v.type === "Bike").length} available
                    </div>
                  </div>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-3 text-gray-700">Quick Stats</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Vehicles:</span>
                    <span className="font-semibold text-blue-600">{VEHICLES.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cars:</span>
                    <span className="font-semibold text-green-600">{VEHICLES.filter(v => v.type === "Car").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bikes:</span>
                    <span className="font-semibold text-purple-600">{VEHICLES.filter(v => v.type === "Bike").length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Vehicle Grid */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedType === "Car" ? "🚗" : "🏍️"} {selectedType}s 
                  <span className="text-blue-600 ml-2">({filteredVehicles.length} available)</span>
                </h3>
                
                <select className="border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Sort by: Price (Low to High)</option>
                  <option>Sort by: Price (High to Low)</option>
                  <option>Sort by: Rating</option>
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
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="text-6xl mb-4">🚫</div>
                <p className="text-xl text-gray-600 mb-4">No {selectedType.toLowerCase()}s available in {city}</p>
                <p className="text-gray-500">Please check back later or try a different vehicle type.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleList;