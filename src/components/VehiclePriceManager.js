// components/VehiclePriceManager.js
import React, { useState, useEffect } from "react";
import { vehiclesAPI, adminAPI } from "../services/apiService";

const VehiclePriceManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [priceData, setPriceData] = useState({
    rentPrice: '',
    salePrice: ''
  });
  const [currentView, setCurrentView] = useState('both'); // Track current view separately
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load all vehicles
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehiclesAPI.getVehicles();
      if (response && Array.isArray(response)) {
        setVehicles(response);
      }
    } catch (error) {
      console.error("Error loading vehicles:", error);
      setMessage("Error loading vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setPriceData({
      rentPrice: vehicle.rentPrice || vehicle.price || '',
      salePrice: vehicle.salePrice || ''
    });
    
    // Set initial view based on vehicle purpose
    if (vehicle.purpose === 'both') {
      setCurrentView('both'); // Start with 'both' view for dual-purpose vehicles
    } else {
      setCurrentView(vehicle.purpose); // For rent/sale only, use their purpose as view
    }
    
    setMessage('');
  };

  const handlePriceUpdate = async () => {
    if (!selectedVehicle) {
      setMessage("Please select a vehicle first");
      return;
    }

    // Validation based on ACTUAL vehicle purpose (not current view)
    if (selectedVehicle.purpose === 'rent' && !priceData.rentPrice) {
      setMessage("Please enter rent price for rent-only vehicle");
      return;
    }

    if (selectedVehicle.purpose === 'sale' && !priceData.salePrice) {
      setMessage("Please enter sale price for sale-only vehicle");
      return;
    }

    if (selectedVehicle.purpose === 'both' && (!priceData.rentPrice || !priceData.salePrice)) {
      setMessage("Please enter both rent and sale prices for dual-purpose vehicle");
      return;
    }

    try {
      setLoading(true);
      
      // Use the specific prices endpoint that was working before
      const response = await adminAPI.updateVehiclePrices(selectedVehicle.id, {
        rentPrice: priceData.rentPrice,
        salePrice: priceData.salePrice
      });

      if (response) {
        setMessage("✅ Prices updated successfully!");
        // Update the local vehicles list
        const updatedVehicles = vehicles.map(v => 
          v.id === selectedVehicle.id 
            ? { 
                ...v, 
                rentPrice: priceData.rentPrice, 
                salePrice: priceData.salePrice
              } 
            : v
        );
        setVehicles(updatedVehicles);
        
        // Update the selected vehicle with new data (DON'T reset selection)
        setSelectedVehicle({
          ...selectedVehicle,
          rentPrice: priceData.rentPrice,
          salePrice: priceData.salePrice
        });
      }
    } catch (error) {
      console.error("Failed to update prices:", error);
      setMessage("❌ Failed to update prices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle purpose display change - NO API CALL, just UI state
  const handlePurposeDisplayChange = (newView) => {
    if (!selectedVehicle) return;
    
    // If vehicle purpose is "rent", only allow "rent" view
    if (selectedVehicle.purpose === 'rent' && newView !== 'rent') {
      setMessage("❌ This vehicle is set as 'Rent Only'. Cannot switch to sale view.");
      return;
    }
    
    // If vehicle purpose is "sale", only allow "sale" view
    if (selectedVehicle.purpose === 'sale' && newView !== 'sale') {
      setMessage("❌ This vehicle is set as 'Sale Only'. Cannot switch to rent view.");
      return;
    }
    
    // For "both" purpose vehicles, allow all views and don't lock any tabs
    setCurrentView(newView);
    setMessage(`💡 Displaying ${newView} prices. Click "Update Prices" to save changes.`);
  };

  // Check if a purpose tab should be enabled
  const isPurposeTabEnabled = (purpose) => {
    if (!selectedVehicle) return false;
    
    // Rent-only vehicles can only use rent tab
    if (selectedVehicle.purpose === 'rent') {
      return purpose === 'rent';
    }
    
    // Sale-only vehicles can only use sale tab
    if (selectedVehicle.purpose === 'sale') {
      return purpose === 'sale';
    }
    
    // Both-purpose vehicles can use all tabs - NEVER LOCKED
    if (selectedVehicle.purpose === 'both') {
      return true;
    }
    
    return false;
  };

  // Get purpose tab tooltip message
  const getPurposeTabTooltip = (purpose) => {
    if (!selectedVehicle) return '';
    
    if (selectedVehicle.purpose === 'rent' && purpose !== 'rent') {
      return "Vehicle is set as 'Rent Only'";
    }
    
    if (selectedVehicle.purpose === 'sale' && purpose !== 'sale') {
      return "Vehicle is set as 'Sale Only'";
    }
    
    return `Switch to ${purpose} view`;
  };

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get purpose badge color
  const getPurposeBadgeColor = (purpose) => {
    switch (purpose) {
      case 'rent': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'sale': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'both': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h3 className="text-2xl font-semibold text-white mb-6">Vehicle Price Management</h3>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-center ${
          message.includes("✅") || message.includes("💡")
            ? message.includes("✅") 
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
            : "bg-red-500/20 text-red-300 border border-red-500/30"
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Vehicle List */}
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">Select Vehicle</h4>
            
            {/* Search Box */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search vehicles by name, city, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
              />
            </div>

            {/* Vehicle List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => handleVehicleSelect(vehicle)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedVehicle?.id === vehicle.id
                      ? "bg-gold-500/20 border-gold-400"
                      : "bg-white/5 border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-semibold text-white">{vehicle.name}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getPurposeBadgeColor(vehicle.purpose)}`}>
                          {vehicle.purpose}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm">
                        {vehicle.type} • {vehicle.city}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      {vehicle.purpose !== 'sale' && (
                        <p className="text-gold-400">{vehicle.rentPrice || vehicle.price}</p>
                      )}
                      {vehicle.purpose !== 'rent' && vehicle.salePrice && (
                        <p className="text-green-400">{vehicle.salePrice}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Price Management */}
        <div className="space-y-4">
          {selectedVehicle ? (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">
                Manage Prices - {selectedVehicle.name}
              </h4>

              {/* Vehicle Info */}
              <div className="flex items-center space-x-4 mb-6 p-3 bg-white/5 rounded-lg">
                <div 
                  className="w-16 h-16 bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url(${selectedVehicle.imageUrl})` }}
                ></div>
                <div className="flex-1">
                  <h5 className="text-white font-semibold">{selectedVehicle.name}</h5>
                  <p className="text-white/60 text-sm">
                    {selectedVehicle.type} • {selectedVehicle.city}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs border ${getPurposeBadgeColor(selectedVehicle.purpose)}`}>
                      {selectedVehicle.purpose}
                    </span>
                    {selectedVehicle.purpose === 'rent' && (
                      <span className="text-blue-300 text-xs">(Rent Only)</span>
                    )}
                    {selectedVehicle.purpose === 'sale' && (
                      <span className="text-green-300 text-xs">(Sale Only)</span>
                    )}
                    {selectedVehicle.purpose === 'both' && (
                      <span className="text-purple-300 text-xs">(Dual Purpose - All tabs enabled)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Purpose Display Toggle */}
              <div className="mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  View/Edit Prices For
                </label>
                <div className="flex space-x-2">
                  {['rent', 'sale', 'both'].map((purpose) => {
                    const isEnabled = isPurposeTabEnabled(purpose);
                    const tooltip = getPurposeTabTooltip(purpose);
                    const isActive = currentView === purpose;
                    
                    return (
                      <button
                        key={purpose}
                        onClick={() => handlePurposeDisplayChange(purpose)}
                        disabled={!isEnabled}
                        title={tooltip}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                          isActive
                            ? 'bg-gold-500 text-slate-900'
                            : isEnabled
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {purpose.charAt(0).toUpperCase() + purpose.slice(1)}
                        {!isEnabled && (
                          <span className="ml-1 text-xs">🔒</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-white/60 text-xs mt-2">
                  {selectedVehicle.purpose === 'rent' && "This vehicle is set as 'Rent Only'. Only rent price can be edited."}
                  {selectedVehicle.purpose === 'sale' && "This vehicle is set as 'Sale Only'. Only sale price can be edited."}
                  {selectedVehicle.purpose === 'both' && "Switch freely between rent, sale, or both prices view - all tabs are enabled"}
                </p>
              </div>

              {/* Price Inputs */}
              <div className="space-y-4">
                {/* Show Rent Price Input only for rent or both purpose vehicles */}
                {(selectedVehicle.purpose === 'rent' || selectedVehicle.purpose === 'both') && (
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Rent Price {selectedVehicle.purpose === 'rent' && '*'}
                    </label>
                    <input
                      type="text"
                      value={priceData.rentPrice}
                      onChange={(e) => setPriceData({...priceData, rentPrice: e.target.value})}
                      placeholder="e.g., ₹4,500/day"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                    />
                    <p className="text-white/60 text-xs mt-1">
                      Format: ₹X,XXX/day or ₹X,XXX/month
                    </p>
                  </div>
                )}

                {/* Show Sale Price Input only for sale or both purpose vehicles */}
                {(selectedVehicle.purpose === 'sale' || selectedVehicle.purpose === 'both') && (
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Sale Price {selectedVehicle.purpose === 'sale' && '*'}
                    </label>
                    <input
                      type="text"
                      value={priceData.salePrice}
                      onChange={(e) => setPriceData({...priceData, salePrice: e.target.value})}
                      placeholder="e.g., ₹8,50,000"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                    />
                    <p className="text-white/60 text-xs mt-1">
                      Format: ₹X,XX,XXX
                    </p>
                  </div>
                )}

                {/* Current Prices Display */}
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <h5 className="text-white font-semibold mb-2">Current Prices</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {/* Always show rent price for rent or both purpose vehicles */}
                    {(selectedVehicle.purpose === 'rent' || selectedVehicle.purpose === 'both') && (
                      <div>
                        <span className="text-white/60">Rent:</span>
                        <p className="text-gold-400 font-semibold">
                          {selectedVehicle.rentPrice || selectedVehicle.price || 'Not set'}
                        </p>
                      </div>
                    )}
                    
                    {/* Only show sale price for sale or both purpose vehicles */}
                    {(selectedVehicle.purpose === 'sale' || selectedVehicle.purpose === 'both') && (
                      <div>
                        <span className="text-white/60">Sale:</span>
                        <p className="text-green-400 font-semibold">
                          {selectedVehicle.salePrice || 'Not set'}
                        </p>
                      </div>
                    )}
                    
                    {/* If it's rent-only and we only have one price, make it full width */}
                    {selectedVehicle.purpose === 'rent' && (
                      <div className={selectedVehicle.purpose === 'rent' ? 'col-span-2' : ''}>
                        <span className="text-white/60">Rent Price:</span>
                        <p className="text-gold-400 font-semibold">
                          {selectedVehicle.rentPrice || selectedVehicle.price || 'Not set'}
                        </p>
                      </div>
                    )}
                    
                    {/* If it's sale-only and we only have one price, make it full width */}
                    {selectedVehicle.purpose === 'sale' && (
                      <div className={selectedVehicle.purpose === 'sale' ? 'col-span-2' : ''}>
                        <span className="text-white/60">Sale Price:</span>
                        <p className="text-green-400 font-semibold">
                          {selectedVehicle.salePrice || 'Not set'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handlePriceUpdate}
                  disabled={loading}
                  className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-slate-900 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
                >
                  {loading ? "Updating Prices..." : "Update Prices"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center">
              <div className="text-6xl mb-4 text-white/40">💰</div>
              <h4 className="text-lg font-semibold text-white mb-2">Select a Vehicle</h4>
              <p className="text-white/60">
                Choose a vehicle from the list to manage its rental and sale prices.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
          <p className="text-blue-300 font-semibold text-xl">
            {vehicles.filter(v => v.purpose === 'rent').length}
          </p>
          <p className="text-blue-300 text-sm">Rent Only</p>
        </div>
        <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
          <p className="text-green-300 font-semibold text-xl">
            {vehicles.filter(v => v.purpose === 'sale').length}
          </p>
          <p className="text-green-300 text-sm">Sale Only</p>
        </div>
        <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
          <p className="text-purple-300 font-semibold text-xl">
            {vehicles.filter(v => v.purpose === 'both').length}
          </p>
          <p className="text-purple-300 text-sm">Dual Purpose</p>
        </div>
      </div>
    </div>
  );
};

export default VehiclePriceManager;