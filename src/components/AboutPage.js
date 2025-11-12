import React from "react";

const AboutPage = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Lighter Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4)), url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-slate-800 mb-6">
            About <span className="font-semibold text-gold-500">All Ride Rental</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Redefining luxury mobility with our premium fleet and unparalleled service experience
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Our Story Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 shadow-lg">
            <h2 className="text-3xl font-semibold text-slate-800 mb-6">Our Story</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
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
            <h2 className="text-3xl font-semibold text-slate-800 mb-6">Why Choose Us?</h2>
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
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-12 border border-blue-200 shadow-lg text-center">
          <h2 className="text-3xl font-semibold text-slate-800 mb-12">Our Journey in Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "2018", label: "Year Established" },
              { number: "500+", label: "Premium Vehicles" },
              { number: "50+", label: "Cities Served" },
              { number: "25K+", label: "Happy Customers" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl font-bold text-gold-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;