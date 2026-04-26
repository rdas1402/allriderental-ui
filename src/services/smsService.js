// services/smsService.js
import { notificationAPI } from './apiService';

export class SMSService {
  static async sendBookingConfirmationSMS(phoneNumber, bookingData, userData, vehicleData) {
    try {
      const response = await notificationAPI.sendBookingConfirmation({
        booking: bookingData,
        user: userData,
        vehicle: vehicleData
      });

      console.log('SMS confirmation sent:', response);
      return response;
    } catch (error) {
      console.error('Error sending SMS confirmation:', error);
      throw error;
    }
  }

  static async sendAdminSMSNotification(bookingData, userData, vehicleData) {
    try {
      const response = await notificationAPI.sendAdminNotification({
        booking: bookingData,
        user: userData,
        vehicle: vehicleData
      });

      console.log('Admin SMS notification sent:', response);
      return response;
    } catch (error) {
      console.error('Error sending admin SMS:', error);
      return { success: false, message: 'Admin SMS failed' };
    }
  }

  static async testSMS(phoneNumber, testData = {}) {
    try {
      const response = await notificationAPI.testSMS(phoneNumber, testData);
      console.log('Test SMS result:', response);
      return response;
    } catch (error) {
      console.error('Error sending test SMS:', error);
      throw error;
    }
  }
}