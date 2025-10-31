import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { citiesAPI } from "../services/apiService"; // Import your API service

function Hero() {
  const [showModal, setShowModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showModal) {
      setLoading(true);
      setError(null);
      
      const fetchCities = async () => {
        try {
          const citiesData = await citiesAPI.getCities();
          setCities(citiesData);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching cities:", error);
          setError("Failed to load cities. Please try again.");
          setLoading(false);
        }
      };

      fetchCities();
    }
  }, [showModal]);

  const handleCitySelect = (city) => {
    setShowModal(false);
    navigate(`/listings?city=${city}`);
  };

  return (
    <section className="bg-yellow-400 text-black py-20 text-center relative">
      <h1 className="text-5xl font-extrabold mb-4 text-black drop-shadow-md tracking-wide">
        Find Your <span className="text-white">Perfect Ride</span>
      </h1>
      <p className="text-lg mb-6 text-gray-900 font-medium">
        Rent Cars & Bikes at Best Prices Across Major Cities
      </p>

      <button
        onClick={() => setShowModal(true)}
        className="bg-black text-yellow-400 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-800 transition"
      >
        Book Now
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Select Your City
            </h2>

            {loading ? (
              <p className="text-center text-gray-600">Loading cities...</p>
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : (
              <div className="space-y-2">
                {cities.map((cityObj, index) => (
                  <button
                    key={index}
                    onClick={() => handleCitySelect(cityObj.name)}
                    className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg"
                  >
                    {cityObj.name}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;