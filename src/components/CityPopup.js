// components/CityPopup.js
import React, { useEffect, useState } from "react";
import { citiesAPI } from "../services/apiService";

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96 border border-blue-200">
        <h2 className="text-2xl font-light text-slate-800 mb-4 text-center">
          Select Your <span className="font-semibold text-gold-500">City</span>
        </h2>

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold-500 mx-auto mb-2"></div>
            <p className="text-slate-600">Loading cities...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>
        ) : (
          <ul className="space-y-2">
            {cities.map((city, index) => (
              <li
                key={index}
                onClick={() => onCitySelect(city)}
                className="cursor-pointer px-4 py-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-gold-500 hover:text-slate-900 hover:border-gold-400 transition-all duration-300"
              >
                {city}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onClose}
          className="mt-5 bg-slate-800 hover:bg-slate-900 text-white w-full py-3 rounded-lg font-semibold transition-colors border border-slate-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CityPopup;