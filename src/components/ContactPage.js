import React from "react";

const ContactPage = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Lighter Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4)), url('https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-slate-800 mb-6">
            Contact <span className="font-semibold text-gold-500">Us</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Get in touch with our premium concierge team for personalized assistance
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              {[
                { icon: "📞", title: "Phone", details: "+1 (555) 123-4567", desc: "24/7 Customer Support" },
                { icon: "✉️", title: "Email", details: "concierge@allriderental.com", desc: "Quick Response Guaranteed" },
                { icon: "🏢", title: "Headquarters", details: "123 Luxury Lane, Premium District", desc: "Bangalore, India - 560001" },
                { icon: "🕒", title: "Business Hours", details: "24/7 Operations", desc: "Always at your service" }
              ].map((item, index) => (
                <div key={index} className="flex items-start group">
                  <div className="bg-gold-100 p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl text-gold-500">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">{item.title}</h3>
                    <p className="text-gold-500 font-medium">{item.details}</p>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="w-full p-4 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-slate-800 placeholder-slate-500"
                />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  className="w-full p-4 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-slate-800 placeholder-slate-500"
                />
              </div>
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full p-4 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-slate-800 placeholder-slate-500"
              />
              <input 
                type="text" 
                placeholder="Subject" 
                className="w-full p-4 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-slate-800 placeholder-slate-500"
              />
              <textarea 
                placeholder="Your Message" 
                rows="5"
                className="w-full p-4 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-slate-800 placeholder-slate-500"
              ></textarea>
              <button 
                type="submit" 
                className="w-full bg-gold-500 hover:bg-gold-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;