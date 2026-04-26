import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { vehiclesAPI, bookingsAPI } from "../services/apiService";
import allRideRentalImage from "../assets/AllRideRental.jpg";
import { useCity } from "../context/CityContext";

const RentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get("type") === "bike" ? "Bike" : "Car";
  
  // USE CityContext instead of localStorage
  const { selectedCity } = useCity();
  
  const [selectedType, setSelectedType] = useState(initialType);
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [displayedVehicles, setDisplayedVehicles] = useState([]); // NEW: For smooth transitions
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false); // NEW: Filtering state
  const [error, setError] = useState("");
  const [vehiclesError, setVehiclesError] = useState("");
  const [sortOption, setSortOption] = useState("recommended");
  
  // Refs to track previous values for comparison
  const prevSelectedCityRef = useRef(selectedCity);
  const prevSelectedTypeRef = useRef(selectedType);
  const prevSortOptionRef = useRef(sortOption);

  // Fetch all vehicles from Java API using API service
  const fetchAllVehicles = useCallback(async () => {
    try {
      setVehiclesLoading(true);
      setVehiclesError("");
      
      const vehiclesData = await vehiclesAPI.getVehiclesForRent();
      setAllVehicles(vehiclesData);
      
    } catch (err) {
      console.error('Error fetching vehicles for rent:', err);
      setVehiclesError(err.message || "Failed to load vehicles");
      setAllVehicles([]);
    } finally {
      setVehiclesLoading(false);
    }
  }, []);

  // Helper function to extract numeric price from string
  const extractPrice = useCallback((priceString) => {
    if (!priceString) return 0;
    const priceMatch = priceString.match(/\d+/);
    return priceMatch ? parseInt(priceMatch[0]) : 0;
  }, []);

  // Sort vehicles based on selected option
  const sortVehicles = useCallback((vehicles, option) => {
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
  }, [extractPrice]);

  // Smooth filter and sort function with animation
  const filterAndSortVehiclesSmooth = useCallback(() => {
    if (allVehicles.length === 0) {
      setFilteredVehicles([]);
      setDisplayedVehicles([]);
      return;
    }

    // Only show filtering indicator if actually changing
    const cityChanged = prevSelectedCityRef.current !== selectedCity;
    const typeChanged = prevSelectedTypeRef.current !== selectedType;
    const sortChanged = prevSortOptionRef.current !== sortOption;
    
    if (cityChanged || typeChanged || sortChanged) {
      setIsFiltering(true);
    }

    // Update refs
    prevSelectedCityRef.current = selectedCity;
    prevSelectedTypeRef.current = selectedType;
    prevSortOptionRef.current = sortOption;

    let filtered = allVehicles.filter(vehicle => vehicle.type === selectedType);
    
    if (selectedCity && selectedCity !== "All Cities") {
      filtered = filtered.filter(vehicle => vehicle.city === selectedCity);
    }
    
    const sortedAndFiltered = sortVehicles(filtered, sortOption);
    setFilteredVehicles(sortedAndFiltered);
    
    // Smooth transition to new vehicles
    setTimeout(() => {
      setDisplayedVehicles(sortedAndFiltered);
      setIsFiltering(false);
    }, 200); // Small delay for smooth transition
  }, [allVehicles, selectedType, selectedCity, sortOption, sortVehicles]);

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Calculate counts for selected city
  const cityCounts = useMemo(() => {
    const carsCount = allVehicles.filter(vehicle => vehicle.type === "Car").length;
    const bikesCount = allVehicles.filter(vehicle => vehicle.type === "Bike").length;
    const totalCount = allVehicles.length;

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
  }, [selectedCity, allVehicles]);

  // Initial data fetch
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    fetchAllVehicles();
  }, [fetchAllVehicles]);

  // Update filtered vehicles when dependencies change
  useEffect(() => {
    filterAndSortVehiclesSmooth();
  }, [filterAndSortVehiclesSmooth]);

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

  // Vehicle Card Component
  const VehicleCard = React.memo(({ vehicle }) => {
    const [isAvailable, setIsAvailable] = useState(true);
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    const checkAvailability = useCallback(async () => {
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
    }, [vehicle.id]);

    useEffect(() => {
      checkAvailability();
    }, [checkAvailability]);

    return (
      <div className={`bg-white/95 backdrop-blur-lg rounded-xl p-4 border transition-all duration-300 hover:translate-y-[-2px] group shadow-md ${
        isAvailable 
          ? "border-blue-200 hover:border-gold-400 hover:shadow-lg" 
          : "border-red-300 hover:border-red-400"
      }`}>
        <div 
          className="h-32 bg-cover bg-center rounded-lg mb-3 relative"
          style={{ backgroundImage: `url(${vehicle.imageUrl})` }}
        >
          <div className={`absolute inset-0 rounded-lg ${
            isAvailable 
              ? "bg-black/20 group-hover:bg-black/10" 
              : "bg-red-900/40 group-hover:bg-red-900/30"
          } transition-all duration-300`}></div>
          
          {/* Availability Badge */}
          <div className="absolute top-2 right-2">
            {checkingAvailability ? (
              <span className="bg-gray-500/90 text-white text-xs font-semibold px-1.5 py-0.5 rounded flex items-center">
                <div className="animate-spin rounded-full h-2 w-2 border-b-1 border-white mr-1"></div>
                Checking
              </span>
            ) : isAvailable ? (
              <span className="bg-green-500/90 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                ✅
              </span>
            ) : (
              <span className="bg-red-500/90 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                ❌
              </span>
            )}
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
          {vehicle.rentPrice || vehicle.price}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {vehicle.features && vehicle.features.slice(0, 2).map((featureObj, index) => {
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
                className="bg-blue-50 text-slate-700 px-1.5 py-0.5 rounded text-xs border border-blue-200 line-clamp-1"
              >
                {featureText.length > 15 ? featureText.substring(0, 15) + '...' : featureText}
              </span>
            );
          })}
          {vehicle.features && vehicle.features.length > 2 && (
            <span className="bg-blue-50 text-slate-700 px-1.5 py-0.5 rounded text-xs border border-blue-200">
              +{vehicle.features.length - 2}
            </span>
          )}
        </div>
        
        <button 
          onClick={() => handleBookNow(vehicle)}
          disabled={!isAvailable || checkingAvailability}
          className={`w-full py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-md text-xs ${
            isAvailable && !checkingAvailability
              ? "bg-gold-500 hover:bg-gold-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {checkingAvailability ? "Checking..." : 
           isAvailable ? "Book Now" : "Unavailable"}
        </button>
      </div>
    );
  });

  // Retry failed API calls
  const retryAPICalls = () => {
    setVehiclesError("");
    fetchAllVehicles();
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Lighter Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Right Background Image - Inverted */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1/2 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url(${allRideRentalImage})`,
            backgroundPosition: "left center",
            filter: "invert(100%)"
          }}
        ></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-slate-800 mb-4">
            All Ride <span className="font-semibold text-gold-500">Rental</span>
          </h1>
          <div className="text-xl font-light text-gold-500 mb-4">
            {selectedType === "Car" ? "Premium Car Collection" : "Adventure Bike Fleet"}
          </div>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            {selectedType === "Car" 
              ? "Discover our curated selection of luxury and performance vehicles" 
              : "Explore our range of premium motorcycles for the ultimate riding experience"
            }
          </p>
          
          {/* Current Location Badge */}
          {selectedCity && selectedCity !== "All Cities" && (
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mt-4">
              <span className="text-blue-600 text-sm mr-2">📍</span>
              <span className="text-blue-700 text-sm font-medium">Currently viewing vehicles in <strong>{selectedCity}</strong></span>
            </div>
          )}
        </div>

        {/* Error Messages */}
        {(vehiclesError || error) && (
          <div className="bg-white/95 backdrop-blur-lg border border-red-200 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-red-700 mb-2">Connection Issues</h3>
                <div className="space-y-1 text-red-600 text-sm">
                  {vehiclesError && <p>🚨 Vehicles: {vehiclesError}</p>}
                  {error && <p>🚨 Booking: {error}</p>}
                </div>
                <p className="text-red-600 text-xs mt-2">
                  Please check your internet connection and ensure the backend server is running
                </p>
              </div>
              <button
                onClick={retryAPICalls}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel */}
          <div className="lg:w-1/4">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 sticky top-6 border border-blue-200 shadow-lg">
              <h3 className="text-base font-semibold mb-4 text-slate-800">Vehicle Type</h3>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setSelectedType("Car")}
                  className={`flex items-center px-4 py-4 rounded-xl transition duration-300 border ${
                    selectedType === "Car" 
                      ? "bg-gold-100 text-gold-700 border-gold-400 shadow-lg" 
                      : "bg-blue-50 text-slate-700 border-blue-300 hover:bg-blue-100"
                  }`}
                >
                  <span className="mr-3 text-xl">🚗</span>
                  <div className="text-left">
                    <div className="font-semibold text-sm">Premium Cars</div>
                    <div className={`text-xs ${
                      selectedType === "Car" ? "text-gold-600" : "text-slate-600"
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
                      ? "bg-gold-100 text-gold-700 border-gold-400 shadow-lg" 
                      : "bg-blue-50 text-slate-700 border-blue-300 hover:bg-blue-100"
                  }`}
                >
                  <span className="mr-3 text-xl">🏍️</span>
                  <div className="text-left">
                    <div className="font-semibold text-sm">Adventure Bikes</div>
                    <div className={`text-xs ${
                      selectedType === "Bike" ? "text-gold-600" : "text-slate-600"
                    }`}>
                      {vehiclesError ? "Error loading" : `${cityCounts.bikes} available`}
                      {selectedCity && selectedCity !== "All Cities" && !vehiclesError && ` in ${selectedCity}`}
                    </div>
                  </div>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-blue-300">
                <h4 className="font-semibold mb-3 text-slate-800 text-sm">Fleet Overview</h4>
                {vehiclesError ? (
                  <div className="text-center py-4 text-red-600 text-sm">
                    <p>Failed to load statistics</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Total Vehicles:</span>
                      <span className="font-semibold text-gold-500">{cityCounts.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium Cars:</span>
                      <span className="font-semibold text-blue-600">{cityCounts.cars}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adventure Bikes:</span>
                      <span className="font-semibold text-green-600">{cityCounts.bikes}</span>
                    </div>
                    {selectedCity && selectedCity !== "All Cities" && (
                      <div className="pt-2 border-t border-blue-200">
                        <div className="flex justify-between text-gold-500">
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
            {/* Vehicle Header with Filtering Indicator */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-blue-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {selectedType === "Car" ? "🚗 Premium Cars" : "🏍️ Adventure Bikes"}
                      <span className="text-gold-500 ml-2 text-sm">
                        {vehiclesError ? "(Error)" : `(${displayedVehicles.length} available)`}
                      </span>
                    </h3>
                    {isFiltering && (
                      <div className="ml-3 flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold-500 mr-2"></div>
                        <span className="text-xs text-gold-600">Filtering...</span>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-600 mt-1 text-sm">
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
                    className="bg-white border border-blue-300 rounded-xl px-4 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  >
                    <option value="recommended" className="text-slate-800">Sort by: Recommended</option>
                    <option value="price-low-high" className="text-slate-800">Sort by: Price (Low to High)</option>
                    <option value="price-high-low" className="text-slate-800">Sort by: Price (High to Low)</option>
                    <option value="rating" className="text-slate-800">Sort by: Rating</option>
                  </select>
                )}
              </div>
            </div>

            {/* Vehicle Grid with Smooth Transition */}
            {vehiclesLoading ? (
              <div className="text-center py-12 bg-white/95 backdrop-blur-lg rounded-2xl border border-blue-200 shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
                <p className="text-slate-600 text-sm">Loading premium vehicles...</p>
              </div>
            ) : vehiclesError ? (
              <div className="text-center py-12 bg-white/95 backdrop-blur-lg rounded-2xl border border-blue-200 shadow-lg">
                <div className="text-6xl mb-4 text-red-400">⚠️</div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Unable to Load Vehicles</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm">
                  {vehiclesError}
                </p>
                <div className="space-y-3 text-slate-500 text-xs">
                  <p>🔍 Please check if:</p>
                  <ul className="space-y-1">
                    <li>• Backend server is running properly</li>
                    <li>• CORS is properly configured</li>
                    <li>• API endpoints are accessible</li>
                  </ul>
                </div>
                <button
                  onClick={retryAPICalls}
                  className="mt-6 bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className={`transition-opacity duration-300 ${isFiltering ? 'opacity-70' : 'opacity-100'}`}>
                {displayedVehicles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {displayedVehicles.map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </div>
                ) : selectedCity && selectedCity !== "All Cities" ? (
                  <div className="text-center py-12 bg-white/95 backdrop-blur-lg rounded-2xl border border-blue-200 shadow-lg">
                    <div className="text-6xl mb-4 text-slate-400">🚫</div>
                    <p className="text-lg text-slate-800 mb-4 text-sm">No {selectedType.toLowerCase()}s available in {selectedCity}</p>
                    <p className="text-slate-600 text-sm">Please try a different city or explore our other vehicle types.</p>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/95 backdrop-blur-lg rounded-2xl border border-blue-200 shadow-lg">
                    <div className="text-6xl mb-4 text-slate-400">🏙️</div>
                    <p className="text-lg text-slate-800 mb-4 text-sm">Select a city to explore our premium fleet</p>
                    <p className="text-slate-600 text-sm">Choose from the dropdown above to discover available vehicles.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentPage;