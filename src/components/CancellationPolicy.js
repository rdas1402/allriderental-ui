// components/CancellationPolicy.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CancellationPolicy = () => {

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [navigate]);

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
          <h1 className="text-2xl font-light text-slate-800 mb-2">
            <span className="font-semibold text-gold-500">Cancellation</span> Policy
          </h1>
          <div className="prose prose-sm text-slate-600">
            <h2 className="text-lg font-semibold text-slate-800 mt-6 mb-3">Cancellation Timeframes</h2>
            <ul className="list-disc list-inside space-y-2 mb-4 text-sm">
              <li><strong>24+ hours before:</strong> Full refund</li>
              <li><strong>6-24 hours before:</strong> 50% refund</li>
              <li><strong>Less than 6 hours:</strong> No refund</li>
            </ul>
            <h2 className="text-lg font-semibold text-slate-800 mt-6 mb-3">Refund Process</h2>
            <p className="text-sm">Refunds will be processed within 5-7 business days to the original payment method used during booking.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;