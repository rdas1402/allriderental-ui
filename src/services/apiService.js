// services/apiService.js

// FIXED: Add proper fallback and handle undefined case
const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://allriderental-fafbg7dnhzf3afbg.canadacentral-01.azurewebsites.net') + "/api";

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  // Validate URL before making request
  if (!API_BASE_URL || API_BASE_URL.includes('undefined')) {
    console.error('API_BASE_URL is undefined. Check your environment variables.');
    throw new Error('API configuration error: Base URL is not defined');
  }
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('Making API call to:', url); // Debug log
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Cities API
export const citiesAPI = {
  getCities: () => apiRequest('/cities'),
};

// Vehicles API
export const vehiclesAPI = {
  getVehicles: () => apiRequest('/vehicles'),
  getVehiclesByCity: (city) => apiRequest(`/vehicles/city/${city}`),
  getVehiclesByType: (type) => apiRequest(`/vehicles/type/${type}`),
  getVehiclesByCityAndType: (city, type) => apiRequest(`/vehicles/filter?city=${city}&type=${type}`),
  getAvailableCities: () => apiRequest('/vehicles/cities'),
  getVehicleCounts: () => apiRequest('/vehicles/counts'),
};

// Bookings API - Updated with all endpoints including getBookingsByVehicle
export const bookingsAPI = {
  createBooking: (bookingData) => 
    apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),
  
  getBookings: () => apiRequest('/bookings'),
  
  getBookingsByCustomer: (phone) => apiRequest(`/bookings/customer/${phone}`),
  
  // UPDATED: Get bookings by vehicle ID for date blocking
  getVehicleBookingAndAvailability: async (vehicleId) => {
    try {
      const response = await apiRequest(`/bookings/vehicle/${vehicleId}/availability`);
      console.log("Bookings by vehicle API response:", response);
      return response;
    } catch (error) {
      console.error("Error in getBookingsByVehicle:", error);
      // Return fallback structure
      return {
        success: true,
        data: {
          bookings: [],
          unavailableDates: [],
          availablePeriods: [],
          unavailablePeriods: [],
          isVehicleGenerallyAvailable: true
        },
        message: 'Using fallback data due to API error'
      };
    }
  },
  
  getBookingById: (id) => apiRequest(`/bookings/${id}`),
  
  updateBookingStatus: (id, status) => 
    apiRequest(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  
  cancelBooking: (id) => 
    apiRequest(`/bookings/${id}/cancel`, {
      method: 'PUT',
    }),
  
  getBookingStats: () => apiRequest('/bookings/stats'),
  
  checkVehicleAvailability: (vehicleId, startDate, endDate) => 
    apiRequest(`/bookings/availability?vehicleId=${vehicleId}&startDate=${startDate}&endDate=${endDate}`),
};

// Authentication API
export const authAPI = {
  // MSG91 Widget Verification
  verifyWidget: async (accessToken) => {
    return apiRequest('/auth/verify-widget', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });
  },

  // Send OTP to phone number (traditional method)
  sendOtp: async (phoneNumber) => {
    return apiRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone: phoneNumber }),
    });
  },

  // Verify OTP (traditional method)
  verifyOtp: async (phoneNumber, otp) => {
    return apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone: phoneNumber, otp }),
    });
  },

  // Check if user exists
  checkUserExists: async (phoneNumber) => {
    return apiRequest(`/auth/users/check/${phoneNumber}`);
  },

  // Alternative check user endpoint
  checkUserExistsAlt: async (phoneNumber) => {
    return apiRequest(`/auth/check-user/${phoneNumber}`);
  },

  // Get user profile (now handles both admin and regular users)
  getUserProfile: async (phoneNumber) => {
    return apiRequest(`/auth/profile/${phoneNumber}`);
  },

  // Create new user
  createUser: async (userData) => {
    return apiRequest('/auth/create-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Update user profile
  updateUser: async (userData) => {
    return apiRequest('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Get user bookings
  getUserBookings: async (phoneNumber) => {
    return apiRequest(`/auth/bookings/${phoneNumber}`);
  },

  // Get user profile with bookings
  getUserProfileWithBookings: async (phoneNumber) => {
    return apiRequest(`/auth/profile/${phoneNumber}`);
  },

  // Admin profile endpoint (if needed separately)
  getAdminProfile: async (phoneNumber) => {
    return apiRequest(`/auth/profile/${phoneNumber}`); // Same endpoint now handles both
  },
};

// Admin API - Complete and organized
export const adminAPI = {
  // Admin authentication and role check
  checkAdminRole: (phone) => apiRequest(`/admin/check-role/${phone}`),
  
  // Booking management with pagination support
  getAllBookings: (page = 0, size = 50) => 
    apiRequest(`/admin/bookings?page=${page}&size=${size}`),
  
  getCompletedBookings: (page = 0, size = 50) => 
    apiRequest(`/admin/bookings/completed?page=${page}&size=${size}`),
  
  getUpcomingBookings: (page = 0, size = 50) => 
    apiRequest(`/admin/bookings/upcoming?page=${page}&size=${size}`),
  
  updateBooking: (bookingId, updateData) =>
    apiRequest(`/admin/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    }),
  
  cancelBooking: (bookingId) =>
    apiRequest(`/admin/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    }),

  // Vehicle availability management
  setVehicleAvailability: (vehicleId, availabilityData) =>
    apiRequest(`/admin/vehicles/${vehicleId}/availability`, {
      method: 'POST',
      body: JSON.stringify(availabilityData),
    }),
  
  getVehicleAvailability: (vehicleId) => 
    apiRequest(`/admin/vehicles/${vehicleId}/availability`),
  
  deleteVehicleAvailability: (availabilityId) =>
    apiRequest(`/admin/availability/${availabilityId}`, {
      method: 'DELETE',
    }),
  
  // New endpoints for enhanced availability management
  setVehicleUnavailable: (vehicleId, requestData) =>
    apiRequest(`/admin/vehicles/${vehicleId}/unavailable`, {
      method: 'POST',
      body: JSON.stringify(requestData),
    }),
  
  setVehicleAvailable: (vehicleId, requestData) =>
    apiRequest(`/admin/vehicles/${vehicleId}/available`, {
      method: 'POST',
      body: JSON.stringify(requestData),
    }),
  
  getAvailabilityStatus: (vehicleId, startDate, endDate) =>
    apiRequest(`/admin/vehicles/${vehicleId}/availability-status?startDate=${startDate}&endDate=${endDate}`),
  
  removeUnavailablePeriod: (availabilityId) =>
    apiRequest(`/admin/availability/${availabilityId}`, {
      method: 'DELETE',
    }),
  
  // Admin statistics
  getAdminStats: () => apiRequest('/admin/stats'),

  // User management (if needed in future)
  getAllUsers: (page = 0, size = 50) =>
    apiRequest(`/admin/users?page=${page}&size=${size}`),

  getUserDetails: (userId) =>
    apiRequest(`/admin/users/${userId}`),

  // Vehicle management (if needed in future)
  createVehicle: (vehicleData) =>
    apiRequest('/admin/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    }),

  updateVehicle: (vehicleId, vehicleData) =>
    apiRequest(`/admin/vehicles/${vehicleId}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    }),

  deleteVehicle: (vehicleId) =>
    apiRequest(`/admin/vehicles/${vehicleId}`, {
      method: 'DELETE',
    }),

  clearConflictingAvailability: (vehicleId) =>
    apiRequest(`/admin/vehicles/${vehicleId}/availability/clear-conflicts`, {
        method: 'DELETE',
    }),
};

// Vehicle Availability API (for the VehicleAvailabilityManager component)
export const vehicleAvailabilityAPI = {
  getAvailability: (vehicleId) => 
    apiRequest(`/admin/vehicles/${vehicleId}/availability`),
  
  setAvailability: (vehicleId, availabilityData) =>
    apiRequest(`/admin/vehicles/${vehicleId}/availability`, {
      method: 'POST',
      body: JSON.stringify(availabilityData),
    }),
  
  deleteAvailability: (availabilityId) =>
    apiRequest(`/admin/availability/${availabilityId}`, {
      method: 'DELETE',
    }),
};

// Statistics API (for the AdminStatsDashboard component)
export const statsAPI = {
  getAdminStats: () => apiRequest('/admin/stats'),
  getBookingStats: () => apiRequest('/bookings/stats'),
  getVehicleStats: () => apiRequest('/vehicles/counts'),
};

export default apiRequest;