import React from "react";

const PartnerPage = () => {
  const partnershipTypes = [
    {
      title: "Luxury Vehicle Owners",
      description: "List your premium vehicle and earn exceptional returns",
      benefits: [
        "Guaranteed premium earnings",
        "Comprehensive insurance coverage",
        "Regular maintenance & detailing",
        "24/7 roadside assistance"
      ],
      icon: "🚗"
    },
    {
      title: "Fleet Partners",
      description: "Partner with your luxury vehicle fleet",
      benefits: [
        "Bulk listing advantages",
        "Dedicated account management",
        "Advanced analytics dashboard",
        "Priority customer allocation"
      ],
      icon: "🏢"
    },
    {
      title: "Corporate Alliances",
      description: "Collaborate for executive travel solutions",
      benefits: [
        "Customized corporate plans",
        "Dedicated business portal",
        "Monthly consolidated billing",
        "Priority vehicle access"
      ],
      icon: "💼"
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.9)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-white mb-6">
            Premium <span className="font-semibold text-gold-400">Partnerships</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Join our exclusive network of luxury mobility partners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {partnershipTypes.map((type, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl hover:shadow-2xl transition-all duration-500 hover:translate-y-[-8px] group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{type.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gold-300 transition-colors">{type.title}</h3>
              <p className="text-white/70 mb-6">{type.description}</p>
              <ul className="space-y-3 mb-8">
                {type.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center text-white/80">
                    <span className="text-gold-400 mr-3 text-lg">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-gold-500 hover:bg-gold-600 text-slate-900 py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                Learn More
              </button>
            </div>
          ))}
        </div>

        {/* Partnership Stats */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-2xl text-center mb-16">
          <h2 className="text-3xl font-semibold text-white mb-12">Partnership Excellence</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "1,200+", label: "Elite Partners" },
              { number: "₹15Cr+", label: "Annual Payouts" },
              { number: "4.9/5", label: "Partner Rating" },
              { number: "98%", label: "Retention Rate" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl font-bold text-gold-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 backdrop-blur-lg rounded-2xl p-12 border border-gold-400/30 shadow-2xl text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">Ready to Join Our Elite Network?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Become part of India's most prestigious luxury vehicle rental partnership program
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
              Become a Partner
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 border border-white/30 backdrop-blur-sm">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerPage;