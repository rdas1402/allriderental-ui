import React from "react";

const CareerPage = () => {
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
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.9)), url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-white mb-6">
            Join Our <span className="font-semibold text-gold-400">Elite Team</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Build your career with the leading luxury vehicle rental service
          </p>
        </div>

        {/* Why Work With Us */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-2xl mb-16">
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">Why Build Your Career With Us?</h2>
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
                <div className="bg-gold-400/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-gold-300">{item.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Openings */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-8">Current Opportunities</h2>
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-gold-400/30 transition-all duration-300 group">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gold-300 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-3">
                      <span>🏢 {job.department}</span>
                      <span>📍 {job.location}</span>
                      <span>⏰ {job.type}</span>
                      <span>🎓 {job.experience}</span>
                    </div>
                    <p className="text-white/70">{job.description}</p>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <button className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg w-full lg:w-auto">
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