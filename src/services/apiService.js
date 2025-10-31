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

// Bookings API
export const bookingsAPI = {
  createBooking: (bookingData) => 
    apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),
  
  getBookings: () => apiRequest('/bookings'),
  getBookingsByCustomer: (email) => apiRequest(`/bookings/customer/${email}`),
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

  // Get user profile
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
  }
};