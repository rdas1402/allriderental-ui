import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { citiesAPI, vehiclesAPI, bookingsAPI } from "../services/apiService";

const RentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get("type") === "bike" ? "Bike" : "Car";
  
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedType, setSelectedType] = useState(initialType);
  const [cities, setCities] = useState(["All Cities"]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [error, setError] = useState("");
  const [citiesError, setCitiesError] = useState("");
  const [vehiclesError, setVehiclesError] = useState("");
  const [sortOption, setSortOption] = useState("recommended");

  // Fetch cities from Java API using API service - UPDATED: Use rent-specific cities
  const fetchCities = async () => {
    try {
      setCitiesLoading(true);
      setCitiesError("");
      
      const citiesData = await vehiclesAPI.getAvailableCitiesForRent(); // UPDATED
      // Add "All Cities" option
      setCities(["All Cities", ...citiesData]);
      
    } catch (err) {
      console.error('Error fetching cities for rent:', err);
      setCitiesError(err.message || "Failed to load cities");
      setCities([]);
    } finally {
      setCitiesLoading(false);
    }
  };

  // Fetch all vehicles from Java API using API service - UPDATED: Use rent-specific vehicles
  const fetchAllVehicles = async () => {
    try {
      setVehiclesLoading(true);
      setVehiclesError("");
      
      const vehiclesData = await vehiclesAPI.getVehiclesForRent(); // UPDATED
      setAllVehicles(vehiclesData);
      
    } catch (err) {
      console.error('Error fetching vehicles for rent:', err);
      setVehiclesError(err.message || "Failed to load vehicles");
      setAllVehicles([]);
    } finally {
      setVehiclesLoading(false);
    }
  };

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
      
      case "recommended":
      default:
        return sortedVehicles;
    }
  };

  // Helper function to extract numeric price from string
  const extractPrice = (priceString) => {
    const priceMatch = priceString.match(/\d+/);
    return priceMatch ? parseInt(priceMatch[0]) : 0;
  };

  // Filter and sort vehicles based on selected city, type, and sort option
  useEffect(() => {
    if (allVehicles.length === 0) return;

    let filtered = allVehicles.filter(vehicle => vehicle.type === selectedType);
    
    if (selectedCity && selectedCity !== "All Cities") {
      filtered = filtered.filter(vehicle => vehicle.city === selectedCity);
    }
    
    const sortedAndFiltered = sortVehicles(filtered, sortOption);
    setFilteredVehicles(sortedAndFiltered);
  }, [selectedCity, selectedType, allVehicles, sortOption]);

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Calculate counts based on API data
  const carsCount = allVehicles.filter(vehicle => vehicle.type === "Car").length;
  const bikesCount = allVehicles.filter(vehicle => vehicle.type === "Bike").length;
  const totalCount = allVehicles.length;

  // Get counts for selected city
  const getCitySpecificCounts = () => {
    if (!selectedCity || selectedCity === "All Cities") {
      return {
        cars: carsCount,
        bikes: bikesCount,
        total: totalCount
      };
    }
    
    const cityVehicles = allVehicles.filter(vehicle => vehicle.city === selectedCity);
    return {
      cars: cityVehicles.filter(v => v.type === "Car").length,
      bikes: cityVehicles.filter(v => v.type === "Bike").length,
      total: cityVehicles.length
    };
  };

  const cityCounts = getCitySpecificCounts();

  useEffect(() => {
    fetchCities();
    fetchAllVehicles();
  }, []);

  // Enhanced handleBookNow with availability check
  const handleBookNow = async (vehicle) => {
    try {
      // Check vehicle availability before proceeding
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const availabilityResponse = await bookingsAPI.checkVehicleAvailability(
        vehicle.id, 
        today, 
        tomorrow
      );

      if (!availabilityResponse.data) {
        setError("Vehicle is currently unavailable. Please try another vehicle or date.");
        return;
      }

      // Check if user is logged in
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const userData = localStorage.getItem("userData");

      if (isLoggedIn && userData) {
        navigate("/booking", { state: { vehicle } });
      } else {
        navigate("/login", { 
          state: { 
            vehicle, 
            from: "/booking",
            action: "book" 
          } 
        });
      }
    } catch (error) {
      console.error("Availability check failed:", error);
      setError("Unable to check vehicle availability. Please try again.");
    }
  };

  // Vehicle Card Component with Availability Status
  const VehicleCard = ({ vehicle }) => {
    const [isAvailable, setIsAvailable] = useState(true);
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    useEffect(() => {
      checkAvailability();
    }, [vehicle]);

    const checkAvailability = async () => {
      try {
        setCheckingAvailability(true);
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const response = await bookingsAPI.checkVehicleAvailability(
          vehicle.id, 
          today, 
          tomorrow
        );
        
        setIsAvailable(response.data !== false);
      } catch (error) {
        console.error("Error checking availability:", error);
        setIsAvailable(true);
      } finally {
        setCheckingAvailability(false);
      }
    };

    return (
      <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border transition-all duration-300 hover:translate-y-[-4px] group ${
        isAvailable 
          ? "border-white/20 hover:border-gold-400/50" 
          : "border-red-400/50 hover:border-red-400/70"
      }`}>
        <div 
          className="h-48 bg-cover bg-center rounded-xl mb-4 relative"
          style={{ backgroundImage: `url(${vehicle.imageUrl})` }}
        >
          <div className={`absolute inset-0 rounded-xl ${
            isAvailable 
              ? "bg-black/40 group-hover:bg-black/20" 
              : "bg-red-900/60 group-hover:bg-red-900/50"
          } transition-all duration-300`}></div>
          
          {/* Availability Badge */}
          <div className="absolute top-3 right-3">
            {checkingAvailability ? (
              <span className="bg-gray-500/90 text-white text-xs font-semibold px-2 py-1 rounded flex items-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b-1 border-white mr-1"></div>
                Checking
              </span>
            ) : isAvailable ? (
              <span className="bg-green-500/90 text-white text-xs font-semibold px-2 py-1 rounded">
                ✅ Available
              </span>
            ) : (
              <span className="bg-red-500/90 text-white text-xs font-semibold px-2 py-1 rounded">
                ❌ Unavailable
              </span>
            )}
          </div>
          
          <div className="absolute bottom-3 left-3">
            <span className="bg-gold-500/90 text-slate-900 text-xs font-semibold px-2 py-1 rounded">
              📍 {vehicle.city}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-lg font-semibold text-white group-hover:text-gold-300 transition-colors">
            {vehicle.name}
          </h4>
          <span className="flex items-center bg-gold-500/20 text-gold-300 px-2 py-1 rounded text-sm border border-gold-400/30">
            ⭐ {vehicle.rating}
          </span>
        </div>
        
        <p className="text-gold-400 font-semibold text-lg mb-3">
          {vehicle.rentPrice || vehicle.price}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {vehicle.features && vehicle.features.map((featureObj, index) => {
            let featureText = '';
            
            if (typeof featureObj === 'string') {
              featureText = featureObj;
            } else if (featureObj && typeof featureObj === 'object') {
              featureText = featureObj.feature || featureObj.name || '';
              if (typeof featureText === 'object') {
                featureText = JSON.stringify(featureText);
              }
            }
            
            if (!featureText) return null;
            
            return (
              <span 
                key={featureObj.id || index}
                className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs border border-white/20"
              >
                {featureText}
              </span>
            );
          })}
        </div>
        
        <button 
          onClick={() => handleBookNow(vehicle)}
          disabled={!isAvailable || checkingAvailability}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
            isAvailable && !checkingAvailability
              ? "bg-gold-500 hover:bg-gold-600 text-slate-900"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
        >
          {checkingAvailability ? "Checking Availability..." : 
           isAvailable ? "Book Now" : "Currently Unavailable"}
        </button>
      </div>
    );
  };

  // Retry failed API calls
  const retryAPICalls = () => {
    setCitiesError("");
    setVehiclesError("");
    fetchCities();
    fetchAllVehicles();
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.9)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-white mb-4">
            All Ride <span className="font-semibold text-gold-400">Rental</span>
          </h1>
          <div className="text-2xl font-light text-gold-300 mb-4">
            {selectedType === "Car" ? "Premium Car Collection" : "Adventure Bike Fleet"}
          </div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {selectedType === "Car" 
              ? "Discover our curated selection of luxury and performance vehicles" 
              : "Explore our range of premium motorcycles for the ultimate riding experience"
            }
          </p>
        </div>

        {/* Error Messages */}
        {(citiesError || vehiclesError || error) && (
          <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-red-400/30 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-200 mb-2">Connection Issues</h3>
                <div className="space-y-1 text-red-100">
                  {citiesError && <p>🚨 Cities: {citiesError}</p>}
                  {vehiclesError && <p>🚨 Vehicles: {vehiclesError}</p>}
                  {error && <p>🚨 Booking: {error}</p>}
                </div>
                <p className="text-red-200/80 text-sm mt-2">
                  Please check your internet connection and ensure the backend server is running
                </p>
              </div>
              <button
                onClick={retryAPICalls}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* City Selection */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {selectedCity === "All Cities" 
                  ? "Available Across All Locations" 
                  : `Available in ${selectedCity}`
                }
              </h2>
              <p className="text-white/60 mt-2">
                {selectedCity === "All Cities"
                  ? "Browse our complete premium fleet"
                  : `Exploring vehicles in ${selectedCity}`
                }
              </p>
            </div>
            <div className="flex-1 max-w-md">
              {citiesLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold-400"></div>
                  <span className="ml-3 text-white/70">Loading cities...</span>
                </div>
              ) : citiesError ? (
                <div className="text-center p-4 border border-red-400/30 rounded-xl bg-red-500/10">
                  <span className="text-red-200">Failed to load cities</span>
                </div>
              ) : (
                <select id="city-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-gold-400 text-white backdrop-blur-sm"
                >
                  {cities.map((city, index) => (
    <option 
      key={index} 
      value={city} 
      className="text-slate-800"
    >
      {city}
    </option>
  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel */}
          <div className="lg:w-1/4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sticky top-6 border border-white/20 shadow-2xl">
              <h3 className="text-lg font-semibold mb-4 text-white">Vehicle Type</h3>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setSelectedType("Car")}
                  className={`flex items-center px-4 py-4 rounded-xl transition duration-300 border ${
                    selectedType === "Car" 
                      ? "bg-gold-500/20 text-gold-300 border-gold-400 shadow-lg" 
                      : "bg-white/5 text-white/80 border-white/20 hover:bg-white/10"
                  }`}
                >
                  <span className="mr-3 text-xl">🚗</span>
                  <div className="text-left">
                    <div className="font-semibold">Premium Cars</div>
                    <div className={`text-sm ${
                      selectedType === "Car" ? "text-gold-300" : "text-white/60"
                    }`}>
                      {vehiclesError ? "Error loading" : `${cityCounts.cars} available`}
                      {selectedCity && selectedCity !== "All Cities" && !vehiclesError && ` in ${selectedCity}`}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedType("Bike")}
                  className={`flex items-center px-4 py-4 rounded-xl transition duration-300 border ${
                    selectedType === "Bike" 
                      ? "bg-gold-500/20 text-gold-300 border-gold-400 shadow-lg" 
                      : "bg-white/5 text-white/80 border-white/20 hover:bg-white/10"
                  }`}
                >
                  <span className="mr-3 text-xl">🏍️</span>
                  <div className="text-left">
                    <div className="font-semibold">Adventure Bikes</div>
                    <div className={`text-sm ${
                      selectedType === "Bike" ? "text-gold-300" : "text-white/60"
                    }`}>
                      {vehiclesError ? "Error loading" : `${cityCounts.bikes} available`}
                      {selectedCity && selectedCity !== "All Cities" && !vehiclesError && ` in ${selectedCity}`}
                    </div>
                  </div>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <h4 className="font-semibold mb-3 text-white">Fleet Overview</h4>
                {vehiclesError ? (
                  <div className="text-center py-4 text-red-200">
                    <p>Failed to load statistics</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm text-white/70">
                    <div className="flex justify-between">
                      <span>Total Vehicles:</span>
                      <span className="font-semibold text-gold-400">{cityCounts.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium Cars:</span>
                      <span className="font-semibold text-blue-400">{cityCounts.cars}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adventure Bikes:</span>
                      <span className="font-semibold text-green-400">{cityCounts.bikes}</span>
                    </div>
                    {selectedCity && selectedCity !== "All Cities" && (
                      <div className="pt-2 border-t border-white/10">
                        <div className="flex justify-between text-gold-300">
                          <span>Location:</span>
                          <span className="font-semibold">{selectedCity}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:w-3/4">
            {/* Vehicle Header */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {selectedType === "Car" ? "🚗 Premium Cars" : "🏍️ Adventure Bikes"}
                    <span className="text-gold-400 ml-2">
                      {vehiclesError ? "(Error)" : `(${filteredVehicles.length} available)`}
                    </span>
                  </h3>
                  <p className="text-white/60 mt-1">
                    {vehiclesError 
                      ? "Unable to load vehicle data. Please check your connection."
                      : selectedType === "Car" 
                        ? "Experience unparalleled comfort and performance" 
                        : "Unleash your adventurous spirit with our premium collection"
                    }
                    {selectedCity && selectedCity !== "All Cities" && !vehiclesError && ` in ${selectedCity}`}
                  </p>
                </div>
                
                {!vehiclesError && (
                  <select 
                    value={sortOption}
                    onChange={handleSortChange}
                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white backdrop-blur-sm focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                  >
                    <option value="recommended" className="text-slate-800">Sort by: Recommended</option>
                    <option value="price-low-high" className="text-slate-800">Sort by: Price (Low to High)</option>
                    <option value="price-high-low" className="text-slate-800">Sort by: Price (High to Low)</option>
                    <option value="rating" className="text-slate-800">Sort by: Rating</option>
                  </select>
                )}
              </div>
            </div>

            {/* Vehicle Grid */}
            {vehiclesLoading ? (
              <div className="text-center py-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
                <p className="text-white/70">Loading premium vehicles...</p>
              </div>
            ) : vehiclesError ? (
              <div className="text-center py-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
                <div className="text-6xl mb-4 text-red-400">⚠️</div>
                <h3 className="text-xl font-semibold text-white mb-4">Unable to Load Vehicles</h3>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  {vehiclesError}
                </p>
                <div className="space-y-3 text-white/60 text-sm">
                  <p>🔍 Please check if:</p>
                  <ul className="space-y-1">
                    <li>• Backend server is running properly</li>
                    <li>• CORS is properly configured</li>
                    <li>• API endpoints are accessible</li>
                  </ul>
                </div>
                <button
                  onClick={retryAPICalls}
                  className="mt-6 bg-gold-500 hover:bg-gold-600 text-slate-900 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : selectedCity && selectedCity !== "All Cities" ? (
              <div className="text-center py-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
                <div className="text-6xl mb-4 text-white/40">🚫</div>
                <p className="text-xl text-white mb-4">No {selectedType.toLowerCase()}s available in {selectedCity}</p>
                <p className="text-white/60">Please try a different city or explore our other vehicle types.</p>
              </div>
            ) : (
              <div className="text-center py-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
                <div className="text-6xl mb-4 text-white/40">🏙️</div>
                <p className="text-xl text-white mb-4">Select a city to explore our premium fleet</p>
                <p className="text-white/60">Choose from the dropdown above to discover available vehicles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentPage;