// services/apiService.js

// FIXED: Add proper fallback and handle undefined case
const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://all-ride-rental-env.eba-9wmp3buc.ap-south-1.elasticbeanstalk.com') + "/api";

// Helper function to construct image URLs
const getImageUrl = (imageFilename) => {
  if (!imageFilename) return null;
  
  // If it's already a full URL, return as is
  if (imageFilename.startsWith('http')) {
    return imageFilename;
  }
  
  // If it's a filename, construct the full URL
  return `${API_BASE_URL.replace('/api', '')}/images/${imageFilename}`;
};

// Helper function to transform vehicle data with proper image URLs
const transformVehicleData = (vehicle) => {
  if (!vehicle) return vehicle;
  
  return {
    ...vehicle,
    imageUrl: getImageUrl(vehicle.imageUrl),
    // For backward compatibility - update the image field too
    image: getImageUrl(vehicle.image)
  };
};

// Helper function to transform array of vehicles
const transformVehiclesArray = (vehicles) => {
  if (!Array.isArray(vehicles)) return vehicles;
  return vehicles.map(transformVehicleData);
};

// Helper function to transform booking data with proper image URLs
const transformBookingData = (booking) => {
  if (!booking) return booking;

  const transformed = {
    ...booking,
    // Transform vehicle image if present in booking
    vehicleImageUrl: getImageUrl(booking.vehicleImageUrl || booking.vehicleImage),
    // For backward compatibility
    vehicleImage: getImageUrl(booking.vehicleImageUrl || booking.vehicleImage),
  };
  
  // If there's a nested vehicle object, transform it too
  if (booking.vehicle) {
    transformed.vehicle = transformVehicleData(booking.vehicle);
  }
  
  return transformed;
};

// Helper function to transform array of bookings
const transformBookingsArray = (bookings) => {
  if (!Array.isArray(bookings.data)) return bookings;
  return bookings.data.map(transformBookingData);
};

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
  getCities: async () => {
    const cities = await apiRequest('/cities');
    return cities;
  },
};

// Vehicles API - COMPLETELY UPDATED WITH CONSISTENT IMAGE URLS
export const vehiclesAPI = {
  // Original endpoints (backward compatible)
  getVehicles: async () => {
    const vehicles = await apiRequest('/vehicles');
    return transformVehiclesArray(vehicles);
  },
  
  getVehiclesByCity: async (city) => {
    const vehicles = await apiRequest(`/vehicles/city/${city}`);
    return transformVehiclesArray(vehicles);
  },
  
  getVehiclesByType: async (type) => {
    const vehicles = await apiRequest(`/vehicles/type/${type}`);
    return transformVehiclesArray(vehicles);
  },
  
  getVehiclesByCityAndType: async (city, type) => {
    const vehicles = await apiRequest(`/vehicles/filter?city=${city}&type=${type}`);
    return transformVehiclesArray(vehicles);
  },
  
  getAvailableCities: () => apiRequest('/vehicles/cities'),
  
  getVehicleCounts: () => apiRequest('/vehicles/counts'),

  // Get top discounted vehicles for homepage
  getTopDiscountedVehicles: async () => {
    const vehicles = await apiRequest('/vehicles/discounted/top');
    return transformVehiclesArray(vehicles);
  },
  
  // NEW: Rent-specific endpoints
  getVehiclesForRent: async () => {
    const vehicles = await apiRequest('/rent/vehicles');
    return transformVehiclesArray(vehicles);
  },
  
  getVehiclesForRentByCity: async (city) => {
    const vehicles = await apiRequest(`/rent/vehicles/city/${city}`);
    return transformVehiclesArray(vehicles);
  },
  
  getVehiclesForRentByType: async (type) => {
    const vehicles = await apiRequest(`/rent/vehicles/type/${type}`);
    return transformVehiclesArray(vehicles);
  },
  
  getVehiclesForRentByCityAndType: async (city, type) => {
    const vehicles = await apiRequest(`/rent/vehicles/filter?city=${city}&type=${type}`);
    return transformVehiclesArray(vehicles);
  },
  
  getAvailableCitiesForRent: () => apiRequest('/rent/vehicles/cities'),
  
  getRentVehicleCounts: () => apiRequest('/rent/vehicles/counts'),
  
  getVehicleForRentById: async (id) => {
    const vehicle = await apiRequest(`/rent/vehicles/${id}`);
    return transformVehicleData(vehicle);
  },
  
  // NEW: Sale-specific endpoints
  getVehiclesForSale: async () => {
    const vehicles = await apiRequest('/sale/vehicles');
    return transformVehiclesArray(vehicles);
  },
  
  getVehiclesForSaleByCity: async (city) => {
    const vehicles = await apiRequest(`/sale/vehicles/city/${city}`);
    return transformVehiclesArray(vehicles);
  },
  
  getVehiclesForSaleByType: async (type) => {
    const vehicles = await apiRequest(`/sale/vehicles/type/${type}`);
    return transformVehiclesArray(vehicles);
  },
  
  getVehiclesForSaleByCityAndType: async (city, type) => {
    const vehicles = await apiRequest(`/sale/vehicles/filter?city=${city}&type=${type}`);
    return transformVehiclesArray(vehicles);
  },
  
  getAvailableCitiesForSale: () => apiRequest('/sale/vehicles/cities'),
  
  getSaleVehicleCounts: () => apiRequest('/sale/vehicles/counts'),
  
  getVehicleForSaleById: async (id) => {
    const vehicle = await apiRequest(`/sale/vehicles/${id}`);
    return transformVehicleData(vehicle);
  },

  // NEW: Subscription vehicles endpoints
  getAvailableSubscriptionVehicles: async (deliveryDate, deliveryTime) => {
    const vehicles = await apiRequest(`/vehicles/subscription/available?deliveryDate=${deliveryDate}&deliveryTime=${deliveryTime}`);
    return transformVehiclesArray(vehicles);
  },
  
  getAvailableSubscriptionVehiclesByCity: async (city, deliveryDate, deliveryTime) => {
    const vehicles = await apiRequest(`/vehicles/subscription/available/city/${city}?deliveryDate=${deliveryDate}&deliveryTime=${deliveryTime}`);
    return transformVehiclesArray(vehicles);
  },
  
  getAvailableSubscriptionVehiclesByType: async (type, deliveryDate, deliveryTime) => {
    const vehicles = await apiRequest(`/vehicles/subscription/available/type/${type}?deliveryDate=${deliveryDate}&deliveryTime=${deliveryTime}`);
    return transformVehiclesArray(vehicles);
  },
  
  checkVehicleSubscriptionAvailability: async (vehicleId, deliveryDate, deliveryTime) => {
    const result = await apiRequest(`/vehicles/subscription/${vehicleId}/available?deliveryDate=${deliveryDate}&deliveryTime=${deliveryTime}`);
    // If the result contains vehicle data, transform it
    if (result.vehicle) {
      return {
        ...result,
        vehicle: transformVehicleData(result.vehicle)
      };
    }
    return result;
  },

  // Image upload and vehicle creation with images
  uploadVehicleImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Image upload failed: ${response.status}`);
    }
    
    const result = await response.json();
    // Transform the image URL in the response if it contains a filename
    if (result.imageUrl && !result.imageUrl.startsWith('http')) {
      result.imageUrl = getImageUrl(result.imageUrl);
    }
    return result;
  },

  // Create vehicle with image upload
  createVehicleWithImage: async (vehicleData, imageFile) => {
    const formData = new FormData();
    
    // Append all vehicle data
    formData.append('name', vehicleData.name);
    formData.append('type', vehicleData.type);
    formData.append('rentPrice', vehicleData.rentPrice);
    formData.append('city', vehicleData.city);
    formData.append('purpose', vehicleData.purpose || 'rent');
    
    if (vehicleData.salePrice) {
      formData.append('salePrice', vehicleData.salePrice);
    }
    if (vehicleData.description) {
      formData.append('description', vehicleData.description);
    }
    if (vehicleData.capacity) {
      formData.append('capacity', vehicleData.capacity.toString());
    }
    if (vehicleData.fuelType) {
      formData.append('fuelType', vehicleData.fuelType);
    }
    if (vehicleData.transmission) {
      formData.append('transmission', vehicleData.transmission);
    }
    if (vehicleData.discountPercentage) {
      formData.append('discountPercentage', vehicleData.discountPercentage.toString());
    }
    
    // Append image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Vehicle creation failed: ${response.status}`);
    }

    const result = await response.json();
    return transformVehicleData(result);
  },

  // Update vehicle with image
  updateVehicleWithImage: async (id, vehicleData, imageFile) => {
    const formData = new FormData();
    
    // Append all vehicle data
    formData.append('name', vehicleData.name);
    formData.append('type', vehicleData.type);
    formData.append('rentPrice', vehicleData.rentPrice);
    formData.append('city', vehicleData.city);
    formData.append('purpose', vehicleData.purpose || 'rent');
    
    if (vehicleData.salePrice) {
      formData.append('salePrice', vehicleData.salePrice);
    }
    if (vehicleData.description) {
      formData.append('description', vehicleData.description);
    }
    if (vehicleData.capacity) {
      formData.append('capacity', vehicleData.capacity.toString());
    }
    if (vehicleData.fuelType) {
      formData.append('fuelType', vehicleData.fuelType);
    }
    if (vehicleData.transmission) {
      formData.append('transmission', vehicleData.transmission);
    }
    if (vehicleData.discountPercentage) {
      formData.append('discountPercentage', vehicleData.discountPercentage.toString());
    }
    
    // Append image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Vehicle update failed: ${response.status}`);
    }

    const result = await response.json();
    return transformVehicleData(result);
  },

  // Additional method to get any vehicle by ID (for admin or other uses)
  getVehicleById: async (id) => {
    const vehicle = await apiRequest(`/vehicles/${id}`);
    return transformVehicleData(vehicle);
  },

  // ADMIN VEHICLE MANAGEMENT ENDPOINTS
  getAllVehiclesForAdmin: async () => {
    const response = await apiRequest('/admin/vehicles/all');
    return transformVehiclesArray(response);
  },

  searchVehicles: async (searchTerm) => {
    const endpoint = searchTerm ? `/admin/vehicles/search?search=${encodeURIComponent(searchTerm)}` : '/admin/vehicles/search';
    const vehicles = await apiRequest(endpoint);
    return transformVehiclesArray(vehicles);
  },

  getVehiclesByAvailability: async (available) => {
    const endpoint = available !== undefined ? `/admin/vehicles/filter?available=${available}` : '/admin/vehicles/filter';
    const vehicles = await apiRequest(endpoint);
    return transformVehiclesArray(vehicles);
  },

  updateDiscount: async (vehicleId, discountPercentage) => {
    const response = await apiRequest(`/admin/vehicles/${vehicleId}/discount`, {
      method: 'PUT',
      body: JSON.stringify({ discountPercentage: parseFloat(discountPercentage) }),
    });
    return transformVehicleData(response.vehicle);
  },

  toggleAvailability: async (vehicleId) => {
    const response = await apiRequest(`/admin/vehicles/${vehicleId}/toggle-availability`, {
      method: 'PUT',
    });
    return transformVehicleData(response.vehicle);
  },

  hardDeleteVehicle: async (vehicleId) => {
    return apiRequest(`/admin/vehicles/${vehicleId}/hard-delete`, {
      method: 'DELETE',
    });
  },

  bulkUpdateDiscount: async (vehicleIds, discountPercentage) => {
      // FIXED: Ensure discountPercentage is sent as number, not string
      const discountValue = parseFloat(discountPercentage);
      
      const vehicles = await apiRequest('/admin/vehicles/bulk-discount', {
          method: 'PUT',
          body: JSON.stringify({ 
              vehicleIds: vehicleIds,
              discountPercentage: discountValue  // Send as number, not string
          }),
      });
      return transformVehiclesArray(vehicles);
  },

};

// Bookings API - Updated with all endpoints including getBookingsByVehicle
export const bookingsAPI = {
  createBooking: (bookingData) => 
    apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),
  
  getBookings: () => apiRequest('/bookings'),
  
  getBookingsByCustomer: async (phone) => {
    const bookings = await apiRequest(`/bookings/customer/${phone}`);
    // Transform vehicle data in bookings if present
    return bookings.map(booking => ({
      ...booking,
      vehicle: booking.vehicle ? transformVehicleData(booking.vehicle) : booking.vehicle
    }));
  },
  
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
  
  getBookingById: async (id) => {
    const booking = await apiRequest(`/bookings/${id}`);
    // Transform vehicle data in booking if present
    return {
      ...booking,
      vehicle: booking.vehicle ? transformVehicleData(booking.vehicle) : booking.vehicle
    };
  },
  
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

  // FIXED: Get user bookings - properly handle the response structure
  getUserBookings: async (phoneNumber) => {
    const response = await apiRequest(`/auth/bookings/${phoneNumber}`);
    
    // Extract the bookings array from the response
    const bookings = response.bookings || [];
    
    // Transform vehicle data in bookings if present
    return bookings.map(booking => ({
      ...booking,
      vehicle: booking.vehicle ? transformVehicleData(booking.vehicle) : booking.vehicle
    }));
  },
};

// Admin API - Complete and organized
export const adminAPI = {
  // Admin authentication and role check
  checkAdminRole: (phone) => apiRequest(`/admin/check-role/${phone}`),
  
  // Booking management with pagination support
  getAllBookings: async (page = 0, size = 50) => {
    const bookings = await apiRequest(`/admin/bookings?page=${page}&size=${size}`);
    return transformBookingsArray(bookings);
  },
  
  getCompletedBookings: async (page = 0, size = 50) => {
    const bookings = await apiRequest(`/admin/bookings/completed?page=${page}&size=${size}`);
    return transformBookingsArray(bookings);
  },
  
  getUpcomingBookings: async (page = 0, size = 50) => {
    const bookings = await apiRequest(`/admin/bookings/upcoming?page=${page}&size=${size}`);
    return transformBookingsArray(bookings);
  },

  getCancelledBookings: async (page = 0, size = 50) => {
    const bookings = await apiRequest(`/admin/bookings/cancelled?page=${page}&size=${size}`);
    return transformBookingsArray(bookings);
  },
  
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
  createVehicle: async (vehicleData) => {
    const vehicle = await apiRequest('/admin/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
    return transformVehicleData(vehicle);
  },

  updateVehicle: async (vehicleId, vehicleData) => {
    const vehicle = await apiRequest(`/vehicles/${vehicleId}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
    return transformVehicleData(vehicle);
  },

  deleteVehicle: (vehicleId) =>
    apiRequest(`/admin/vehicles/${vehicleId}`, {
      method: 'DELETE',
    }),

  clearConflictingAvailability: (vehicleId) =>
    apiRequest(`/admin/vehicles/${vehicleId}/availability/clear-conflicts`, {
        method: 'DELETE',
    }),

  // Update vehicle prices
  updateVehiclePrices: (vehicleId, priceData) =>
    apiRequest(`/vehicles/${vehicleId}/prices`, {
      method: 'PUT',
      body: JSON.stringify(priceData),
    }),

  // Get available purpose options for a vehicle
  getAvailablePurposeOptions: (vehicleId) => 
    apiRequest(`/admin/vehicles/${vehicleId}/purpose-options`),
  
  // Update vehicle purpose
  updateVehiclePurpose: (vehicleId, purpose) =>
    apiRequest(`/admin/vehicles/${vehicleId}/purpose`, {
      method: 'PUT',
      body: JSON.stringify({ purpose }),
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

// Payment API
export const paymentAPI = {
  createOrder: (orderData) =>
    apiRequest('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  // verifyPayment: (paymentData) =>
  //   apiRequest('/payment/verify-payment', {
  //     method: 'POST',
  //     body: JSON.stringify(paymentData),
  //   }),

  getTransaction: (bookingId) =>
    apiRequest(`/payment/transaction/${bookingId}`),

  sendBookingNotifications: (bookingId) =>
    apiRequest(`/payment/send-booking-notifications/${bookingId}`, {
      method: 'POST',
    }),

  testNotifications: (testData) =>
    apiRequest('/payment/test-notifications', {
      method: 'POST',
      body: JSON.stringify(testData),
    }),

  processBookingPayment: (paymentData) =>
    apiRequest('/payment/process-booking-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  mockPaymentSuccess: (paymentData) =>
    apiRequest('/payment/mock-payment-success', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  getPaymentStatus: (bookingId) =>
    apiRequest(`/payment/booking/${bookingId}`),
};

// Notification API
export const notificationAPI = {
  // Send booking confirmation notifications (email + SMS)
  sendBookingConfirmation: (notificationData) => 
    apiRequest('/notifications/send-booking-confirmation', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    }),

  // Send admin notifications
  sendAdminNotification: (notificationData) =>
    apiRequest('/notifications/send-admin-notification', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    }),

  // Send booking notifications for specific booking
  sendBookingNotifications: (bookingId) =>
    apiRequest(`/payment/send-booking-notifications/${bookingId}`, {
      method: 'POST',
    }),

  // Test notifications
  testNotifications: (testData) =>
    apiRequest('/payment/test-notifications', {
      method: 'POST',
      body: JSON.stringify(testData),
    }),

  // Test email specifically
  testEmail: (email, testData = {}) =>
    apiRequest('/notifications/test-email', {
      method: 'POST',
      body: JSON.stringify({ email, ...testData }),
    }),

  // Test SMS specifically
  testSMS: (phone, testData = {}) =>
    apiRequest('/notifications/test-sms', {
      method: 'POST',
      body: JSON.stringify({ phone, ...testData }),
    }),
};

// =============================================
// COUPON MANAGEMENT API
// =============================================

export const couponsAPI = {
  // Get all coupons for admin management
  getAllCoupons: async () => {
    return apiRequest('/coupons');
  },

  // Get active coupons for display
  getActiveCoupons: async () => {
    return apiRequest('/coupons/active');
  },

  // Validate coupon for a specific booking
  validateCoupon: async (couponCode, bookingData) => {
    return apiRequest('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({
        couponCode,
        bookingData: bookingData
      }),
    });
  },

  // Create new coupon
  createCoupon: async (couponData) => {
    return apiRequest('/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    });
  },

  // Update existing coupon
  updateCoupon: async (couponId, couponData) => {
    return apiRequest(`/coupons/${couponId}`, {
      method: 'PUT',
      body: JSON.stringify(couponData),
    });
  },

  // Delete coupon
  deleteCoupon: async (couponId) => {
    return apiRequest(`/coupons/${couponId}`, {
      method: 'DELETE',
    });
  },

  // Get coupon by ID
  getCouponById: async (couponId) => {
    return apiRequest(`/coupons/${couponId}`);
  },

  // Get coupon by code
  getCouponByCode: async (couponCode) => {
    return apiRequest(`/coupons/code/${couponCode}`);
  },

  // Get coupons applicable for a specific vehicle
  getCouponsForVehicle: async (vehicleId, city, vehicleType, isSubscription = false) => {
    const params = new URLSearchParams();
    if (vehicleId) params.append('vehicleId', vehicleId);
    if (city) params.append('city', city);
    if (vehicleType) params.append('vehicleType', vehicleType);
    if (isSubscription) params.append('isSubscription', isSubscription);
    
    return apiRequest(`/coupons/for-vehicle?${params.toString()}`);
  },

  // Track coupon usage
  trackCouponUsage: async (couponId, bookingId, discountAmount, userPhone) => {
    return apiRequest('/coupons/track-usage', {
      method: 'POST',
      body: JSON.stringify({
        couponId,
        bookingId,
        discountAmount,
        userPhone
      }),
    });
  },

  // Get coupon usage statistics
  getCouponStats: async () => {
    return apiRequest('/coupons/stats');
  },

  // Get coupon analytics by date range
  getCouponAnalytics: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return apiRequest(`/coupons/analytics?${params.toString()}`);
  },

  // Bulk update coupon status
  bulkUpdateCouponStatus: async (couponIds, isActive) => {
    return apiRequest('/coupons/bulk-status', {
      method: 'PUT',
      body: JSON.stringify({ couponIds, isActive }),
    });
  },

  // Get coupon usages
  getCouponUsages: async (couponId) => {
    return apiRequest(`/coupons/${couponId}/usages`);
  },

  // Get user coupon usages
  getUserCouponUsages: async (phone) => {
    return apiRequest(`/coupons/user/${phone}/usages`);
  },

  // Apply coupon to booking (this should be in bookingsAPI)
  applyCoupon: async (couponCode, bookingId) => {
    return apiRequest(`/bookings/apply-coupon`, {
      method: 'POST',
      body: JSON.stringify({ couponCode, bookingId }),
    });
  }
};

// Don't forget to export the apiRequest function at the end
export default apiRequest;