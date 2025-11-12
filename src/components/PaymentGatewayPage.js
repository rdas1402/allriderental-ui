// components/PaymentGatewayPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PaymentService } from "../services/paymentService";
import { paymentAPI } from "../services/apiService";
import { EmailService } from "../services/emailService";
import { SMSService } from "../services/smsService";

// Import payment method images
import upiQrCode from "../assets/qr_code.jpg";
import visaimg from "../assets/visa.png";
import rupayimg from "../assets/rupay.png";
import mastercardimg from "../assets/mastercard.png";
import phonepe from "../assets/phonepe.png";
import gpay from "../assets/gpay.png";
import paytm from "../assets/paytm.png";

const PaymentGatewayPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicle, booking, user } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Initialize Razorpay when component mounts
    const loadRazorpay = async () => {
      const loaded = await PaymentService.initializeRazorpay();
      setRazorpayLoaded(loaded);
    };
    
    loadRazorpay();
  }, []);

  if (!vehicle || !booking) {
    navigate("/rent");
    return null;
  }

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      alert("Payment system is loading. Please try again in a moment.");
      return;
    }

    setIsProcessing(true);

    try {
      // Use the total amount from booking
      const amount = booking.total;
      
      // Create order using paymentAPI
      const orderResponse = await paymentAPI.createOrder({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: `receipt_${booking.id}`,
        bookingRequest: {
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          customerPhone: user?.phone,
          customerName: user?.name || "Customer",
          customerEmail: user?.email || "",
          startDate: booking.startDate,
          endDate: booking.endDate,
          pickupTime: booking.pickupTime,
          dropoffTime: booking.dropoffTime,
          pickupLocation: booking.pickupLocation,
          additionalDriver: booking.additionalDriver,
          insurance: booking.insurance,
          totalAmount: booking.total,
          baseRate: booking.baseRate,
          convenienceFee: booking.convenienceFee,
          insuranceCost: booking.insuranceCost,
          additionalDriverCost: booking.additionalDriverCost
        }
      });

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || "Failed to create payment order");
      }

      const orderId = orderResponse.orderId;

      const paymentData = {
        orderId: orderId,
        amount: amount,
        currency: "INR",
        bookingId: booking.id,
        vehicleName: vehicle.name,
        customerName: user?.name || "Customer",
        customerEmail: user?.email || "",
        customerPhone: user?.phone,
      };

      // For local testing, simulate successful payment after 3 seconds
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating successful payment...");
        
        setTimeout(async () => {
          try {
            // Simulate successful payment verification
            const mockPaymentId = `dev_pay_${Date.now()}`;
            
            // Create confirmed booking
            const confirmedBooking = await createConfirmedBooking(booking, mockPaymentId);
            
            //Already createConfirmedBooking fn is sending notification
            // Send notifications
            // await sendAdditionalNotifications(confirmedBooking, user, vehicle);
            
            navigate("/booking-confirmation", { 
              state: { 
                vehicle, 
                booking: { 
                  ...confirmedBooking, 
                  status: "Confirmed",
                  paymentId: mockPaymentId
                }, 
                user 
              } 
            });
          } catch (error) {
            console.error("Simulated payment failed:", error);
            alert("Simulated payment failed: " + error.message);
            setIsProcessing(false);
          }
        }, 3000);

        return; // Exit early for development
      }

      // Production flow - use actual Razorpay
      await new Promise((resolve, reject) => {
        // Add timeout for Razorpay to prevent hanging
        const paymentTimeout = setTimeout(() => {
          reject(new Error("Payment timeout - please try again"));
        }, 30000); // 30 second timeout

        PaymentService.processRazorpayPayment(
          { orderId, amount: amount * 100, currency: "INR" },
          paymentData,
          // Success callback
          async (successData) => {
            clearTimeout(paymentTimeout);
            try {
              console.log("Payment successful and verified:", successData);
              
              // Create confirmed booking in frontend state
              const confirmedBooking = await createConfirmedBooking(booking, successData.paymentId);
              
              //Already createConfirmedBooking fn is sending notification
              // Send additional notifications
              // await sendAdditionalNotifications(confirmedBooking, user, vehicle);
              
              navigate("/booking-confirmation", { 
                state: { 
                  vehicle, 
                  booking: { 
                    ...confirmedBooking, 
                    status: "Confirmed",
                    paymentId: successData.paymentId
                  }, 
                  user 
                } 
              });
              resolve(successData);
            } catch (error) {
              reject(error);
            }
          },
          // Error callback
          (error) => {
            clearTimeout(paymentTimeout);
            reject(new Error(error || "Payment failed"));
          }
        );
      });

    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again. Error: " + error.message);
      setIsProcessing(false);
    }
  };

  const sendAdditionalNotifications = async (bookingData, userData, vehicleData) => {
    try {
      // Send email confirmation to customer
      if (userData?.email) {
        await EmailService.sendBookingConfirmation(bookingData, userData, vehicleData)
          .catch(err => console.error('Additional email failed:', err));
      }
      
      // Send SMS confirmation to customer
      if (userData?.phone) {
        await SMSService.sendBookingConfirmationSMS(userData.phone, bookingData, userData, vehicleData)
          .catch(err => console.error('Additional SMS failed:', err));
      }
      
    } catch (error) {
      console.error('Error sending additional notifications:', error);
      // Don't throw error - notifications shouldn't block booking confirmation
    }
  };

  const createConfirmedBooking = async (bookingData, paymentId) => {
    try {
      // Use mock payment to create booking in backend for local testing
      if (process.env.NODE_ENV === 'development') {
        const response = await paymentAPI.mockPaymentSuccess({
          bookingId: bookingData.id,
          amount: bookingData.total
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to create booking");
        }
      }

      // Prepare frontend booking state
      const bookingForStorage = {
        ...bookingData,
        id: bookingData.id,
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        customerPhone: user?.phone,
        customerName: user?.name || "Customer",
        customerEmail: user?.email || "",
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        pickupTime: bookingData.pickupTime,
        dropoffTime: bookingData.dropoffTime,
        pickupLocation: bookingData.pickupLocation,
        additionalDriver: bookingData.additionalDriver,
        insurance: bookingData.insurance,
        totalAmount: bookingData.total,
        baseRate: bookingData.baseRate,
        convenienceFee: bookingData.convenienceFee,
        insuranceCost: bookingData.insuranceCost,
        additionalDriverCost: bookingData.additionalDriverCost,
        vehicleImage: vehicle.imageUrl,
        date: new Date().toLocaleDateString(),
        duration: bookingData.duration,
        total: `₹${bookingData.total?.toLocaleString()}`,
        status: 'Confirmed',
        bookingDate: new Date().toISOString(),
        features: vehicle.features || [],
        paymentId: paymentId,
        paid: true,
        paymentDate: new Date().toISOString()
      };

      storeBookingInLocalStorage(bookingForStorage);
      return bookingForStorage;
      
    } catch (error) {
      console.error("Error creating confirmed booking:", error);
      throw error;
    }
  };

  const storeBookingInLocalStorage = (booking) => {
    try {
      const storedBookings = localStorage.getItem("userBookings");
      let existingBookings = [];

      if (storedBookings) {
        try {
          const parsedData = JSON.parse(storedBookings);
          if (Array.isArray(parsedData)) {
            existingBookings = parsedData;
          } else if (parsedData && Array.isArray(parsedData.bookings)) {
            existingBookings = parsedData.bookings;
          }
        } catch (error) {
          console.error("Error parsing stored bookings:", error);
          existingBookings = [];
        }
      }

      const updatedBookings = [booking, ...existingBookings];
      
      const storageData = {
        bookings: updatedBookings,
        success: true,
        timestamp: new Date().toISOString(),
        count: updatedBookings.length
      };
      
      localStorage.setItem("userBookings", JSON.stringify(storageData));
      console.log("Booking stored in localStorage:", booking);
      
      return booking;
    } catch (error) {
      console.error("Error storing booking in localStorage:", error);
      return null;
    }
  };

  const handleUPIPayment = async () => {
    setIsProcessing(true);
    
    try {
      const amount = booking.total;
      
      // For UPI, use mock payment since we don't have real UPI integration
      const response = await paymentAPI.mockPaymentSuccess({
        bookingId: booking.id,
        amount: amount
      });

      if (response.success) {
        // Create confirmed booking
        const confirmedBooking = await createConfirmedBooking(booking, `upi_${Date.now()}`);
        
        //Already createConfirmedBooking fn is sending notification
        // Send notifications
        // await sendAdditionalNotifications(confirmedBooking, user, vehicle);
        
        // For UPI, show instructions
        const upiId = "allriderental@upi";
        const upiLink = `upi://pay?pa=${upiId}&pn=All Ride Rental&am=${amount}&cu=INR&tn=Booking ${booking.id}`;
        
        if (paymentMethod === "upi") {
          window.open(upiLink, '_blank');
        }
        
        setTimeout(() => {
          navigate("/booking-confirmation", { 
            state: { 
              vehicle, 
              booking: { 
                ...confirmedBooking, 
                status: "Confirmed",
                paymentId: `upi_${Date.now()}`
              }, 
              user 
            } 
          });
        }, 2000);
        
      } else {
        throw new Error(response.message || "UPI payment failed");
      }
      
    } catch (error) {
      console.error("UPI payment error:", error);
      alert("UPI payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQRPayment = async () => {
    setIsProcessing(true);
    
    try {
      const amount = booking.total;
      
      // For QR payment, use mock payment
      const response = await paymentAPI.mockPaymentSuccess({
        bookingId: booking.id,
        amount: amount
      });

      if (response.success) {
        // Create confirmed booking
        const confirmedBooking = await createConfirmedBooking(booking, `qr_${Date.now()}`);
        
        //Already createConfirmedBooking fn is sending notification
        // Send notifications
        // await sendAdditionalNotifications(confirmedBooking, user, vehicle);
        
        setTimeout(() => {
          navigate("/booking-confirmation", { 
            state: { 
              vehicle, 
              booking: { 
                ...confirmedBooking, 
                status: "Confirmed",
                paymentId: `qr_${Date.now()}`
              }, 
              user 
            } 
          });
        }, 1000);
        
      } else {
        throw new Error(response.message || "QR payment failed");
      }
      
    } catch (error) {
      console.error("QR payment error:", error);
      alert("QR payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    switch (paymentMethod) {
      case "razorpay":
        await handleRazorpayPayment();
        break;
      case "upi":
        await handleUPIPayment();
        break;
      case "qr":
        await handleQRPayment();
        break;
      default:
        await handleRazorpayPayment();
    }
  };

  const handleMockPayment = async () => {
    setIsProcessing(true);
    
    try {
      const amount = booking.total;
      
      // Use mock payment endpoint for testing with full booking data
      const response = await paymentAPI.mockPaymentSuccess({
        bookingId: booking.id,
        amount: Number(booking.total),
        bookingRequest: {
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          customerPhone: user?.phone,
          customerName: user?.name || "Customer",
          customerEmail: user?.email || "",
          startDate: booking.startDate,
          endDate: booking.endDate,
          pickupTime: booking.pickupTime,
          dropoffTime: booking.dropoffTime,
          pickupLocation: booking.pickupLocation,
          additionalDriver: booking.additionalDriver,
          insurance: booking.insurance,
          totalAmount: Number(booking.total),
          baseRate: Number(booking.baseRate),
          convenienceFee: Number(booking.convenienceFee),
          insuranceCost: Number(booking.insuranceCost),
          additionalDriverCost: Number(booking.additionalDriverCost)
        }
      });
  
      if (response.success) {
        const confirmedBooking = await createConfirmedBooking(booking, response.paymentId, response.bookingId);
        
        //Already createConfirmedBooking fn is sending notification
        // Send notifications
        // await sendAdditionalNotifications(confirmedBooking, user, vehicle);
        
        navigate("/booking-confirmation", { 
          state: { 
            vehicle, 
            booking: { 
              ...confirmedBooking, 
              status: "Confirmed",
              paymentId: response.paymentId
            }, 
            user 
          } 
        });
      } else {
        throw new Error(response.message || "Mock payment failed");
      }
      
    } catch (error) {
      console.error("Mock payment error:", error);
      alert("Mock payment failed: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Image with Light Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-slate-800 mb-2">
              Complete Your Payment
            </h1>
            <p className="text-slate-600">Secure payment for your {vehicle?.name} booking</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - Payment Methods */}
            <div>
              <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Vehicle:</span>
                    <span className="text-slate-800 font-medium">{vehicle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="text-slate-800 font-medium">{booking.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Base Rate:</span>
                    <span className="text-slate-800">₹{booking.baseRate?.toLocaleString()}</span>
                  </div>
                  {booking.insuranceCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Insurance:</span>
                      <span className="text-slate-800">+₹{booking.insuranceCost?.toLocaleString()}</span>
                    </div>
                  )}
                  {booking.additionalDriverCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Additional Driver:</span>
                      <span className="text-slate-800">+₹{booking.additionalDriverCost?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">Convenience Fee:</span>
                    <span className="text-slate-800">+₹{booking.convenienceFee?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="text-slate-800 font-semibold">Total Amount:</span>
                    <span className="text-gold-500 font-bold text-lg">₹{booking.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Payment Method</h3>
              
              {/* Payment Method Options */}
              <div className="space-y-4 mb-6">
                {/* Razorpay (All methods) */}
                <label className="flex items-center p-4 border-2 border-blue-300 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors bg-white">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-gold-500 focus:ring-gold-500"
                  />
                  <div className="ml-4">
                    <span className="text-slate-800 font-medium">Credit/Debit Card</span>
                    <p className="text-slate-600 text-sm">Pay using card, net banking, or wallet</p>
                  </div>
                </label>

                {/* UPI */}
                <label className="flex items-center p-4 border-2 border-blue-300 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors bg-white">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-gold-500 focus:ring-gold-500"
                  />
                  <div className="ml-4">
                    <span className="text-slate-800 font-medium">UPI Payment</span>
                    <p className="text-slate-600 text-sm">Pay using UPI apps</p>
                  </div>
                </label>

                {/* QR Code */}
                <label className="flex items-center p-4 border-2 border-blue-300 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors bg-white">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="qr"
                    checked={paymentMethod === "qr"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-gold-500 focus:ring-gold-500"
                  />
                  <div className="ml-4">
                    <span className="text-slate-800 font-medium">QR Code</span>
                    <p className="text-slate-600 text-sm">Scan and pay with any UPI app</p>
                  </div>
                </label>
              </div>

              {/* Development Testing Info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-yellow-700 text-sm text-center">
                    🚧 Development Mode: Payments will auto-succeed after 3 seconds
                  </p>
                </div>
              )}

              {/* Mock Payment Button for Testing */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={handleMockPayment}
                  className="w-full mt-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg"
                >
                  Test Mock Payment (Dev Only)
                </button>
              )}
            </div>

            {/* Right Side - Payment Details */}
            <div>
              {/* Payment Method Specific UI */}
              {paymentMethod === "qr" && (
                <div className="bg-white border-2 border-blue-300 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 text-center">
                    Scan QR Code to Pay
                  </h4>
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gold-300 mx-auto w-48 h-48 flex items-center justify-center mb-4">
                    <img 
                      src={upiQrCode} 
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-600 text-sm mb-2">Amount: ₹{booking.total?.toLocaleString()}</p>
                    <p className="text-slate-500 text-xs">UPI ID: allriderental@upi</p>
                    <p className="text-slate-400 text-xs mt-2">Scan with any UPI app to pay</p>
                  </div>
                  
                  {/* UPI App Logos */}
                  <div className="flex justify-center space-x-4 mt-4">
                    <img src={gpay} alt="Google Pay" className="h-8" />
                    <img src={phonepe} alt="PhonePe" className="h-8" />
                    <img src={paytm} alt="Paytm" className="h-8" />
                  </div>
                </div>
              )}

              {paymentMethod === "razorpay" && (
                <div className="bg-white border-2 border-blue-300 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">Secure Payment</h4>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-slate-600 text-sm text-center">
                      You'll be redirected to Razorpay's secure payment gateway to complete your payment
                    </p>
                  </div>
                  
                  {/* Payment Amount Display */}
                  <div className="text-center mb-6">
                    <p className="text-slate-600 text-sm">Amount to pay:</p>
                    <p className="text-gold-500 font-bold text-2xl mt-2">₹{booking.total?.toLocaleString()}</p>
                  </div>
                  
                  {/* Card Logos */}
                  <div className="flex justify-center space-x-4 mb-4">
                    <img src={visaimg} alt="Visa" className="h-8" />
                    <img src={mastercardimg} alt="Mastercard" className="h-8" />
                    <img src={rupayimg} alt="Rupay" className="h-8" />
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="bg-white border-2 border-blue-300 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">UPI Payment</h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-700 text-sm text-center">
                      You'll be redirected to your UPI app for payment confirmation
                    </p>
                  </div>
                  
                  {/* Payment Amount Display */}
                  <div className="text-center mb-6">
                    <p className="text-slate-600 text-sm">Amount to pay:</p>
                    <p className="text-gold-500 font-bold text-2xl mt-2">₹{booking.total?.toLocaleString()}</p>
                  </div>
                  
                  {/* UPI App Logos */}
                  <div className="flex justify-center space-x-4">
                    <img src={gpay} alt="Google Pay" className="h-10" />
                    <img src={phonepe} alt="PhonePe" className="h-10" />
                    <img src={paytm} alt="Paytm" className="h-10" />
                  </div>
                  
                  <div className="text-center mt-4">
                    <p className="text-slate-500 text-xs">Open any UPI app to complete payment</p>
                  </div>
                </div>
              )}

              {/* Pay Now Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || !razorpayLoaded}
                className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
                  isProcessing || !razorpayLoaded
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gold-500 hover:bg-gold-600 text-slate-900 hover:scale-105'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900 mr-3"></div>
                    Processing Payment...
                  </div>
                ) : !razorpayLoaded ? (
                  "Loading Payment System..."
                ) : (
                  `Pay ₹${booking.total?.toLocaleString()}`
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center text-green-500 text-sm mb-2">
                  <span className="mr-2">🔒</span>
                  <span>Secure SSL Encrypted Payment</span>
                </div>
                <p className="text-slate-500 text-xs">
                  Powered by Razorpay • PCI DSS Certified
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mt-6 bg-blue-50 hover:bg-blue-100 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors border border-blue-300"
          >
            ← Back to Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayPage;