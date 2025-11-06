// components/VehiclePurposeManager.js
import React, { useState, useEffect } from "react";
import { vehiclesAPI, adminAPI } from "../services/apiService";

const VehiclePurposeManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('all');
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [newPurpose, setNewPurpose] = useState('');
  const [purposeOptions, setPurposeOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  // Load all vehicles
  useEffect(() => {
    loadVehicles();
  }, []);

  // Filter vehicles when search term or purpose filter changes
  useEffect(() => {
    let filtered = vehicles;

    // Apply purpose filter
    if (purposeFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.purpose === purposeFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, purposeFilter]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehiclesAPI.getVehicles();
      if (response && Array.isArray(response)) {
        setVehicles(response);
      }
    } catch (error) {
      console.error("Error loading vehicles:", error);
      setMessage("❌ Error loading vehicles");
    } finally {
      setLoading(false);
    }
  };

  // Load available purpose options from API
  const loadPurposeOptions = async (vehicleId) => {
    try {
      setOptionsLoading(true);
      const response = await adminAPI.getAvailablePurposeOptions(vehicleId);
      
      if (response && response.success && Array.isArray(response.data)) {
        setPurposeOptions(response.data);
      } else {
        throw new Error("Failed to load purpose options");
      }
    } catch (error) {
      console.error("Error loading purpose options:", error);
      setMessage("❌ Failed to load purpose options");
      setPurposeOptions([]); // Clear options on failure
    } finally {
      setOptionsLoading(false);
    }
  };

  const handlePurposeChange = async (vehicleId, newPurpose) => {
    try {
      setLoading(true);
      
      // Get the vehicle first
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (!vehicle) {
        setMessage("❌ Vehicle not found");
        return;
      }

      // Use the new purpose-specific API endpoint
      const response = await adminAPI.updateVehiclePurpose(vehicleId, newPurpose);

      if (response && response.success) {
        setMessage(`✅ ${vehicle.name} purpose changed to ${newPurpose}`);
        
        // Update local state
        const updatedVehicles = vehicles.map(v => 
          v.id === vehicleId ? { ...v, purpose: newPurpose } : v
        );
        setVehicles(updatedVehicles);
        setEditingVehicle(null);
        setNewPurpose('');
        setPurposeOptions([]);
      } else {
        throw new Error(response?.message || "Failed to update purpose");
      }
    } catch (error) {
      console.error("Failed to update purpose:", error);
      setMessage(`❌ Failed to update vehicle purpose: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = async (vehicle) => {
    setEditingVehicle(vehicle);
    setNewPurpose(vehicle.purpose);
    setMessage(''); // Clear any previous messages
    // Load purpose options from API when starting to edit
    await loadPurposeOptions(vehicle.id);
  };

  const cancelEditing = () => {
    setEditingVehicle(null);
    setNewPurpose('');
    setPurposeOptions([]);
  };

  // Get purpose badge color
  const getPurposeBadgeColor = (purpose) => {
    switch (purpose) {
      case 'rent': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'sale': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'both': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // Get purpose display name
  const getPurposeDisplayName = (purpose) => {
    switch (purpose) {
      case 'rent': return 'Rent Only';
      case 'sale': return 'Sale Only';
      case 'both': return 'Dual Purpose';
      default: return purpose;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h3 className="text-2xl font-semibold text-white mb-6">Vehicle Purpose Management</h3>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-center ${
          message.includes("✅") 
            ? "bg-green-500/20 text-green-300 border border-green-500/30" 
            : "bg-red-500/20 text-red-300 border border-red-500/30"
        }`}>
          {message}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Search Vehicles
          </label>
          <input
            type="text"
            placeholder="Search by name, city, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-white/90 border border-white/20 rounded-lg text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
          />
        </div>
        
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Filter by Purpose
          </label>
          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="w-full px-4 py-2 bg-white/90 border border-white/20 rounded-lg text-gray-800 focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
          >
            <option value="all">All Purposes</option>
            <option value="rent">Rent Only</option>
            <option value="sale">Sale Only</option>
            <option value="both">Dual Purpose</option>
          </select>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400 mx-auto mb-4"></div>
            <p className="text-white/70">Loading vehicles...</p>
          </div>
        ) : filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-gold-400/30 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Vehicle Image */}
                <div className="w-full lg:w-24 h-24 rounded-lg flex-shrink-0 overflow-hidden">
                  <img 
                    src={vehicle.imageUrl} 
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>

                {/* Vehicle Info */}
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {vehicle.name}
                      </h4>
                      <p className="text-white/60 text-sm">
                        {vehicle.type} • {vehicle.city}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getPurposeBadgeColor(vehicle.purpose)}`}>
                          {getPurposeDisplayName(vehicle.purpose)}
                        </span>
                        {vehicle.purpose !== 'sale' && vehicle.rentPrice && (
                          <span className="text-gold-400 text-sm">{vehicle.rentPrice || vehicle.price}</span>
                        )}
                        {vehicle.purpose !== 'rent' && vehicle.salePrice && (
                          <span className="text-green-400 text-sm">{vehicle.salePrice}</span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 lg:mt-0">
                      {editingVehicle?.id === vehicle.id ? (
                        <div className="flex flex-col space-y-3">
                          <div className="flex space-x-2">
                            <select
                              value={newPurpose}
                              onChange={(e) => setNewPurpose(e.target.value)}
                              className="px-4 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-colors"
                              disabled={optionsLoading || purposeOptions.length === 0}
                            >
                              {optionsLoading ? (
                                <option value="">Loading options...</option>
                              ) : purposeOptions.length === 0 ? (
                                <option value="">No options available</option>
                              ) : (
                                purposeOptions.map(option => (
                                  <option key={option.value} value={option.value} className="bg-slate-800 text-white py-2">
                                    {option.label}
                                  </option>
                                ))
                              )}
                            </select>
                            <button
                              onClick={() => handlePurposeChange(vehicle.id, newPurpose)}
                              disabled={loading || purposeOptions.length === 0}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center space-x-2"
                            >
                              <span>💾</span>
                              <span>{loading ? "Saving..." : "Save"}</span>
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                            >
                              <span>❌</span>
                              <span>Cancel</span>
                            </button>
                          </div>
                          
                          {/* Purpose Options Info */}
                          {!optionsLoading && purposeOptions.length > 0 && (
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                              <h5 className="text-white font-semibold mb-2">Available Purpose Options:</h5>
                              <div className="space-y-2">
                                {purposeOptions.map(option => (
                                  <div key={option.value} className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                      newPurpose === option.value ? 'bg-gold-400' : 'bg-white/20'
                                    }`}></div>
                                    <div>
                                      <p className="text-white font-medium">{option.label}</p>
                                      <p className="text-white/60 text-sm">{option.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(vehicle)}
                          className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                        >
                          <span>⚙️</span>
                          <span>Change Purpose</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
            <div className="text-6xl mb-4 text-white/40">🚗</div>
            <p className="text-white/70 text-lg mb-2">No vehicles found</p>
            <p className="text-white/50 text-sm">
              {searchTerm || purposeFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'No vehicles available in the system'
              }
            </p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
          <p className="text-blue-300 font-semibold text-2xl">
            {vehicles.filter(v => v.purpose === 'rent').length}
          </p>
          <p className="text-blue-300 text-sm">Rent Only</p>
        </div>
        <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
          <p className="text-green-300 font-semibold text-2xl">
            {vehicles.filter(v => v.purpose === 'sale').length}
          </p>
          <p className="text-green-300 text-sm">Sale Only</p>
        </div>
        <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
          <p className="text-purple-300 font-semibold text-2xl">
            {vehicles.filter(v => v.purpose === 'both').length}
          </p>
          <p className="text-purple-300 text-sm">Dual Purpose</p>
        </div>
      </div>
    </div>
  );
};

export default VehiclePurposeManager;