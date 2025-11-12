// components/PrivacyPolicy.js
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Image with Light Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-blue-200">
          <h1 className="text-3xl font-light text-slate-800 mb-2">
            <span className="font-semibold text-gold-500">Privacy</span> Policy
          </h1>
          <div className="prose prose-lg text-slate-600">
            <p className="mb-4">
              At All Ride Rental, we are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
            <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Personal identification information</li>
              <li>Vehicle rental preferences</li>
              <li>Payment information</li>
              <li>Location data</li>
            </ul>
            <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">How We Use Your Information</h2>
            <p>We use your information to provide and improve our services, process payments, and communicate with you about your rentals.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;