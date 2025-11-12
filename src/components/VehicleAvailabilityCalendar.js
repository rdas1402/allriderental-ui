// components/VehicleAvailabilityCalendar.js
import React, { useState, useEffect } from "react";
import { bookingsAPI } from "../services/apiService";

const VehicleAvailabilityCalendar = ({ vehicleId, vehicleName }) => {
  const [availabilityData, setAvailabilityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    loadAvailabilityData();
  }, [vehicleId, selectedMonth]);

  const loadAvailabilityData = async () => {
    if (!vehicleId) return;
    
    try {
      setLoading(true);
      const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
      const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
      
      const response = await bookingsAPI.getVehicleBookingAndAvailability(vehicleId);
      
      if (response && response.success) {
        setAvailabilityData(response.data);
      }
    } catch (error) {
      console.error("Error loading availability data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDateStatus = (date) => {
    if (!availabilityData) return 'unknown';
    
    const dateStr = date.toISOString().split('T')[0];
    
    // Check unavailable dates
    if (availabilityData.unavailableDates && 
        availabilityData.unavailableDates.includes(dateStr)) {
      return 'unavailable';
    }
    
    // Check bookings
    if (availabilityData.bookings && availabilityData.bookings.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return date >= bookingStart && date <= bookingEnd && booking.status !== 'cancelled';
    })) {
      return 'booked';
    }
    
    return 'available';
  };

  const renderCalendar = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const status = getDateStatus(date);
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push(
        <div
          key={i}
          className={`p-2 text-center rounded-lg border text-sm ${
            status === 'available' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : status === 'booked'
                ? 'bg-red-50 border-red-200 text-red-700'
                : status === 'unavailable'
                  ? 'bg-orange-50 border-orange-200 text-orange-700'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
          } ${isToday ? 'ring-2 ring-gold-500' : ''}`}
          title={`${date.toLocaleDateString()} - ${status.charAt(0).toUpperCase() + status.slice(1)}`}
        >
          {i}
        </div>
      );
    }
    
    return days;
  };

  if (loading) {
    return (
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 border border-blue-200 shadow-lg">
      <h4 className="text-slate-800 font-semibold mb-4">
        Availability Calendar - {vehicleName}
      </h4>
      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-slate-600 text-sm font-medium p-2">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
      
      <div className="flex items-center justify-center space-x-4 text-xs text-slate-600">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-50 border border-green-200 rounded mr-1"></div>
          Available
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-50 border border-red-200 rounded mr-1"></div>
          Booked
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-50 border border-orange-200 rounded mr-1"></div>
          Unavailable
        </div>
      </div>
    </div>
  );
};

export default VehicleAvailabilityCalendar;