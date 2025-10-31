import React from "react";

const CancellationPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Cancellation Policy</h1>
        <div className="prose prose-lg text-gray-600">
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Cancellation Timeframes</h2>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>24+ hours before:</strong> Full refund</li>
            <li><strong>6-24 hours before:</strong> 50% refund</li>
            <li><strong>Less than 6 hours:</strong> No refund</li>
          </ul>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Refund Process</h2>
          <p>Refunds will be processed within 5-7 business days to the original payment method used during booking.</p>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;