import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/apiService";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [userExists, setUserExists] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    dob: ""
  });

  // Get navigation state
  const vehicle = location.state?.vehicle;
  const from = location.state?.from;
  const action = location.state?.action;

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePostLoginNavigation = (userProfile, userBookings) => {
    if (vehicle) {
      navigate("/booking", { 
        state: { 
          vehicle, 
          user: userProfile 
        } 
      });
    } else if (action === "profile" || from === "/profile") {
      navigate("/profile", { 
        state: { user: userProfile, bookings: userBookings } 
      });
    } else if (from && from !== "/") {
      navigate(from, { state: { user: userProfile } });
    } else {
      navigate("/", { state: { user: userProfile } });
    }
  };

  const handleNewUserRegistrationNavigation = (userProfile) => {
    navigate("/profile", { 
      state: { 
        user: userProfile,
        scrollToProfile: true,
        isNewUser: true 
      } 
    });
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOtp = async () => {
    setError("");
    
    if (!phoneNumber) {
      setError("Please enter your phone number");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number starting with 6-9");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.sendOtp(phoneNumber);
      
      if (response.success) {
        setIsOtpSent(true);
        setCountdown(30);
        setError("");
        
        if (response.developmentOtp) {
          console.log("Development OTP:", response.developmentOtp);
          setError(`WhatsApp OTP sent! Development OTP: ${response.developmentOtp} - Check WhatsApp for actual OTP`);
        }
        
        console.log("WhatsApp OTP sent successfully to:", phoneNumber);
      } else {
        setError(response.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP send error:", err);
      setError(err.message || "Failed to send OTP. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const verifyResponse = await authAPI.verifyOtp(phoneNumber, otp);
      
      if (!verifyResponse.success) {
        throw new Error(verifyResponse.message || "Invalid OTP");
      }
      
      const userCheck = await authAPI.checkUserExists(phoneNumber);
      
      if (userCheck.exists) {
        const userProfile = await authAPI.getUserProfile(phoneNumber);
        const userBookings = await authAPI.getUserBookings(phoneNumber);
        
        localStorage.setItem("userPhone", phoneNumber);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userData", JSON.stringify(userProfile));
        localStorage.setItem("userBookings", JSON.stringify(userBookings || []));
        
        console.log("User exists, navigating to appropriate page...");
        handlePostLoginNavigation(userProfile, userBookings || []);
      } else {
        console.log("New user, showing registration form...");
        setUserExists(false);
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterUser = async () => {
    setError("");
    
    if (!registrationData.name || !registrationData.email || !registrationData.dob) {
      setError("Please fill all required fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(registrationData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    const dobDate = new Date(registrationData.dob);
    const today = new Date();
    if (dobDate >= today) {
      setError("Date of birth must be in the past");
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        phone: phoneNumber,
        name: registrationData.name.trim(),
        email: registrationData.email.trim(),
        dob: registrationData.dob
      };

      const newUser = await authAPI.createUser(userData);
      
      localStorage.setItem("userPhone", phoneNumber);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userData", JSON.stringify(newUser));
      localStorage.setItem("userBookings", JSON.stringify([]));
      
      console.log("New user registered, navigating to profile...");
      handleNewUserRegistrationNavigation(newUser);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    handleSendOtp();
  };

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    return digits;
  };

  const handleRegistrationChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Lighter Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-md mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-slate-800 mb-8 transition-colors"
        >
          <span className="mr-2">←</span>
          Back
        </button>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-slate-800 mb-2">
              Welcome to <span className="font-semibold text-gold-500">All Ride Rental</span>
            </h1>
            <p className="text-slate-600">
              {userExists === false 
                ? "Complete your registration" 
                : vehicle 
                  ? `Book your ${vehicle.name}` 
                  : action === "profile"
                    ? "Login to access your profile"
                    : "Login to your account"
              }
            </p>
            {vehicle && (
              <p className="text-gold-500 text-sm mt-2">
                📍 Booking Flow: {vehicle.name}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {isOtpSent && !error && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-600 text-center">
                ✅ WhatsApp OTP sent successfully to +91 {phoneNumber}
              </p>
              <p className="text-green-600 text-center text-xs mt-1">
                Check your WhatsApp messages for the OTP
              </p>
            </div>
          )}

          {/* Registration Form for New Users */}
          {userExists === false ? (
            <div className="space-y-6">
              <div className="bg-blue-100 border border-blue-300 rounded-xl p-4 mb-4">
                <p className="text-blue-700 text-center text-sm">
                  🎉 Welcome! Please complete your profile to continue
                </p>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={registrationData.name}
                  onChange={handleRegistrationChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleRegistrationChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={registrationData.dob}
                  onChange={handleRegistrationChange}
                  className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-slate-600 text-sm">
                  <strong>Phone Number:</strong> +91 {phoneNumber}
                </p>
              </div>

              <button
                onClick={handleRegisterUser}
                disabled={isLoading}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Complete Registration & Continue"
                )}
              </button>

              <button
                onClick={() => {
                  setUserExists(null);
                  setIsOtpSent(false);
                  setOtp("");
                  setError("");
                }}
                className="w-full text-slate-600 hover:text-slate-800 py-3 rounded-xl font-medium transition-colors border border-blue-300 hover:border-blue-400"
              >
                Use Different Phone Number
              </button>
            </div>
          ) : !isOtpSent ? (
            /* Phone Input */
            <div className="space-y-6">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    placeholder="Enter your 10-digit phone number"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-blue-300 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                    maxLength={10}
                  />
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  We'll send a 6-digit OTP to this number via WhatsApp
                </p>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isLoading || !validatePhoneNumber(phoneNumber)}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending WhatsApp OTP...
                  </div>
                ) : (
                  "Send OTP via WhatsApp"
                )}
              </button>
            </div>
          ) : (
            /* OTP Input */
            <div className="space-y-6">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Enter OTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-4 bg-white border border-blue-300 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-center text-2xl tracking-widest"
                    maxLength={6}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-slate-500 text-xs">
                    OTP sent to +91 {phoneNumber} via WhatsApp
                  </p>
                  <button
                    onClick={handleResendOtp}
                    disabled={countdown > 0}
                    className="text-gold-500 hover:text-gold-600 disabled:text-gold-400 text-xs transition-colors"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify & Continue"
                )}
              </button>

              <button
                onClick={() => {
                  setIsOtpSent(false);
                  setOtp("");
                  setError("");
                }}
                className="w-full text-slate-600 hover:text-slate-800 py-3 rounded-xl font-medium transition-colors border border-blue-300 hover:border-blue-400"
              >
                Change Phone Number
              </button>
            </div>
          )}

          {/* Terms and Privacy */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-xs">
              By continuing, you agree to our{" "}
              <button 
                onClick={() => navigate("/terms")}
                className="text-gold-500 hover:text-gold-600 underline"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button 
                onClick={() => navigate("/privacy")}
                className="text-gold-500 hover:text-gold-600 underline"
              >
                Privacy Policy
              </button>
            </p>
          </div>
        </div>

        {/* Development Info */}
        <div className="mt-8 bg-white/95 backdrop-blur-lg rounded-2xl p-6 border border-blue-200 shadow-lg">
          <h3 className="text-gold-500 font-semibold mb-2 text-center">
            How It Works
          </h3>
          <div className="text-slate-600 text-sm space-y-2">
            <div className="flex items-start">
              <span className="bg-gold-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
              <span>Enter your 10-digit phone number</span>
            </div>
            <div className="flex items-start">
              <span className="bg-gold-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
              <span>Receive OTP via WhatsApp on your phone</span>
            </div>
            <div className="flex items-start">
              <span className="bg-gold-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
              <span>Enter OTP to verify and login</span>
            </div>
            {vehicle && (
              <div className="flex items-start">
                <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">4</span>
                <span className="text-green-600">Continue to book your {vehicle.name}</span>
              </div>
            )}
            <div className="text-green-600 text-xs mt-2">
              ✓ Real OTPs are sent via MSG91 WhatsApp service
            </div>
            <div className="text-blue-600 text-xs">
              ⚡ No DLT registration required for WhatsApp
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;