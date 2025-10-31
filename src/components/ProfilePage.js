import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/apiService"; // Import your API service

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadUserData = () => {
      const user = localStorage.getItem("userData");
      const bookings = localStorage.getItem("userBookings");
      
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        setFormData(parsedUser);
        
        if (bookings) {
          setUserBookings(JSON.parse(bookings));
        }
      } else {
        navigate("/login");
      }
      setIsLoading(false);
    };

    loadUserData();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setMessage("");
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setMessage("");

      // Call the real API to update user profile
      const response = await authAPI.updateUser({
        phone: userData.phone,
        name: formData.name,
        email: formData.email,
        dob: formData.dob
      });

      // Update local storage with new data
      const updatedUser = { ...userData, ...formData };
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      setUserData(updatedUser);
      
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
      </div>
    );
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <h1 className="text-3xl font-light text-white mb-8 text-center">
            My <span className="font-semibold text-gold-400">Profile</span>
          </h1>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-center ${
              message.includes("success") 
                ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-gold-400"
                />
              ) : (
                <div className="px-4 py-3 bg-white/5 rounded-xl text-white">
                  {userData.name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Phone Number
              </label>
              <div className="px-4 py-3 bg-white/5 rounded-xl text-white/70">
                +91 {userData.phone}
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-gold-400"
                />
              ) : (
                <div className="px-4 py-3 bg-white/5 rounded-xl text-white">
                  {userData.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-gold-400"
                />
              ) : (
                <div className="px-4 py-3 bg-white/5 rounded-xl text-white">
                  {userData.dob}
                </div>
              )}
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Member Since
              </label>
              <div className="px-4 py-3 bg-white/5 rounded-xl text-white">
                {userData.joinDate}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-light text-white mb-6 text-center">
            My <span className="font-semibold text-gold-400">Bookings</span>
          </h2>

          {userBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBookings.map((booking) => (
                <div key={booking.id} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-gold-400/50 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-white mb-2">{booking.vehicle}</h3>
                  <div className="space-y-2 text-white/80">
                    <p>Date: {booking.date}</p>
                    <p>Duration: {booking.duration}</p>
                    <p className="text-gold-400 font-semibold">Total: {booking.total}</p>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm ${
                      booking.status === 'Completed' 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {booking.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/70 text-lg mb-4">No bookings found</p>
              <button
                onClick={() => navigate("/rent")}
                className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Rent a Vehicle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;