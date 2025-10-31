import React, { useEffect, useState } from "react";
import { citiesAPI } from "../services/apiService"; // Import your API service

const CityPopup = ({ onClose, onCitySelect }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Select Your City</h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading cities...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <ul className="space-y-2">
            {cities.map((city, index) => (
              <li
                key={index}
                onClick={() => onCitySelect(city)}
                className="cursor-pointer px-4 py-2 bg-gray-100 rounded-md hover:bg-yellow-400 hover:text-black transition"
              >
                {city}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onClose}
          className="mt-5 bg-black text-white w-full py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CityPopup;