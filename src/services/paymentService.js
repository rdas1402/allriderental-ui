// src/services/paymentService.js
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;

export class PaymentService {
  static async initializeRazorpay() {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log("Razorpay SDK loaded successfully");
        resolve(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  static async createRazorpayOrder(amount, bookingId) {
    try {
      const response = await fetch("http://localhost:8080/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: "INR",
          receipt: `receipt_${bookingId}`,
          bookingId: bookingId,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to create order");
      }
      
      return data.orderId;
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      throw new Error(`Payment initialization failed: ${error.message}`);
    }
  }

  static async processRazorpayPayment(orderDetails, bookingData, onSuccess, onError) {
    try {
      const options = {
        key: RAZORPAY_KEY,
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        name: "All Ride Rental",
        description: `Booking for ${bookingData.vehicleName}`,
        order_id: orderDetails.orderId,
        handler: async function (response) {
          try {
            console.log("Payment successful:", response);
            
            // Verify payment with backend
            const verificationResponse = await fetch("http://localhost:8080/api/payment/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bookingData.bookingId,
              }),
            });

            const verificationData = await verificationResponse.json();
            
            if (verificationData.success) {
              onSuccess({
                success: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                bookingId: bookingData.bookingId,
              });
            } else {
              throw new Error(verificationData.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            onError(error.message || "Payment verification failed");
          }
        },
        prefill: {
          name: bookingData.customerName,
          email: bookingData.customerEmail,
          contact: bookingData.customerPhone,
        },
        notes: {
          bookingId: bookingData.bookingId,
          vehicle: bookingData.vehicleName,
        },
        theme: {
          color: "#F59E0B",
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed");
            onError("Payment cancelled by user");
          }
        }
      };

      // Initialize Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error("Error processing payment:", error);
      onError(error.message || "Payment processing failed");
    }
  }

  // Alternative simple payment method for testing
  static async processSimplePayment(amount, bookingData, onSuccess, onError) {
    try {
      // Simulate payment processing
      console.log("Processing payment for:", bookingData);
      
      setTimeout(() => {
        // Simulate successful payment 80% of the time
        if (Math.random() > 0.2) {
          onSuccess({
            success: true,
            paymentId: `pay_${Date.now()}`,
            orderId: `order_${Date.now()}`,
            bookingId: bookingData.bookingId,
          });
        } else {
          onError("Payment failed - please try again");
        }
      }, 2000);
      
    } catch (error) {
      console.error("Error in simple payment:", error);
      onError(error.message);
    }
  }
}

// Fallback for development without actual payment
export const MockPaymentService = {
  async processPayment(amount, bookingData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate for testing
          resolve({
            success: true,
            paymentId: `mock_pay_${Date.now()}`,
            orderId: `mock_order_${Date.now()}`,
            bookingId: bookingData.bookingId,
            message: "Mock payment successful - This is for development only"
          });
        } else {
          reject(new Error("Mock payment failed - Please try again"));
        }
      }, 1500);
    });
  }
};