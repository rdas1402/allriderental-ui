// Mock database (in real app, this would be your backend database)
const mockUsers = [
  {
    id: 1,
    phone: "9876543210",
    name: "John Doe",
    email: "john.doe@example.com",
    dob: "1990-01-15",
    joinDate: "2024-01-01",
    bookings: [
      {
        id: 1,
        vehicle: "Royal Enfield Classic 350",
        date: "2024-01-15",
        duration: "3 days",
        total: "₹4,500",
        status: "Completed"
      }
    ]
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthAPI = {
  sendOtp: async (phoneNumber) => {
    await delay(1000);
    return { success: true, message: "OTP sent successfully" };
  },

  verifyOtp: async (phoneNumber, otp) => {
    await delay(1000);
    if (otp === "123456") {
      return { success: true, message: "OTP verified successfully" };
    } else {
      throw new Error("Invalid OTP");
    }
  },

  checkUserExists: async (phoneNumber) => {
    await delay(500);
    const user = mockUsers.find(user => user.phone === phoneNumber);
    return { 
      exists: !!user,
      user: user || null
    };
  },

  getUserProfile: async (phoneNumber) => {
    await delay(500);
    const user = mockUsers.find(user => user.phone === phoneNumber);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  createUser: async (userData) => {
    await delay(1000);
    const newUser = {
      id: mockUsers.length + 1,
      phone: userData.phone,
      name: userData.name,
      email: userData.email,
      dob: userData.dob,
      joinDate: new Date().toISOString().split('T')[0],
      bookings: []
    };
    mockUsers.push(newUser);
    return newUser;
  },

  getUserBookings: async (phoneNumber) => {
    await delay(500);
    const user = mockUsers.find(user => user.phone === phoneNumber);
    return user ? user.bookings : [];
  }
};