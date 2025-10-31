import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import VehicleCard from "./components/VehicleCard";
import VehicleList from "./components/VehicleList";
import Footer from "./components/Footer";

import car1 from "./assets/car1.jpg";
import car2 from "./assets/car2.jpg";
import bike1 from "./assets/bike1.jpg";
import bike2 from "./assets/bike2.jpg";

function HomePage() {
  const vehicles = [
    { image: car1, name: "Hyundai i20", price: 1200, type: "Car" },
    { image: car2, name: "Maruti Swift", price: 1000, type: "Car" },
    { image: bike1, name: "Royal Enfield Classic 350", price: 700, type: "Bike" },
    { image: bike2, name: "Yamaha R15", price: 800, type: "Bike" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen font-sans scroll-smooth">
      <Navbar />
      <Hero />

      {/* Vehicles Section */}
      <section id="home" className="px-8 py-10 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-500">
          Available Rides
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((v, i) => (
            <VehicleCard key={i} {...v} />
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 bg-black text-white text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">About Us</h2>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed">
          At <span className="text-yellow-400 font-semibold">All Ride Rental</span>,
          we make your travel easy, comfortable, and affordable. Whether you want a
          luxurious car for a family trip or a stylish bike for your solo adventure,
          we’ve got you covered. Our mission is to make renting vehicles as simple
          as booking a movie ticket.
        </p>
      </section>

      {/* Blogs Section */}
      <section id="blogs" className="py-16 bg-gray-200 text-center">
        <h2 className="text-3xl font-bold text-yellow-500 mb-4">Latest Blogs</h2>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6 text-left">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-2">🚗 Top 5 Cars for Road Trips</h3>
            <p>
              Planning a long trip? Check out our list of most comfortable and
              reliable cars perfect for your next adventure.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-2">🏍️ Why Renting Bikes is the New Trend</h3>
            <p>
              Discover why millennials are preferring bike rentals for weekend getaways
              and city commuting over buying vehicles.
            </p>
          </div>
        </div>
      </section>

      {/* Career Section */}
      <section id="career" className="py-16 bg-black text-white text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">Career Opportunities</h2>
        <p className="max-w-2xl mx-auto text-lg leading-relaxed mb-6">
          Join a passionate team that is redefining how India rides. We’re hiring for
          software engineers, customer support, and marketing specialists.
        </p>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold transition">
          View Openings
        </button>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold text-yellow-500 mb-4">Contact Us</h2>
        <p className="max-w-2xl mx-auto mb-6 text-lg">
          Have questions or need assistance? Our team is here to help you 24/7.
        </p>
        <form className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Your Name"
            className="border border-gray-300 rounded-md px-4 py-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border border-gray-300 rounded-md px-4 py-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <textarea
            placeholder="Your Message"
            className="border border-gray-300 rounded-md px-4 py-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            rows="4"
          ></textarea>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-md font-semibold transition w-full">
            Send Message
          </button>
        </form>
      </section>

      {/* Buy Section */}
      <section id="buy" className="py-16 bg-black text-white text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">Buy Your Ride</h2>
        <p className="max-w-2xl mx-auto text-lg mb-6">
          Want to own a car or bike? We provide pre-owned vehicles in great condition
          at affordable prices.
        </p>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold transition">
          Browse Vehicles
        </button>
      </section>

      {/* Partner Section */}
      <section id="partner" className="py-16 bg-gray-200 text-center">
        <h2 className="text-3xl font-bold text-yellow-500 mb-4">Partner with Us</h2>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed mb-6">
          Have vehicles to rent out? Partner with us and earn steady income with
          guaranteed bookings and full vehicle management support.
        </p>
        <button className="bg-black hover:bg-yellow-500 hover:text-black text-white px-6 py-2 rounded-full font-semibold transition">
          Become a Partner
        </button>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<VehicleList />} />
      </Routes>
    </Router>
  );
}

export default App;
