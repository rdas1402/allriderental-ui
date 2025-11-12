// components/Navbar.js
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home");

  const menuItems = [
    { name: "Home", id: "home" },
    { name: "About Us", id: "about" },
    { name: "Blogs", id: "blogs" },
    { name: "Career", id: "career" },
    { name: "Contact Us", id: "contact" },
    { name: "Buy", id: "buy" },
    { name: "Partner with us", id: "partner" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-blue-200">
            <h2 className="text-3xl font-light text-slate-800 mb-2">
              Welcome to <span className="font-semibold text-gold-500">All Ride Rental</span>
            </h2>
            <p className="text-slate-600 text-lg mb-4">
              Your one-stop solution for all vehicle rental needs. Find the perfect car or bike for your journey.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">🚗 Rent Cars</h3>
                <p className="text-blue-700">Wide range of cars available for daily and weekly rentals.</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-3">🏍️ Rent Bikes</h3>
                <p className="text-green-700">Premium bikes for your adventurous rides across the city.</p>
              </div>
            </div>
          </div>
        );
      
      case "about":
        return (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-blue-200">
            <h2 className="text-3xl font-light text-slate-800 mb-2">
              About <span className="font-semibold text-gold-500">All Ride Rental</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Our Story</h3>
                <p className="text-slate-600 mb-4">
                  Founded in 2020, All Ride Rental has been providing reliable and affordable vehicle rental services 
                  to thousands of satisfied customers across the country.
                </p>
                <p className="text-slate-600">
                  We believe in making transportation accessible and convenient for everyone.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Why Choose Us?</h3>
                <ul className="text-slate-600 space-y-2">
                  <li>✅ 24/7 Customer Support</li>
                  <li>✅ Well-maintained Vehicles</li>
                  <li>✅ Competitive Pricing</li>
                  <li>✅ Easy Booking Process</li>
                  <li>✅ Multiple Pickup Locations</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case "blogs":
        return (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-blue-200">
            <h2 className="text-3xl font-light text-slate-800 mb-2">
              Latest <span className="font-semibold text-gold-500">Blogs</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
                  <div className="w-full h-40 bg-blue-100 rounded-lg mb-4"></div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Blog Title {item}</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Short description of the blog post content goes here...
                  </p>
                  <button className="text-gold-500 font-semibold text-sm hover:text-gold-600 transition-colors">
                    Read More →
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "career":
        return (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-blue-200">
            <h2 className="text-3xl font-light text-slate-800 mb-2">
              Join Our <span className="font-semibold text-gold-500">Team</span>
            </h2>
            <div className="bg-gold-50 border border-gold-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-gold-800 mb-3">Current Openings</h3>
              <div className="space-y-4">
                {['Frontend Developer', 'Backend Developer', 'Customer Support', 'Sales Executive'].map((job) => (
                  <div key={job} className="flex justify-between items-center p-4 bg-white rounded-lg border border-blue-200">
                    <div>
                      <h4 className="font-semibold text-slate-800">{job}</h4>
                      <p className="text-slate-600 text-sm">Full-time • Bangalore</p>
                    </div>
                    <button className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-4 py-2 rounded-lg font-semibold transition-colors">
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case "contact":
        return (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-blue-200">
            <h2 className="text-3xl font-light text-slate-800 mb-2">
              Contact <span className="font-semibold text-gold-500">Us</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-700">📞 Phone</h4>
                    <p className="text-slate-600">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700">✉️ Email</h4>
                    <p className="text-slate-600">info@allriderental.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700">🏢 Address</h4>
                    <p className="text-slate-600">123 Rental Street, Bangalore, India - 560001</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Send us a Message</h3>
                <form className="space-y-4">
                  <input type="text" placeholder="Your Name" className="w-full p-3 border border-blue-300 rounded-lg bg-white" />
                  <input type="email" placeholder="Your Email" className="w-full p-3 border border-blue-300 rounded-lg bg-white" />
                  <textarea placeholder="Your Message" rows="4" className="w-full p-3 border border-blue-300 rounded-lg bg-white"></textarea>
                  <button type="submit" className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      
      case "buy":
        return (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-blue-200">
            <h2 className="text-3xl font-light text-slate-800 mb-2">
              Buy <span className="font-semibold text-gold-500">Vehicles</span>
            </h2>
            <p className="text-slate-600 text-lg mb-6">
              Looking to purchase a vehicle? Check out our premium selection of cars and bikes available for sale.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h3 className="text-xl font-semibold text-red-800 mb-3">🚗 Used Cars</h3>
                <p className="text-red-700 mb-4">Well-maintained pre-owned cars with complete service history.</p>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  Browse Cars
                </button>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">🏍️ Used Bikes</h3>
                <p className="text-purple-700 mb-4">Quality pre-owned bikes for your daily commute or adventure.</p>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  Browse Bikes
                </button>
              </div>
            </div>
          </div>
        );
      
      case "partner":
        return (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-blue-200">
            <h2 className="text-3xl font-light text-slate-800 mb-2">
              Partner <span className="font-semibold text-gold-500">With Us</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Vehicle Owners</h3>
                <p className="text-slate-600 mb-4">
                  Earn extra income by listing your vehicle with us. We handle everything from bookings to maintenance.
                </p>
                <ul className="text-slate-600 space-y-2 mb-6">
                  <li>✅ Guaranteed monthly earnings</li>
                  <li>✅ Comprehensive insurance coverage</li>
                  <li>✅ Regular maintenance support</li>
                  <li>✅ 24/7 roadside assistance</li>
                </ul>
                <button className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                  List Your Vehicle
                </button>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Business Partnerships</h3>
                <p className="text-slate-600 mb-4">
                  Collaborate with us for corporate rentals, fleet management, or other business opportunities.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Contact our Partnership Team</h4>
                  <p className="text-blue-700 text-sm">Email: partnerships@allriderental.com</p>
                  <p className="text-blue-700 text-sm">Phone: +1 (555) 987-6543</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-blue-200">
            <h2 className="text-3xl font-light text-slate-800 mb-2">
              Welcome to <span className="font-semibold text-gold-500">All Ride Rental</span>
            </h2>
            <p className="text-slate-600 mt-4">Select a section from the navigation menu to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Background Image with Light Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10">
        {/* Navigation Header - Fixed at top */}
        <nav className="bg-white/95 backdrop-blur-lg text-slate-800 flex justify-between items-center px-10 py-4 shadow-lg sticky top-0 z-50 border-b border-gold-400/20">
          {/* Left Section - Logo + App Name */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveSection("home")}
          >
            <img
              src={logo}
              alt="All Ride Rental"
              className="w-14 h-14 rounded-full border-2 border-gold-400 shadow-gold-400/30 group-hover:scale-110 transition-transform duration-300"
            />
            <h1 className="text-2xl font-light">
              <span className="font-semibold text-gold-500">All Ride</span> Rental
            </h1>
          </div>

          {/* Right Section - Menu */}
          <ul className="flex space-x-8 text-md font-semibold">
            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`relative cursor-pointer transition-all duration-300 hover:text-gold-500 ${
                  activeSection === item.id ? "text-gold-500" : "text-slate-700"
                }`}
              >
                {item.name}
                {activeSection === item.id && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gold-500 rounded-full animate-pulse"></span>
                )}
              </li>
            ))}
            <li className="flex items-center cursor-pointer hover:text-gold-500 transition-all duration-300">
              <FaUserCircle
                size={22}
                className="mr-1 hover:scale-110 transition-transform duration-300"
              />
              My Profile
            </li>
          </ul>
        </nav>

        {/* Main Content Area - Changes based on navigation */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Navbar;