import React, { useState, useEffect } from "react";
import { vehiclesAPI } from "./../services/apiService";
import allRideRentalImage from "../assets/AllRideRental.jpg";

const BuyPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "all",
    city: "all"
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    fetchVehicles();
    fetchCities();
  }, [filters]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (filters.type !== "all" && filters.city !== "all") {
        response = await vehiclesAPI.getVehiclesForSaleByCityAndType(filters.city, filters.type);
      } else if (filters.type !== "all") {
        response = await vehiclesAPI.getVehiclesForSaleByType(filters.type);
      } else if (filters.city !== "all") {
        response = await vehiclesAPI.getVehiclesForSaleByCity(filters.city);
      } else {
        response = await vehiclesAPI.getVehiclesForSale();
      }
      
      setVehicles(response);
    } catch (err) {
      console.error("Error fetching sale vehicles:", err);
      setError("Failed to load vehicles for sale. Please try again later.");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await vehiclesAPI.getAvailableCitiesForSale();
      setCities(response);
    } catch (err) {
      console.error("Error fetching cities for sale:", err);
      if (vehicles.length > 0) {
        const uniqueCities = [...new Set(vehicles.map(vehicle => vehicle.city))];
        setCities(uniqueCities);
      }
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleRetry = () => {
    fetchVehicles();
    fetchCities();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-slate-600 text-base">Loading premium vehicles for sale...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Lighter Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Right Background Image - Inverted */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url(${allRideRentalImage})`,
            backgroundPosition: "right center",
            filter: "invert(100%)"
          }}
        ></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-slate-800 mb-6">
            Premium <span className="font-semibold text-gold-500">Vehicle Sales</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Own a piece of luxury from our meticulously maintained premium fleet
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {/* Vehicle Type Dropdown */}
          <div className="relative">
            <select 
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="appearance-none bg-white/95 backdrop-blur-lg text-slate-800 px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-gold-500 pr-10 cursor-pointer text-sm"
            >
              <option value="all">All Vehicles</option>
              <option value="Car">Cars Only</option>
              <option value="Bike">Bikes Only</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* City Dropdown */}
          <div className="relative">
            <select 
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="appearance-none bg-white/95 backdrop-blur-lg text-slate-800 px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-gold-500 pr-10 cursor-pointer text-sm"
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-slate-800 p-6 rounded-lg mb-8 text-center">
            <div className="text-lg mb-2">🚗 Unable to Load Vehicles for Sale</div>
            <p className="mb-4 text-sm">{error}</p>
            <button 
              onClick={handleRetry}
              className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Vehicles Grid */}
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-8px] group">
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${vehicle.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      vehicle.type === "Car" 
                        ? "bg-blue-500 text-white" 
                        : "bg-green-500 text-white"
                    }`}>
                      {vehicle.type}
                    </span>
                  </div>
                  {/* Sale Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      FOR SALE
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-gold-500 transition-colors">
                        {vehicle.name}
                      </h3>
                      <p className="text-slate-600 text-sm">Location: {vehicle.city}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-600 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gold-500 font-semibold text-base">💰 {vehicle.salePrice || vehicle.price}</span>
                      {vehicle.fuelType && <span className="text-xs">⛽ {vehicle.fuelType}</span>}
                    </div>
                    {vehicle.rating && vehicle.rating > 0 && (
                      <div className="flex items-center text-xs">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span>{vehicle.rating}/5.0</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-800 mb-2 text-sm">Premium Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {vehicle.features && vehicle.features.length > 0 ? (
                        vehicle.features.map((feature, index) => (
                          <span 
                            key={index}
                            className="bg-blue-50 text-slate-700 px-2 py-1 rounded text-xs border border-blue-200"
                          >
                            {typeof feature === 'object' ? feature.feature : feature}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-xs">No features listed</span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-gold-500 hover:bg-gold-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm">
                      View Details
                    </button>
                    <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-slate-800 py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-blue-200 text-sm">
                      Schedule Test Drive
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Vehicles Message */}
        {!error && vehicles.length === 0 && (
          <div className="text-center text-slate-600 text-lg py-16">
            No vehicles for sale found matching your criteria.
          </div>
        )}

        {/* CTA Section */}
        {!error && (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-12 border border-blue-200 shadow-lg text-center mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Interested in Premium Ownership?</h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto text-sm">
              Contact our luxury vehicle specialists for personalized consultation and exclusive offers
            </p>
            <button className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 shadow-lg">
              Contact Sales Executive
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyPage;