import React, { createContext, useContext, useState, useEffect } from 'react';

const CityContext = createContext();

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [availableCities, setAvailableCities] = useState(["All Cities"]);

  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  const updateCity = (city) => {
    setSelectedCity(city);
    localStorage.setItem("selectedCity", city);
  };

  const value = {
    selectedCity,
    availableCities,
    setAvailableCities,
    updateCity
  };

  return (
    <CityContext.Provider value={value}>
      {children}
    </CityContext.Provider>
  );
};