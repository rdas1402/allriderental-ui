import React, { useState, useEffect } from "react";
import { citiesAPI } from "../services/apiService";

const LocationPopup = ({ onLocationSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableCities, setAvailableCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // City images mapping
  const cityImages = {
    "Guwahati": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    "Jorhat": "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    "Sivsagar": "https://images.unsplash.com/photo-1597822738124-151fb72dcb79?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    "Dibrugarh": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    "Tinsukia": "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  };

  const getCityImage = (cityName) => {
    return cityImages[cityName] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  };

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCities(availableCities);
    } else {
      const filtered = availableCities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchTerm, availableCities]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      setError("");
      
      const citiesData = await citiesAPI.getCities();
      
      const cities = Array.isArray(citiesData) 
        ? citiesData
            .filter(city => city.isActive)
            .map(city => ({
              id: city.id,
              name: city.name,
              state: city.state,
              image: getCityImage(city.name)
            }))
        : [];
      
      setAvailableCities(cities);
      setFilteredCities(cities);
    } catch (err) {
      console.error("Error fetching cities:", err);
      setError("Failed to load cities. Please try again.");
      setAvailableCities([]);
      setFilteredCities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city) => {
    onLocationSelect(city.name);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleSkip = () => {
    onLocationSelect("All Cities");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">
              Select Your City
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search or type city to select"
              className="w-full pl-10 pr-10 py-4 bg-white/95 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-900 placeholder-gray-500 text-sm font-medium shadow-lg"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Cities Grid */}
        <div className="max-h-96 overflow-y-auto bg-gray-50 p-4">
          {loading ? (
            <div className="p-8 text-center bg-white rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Loading cities...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center bg-white rounded-lg">
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button
                onClick={fetchCities}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium px-4 py-2 bg-blue-50 rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg">
              <p className="text-gray-600 text-sm">No cities found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className="bg-white rounded-xl p-3 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group border border-gray-200 flex flex-col items-center text-center"
                >
                  {/* City Image */}
                  <div className="w-16 h-16 rounded-full overflow-hidden shadow-md mb-3">
                    <img 
                      src={city.image} 
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* City Info */}
                  <div className="flex-1 w-full">
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {city.name}
                    </h4>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                      {city.state}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  <div className="mt-2 w-6 h-1 bg-transparent group-hover:bg-blue-500 rounded-full transition-colors duration-300"></div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Branding */}
        <div className="bg-white border-t border-gray-200 p-6">
          {/* Brand Section */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-1 mb-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">
              READ BY: All Ride Rental | Bike & Car Rentals
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300 my-4"></div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleClearSearch}
              className="text-gray-500 hover:text-gray-700 text-sm font-semibold transition-colors px-3 py-2"
            >
              Clear
            </button>
            
            <div className="text-center flex-1">
              <p className="text-sm text-gray-600 font-semibold">
                SELECT CITY TO CONTINUE
              </p>
            </div>
            
            <button
              onClick={handleSkip}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors px-3 py-2"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPopup;