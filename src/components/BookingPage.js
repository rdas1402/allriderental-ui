import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { bookingsAPI } from "../services/apiService";

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vehicle = location.state?.vehicle;
  
  const [userData, setUserData] = useState(null);
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    pickupTime: "10:00",
    dropoffTime: "10:00",
    pickupLocation: vehicle?.city || "",
    additionalDriver: false,
    insurance: "basic"
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBookings, setIsFetchingBookings] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userPhone = localStorage.getItem("userPhone");
    const storedUserData = localStorage.getItem("userData");

    console.log("BookingPage - Auth check:", { isLoggedIn, userPhone, storedUserData });

    if (!isLoggedIn || !userPhone) {
      console.log("User not authenticated, redirecting to login...");
      navigate("/login", { state: { vehicle, from: "/booking", action: "book" } });
      return;
    }

    // Parse user data properly
    try {
      let parsedData = {};
      if (storedUserData) {
        parsedData = JSON.parse(storedUserData);
        console.log("Parsed user data:", parsedData);
      }

      // Extract user info from different possible structures
      const userInfo = parsedData.profile?.user || parsedData.user || parsedData;
      
      if (userInfo && userInfo.phone) {
        setUserData(userInfo);
        console.log("User data set:", userInfo);
      } else {
        throw new Error("Invalid user data structure");
      }

    } catch (error) {
      console.error("Error parsing user data:", error);
      // Clear invalid data and redirect to login
      localStorage.removeItem("userData");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userPhone");
      navigate("/login", { state: { vehicle, from: "/booking", action: "book" } });
      return;
    }

    if (!vehicle) {
      console.log("No vehicle data, redirecting to rent page");
      navigate("/rent");
      return;
    }

    // Fetch existing bookings for this vehicle in real-time
    fetchExistingBookings();
  }, [navigate, vehicle]);

  // Function to fetch existing bookings for the vehicle from API
  const fetchExistingBookings = async () => {
    try {
      setIsFetchingBookings(true);
      console.log("Fetching existing bookings for vehicle:", vehicle.id);
      
      let existingBookings = [];
      
      // Fetch from API only - no localStorage
      // Convert vehicle.id to number if it's a string
      const vehicleId = parseInt(vehicle.id);
      console.log("Converted vehicle ID:", vehicleId, "Type:", typeof vehicleId);
      
      const response = await bookingsAPI.getBookingsByVehicle(vehicleId);
      console.log("API Response for bookings:", response);
      
      // UPDATED: Handle the new response structure with response.data
      if (response && response.success && Array.isArray(response.data)) {
        // Filter only confirmed bookings for date blocking
        existingBookings = response.data.filter(booking => 
          booking.status === 'confirmed' || booking.status === 'Confirmed'
        );
        console.log("Confirmed bookings from API:", existingBookings);
      } else {
        console.log("No bookings found or API error");
      }
      
      // Extract and set blocked dates
      const blockedDateRanges = extractBlockedDates(existingBookings);
      setBlockedDates(blockedDateRanges);
      console.log("Blocked date ranges:", blockedDateRanges);
      console.log("Number of blocked date ranges:", blockedDateRanges.length);
      
    } catch (error) {
      console.error("Error fetching existing bookings from API:", error);
      // If API fails, set empty blocked dates (don't block anything)
      setBlockedDates([]);
      setError("Unable to check date availability. Please try again.");
    } finally {
      setIsFetchingBookings(false);
    }
  };

  // Function to extract blocked dates from bookings
  const extractBlockedDates = (bookings) => {
    const blockedRanges = [];
    
    bookings.forEach(booking => {
      if (booking.startDate && booking.endDate) {
        // Create date range from booking
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        
        blockedRanges.push({
          start: startDate,
          end: endDate
        });
        
        console.log(`Blocking dates from ${startDate.toDateString()} to ${endDate.toDateString()}`);
      }
    });
    
    return blockedRanges;
  };

  // Function to check if a date is blocked
  const isDateBlocked = (date) => {
    if (!date) return false;
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    return blockedDates.some(range => {
      const rangeStart = new Date(range.start);
      rangeStart.setHours(0, 0, 0, 0);
      
      const rangeEnd = new Date(range.end);
      rangeEnd.setHours(0, 0, 0, 0);
      
      return checkDate >= rangeStart && checkDate <= rangeEnd;
    });
  };

  // Function to check if a date range overlaps with blocked dates
  const isDateRangeAvailable = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    // Check each day in the selected range
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      if (isDateBlocked(date)) {
        console.log(`Date conflict found: ${date.toDateString()}`);
        return false;
      }
    }
    
    return true;
  };

  const calculateTotal = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    
    // Extract price from vehicle (assuming format like "₹2,500/day")
    const pricePerDay = parseInt(vehicle.price.replace(/[^0-9]/g, '')) || 2500;
    
    let total = days * pricePerDay;
    
    // Add insurance costs
    if (bookingData.insurance === "premium") {
      total += 500 * days;
    } else if (bookingData.insurance === "comprehensive") {
      total += 1000 * days;
    }
    
    // Add additional driver cost
    if (bookingData.additionalDriver) {
      total += 300 * days;
    }
    
    return total;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateBooking = () => {
    if (!bookingData.startDate) {
      setError("Please select pickup date");
      return false;
    }
    if (!bookingData.endDate) {
      setError("Please select dropoff date");
      return false;
    }
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) {
      setError("Pickup date cannot be in the past");
      return false;
    }
    if (end <= start) {
      setError("Dropoff date must be after pickup date");
      return false;
    }
    
    // Check if selected dates are available
    if (!isDateRangeAvailable(bookingData.startDate, bookingData.endDate)) {
      setError("Selected dates are not available. This vehicle is already booked for some of the selected dates.");
      return false;
    }
    
    return true;
  };

  const handleProceedToBook = () => {
    setError("");
    if (validateBooking()) {
      setShowConfirmation(true);
    }
  };

  // Refresh availability when dates are selected
  const handleDateChange = async (e) => {
    const { name, value } = e.target;
    
    // Update the booking data
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any previous errors
    setError("");
    
    // If we're changing dates and have both dates selected, refresh availability
    if ((name === 'startDate' && value && bookingData.endDate) || 
        (name === 'endDate' && value && bookingData.startDate)) {
      await fetchExistingBookings();
    }
  };

  // Fixed: Properly handle localStorage data format (EXISTING LOGIC - UNCHANGED)
  const storeBookingInLocalStorage = (bookingPayload) => {
    try {
      // Get existing bookings from localStorage - handle different formats
      const storedBookings = localStorage.getItem("userBookings");
      let existingBookings = [];

      console.log("Stored bookings:", storedBookings);

      if (storedBookings) {
        try {
          const parsedData = JSON.parse(storedBookings);
          console.log("Parsed bookings data:", parsedData);
          
          // Handle different possible formats:
          if (Array.isArray(parsedData)) {
            existingBookings = parsedData;
          } 
          else if (parsedData && Array.isArray(parsedData.bookings)) {
            existingBookings = parsedData.bookings;
          }
          else if (parsedData && parsedData.bookings && Array.isArray(parsedData.bookings)) {
            existingBookings = parsedData.bookings;
          }
          else if (parsedData && typeof parsedData === 'object' && parsedData.id) {
            existingBookings = [parsedData];
          }
          else {
            console.log("Unknown bookings format, starting fresh");
            existingBookings = [];
          }
        } catch (parseError) {
          console.error("Error parsing stored bookings:", parseError);
          existingBookings = [];
        }
      }

      // Create new booking object for localStorage
      const newBooking = {
        id: `BK${Date.now()}`,
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleImage: vehicle.imageUrl,
        date: new Date().toLocaleDateString(),
        duration: `${Math.ceil((new Date(bookingPayload.endDate) - new Date(bookingPayload.startDate)) / (1000 * 60 * 60 * 24))} days`,
        totalAmount: bookingPayload.totalAmount,
        total: `₹${bookingPayload.totalAmount.toLocaleString()}`,
        status: 'Confirmed',
        pickupLocation: bookingPayload.pickupLocation,
        bookingDate: new Date().toISOString(),
        features: vehicle.features || [],
        startDate: bookingPayload.startDate,
        endDate: bookingPayload.endDate,
        pickupTime: bookingPayload.pickupTime,
        dropoffTime: bookingPayload.dropoffTime,
        insurance: bookingPayload.insurance,
        additionalDriver: bookingPayload.additionalDriver,
        customerPhone: userData?.phone,
        customerName: userData?.name
      };

      // Add new booking to existing bookings
      const updatedBookings = [newBooking, ...existingBookings];
      
      // Save back to localStorage with consistent structure
      const storageData = {
        bookings: updatedBookings,
        success: true,
        timestamp: new Date().toISOString(),
        count: updatedBookings.length
      };
      
      localStorage.setItem("userBookings", JSON.stringify(storageData));
      
      console.log("Booking stored in localStorage:", newBooking);
      console.log("Updated bookings count:", updatedBookings.length);
      return newBooking;
    } catch (error) {
      console.error("Error storing booking in localStorage:", error);
      return null;
    }
  };

  // Fixed: Handle API response and localStorage update properly (EXISTING LOGIC - UNCHANGED)
  const handleConfirmBooking = async () => {
    setIsLoading(true);
    setError("");

    // Double-check user data
    if (!userData || !userData.phone) {
      setError("User data not found. Please login again.");
      setIsLoading(false);
      setShowConfirmation(false);
      return;
    }

    try {
      const bookingPayload = {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        customerPhone: userData.phone,
        customerName: userData.name || "Customer",
        customerEmail: userData.email || "",
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        pickupTime: bookingData.pickupTime,
        dropoffTime: bookingData.dropoffTime,
        pickupLocation: bookingData.pickupLocation,
        additionalDriver: bookingData.additionalDriver,
        insurance: bookingData.insurance,
        totalAmount: calculateTotal(),
        status: "confirmed"
      };

      console.log("Making API call to create booking...", bookingPayload);
      
      // Store booking in localStorage immediately
      const storedBooking = storeBookingInLocalStorage(bookingPayload);
      
      // Call API to create booking
      const response = await bookingsAPI.createBooking(bookingPayload);
      console.log("API Response:", response);
      
      if (response && response.success) {
        console.log("Booking created successfully via API:", response);
        
        // If API call is successful, update the booking with the real ID from API
        if (response.bookingId || response.booking?.id) {
          const realBookingId = response.bookingId || response.booking?.id;
          console.log("Updating booking ID from API:", realBookingId);
          
          // Get current bookings from localStorage
          const storedBookings = localStorage.getItem("userBookings");
          if (storedBookings) {
            try {
              const parsedData = JSON.parse(storedBookings);
              let updatedBookings = [];
              
              // Handle different formats when updating
              if (Array.isArray(parsedData.bookings)) {
                updatedBookings = parsedData.bookings.map(booking => 
                  booking.id === storedBooking.id 
                    ? { ...booking, id: realBookingId, apiId: realBookingId }
                    : booking
                );
              } else if (Array.isArray(parsedData)) {
                updatedBookings = parsedData.map(booking => 
                  booking.id === storedBooking.id 
                    ? { ...booking, id: realBookingId, apiId: realBookingId }
                    : booking
                );
              }
              
              // Save updated bookings back to localStorage
              localStorage.setItem("userBookings", JSON.stringify({
                bookings: updatedBookings,
                success: true,
                timestamp: new Date().toISOString()
              }));
            } catch (updateError) {
              console.error("Error updating booking ID:", updateError);
            }
          }
        }
        
        // Navigate to confirmation page
        navigate("/booking-confirmation", { 
          state: { 
            vehicle, 
            booking: storedBooking || {
              ...bookingPayload,
              id: response.bookingId || `BK${Date.now()}`,
              vehicleImage: vehicle.imageUrl,
              duration: `${Math.ceil((new Date(bookingPayload.endDate) - new Date(bookingPayload.startDate)) / (1000 * 60 * 60 * 24))} days`
            },
            user: userData 
          } 
        });
      } else {
        throw new Error(response?.message || "Failed to create booking");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to create booking. Please try again.");
      
      // Clean up failed booking from localStorage
      try {
        const storedBookings = localStorage.getItem("userBookings");
        if (storedBookings) {
          const parsedData = JSON.parse(storedBookings);
          let filteredBookings = [];
          
          const tempBookingId = `BK${Date.now()}`;
          
          if (Array.isArray(parsedData.bookings)) {
            filteredBookings = parsedData.bookings.filter(booking => 
              booking.id !== tempBookingId
            );
          } else if (Array.isArray(parsedData)) {
            filteredBookings = parsedData.filter(booking => 
              booking.id !== tempBookingId
            );
          }
          
          localStorage.setItem("userBookings", JSON.stringify({
            bookings: filteredBookings,
            success: true,
            timestamp: new Date().toISOString()
          }));
        }
      } catch (cleanupError) {
        console.error("Error cleaning up failed booking:", cleanupError);
      }
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  const totalAmount = calculateTotal();
  const days = bookingData.startDate && bookingData.endDate 
    ? Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24)) 
    : 0;

  if (!vehicle || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.9)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Booking Form */}
          <div className="lg:w-2/3">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
              <h1 className="text-3xl font-light text-white mb-2">
                Book Your <span className="font-semibold text-gold-400">{vehicle.name}</span>
              </h1>
              <p className="text-white/60 mb-8">Complete your booking details</p>

              {error && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6">
                  <p className="text-red-200 text-center">{error}</p>
                </div>
              )}

              {/* Loading State for Date Availability Check */}
              {isFetchingBookings && (
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center text-blue-200">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mr-3"></div>
                    <span>Checking date availability...</span>
                  </div>
                </div>
              )}

              {/* Availability Notice - Only show if there are blocked dates */}
              {!isFetchingBookings && blockedDates.length > 0 && (
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-6">
                  <p className="text-blue-200 text-center text-sm">
                    📅 Some dates are already booked. Please check availability before proceeding.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Pickup Date */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={bookingData.startDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 backdrop-blur-sm ${
                      bookingData.startDate && isDateBlocked(bookingData.startDate) 
                        ? 'border-red-400/50' 
                        : 'border-white/20'
                    }`}
                    required
                    disabled={isFetchingBookings}
                  />
                  {bookingData.startDate && isDateBlocked(bookingData.startDate) && (
                    <p className="text-red-400 text-xs mt-1">This date is not available</p>
                  )}
                </div>

                {/* Dropoff Date */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Dropoff Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={bookingData.endDate}
                    onChange={handleDateChange}
                    min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 backdrop-blur-sm ${
                      bookingData.endDate && isDateBlocked(bookingData.endDate) 
                        ? 'border-red-400/50' 
                        : 'border-white/20'
                    }`}
                    required
                    disabled={isFetchingBookings}
                  />
                  {bookingData.endDate && isDateBlocked(bookingData.endDate) && (
                    <p className="text-red-400 text-xs mt-1">This date is not available</p>
                  )}
                </div>

                {/* Pickup Time */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Pickup Time
                  </label>
                  <select
                    name="pickupTime"
                    value={bookingData.pickupTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 backdrop-blur-sm"
                    disabled={isFetchingBookings}
                  >
                    {Array.from({ length: 13 }, (_, i) => {
                      const hour = i + 8; // 8 AM to 8 PM
                      return (
                        <option key={hour} value={`${hour}:00`}>
                          {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Dropoff Time */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Dropoff Time
                  </label>
                  <select
                    name="dropoffTime"
                    value={bookingData.dropoffTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 backdrop-blur-sm"
                    disabled={isFetchingBookings}
                  >
                    {Array.from({ length: 13 }, (_, i) => {
                      const hour = i + 8;
                      return (
                        <option key={hour} value={`${hour}:00`}>
                          {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Pickup Location */}
                <div className="md:col-span-2">
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={bookingData.pickupLocation}
                    onChange={handleInputChange}
                    placeholder="Enter pickup location"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 backdrop-blur-sm"
                    disabled={isFetchingBookings}
                  />
                </div>
              </div>

              {/* Additional Options */}
              <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Additional Options</h3>
                
                {/* Insurance */}
                <div className="mb-6">
                  <label className="block text-white/80 text-sm font-medium mb-3">
                    Insurance Coverage
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: "basic", label: "Basic", desc: "Standard coverage", price: "Included" },
                      { value: "premium", label: "Premium", desc: "Enhanced protection", price: "+₹500/day" },
                      { value: "comprehensive", label: "Comprehensive", desc: "Full coverage", price: "+₹1000/day" }
                    ].map(option => (
                      <label key={option.value} className="flex items-start p-4 border border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                        <input
                          type="radio"
                          name="insurance"
                          value={option.value}
                          checked={bookingData.insurance === option.value}
                          onChange={handleInputChange}
                          className="mt-1 text-gold-400 focus:ring-gold-400"
                          disabled={isFetchingBookings}
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-start">
                            <span className="text-white font-medium">{option.label}</span>
                            <span className="text-gold-400 text-sm">{option.price}</span>
                          </div>
                          <p className="text-white/60 text-sm mt-1">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Driver */}
                <label className="flex items-center justify-between p-4 border border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                  <div>
                    <span className="text-white font-medium">Additional Driver</span>
                    <p className="text-white/60 text-sm mt-1">Add an extra driver to your booking</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gold-400 mr-3">+₹300/day</span>
                    <input
                      type="checkbox"
                      name="additionalDriver"
                      checked={bookingData.additionalDriver}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-gold-400 focus:ring-gold-400 rounded"
                      disabled={isFetchingBookings}
                    />
                  </div>
                </label>
              </div>

              <button
                onClick={handleProceedToBook}
                disabled={isFetchingBookings || isLoading}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-slate-900 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
              >
                {isFetchingBookings ? "Checking Availability..." : "Proceed to Book"}
              </button>
            </div>
          </div>

          {/* Right Side - Booking Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl sticky top-6">
              <h3 className="text-xl font-semibold text-white mb-6">Booking Summary</h3>
              
              {/* Vehicle Info */}
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-white/20">
                <div 
                  className="w-20 h-20 bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url(${vehicle.imageUrl})` }}
                ></div>
                <div>
                  <h4 className="text-white font-semibold">{vehicle.name}</h4>
                  <p className="text-gold-400">{vehicle.price}</p>
                  <p className="text-white/60 text-sm">📍 {vehicle.city}</p>
                </div>
              </div>

              {/* Rental Period */}
              <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
                <div className="flex justify-between text-white/80">
                  <span>Rental Period</span>
                  <span>{days} day{days !== 1 ? 's' : ''}</span>
                </div>
                {bookingData.startDate && (
                  <div className="text-white/60 text-sm">
                    {new Date(bookingData.startDate).toLocaleDateString()} - {new Date(bookingData.endDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-white/80">
                  <span>Base Rate</span>
                  <span>{vehicle.price} × {days}</span>
                </div>
                
                {bookingData.insurance === "premium" && (
                  <div className="flex justify-between text-white/80">
                    <span>Premium Insurance</span>
                    <span>+₹{500 * days}</span>
                  </div>
                )}
                
                {bookingData.insurance === "comprehensive" && (
                  <div className="flex justify-between text-white/80">
                    <span>Comprehensive Insurance</span>
                    <span>+₹{1000 * days}</span>
                  </div>
                )}
                
                {bookingData.additionalDriver && (
                  <div className="flex justify-between text-white/80">
                    <span>Additional Driver</span>
                    <span>+₹{300 * days}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-white/20">
                <span className="text-white font-semibold text-lg">Total Amount</span>
                <span className="text-gold-400 font-bold text-xl">₹{totalAmount.toLocaleString()}</span>
              </div>

              {/* Availability Status - Only show when dates are selected */}
              {bookingData.startDate && bookingData.endDate && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  isDateRangeAvailable(bookingData.startDate, bookingData.endDate) 
                    ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-400/30'
                }`}>
                  {isFetchingBookings ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Checking availability...
                    </div>
                  ) : isDateRangeAvailable(bookingData.startDate, bookingData.endDate) ? (
                    '✅ Selected dates are available'
                  ) : (
                    '❌ Selected dates conflict with existing bookings'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-semibold text-white mb-4">Confirm Booking</h3>
            <p className="text-white/70 mb-6">
              Are you sure you want to book the {vehicle.name} for {days} day{days !== 1 ? 's' : ''}?
            </p>
            <div className="text-white/80 mb-6 space-y-2">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="text-gold-400 font-semibold">₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="text-sm text-white/60">
                This amount will be charged at the time of pickup.
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-colors border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isLoading}
                className="flex-1 bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-slate-900 py-3 rounded-xl font-semibold transition-colors"
              >
                {isLoading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;