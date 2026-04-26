import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { vehiclesAPI, bookingsAPI } from "../services/apiService";
import allRideRentalImage from "../assets/AllRideRental.jpg";
import { useCity } from "../context/CityContext"; // Import CityContext

const SubscriptionVehiclesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const deliveryDate = queryParams.get("date");
  const deliveryTime = queryParams.get("time");
  
  // Get selected city from CityContext instead of local state
  const { selectedCity } = useCity();
  
  const [selectedType, setSelectedType] = useState("All Types");
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("recommended");

  // Fetch available subscription vehicles
  const fetchAvailableVehicles = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!deliveryDate || !deliveryTime) {
        throw new Error("Delivery date and time are required");
      }

      // Call API to get available subscription vehicles
      const vehiclesData = await vehiclesAPI.getAvailableSubscriptionVehicles(
        deliveryDate,
        deliveryTime
      );
      
      setAvailableVehicles(vehiclesData);
      
    } catch (err) {
      console.error('Error fetching subscription vehicles:', err);
      setError(err.message || "Failed to load available vehicles");
      setAvailableVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract numeric monthly price
  const extractMonthlyPrice = (priceString) => {
    const priceMatch = priceString?.match(/\d+/);
    return priceMatch ? parseInt(priceMatch[0]) : 0;
  };

  // Sort vehicles based on selected option
  const sortVehicles = (vehicles, option) => {
    const sortedVehicles = [...vehicles];
    
    switch (option) {
      case "price-low-high":
        return sortedVehicles.sort((a, b) => {
          const priceA = extractMonthlyPrice(a.monthlyPrice);
          const priceB = extractMonthlyPrice(b.monthlyPrice);
          return priceA - priceB;
        });
      
      case "price-high-low":
        return sortedVehicles.sort((a, b) => {
          const priceA = extractMonthlyPrice(a.monthlyPrice);
          const priceB = extractMonthlyPrice(b.monthlyPrice);
          return priceB - priceA;
        });
      
      case "rating":
        return sortedVehicles.sort((a, b) => b.rating - a.rating);
      
      case "recommended":
      default:
        return sortedVehicles;
    }
  };

  // Filter vehicles based on selected city and type
  useEffect(() => {
    if (availableVehicles.length === 0) return;

    let filtered = availableVehicles;
    
    // Filter by selected city from context
    if (selectedCity && selectedCity !== "All Cities") {
      filtered = filtered.filter(vehicle => vehicle.city === selectedCity);
    }
    
    // Filter by selected type
    if (selectedType && selectedType !== "All Types") {
      filtered = filtered.filter(vehicle => vehicle.type === selectedType);
    }
    
    const sortedAndFiltered = sortVehicles(filtered, sortOption);
    setFilteredVehicles(sortedAndFiltered);
  }, [selectedCity, selectedType, availableVehicles, sortOption]);

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Handle subscription
  const handleSubscribe = async (vehicle) => {
    try {
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const userData = localStorage.getItem("userData");
  
      if (isLoggedIn && userData) {
        navigate("/subscription/booking", { 
          state: { 
            vehicle, 
            deliveryDate, 
            deliveryTime 
          } 
        });
      } else {
        navigate("/login", { 
          state: { 
            vehicle, 
            deliveryDate,
            deliveryTime,
            from: "/subscription/booking",
            action: "subscribe" 
          } 
        });
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      setError("Unable to process subscription. Please try again.");
    }
  };

  // Vehicle Card Component for Subscription - COMPACT VERSION
  const VehicleCard = ({ vehicle }) => {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-xl p-4 border border-blue-200 transition-all duration-300 hover:translate-y-[-2px] group shadow-md hover:shadow-lg hover:border-gold-400">
        <div 
          className="h-32 bg-cover bg-center rounded-lg mb-3 relative"
          style={{ backgroundImage: `url(${vehicle.imageUrl})` }}
        >
          <div className="absolute inset-0 rounded-lg bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
          
          {/* Availability Badge */}
          <div className="absolute top-2 right-2">
            <span className="bg-green-500/90 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
              ✅
            </span>
          </div>
          
          <div className="absolute bottom-2 left-2">
            <span className="bg-gold-500/90 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
              📍 {vehicle.city}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-semibold text-slate-800 group-hover:text-gold-500 transition-colors line-clamp-1">
            {vehicle.name}
          </h4>
          <span className="flex items-center bg-gold-100 text-gold-700 px-1.5 py-0.5 rounded text-xs border border-gold-300">
            ⭐ {vehicle.rating}
          </span>
        </div>
        
        <p className="text-gold-500 font-semibold text-sm mb-2">
          {vehicle.monthlyPrice || "₹153/day"}
        </p>
        
        <div className="text-xs text-slate-600 mb-3">
          <p>Delivery: {deliveryDate} at {deliveryTime}</p>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {vehicle.features && vehicle.features.slice(0, 2).map((feature, index) => (
            <span 
              key={index}
              className="bg-blue-50 text-slate-700 px-1.5 py-0.5 rounded text-xs border border-blue-200 line-clamp-1"
            >
              {typeof feature === 'object' ? 
                (feature.feature || feature.name || '').substring(0, 15) + 
                ((feature.feature || feature.name || '').length > 15 ? '...' : '') 
                : feature.substring(0, 15) + (feature.length > 15 ? '...' : '')
              }
            </span>
          ))}
          {vehicle.features && vehicle.features.length > 2 && (
            <span className="bg-blue-50 text-slate-700 px-1.5 py-0.5 rounded text-xs border border-blue-200">
              +{vehicle.features.length - 2}
            </span>
          )}
        </div>
        
        <button 
          onClick={() => handleSubscribe(vehicle)}
          className="w-full py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-md text-xs"
        >
          Subscribe Now
        </button>
      </div>
    );
  };

  // Retry failed API call
  const retryAPICall = () => {
    setError("");
    fetchAvailableVehicles();
  };

  useEffect(() => {
    fetchAvailableVehicles();
  }, [deliveryDate, deliveryTime]);

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* Background Image with inverted filter - same as MonthlySubscriptionPage */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Left Background Image - Inverted */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url(${allRideRentalImage})`,
            backgroundPosition: "right center",
            filter: "invert(100%)"
          }}
        ></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            MONTHLY <span className="text-gold-500">SUBSCRIPTION</span> VEHICLES
          </h1>
          <div className="text-xl font-semibold text-gold-500 mb-4">
            Available for Delivery on {deliveryDate} at {deliveryTime}
          </div>
          
          {/* Current Location Indicator */}
          {selectedCity && selectedCity !== "All Cities" && (
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4">
              <span className="text-blue-600 text-sm mr-2">📍</span>
              <span className="text-blue-700 text-sm font-medium">Currently viewing subscription vehicles in <strong>{selectedCity}</strong></span>
            </div>
          )}
          
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Choose from our premium subscription vehicles with flexible monthly plans starting at just ₹153/day
          </p>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="bg-white/90 rounded-lg p-6 mb-6 border border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-red-700 mb-2">Unable to Load Vehicles</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={retryAPICall}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Filters (City filter removed) */}
          <div className="lg:w-1/4">
            <div className="bg-white/90 rounded-lg p-6 sticky top-6 border border-blue-200">
              <h3 className="text-base font-bold mb-4 text-gray-800">Filters</h3>
              
              {/* Current Location Display (Read-only) */}
              <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <label className="block text-sm font-medium text-blue-700 mb-1">Current Location</label>
                <div className="flex items-center">
                  <span className="text-blue-600 mr-2">📍</span>
                  <span className="text-gray-800 font-semibold text-sm">
                    {selectedCity === "All Cities" ? "All Locations" : selectedCity}
                  </span>
                </div>
                <p className="text-gray-600 text-xs mt-1">
                  Change location from the dropdown in the header
                </p>
              </div>

              {/* Vehicle Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-gray-800 text-sm"
                >
                  <option value="All Types">All Types</option>
                  <option value="Car">Cars</option>
                  <option value="Bike">Bikes</option>
                </select>
              </div>

              {/* Delivery Info */}
              <div className="pt-6 border-t border-gray-300">
                <h4 className="font-bold mb-3 text-gray-800 text-sm">Delivery Details</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-semibold text-gold-500">{deliveryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-semibold text-gold-500">{deliveryTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-semibold text-blue-500">
                      {selectedCity === "All Cities" ? "All Cities" : selectedCity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Vehicles */}
          <div className="lg:w-3/4">
            {/* Vehicle Header */}
            <div className="bg-white/90 rounded-lg p-6 mb-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Available Subscription Vehicles
                    <span className="text-gold-500 ml-2 text-sm">
                      ({filteredVehicles.length} available
                      {selectedCity && selectedCity !== "All Cities" ? ` in ${selectedCity}` : ""})
                    </span>
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    Monthly subscription plans with free delivery and maintenance
                    {selectedCity && selectedCity !== "All Cities" && ` in ${selectedCity}`}
                  </p>
                </div>
                
                {!error && (
                  <select 
                    value={sortOption}
                    onChange={handleSortChange}
                    className="bg-white border border-gray-300 rounded-md px-4 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  >
                    <option value="recommended">Sort by: Recommended</option>
                    <option value="price-low-high">Sort by: Price (Low to High)</option>
                    <option value="price-high-low">Sort by: Price (High to Low)</option>
                    <option value="rating">Sort by: Rating</option>
                  </select>
                )}
              </div>
            </div>

            {/* Vehicle Grid */}
            {loading ? (
              <div className="text-center py-12 bg-white/90 rounded-lg border border-blue-200">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-sm">Loading available subscription vehicles...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white/90 rounded-lg border border-blue-200">
                <div className="text-6xl mb-4 text-red-400">⚠️</div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Unable to Load Vehicles</h3>
                <p className="text-gray-600 mb-6 text-sm">{error}</p>
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/90 rounded-lg border border-blue-200">
                <div className="text-6xl mb-4 text-gray-400">🚫</div>
                <p className="text-lg text-gray-800 mb-4 text-sm">
                  {selectedCity && selectedCity !== "All Cities" 
                    ? `No subscription vehicles available in ${selectedCity}`
                    : "No subscription vehicles available"}
                </p>
                <p className="text-gray-600 text-sm">
                  {selectedCity && selectedCity !== "All Cities" 
                    ? "Try changing your location or select a different delivery time."
                    : "Please try a different delivery time."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionVehiclesPage;