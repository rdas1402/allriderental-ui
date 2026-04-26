import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import allRideRentalImage from "../assets/AllRideRental.jpg";

const CareerPage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [navigate]);

  const jobOpenings = [
    {
      id: 1,
      title: "Luxury Vehicle Concierge",
      department: "Customer Experience",
      location: "Bangalore",
      type: "Full-time",
      experience: "3-5 years",
      description: "Provide premium concierge service to our luxury vehicle clients"
    },
    {
      id: 2,
      title: "Fleet Operations Manager",
      department: "Operations",
      location: "Delhi",
      type: "Full-time",
      experience: "5-8 years",
      description: "Manage and maintain our premium vehicle fleet"
    },
    {
      id: 3,
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Mumbai",
      type: "Full-time",
      experience: "2-4 years",
      description: "Drive our luxury brand presence across digital channels"
    }
  ];

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
            Join Our <span className="font-semibold text-gold-500">Elite Team</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Build your career with the leading luxury vehicle rental service
          </p>
        </div>

        {/* Why Work With Us */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-12 border border-blue-200 shadow-lg mb-16">
          <h2 className="text-2xl font-semibold text-slate-800 mb-8 text-center">Why Build Your Career With Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "💼", title: "Career Growth", desc: "Clear progression paths in luxury mobility" },
              { icon: "⚡", title: "Innovation", desc: "Work with cutting-edge vehicle technology" },
              { icon: "🤝", title: "Elite Team", desc: "Collaborate with industry professionals" },
              { icon: "🎯", title: "Impact", desc: "Shape the future of premium travel" },
              { icon: "💰", title: "Competitive Packages", desc: "Attractive compensation and benefits" },
              { icon: "🌍", title: "Global Standards", desc: "International quality service delivery" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-gold-500">{item.icon}</span>
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Openings */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-800 mb-8">Current Opportunities</h2>
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-white rounded-xl p-6 border border-blue-200 hover:border-gold-400 transition-all duration-300 group shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-gold-500 transition-colors text-sm">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-600 mb-3">
                      <span>🏢 {job.department}</span>
                      <span>📍 {job.location}</span>
                      <span>⏰ {job.type}</span>
                      <span>🎓 {job.experience}</span>
                    </div>
                    <p className="text-slate-600 text-sm">{job.description}</p>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <button className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg w-full lg:w-auto text-sm">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPage;