import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { vehiclesAPI, couponsAPI } from "../services/apiService";

const SubscriptionBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicle, deliveryDate, deliveryTime } = location.state || {};
  
  const [userData, setUserData] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState({
    tenure: "3", // months
    startDate: deliveryDate || "",
    endDate: "",
    deliveryTime: deliveryTime || "10:30",
    pickupTime: "10:30",
    deliveryAddress: "",
    landmark: "",
    useCurrentLocation: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  // Subscription plans data
  const subscriptionPlans = [
    { months: "3", monthlyRent: 3956, label: "3 Months" },
    { months: "6", monthlyRent: 3750, label: "6 Months" },
    { months: "9", monthlyRent: 3500, label: "9 Months" },
    { months: "12", monthlyRent: 3200, label: "12 Months" }
  ];

  // Format time display function
  const formatTimeDisplay = (timeString) => {
    if (!timeString) return 'Not set';
    
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch {
      return timeString;
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userPhone = localStorage.getItem("userPhone");
    const storedUserData = localStorage.getItem("userData");

    console.log("SubscriptionBookingPage - Auth check:", { isLoggedIn, userPhone, storedUserData });

    if (!isLoggedIn || !userPhone) {
      console.log("User not authenticated, redirecting to login...");
      navigate("/login", { 
        state: { 
          vehicle, 
          deliveryDate, 
          deliveryTime,
          from: "/subscription/booking", 
          action: "subscribe" 
        } 
      });
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
      navigate("/login", { 
        state: { 
          vehicle, 
          deliveryDate, 
          deliveryTime,
          from: "/subscription/booking", 
          action: "subscribe" 
        } 
      });
      return;
    }

    if (!vehicle) {
      console.log("No vehicle data, redirecting to subscription page");
      navigate("/subscription/vehicles");
      return;
    }

    // Calculate end date based on tenure
    calculateEndDate(subscriptionData.tenure, subscriptionData.startDate);
    
    // Load map
    initializeMap();
  }, [navigate, vehicle, deliveryDate, deliveryTime]);

  const initializeMap = () => {
    // Simulate map loading
    setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
  };

  const calculateEndDate = (tenure, startDate) => {
    if (!startDate) return;
    
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + parseInt(tenure));
    
    setSubscriptionData(prev => ({
      ...prev,
      endDate: end.toISOString().split('T')[0]
    }));
  };

  const calculateTotal = () => {
    const selectedPlan = subscriptionPlans.find(plan => plan.months === subscriptionData.tenure);
    const monthlyRent = selectedPlan?.monthlyRent || 3956;
    const tenureMonths = parseInt(subscriptionData.tenure);
    
    const baseRate = monthlyRent * tenureMonths;
    const bookingFee = 3956.78;
    const cgst = baseRate * 0.09; // 9%
    const sgst = baseRate * 0.09; // 9%
    const refundableDeposit = 1500;
    
    const subtotal = baseRate + bookingFee;
    const taxTotal = cgst + sgst;
    const totalBeforeDiscount = subtotal + taxTotal + refundableDeposit;
    
    // Apply coupon discount if available
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        // Percentage discount on base rate (not including taxes or deposit)
        discount = (baseRate * appliedCoupon.discountValue) / 100;
        
        // Apply maximum discount limit if specified
        if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
          discount = appliedCoupon.maxDiscount;
        }
        
        // Ensure discount doesn't exceed minimum amount requirement
        if (appliedCoupon.minAmount && baseRate < appliedCoupon.minAmount) {
          discount = 0;
        }
      } else {
        // Fixed amount discount
        discount = appliedCoupon.discountValue;
        
        // Ensure minimum amount requirement is met
        if (appliedCoupon.minAmount && baseRate < appliedCoupon.minAmount) {
          discount = 0;
        }
        
        // Ensure discount doesn't exceed base rate
        if (discount > baseRate) {
          discount = baseRate;
        }
      }
    }
    
    const total = Math.max(0, totalBeforeDiscount - discount);
    
    return {
      baseRate,
      monthlyRent,
      bookingFee,
      cgst,
      sgst,
      refundableDeposit,
      subtotal,
      taxTotal,
      totalBeforeDiscount,
      discount,
      total,
      tenureMonths
    };
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
  
    try {
      const bookingDetails = {
        vehicleType: vehicle.type,
        vehicleId: vehicle.id,
        city: vehicle.city,
        totalAmount: costBreakdown.total,
        isSubscription: true // This is for subscription
      };
  
      const validationResult = await couponsAPI.validateCoupon(couponCode, bookingDetails);
      
      if (validationResult.valid) {
        setAppliedCoupon(validationResult.coupon);
        setCouponError("");
      } else {
        setAppliedCoupon(null);
        setCouponError(validationResult.message || "Invalid coupon");
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      setCouponError("Unable to validate coupon. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "tenure") {
      setSubscriptionData(prev => ({
        ...prev,
        [name]: value
      }));
      calculateEndDate(value, subscriptionData.startDate);
    } else if (name === "startDate") {
      setSubscriptionData(prev => ({
        ...prev,
        [name]: value
      }));
      calculateEndDate(subscriptionData.tenure, value);
    } else {
      setSubscriptionData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you would reverse geocode to get address
          setSubscriptionData(prev => ({
            ...prev,
            useCurrentLocation: true,
            deliveryAddress: "Current Location (GPS Coordinates)"
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to get your current location. Please enter address manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const validateBooking = () => {
    if (!subscriptionData.startDate) {
      setError("Please select subscription start date");
      return false;
    }
    if (!subscriptionData.deliveryAddress) {
      setError("Please enter delivery address");
      return false;
    }
    
    const start = new Date(subscriptionData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) {
      setError("Subscription start date cannot be in the past");
      return false;
    }
    
    return true;
  };

  const handleProceedToPay = async () => {
    setError("");
    if (!validateBooking()) {
      return;
    }

    setIsLoading(true);

    try {
      const costBreakdown = calculateTotal();
      const selectedPlan = subscriptionPlans.find(plan => plan.months === subscriptionData.tenure);
      
      // Create subscription booking object for payment page
      const subscriptionBooking = {
        id: `#SUB${Date.now().toString().slice(-6)}`,
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleImage: vehicle.imageUrl,
        startDate: subscriptionData.startDate,
        endDate: subscriptionData.endDate,
        deliveryTime: subscriptionData.deliveryTime,
        pickupTime: subscriptionData.pickupTime,
        deliveryAddress: subscriptionData.deliveryAddress,
        landmark: subscriptionData.landmark,
        tenure: parseInt(subscriptionData.tenure),
        tenureLabel: selectedPlan?.label || "3 Months",
        monthlyRent: costBreakdown.monthlyRent,
        baseRate: costBreakdown.baseRate,
        bookingFee: costBreakdown.bookingFee,
        cgst: costBreakdown.cgst,
        sgst: costBreakdown.sgst,
        refundableDeposit: costBreakdown.refundableDeposit,
        total: costBreakdown.total,
        kmsIncluded: 1500,
        excessKmCharge: 4,
        status: 'pending_payment',
        bookingDate: new Date().toISOString(),
        features: vehicle.features || [],
        customerPhone: userData?.phone,
        customerName: userData?.name,
        type: 'subscription'
      };

      // Navigate to payment page
      navigate("/payment", { 
        state: { 
          vehicle, 
          booking: subscriptionBooking,
          user: userData 
        } 
      });

    } catch (error) {
      console.error("Error preparing subscription payment:", error);
      setError("Failed to proceed to payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const costBreakdown = calculateTotal();
  const selectedPlan = subscriptionPlans.find(plan => plan.months === subscriptionData.tenure);

  if (!vehicle || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-slate-600 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Image with Light Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Subscription Form */}
          <div className="lg:w-2/3">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 shadow-2xl">
              <h1 className="text-2xl font-light text-slate-800 mb-2">
                Subscribe to <span className="font-semibold text-gold-500">{vehicle.name}</span>
              </h1>
              <p className="text-slate-600 mb-8 text-sm">Complete your monthly subscription details</p>

              {error && (
                <div className="bg-red-500/20 border border-red-300 rounded-xl p-4 mb-6">
                  <p className="text-red-700 text-center text-sm">{error}</p>
                </div>
              )}

              {/* Subscription Tenure */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                <h3 className="text-base font-semibold text-slate-800 mb-4">Subscription Tenure</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {subscriptionPlans.map(plan => (
                    <label 
                      key={plan.months}
                      className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        subscriptionData.tenure === plan.months
                          ? 'border-gold-500 bg-gold-50 shadow-lg scale-105'
                          : 'border-blue-300 bg-white hover:bg-blue-50 hover:border-blue-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tenure"
                        value={plan.months}
                        checked={subscriptionData.tenure === plan.months}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <span className="text-slate-800 font-semibold text-center mb-2 text-sm">
                        {plan.label}
                      </span>
                      <span className="text-gold-500 font-bold text-base text-center">
                        ₹{plan.monthlyRent}/mo
                      </span>
                      <div className="mt-2 text-center">
                        <span className="text-slate-600 text-xs">
                          ₹{plan.monthlyRent * parseInt(plan.months)} total
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                
                <div className="mt-4 text-center text-slate-600 text-xs">
                  *Monthly rent shown is exclusive of tax
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Subscription Start Date */}
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Subscription Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={subscriptionData.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                    required
                  />
                </div>

                {/* Subscription End Date (Read-only) */}
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Subscription End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={subscriptionData.endDate}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-blue-300 rounded-xl text-slate-600 cursor-not-allowed text-sm"
                  />
                  <p className="text-slate-500 text-xs mt-1">
                    Calculated automatically based on tenure
                  </p>
                </div>

                {/* Delivery Time */}
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Delivery Time
                  </label>
                  <div className="relative">
                    <select
                      name="deliveryTime"
                      value={subscriptionData.deliveryTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 appearance-none cursor-pointer text-sm"
                    >
                      {Array.from({ length: 49 }, (_, i) => {
                        const totalMinutes = i * 30;
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        const time24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                        const period = hours >= 12 ? 'PM' : 'AM';
                        const displayHours = hours % 12 || 12;
                        const time12 = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
                        
                        return (
                          <option key={time24} value={time24} className="text-slate-900 bg-white text-sm">
                            {time12}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gold-500 text-xs mt-2 font-medium text-center bg-gold-100 py-1 rounded-lg border border-gold-300">
                    🕒 {formatTimeDisplay(subscriptionData.deliveryTime)}
                  </p>
                </div>

                {/* Pickup Time */}
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Expected Pickup Time
                  </label>
                  <div className="relative">
                    <select
                      name="pickupTime"
                      value={subscriptionData.pickupTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 appearance-none cursor-pointer text-sm"
                    >
                      {Array.from({ length: 49 }, (_, i) => {
                        const totalMinutes = i * 30;
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        const time24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                        const period = hours >= 12 ? 'PM' : 'AM';
                        const displayHours = hours % 12 || 12;
                        const time12 = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
                        
                        return (
                          <option key={time24} value={time24} className="text-slate-900 bg-white text-sm">
                            {time12}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gold-500 text-xs mt-2 font-medium text-center bg-gold-100 py-1 rounded-lg border border-gold-300">
                    🕒 {formatTimeDisplay(subscriptionData.pickupTime)}
                  </p>
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                <h3 className="text-base font-semibold text-slate-800 mb-4">
                  Location (Delivery and Pick Up)
                </h3>
                
                {/* Delivery Address */}
                <div className="mb-4">
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    name="deliveryAddress"
                    value={subscriptionData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your complete delivery address"
                    rows="3"
                    className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                    required
                  />
                </div>

                {/* Landmark */}
                <div className="mb-4">
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={subscriptionData.landmark}
                    onChange={handleInputChange}
                    placeholder="Enter nearby landmark"
                    className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  />
                </div>

                {/* Use Current Location */}
                <div className="mb-4">
                  <button
                    onClick={handleUseCurrentLocation}
                    className="w-full py-3 bg-white border-2 border-blue-300 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 hover:border-blue-400 transition-colors text-sm"
                  >
                    📍 Use My Current Location
                  </button>
                </div>

                {/* Delivery Charges Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-700 text-xs text-center">
                    **Delivery charges of ₹40/km applicable if the distance from our location is more than 10 Kms
                  </p>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                <h3 className="text-base font-semibold text-slate-800 mb-4">Delivery Location Map</h3>
                
                {!mapLoaded ? (
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-slate-600 text-sm">Loading map...</div>
                  </div>
                ) : (
                  <div className="h-64 bg-gray-100 rounded-lg border border-blue-300 relative">
                    {/* Mock Map - In real app, integrate with Google Maps */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-slate-600 text-sm">
                        <div className="text-4xl mb-2">🗺️</div>
                        <p>Interactive Map</p>
                        <p className="text-xs mt-2">Delivery location would be shown here</p>
                      </div>
                    </div>
                    
                    {/* Map Type Selector */}
                    <div className="absolute top-4 left-4 flex space-x-2">
                      <button className="bg-white px-3 py-1 rounded-lg text-xs border border-blue-300 hover:bg-blue-50">
                        Map
                      </button>
                      <button className="bg-blue-100 px-3 py-1 rounded-lg text-xs border border-blue-300">
                        Satellite
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                <h3 className="text-base font-semibold text-slate-800 mb-4">Additional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-slate-700 font-medium mb-2 text-sm">Kms Included</h4>
                    <p className="text-slate-600 text-sm">1,500 kms/month</p>
                  </div>
                  
                  <div>
                    <h4 className="text-slate-700 font-medium mb-2 text-sm">Excess km charge beyond km limit</h4>
                    <p className="text-gold-500 font-semibold text-sm">₹4/km</p>
                  </div>
                </div>
              </div>

              {/* Apply Coupon Section */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                <h3 className="text-base font-semibold text-slate-800 mb-4 text-sm">Apply Coupon</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-3 bg-white border border-blue-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  />
                  <button
                    onClick={validateCoupon}
                    className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors text-sm"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-xs mt-2">{couponError}</p>
                )}
                {appliedCoupon && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm">
                      ✓ Coupon <strong>{appliedCoupon.code}</strong> applied successfully!
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                      You saved ₹{calculateTotal().discount}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleProceedToPay}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-300 shadow-lg ${
                  isLoading
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gold-500 hover:bg-gold-600 text-slate-900 hover:scale-105'
                }`}
              >
                {isLoading ? "Processing..." : "Proceed to Pay"}
              </button>
            </div>
          </div>

          {/* Right Side - Subscription Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 border border-blue-200 shadow-2xl sticky top-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Subscription Summary</h3>
              
              {/* Vehicle Info */}
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-blue-200">
                <div 
                  className="w-20 h-20 bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url(${vehicle.imageUrl})` }}
                ></div>
                <div>
                  <h4 className="text-slate-800 font-semibold text-sm">{vehicle.name}</h4>
                  <p className="text-gold-500 text-sm">Monthly Subscription</p>
                  <p className="text-slate-600 text-xs">📍 {vehicle.city}</p>
                </div>
              </div>

              {/* Subscription Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-blue-200">
                <h4 className="text-base font-semibold text-slate-800">Subscription Details</h4>
                
                <div className="flex justify-between text-slate-700 text-sm">
                  <span>Tenure</span>
                  <span className="font-semibold">{selectedPlan?.label}</span>
                </div>
                
                <div className="flex justify-between text-slate-700 text-sm">
                  <span>Monthly Rent</span>
                  <span className="text-gold-500 font-semibold">₹{selectedPlan?.monthlyRent}/mo</span>
                </div>
                
                <div className="flex justify-between text-slate-700 text-sm">
                  <span>Refundable Deposit</span>
                  <span>₹1,500</span>
                </div>

                {/* Subscription Period */}
                {subscriptionData.startDate && subscriptionData.endDate && (
                  <div className="bg-blue-50 rounded-lg p-3 mt-4">
                    <div className="text-center text-slate-700 text-sm">
                      <div className="font-semibold">Subscription Period</div>
                      <div className="text-xs mt-1">
                        {new Date(subscriptionData.startDate).toLocaleDateString()} - {new Date(subscriptionData.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-700 text-sm">
                  <span>Base Subscription ({costBreakdown.tenureMonths} months)</span>
                  <span>₹{costBreakdown.baseRate.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-slate-700 text-sm">
                  <span>Booking Fee</span>
                  <span>₹{costBreakdown.bookingFee.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-slate-700 text-sm">
                  <span>CGST (9.00%)</span>
                  <span>₹{costBreakdown.cgst.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-slate-700 text-sm">
                  <span>SGST (9.00%)</span>
                  <span>₹{costBreakdown.sgst.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-slate-700 text-sm">
                  <span>Refundable Deposit</span>
                  <span>₹{costBreakdown.refundableDeposit.toLocaleString()}</span>
                </div>
                
                {/* Coupon Discount */}
                {appliedCoupon && costBreakdown.discount > 0 && (
                  <div className="flex justify-between text-green-700 text-sm bg-green-50 p-2 rounded-lg border border-green-200 mt-3">
                    <span className="flex items-center">
                      <span className="mr-1">🎫</span>
                      Coupon Discount ({appliedCoupon.code})
                    </span>
                    <span className="font-semibold">-₹{costBreakdown.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-blue-200">
                <span className="text-slate-800 font-semibold text-base">Total Payable Amount</span>
                <span className="text-gold-500 font-bold text-lg">
                  ₹{costBreakdown.total.toFixed(2)}
                </span>
              </div>

              {/* Original Price if Discount Applied */}
              {appliedCoupon && costBreakdown.discount > 0 && (
                <div className="text-center mt-2">
                  <span className="text-slate-500 text-xs line-through">
                    Original: ₹{costBreakdown.totalBeforeDiscount.toFixed(2)}
                  </span>
                  <span className="text-green-600 text-xs font-semibold ml-2">
                    You save ₹{costBreakdown.discount.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-slate-800 mb-2 text-sm">Additional Info</h5>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Kms included:</span>
                    <span>1,500 kms/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Excess km charge:</span>
                    <span className="text-gold-500">₹4/km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBookingPage;