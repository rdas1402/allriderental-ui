import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import allRideRentalImage from "../assets/AllRideRental.jpg";

const AboutPage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [navigate]);


  return (
    <div className="relative min-h-screen">
      {/* Background Image with Lighter Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Right Background Image - Inverted */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url(${allRideRentalImage})`,
            backgroundPosition: "right center",
            filter: "invert(100%)"
          }}
        ></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-light text-slate-800 mb-6">
            About <span className="font-semibold text-gold-500">All Ride Rental</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Redefining luxury mobility with our premium fleet and unparalleled service experience
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Our Story Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Our Story</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
              <p>
                Founded with a vision to transform the vehicle rental industry, All Ride Rental 
                has been setting new standards in luxury mobility since our inception.
              </p>
              <p>
                We believe every journey should be an experience worth remembering. From business 
                travel to weekend getaways, we provide the perfect vehicle for every occasion.
              </p>
              <p>
                Our commitment to excellence has made us the preferred choice for discerning 
                customers who appreciate quality, reliability, and sophistication.
              </p>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Why Choose Us?</h2>
            <div className="space-y-6">
              {[
                { icon: "🕒", title: "24/7 Premium Support", desc: "Round-the-clock concierge service for all your needs" },
                { icon: "🚗", title: "Impeccable Fleet", desc: "Regularly maintained luxury vehicles with latest features" },
                { icon: "💰", title: "Transparent Pricing", desc: "No hidden charges with all-inclusive rental packages" },
                { icon: "⭐", title: "Five-Star Service", desc: "Dedicated relationship managers for personalized experience" }
              ].map((item, index) => (
                <div key={index} className="flex items-start group">
                  <div className="bg-gold-100 p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl text-gold-500">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-1">{item.title}</h3>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-12 border border-blue-200 shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-12">Our Journey in Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "2018", label: "Year Established" },
              { number: "500+", label: "Premium Vehicles" },
              { number: "50+", label: "Cities Served" },
              { number: "25K+", label: "Happy Customers" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl font-bold text-gold-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-slate-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;