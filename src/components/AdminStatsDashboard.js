// components/AdminStatsDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../services/apiService";

const AdminStatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getAdminStats();
      if (response && response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error loading admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    const basename = process.env.REACT_APP_BASENAME || '';
    navigate(`${path}`);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-slate-600">Unable to load statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Dashboard Overview</h3>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Bookings" 
          value={stats.totalBookings} 
          color="blue" 
          icon="📊"
        />
        <StatCard 
          title="Upcoming" 
          value={stats.upcomingBookings} 
          color="green" 
          icon="📅"
        />
        <StatCard 
          title="Completed" 
          value={stats.completedBookings} 
          color="green" 
          icon="✅"
        />
        <StatCard 
          title="Cancelled" 
          value={stats.cancelledBookings} 
          color="red" 
          icon="❌"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} 
          color="gold" 
          icon="💰"
        />
        <StatCard 
          title="Total Vehicles" 
          value={stats.totalVehicles} 
          color="blue" 
          icon="🚗"
        />
        <StatCard 
          title="Available Vehicles" 
          value={stats.availableVehicles} 
          color="green" 
          icon="✅"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard 
          title="Maintenance" 
          value={stats.maintenanceVehicles} 
          color="yellow" 
          icon="🔧"
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          color="purple" 
          icon="👥"
        />
        <StatCard 
          title="Active Users" 
          value={stats.activeUsers} 
          color="green" 
          icon="👤"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h4 className="text-slate-800 font-semibold mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => handleNavigation('/rent')}
            className="bg-gold-500 hover:bg-gold-600 text-slate-900 py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            View All Vehicles
          </button>
          <button 
            onClick={() => handleNavigation('/booking')}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Create Test Booking
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, icon }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    gold: 'bg-gold-50 border-gold-200 text-gold-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700'
  };

  return (
    <div className={`rounded-xl p-4 border ${colorClasses[color]} shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm opacity-80">{title}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
};

export default AdminStatsDashboard;