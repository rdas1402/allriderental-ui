// services/emailService.js
import { notificationAPI } from './apiService';

export class EmailService {
  static async sendBookingConfirmation(bookingData, userData, vehicleData) {
    try {
      const response = await notificationAPI.sendBookingConfirmation({
        booking: bookingData,
        user: userData,
        vehicle: vehicleData
      });

      console.log('Confirmation email sent:', response);
      return response;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }
  }

  static async sendAdminNotification(bookingData, userData, vehicleData) {
    try {
      const response = await notificationAPI.sendAdminNotification({
        booking: bookingData,
        user: userData,
        vehicle: vehicleData
      });

      console.log('Admin notification sent:', response);
      return response;
    } catch (error) {
      console.error('Error sending admin notification:', error);
      return { success: false, message: 'Admin notification failed' };
    }
  }

  static async testEmail(email, testData = {}) {
    try {
      const response = await notificationAPI.testEmail(email, testData);
      console.log('Test email result:', response);
      return response;
    } catch (error) {
      console.error('Error sending test email:', error);
      throw error;
    }
  }
}