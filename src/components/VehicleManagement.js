// components/VehicleManagement.js
import React, { useState, useEffect } from "react";
import { vehiclesAPI } from "../services/apiService";
import ReactDOM from 'react-dom';

// Modal Component that renders outside the main component tree
const Modal = ({ children, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      {children}
    </div>,
    document.body
  );
};

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [bulkDiscount, setBulkDiscount] = useState("");
  const [selectedVehicles, setSelectedVehicles] = useState(new Set());
  const [message, setMessage] = useState({ type: '', text: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Vehicle form state
  const [vehicleData, setVehicleData] = useState({
    name: '',
    type: 'Car',
    rentPrice: '',
    salePrice: '',
    city: '',
    purpose: 'rent',
    description: '',
    capacity: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    discountPercentage: 0
  });

  // Load vehicles on component mount
  useEffect(() => {
    loadVehicles();
  }, []);

  // Filter vehicles based on search and availability
  useEffect(() => {
    let filtered = vehicles;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply availability filter
    if (availabilityFilter !== "all") {
      const available = availabilityFilter === "available";
      filtered = filtered.filter(vehicle => vehicle.available === available);
    }
    
    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, availabilityFilter]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      console.log('Loading vehicles...');
      const data = await vehiclesAPI.getAllVehiclesForAdmin();
      console.log('Vehicles loaded:', data);
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setMessage({ type: 'error', text: 'Failed to load vehicles: ' + error.message });
      // Set empty arrays to prevent rendering issues
      setVehicles([]);
      setFilteredVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term) {
      setLoading(true);
      try {
        const data = await vehiclesAPI.searchVehicles(term);
        setFilteredVehicles(data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Search failed' });
      } finally {
        setLoading(false);
      }
    } else {
      setFilteredVehicles(vehicles);
    }
  };

  const handleAvailabilityFilter = async (filter) => {
    setAvailabilityFilter(filter);
    setLoading(true);
    try {
      let data;
      if (filter === "all") {
        data = await vehiclesAPI.getAllVehiclesForAdmin();
      } else {
        const available = filter === "available";
        data = await vehiclesAPI.getVehiclesByAvailability(available);
      }
      setFilteredVehicles(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Filter failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const resetImageState = () => {
    setImageFile(null);
    setImagePreview(null);
    // Clean up preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vehiclesAPI.createVehicleWithImage(vehicleData, imageFile);
      setMessage({ type: 'success', text: 'Vehicle added successfully' });
      setIsAddingVehicle(false);
      // Reset form and image state
      setVehicleData({
        name: '',
        type: 'Car',
        rentPrice: '',
        salePrice: '',
        city: '',
        purpose: 'rent',
        description: '',
        capacity: '',
        fuelType: 'Petrol',
        transmission: 'Manual',
        discountPercentage: 0
      });
      resetImageState();
      loadVehicles();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add vehicle: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleData({
      name: vehicle.name,
      type: vehicle.type,
      rentPrice: vehicle.rentPrice,
      salePrice: vehicle.salePrice || '',
      city: vehicle.city,
      purpose: vehicle.purpose,
      description: vehicle.description || '',
      capacity: vehicle.capacity || '',
      fuelType: vehicle.fuelType || 'Petrol',
      transmission: vehicle.transmission || 'Manual',
      discountPercentage: vehicle.discountPercentage || 0
    });
    // Set image preview for existing vehicle
    if (vehicle.imageUrl) {
      setImagePreview(vehicle.imageUrl);
    }
    setIsEditingVehicle(true);
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vehiclesAPI.updateVehicleWithImage(selectedVehicle.id, vehicleData, imageFile);
      setMessage({ type: 'success', text: 'Vehicle updated successfully' });
      setIsEditingVehicle(false);
      setSelectedVehicle(null);
      resetImageState();
      loadVehicles();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update vehicle' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (vehicleId) => {
    try {
      await vehiclesAPI.toggleAvailability(vehicleId);
      setMessage({ type: 'success', text: 'Availability updated successfully' });
      loadVehicles();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update availability' });
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      try {
        await vehiclesAPI.hardDeleteVehicle(vehicleId);
        setMessage({ type: 'success', text: 'Vehicle deleted successfully' });
        loadVehicles();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete vehicle' });
      }
    }
  };

  const handleUpdateDiscount = async (vehicleId, discount) => {
    if (discount === null) return; // User cancelled the prompt
    
    try {
      await vehiclesAPI.updateDiscount(vehicleId, discount);
      setMessage({ type: 'success', text: 'Discount updated successfully' });
      loadVehicles();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update discount' });
    }
  };

  const handleBulkDiscount = async () => {
    if (!bulkDiscount || selectedVehicles.size === 0) return;
    
    // FIXED: Parse the discount value properly
    const discount = parseFloat(bulkDiscount);
    if (isNaN(discount) || discount < 0 || discount > 100) {
        setMessage({ type: 'error', text: 'Discount must be a number between 0 and 100' });
        return;
    }

    try {
        await vehiclesAPI.bulkUpdateDiscount(Array.from(selectedVehicles), discount);
        setMessage({ type: 'success', text: `Discount applied to ${selectedVehicles.size} vehicles` });
        setBulkDiscount("");
        setSelectedVehicles(new Set());
        setIsDiscountModalOpen(false);
        loadVehicles();
    } catch (error) {
        setMessage({ type: 'error', text: 'Failed to apply bulk discount: ' + error.message });
    }
  };

  const toggleVehicleSelection = (vehicleId) => {
    const newSelection = new Set(selectedVehicles);
    if (newSelection.has(vehicleId)) {
      newSelection.delete(vehicleId);
    } else {
      newSelection.add(vehicleId);
    }
    setSelectedVehicles(newSelection);
  };

  const selectAllVehicles = () => {
    if (selectedVehicles.size === filteredVehicles.length) {
      setSelectedVehicles(new Set());
    } else {
      setSelectedVehicles(new Set(filteredVehicles.map(v => v.id)));
    }
  };

  const closeAddModal = () => {
    setIsAddingVehicle(false);
    resetImageState();
    setVehicleData({
      name: '',
      type: 'Car',
      rentPrice: '',
      salePrice: '',
      city: '',
      purpose: 'rent',
      description: '',
      capacity: '',
      fuelType: 'Petrol',
      transmission: 'Manual',
      discountPercentage: 0
    });
  };

  const closeEditModal = () => {
    setIsEditingVehicle(false);
    setSelectedVehicle(null);
    resetImageState();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vehicle Management</h2>
        <button
          onClick={() => setIsAddingVehicle(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Add New Vehicle
        </button>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Vehicles</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by vehicle name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
          <select
            value={availabilityFilter}
            onChange={(e) => handleAvailabilityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Vehicles</option>
            <option value="available">Available Only</option>
            <option value="unavailable">Unavailable Only</option>
          </select>
        </div>

        <div className="flex items-end space-x-2">
          <button
            onClick={() => setIsDiscountModalOpen(true)}
            disabled={selectedVehicles.size === 0}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Bulk Discount ({selectedVehicles.size})
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading vehicles...</p>
        </div>
      )}

      {/* Vehicles Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedVehicles.size === filteredVehicles.length && filteredVehicles.length > 0}
                  onChange={selectAllVehicles}
                  className="rounded"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rent Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedVehicles.has(vehicle.id)}
                    onChange={() => toggleVehicleSelection(vehicle.id)}
                    className="rounded"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <img
                      src={vehicle.imageUrl || '/default-vehicle.jpg'}
                      alt={vehicle.name}
                      className="h-10 w-10 rounded-lg object-cover mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{vehicle.name}</div>
                      <div className="text-sm text-gray-500">{vehicle.purpose}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{vehicle.type}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{vehicle.city}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{vehicle.rentPrice}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    vehicle.discountPercentage > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {vehicle.discountPercentage}%
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    vehicle.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditVehicle(vehicle)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleAvailability(vehicle.id)}
                      className="text-orange-600 hover:text-orange-900"
                    >
                      {vehicle.available ? 'Make Unavailable' : 'Make Available'}
                    </button>
                    <button
                      onClick={() => handleUpdateDiscount(vehicle.id, prompt('Enter discount percentage:', vehicle.discountPercentage))}
                      className="text-green-600 hover:text-green-900"
                    >
                      Discount
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredVehicles.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No vehicles found
          </div>
        )}
      </div>

      {/* Bulk Discount Modal */}
      {isDiscountModalOpen && (
        <Modal onClose={() => setIsDiscountModalOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
            <h3 className="text-lg font-bold mb-4">Apply Bulk Discount</h3>
            <p className="text-sm text-gray-600 mb-4">
              Apply discount to {selectedVehicles.size} selected vehicles
            </p>
            <input
              type="number"
              value={bulkDiscount}
              onChange={(e) => setBulkDiscount(e.target.value)}
              placeholder="Enter discount percentage (0-100)"
              min="0"
              max="100"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDiscountModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDiscount}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Apply Discount
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Vehicle Modal */}
      {isAddingVehicle && (
        <Modal onClose={closeAddModal}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Add New Vehicle</h3>
                <button
                  onClick={closeAddModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                {/* Image Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center justify-center">
                    {imagePreview ? (
                      <>
                        <img 
                          src={imagePreview} 
                          alt="Vehicle preview" 
                          className="h-32 w-32 object-cover rounded-lg mb-4"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('add-vehicle-image').click()}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Change Image
                        </button>
                      </>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 mb-2">Upload vehicle image</p>
                        <button
                          type="button"
                          onClick={() => document.getElementById('add-vehicle-image').click()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Choose Image
                        </button>
                      </>
                    )}
                    <input
                      id="add-vehicle-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={vehicleData.name}
                      onChange={(e) => setVehicleData({...vehicleData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Type *
                    </label>
                    <select
                      name="type"
                      value={vehicleData.type}
                      onChange={(e) => setVehicleData({...vehicleData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Car">Car</option>
                      <option value="Bike">Bike</option>
                      <option value="Scooter">Scooter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={vehicleData.city}
                      onChange={(e) => setVehicleData({...vehicleData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rent Price *
                    </label>
                    <input
                      type="text"
                      name="rentPrice"
                      value={vehicleData.rentPrice}
                      onChange={(e) => setVehicleData({...vehicleData, rentPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., ₹1500/day"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sale Price
                    </label>
                    <input
                      type="text"
                      name="salePrice"
                      value={vehicleData.salePrice}
                      onChange={(e) => setVehicleData({...vehicleData, salePrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., ₹500000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose *
                    </label>
                    <select
                      name="purpose"
                      value={vehicleData.purpose}
                      onChange={(e) => setVehicleData({...vehicleData, purpose: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="rent">Rent Only</option>
                      <option value="sale">Sale Only</option>
                      <option value="both">Both Rent & Sale</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Type
                    </label>
                    <select
                      name="fuelType"
                      value={vehicleData.fuelType}
                      onChange={(e) => setVehicleData({...vehicleData, fuelType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transmission
                    </label>
                    <select
                      name="transmission"
                      value={vehicleData.transmission}
                      onChange={(e) => setVehicleData({...vehicleData, transmission: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={vehicleData.capacity}
                      onChange={(e) => setVehicleData({...vehicleData, capacity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Number of seats"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={vehicleData.discountPercentage}
                      onChange={(e) => setVehicleData({...vehicleData, discountPercentage: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="0-100%"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={vehicleData.description}
                      onChange={(e) => setVehicleData({...vehicleData, description: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Vehicle description and features..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Vehicle Modal */}
      {isEditingVehicle && (
        <Modal onClose={closeEditModal}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Edit Vehicle</h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateVehicle} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                {/* Image Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center justify-center">
                    {imagePreview ? (
                      <>
                        <img 
                          src={imagePreview} 
                          alt="Vehicle preview" 
                          className="h-32 w-32 object-cover rounded-lg mb-4"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('edit-vehicle-image').click()}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Change Image
                        </button>
                      </>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 mb-2">Upload new vehicle image (optional)</p>
                        <button
                          type="button"
                          onClick={() => document.getElementById('edit-vehicle-image').click()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Choose Image
                        </button>
                      </>
                    )}
                    <input
                      id="edit-vehicle-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={vehicleData.name}
                      onChange={(e) => setVehicleData({...vehicleData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Type *
                    </label>
                    <select
                      name="type"
                      value={vehicleData.type}
                      onChange={(e) => setVehicleData({...vehicleData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Car">Car</option>
                      <option value="Bike">Bike</option>
                      <option value="Scooter">Scooter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={vehicleData.city}
                      onChange={(e) => setVehicleData({...vehicleData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rent Price *
                    </label>
                    <input
                      type="text"
                      name="rentPrice"
                      value={vehicleData.rentPrice}
                      onChange={(e) => setVehicleData({...vehicleData, rentPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sale Price
                    </label>
                    <input
                      type="text"
                      name="salePrice"
                      value={vehicleData.salePrice}
                      onChange={(e) => setVehicleData({...vehicleData, salePrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose *
                    </label>
                    <select
                      name="purpose"
                      value={vehicleData.purpose}
                      onChange={(e) => setVehicleData({...vehicleData, purpose: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="rent">Rent Only</option>
                      <option value="sale">Sale Only</option>
                      <option value="both">Both Rent & Sale</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Type
                    </label>
                    <select
                      name="fuelType"
                      value={vehicleData.fuelType}
                      onChange={(e) => setVehicleData({...vehicleData, fuelType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transmission
                    </label>
                    <select
                      name="transmission"
                      value={vehicleData.transmission}
                      onChange={(e) => setVehicleData({...vehicleData, transmission: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={vehicleData.capacity}
                      onChange={(e) => setVehicleData({...vehicleData, capacity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={vehicleData.discountPercentage}
                      onChange={(e) => setVehicleData({...vehicleData, discountPercentage: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={vehicleData.description}
                      onChange={(e) => setVehicleData({...vehicleData, description: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VehicleManagement;