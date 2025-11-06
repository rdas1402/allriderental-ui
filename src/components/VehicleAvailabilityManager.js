// components/VehicleAvailabilityManager.js
import React, { useState, useEffect } from "react";
import { vehiclesAPI, adminAPI, bookingsAPI } from "../services/apiService";

const VehicleAvailabilityManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [availabilityData, setAvailabilityData] = useState({
    startDate: '',
    endDate: '',
    isAvailable: true,
    reason: ''
  });
  const [existingAvailability, setExistingAvailability] = useState([]);
  const [bookingData, setBookingData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('set-availability');
  const [hasConflicts, setHasConflicts] = useState(false);

  // Load vehicles
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

  // Enhanced function to load vehicle availability with booking conflicts
  const loadVehicleAvailability = async (vehicleId) => {
    try {
      const [availabilityResponse, bookingResponse] = await Promise.all([
        adminAPI.getVehicleAvailability(vehicleId),
        bookingsAPI.getVehicleBookingAndAvailability(vehicleId)
      ]);

      if (availabilityResponse && availabilityResponse.success) {
        const availabilityList = availabilityResponse.data || [];
        setExistingAvailability(availabilityList);
        
        // Check for conflicts (multiple records for same date range)
        checkForConflicts(availabilityList);
      }

      // Store booking data for conflict detection
      if (bookingResponse && bookingResponse.success) {
        setBookingData(bookingResponse.data || {});
      }
    } catch (error) {
      console.error("Error loading vehicle availability:", error);
      setMessage("Error loading vehicle availability");
    }
  };

  // Check for conflicting availability records
  const checkForConflicts = (availabilityList) => {
    const rangeMap = new Map();
    let conflictsFound = false;

    availabilityList.forEach(record => {
      const rangeKey = `${record.startDate}_${record.endDate}`;
      if (rangeMap.has(rangeKey)) {
        conflictsFound = true;
        rangeMap.get(rangeKey).push(record);
      } else {
        rangeMap.set(rangeKey, [record]);
      }
    });

    setHasConflicts(conflictsFound);
    return conflictsFound;
  };

  const handleVehicleSelect = (vehicle) => {
    if (!vehicle) {
      setSelectedVehicle(null);
      setExistingAvailability([]);
      setBookingData({});
      setHasConflicts(false);
      return;
    }
    
    setSelectedVehicle(vehicle);
    setAvailabilityData({
      startDate: '',
      endDate: '',
      isAvailable: true,
      reason: ''
    });
    loadVehicleAvailability(vehicle.id);
  };

  // Check for booking conflicts
  const checkBookingConflicts = async (vehicleId, startDate, endDate) => {
    try {
      const response = await bookingsAPI.checkVehicleAvailability(
        vehicleId, 
        startDate.toISOString().split('T')[0], 
        endDate.toISOString().split('T')[0]
      );
      
      return !response.data;
    } catch (error) {
      console.error("Error checking conflicts:", error);
      throw error;
    }
  };

  // Enhanced availability setting with conflict detection
  const handleSetAvailability = async () => {
    if (!selectedVehicle || !availabilityData.startDate || !availabilityData.endDate) {
      setMessage("Please select a vehicle and date range");
      return;
    }

    const startDate = new Date(availabilityData.startDate);
    const endDate = new Date(availabilityData.endDate);

    if (startDate > endDate) {
      setMessage("End date must be after start date");
      return;
    }

    // Check for booking conflicts if setting as unavailable
    if (!availabilityData.isAvailable) {
      try {
        const hasBookings = await checkBookingConflicts(selectedVehicle.id, startDate, endDate);
        if (hasBookings) {
          setMessage("Cannot set vehicle as unavailable: There are existing bookings in this period");
          return;
        }
      } catch (error) {
        console.error("Error checking booking conflicts:", error);
        setMessage("Error checking for booking conflicts");
        return;
      }
    }

    try {
      setLoading(true);
      const response = await adminAPI.setVehicleAvailability(selectedVehicle.id, availabilityData);
      
      if (response.success) {
        setMessage(`Vehicle marked as ${availabilityData.isAvailable ? 'available' : 'unavailable'} successfully!`);
        setAvailabilityData({
          startDate: '',
          endDate: '',
          isAvailable: true,
          reason: ''
        });
        loadVehicleAvailability(selectedVehicle.id);
      } else {
        throw new Error(response.message || "Failed to update availability");
      }
    } catch (error) {
      console.error("Failed to update availability:", error);
      setMessage(error.message || "Failed to update vehicle availability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Clear conflicting availability records
  const clearConflictingAvailability = async () => {
    if (!selectedVehicle) return;
    
    try {
      setLoading(true);
      const response = await adminAPI.clearConflictingAvailability(selectedVehicle.id);
      
      if (response.success) {
        setMessage(`Cleared ${response.clearedRecords || response.remainingRecords} conflicting availability records!`);
        loadVehicleAvailability(selectedVehicle.id);
        setHasConflicts(false);
      } else {
        throw new Error(response.message || "Failed to clear conflicts");
      }
    } catch (error) {
      console.error("Failed to clear conflicts:", error);
      setMessage("Failed to clear conflicting availability records. Please try setting availability again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvailability = async (availabilityId) => {
    if (!window.confirm("Are you sure you want to delete this availability record?")) {
      return;
    }

    try {
      const response = await adminAPI.deleteVehicleAvailability(availabilityId);
      if (response.success) {
        setMessage("Availability record deleted successfully!");
        if (selectedVehicle) {
          loadVehicleAvailability(selectedVehicle.id);
        }
      } else {
        throw new Error(response.message || "Failed to delete availability");
      }
    } catch (error) {
      console.error("Failed to delete availability:", error);
      setMessage("Failed to delete availability record.");
    }
  };

  // Enhanced availability display with booking information
  const AvailabilityItem = ({ availability }) => {
    const [hasBookingConflicts, setHasBookingConflicts] = useState(false);

    useEffect(() => {
      checkBookingConflictsForItem();
    }, [availability]);

    const checkBookingConflictsForItem = async () => {
      if (!availability.isAvailable && selectedVehicle) {
        try {
          const conflicts = await checkBookingConflicts(
            selectedVehicle.id, 
            new Date(availability.startDate), 
            new Date(availability.endDate)
          );
          setHasBookingConflicts(conflicts);
        } catch (error) {
          console.error("Error checking conflicts:", error);
        }
      }
    };

    return (
      <div className={`p-3 rounded-lg border ${
        availability.isAvailable 
          ? 'bg-green-500/20 border-green-500/30' 
          : hasBookingConflicts 
            ? 'bg-orange-500/20 border-orange-500/30'
            : 'bg-red-500/20 border-red-500/30'
      }`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-white font-medium">
              {new Date(availability.startDate).toLocaleDateString()} - {new Date(availability.endDate).toLocaleDateString()}
            </p>
            <p className={`text-sm ${
              availability.isAvailable 
                ? 'text-green-300' 
                : hasBookingConflicts 
                  ? 'text-orange-300'
                  : 'text-red-300'
            }`}>
              {availability.isAvailable ? '✅ Available' : '❌ Unavailable'}
              {availability.reason && ` - ${availability.reason}`}
              {hasBookingConflicts && ' ⚠️ Has booking conflicts'}
            </p>
            <p className="text-white/60 text-xs mt-1">
              Created: {new Date(availability.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => handleDeleteAvailability(availability.id)}
            disabled={hasBookingConflicts}
            className={`ml-2 text-sm px-3 py-1 rounded ${
              hasBookingConflicts
                ? 'text-orange-400 cursor-not-allowed bg-orange-500/20'
                : 'text-red-400 hover:text-red-300 hover:bg-red-500/20'
            }`}
            title={hasBookingConflicts ? "Cannot delete: Has booking conflicts" : "Delete availability"}
          >
            {hasBookingConflicts ? '⚠️' : 'Delete'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-6">Vehicle Availability Management</h3>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-center ${
          message.includes("success") || message.includes("Success") || message.includes("Cleared")
            ? "bg-green-500/20 text-green-300 border border-green-500/30" 
            : "bg-red-500/20 text-red-300 border border-red-500/30"
        }`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-white/20 pb-4">
        <button
          onClick={() => setActiveTab('set-availability')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'set-availability' 
              ? 'bg-gold-500 text-slate-900' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Set Availability
        </button>
        <button
          onClick={() => setActiveTab('view-availability')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'view-availability' 
              ? 'bg-gold-500 text-slate-900' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          View Availability
        </button>
      </div>

      {activeTab === 'set-availability' && (
        <div className="space-y-6">
          {/* Vehicle Selection */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Select Vehicle
            </label>
            <select
              value={selectedVehicle?.id || ''}
              onChange={(e) => {
                const vehicleId = e.target.value;
                if (!vehicleId) {
                  handleVehicleSelect(null);
                  return;
                }
                const vehicle = vehicles.find(v => v.id.toString() === vehicleId);
                handleVehicleSelect(vehicle || null);
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 backdrop-blur-sm"
            >
              <option value="">Choose a vehicle...</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id} className="text-slate-800">
                  {vehicle.name} - {vehicle.city} ({vehicle.type})
                </option>
              ))}
            </select>
          </div>

          {selectedVehicle && (
            <>
              {/* Selected Vehicle Info */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-16 h-16 bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: `url(${selectedVehicle.imageUrl})` }}
                  ></div>
                  <div>
                    <h4 className="text-white font-semibold">{selectedVehicle.name}</h4>
                    <p className="text-gold-400">{selectedVehicle.price}</p>
                    <p className="text-white/60 text-sm">📍 {selectedVehicle.city} • {selectedVehicle.type}</p>
                  </div>
                </div>
              </div>

              {/* Conflict Resolution Alert */}
              {hasConflicts && (
                <div className="p-4 bg-orange-500/20 border border-orange-500/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-300 font-semibold mb-1">
                        ⚠️ Conflicting Availability Records
                      </p>
                      <p className="text-orange-200 text-sm">
                        Multiple availability records found for the same dates. This may cause unexpected behavior.
                      </p>
                    </div>
                    <button
                      onClick={clearConflictingAvailability}
                      disabled={loading}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:bg-orange-500/50"
                    >
                      {loading ? "Clearing..." : "Clear Conflicts"}
                    </button>
                  </div>
                </div>
              )}

              {/* Availability Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={availabilityData.startDate}
                    onChange={(e) => setAvailabilityData({...availabilityData, startDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={availabilityData.endDate}
                    onChange={(e) => setAvailabilityData({...availabilityData, endDate: e.target.value})}
                    min={availabilityData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 backdrop-blur-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Availability Status
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        value={true}
                        checked={availabilityData.isAvailable}
                        onChange={() => setAvailabilityData({...availabilityData, isAvailable: true})}
                        className="text-gold-400 focus:ring-gold-400"
                      />
                      <span className="ml-2 text-white">Available</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        value={false}
                        checked={!availabilityData.isAvailable}
                        onChange={() => setAvailabilityData({...availabilityData, isAvailable: false})}
                        className="text-gold-400 focus:ring-gold-400"
                      />
                      <span className="ml-2 text-white">Unavailable</span>
                    </label>
                  </div>
                </div>

                {!availabilityData.isAvailable && (
                  <div className="md:col-span-2">
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Reason for Unavailability
                    </label>
                    <input
                      type="text"
                      value={availabilityData.reason}
                      onChange={(e) => setAvailabilityData({...availabilityData, reason: e.target.value})}
                      placeholder="e.g., Maintenance, Repair, Service"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 backdrop-blur-sm"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleSetAvailability}
                disabled={loading || !availabilityData.startDate || !availabilityData.endDate}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-slate-900 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
              >
                {loading ? "Updating Availability..." : "Set Vehicle Availability"}
              </button>

              {/* Help Text */}
              <div className="text-center text-white/60 text-sm">
                <p>💡 Tip: Setting a vehicle as "Available" will override any previous "Unavailable" records for the same dates.</p>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'view-availability' && (
        <div className="space-y-4">
          {/* Vehicle Selection for Viewing */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Select Vehicle to View Availability
            </label>
            <select
              value={selectedVehicle?.id || ''}
              onChange={(e) => {
                const vehicle = vehicles.find(v => v.id.toString() === e.target.value);
                handleVehicleSelect(vehicle);
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 backdrop-blur-sm"
            >
              <option value="">Choose a vehicle...</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id} className="text-slate-800">
                  {vehicle.name} - {vehicle.city} ({vehicle.type})
                </option>
              ))}
            </select>
          </div>

          {selectedVehicle && (
            <>
              {/* Conflict Resolution Alert */}
              {hasConflicts && (
                <div className="p-4 bg-orange-500/20 border border-orange-500/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-300 font-semibold mb-1">
                        ⚠️ Conflicting Availability Records
                      </p>
                      <p className="text-orange-200 text-sm">
                        Multiple availability records found for the same dates. This may cause unexpected behavior.
                      </p>
                    </div>
                    <button
                      onClick={clearConflictingAvailability}
                      disabled={loading}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:bg-orange-500/50"
                    >
                      {loading ? "Clearing..." : "Clear Conflicts"}
                    </button>
                  </div>
                </div>
              )}

              {/* Availability List */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-4">
                  Availability for {selectedVehicle.name}
                </h4>
                
                {existingAvailability.length > 0 ? (
                  <div className="space-y-3">
                    {existingAvailability.map((availability) => (
                      <AvailabilityItem key={availability.id} availability={availability} />
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60 text-center py-4">
                    No availability records found for this vehicle.
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                  <p className="text-green-300 font-semibold">
                    {existingAvailability.filter(a => a.isAvailable).length}
                  </p>
                  <p className="text-green-300 text-sm">Available Periods</p>
                </div>
                <div className="bg-red-500/20 rounded-lg p-3 border border-red-500/30">
                  <p className="text-red-300 font-semibold">
                    {existingAvailability.filter(a => !a.isAvailable).length}
                  </p>
                  <p className="text-red-300 text-sm">Unavailable Periods</p>
                </div>
              </div>

              {/* Vehicle Status Summary */}
              <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
                <h5 className="text-blue-300 font-semibold mb-2">Vehicle Status Summary</h5>
                <div className="text-white/80 text-sm space-y-1">
                  <p>• Total Records: {existingAvailability.length}</p>
                  <p>• Has Conflicts: {hasConflicts ? 'Yes ⚠️' : 'No ✅'}</p>
                  <p>• Last Updated: {
                    existingAvailability.length > 0 
                      ? new Date(Math.max(...existingAvailability.map(a => new Date(a.updatedAt || a.createdAt)))).toLocaleDateString()
                      : 'Never'
                  }</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleAvailabilityManager;